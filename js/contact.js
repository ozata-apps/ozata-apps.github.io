
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

            alert("✅ Mesajınız başarıyla iletildi.");
            contactForm.reset();

        } catch (err) {
            console.error(err);
            alert("❌ Mesaj gönderilemedi.");
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    });
});
