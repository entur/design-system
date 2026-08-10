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

  parsed.body.querySelectorAll('a').forEach(anchor => {
    // Sanitising drops an unsafe href, and the editor sometimes leaves an empty one behind.
    // Either way the link leads nowhere, so unwrap it rather than leave text that invites a
    // click. An empty href is worse than none: it reloads the page.
    if (!anchor.getAttribute('href')?.trim()) {
      anchor.replaceWith(...Array.from(anchor.childNodes));
      return;
    }
    // An empty link is invisible to sighted users and unreadable to screen readers.
    if (!anchor.textContent?.trim()) {
      anchor.remove();
      return;
    }
    // Borrow the design system's link styling — without it these fall back to the
    // browser's own blue and visited purple.
    anchor.classList.add('eds-link');
    if (anchor.getAttribute('target') === '_blank') {
      anchor.setAttribute('rel', 'noreferrer');
    }
  });

  return parsed.body.innerHTML;
};
