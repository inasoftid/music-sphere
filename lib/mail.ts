import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Music Sphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifikasi Email Anda - Music Sphere',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #1e293b; text-align: center; margin-bottom: 24px;">Selamat Datang di Music Sphere!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
            Terima kasih telah mendaftar. Untuk menyelesaikan pendaftaran Anda, silakan gunakan kode verifikasi di bawah ini:
          </p>
          <div style="background-color: #ffffff; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #dc2626; margin: 0;">${code}</p>
          </div>
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Kode ini berlaku selama 15 menit. Jangan berikan kode ini kepada siapapun.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Jika Anda tidak merasa mendaftar di Music Sphere, abaikan email ini.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://musicsphere.site'}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Music Sphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Kata Sandi - Music Sphere',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #1e293b; text-align: center; margin-bottom: 24px;">Reset Kata Sandi</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
            Kami menerima permintaan untuk mereset kata sandi akun Anda. Klik tombol di bawah untuk membuat kata sandi baru:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Reset Kata Sandi
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Link ini berlaku selama 30 menit. Jika Anda tidak meminta reset kata sandi, abaikan email ini.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Jika tombol di atas tidak berfungsi, salin dan tempel link berikut di browser Anda:<br/>
            <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return false;
  }
};