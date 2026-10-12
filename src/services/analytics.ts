// Anonymous visitor statistics with Umami (self-hosted on the droplet; no cookies, no personal data).
// The script is only added when both values are set (see .env.production), and it only counts visits on
// plastplattformen.no, so local development and preview builds are never counted. Umami follows page changes
// in this single-page app by itself.
const scriptSrc = process.env.REACT_APP_UMAMI_SRC;
const websiteId = process.env.REACT_APP_UMAMI_WEBSITE_ID;

export function loadAnalytics(): void {
  if (!scriptSrc || !websiteId || document.querySelector('script[data-website-id]')) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = scriptSrc;
  script.dataset.websiteId = websiteId;
  script.dataset.domains = 'plastplattformen.no';
  document.head.appendChild(script);
}
