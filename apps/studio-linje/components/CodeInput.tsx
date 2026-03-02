/**
 * Custom Sanity input that replaces the default plain textarea with a
 * CodeMirror 6 editor for syntax highlighting, line numbers, and bracket matching.
 *
 * The underlying field type stays as `text` (plain string) — this only changes
 * the editing experience, not the stored data.
 *
 * Usage in a schema field:
 *   components: { input: CodeInput },
 *   options: { language: 'jsx' }                    // fixed language
 *   options: { languageSiblingField: 'language' }    // read from sibling field
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { type TextInputProps, set, unset, useFormValue } from 'sanity';

// CodeMirror core
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
} from '@codemirror/view';
import { EditorState, type Extension } from '@codemirror/state';
import {
  defaultKeymap,
  historyKeymap,
  history,
  indentWithTab,
} from '@codemirror/commands';
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  StreamLanguage,
  type StreamParser,
} from '@codemirror/language';
import { closeBrackets } from '@codemirror/autocomplete';

// Language support
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { sass } from '@codemirror/lang-sass';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { shell } from '@codemirror/legacy-modes/mode/shell';

// ---------------------------------------------------------------------------
// Language → extension mapping
// ---------------------------------------------------------------------------

function getLanguageExtension(language: string): Extension {
  switch (language) {
    case 'jsx':
      return javascript({ jsx: true });
    case 'tsx':
      return javascript({ jsx: true, typescript: true });
    case 'javascript':
      return javascript();
    case 'typescript':
      return javascript({ typescript: true });
    case 'css':
      return css();
    case 'scss':
    case 'sass':
      return sass({ indented: language === 'sass' });
    case 'html':
      return html();
    case 'json':
      return json();
    case 'bash':
    case 'shell':
    case 'sh':
      return StreamLanguage.define(shell as StreamParser<unknown>);
    default:
      return javascript({ jsx: true });
  }
}

// ---------------------------------------------------------------------------
// Theme — uses Sanity's CSS variables to blend in with the studio UI
// ---------------------------------------------------------------------------

const editorTheme = EditorView.theme({
  '&': {
    fontSize: '13px',
    border: '1px solid var(--card-border-color)',
    borderRadius: '3px',
  },
  '&.cm-focused': {
    outline: '2px solid var(--card-focus-ring-color)',
    outlineOffset: '-1px',
  },
  '.cm-scroller': {
    fontFamily: '"Fira Code", "Fira Mono", "Roboto Mono", monospace',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--card-bg2-color, #f3f3f6)',
    borderRight: '1px solid var(--card-border-color)',
  },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type CodeInputOptions = {
  language?: string;
  languageSiblingField?: string;
};

export default function CodeInput(props: TextInputProps) {
  const { value, onChange, readOnly, path, schemaType } = props;
  const options = (schemaType.options || {}) as CodeInputOptions;

  // Resolve the language — either a fixed value from options, or read
  // dynamically from a sibling field (e.g. plainCode has a "language" field
  // next to the "code" field).
  const siblingPath = useMemo(
    () =>
      options.languageSiblingField
        ? [...path.slice(0, -1), options.languageSiblingField]
        : ['__nonexistent__'],
    [options.languageSiblingField, path],
  );
  const siblingLanguage = useFormValue(siblingPath) as string | undefined;
  const rawLanguage = options.language || siblingLanguage || 'jsx';
  const language = rawLanguage.trim().toLowerCase() || 'jsx';

  // Keep a ref to onChange so the editor's update listener always calls the
  // latest version without needing to recreate the editor on every render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const extensions = useMemo(
    () => [
      lineNumbers(),
      foldGutter(),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      EditorView.lineWrapping,
      EditorView.editable.of(!readOnly),
      EditorState.readOnly.of(!!readOnly),
      getLanguageExtension(language),
      editorTheme,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const val = update.state.doc.toString();
          onChangeRef.current(val ? set(val) : unset());
        }
      }),
    ],
    [language, readOnly],
  );

  // Mount / unmount the editor. Recreates when language changes.
  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      state: EditorState.create({ doc: value || '', extensions }),
      parent: containerRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [extensions]);

  // Push external value changes into the editor (undo, collaborative edits, resets).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== (value || '')) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value || '' },
      });
    }
  }, [value]);

  return (
    <div ref={containerRef} style={{ maxHeight: 600, overflow: 'auto' }} />
  );
}
