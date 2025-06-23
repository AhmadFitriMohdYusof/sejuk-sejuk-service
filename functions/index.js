const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure Twilio (WhatsApp)
const twilioClient = twilio(
  functions.config().twilio.sid,
  functions.config().twilio.token
);

// Configure Email fallback
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.user,
    pass: functions.config().gmail.pass
  }
});

const sendJobNotification = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Only trigger if status changed to "Completed"
    if (beforeData.status !== "Completed" && afterData.status === "Completed") {
      const {orderId, customerName, assignedTechnician, phone} = afterData;
      const completionTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });

      // Notification templates
      const whatsappMessage =
          `Hi ${customerName}, job ${orderId} is completed by ` +
          `Technician ${assignedTechnician} at ${completionTime}. Thank you!`;

      const emailMessage = `
          <h2>Job Completed</h2>
          <p>Dear ${customerName},</p>
          <p>Your service job ${orderId} has been completed.</p>
        `;

      try {
        // Try WhatsApp first
        await twilioClient.messages.create({
          body: whatsappMessage,
          from: "whatsapp:+14155238886",
          to: `whatsapp:${phone}`
        });
        functions.logger.log("WhatsApp notification sent");
      } catch (error) {
        functions.logger.error(
          "WhatsApp failed, falling back to email",
          error
        );

        // Email fallback
        try {
          await transporter.sendMail({
            from: "\"Sejuk Service\" <noreply@sejuk.com>",
            to: "customer@example.com",
            subject: `Job ${orderId} Completed`,
            html: emailMessage
          });
          functions.logger.log("Email notification sent");
        } catch (emailError) {
          functions.logger.error(
            "All notifications failed",
            emailError
          );
        }
      }

      // Update notification status
      await change.after.ref.update({
        notificationSent: true,
        notificationTime: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    return null;
  });

exports.sendJobCompletionNotification = sendJobNotification;
