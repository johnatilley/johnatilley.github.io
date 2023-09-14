/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { onRequest } = require("firebase-functions/v2/https");

const nodemailer = require('nodemailer');

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.sendmessage = onRequest(async (req, res) => {
    // Grab the text parameter.
    const name = req.query.name;
    const company = req.query.company;
    const email = req.query.email;
    const phone = req.query.phone;
    const message = req.query.message;

    var transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'john@johntilley.com',
            pass: '3G.qHZ9UFvZVaMEYqXRn'
        }
    });

    if (name != undefined && name.trim != '' && email != undefined && email.trim != '') {

        var emailhtml = '<h1>New message from johntilley.com contact form</h1>';
        emailhtml += '<p>Name: ' + name + '</p>';
        emailhtml += '<p>Email: ' + email + '</p>';
        emailhtml += company ? '<p>Company: ' + company + '</p>' : '';
        emailhtml += phone ? '<p>Phone: ' + phone + '</p>' : '';
        emailhtml += message ? '<p>Message: ' + message + '</p>' : '';

        const mailOptions = {
            from: `john@johntilley.com`,
            to: `john@johntilley.com`,
            subject: 'New contact form message',
            html: emailhtml
        };

        const info = await transporter.sendMail(mailOptions, (error, data) => { });
    }

    res.json({ status: "success", message: `Message sent` });
});