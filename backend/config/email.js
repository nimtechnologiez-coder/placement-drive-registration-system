const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendConfirmationEmail = async (studentData) => {
    const mailOptions = {
        from: `"Placement Drive" <${process.env.EMAIL_USER}>`,
        to: studentData.email,
        subject: `Application Submitted - ${studentData.registration_id}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0d6efd; text-align: center;">Registration Confirmed!</h2>
        <p>Dear <strong>${studentData.full_name}</strong>,</p>
        <p>Your details have been successfully submitted for the Placement Drive. We have received your application and resume.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-left: 5px solid #0d6efd; margin: 20px 0;">
          <p style="margin: 0;"><strong>Registration ID:</strong> ${studentData.registration_id}</p>
          <p style="margin: 5px 0 0 0;"><strong>Applied On:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <p>Our team will review your profile and contact you if shortlisted for further rounds.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${studentData.email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
