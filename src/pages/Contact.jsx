/**
 * File: Contact.jsx
 * Author: Nick Hanson
 * Created On: December 23, 2024
 * Last Updated: July 25, 2025
 * Description: The contact page for the showcase site.
 *
 * Props:
 * - None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 * - useState: A React hook for managing state.
 * - useEffect: A React hook for side effects.
 * - trackVisit
 * - LoadingSpinner: A component for display a spinner during loading times.
 */

import React, { useState, useEffect } from 'react';
import { trackVisit } from "../utils/visitTracker";
import LoadingSpinner from '../components/LoadingSpinner';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackVisit();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = Date.now();
    try {
      setLoading(true); // start loading
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
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-4xl mx-auto p-4 mb-20">
      <h1 className="text-gray-600 dark:text-gray-100 text-4xl font-bold text-center mb-6">
        Contact Me
      </h1>
      <p className="dark:text-gray-200 text-center text-gray-700 font-semibold mb-8">
        Interested in collaborating or learning more about my work? Feel free to reach out!
      </p>

      <div className="mb-8">
        <h2 className="text-gray-600 dark:text-gray-100 text-2xl font-semibold mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-200">
          Email:
          <a href="mailto:nick@nickhanson.me"className="text-blue-500 hover:underline">
            nick@nickhanson.me
          </a>
        </p>
        <p className="text-gray-600 dark:text-gray-200">
          LinkedIn:
          <a href="https://www.linkedin.com/in/nick-hanson-sr/" target="_blank"
              rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View My Profile
          </a>
        </p>
        <p className="text-gray-600 dark:text-gray-200">
          GitHub:
          <a href="https://github.com/ArchILLtect" target="_blank" rel="noopener noreferrer"
              className="text-blue-500 hover:underline">
            ArchILLtect
          </a>
        </p>
      </div>

      <div>
        <h2 className="text-gray-600 dark:text-gray-100 text-2xl font-semibold mb-4">
          Contact Form
        </h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {submitted ? (
            <p className="text-green-600">
              Thank you for reaching out! I&apos;ll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="dark:bg-gray-300 dark:placeholder-gray-800 w-full p-2 border
                    border-gray-300 rounded"
                required
                autoComplete='name'
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="dark:bg-gray-300 dark:placeholder-gray-800 w-full p-2 border
                    border-gray-300 rounded"
                required
                autoComplete='email'
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="dark:bg-gray-300 dark:placeholder-gray-800 w-full p-2 border
                    border-gray-300 rounded"
                rows="4"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-gray-900 dark:text-white font-semibold py-2 px-4
                    rounded hover:bg-blue-600"
              >
                Send Message
              </button>
            </form>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Contact;