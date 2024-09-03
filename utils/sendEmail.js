const nodemailer = require('nodemailer');


module.exports = async (userEmail, subject, HTMLTemplate) => {
    console.log("Email details:", { userEmail, subject, HTMLTemplate });

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // sender email
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject,
            html: HTMLTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        
    } catch (error) {
        console.log(error);
        throw new Error('Internal Server Error (sendEmail)');
    }
};