import React from 'react';
import { graphql, HeadProps } from 'gatsby';
import ComponentLayout from '@layouts/ComponentLayout';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';

type ComponentDoc = {
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  npmPackage?: string;
  figmaLink?: string;
  componentName: string;
  beskrivelse?: any;
  utvikling?: any;
  relatedComponents?: Array<{
    title: string;
    link: string;
  }>;
};

export default function ComponentDocTemplate({
  data,
}: {
  data: { sanityComponentDoc: ComponentDoc };
}) {
  const { sanityComponentDoc: componentDoc } = data;
  const {
    title,
    category,
    subcategory,
    description,
    npmPackage,
    figmaLink,
    componentName,
    beskrivelse,
    utvikling,
    relatedComponents,
  } = componentDoc;

  return (
    <ComponentLayout
      title={title}
      category={category}
      subcategory={subcategory}
      description={description}
      npmPackage={npmPackage}
      figmaLink={figmaLink}
      componentName={componentName}
      beskrivelse={beskrivelse}
      utvikling={utvikling}
      relatedComponents={relatedComponents}
    />
  );
}

export const Head = (
  props: HeadProps & {
    data: {
      sanityComponentDoc: {
        title: string;
        description: string;
        category: string;
        subcategory: string;
      };
    };
  },
) => {
  const {
    data: {
      sanityComponentDoc: { title, description, category, subcategory },
    },
  } = props;
  return (
    <SEO
      title={title}
      description={description}
      pathname={getSanitizedPath({ title, category, subcategory })}
    />
  );
};

export const query = graphql`
  query ComponentDocById($id: String!) {
    sanityComponentDoc(id: { eq: $id }) {
      title
      category
      subcategory
      description
      npmPackage
      figmaLink
      componentName
      beskrivelse {
        ...TextBlockFragment
      }
      utvikling {
        ...TextBlockFragment
      }
      relatedComponents {
        title
        link
      }
    }
  }
`;
