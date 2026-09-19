export function sanitizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Check if starts with http://, https://, or custom protocol
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Common localhost case
  if (trimmed.startsWith('localhost')) {
    return `http://${trimmed}`;
  }

  // Default to https://
  return `https://${trimmed}`;
}

export function isValidUrl(input: string): boolean {
  if (!input || !input.trim()) return false;
  try {
    const formatted = sanitizeUrl(input);
    const parsed = new URL(formatted);
    return ['http:', 'https:'].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function getDomain(urlStr: string): string {
  try {
    const formatted = sanitizeUrl(urlStr);
    const parsed = new URL(formatted);
    return parsed.hostname;
  } catch {
    return '';
  }
}

export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
