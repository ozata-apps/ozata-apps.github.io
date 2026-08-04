(function() {
    const SPLASH_KEY = 'ozata_splash_watched';

    window.addEventListener('DOMContentLoaded', () => {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        const video = document.getElementById('splashVideo');
        const btn = document.getElementById('splashStartBtn');

        if (localStorage.getItem(SPLASH_KEY) === 'true') {
            preloader.style.display = 'none';
            return;
        }

        video.addEventListener('error', hidePreloader);

        btn.addEventListener('click', function(e) {
            // === RIPPLE EFEKTİ (Tıklama Dalgası) ===
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 900);

            // Video oynatma (mevcut kod)
            video.muted = false;
            video.volume = 1.0;

            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    preloader.classList.add('playing');
                }).catch(err => {
                    console.log('Otomatik oynatma engellendi:', err);
                    video.muted = true;
                    video.play();
                    preloader.classList.add('playing');
                });
            }
        });

        video.addEventListener('ended', hidePreloader);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !preloader.classList.contains('hide')) {
                hidePreloader();
            }
        });

        function hidePreloader() {
            if (preloader.classList.contains('hide')) return;

            preloader.classList.add('hide');
            localStorage.setItem(SPLASH_KEY, 'true');

            setTimeout(() => {
                preloader.style.display = 'none';
                video.pause();
                video.currentTime = 0;
            }, 800);
        }

        video.preload = 'auto';
    });
})();
