import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.emailName,
            pass: process.env.emailPass
        }
    }
);
export async function sendMail({title,text,targetEmail}){
    const mailOptions = {
        from: "DigiMarket",
        to: targetEmail,
        subject:title,
        text:text
    }
    try {
    const info = await transporter.sendMail(mailOptions );
     return info
        
    } catch (error) {
        return {error :error}
    }
}