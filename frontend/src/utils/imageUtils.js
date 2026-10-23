// Shared image fallbacks and utilities for PurrConnect
// Reliable inline SVG data-uris that never fail even if external image servers or networks are unreachable

export const FALLBACK_CAT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="%23FFF7ED"><rect width="800" height="600" fill="%23FFF7ED"/><g transform="translate(300, 180)"><path d="M40 180 C40 100 160 100 160 180 Z" fill="%23F97316" opacity="0.15"/><circle cx="100" cy="110" r="70" fill="%23F97316" opacity="0.25"/><polygon points="45,65 25,10 80,45" fill="%23F97316"/><polygon points="155,65 175,10 120,45" fill="%23F97316"/><circle cx="75" cy="105" r="8" fill="%23C2410C"/><circle cx="125" cy="105" r="8" fill="%23C2410C"/><polygon points="100,120 92,130 108,130" fill="%23C2410C"/><path d="M92 135 Q100 145 108 135" stroke="%23C2410C" stroke-width="3" fill="none"/></g><text x="400" y="420" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="%23EA580C" text-anchor="middle">PurrConnect Cat</text><text x="400" y="450" font-family="system-ui, sans-serif" font-size="14" fill="%239A3412" text-anchor="middle">Photo currently unavailable</text></svg>`;

export const FALLBACK_AVATAR_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23FFEDD5"><circle cx="50" cy="50" r="50" fill="%23FFEDD5"/><circle cx="50" cy="40" r="20" fill="%23F97316"/><path d="M20 85 C20 65 35 55 50 55 C65 55 80 65 80 85 Z" fill="%23F97316"/></svg>`;

/**
 * Gracefully handles broken image URLs by substituting a dependable fallback
 */
export const handleImageError = (event, customFallback = FALLBACK_CAT_IMAGE) => {
  if (event.currentTarget.src !== customFallback) {
    event.currentTarget.src = customFallback;
  }
};

/**
 * Safely extracts a cat's primary or indexed image with fallback
 */
export const getCatImage = (cat, index = 0) => {
  if (Array.isArray(cat?.images) && cat.images.length > index && cat.images[index]) {
    return cat.images[index];
  }
  return FALLBACK_CAT_IMAGE;
};
