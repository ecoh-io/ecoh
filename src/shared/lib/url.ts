export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  return urls ? Array.from(new Set(urls)) : [];
};

export function truncateUrl(url: string, maxLength = 45) {
  const original = url;
  const isSecure = original.startsWith('https://');

  // Remove protocol
  let processed = url.replace(/^https?:\/\//, '');
  // Remove www.
  processed = processed.replace(/^www\./, '');

  if (processed.length <= maxLength) {
    return { truncated: processed, original, isSecure };
  }

  const truncated = processed.slice(0, maxLength - 5) + '...';
  return { truncated, original, isSecure };
}
