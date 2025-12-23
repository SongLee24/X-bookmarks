import { Storage } from './storage.js';
import { Utils } from './utils.js';
import { Modal, Pagination, PasswordModal } from './ui_components.js';
import { TweetManager } from './tweet_manager.js';

const ITEMS_PER_PAGE = 9;

const App = {
    state: {
        currentPage: 1,
        items: []
    },

    async init() {

        lucide.createIcons();
        

        this.state.items = await Storage.getAll();
        

        this.setupEventListeners();
        Modal.init();
        Pagination.init(
            'prev-page', 
            'next-page', 
            'page-indicator', 
            (dir) => this.changePage(dir)
        );
        PasswordModal.init();


        this.render();
    },

    setupEventListeners() {
        document.getElementById('add-btn').addEventListener('click', () => {
            Modal.open();
        });

        document.getElementById('add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddSubmit();
        });
    },

    // 统一的身份验证检查函数
    async getAuthPassword() {
        // 1. 首先尝试从会话存储中获取
        let savedPassword = sessionStorage.getItem('admin_pwd');
        if (savedPassword) {
            return savedPassword;
        }

        // 2. 如果没有，则弹出密码框
        const password = await PasswordModal.verify();
        if (!password) return null;

        // 3. 验证成功后（在 add/remove 成功反馈后）我们会存入，
        // 这里先返回给操作函数使用
        return password;
    },

    async handleAddSubmit() {
        const url = Modal.getValue();
        const id = Utils.extractTweetId(url);

        if (!id) {
            Modal.showError('Invalid X/Twitter URL');
            return;
        }

        // 弹出密码框获取密码
        const password = await this.getAuthPassword();
        if (!password) return;

        const result = await Storage.add(url, id, password);

        if (result.error === 'auth') {
            sessionStorage.removeItem('admin_pwd');
            alert('密码错误，操作未授权');
            return;
        }

        if (!result.success) {
            Modal.showError('This tweet is already in your collection');
            return;
        }

        // 验证成功，暂存密码
        sessionStorage.setItem('admin_pwd', password);

        Modal.close();
        this.state.items = await Storage.getAll();
        

        this.state.currentPage = 1;
        this.render();
    },

    async handleDelete(id) {
        const password = await this.getAuthPassword();
        if (!password) return;

        const success = await Storage.remove(id, password);
        if (!success) {
            sessionStorage.removeItem('admin_pwd');
            alert('操作失败，请检查密码');
            return;
        }

        // 验证成功，暂存密码
        sessionStorage.setItem('admin_pwd', password);
        this.state.items = await Storage.getAll();
        const totalPages = Math.ceil(this.state.items.length / ITEMS_PER_PAGE);
        if (this.state.currentPage > totalPages && totalPages > 0) {
            this.state.currentPage = totalPages;
        }
        
        this.render();
    },

    changePage(direction) {
        const totalPages = Math.ceil(this.state.items.length / ITEMS_PER_PAGE);
        const newPage = this.state.currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            this.state.currentPage = newPage;
            this.render();
            

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    render() {
        const { currentPage, items } = this.state;
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
        

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = items.slice(start, end);


        TweetManager.renderPage(pageItems, (id) => this.handleDelete(id));
        Pagination.update(currentPage, totalPages);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
