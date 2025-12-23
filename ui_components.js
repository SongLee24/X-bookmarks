export const Modal = {
    init() {
        this.overlay = document.getElementById('add-modal');
        this.backdrop = document.getElementById('modal-backdrop');
        this.closeBtn = document.getElementById('close-modal');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.input = document.getElementById('tweet-url');
        this.errorMsg = document.getElementById('input-error');
        
        const closeHandler = () => this.close();
        
        this.backdrop.addEventListener('click', closeHandler);
        this.closeBtn.addEventListener('click', closeHandler);
        this.cancelBtn.addEventListener('click', closeHandler);
        

        this.input.addEventListener('input', () => {
            this.errorMsg.classList.add('hidden');
            this.input.classList.remove('border-danger', 'text-danger');
        });
    },

    open() {
        this.overlay.classList.remove('hidden');

        requestAnimationFrame(() => {
            this.overlay.classList.add('modal-active');
            document.body.classList.add('modal-open');
            this.input.focus();
        });
    },

    close() {
        this.overlay.classList.remove('modal-active');
        document.body.classList.remove('modal-open');
        
        setTimeout(() => {
            this.overlay.classList.add('hidden');
            this.input.value = '';
            this.errorMsg.classList.add('hidden');
            this.input.classList.remove('border-danger', 'text-danger');
        }, 300); // Match transition duration
    },

    showError(msg) {
        this.errorMsg.textContent = msg;
        this.errorMsg.classList.remove('hidden');
        this.input.classList.add('border-danger', 'text-danger');
        this.input.classList.add('animate-pulse');
        setTimeout(() => this.input.classList.remove('animate-pulse'), 500);
    },

    getValue() {
        return this.input.value.trim();
    }
};

export const Pagination = {
    init(prevBtnId, nextBtnId, indicatorId, onPageChange) {
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.indicator = document.getElementById(indicatorId);
        this.onPageChange = onPageChange;

        this.prevBtn.addEventListener('click', () => this.onPageChange(-1));
        this.nextBtn.addEventListener('click', () => this.onPageChange(1));
    },

    update(currentPage, totalPages) {
        this.indicator.textContent = `${currentPage} / ${totalPages > 0 ? totalPages : 1}`;
        this.prevBtn.disabled = currentPage <= 1;
        this.nextBtn.disabled = currentPage >= totalPages;
        
        const container = document.getElementById('pagination');
        if (totalPages <= 1 && currentPage === 1) {


             this.prevBtn.disabled = true;
             this.nextBtn.disabled = true;
        }
    }
};

export const PasswordModal = {
    init() {
        this.el = document.getElementById('password-modal');
        this.input = document.getElementById('admin-password');
        this.error = document.getElementById('pwd-error');
        this.confirmBtn = document.getElementById('pwd-confirm');
        this.cancelBtn = document.getElementById('pwd-cancel');
    },

    // 使用 Promise 封装，方便在 app.js 中使用 await
    verify() {
        return new Promise((resolve) => {
            this.el.classList.remove('hidden');
            this.el.classList.add('flex');
            this.input.value = '';
            this.input.focus();
            this.error.classList.add('hidden');

            const handleConfirm = () => {
                resolve(this.input.value);
                this.close();
            };

            const handleCancel = () => {
                resolve(null);
                this.close();
            };

            this.confirmBtn.onclick = handleConfirm;
            this.cancelBtn.onclick = handleCancel;
            this.input.onkeydown = (e) => { if(e.key === 'Enter') handleConfirm(); };
        });
    },

    showError() {
        this.error.classList.remove('hidden');
        this.input.classList.add('border-danger');
    },

    close() {
        this.el.classList.add('hidden');
        this.el.classList.remove('flex');
    }
};
