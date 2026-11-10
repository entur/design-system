import React from 'react';
import { NavigationCard } from '@entur/layout';
import { Grid } from '@entur/layout/beta';
import { TextContainer } from '@entur/typography/beta';
import { PortableText } from '@components/sanity/PortableText';
import { PreviewPage } from './PreviewPage';

export type Page = {
  _type: 'page';
  title?: string;
  subcategory?: string;
  description?: string;
  content?: unknown;
  subpages?: Array<{ _id: string; title?: string; description?: string }>;
};

// An article page, as ContentTemplate renders it on the site
export function PageBody({
  page,
  onOpen,
}: {
  page: Page;
  onOpen: (id: string) => void;
}) {
  return (
    <PreviewPage
      subcategory={page.subcategory}
      title={page.title}
      description={page.description}
    >
      <TextContainer>
        {page.content ? (
          <PortableText value={page.content} container={false} />
        ) : null}
        {page.subpages && page.subpages.length > 0 && (
          <Grid templateColumns="repeat(auto-fill, minmax(16rem, 1fr))" gap="m">
            {page.subpages.map(subpage => (
              <NavigationCard
                key={subpage._id}
                href={`?id=${subpage._id}`}
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  onOpen(subpage._id);
                }}
                title={subpage.title ?? 'Uten tittel'}
              >
                {subpage.description}
              </NavigationCard>
            ))}
          </Grid>
        )}
      </TextContainer>
    </PreviewPage>
  );
}
