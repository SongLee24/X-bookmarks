export const TweetManager = {
    container: document.getElementById('feed-container'),
    
    clearFeed() {
        this.container.innerHTML = '';
    },

    renderSkeleton() {
        const el = document.createElement('div');
        el.className = 'tweet-skeleton animate-fade-in';
        el.innerHTML = `
            <div class="sk-header">
                <div class="sk-avatar"></div>
                <div class="sk-meta">
                    <div class="sk-line" style="width: 80px"></div>
                    <div class="sk-line" style="width: 50px"></div>
                </div>
            </div>
            <div class="sk-body">
                <div class="sk-line" style="width: 100%"></div>
                <div class="sk-line" style="width: 90%"></div>
                <div class="sk-line" style="width: 95%"></div>
            </div>
        `;
        return el;
    },

    async renderPage(tweets, onDelete) {
        this.clearFeed();
        
        if (tweets.length === 0) {
            document.getElementById('empty-state').classList.remove('hidden');
            document.getElementById('empty-state').classList.add('flex');
            document.getElementById('pagination').classList.add('hidden');
            return;
        } else {
            document.getElementById('empty-state').classList.add('hidden');
            document.getElementById('empty-state').classList.remove('flex');
            document.getElementById('pagination').classList.remove('hidden');
        }


        const wrappers = tweets.map(tweet => {
            const wrapper = document.createElement('div');
            wrapper.className = 'tweet-container relative w-full flex flex-col min-h-[100px] animate-slide-up';
            wrapper.style.animationDelay = '0ms'; // Staggering handled by browser mostly or can add manual delay
            

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-action z-10 bg-surface border border-border text-danger p-2 rounded-full shadow-lg hover:bg-danger hover:text-white transition-colors';
            deleteBtn.innerHTML = '<i data-lucide="trash-2" class="w-3 h-3"></i>';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if(confirm('Remove this bookmark?')) {
                    onDelete(tweet.id);
                }
            };

            const inner = document.createElement('div');
            inner.className = 'w-full'; // Holder for twitter widget
            inner.id = `tweet-${tweet.id}`;
            

            inner.appendChild(this.renderSkeleton());
            
            wrapper.appendChild(deleteBtn);
            wrapper.appendChild(inner);
            this.container.appendChild(wrapper);

            return { id: tweet.id, el: inner };
        });


        lucide.createIcons();



        if (window.twttr && window.twttr.widgets) {
            wrappers.forEach(({ id, el }) => {
                window.twttr.widgets.createTweet(
                    id,
                    el,
                    {
                        theme: 'dark',
                        conversation: 'none',
                        align: 'center',
                        dnt: true
                    }
                ).then(iframe => {

                    const skeleton = el.querySelector('.tweet-skeleton');
                    if (skeleton) skeleton.remove();
                    
                    if (!iframe) {

                        el.innerHTML = `
                            <div class="w-full p-4 border border-border border-dashed rounded-lg text-center">
                                <p class="text-xs text-secondary">Tweet not found or deleted.</p>
                                <p class="text-[10px] text-zinc-700 font-mono mt-1">${id}</p>
                            </div>
                        `;
                    }
                });
            });
        }
    }
};
