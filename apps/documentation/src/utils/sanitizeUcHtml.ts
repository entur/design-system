import DOMPurify from 'dompurify';

/** Texts from the Usercentrics admin are authored in a rich text editor, so they arrive as
 *  HTML carrying inline styles and occasionally a javascript: link. Keep the markup that
 *  affects meaning, drop the rest, and unwrap links that lost their href so no text looks
 *  clickable without being clickable. */
export const sanitizeUcHtml = (html: string) => {
  if (typeof window === 'undefined') return '';

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'p', 'span', 'strong'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  const parsed = new DOMParser().parseFromString(clean, 'text/html');
  parsed.body.querySelectorAll('a:not([href])').forEach(anchor => {
    anchor.replaceWith(...Array.from(anchor.childNodes));
  });
  return parsed.body.innerHTML;
};
