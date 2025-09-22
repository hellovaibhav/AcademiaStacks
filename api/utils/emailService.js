import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create reusable transporter with optimized settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.MAILID,
      pass: process.env.MAILPASS,
    },
    // Optimized settings for faster delivery
    pool: true, // Use connection pooling
    maxConnections: 5, // Maximum number of connections
    maxMessages: 100, // Maximum number of messages per connection
    rateLimit: 10, // Maximum number of messages per second
    // Connection timeout settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    // Retry settings
    retryDelay: 1000, // 1 second between retries
    retryAttempts: 3, // Number of retry attempts
  });
};

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error);
    return false;
  }
};

// Send OTP email with optimized template
export const sendOTPEmail = async (email, name, otpCode) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: "Academia Stacks",
        address: process.env.MAILID
      },
      to: email,
      subject: "🔐 Academia Stacks - Email Verification OTP",
      text: `Your OTP for Academia Stacks registration is ${otpCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - Academia Stacks</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #22A39F, #1a8a85); color: white; padding: 30px; text-align: center; }
            .content { padding: 40px 30px; text-align: center; }
            .otp-box { background-color: #f8f9fa; border: 2px dashed #22A39F; border-radius: 10px; padding: 30px; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #22A39F; letter-spacing: 5px; margin: 10px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
            .btn { display: inline-block; background-color: #22A39F; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Academia Stacks</h1>
              <p>Welcome to the ocean of knowledge!</p>
            </div>
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>We're excited to have you join our community of learners and contributors.</p>
              <p>To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">
                <h3>Your Verification Code</h3>
                <div class="otp-code">${otpCode}</div>
                <p>This code will expire in <strong>1 hour</strong></p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This is a system-generated email. Please do not reply to this message.
              </div>
              
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
              <p><strong>Academia Stacks</strong></p>
              <p>📧 vaves.tech@gmail.com</p>
              <p>🏛️ IIIT Ranchi, Ranchi, Jharkhand</p>
              <p>© 2025 Academia Stacks. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Email priority and headers for faster delivery
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

// Send feedback notification to admin
export const sendFeedbackNotification = async (feedbackData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: "Academia Stacks",
        address: process.env.MAILID
      },
      to: process.env.ADMIN_EMAIL || "vaves.tech@gmail.com", // Your personal email
      subject: `📝 New Feedback - ${feedbackData.type.toUpperCase()} | Academia Stacks`,
      text: `New feedback received from ${feedbackData.name} (${feedbackData.email})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Feedback - Academia Stacks</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #22A39F, #1a8a85); color: white; padding: 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .feedback-box { background-color: #f8f9fa; border-left: 4px solid #22A39F; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .label { font-weight: bold; color: #495057; margin-bottom: 5px; }
            .value { color: #212529; margin-bottom: 15px; }
            .message-box { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
            .type-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .type-bug { background-color: #dc3545; }
            .type-feature { background-color: #28a745; }
            .type-general { background-color: #6c757d; }
            .type-complaint { background-color: #fd7e14; }
            .type-suggestion { background-color: #17a2b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 New Feedback Received</h1>
              <p>Academia Stacks Feedback System</p>
            </div>
            <div class="content">
              <div class="feedback-box">
                <div class="label">👤 Name:</div>
                <div class="value">${feedbackData.name}</div>
                
                <div class="label">📧 Email:</div>
                <div class="value">${feedbackData.email}</div>
                
                <div class="label">🏷️ Type:</div>
                <div class="value">
                  <span class="type-badge type-${feedbackData.type}">${feedbackData.type}</span>
                </div>
                
                <div class="label">📅 Submitted:</div>
                <div class="value">${new Date(feedbackData.createdAt).toLocaleString()}</div>
                
                <div class="label">💬 Message:</div>
                <div class="message-box">${feedbackData.message}</div>
              </div>
              
              <p><strong>Action Required:</strong> Please review this feedback and take appropriate action if needed.</p>
            </div>
            <div class="footer">
              <p><strong>Academia Stacks Admin Panel</strong></p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Feedback notification sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending feedback notification:", error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: "Academia Stacks",
        address: process.env.MAILID
      },
      to: email,
      subject: "🔒 Password Reset - Academia Stacks",
      text: `Click the link to reset your password: ${resetUrl}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Academia Stacks</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 30px; text-align: center; }
            .content { padding: 40px 30px; text-align: center; }
            .btn { display: inline-block; background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset</h1>
              <p>Academia Stacks Security</p>
            </div>
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>We received a request to reset your password for your Academia Stacks account.</p>
              <p>Click the button below to reset your password:</p>
              
              <a href="${resetUrl}" class="btn">Reset Password</a>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              
              <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p><strong>Academia Stacks</strong></p>
              <p>© 2024 Academia Stacks. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

export default {
  verifyEmailConfig,
  sendOTPEmail,
  sendFeedbackNotification,
  sendPasswordResetEmail
};
