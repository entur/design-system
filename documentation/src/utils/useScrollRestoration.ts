import { useEffect, RefObject, useState } from 'react';

import { removeTrailingSlash } from '../components/Navigations/SideNavigation/utils';

type useScrollRestoration = {
  /** Ref for the element that scrolls */
  ref: RefObject<HTMLElement>;
  /** Unique string used to identify this element within the Parent context */
  key: string;
};

/** This hook will restore the scroll position for element with the given ref
 *  but only within the context of the current parent. When moving between Parent
 *  contexts, the scroll position will be reset to 0.
 *
 *  Parent is here the "category" within the site, e.g. "Komponenter" and "Identitet".
 *  Technically, the Parent is the first part of the current pathname after the host.
 */
export function useScrollRestoration({ ref, key }: useScrollRestoration) {
  const [currentScopedKey, setCurrentScopedKey] = useState<string>('');

  const handleOnScroll = () => {
    window.sessionStorage.setItem(
      currentScopedKey,
      (ref.current?.scrollTop ?? 0).toString(),
    );
  };

  const handleReset = ({
    currentParent,
    scopedKey,
  }: {
    currentParent: string;
    scopedKey: string;
  }) => {
    const prevParent = window.sessionStorage.getItem(`@@scroll-prev-parent`);
    if (prevParent === currentParent) return;

    window.sessionStorage.setItem(scopedKey, '0');
    window.sessionStorage.setItem(`@@scroll-prev-parent`, currentParent);
  };

  useEffect(() => {
    const currentParent =
      removeTrailingSlash(location.pathname)?.split('/')?.[1] ?? '';
    const scopedKey = `@@scroll-${currentParent}-${key}`;

    setCurrentScopedKey(scopedKey);
    handleReset({ currentParent, scopedKey });

    const savedPosition = parseInt(
      window.sessionStorage.getItem(scopedKey) ?? '0',
    );

    ref.current?.scrollTo(0, savedPosition);
  }, [key]);

  return { handleOnScroll };
}
