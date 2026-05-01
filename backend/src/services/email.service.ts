import nodemailer from 'nodemailer';

// 1. Creăm transportorul O SINGURĂ DATĂ, în afara funcției.
// Astfel, serverul ține conexiunea deschisă și nu pierde timp la fiecare email.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_PASSWORD
    }
});

// 2. Verificăm conexiunea o singură dată, când pornește serverul
transporter.verify()
    .then(() => console.log("✅ Serverul de email (Speak&Go) este pregătit!"))
    .catch((error) => console.error("❌ Eroare la configurarea emailului:", error));

export const sendEmail = async (email: string, title: string, html: string) => {
    try {
        // 3. Folosim AWAIT pur, fără callback. Nodemailer returnează un obiect cu info.
        const info = await transporter.sendMail({
            from: `"Speak&Go" <${process.env.HOST_EMAIL}>`,
            to: email,
            subject: title,
            html: html
        });

        console.log(`✉️ Email trimis cu succes către ${email} (ID: ${info.messageId})`);
        
        // Returnăm un format predictibil (success: true/false)
        return { success: true, message: info.messageId };

    } catch (error: any) {
        console.error("❌ Eroare la trimiterea email-ului: ", error);
        
        // În loc de "throw new Error", e mai sigur să returnăm obiectul de eroare 
        // pentru ca aplicația să nu "crape" brusc, lăsând controller-ul să o gestioneze.
        return { success: false, error: error.message };
    } 
}