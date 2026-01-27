import React, { useEffect, useMemo, useRef, useState } from 'react';

import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button';
import { ActionChip, FilterChip, TagChip } from '@entur/chip';
import { Checkbox, Radio, RadioGroup, TextField } from '@entur/form';
import {
  BusIcon,
  ColorPickerIcon,
  ComponentIcon,
  IconIcon,
  MenuIcon,
  SearchIcon,
  TokenIcon,
  ToneSmileIcon,
  TrainIcon,
  ViewIcon,
} from '@entur/icons';
import {
  Badge,
  BulletBadge,
  Contrast,
  NotificationBadge,
  StatusBadge,
  Tag,
} from '@entur/layout';
import { LoadingDots } from '@entur/loader';
import { SmallAlertBox } from '@entur/alert';
import { BreadcrumbItem, BreadcrumbNavigation } from '@entur/menu';
import { TravelTag } from '@entur/travel';
import { Heading1, Heading2, Paragraph } from '@entur/typography';

import { SEO } from '@components/seo/SEO';
import {
  LinjeLines,
  LinjeTopographicBottom,
  LinjeTopographicTop,
} from '@media/images/frontpage/BackgroundElements';
import logoDark from '@media/logo/logoDark.svg';

import './stand.scss';

type WordEntry = {
  word: string;
  count: number;
};

type SpriteConfig = {
  id: string;
  content: React.ReactNode;
  className?: string;
  scale?: number;
  floatStrength?: number;
  spin?: number;
};

type SpriteState = {
  config: SpriteConfig;
  element: HTMLSpanElement;
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  scale: number;
  floatStrength: number;
  lastShockwaveId: number;
};

const noop = () => {};

const STORAGE_KEY = 'entur-stand-word-cloud';
const NEW_WORD_TIMEOUT = 1600;

const normalizeTokens = (value: string): string[] => {
  if (!value) {
    return [];
  }

  return value
    .toLowerCase()
    .replace(/[^0-9a-zæøå]+/g, ' ')
    .split(' ')
    .map(token => token.trim())
    .filter(Boolean);
};

const parseStoredEntries = (value: string | null): WordEntry[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(entry => ({
        word: typeof entry?.word === 'string' ? entry.word : '',
        count: Number.isFinite(entry?.count) ? entry.count : 0,
      }))
      .filter(entry => entry.word.length > 0 && entry.count > 0);
  } catch {
    return [];
  }
};

const updateWordEntries = (
  entries: WordEntry[],
  tokens: string[],
): WordEntry[] => {
  if (tokens.length === 0) {
    return entries;
  }

  const nextCounts = new Map(entries.map(entry => [entry.word, entry.count]));
  tokens.forEach(token => {
    const currentCount = nextCounts.get(token) ?? 0;
    nextCounts.set(token, currentCount + 1);
  });

  return Array.from(nextCounts, ([word, count]) => ({ word, count }));
};

const getFontSize = (count: number, maxCount: number) => {
  const minSize = 1.1;
  const maxSize = 3.2;
  if (maxCount <= 1) {
    return `${minSize}rem`;
  }

  const ratio = Math.min((count - 1) / (maxCount - 1), 1);
  return `${minSize + ratio * (maxSize - minSize)}rem`;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const useFloatingSprites = (
  containerRef: React.RefObject<HTMLDivElement>,
  contentRef: React.RefObject<HTMLElement>,
  spriteConfigs: SpriteConfig[],
  spriteRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>,
  shockwaveRef: React.MutableRefObject<number>,
  shockwaveRingRef: React.RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reduceMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    let bounds = container.getBoundingClientRect();
    const cursor = {
      x: bounds.width / 2,
      y: bounds.height / 2,
      active: false,
    };

    const spawnPadding = 32;
    const boundaryPadding = 16;
    const repelRadius = 160;
    const repelStrength = 0.65;
    const contentPadding = 48;
    const contentRepelStrength = 0.55;
    const friction = 0.985;
    const maxSpeed = 1.6;
    const shockwaveStrength = 1.4;
    const shockwaveDuration = 700;
    const shockwaveSpeed = 1.8;
    const shockwaveBaseSize = 20;
    const shockwaveBand = 38;

    const updateBounds = () => {
      bounds = container.getBoundingClientRect();
      if (!cursor.active) {
        cursor.x = bounds.width / 2;
        cursor.y = bounds.height / 2;
      }
    };

    const handleMove = (event: MouseEvent) => {
      cursor.x = event.clientX - bounds.left;
      cursor.y = event.clientY - bounds.top;
      cursor.active = true;
    };

    const handleLeave = () => {
      cursor.active = false;
    };

    const initSpriteStates = (): SpriteState[] => {
      return spriteConfigs
        .map(config => {
          const element = spriteRefs.current[config.id];
          if (!element) {
            return null;
          }

          const rect = element.getBoundingClientRect();
          const width = rect.width || 80;
          const height = rect.height || 48;
          const rangeX = Math.max(0, bounds.width - width - spawnPadding * 2);
          const rangeY = Math.max(0, bounds.height - height - spawnPadding * 2);
          const x = spawnPadding + Math.random() * rangeX;
          const y = spawnPadding + Math.random() * rangeY;
          const scale = config.scale ?? 0.9 + Math.random() * 0.4;
          const spin = config.spin ?? (Math.random() - 0.5) * 0.3;
          const floatStrength = config.floatStrength ?? 0.05;

          element.style.transformOrigin = 'center';

          return {
            config,
            element,
            width,
            height,
            x,
            y,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            rotation: Math.random() * 360,
            spin,
            scale,
            floatStrength,
            lastShockwaveId: 0,
          };
        })
        .filter((sprite): sprite is SpriteState => sprite !== null);
    };

    const applyTransform = (sprite: SpriteState) => {
      sprite.element.style.transform = `translate3d(${sprite.x}px, ${sprite.y}px, 0) rotate(${sprite.rotation}deg) scale(${sprite.scale})`;
    };

    const applyRepelForce = (
      sprite: SpriteState,
      dx: number,
      dy: number,
      distance: number,
      radius: number,
      strength: number,
    ) => {
      if (distance >= radius) {
        return;
      }

      const force = ((radius - distance) / radius) * strength;
      const nx = dx / (distance || 1);
      const ny = dy / (distance || 1);
      sprite.vx += nx * force;
      sprite.vy += ny * force;
      sprite.vx += -ny * force * 0.35;
      sprite.vy += nx * force * 0.35;
    };

    const getContentRect = () => {
      const content = contentRef.current;
      if (!content) {
        return null;
      }

      const rect = content.getBoundingClientRect();
      return {
        left: rect.left - bounds.left - contentPadding,
        right: rect.right - bounds.left + contentPadding,
        top: rect.top - bounds.top - contentPadding,
        bottom: rect.bottom - bounds.top + contentPadding,
      };
    };

    const keepInsideBounds = (sprite: SpriteState) => {
      const minX = boundaryPadding;
      const minY = boundaryPadding;
      const maxX = Math.max(
        minX,
        bounds.width - sprite.width - boundaryPadding,
      );
      const maxY = Math.max(
        minY,
        bounds.height - sprite.height - boundaryPadding,
      );

      if (sprite.x < minX || sprite.x > maxX) {
        sprite.vx *= -0.7;
        sprite.x = clamp(sprite.x, minX, maxX);
      }
      if (sprite.y < minY || sprite.y > maxY) {
        sprite.vy *= -0.7;
        sprite.y = clamp(sprite.y, minY, maxY);
      }
    };

    const spriteStates = initSpriteStates();
    const shockwaveTimeouts = new Map<string, number>();
    let lastShockwaveId = shockwaveRef.current;
    let shockwaveStart = 0;

    if (reduceMotionQuery.matches) {
      spriteStates.forEach(sprite => {
        keepInsideBounds(sprite);
        applyTransform(sprite);
      });
      return;
    }

    let rafId = 0;

    const animate = () => {
      const contentRect = getContentRect();
      const contentCenter = contentRect
        ? {
            x: (contentRect.left + contentRect.right) / 2,
            y: (contentRect.top + contentRect.bottom) / 2,
            radius:
              Math.max(
                contentRect.right - contentRect.left,
                contentRect.bottom - contentRect.top,
              ) * 0.6,
          }
        : null;

      if (shockwaveRef.current !== lastShockwaveId) {
        lastShockwaveId = shockwaveRef.current;
        shockwaveStart = performance.now();
      }

      spriteStates.forEach(sprite => {
        sprite.vx += (Math.random() - 0.5) * sprite.floatStrength;
        sprite.vy += (Math.random() - 0.5) * sprite.floatStrength;

        if (cursor.active) {
          const centerX = sprite.x + sprite.width / 2;
          const centerY = sprite.y + sprite.height / 2;
          const dx = centerX - cursor.x;
          const dy = centerY - cursor.y;
          const distance = Math.hypot(dx, dy);

          if (distance < repelRadius) {
            applyRepelForce(
              sprite,
              dx,
              dy,
              distance,
              repelRadius,
              repelStrength,
            );
          }
        }

        const centerX = sprite.x + sprite.width / 2;
        const centerY = sprite.y + sprite.height / 2;
        if (
          contentRect &&
          contentCenter &&
          centerX > contentRect.left &&
          centerX < contentRect.right &&
          centerY > contentRect.top &&
          centerY < contentRect.bottom
        ) {
          let dx = centerX - contentCenter.x;
          let dy = centerY - contentCenter.y;
          let distance = Math.hypot(dx, dy);

          if (distance < 1) {
            dx = 1;
            dy = 0;
            distance = 1;
          }

          applyRepelForce(
            sprite,
            dx,
            dy,
            distance,
            contentCenter.radius,
            contentRepelStrength,
          );
        }

        if (shockwaveStart > 0 && contentCenter) {
          const elapsed = performance.now() - shockwaveStart;
          const radius = elapsed * shockwaveSpeed;
          const dx = centerX - contentCenter.x;
          const dy = centerY - contentCenter.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (
            sprite.lastShockwaveId !== lastShockwaveId &&
            Math.abs(distance - radius) <= shockwaveBand
          ) {
            const nx = dx / distance;
            const ny = dy / distance;
            sprite.vx += nx * shockwaveStrength;
            sprite.vy += ny * shockwaveStrength;
            sprite.lastShockwaveId = lastShockwaveId;

            sprite.element.classList.add('stand__sprite--shockwave');
            const existingTimeout = shockwaveTimeouts.get(sprite.config.id);
            if (existingTimeout) {
              window.clearTimeout(existingTimeout);
            }
            const timeoutId = window.setTimeout(() => {
              sprite.element.classList.remove('stand__sprite--shockwave');
              shockwaveTimeouts.delete(sprite.config.id);
            }, shockwaveDuration);
            shockwaveTimeouts.set(sprite.config.id, timeoutId);
          }
        }

        sprite.vx *= friction;
        sprite.vy *= friction;
        sprite.vx = clamp(sprite.vx, -maxSpeed, maxSpeed);
        sprite.vy = clamp(sprite.vy, -maxSpeed, maxSpeed);
        sprite.x += sprite.vx;
        sprite.y += sprite.vy;

        keepInsideBounds(sprite);

        sprite.rotation += sprite.spin;
        applyTransform(sprite);
      });

      if (shockwaveStart > 0 && shockwaveRingRef.current) {
        const elapsed = performance.now() - shockwaveStart;
        const radius = elapsed * shockwaveSpeed;
        const maxRadius = Math.hypot(bounds.width, bounds.height) + 120;
        const scale = Math.max(radius / shockwaveBaseSize, 0);
        const opacity = Math.max(1 - elapsed / shockwaveDuration, 0);
        shockwaveRingRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        shockwaveRingRef.current.style.opacity = opacity.toString();
        if (radius > maxRadius) {
          shockwaveStart = 0;
          shockwaveRingRef.current.style.opacity = '0';
        }
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      updateBounds();
      spriteStates.forEach(sprite => {
        keepInsideBounds(sprite);
        applyTransform(sprite);
      });
    };

    updateBounds();
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', handleResize);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(rafId);
      shockwaveTimeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
    };
  }, [
    containerRef,
    contentRef,
    spriteConfigs,
    spriteRefs,
    shockwaveRef,
    shockwaveRingRef,
  ]);
};

const Stand = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const spriteRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const shockwaveRef = useRef(0);
  const shockwaveRingRef = useRef<HTMLDivElement>(null);
  const [shockwaveKey, setShockwaveKey] = useState(0);
  const [shockwaveOrigin, setShockwaveOrigin] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wordEntries, setWordEntries] = useState<WordEntry[]>([]);
  const [recentWords, setRecentWords] = useState<string[]>([]);
  const recentTimeoutsRef = useRef<Map<string, number>>(new Map());

  const spriteConfigs = useMemo<SpriteConfig[]>(
    () => [
      {
        id: 'tag-design',
        content: <Tag tabIndex={-1}>Design</Tag>,
        scale: 0.95,
      },
      {
        id: 'tag-uu',
        content: <Tag tabIndex={-1}>UU</Tag>,
        scale: 0.9,
      },
      {
        id: 'traveltag-train',
        content: (
          <TravelTag transport="train" label="Spor 2">
            Tog
          </TravelTag>
        ),
        className: 'stand__sprite--traveltag',
        scale: 0.95,
      },
      {
        id: 'traveltag-bus',
        content: (
          <TravelTag transport="bus" label="Linje 80">
            Buss
          </TravelTag>
        ),
        className: 'stand__sprite--traveltag',
        scale: 0.92,
      },
      {
        id: 'tagchip-filter',
        content: (
          <TagChip onClose={noop} closeButtonAriaLabel="Fjern filter">
            Filter
          </TagChip>
        ),
        className: 'stand__sprite--chip',
        scale: 0.9,
      },
      {
        id: 'filterchip-grid',
        content: (
          <FilterChip value="grid" defaultChecked tabIndex={-1}>
            Grid
          </FilterChip>
        ),
        className: 'stand__sprite--chip',
        scale: 0.92,
      },
      {
        id: 'chip-komponent',
        content: (
          <ActionChip tabIndex={-1}>
            <TrainIcon aria-hidden="true" />
            Komponent
          </ActionChip>
        ),
        scale: 1,
      },
      {
        id: 'checkbox-tilgjengelig',
        content: (
          <Checkbox checked readOnly tabIndex={-1}>
            Tilgjengelig
          </Checkbox>
        ),
        className: 'stand__sprite--checkbox',
        scale: 0.95,
      },
      {
        id: 'radio-standard',
        content: (
          <RadioGroup name="variant" value="standard" onChange={noop} readOnly>
            <Radio value="standard" tabIndex={-1}>
              Standard
            </Radio>
          </RadioGroup>
        ),
        className: 'stand__sprite--radio',
        scale: 0.92,
      },
      {
        id: 'textfield-sok',
        content: (
          <TextField
            label="Søk"
            value="Linje"
            readOnly
            tabIndex={-1}
            className="stand__sprite__textfield"
          />
        ),
        className: 'stand__sprite--textfield',
        scale: 0.9,
      },
      {
        id: 'alert-oppdatert',
        content: (
          <SmallAlertBox
            variant="information"
            title="Oppdatert"
            width="fit-content"
          >
            Nye tokens
          </SmallAlertBox>
        ),
        className: 'stand__sprite--alert',
        scale: 0.9,
      },
      {
        id: 'statusbadge',
        content: (
          <StatusBadge variant="success" tabIndex={-1}>
            Klar
          </StatusBadge>
        ),
        className: 'stand__sprite--badge',
        scale: 1,
      },
      {
        id: 'bulletbadge',
        content: (
          <BulletBadge variant="information" tabIndex={-1}>
            Info
          </BulletBadge>
        ),
        className: 'stand__sprite--badge',
        scale: 0.95,
      },
      {
        id: 'breadcrumbs',
        content: (
          <BreadcrumbNavigation aria-label="Brødsmulesti">
            <BreadcrumbItem as="span">Hjem</BreadcrumbItem>
            <BreadcrumbItem as="span">Komponenter</BreadcrumbItem>
            <BreadcrumbItem as="span">Knapper</BreadcrumbItem>
          </BreadcrumbNavigation>
        ),
        className: 'stand__sprite--breadcrumbs',
        scale: 0.85,
      },
      {
        id: 'chip-tokens',
        content: (
          <ActionChip tabIndex={-1}>
            <TokenIcon aria-hidden="true" />
            Tokens
          </ActionChip>
        ),
        scale: 0.95,
      },
      {
        id: 'badge-notification',
        content: <NotificationBadge variant="primary">4</NotificationBadge>,
        className: 'stand__sprite--notification',
        scale: 1.05,
      },
      {
        id: 'badge-beta',
        content: (
          <Badge tabIndex={-1} variant="neutral" type="status">
            Beta
          </Badge>
        ),
        scale: 1.1,
      },
      {
        id: 'badge-nytt',
        content: (
          <Badge tabIndex={-1} variant="neutral" type="status">
            Nytt
          </Badge>
        ),
        scale: 1.05,
      },
      {
        id: 'button-samarbeid',
        content: (
          <PrimaryButton tabIndex={-1} size="small" type="button">
            Samarbeid
          </PrimaryButton>
        ),
        scale: 1.05,
      },
      {
        id: 'button-oppdag',
        content: (
          <SecondaryButton tabIndex={-1} size="small" type="button">
            Oppdag
          </SecondaryButton>
        ),
        scale: 1,
      },
      {
        id: 'icon-button-menu',
        content: (
          <IconButton tabIndex={-1} aria-label="Meny">
            <MenuIcon aria-hidden="true" />
          </IconButton>
        ),
        className: 'stand__sprite--icon-button',
        scale: 1,
      },
      {
        id: 'icon-button-search',
        content: (
          <IconButton tabIndex={-1} aria-label="Søk">
            <SearchIcon aria-hidden="true" />
          </IconButton>
        ),
        className: 'stand__sprite--icon-button',
        scale: 1,
      },
      {
        id: 'dots',
        content: <LoadingDots aria-hidden="true" />,
        scale: 0.9,
        floatStrength: 0.08,
      },
      {
        id: 'icon-component',
        content: <ComponentIcon aria-hidden="true" />,
        className: 'stand__sprite--icon',
        scale: 1.15,
      },
      {
        id: 'icon-bus',
        content: <BusIcon aria-hidden="true" />,
        className: 'stand__sprite--icon',
        scale: 1.2,
      },
      {
        id: 'icon-illustration',
        content: <ColorPickerIcon aria-hidden="true" />,
        className: 'stand__sprite--icon stand__sprite--icon-large',
        scale: 1.1,
      },
      {
        id: 'icon-assets',
        content: <IconIcon aria-hidden="true" />,
        className: 'stand__sprite--icon stand__sprite--icon-small',
        scale: 1,
      },
      {
        id: 'icon-tone',
        content: <ToneSmileIcon aria-hidden="true" />,
        className: 'stand__sprite--icon',
        scale: 1.05,
      },
      {
        id: 'icon-uu',
        content: <ViewIcon aria-hidden="true" />,
        className: 'stand__sprite--icon',
        scale: 1.05,
      },
    ],
    [],
  );

  useFloatingSprites(
    containerRef,
    contentRef,
    spriteConfigs,
    spriteRefs,
    shockwaveRef,
    shockwaveRingRef,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedEntries = parseStoredEntries(
      window.localStorage.getItem(STORAGE_KEY),
    );
    if (storedEntries.length > 0) {
      setWordEntries(storedEntries);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wordEntries));
  }, [wordEntries]);

  useEffect(() => {
    return () => {
      recentTimeoutsRef.current.forEach(timeoutId => {
        window.clearTimeout(timeoutId);
      });
      recentTimeoutsRef.current.clear();
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value.replace(/\s+/g, '');
    setInputValue(nextValue);
    if (errorMessage && nextValue.length > 0) {
      setErrorMessage(null);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  const registerRecentWords = (tokens: string[]) => {
    if (tokens.length === 0 || typeof window === 'undefined') {
      return;
    }

    const uniqueTokens = Array.from(new Set(tokens));
    setRecentWords(previous =>
      Array.from(new Set([...previous, ...uniqueTokens])),
    );

    uniqueTokens.forEach(word => {
      const existingTimeout = recentTimeoutsRef.current.get(word);
      if (existingTimeout) {
        window.clearTimeout(existingTimeout);
      }

      const timeoutId = window.setTimeout(() => {
        setRecentWords(previous => previous.filter(entry => entry !== word));
        recentTimeoutsRef.current.delete(word);
      }, NEW_WORD_TIMEOUT);

      recentTimeoutsRef.current.set(word, timeoutId);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokens = normalizeTokens(inputValue);
    if (tokens.length === 0) {
      setErrorMessage('Du må legge til tekst.');
      return;
    }

    setWordEntries(previous => updateWordEntries(previous, tokens));
    registerRecentWords(tokens);
    setInputValue('');
    setErrorMessage(null);
    shockwaveRef.current += 1;
    const containerBounds = containerRef.current?.getBoundingClientRect();
    const contentBounds = contentRef.current?.getBoundingClientRect();
    if (containerBounds) {
      const centerX = contentBounds
        ? (contentBounds.left + contentBounds.right) / 2 - containerBounds.left
        : containerBounds.width / 2;
      const centerY = contentBounds
        ? (contentBounds.top + contentBounds.bottom) / 2 - containerBounds.top
        : containerBounds.height / 2;
      setShockwaveOrigin({ x: centerX, y: centerY });
      setShockwaveKey(previous => previous + 1);
    }
    inputRef.current?.focus();
  };

  const sortedWords = useMemo(() => {
    return [...wordEntries].sort((a, b) => {
      if (a.count === b.count) {
        return a.word.localeCompare(b.word);
      }
      return b.count - a.count;
    });
  }, [wordEntries]);

  const maxCount = useMemo(() => {
    return sortedWords.reduce((max, entry) => Math.max(max, entry.count), 1);
  }, [sortedWords]);

  return (
    <Contrast data-color-mode="contrast">
      <div ref={containerRef} className="stand">
        <div className="stand__background" aria-hidden="true">
          <LinjeTopographicBottom className="stand__background__topographic-bottom" />
          <LinjeTopographicTop className="stand__background__topographic-top" />
          <LinjeLines className="stand__background__lines" />
          <div className="stand__background__sprites">
            {spriteConfigs.map(sprite => (
              <span
                key={sprite.id}
                ref={element => {
                  spriteRefs.current[sprite.id] = element;
                }}
                className={`stand__sprite${
                  sprite.className ? ` ${sprite.className}` : ''
                }`}
              >
                {sprite.content}
              </span>
            ))}
          </div>
        </div>
        <div
          key={shockwaveKey}
          className="stand__shockwave"
          aria-hidden="true"
          ref={shockwaveRingRef}
          style={
            {
              '--shockwave-x': `${shockwaveOrigin.x}px`,
              '--shockwave-y': `${shockwaveOrigin.y}px`,
            } as React.CSSProperties
          }
        />
        <main ref={contentRef} className="stand__main">
          <header className="stand__hero">
            <Heading1 className="stand__title">
              <span className="stand__title__logo">
                <img src={logoDark} height="80" width="256" alt="Entur" />
              </span>
              <span className="stand__title__text">Linje</span>
            </Heading1>
            <Paragraph className="stand__subtitle">
              Entur sitt designsystem!
            </Paragraph>
          </header>
          <section className="stand__question">
            <Heading2>Et ord du forbinder med designsystem</Heading2>
            <form className="stand__question__form" onSubmit={handleSubmit}>
              <TextField
                label="Ditt ord"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                ref={inputRef}
                className="stand__question__field"
                feedback={errorMessage ?? undefined}
                variant={errorMessage ? 'negative' : undefined}
                ariaAlertOnFeedback="status"
              />
              <PrimaryButton type="submit">Legg til</PrimaryButton>
            </form>
          </section>
          <section className="stand__cloud">
            <Paragraph className="stand__cloud__intro">
              Ordene under bygges av alle som bidrar.
            </Paragraph>
            <div className="stand__cloud__words">
              {sortedWords.length === 0 && (
                <span className="stand__cloud__empty">
                  Del dine første ord for å starte skyen.
                </span>
              )}
              {sortedWords.map(entry => {
                const isRecent = recentWords.includes(entry.word);
                return (
                  <span
                    key={entry.word}
                    className={`stand__cloud__word${
                      isRecent ? ' stand__cloud__word--new' : ''
                    }`}
                    style={{
                      fontSize: getFontSize(entry.count, maxCount),
                      fontWeight: Math.min(700, 400 + entry.count * 20),
                    }}
                  >
                    {entry.word}
                  </span>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </Contrast>
  );
};

export default Stand;

export const Head = () => {
  return <SEO title="Stand" />;
};
