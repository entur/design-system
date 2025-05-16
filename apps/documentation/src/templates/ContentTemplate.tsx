import React from 'react';
import { graphql } from 'gatsby';
import { PortableText } from '@components/sanity';

// TODO: Denne er på ingen måte klar!
export default function ContentTemplate({ data }: { data: any }) {
  const { page } = data;
  const { title, content } = page;
  console.log('customPage', title);

  return <PortableText value={content} />;
}

export const query = graphql`
  query ContentBySlug($slug: String!) {
    page: sanityPage(slug: { current: { eq: $slug } }) {
      id
      slug {
        current
      }
      title
      description
      content {
        ...ImageAndTextFragment
        ... on SanityTextBlocks {
          _key
          _type
          _rawItems
        }
      }
    }
  }
`;
