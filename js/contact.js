document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalHTML = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = "⏳ Gönderiliyor...";

        try {
            // Formdaki bilgileri al
            const name = contactForm.querySelector("[name='name']").value;
            const email = contactForm.querySelector("[name='email']").value;
            const subject = contactForm.querySelector("[name='subject']").value;
            const message = contactForm.querySelector("[name='message']").value;

            // URL'deki source bilgisini al
            const urlParams = new URLSearchParams(window.location.search);
            const source = urlParams.get("source") || "OZATA Web Sitesi";

            // EmailJS'e değerleri açıkça gönder
            await emailjs.send(
                "service_qr4xdqu",
                "template_zin1z9a",
                {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    source: source
                },
                "OvTz3Iuh_cncLLF2Q"
            );

            const messageBox = document.getElementById("formMessage");

            messageBox.className = "form-message success";
            messageBox.textContent =
                "✅ Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.";

            contactForm.reset();

            setTimeout(() => {
                messageBox.className = "form-message";
                messageBox.textContent = "";
            }, 4000);

        } catch (err) {
            console.error("EmailJS Hatası:", err);

            const messageBox = document.getElementById("formMessage");

            messageBox.className = "form-message error";
            messageBox.textContent =
                "❌ Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.";

            setTimeout(() => {
                messageBox.className = "form-message";
                messageBox.textContent = "";
            }, 4000);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    });
});
