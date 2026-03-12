import { useEffect } from 'react';

const SITE_NAME = 'Nick Hanson Showcase';

/**
 * Sets the page title on mount.
 * Format: "Page Name | Nick Hanson Showcase"
 * Falls back to just the site name when no pageTitle is provided.
 */
export const usePageTitle = (pageTitle) => {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
  }, [pageTitle]);
};
