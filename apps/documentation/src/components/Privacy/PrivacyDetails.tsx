import React from 'react';

import { CopyableText } from '@entur/alert';
import { PrimaryButton } from '@entur/button';
import { ExpandablePanel } from '@entur/expand';
import { Checkbox, Fieldset } from '@entur/form';
import { Heading2, Heading3, Paragraph } from '@entur/typography';

import {
  ConsentDetails,
  UcLabelBundle,
  UcServiceDetailSection,
  fetchUcLabels,
  getCMP,
  saveCategoryConsents,
} from 'src/utils/cmpUtils';
import { sanitizeUcHtml } from 'src/utils/sanitizeUcHtml';

import './PrivacyDetails.scss';

type CategoryView = {
  id: string;
  name: string;
  description?: string;
  essential: boolean;
  accepted: boolean;
  serviceIds: string[];
};

const buildCategories = (
  details: ConsentDetails,
  labels: UcLabelBundle,
): CategoryView[] =>
  Object.entries(details.categories)
    .filter(([, category]) => !category.hidden)
    .map(([id, category]) => ({
      id,
      name: labels.categories[id]?.name ?? category.name,
      description: labels.categories[id]?.description,
      essential: category.essential ?? false,
      accepted: category.state === 'ALL_ACCEPTED',
      serviceIds: Object.keys(category.dps ?? {}),
    }));

const DetailSection = ({ section }: { section: UcServiceDetailSection }) => {
  const { body, title, description } = section;
  const tags = Array.isArray(body?.value) ? body?.value : null;
  const text = typeof body?.value === 'string' ? body.value : null;

  // Sections with neither a value nor a description carry nothing worth a heading.
  if (!tags?.length && !text && !description) return null;

  return (
    <div className="privacy-details__section">
      {title && <Heading3 margin="none">{title}</Heading3>}
      {text && <Paragraph margin="none">{text}</Paragraph>}
      {tags && (
        <ul className="privacy-details__tags">
          {tags.map(tag => (
            <li key={tag.id} className="privacy-details__tag">
              {tag.label}
            </li>
          ))}
        </ul>
      )}
      {!text && !tags?.length && description && (
        <Paragraph margin="none">{description}</Paragraph>
      )}
    </div>
  );
};

/** Renders what Usercentrics stores and why, as a page rather than as Usercentrics' own
 *  second layer. The facts come from Usercentrics so they cannot drift from the admin; the
 *  surrounding text lives in the page itself. */
export const PrivacyDetails = () => {
  const [labels, setLabels] = React.useState<UcLabelBundle | null>(null);
  const [categories, setCategories] = React.useState<CategoryView[] | null>(
    null,
  );
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [saved, setSaved] = React.useState(false);
  const [unavailable, setUnavailable] = React.useState(false);
  const [controllerId, setControllerId] = React.useState<string | undefined>();
  const hasHandledHash = React.useRef(false);

  const load = React.useCallback(async () => {
    const cmp = await getCMP();
    const details = await cmp?.getConsentDetails();
    if (!details) {
      setUnavailable(true);
      return;
    }
    const bundle = await fetchUcLabels(details.consent);
    if (!bundle) {
      setUnavailable(true);
      return;
    }
    const built = buildCategories(details, bundle);
    setLabels(bundle);
    setCategories(built);
    setControllerId(details.consent.controllerId || undefined);
    // The boxes show what is stored right now, so the page doubles as a record of the
    // current choice rather than asking for it again from scratch.
    setSelected(
      Object.fromEntries(
        built.filter(c => !c.essential).map(c => [c.id, c.accepted]),
      ),
    );
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // The sections only exist once Usercentrics has answered, which is long after the
  // browser gave up on the hash in the address bar. Take over that jump once, so links
  // pointing straight at a section land on it.
  React.useEffect(() => {
    if (!categories || hasHandledHash.current) return;
    const id = window.location.hash.slice(1);
    const target = document.getElementById(id);
    if (!id || !target) return;
    hasHandledHash.current = true;
    // scroll-margin-top on the headings keeps them clear of the fixed navigation, and
    // holds even as the panels below settle into place.
    target.scrollIntoView({ block: 'start' });
  }, [categories]);

  const persist = async (values: Record<string, boolean>) => {
    const ok = await saveCategoryConsents(
      Object.entries(values).map(([id, consent]) => ({ id, consent })),
    );
    if (!ok) {
      setUnavailable(true);
      return;
    }
    setSelected(values);
    setSaved(true);
    load();
  };

  const setAll = (consent: boolean) =>
    persist(Object.fromEntries(Object.keys(selected).map(id => [id, consent])));

  // The necessary storage below is written by the site itself, so it keeps working even when
  // Usercentrics is unreachable. It has to be accounted for either way.
  if (unavailable) {
    return (
      <>
        <section aria-labelledby="personvern-utilgjengelig">
          <Heading2 id="personvern-utilgjengelig">
            Vi får ikke kontakt med samtykkeløsningen vår
          </Heading2>
          <Paragraph>
            Derfor kan vi ikke vise deg de valgfrie teknologiene akkurat nå, og
            du får heller ikke gitt eller endret samtykke. Bruker du en
            annonseblokkerer, er den mest sannsynlig årsaken. Prøv å laste siden
            på nytt, eller å slå av blokkeringen for dette nettstedet.
          </Paragraph>
          <Paragraph>
            Ingenting valgfritt er i bruk så lenge dette vedvarer. Vi samler
            ikke inn noe om hvordan du bruker nettstedet før du har sagt ja til
            det.
          </Paragraph>
        </section>

        <section aria-labelledby="personvern-nodvendig">
          <Heading2 id="personvern-nodvendig">
            Nødvendig informasjon vi lagrer
          </Heading2>
          <Paragraph>
            Dette lagrer nettstedet selv, uavhengig av samtykkeløsningen, og det
            er i bruk nå. Du kan ikke velge det bort, men det følger deg ikke
            videre til andre nettsteder, og vi bruker det ikke til å lage
            statistikk.
          </Paragraph>
          <ul className="privacy-details__list">
            <li>
              Valgene dine for fargemodus, kodeformat, pakkeverktøy og hva slags
              bruker du er, slik at nettstedet ser likt ut neste gang du er her.
            </li>
            <li>
              Svaret du gir på spørsmålet om informasjonsinnsamling, slik at vi
              ikke spør om igjen. Vi er pålagt å spørre, og da må vi lagre
              svaret.
            </li>
          </ul>
          <Paragraph>
            Alt dette ligger lagret i nettleseren din. Sletter du data for
            nettstedet, er det borte, og da spør vi på nytt.
          </Paragraph>
        </section>
      </>
    );
  }

  if (!categories || !labels) return <Paragraph>Laster …</Paragraph>;

  const optional = categories.filter(c => !c.essential);
  const essential = categories.filter(c => c.essential);

  const renderServices = (category: CategoryView) =>
    category.serviceIds.map(serviceId => {
      const service = labels.services[serviceId];
      if (!service) return null;
      return (
        <ExpandablePanel
          key={serviceId}
          title={service.name}
          className="privacy-details__service"
        >
          {service.description && (
            <Paragraph margin="none">{service.description}</Paragraph>
          )}
          {service.details?.genericContent
            ?.filter(section => section.id !== 'description')
            .map(section => (
              <DetailSection key={section.id} section={section} />
            ))}
          {service.legalBasis?.length ? (
            <div className="privacy-details__section">
              <Heading3 margin="none">Behandlingsgrunnlag</Heading3>
              <Paragraph margin="none">
                {service.legalBasis.join(', ')}
              </Paragraph>
            </div>
          ) : null}
        </ExpandablePanel>
      );
    });

  return (
    <>
      <section aria-labelledby="personvern-valg">
        <Heading2 id="personvern-valg">Dine valg</Heading2>
        {optional.length === 0 ? (
          <Paragraph>
            Vi bruker ingen valgfrie teknologier på dette nettstedet.
          </Paragraph>
        ) : (
          <form
            onSubmit={event => {
              event.preventDefault();
              persist(selected);
            }}
          >
            <Fieldset
              label="Hva får vi samle informasjon om?"
              className="privacy-details__fieldset"
            >
              {optional.map(category => (
                <div key={category.id} className="privacy-details__choice">
                  <Checkbox
                    checked={selected[category.id] ?? false}
                    onChange={event => {
                      setSaved(false);
                      setSelected(current => ({
                        ...current,
                        [category.id]: event.target.checked,
                      }));
                    }}
                  >
                    {category.name}
                  </Checkbox>
                  {category.description && (
                    <div
                      className="privacy-details__choice-description"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: sanitizeUcHtml(category.description),
                      }}
                    />
                  )}
                  {renderServices(category)}
                </div>
              ))}
            </Fieldset>
            {/* Equal weight, so no option reads as the one we would prefer. Accept and
                deny all only earn their place once there is more than one choice. */}
            <div className="privacy-details__actions">
              <PrimaryButton type="submit">Lagre valg</PrimaryButton>
              {optional.length > 1 && (
                <>
                  <PrimaryButton type="button" onClick={() => setAll(true)}>
                    Godta alle
                  </PrimaryButton>
                  <PrimaryButton type="button" onClick={() => setAll(false)}>
                    Avslå alle
                  </PrimaryButton>
                </>
              )}
            </div>
            <p aria-live="polite" className="privacy-details__status">
              {saved ? 'Valget ditt er lagret.' : ''}
            </p>
          </form>
        )}
      </section>

      {essential.length > 0 && (
        <section aria-labelledby="personvern-nodvendig">
          <Heading2 id="personvern-nodvendig">
            Nødvendig informasjon vi lagrer
          </Heading2>
          <Paragraph>
            Dette kan du ikke velge bort. Uten det fungerer ikke nettstedet, og
            vi kan ikke huske valget du gjør over.
          </Paragraph>
          {essential.map(category => (
            <div key={category.id}>{renderServices(category)}</div>
          ))}
        </section>
      )}

      {controllerId && (
        <section aria-labelledby="personvern-id">
          <Heading2 id="personvern-id">Din samtykke-ID</Heading2>
          <Paragraph>
            Samtykket ditt er lagret under en tilfeldig ID, ikke under navn
            eller e-post. Skal du be om innsyn i eller sletting av det vi har
            lagret, oppgi denne IDen til oss.
          </Paragraph>
          <CopyableText
            textToCopy={controllerId}
            successMessage={`Samtykke-IDen «${controllerId}» ble kopiert til utklippstavlen.`}
          >
            Kopier samtykke-ID
          </CopyableText>
        </section>
      )}
    </>
  );
};

export default PrivacyDetails;
