/**
 * File: contact.js
 * Author: Nick Hanson
 * Created On: December 23, 2024
 * Last Updated: December 23, 2024
 * Description: Utility function for contact operations across the showcase website.
 *
 * Functions:
 * - // TODO: Add content in these comment sections
 *
 * Notes:
 * - Functions are pure and do not modify input parameters.
 */

const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  // Parse form data from the request body
  const data = JSON.parse(event.body);

  // Set SendGrid API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Define email details
  const msg = {
    to: 'nick@nickhanson.me', // Your email
    from: 'no-reply@nickhanson.me', // A verified sender email
    subject: `New Contact Form Submission from ${data.name}`,
    text: `You have a new message from ${data.name} (${data.email}):\n\n${data.message}`,
  };

  try {
    // Send email
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email.' }),
    };
  }
};