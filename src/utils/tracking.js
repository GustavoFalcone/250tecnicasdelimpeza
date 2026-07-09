const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'utm_placement',
  'utm_campaign_id',
  'utm_adset_id',
  'utm_ad_id',
  'fbclid',
  'gclid',
  'ttclid',
  'src',
  'sck',
  'xcod'
];

export function appendTrackingParams(checkoutUrl) {
  if (typeof window === 'undefined') return checkoutUrl;

  const currentParams = new URLSearchParams(window.location.search);
  const finalUrl = new URL(checkoutUrl, window.location.origin);

  TRACKING_KEYS.forEach((key) => {
    const value = currentParams.get(key);
    if (value && !finalUrl.searchParams.has(key)) {
      finalUrl.searchParams.set(key, value);
    }
  });

  return finalUrl.toString();
}
