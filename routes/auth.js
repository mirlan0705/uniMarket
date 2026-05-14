// edited by mrln
const express = require('express');
const router = express.Router();
const db = require('../DB/database.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

let transporter;

async function initEmail() {

    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    console.log("Ethereal Email ready");
}

initEmail();
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
        db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, password);
        res.json({ success: true });
    } catch {
        res.status(400).json({ error: 'Email already in use' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    if (!user) return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ success: true, name: user.name, email: user.email });
});

// forgot password
router.post('/forgot-password', async (req, res) => {

    const { email } = req.body;

    // check if email exists
    const user = db.prepare(
        'SELECT * FROM users WHERE email = ?'
    ).get(email);

    // validation
    if (!user) {

        return res.status(404).json({
            error: 'Email not found'
        });

    }

    // token
    const token = crypto.randomBytes(32).toString('hex');

    // expiry time = 1 hour
    const expiry = Date.now() + 3600000;

    // store token
    db.prepare(`
        UPDATE users
        SET resetToken = ?, resetTokenExpiry = ?
        WHERE email = ?
    `).run(token, expiry, email);

    // reset link
    const resetLink =
    `http://localhost:3000/html/resetpassword.html?token=${token}`;

    try {
        const info = await transporter.sendMail({

        from: '"UniMarket" <no-reply@unimarket.com>',
        to: email,
        subject: 'Password Reset',
        html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
    `
});

console.log("ETHEREAL LINK:");
console.log(nodemailer.getTestMessageUrl(info));

res.json({
    success: true,
    message: 'Reset link sent',
    debugLink: nodemailer.getTestMessageUrl(info)
});

        } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Could not send email'
        });
        }
        });

router.post('/reset-password', (req, res) => {

    const { token, newPassword } = req.body;

    // check token validity
    const user = db.prepare(`
        SELECT * FROM users
        WHERE resetToken = ?
        AND resetTokenExpiry > ?
    `).get(token, Date.now());

    if (!user) {
        return res.status(400).json({
            error: "Invalid or expired token"
        });
    }

    // update password
    db.prepare(`
        UPDATE users
        SET password = ?, resetToken = NULL, resetTokenExpiry = NULL
        WHERE id = ?
    `).run(newPassword, user.id);

    res.json({
        success: true
    });

});

module.exports = router;
