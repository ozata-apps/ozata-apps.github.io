/* ============================================================
   SPLINE 3D ROBOT 
   - Sahne: https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode
   - Robot sabit (fixed) tam ekran arka plan. Canvas pointer-events: none
     olduğundan gerçek wheel/drag/touch olayları ASLA canvas'a ulaşmaz.
   - window.scrollY/pageYOffset getter'ları 0'a sabitlenir → Spline
     scroll'u hiç görmez, robot pozu değişmez (bel bükülmesi olmaz).
   - Mouse takibi: window mousemove → synthetic pointermove ile sağlanır;
     dispatchEvent hit-test'e takılmadığı için pointer-events: none'a
     rağmen Spline'in dinleyicisine ulaşır. Robot yalnızca imleci takip eder.
   - Runtime ES module'dür (libs/ altında, chunk'lar da lokal).
   ============================================================ */
(function () {
    var SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
    var container = document.getElementById("splineContainer");

    if (!container) return;

    // === SCROLLY SABİTLEME ==
    var scrollYDescriptor;
    var pageYOffsetDescriptor;
    try {
        scrollYDescriptor = Object.getOwnPropertyDescriptor(window, "scrollY");
        pageYOffsetDescriptor = Object.getOwnPropertyDescriptor(window, "pageYOffset");
        Object.defineProperty(window, "scrollY", { configurable: true, get: function () { return 0; } });
        Object.defineProperty(window, "pageYOffset", { configurable: true, get: function () { return 0; } });
    } catch (e) { /* defineProperty başarısız olursa eski davranış */ }

    var canvas = null;

    function findCanvas() {
        canvas = container.querySelector("canvas");
        if (canvas) {
            canvas.style.pointerEvents = "none";
            canvas.style.touchAction = "auto";
        } else {
            setTimeout(findCanvas, 300);
        }
    }

    // Loader (SplineScene fallback spinner'ı ile aynı stil)
    var loaderEl = document.createElement("div");
    loaderEl.className = "spline-loader";
    loaderEl.innerHTML = '<span class="loader"></span>';
    container.appendChild(loaderEl);

    // Application bir CANVAS element bekler (react-spline ile aynı mantık:
    // <canvas ref> oluşturulur, Application(canvas) yapılır)
    var canvasEl = document.createElement("canvas");
    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";
    canvasEl.style.display = "block";
    container.appendChild(canvasEl);

    // === SPLINE RUNTIME (ES module, dinamik import — lazy/Suspense karşılığı) ===
    // Önce lokal runtime, yoksa unpkg CDN'ine düş.
    var loadPromise = import("./../libs/spline-runtime.js")
        .catch(function () {
            return import("https://unpkg.com/@splinetool/runtime@2.0.5/build/runtime.js");
        });

    loadPromise
        .then(function (mod) {
            var Application = mod.Application || (mod.default && mod.default.Application);
            if (!Application) throw new Error("Application export yok");
            var app = new Application(canvasEl);
            return app.load(SCENE_URL).then(function () {
                loaderEl.remove();
                findCanvas();
            });
        })
        .catch(function (e) {
            // Runtime/sahne yüklenemezse arka plan boş kalır (site çalışmaya devam eder)
            loaderEl.remove();
            console.warn("Spline yüklenemedi:", e && e.message);
        });

    // === MOUSE TAKİBİ (synthetic pointermove) — Next.js Hero ile birebir ===
    var lastMouse = null;

    function dispatchPointerToCanvas() {
        if (!canvas || !lastMouse) return;
        canvas.dispatchEvent(new PointerEvent("pointermove", {
            clientX: lastMouse.x,
            clientY: lastMouse.y,
            bubbles: true,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
        }));
    }

    function forwardMouseMove(e) {
        lastMouse = { x: e.clientX, y: e.clientY };
        dispatchPointerToCanvas();
    }
    window.addEventListener("mousemove", forwardMouseMove, { passive: true });

    // Scroll sırasında da son fare konumu yeniden bildirilir.
    var scrollRaf = null;
    function handleScroll() {
        if (scrollRaf !== null) return;
        scrollRaf = requestAnimationFrame(function () {
            scrollRaf = null;
            dispatchPointerToCanvas();
        });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
})();
