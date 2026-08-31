import { useEffect } from 'react';

const metadataTargets = {
  description: ['meta[name="description"]', 'content'],
  canonicalUrl: ['link[rel="canonical"]', 'href'],
  openGraphTitle: ['meta[property="og:title"]', 'content'],
  openGraphDescription: ['meta[property="og:description"]', 'content'],
  openGraphUrl: ['meta[property="og:url"]', 'content'],
  openGraphImage: ['meta[property="og:image"]', 'content'],
  twitterTitle: ['meta[name="twitter:title"]', 'content'],
  twitterDescription: ['meta[name="twitter:description"]', 'content'],
  twitterUrl: ['meta[name="twitter:url"]', 'content'],
  twitterImage: ['meta[name="twitter:image"]', 'content'],
};

export const usePageMetadata = (metadata) => {
  useEffect(() => {
    const previousValues = [];

    Object.entries(metadataTargets).forEach(([key, [selector, attribute]]) => {
      const value = metadata[key];
      const element = document.head.querySelector(selector);

      if (!value || !element) {
        return;
      }

      previousValues.push({ element, attribute, value: element.getAttribute(attribute) });
      element.setAttribute(attribute, value);
    });

    return () => {
      previousValues.forEach(({ element, attribute, value }) => {
        if (value === null) {
          element.removeAttribute(attribute);
        } else {
          element.setAttribute(attribute, value);
        }
      });
    };
  }, [metadata]);
};
