// Where in the Sider lists a component doc was opened from, so "Tilbake til
// sideoversikt" can return there. Kept per browser tab.
const KEY = 'linje-preview-list-path';

// /structure/innhold;komponenter;reise;<id> → /structure/innhold;komponenter;reise
export function rememberListPath(pathname: string) {
  if (!pathname.startsWith('/structure')) return;
  const listPath = pathname.startsWith('/structure/__edit__')
    ? '/structure'
    : pathname.replace(/;[^;/]+$/, '');
  try {
    sessionStorage.setItem(KEY, listPath);
  } catch {
    // Without storage the back button goes to the top of Sider
  }
}

export function getListPath() {
  try {
    return sessionStorage.getItem(KEY) ?? '/structure';
  } catch {
    return '/structure';
  }
}
