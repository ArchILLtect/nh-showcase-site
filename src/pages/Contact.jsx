/**
 * File: Contact.jsx
 * Author: Nick Hanson
 * Created On: December 23, 2024
 * Last Updated: December 23, 2024
 * Description: The contact page for the showcase site.
 *
 * Props:
 * // TODO: Add content in these comment sections
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Email sent successfully:', result);
        setSubmitted(true);
      } else {
        console.error('Error sending email:', result.message);
        alert('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-4xl mx-auto p-4 mb-20">
      <h1 className="dark:text-gray-100 text-4xl font-bold text-center mb-6">Contact Me</h1>
      <p className="dark:text-gray-200 text-center text-gray-700 mb-8">
        Interested in collaborating or learning more about my work? Feel free to reach out!
      </p>

      <div className="mb-8">
        <h2 className="dark:text-gray-100 text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="dark:text-gray-200">Email: <a href="mailto:nick@nickhanson.me" className="text-blue-500 hover:underline">nick@nickhanson.me</a></p>
        <p className="dark:text-gray-200">LinkedIn: <a href="https://www.linkedin.com/in/nick-hanson-sr/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View My Profile</a></p>
        <p className="dark:text-gray-200">GitHub: <a href="https://github.com/ArchILLtect" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ArchILLtect</a></p>
      </div>

      <div>
        <h2 className="text-gray-600 dark:text-gray-100 text-2xl font-semibold mb-4">Contact Form</h2>
        {submitted ? (
          <p className="text-green-600">Thank you for reaching out! I'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="dark:bg-gray-300 dark:placeholder-gray-800 w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="dark:bg-gray-300 dark:placeholder-gray-800 w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="dark:bg-gray-300 dark:placeholder-gray-800 w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;