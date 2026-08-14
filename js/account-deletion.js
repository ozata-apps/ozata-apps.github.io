document.addEventListener("DOMContentLoaded", () => {
    const deleteForm = document.getElementById("accountDeletionForm");

    if (!deleteForm) return;

    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = deleteForm.querySelector("button[type='submit']");
        const originalHTML = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = "⏳ Gönderiliyor...";

        const messageBox = document.getElementById("formMessage");

        // Onay metnini mesaj alanına yaz (e-posta adresiyle birlikte)
        const emailInput = deleteForm.querySelector("input[name='email']");
        const messageInput = deleteForm.querySelector("input[name='message']");
        if (messageInput && emailInput) {
            messageInput.value =
                "Kullanıcı, Muhasebecim hesabının ve ilişkili tüm verilerinin silinmesini talep etti.\n" +
                "Talep eden e-posta: " + emailInput.value.trim() +
                "\n\nOnay: Bu hesabın ve Muhasebecim ile ilişkili verilerimin silinmesini talep ediyorum.";
        }

        try {
            await emailjs.sendForm(
                "service_qr4xdqu",
                "template_zin1z9a",
                deleteForm,
                "OvTz3Iuh_cncLLF2Q"
            );

            messageBox.className = "form-message success";
            messageBox.textContent =
                "✅ Hesap silme talebiniz başarıyla iletildi. Talebiniz doğrulandıktan sonra işleme alınacaktır.";

            deleteForm.reset();

            setTimeout(() => {
                messageBox.className = "form-message";
                messageBox.textContent = "";
            }, 6000);

        } catch (err) {
            console.error(err);

            messageBox.className = "form-message error";
            messageBox.textContent =
                "❌ Talep gönderilemedi. Lütfen daha sonra tekrar deneyin.";

            setTimeout(() => {
                messageBox.className = "form-message";
                messageBox.textContent = "";
            }, 4000);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    });
});