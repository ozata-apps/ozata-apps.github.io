(function() {
    const SPLASH_KEY = 'ozata_splash_watched';

    window.addEventListener('DOMContentLoaded', () => {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        const video = document.getElementById('splashVideo');
        const btn = document.getElementById('splashStartBtn');
   
        const source = video.querySelector("source");

        if (window.matchMedia("(orientation: portrait)").matches) {
            source.src = "assets/video/splash_video_mobile.mp4";
        } else {
            source.src = "assets/video/splash_video.mp4";
        }

        video.load();  

        window.addEventListener("resize", () => {
            if (window.matchMedia("(orientation: portrait)").matches) {
                source.src = "assets/video/splash_video_mobile.mp4";
            } else {
                source.src = "assets/video/splash_video.mp4";
            }

            video.load();
        });

        if (localStorage.getItem(SPLASH_KEY) === 'true') {
            preloader.style.display = 'none';
            return;
        }

        // ============================================================
        // PARTİKÜL SİSTEMİ – Canvas oluştur
        // ============================================================
        const canvas = document.createElement('canvas');
        canvas.id = 'splashParticleCanvas';
        canvas.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        preloader.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let W, H;

        function resizeCanvas() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Partikül sınıfı
        class Particle {
            constructor(x, y) {
                this.x = x || W / 2;
                this.y = y || H / 2;
                this.size = Math.random() * 3 + 1.5;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.opacity = Math.random() * 0.5 + 0.3;
                const hue = Math.random() * 60 + 240; // mor-mavi
                this.color = `hsl(${hue}, 80%, 65%)`;
                this.life = 1;
                this.decay = Math.random() * 0.003 + 0.001;
                this.isExploding = false;
                this.explodeSpeed = 0;
                this.explodeAngle = 0;
            }

            update() {
                if (this.isExploding) {
                    this.x += Math.cos(this.explodeAngle) * this.explodeSpeed;
                    this.y += Math.sin(this.explodeAngle) * this.explodeSpeed;
                    this.explodeSpeed *= 0.99;
                    this.size *= 0.998;
                    this.life -= this.decay * 2;
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > W) this.speedX *= -1;
                    if (this.y < 0 || this.y > H) this.speedY *= -1;
                    this.life -= this.decay;
                }
                return this.life > 0.01;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.life * this.opacity;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }

            explode(angle) {
                this.isExploding = true;
                this.explodeAngle = angle;
                this.explodeSpeed = Math.random() * 10 + 4;
                this.life = 1;
            }
        }

        let particles = [];
        let isHovering = false;
        let isExploding = false;
        let animId = null;
        let spawnTimer = 0;

        function getButtonCenter() {
            const rect = btn.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        function spawnParticles(count, centerX, centerY) {
            const newParticles = [];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 120 + 30;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                const p = new Particle(x, y);
                const dir = Math.random() > 0.5 ? 1 : -1;
                const speed = Math.random() * 0.4 + 0.2;
                p.speedX = Math.cos(angle + Math.PI / 2) * speed * dir;
                p.speedY = Math.sin(angle + Math.PI / 2) * speed * dir;
                p.size = Math.random() * 4 + 2;
                p.opacity = Math.random() * 0.5 + 0.4;
                newParticles.push(p);
            }
            return newParticles;
        }

        function explodeAllParticles() {
            isExploding = true;
            particles.forEach(p => {
                const angle = Math.random() * Math.PI * 2;
                p.explode(angle);
                p.size = Math.random() * 5 + 2;
                p.opacity = 0.8;
                p.decay = Math.random() * 0.005 + 0.002;
            });
            const center = getButtonCenter();
            for (let i = 0; i < 80; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 20;
                const x = center.x + Math.cos(angle) * radius;
                const y = center.y + Math.sin(angle) * radius;
                const p = new Particle(x, y);
                const explodeAngle = Math.random() * Math.PI * 2;
                p.explode(explodeAngle);
                p.explodeSpeed = Math.random() * 15 + 5;
                p.size = Math.random() * 5 + 2;
                p.opacity = 0.9;
                p.life = 1;
                p.decay = Math.random() * 0.004 + 0.002;
                particles.push(p);
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, W, H);

            if (isHovering && !isExploding) {
                spawnTimer++;
                if (spawnTimer % 3 === 0) {
                    const center = getButtonCenter();
                    const newP = spawnParticles(2, center.x, center.y);
                    particles.push(...newP);
                }
            }

            particles = particles.filter(p => p.update());
            particles.forEach(p => p.draw());

            if (particles.length > 400) {
                particles = particles.slice(-350);
            }

            animId = requestAnimationFrame(animateParticles);
        }

        animateParticles();

        // ============================================================
        // BUTON OLAYLARI
        // ============================================================

        btn.addEventListener('mouseenter', function() {
            isHovering = true;
            const center = getButtonCenter();
            const initialParticles = spawnParticles(40, center.x, center.y);
            particles.push(...initialParticles);
            const hint = document.querySelector('.splash-hint');
            if (hint) hint.style.opacity = '0';
        });

        btn.addEventListener('mouseleave', function() {
            isHovering = false;
            const hint = document.querySelector('.splash-hint');
            if (hint) hint.style.opacity = '0.8';
        });

        // Video oynatma (mevcut kod)
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

            // === PARTİKÜL PATLAMASI ===
            explodeAllParticles();

            // Buton küçülme
            this.style.transform = 'scale(0.94)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Video oynatma
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
                if (animId) cancelAnimationFrame(animId);
            }, 800);
        }

        video.preload = 'auto';
    });
})();
