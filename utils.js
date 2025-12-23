export const Utils = {
    /**
     * Extracts the Tweet ID from a given URL.
     * Supports x.com and twitter.com
     * @param {string} url 
     * @returns {string|null}
     */
    extractTweetId(url) {
        try {
            const urlObj = new URL(url);

            if (!['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'].includes(urlObj.hostname)) {
                return null;
            }
            

            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
            const statusIndex = pathSegments.indexOf('status');
            
            if (statusIndex !== -1 && pathSegments[statusIndex + 1]) {

                return pathSegments[statusIndex + 1].split('?')[0];
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    /**
     * Format timestamp to relative time
     */
    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m";
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "min";
        
        return "just now";
    }
};
