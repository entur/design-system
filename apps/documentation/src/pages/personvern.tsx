import React from 'react';

import { SkipToContent } from '@entur/a11y';
import { Heading1, Heading2, Link, Paragraph } from '@entur/typography';

import Footer from '@components/Footer/Footer';
import PrivacyDetails from '@components/Privacy/PrivacyDetails';
import { SEO } from '@components/seo/SEO';
import TopNavigationLayout from '../layouts/TopNavigationLayout';

import './personvern.scss';

const TITLE = 'Personvern på Linje';
const DESCRIPTION =
  'Hva vi lagrer om bruken av Linje, hvorfor vi lagrer det, og hvordan du endrer valget ditt.';

export const Head = () => (
  <SEO title={TITLE} description={DESCRIPTION} pathname="/personvern" />
);

const PersonvernPage = () => (
  <>
    <SkipToContent mainId="main">Gå til hovedinnhold</SkipToContent>
    <TopNavigationLayout />
    <main id="main" className="personvern">
      <Heading1>{TITLE}</Heading1>
      <Paragraph>
        Linje er designsystemet til Entur. For å gjøre nettstedet bedre trenger
        vi å lagre litt informasjon på enheten din, og noe av det er frivillig.
        Her ser du hva vi lagrer, hva vi bruker det til, og du kan endre valget
        ditt når du vil.
      </Paragraph>
      <Paragraph>
        Vil du vite mer om hvordan Entur behandler personopplysninger og hvilke
        rettigheter du har, finner du det i{' '}
        <Link href="https://om.entur.no/personvern">
          personvernerklæringen til Entur
        </Link>
        .
      </Paragraph>

      <PrivacyDetails />

      <section aria-labelledby="personvern-endre">
        <Heading2 id="personvern-endre">Slik ombestemmer du deg</Heading2>
        <Paragraph>
          Du kan komme tilbake hit når som helst. Lenken «Endre hvilken
          informasjon vi får lagre» ligger nederst på alle sider. Velger du bort
          noe du tidligere har sagt ja til, slutter vi å samle inn det med en
          gang.
        </Paragraph>
      </section>
    </main>
    <Footer />
  </>
);

export default PersonvernPage;
