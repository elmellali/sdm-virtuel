"use server";

import nodemailer from "nodemailer";

interface BankRequestData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message?: string;
    bankName: string;
    promoterName: string;
}

export async function sendBankRequest(data: BankRequestData) {
    try {
        const { firstName, lastName, email, phone, message, bankName, promoterName } = data;

        // Formater le contenu de l'email
        const emailHtml = `
            <h2>Nouvelle demande de financement - SDM Virtuel</h2>
            <p><strong>Promoteur concerné :</strong> ${promoterName}</p>
            <p><strong>Banque demandée :</strong> ${bankName}</p>
            <hr />
            <h3>Coordonnées du prospect</h3>
            <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone}</p>
            <br />
            <h3>Informations supplémentaires</h3>
            <p>${message || "Aucune information supplémentaire fournie."}</p>
        `;

        const emailText = `
            Nouvelle demande de financement - SDM Virtuel
            Promoteur concerné : ${promoterName}
            Banque demandée : ${bankName}
            
            Coordonnées du prospect :
            Nom : ${firstName} ${lastName}
            Email : ${email}
            Téléphone : ${phone}
            
            Informations supplémentaires :
            ${message || "Aucune information supplémentaire fournie."}
        `;

        // Vérifier si la configuration SMTP existe
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("⚠️ Configuration SMTP manquante dans le .env.");
            console.log("=== SIMULATION D'ENVOI D'EMAIL ===");
            console.log(emailText);
            console.log("==================================");
            
            // On simule un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return { success: true, message: "Email simulé avec succès." };
        }

        // Configuration du transporteur Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Envoi de l'email
        await transporter.sendMail({
            from: `"SDM Virtuel" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER, // Adresse de destination pour ces demandes
            subject: `Nouvelle demande de financement : ${bankName} - ${promoterName}`,
            text: emailText,
            html: emailHtml,
        });

        return { success: true, message: "Demande envoyée avec succès." };
    } catch (error) {
        console.error("Erreur d'envoi d'email:", error);
        return { success: false, error: "Échec de l'envoi. Veuillez réessayer plus tard." };
    }
}
