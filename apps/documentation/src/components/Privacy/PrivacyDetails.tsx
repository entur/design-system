import React from 'react';

import { CopyableText } from '@entur/alert';
import { PrimaryButton } from '@entur/button';
import { ExpandablePanel } from '@entur/expand';
import { Checkbox, Fieldset } from '@entur/form';
import { Heading, Text, TextContainer } from '@entur/typography/beta';
import { DocH2 } from '@components/Common/DocHeadings';

import {
  Category,
  Service,
  UcLabels,
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
  services: Service[];
};

/** One section of a service's detail list: a plain paragraph, or a list of labels for the
 *  purposes, the collected data and the recipients. */
type DetailSectionView = {
  id: string;
  title?: string;
  description?: string;
  text?: string;
  tags?: string[];
};

const buildCategories = (categories: Category[]): CategoryView[] =>
  categories
    .filter(category => !category.isHidden)
    .map(category => ({
      id: category.slug,
      // Falls back to the slug so a checkbox is never left without a label. A missing label
      // would mean Usercentrics served a category it has no text for.
      name: category.label || category.slug,
      description: category.description,
      essential: category.isEssential,
      accepted: category.services.every(service => service.consent.status),
      services: category.services,
    }));

/** Turns what Usercentrics knows about a service into the sections the page lists. The
 *  values come from the service, the headings from the texts in the admin. */
const buildServiceSections = (
  service: Service,
  labels: UcLabels,
): DetailSectionView[] => {
  const { service: serviceLabels } = labels;

  return [
    {
      id: 'processingCompany',
      title: serviceLabels.processingCompanyTitle,
      text: service.processingCompany?.name,
    },
    {
      id: 'dataPurposes',
      title: serviceLabels.dataPurposes.title,
      description: serviceLabels.dataPurposes.description,
      tags: service.dataPurposes,
    },
    {
      id: 'dataCollected',
      title: serviceLabels.dataCollected.title,
      description: serviceLabels.dataCollected.description,
      tags: service.dataCollected,
    },
    {
      id: 'dataRecipients',
      title: serviceLabels.dataRecipients.title,
      description: serviceLabels.dataRecipients.description,
      tags: service.dataRecipients,
    },
    {
      id: 'retentionPeriod',
      title: serviceLabels.retentionPeriod.title,
      text: service.retentionPeriodDescription ?? undefined,
    },
    {
      id: 'legalBasis',
      title: serviceLabels.legalBasis.title,
      text: service.legalBasis.join(', ') || undefined,
    },
  ];
};

const DetailSection = ({ section }: { section: DetailSectionView }) => {
  const { tags, text, title, description } = section;

  // Sections with neither a value nor a description carry nothing worth a heading.
  if (!tags?.length && !text && !description) return null;

  return (
    <div className="privacy-details__section">
      {title && (
        <Heading as="h3" variant="subtitle-1">
          {title}
        </Heading>
      )}
      {text && <Text>{text}</Text>}
      {tags && tags.length > 0 && (
        <ul className="privacy-details__tags">
          {tags.map(tag => (
            <li key={tag} className="privacy-details__tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
      {!text && !tags?.length && description && <Text>{description}</Text>}
    </div>
  );
};

/** Renders what Usercentrics stores and why, as a page rather than as Usercentrics' own
 *  second layer. The facts come from Usercentrics so they cannot drift from the admin; the
 *  surrounding text lives in the page itself. */
export const PrivacyDetails = () => {
  const [labels, setLabels] = React.useState<UcLabels | null>(null);
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
    if (!cmp) {
      setUnavailable(true);
      return;
    }
    const fetchedCategories = await cmp
      .getCategoriesFullInfo()
      .catch(() => null);
    const bundle = await fetchUcLabels();
    if (!fetchedCategories || !bundle) {
      setUnavailable(true);
      return;
    }
    const built = buildCategories(fetchedCategories);
    setLabels(bundle);
    setCategories(built);
    setControllerId(cmp.getControllerId() || undefined);
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

  // The sections render only after Usercentrics responds, by which time the browser has
  // already abandoned the hash in the address bar. Perform that scroll here instead, once.
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
    const ok = await saveCategoryConsents(values);
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
        <TextContainer
          as="section"
          aria-labelledby="personvern-utilgjengelig"
          spacing={{ top: 'm' }}
        >
          <DocH2
            className="privacy-details__section-heading"
            id="personvern-utilgjengelig"
          >
            Vi får ikke kontakt med samtykkeløsningen vår
          </DocH2>
          <Text>
            Derfor kan vi ikke vise deg de valgfrie teknologiene akkurat nå, og
            du får heller ikke gitt eller endret samtykke. Bruker du en
            annonseblokkerer, er den mest sannsynlig årsaken. Prøv å laste siden
            på nytt, eller å slå av blokkeringen for dette nettstedet.
          </Text>
          <Text>
            Ingenting valgfritt er i bruk så lenge dette vedvarer. Vi samler
            ikke inn noe om hvordan du bruker nettstedet før du har sagt ja til
            det.
          </Text>
        </TextContainer>

        <TextContainer
          as="section"
          aria-labelledby="personvern-nodvendig"
          spacing={{ top: 'm' }}
        >
          <DocH2
            className="privacy-details__section-heading"
            id="personvern-nodvendig"
          >
            Nødvendig informasjon vi lagrer
          </DocH2>
          <Text>
            Dette lagrer nettstedet selv, uavhengig av samtykkeløsningen, og det
            er i bruk nå. Du kan ikke velge det bort, men det følger deg ikke
            videre til andre nettsteder, og vi bruker det ikke til å lage
            statistikk.
          </Text>
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
          <Text>
            Alt dette ligger lagret i nettleseren din. Sletter du data for
            nettstedet, er det borte, og da spør vi på nytt.
          </Text>
        </TextContainer>
      </>
    );
  }

  if (!categories || !labels) return <Text>Laster …</Text>;

  const optional = categories.filter(c => !c.essential);
  const essential = categories.filter(c => c.essential);

  const renderServices = (category: CategoryView) =>
    category.services.map(service => (
      <ExpandablePanel
        key={service.id}
        title={service.name}
        className="privacy-details__service"
      >
        {service.description && <Text>{service.description}</Text>}
        {buildServiceSections(service, labels).map(section => (
          <DetailSection key={section.id} section={section} />
        ))}
      </ExpandablePanel>
    ));

  return (
    <>
      <TextContainer
        as="section"
        aria-labelledby="personvern-valg"
        spacing={{ top: 'm' }}
      >
        <DocH2
          className="privacy-details__section-heading"
          id="personvern-valg"
        >
          Dine valg
        </DocH2>
        {optional.length === 0 ? (
          <Text>Vi bruker ingen valgfrie teknologier på dette nettstedet.</Text>
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
      </TextContainer>

      {essential.length > 0 && (
        <TextContainer
          as="section"
          aria-labelledby="personvern-nodvendig"
          spacing={{ top: 'm' }}
        >
          <DocH2
            className="privacy-details__section-heading"
            id="personvern-nodvendig"
          >
            Nødvendig informasjon vi lagrer
          </DocH2>
          <Text>
            Dette kan du ikke velge bort. Uten det fungerer ikke nettstedet, og
            vi kan ikke huske valget du gjør over.
          </Text>
          {essential.map(category => (
            <div key={category.id}>{renderServices(category)}</div>
          ))}
        </TextContainer>
      )}

      {controllerId && (
        <TextContainer
          as="section"
          aria-labelledby="personvern-id"
          spacing={{ top: 'm' }}
        >
          <DocH2
            className="privacy-details__section-heading"
            id="personvern-id"
          >
            Din samtykke-ID
          </DocH2>
          <Text>
            Samtykket ditt er lagret under en tilfeldig ID, ikke under navn
            eller e-post. Skal du be om innsyn i eller sletting av det vi har
            lagret, oppgi denne IDen til oss.
          </Text>
          <CopyableText
            className="privacy-details__consent-id"
            textToCopy={controllerId}
            successMessage={`Samtykke-IDen «${controllerId}» ble kopiert til utklippstavlen.`}
          >
            Kopier samtykke-ID
          </CopyableText>
        </TextContainer>
      )}
    </>
  );
};

export default PrivacyDetails;
