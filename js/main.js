/* ============================================================
   OZATA — main.js (yeni UI)
   - Navbar scroll durumu + mobil menü 
   - Spotlight: mouse'u yumuşak takip eden ışık (framer-motion
     useSpring bounce:0 karşılığı — lerp ile spring benzeri yumuşaklık)
   - CursorGlow 
   - Fade-in scroll animasyonları
   ============================================================ */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        /* ================= NAVBAR ================= */
        var navbar = document.querySelector(".navbar");
        if (navbar) {
            var onScroll = function () {
                var y = document.documentElement.scrollTop || document.body.scrollTop;
                navbar.classList.toggle("scrolled", y > 20);
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
        }

        /* Mobil menü (nav-toggle) */
        var toggle = document.querySelector(".nav-toggle");
        var navLinks = document.querySelector(".nav-links");
        if (toggle && navLinks) {
            toggle.addEventListener("click", function () {
                var open = navLinks.classList.toggle("active");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
                // hamburger → X animasyonu
                toggle.classList.toggle("open", open);
            });
            // Menü linkine tıklayınca kapat
            navLinks.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", function () {
                    navLinks.classList.remove("active");
                    toggle.classList.remove("open");
                });
            });
        }

        /* ================= SPOTLIGHT =================
           Her .section-card içindeki .spotlight, kart üzerinde
           mouse'u takip eder (hover'da görünür, terk edince söner).
           framer-motion spring {bounce:0} ≈ lerp 0.15 → 1 hedefe
           hızlıca oturur, aşım yapmaz. */
        var cards = document.querySelectorAll(".section-card");
        cards.forEach(function (card) {
            var spot = card.querySelector(".spotlight");
            if (!spot) return;

            var targetX = 0, targetY = 0, curX = 0, curY = 0, rafId = null, active = false;

            function tick() {
                curX += (targetX - curX) * 0.18;
                curY += (targetY - curY) * 0.18;
                // Merkez, imleç konumuna gelecek şekilde left/top hesapla
                // (framer-motion left/top'a yazar — transform KULLANMA:
                //  transform, taban left/top üstüne eklenir ve ışık kayar)
                spot.style.left = (curX - 100) + "px";
                spot.style.top = (curY - 100) + "px";
                if (Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5 || active) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    rafId = null;
                }
            }

            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
                if (!rafId) rafId = requestAnimationFrame(tick);
            });

            card.addEventListener("mouseenter", function () { active = true; });
            card.addEventListener("mouseleave", function () { active = false; });
        });

        /* ================= CURSOR GLOW =================
         sadece hover destekleyen cihazlarda) */
        var glow = document.getElementById("cursorGlow");
        if (glow && !window.matchMedia("(hover: none)").matches) {
            window.addEventListener("mousemove", function (e) {
                glow.style.transform =
                    "translate(" + (e.clientX - 200) + "px," + (e.clientY - 200) + "px)";
            }, { passive: true });
        }

        /* ================= FADE-IN ================= */
        var fadeEls = document.querySelectorAll(".fade-in");
        if (fadeEls.length && "IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            fadeEls.forEach(function (el) { io.observe(el); });
        }
    });
})();
