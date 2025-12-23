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

    async handleAddSubmit() {
        const url = Modal.getValue();
        const id = Utils.extractTweetId(url);

        if (!id) {
            Modal.showError('Invalid X/Twitter URL');
            return;
        }

        // 弹出密码框获取密码
        const password = await PasswordModal.verify();
        if (!password) return;

        const result = await Storage.add(url, id, password);

        if (result.error === 'auth') {
            alert('密码错误，操作未授权');
            return;
        }

        if (!result.success) {
            Modal.showError('This tweet is already in your collection');
            return;
        }


        Modal.close();
        this.state.items = await Storage.getAll();
        

        this.state.currentPage = 1;
        this.render();
    },

    async handleDelete(id) {
        const password = await PasswordModal.verify();
        if (!password) return;

        const success = await Storage.remove(id, password);
        if (!success) {
            alert('操作失败，请检查密码');
            return;
        }

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
