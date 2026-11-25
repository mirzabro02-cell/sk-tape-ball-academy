import { useEffect } from 'react';

const ACADEMY_BASE_TITLE = 'SK Tape Ball Academy';

function syncSocialTitle(title: string) {
  const ogTitle = document.head.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  const twitterTitle = document.head.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', title);
}

export function useDocumentTitle(pageTitle?: string, pageDescription?: string): void {
  useEffect(() => {
    const fullTitle = pageTitle
      ? `${pageTitle} | ${ACADEMY_BASE_TITLE}`
      : `${ACADEMY_BASE_TITLE} — Build Your Game. Master Your Skills.`;

    document.title = fullTitle;
    syncSocialTitle(fullTitle);

    if (pageDescription) {
      const metaDesc = document.head.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDescription);
      const ogDesc = document.head.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageDescription);
      const twitterDesc = document.head.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', pageDescription);
    }
  }, [pageTitle, pageDescription]);
}
