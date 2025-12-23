import { Storage } from './storage.js';
import { Utils } from './utils.js';
import { Modal, Pagination } from './ui_components.js';
import { TweetManager } from './tweet_manager.js';

const ITEMS_PER_PAGE = 5;

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

        const success = await Storage.add(url, id);
        if (!success) {
            Modal.showError('This tweet is already in your collection');
            return;
        }


        Modal.close();
        this.state.items = await Storage.getAll();
        

        this.state.currentPage = 1;
        this.render();
    },

    async handleDelete(id) {
        await Storage.remove(id);
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
