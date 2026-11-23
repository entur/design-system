import React, { useEffect, useRef, useState } from 'react';
import { SecondaryButton } from '@entur/button';
import {
  CalendarDate,
  DatePicker,
  NativeDatePicker,
  NativeTimePicker,
  SimpleTimePicker,
  Time,
  TimePicker,
} from '@entur/datepicker';
import {
  Dropdown,
  MultiSelect,
  NativeDropdown,
  SearchableDropdown,
} from '@entur/dropdown';
import { Checkbox, TextArea, TextField } from '@entur/form';
import {
  DataCell,
  EditableCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { Heading2, Heading3, Paragraph } from '@entur/typography';

/* ------------------------------------------------------------------ *
 * PR #560: test bench for linking feedback text to form fields and for read-only Checkbox
 *
 * Each scenario renders real components and runs checks against the
 * DOM: aria-describedby is resolved to the text it points to. The
 * checks rerun when the DOM changes, so they also work after you click
 * and type.
 *
 * To see that the checks catch the bug: copy this file to main and
 * open the playground there. The "fix" checks should then fail.
 * ------------------------------------------------------------------ */

type CheckResult = true | string;
type Check = { name: string; run: (stage: HTMLElement) => CheckResult };

const idsOf = (el: Element | null) =>
  (el?.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);

const describedText = (el: Element | null) =>
  idsOf(el)
    .map(
      id =>
        el?.ownerDocument.getElementById(id)?.textContent?.trim() ||
        `⟨#${id} mangler eller er tom⟩`,
    )
    .join(' | ');

const pick = (stage: HTMLElement, selector: string) =>
  stage.querySelector(selector);

/** The field found with `selector` is described by `text` */
const describedBy = (
  selector: string,
  text: string,
  name = `${selector} beskrives av «${text}»`,
): Check => ({
  name,
  run: stage => {
    const el = pick(stage, selector);
    if (!el) return `fant ikke ${selector}`;
    const desc = describedText(el);
    return desc.includes(text) || `beskrivelse: «${desc || '(ingen)'}»`;
  },
});

/** The field found with `selector` is NOT described by `text` */
const notDescribedBy = (
  selector: string,
  text: string,
  name = `${selector} beskrives ikke av «${text}»`,
): Check => ({
  name,
  run: stage => {
    const el = pick(stage, selector);
    if (!el) return `fant ikke ${selector}`;
    const desc = describedText(el);
    return !desc.includes(text) || `beskrivelse: «${desc}»`;
  },
});

/** The first ID in aria-describedby points to `text` (the consumer's ID comes first) */
const firstDescriptionIs = (selector: string, text: string): Check => ({
  name: `${selector}: aria-describedby fra konsumenten står først («${text}»)`,
  run: stage => {
    const el = pick(stage, selector);
    if (!el) return `fant ikke ${selector}`;
    const [first] = idsOf(el);
    const firstText = first
      ? el.ownerDocument.getElementById(first)?.textContent?.trim()
      : undefined;
    return firstText === text || `første er «${firstText ?? '(ingen)'}»`;
  },
});

/** No aria-describedby in the scenario points to an ID that doesn't exist */
const noDanglingRefs: Check = {
  name: 'Ingen aria-describedby peker på en id som ikke finnes',
  run: stage => {
    const broken = Array.from(stage.querySelectorAll('[aria-describedby]'))
      .flatMap(el => idsOf(el))
      .filter(id => !stage.ownerDocument.getElementById(id));
    return broken.length === 0 || `mangler: ${broken.join(', ')}`;
  },
};

/** No duplicate IDs in the scenario */
const uniqueIds: Check = {
  name: 'Ingen dupliserte id-er',
  run: stage => {
    const ids = Array.from(stage.querySelectorAll('[id]')).map(e => e.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    return (
      dupes.length === 0 || `duplikater: ${[...new Set(dupes)].join(', ')}`
    );
  },
};

/* ------------------------------ UI ------------------------------ */

const useLiveChecks = (checks: Check[]) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [fields, setFields] = useState<{ label: string; desc: string }[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setResults(checks.map(c => c.run(stage)));
        setFields(
          Array.from(stage.querySelectorAll('[aria-describedby]')).map(el => ({
            label:
              el.getAttribute('aria-label') ||
              el
                .getAttribute('aria-labelledby')
                ?.split(' ')
                .map(id => el.ownerDocument.getElementById(id)?.textContent)
                .join(' ')
                .trim() ||
              `<${el.tagName.toLowerCase()}${
                el.getAttribute('role')
                  ? ` role=${el.getAttribute('role')}`
                  : ''
              }>`,
            desc: describedText(el),
          })),
        );
      });
    };
    run();
    const observer = new MutationObserver(run);
    observer.observe(stage, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    stage.addEventListener('focusin', run);
    return () => {
      observer.disconnect();
      stage.removeEventListener('focusin', run);
      cancelAnimationFrame(frame);
    };
    // checks are defined inline per render; rerunning on every mutation is enough
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stageRef, results, fields };
};

const Scenario = ({
  id,
  title,
  kind,
  manual,
  checks = [],
  children,
}: {
  id: string;
  title: string;
  kind: 'fix' | 'regresjon' | 'kjent hull';
  manual?: string[];
  checks?: Check[];
  children: React.ReactNode;
}) => {
  const { stageRef, results, fields } = useLiveChecks(checks);
  const failed = results.filter(r => r !== true).length;
  return (
    <section
      data-scenario={id}
      data-failed={failed}
      style={{
        border: `2px solid ${failed ? '#d31b1b' : '#1a8e60'}`,
        borderRadius: 8,
        padding: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      <Heading3 margin="bottom">
        {failed ? '❌' : '✅'} [{kind}] {title}
      </Heading3>
      <div ref={stageRef} style={{ display: 'grid', gap: '1rem' }}>
        {children}
      </div>
      {checks.length > 0 && (
        <ul style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {checks.map((c, i) => (
            <li key={c.name} data-check-ok={results[i] === true}>
              {results[i] === true ? '✅' : '❌'} {c.name}
              {results[i] !== true && results[i] !== undefined && (
                <span style={{ color: '#d31b1b' }}> → {results[i]}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <details>
        <summary>Alle felt med aria-describedby ({fields.length})</summary>
        <ul style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {fields.map((f, i) => (
            <li key={i}>
              {f.label} → «{f.desc}»
            </li>
          ))}
        </ul>
      </details>
      {manual && (
        <>
          <Paragraph margin="none">
            <strong>Skjermleser/tastatur:</strong>
          </Paragraph>
          <ol>
            {manual.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
};

/* --------------------------- Test data --------------------------- */

const cities = [
  { label: 'Oslo', value: 'osl' },
  { label: 'Bergen', value: 'bgo' },
  { label: 'Trondheim', value: 'trd' },
];

const FB = 'Feil: velg noe gyldig';
const HINT = 'Hjelpetekst fra konsumenten';

/* --------------------------- Scenarios --------------------------- */

const Hint = ({ id }: { id: string }) => (
  <p id={id} style={{ margin: 0, fontSize: 12 }}>
    {HINT}
  </p>
);

const TextFieldsFix = () => (
  <Scenario
    id="text"
    kind="fix"
    title="TextField og TextArea peker på feedback-teksten"
    checks={[
      describedBy('[data-t=tf] input', FB),
      describedBy('[data-t=ta] textarea', FB),
      describedBy('[data-t=stp] input', FB, 'SimpleTimePicker (via TextField)'),
      noDanglingRefs,
    ]}
    manual={[
      'Tab til «Navn». Forventet: «ugyldig» + «Feil: velg noe gyldig».',
      'Tab til «Kommentar» og «Tid (enkel)». Samme forventning.',
    ]}
  >
    <div data-t="tf">
      <TextField label="Navn" variant="negative" feedback={FB} />
    </div>
    <div data-t="ta">
      <TextArea label="Kommentar" variant="negative" feedback={FB} />
    </div>
    <div data-t="stp">
      <SimpleTimePicker
        label="Tid (enkel)"
        selectedTime={null}
        onChange={() => undefined}
        variant="negative"
        feedback={FB}
      />
    </div>
  </Scenario>
);

const MultiSelectWrapper = (
  props: Partial<React.ComponentProps<typeof MultiSelect>>,
) => {
  const [selected, setSelected] = useState(props.selectedItems ?? []);
  return (
    <MultiSelect
      label="Byer (flervalg)"
      items={cities}
      selectedItems={selected}
      onChange={setSelected}
      {...props}
    />
  );
};

const DropdownsFix = () => {
  const [city, setCity] = useState<(typeof cities)[number] | null>(null);
  return (
    <Scenario
      id="dropdowns"
      kind="fix"
      title="Dropdown, NativeDropdown, SearchableDropdown og MultiSelect"
      checks={[
        describedBy('[data-t=dd] [role=combobox]', FB, 'Dropdown (combobox)'),
        describedBy('[data-t=nd] select', FB, 'NativeDropdown (select)'),
        describedBy('[data-t=sd] input', FB, 'SearchableDropdown (input)'),
        describedBy('[data-t=ms] input', FB, 'MultiSelect (input)'),
        noDanglingRefs,
      ]}
      manual={[
        'Tab gjennom alle fire. Hver skal lese «Feil: velg noe gyldig» etter navnet.',
        'Åpne listene med Alt+Pil ned / Enter og velg noe. Fungerer valg og lukking som før?',
      ]}
    >
      <div data-t="dd">
        <Dropdown
          label="By"
          items={cities}
          selectedItem={city}
          onChange={setCity}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="nd">
        <NativeDropdown
          label="By (native)"
          items={cities}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="sd">
        <SearchableDropdown
          label="By (søkbar)"
          items={cities}
          selectedItem={city}
          onChange={setCity}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="ms">
        <MultiSelectWrapper variant="negative" feedback={FB} />
      </div>
    </Scenario>
  );
};

const DatePickersFix = () => {
  const [date, setDate] = useState<CalendarDate | null>(
    new CalendarDate(2026, 11, 23),
  );
  const [time, setTime] = useState<Time | null>(new Time(12, 30));
  return (
    <Scenario
      id="dates"
      kind="fix"
      title="DatePicker, TimePicker, NativeDatePicker og NativeTimePicker"
      checks={[
        {
          name: 'DatePicker: nøyaktig ett segment beskrives av feedback (det første)',
          run: stage => {
            const segs = Array.from(
              stage.querySelectorAll('[data-t=dp] [role=spinbutton]'),
            );
            if (!segs.length) return 'fant ingen segmenter';
            const withFb = segs.filter(s => describedText(s).includes(FB));
            if (withFb.length !== 1)
              return `${withFb.length} av ${segs.length} segmenter har feedback`;
            return withFb[0] === segs[0] || 'det er ikke det første segmentet';
          },
        },
        {
          name: 'TimePicker: hvert segment beskrives av feedback',
          run: stage => {
            const segs = Array.from(
              stage.querySelectorAll('[data-t=tp] [role=spinbutton]'),
            );
            if (!segs.length) return 'fant ingen segmenter';
            const missing = segs.filter(s => !describedText(s).includes(FB));
            return missing.length === 0 || `${missing.length} mangler`;
          },
        },
        {
          name: 'TimePicker: hvert segment beholder beskrivelsen «valgt tid» (regresjon)',
          run: stage => {
            const segs = Array.from(
              stage.querySelectorAll('[data-t=tp] [role=spinbutton]'),
            );
            if (!segs.length) return 'fant ingen segmenter';
            const missing = segs.filter(
              s => !/valgt tid/i.test(describedText(s)),
            );
            return (
              missing.length === 0 || `${missing.length} mangler «valgt tid»`
            );
          },
        },
        describedBy('[data-t=ndp] input', FB, 'NativeDatePicker (input)'),
        describedBy('[data-t=ntp] input', FB, 'NativeTimePicker (input)'),
        noDanglingRefs,
      ]}
      manual={[
        'Tab inn i «Dato». Første segment leser feedback, piltast høyre leser den IKKE på nytt.',
        'Tab inn i «Tid». Hvert segment leser valgt tid + feedback.',
        'Åpne kalenderen, velg en dato, lukk med Escape. Går fokus tilbake til feltet?',
      ]}
    >
      <div data-t="dp">
        <DatePicker
          label="Dato"
          selectedDate={date}
          onChange={setDate}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="tp">
        <TimePicker
          label="Tid"
          selectedTime={time}
          onChange={t => setTime(t as Time | null)}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="ndp">
        <NativeDatePicker
          label="Dato (native)"
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="ntp">
        <NativeTimePicker
          label="Tid (native)"
          variant="negative"
          feedback={FB}
        />
      </div>
    </Scenario>
  );
};

const readOnlyChecks = (t: string, expectChecked: boolean): Check[] => [
  {
    name: `[${t}] er ${expectChecked ? 'avkrysset' : 'ikke avkrysset'}`,
    run: stage => {
      const input = pick(
        stage,
        `[data-t=${t}] input`,
      ) as HTMLInputElement | null;
      if (!input) return 'fant ikke checkbox';
      return input.checked === expectChecked || `checked=${input.checked}`;
    },
  },
];

const CheckboxReadOnlyFix = () => {
  const [controlled, setControlled] = useState(true);
  const [changeCount, setChangeCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const simulate = () => {
    document
      .querySelectorAll<HTMLInputElement>(
        '[data-scenario=checkbox-ro] input[type=checkbox]',
      )
      .forEach(i => i.click());
  };
  return (
    <Scenario
      id="checkbox-ro"
      kind="fix"
      title="Checkbox med readOnly kan ikke endres med mus eller tastatur"
      checks={[
        ...readOnlyChecks('ro-controlled', true),
        ...readOnlyChecks('ro-uncontrolled', true),
        {
          name: 'onChange og onClick kalles ikke for readOnly',
          run: stage => {
            const c = stage.querySelector('[data-counts]')?.textContent;
            return c === 'onChange=0 onClick=0' || c || 'ingen teller';
          },
        },
      ]}
      manual={[
        'Klikk på boksene og teksten. De skal forbli avkrysset, tellerne skal stå på 0.',
        'Tab til en boks og trykk Mellomrom. Ingen endring.',
        'Skjermleser: leses som «avkrysset, skrivebeskyttet» (eller tilsvarende).',
      ]}
    >
      <div data-t="ro-controlled">
        <Checkbox
          readOnly
          checked={controlled}
          onChange={e => {
            setChangeCount(n => n + 1);
            setControlled(e.target.checked);
          }}
          onClick={() => setClickCount(n => n + 1)}
        >
          Skrivebeskyttet (kontrollert)
        </Checkbox>
      </div>
      <div data-t="ro-uncontrolled">
        <Checkbox
          readOnly
          defaultChecked
          onChange={() => setChangeCount(n => n + 1)}
          onClick={() => setClickCount(n => n + 1)}
        >
          Skrivebeskyttet (ukontrollert, defaultChecked)
        </Checkbox>
      </div>
      <Paragraph margin="none" data-counts>
        {`onChange=${changeCount} onClick=${clickCount}`}
      </Paragraph>
      <SecondaryButton onClick={simulate} width="auto">
        Simuler klikk på begge
      </SecondaryButton>
    </Scenario>
  );
};

/* -------------------------- Regressions -------------------------- */

const CheckboxNormalRegression = () => {
  const [checked, setChecked] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  return (
    <Scenario
      id="checkbox-normal"
      kind="regresjon"
      title="Vanlig Checkbox endres og kaller onChange/onClick som før"
      checks={[
        {
          name: 'Etter klikk: onChange og onClick er kalt like mange ganger som klikk',
          run: stage => {
            const c = stage.querySelector('[data-counts]')?.textContent ?? '';
            const [, ch, cl] = c.match(/onChange=(\d+) onClick=(\d+)/) ?? [];
            return ch === cl || c;
          },
        },
        {
          name: 'checked følger antall klikk (kontrollert)',
          run: stage => {
            const input = pick(stage, '[data-t=cb] input') as HTMLInputElement;
            const c = stage.querySelector('[data-counts]')?.textContent ?? '';
            const n = Number(c.match(/onChange=(\d+)/)?.[1] ?? 0);
            return (
              input?.checked === (n % 2 === 1) || `checked=${input?.checked}`
            );
          },
        },
      ]}
      manual={[
        'Klikk på boksen og teksten noen ganger, og trykk Mellomrom med fokus. Teller og avkrysning skal følge hverandre.',
        'Indeterminate: klikk på «Delvis». Den skal kunne endres.',
      ]}
    >
      <div data-t="cb">
        <Checkbox
          checked={checked}
          onChange={e => {
            setChangeCount(n => n + 1);
            setChecked(e.target.checked);
          }}
          onClick={() => setClickCount(n => n + 1)}
        >
          Vanlig avkrysningsboks
        </Checkbox>
      </div>
      <Checkbox defaultChecked={false}>Ukontrollert</Checkbox>
      <Checkbox checked="indeterminate" onChange={() => undefined}>
        Delvis
      </Checkbox>
      <Checkbox disabled defaultChecked>
        Deaktivert
      </Checkbox>
      <Paragraph margin="none" data-counts>
        {`onChange=${changeCount} onClick=${clickCount}`}
      </Paragraph>
    </Scenario>
  );
};

const DynamicFeedbackRegression = () => {
  const [show, setShow] = useState(true);
  const variant = show ? 'negative' : undefined;
  const feedback = show ? FB : undefined;
  const [city, setCity] = useState<(typeof cities)[number] | null>(null);
  const shown: Check[] = [
    describedBy('[data-t=dtf] input', FB, 'TextField beskrives av feedback'),
    describedBy(
      '[data-t=ddd] [role=combobox]',
      FB,
      'Dropdown beskrives av feedback',
    ),
    describedBy('[data-t=dms] input', FB, 'MultiSelect beskrives av feedback'),
  ];
  const hidden: Check[] = [
    notDescribedBy(
      '[data-t=dtf] input',
      FB,
      'TextField: ingen gammel feedback',
    ),
    {
      name: 'TextField: ingen aria-describedby når det ikke er feedback',
      run: stage =>
        !pick(stage, '[data-t=dtf] input')?.hasAttribute('aria-describedby') ||
        `aria-describedby="${pick(stage, '[data-t=dtf] input')?.getAttribute(
          'aria-describedby',
        )}"`,
    },
    notDescribedBy(
      '[data-t=ddd] [role=combobox]',
      FB,
      'Dropdown: ingen gammel feedback',
    ),
    notDescribedBy(
      '[data-t=dms] input',
      FB,
      'MultiSelect: ingen gammel feedback',
    ),
  ];
  return (
    <Scenario
      key={String(show)}
      id="dynamic"
      kind="regresjon"
      title={`Feedback som kommer og går (nå: ${show ? 'vises' : 'skjult'})`}
      checks={[...(show ? shown : hidden), noDanglingRefs]}
      manual={[
        'Slå feedback av/på med knappen. Sjekkene skal være grønne i begge tilstander.',
        'Med skjermleser i «Navn» og ariaAlertOnFeedback: slå feedback på. Den skal annonseres én gang, som før.',
      ]}
    >
      <SecondaryButton onClick={() => setShow(s => !s)} width="auto">
        {show ? 'Skjul feedback' : 'Vis feedback'}
      </SecondaryButton>
      <div data-t="dtf">
        <TextField
          label="Navn (dynamisk)"
          variant={variant}
          feedback={feedback}
          ariaAlertOnFeedback
        />
      </div>
      <div data-t="ddd">
        <Dropdown
          label="By (dynamisk)"
          items={cities}
          selectedItem={city}
          onChange={setCity}
          variant={variant}
          feedback={feedback}
        />
      </div>
      <div data-t="dms">
        <MultiSelectWrapper variant={variant} feedback={feedback} />
      </div>
    </Scenario>
  );
};

const ConsumerDescribedByRegression = () => {
  const [city, setCity] = useState<(typeof cities)[number] | null>(null);
  const [date, setDate] = useState<CalendarDate | null>(
    new CalendarDate(2026, 11, 23),
  );
  return (
    <Scenario
      id="consumer"
      kind="regresjon"
      title="aria-describedby fra konsumenten beholdes og står først"
      checks={[
        firstDescriptionIs('[data-t=ctf] input', HINT),
        describedBy(
          '[data-t=ctf] input',
          FB,
          'TextField har både hint og feedback',
        ),
        firstDescriptionIs('[data-t=cdd] [role=combobox]', HINT),
        firstDescriptionIs('[data-t=csd] input', HINT),
        {
          name: 'SearchableDropdown: wrapperen har ikke lenger aria-describedby (flyttet til input)',
          run: stage => {
            const wrappers = Array.from(
              stage.querySelectorAll('[data-t=csd] [aria-describedby]'),
            ).filter(el => el.tagName !== 'INPUT' && el.tagName !== 'SPAN');
            return wrappers.length === 0 || `${wrappers.length} wrapper(e)`;
          },
        },
        firstDescriptionIs('[data-t=cms] input', HINT),
        describedBy(
          '[data-t=cdp] [role=spinbutton]',
          HINT,
          'DatePicker: hint på første segment',
        ),
        {
          name: 'DatePicker: react-aria sin beskrivelse av valgt dato er ikke erstattet',
          run: stage => {
            const seg = pick(stage, '[data-t=cdp] [role=spinbutton]');
            if (!seg) return 'fant ikke segment';
            const others = idsOf(seg).filter(id => {
              const t = seg.ownerDocument.getElementById(id)?.textContent ?? '';
              return !t.includes(HINT) && !t.includes(FB);
            });
            return others.length > 0 || `bare: «${describedText(seg)}»`;
          },
        },
        noDanglingRefs,
      ]}
      manual={[
        'Tab til hvert felt. Hjelpeteksten leses før feedback-teksten.',
        'DatePicker: valgt dato leses fortsatt i tillegg til hjelpeteksten.',
      ]}
    >
      <div data-t="ctf">
        <Hint id="hint-tf" />
        <TextField
          label="Navn"
          aria-describedby="hint-tf"
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="cdd">
        <Hint id="hint-dd" />
        <Dropdown
          label="By"
          aria-describedby="hint-dd"
          items={cities}
          selectedItem={city}
          onChange={setCity}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="csd">
        <Hint id="hint-sd" />
        <SearchableDropdown
          label="By (søkbar)"
          aria-describedby="hint-sd"
          items={cities}
          selectedItem={city}
          onChange={setCity}
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="cms">
        <Hint id="hint-ms" />
        <MultiSelectWrapper
          aria-describedby="hint-ms"
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="cdp">
        <Hint id="hint-dp" />
        <DatePicker
          label="Dato"
          aria-describedby="hint-dp"
          selectedDate={date}
          onChange={setDate}
          variant="negative"
          feedback={FB}
        />
      </div>
    </Scenario>
  );
};

const EdgeCasesRegression = () => {
  const [date, setDate] = useState<CalendarDate | null>(
    new CalendarDate(2026, 1, 1),
  );
  return (
    <Scenario
      id="edge"
      kind="regresjon"
      title="Kanttilfeller: feedbackProps.id, feedback uten variant, validering, flere like felt"
      checks={[
        {
          name: 'feedbackProps.id brukes som id på feedback-teksten',
          run: stage => {
            const input = pick(stage, '[data-t=fid] input');
            const el = stage.ownerDocument.getElementById(
              'min-egen-feedback-id',
            );
            if (!el) return 'ingen element med id=min-egen-feedback-id';
            return (
              idsOf(input).includes('min-egen-feedback-id') ||
              `ids: ${idsOf(input).join(' ')}`
            );
          },
        },
        {
          name: 'Feedback uten variant: vises ikke og kobles ikke',
          run: stage =>
            !pick(stage, '[data-t=nov] input')?.hasAttribute(
              'aria-describedby',
            ) || 'har aria-describedby',
        },
        describedBy(
          '[data-t=val] [role=spinbutton]',
          'Datoen er for tidlig',
          'DatePicker: validationFeedback (minDate) kobles til feltet',
        ),
        uniqueIds,
        noDanglingRefs,
      ]}
      manual={[
        '«Dato (validering)» har minDate 01.06.2026. Endre dato til etter det. Feedback skal forsvinne fra både skjerm og beskrivelse.',
      ]}
    >
      <div data-t="fid">
        <TextField
          label="Egen feedback-id"
          variant="negative"
          feedback={FB}
          feedbackProps={{ id: 'min-egen-feedback-id' }}
        />
      </div>
      <div data-t="nov">
        <TextField label="Feedback uten variant" feedback={FB} />
      </div>
      <div data-t="val">
        <DatePicker
          label="Dato (validering)"
          selectedDate={date}
          onChange={setDate}
          minDate={new CalendarDate(2026, 6, 1)}
          validationVariant="negative"
          validationFeedback="Datoen er for tidlig"
        />
      </div>
      <div data-t="dup">
        <TextField label="Likt felt" variant="negative" feedback={FB} />
        <TextField label="Likt felt" variant="negative" feedback={FB} />
      </div>
    </Scenario>
  );
};

const ReadOnlyRegression = () => {
  const [city] = useState<(typeof cities)[number] | null>(cities[0]);
  return (
    <Scenario
      id="readonly"
      kind="regresjon"
      title="readOnly-felt beholder beskrivelsene sine"
      checks={[
        describedBy(
          '[data-t=rsd] input',
          FB,
          'SearchableDropdown readOnly: input beskrives av feedback',
        ),
        {
          // VoiceOver read the old bare span with tabindex as «Oslo, group»,
          // without label, invalid or description. The focused element must be a real field
          name: 'SearchableDropdown readOnly: fokusert element har rolle, navn fra label og aria-invalid',
          run: stage => {
            const el = pick(stage, '[data-t=rsd] input');
            if (!el) return 'fant ikke fokuserbart element';
            const missing = [
              !el.getAttribute('role') &&
                !/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName) &&
                'rolle',
              !el.getAttribute('aria-labelledby') &&
                !el.getAttribute('aria-label') &&
                'navn (aria-labelledby)',
              el.getAttribute('aria-invalid') !== 'true' && 'aria-invalid',
            ].filter(Boolean);
            return missing.length === 0 || `mangler: ${missing.join(', ')}`;
          },
        },
        describedBy(
          '[data-t=rms] input',
          'Oslo',
          'MultiSelect readOnly: valgte elementer leses fortsatt',
        ),
        describedBy(
          '[data-t=rms] input',
          FB,
          'MultiSelect readOnly: og feedback',
        ),
        noDanglingRefs,
      ]}
      manual={['Tab til feltene. Valgte verdier og feedback skal leses.']}
    >
      <div data-t="rsd">
        <SearchableDropdown
          label="By (søkbar, readOnly)"
          items={cities}
          selectedItem={city}
          onChange={() => undefined}
          readOnly
          variant="negative"
          feedback={FB}
        />
      </div>
      <div data-t="rms">
        <MultiSelectWrapper
          readOnly
          selectedItems={[cities[0], cities[1]]}
          variant="negative"
          feedback={FB}
        />
      </div>
    </Scenario>
  );
};

const isInvalid = (selector: string, name: string): Check => ({
  name,
  run: stage => {
    const el = pick(stage, selector);
    if (!el) return `fant ikke ${selector}`;
    return (
      el.getAttribute('aria-invalid') === 'true' ||
      `aria-invalid="${el.getAttribute('aria-invalid')}"`
    );
  },
});

/* EditableCell is the only place in our code that sets a variant
 * through VariantProvider. The cell's feedback is shown in a Tooltip, so
 * #560's link to the feedback text doesn't apply here. What matters is that
 * the field is marked invalid. The dropdowns only read their own variant
 * prop, so they miss the cell's variant. That gap existed before #560. */
const EditableCellScenario = () => {
  const [city, setCity] = useState<(typeof cities)[number] | null>(null);
  return (
    <Scenario
      id="editable-cell"
      kind="kjent hull"
      title="EditableCell variant=negative: feltet markeres som ugyldig"
      checks={[
        isInvalid(
          '[data-t=ec-tf] input',
          'TextField i negativ celle har aria-invalid="true"',
        ),
        isInvalid(
          '[data-t=ec-dd] [role=combobox]',
          'Dropdown i negativ celle har aria-invalid="true" (kjent hull fra før #560, ikke en regresjon)',
        ),
        noDanglingRefs,
      ]}
      manual={[
        'Tab til feltene i tabellen. Begge skal leses som «ugyldig».',
        'Hover/fokus viser feilmeldingen i en tooltip. Leses den av skjermleseren?',
      ]}
    >
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>Rad</HeaderCell>
            <HeaderCell>Navn</HeaderCell>
            <HeaderCell>By</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <DataCell>1</DataCell>
            <EditableCell
              variant="negative"
              feedback="Navn mangler"
              data-t="ec-tf"
            >
              <TextField label="Navn" />
            </EditableCell>
            <EditableCell
              variant="negative"
              feedback="Velg en by"
              data-t="ec-dd"
            >
              <Dropdown
                label="By"
                items={cities}
                selectedItem={city}
                onChange={setCity}
              />
            </EditableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Scenario>
  );
};

export const TestBench = () => (
  <div>
    <Heading2>
      PR #560: feedback-tekst koblet til skjemafelt + readOnly Checkbox
    </Heading2>
    <Paragraph>
      Grønn ramme = alle automatiske sjekker består. Velg én bredde i Playroom
      før du tester med tastatur og skjermleser.
    </Paragraph>
    <TextFieldsFix />
    <DropdownsFix />
    <DatePickersFix />
    <CheckboxReadOnlyFix />
    <CheckboxNormalRegression />
    <DynamicFeedbackRegression />
    <ConsumerDescribedByRegression />
    <ReadOnlyRegression />
    <EdgeCasesRegression />
    <EditableCellScenario />
  </div>
);
