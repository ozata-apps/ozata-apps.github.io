
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
            await emailjs.sendForm(
                "service_qr4xdqu",
                "template_zin1z9a",
                contactForm,
                "OvTz3Iuh_cncLLF2Q"
            );

            const messageBox = document.getElementById("formMessage");

            messageBox.className = "form-message success";
            messageBox.textContent = "✅ Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.";

            contactForm.reset();

            setTimeout(() => {
                messageBox.className = "form-message";
                messageBox.textContent = "";
            }, 4000);

        } catch (err) {
            console.error(err);
            const messageBox = document.getElementById("formMessage");

            messageBox.className = "form-message error";
            messageBox.textContent = "❌ Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.";

            setTimeout(() => {
                messageBox.className = "form-message";
                messageBox.textContent = "";
            }, 4000);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    });
});
