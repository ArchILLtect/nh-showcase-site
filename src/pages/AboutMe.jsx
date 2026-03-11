/**
 * File: AboutMe.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: August 20, 2025
 * Description: The about me page for the showcase site.
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
 * - React Router DOM
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingSpinner from '../components/LoadingSpinner';
import { trackVisit } from "../utils/visitTracker";

const getSectionDetails = (section) => {
  if (typeof section?.details === 'string' || section?.details == null) {
    return { type: 'text', content: String(section?.details || ''), file: '' };
  }

  return {
    type: String(section?.details?.type || 'text').toLowerCase(),
    content: String(section?.details?.content || ''),
    file: String(section?.details?.file || ''),
  };
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getMarkdownPath = (section, details) => {
  if (details.file) {
    return details.file.startsWith('/') ? details.file : `/data/sections/${details.file}`;
  }

  return `/data/sections/${slugify(section?.title)}.md`;
};

const sanitizeHtml = (unsafeHtml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(unsafeHtml || ''), 'text/html');

  const blockedTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];
  blockedTags.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((node) => node.remove());
  });

  doc.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase();

      if (name.startsWith('on')) {
        element.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) {
        element.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};

const AboutMe = () => {

  useEffect(() => {
    trackVisit();
  }, []);

  const [expanded, setExpanded] = useState(null);
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [markdownByIndex, setMarkdownByIndex] = useState({});
  const [markdownLoadingByIndex, setMarkdownLoadingByIndex] = useState({});
  const [markdownErrorByIndex, setMarkdownErrorByIndex] = useState({});

  useEffect(() => {
    const loadSections = async () => {
      const start = Date.now();
      try {
        setSectionsLoading(true); // show spinner
        const response = await fetch('data/sections.json');
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setSectionsLoading(false), delay); // ⏳ delay cleanup
      }
    };

    loadSections();
  }, []);

  const toggleSection = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  useEffect(() => {
    if (expanded === null) return;

    const section = sections[expanded];
    if (!section) return;

    const details = getSectionDetails(section);
    if (details.type !== 'md') return;
    if (typeof markdownByIndex[expanded] === 'string') return;
    if (markdownLoadingByIndex[expanded]) return;

    const markdownPath = getMarkdownPath(section, details);

    const loadMarkdown = async () => {
      try {
        setMarkdownLoadingByIndex((prev) => ({ ...prev, [expanded]: true }));
        setMarkdownErrorByIndex((prev) => ({ ...prev, [expanded]: '' }));

        const response = await fetch(markdownPath);
        if (!response.ok) {
          throw new Error(`Could not load markdown file: ${markdownPath}`);
        }

        const markdown = await response.text();
        setMarkdownByIndex((prev) => ({ ...prev, [expanded]: markdown }));
      } catch (error) {
        console.error('Error loading markdown section:', error);
        setMarkdownErrorByIndex((prev) => ({
          ...prev,
          [expanded]: 'Markdown content could not be loaded.',
        }));
      } finally {
        setMarkdownLoadingByIndex((prev) => ({ ...prev, [expanded]: false }));
      }
    };

    loadMarkdown();
  }, [expanded, sections, markdownByIndex, markdownLoadingByIndex]);

  return (
    <div className="bg-gray-200 dark:bg-gray-600 xl:max-w-6xl lg:max-w-4xl mx-auto p-4">
      <h1 className="text-gray-600 dark:text-gray-300 text-4xl font-bold text-center mb-6">About Me</h1>
      <Link to="/certificates" className="flex justify-center my-6">
        <button className="relative z-10 px-6 py-3 bg-blue-500 text-gray-100 text-sm rounded
            hover:bg-blue-600 transition duration-500">
          Certificates
        </button>
      </Link>
      {sectionsLoading ? (
        <LoadingSpinner />
      ) : (
        sections.map((section, index) => {
          const { type, content } = getSectionDetails(section);
          return (
          <div key={index} className="text-gray-800 bg-gray-300 dark:bg-gray-300 mb-4 border-b
              border-gray-500 dark:border-gray-800">
            <button
              className="w-full text-left py-2 px-4 font-semibold text-lg flex justify-between items-center"
              onClick={() => toggleSection(index)}
            >
              {section.title}
              <span className="text-gray-500 dark:text-gray-800">
                {expanded === index ? "▲" : "▼"}
              </span>
            </button>
            <p className="px-4 py-2 text-gray-700 hover:text-lg">{section.summary}</p>
            {expanded === index && (
              <div className="px-4 pb-4 text-gray-600 hover:text-lg">
                <hr className="border-gray-400 my-2" />
                {type === "md" ? (
                  markdownLoadingByIndex[index] ? (
                    <LoadingSpinner />
                  ) : markdownErrorByIndex[index] ? (
                    <p className="text-red-700">{markdownErrorByIndex[index]}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdownByIndex[index] || ''}
                    </ReactMarkdown>
                  )
                ) : type === "html" ? (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
                ) : (
                  <p>{content}</p>
                )}
              </div>
            )}
          </div>
          );
        })
      )}
      <div className="mt-24 pb-24 flex flex-col text-center content-center flex-wrap hover:scale-110">
        <h2 className="text-gray-600 dark:text-gray-100 text-3xl font-bold">Powered By:</h2>
        <img src="/images/NH-Circuit-Logo.webp" width="30%" alt="Nick Hanson Circuit Logo" />
      </div>
    </div>
  );
};

export default AboutMe;