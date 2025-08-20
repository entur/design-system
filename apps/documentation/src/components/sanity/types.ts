import { PortableTextProps } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { getGatsbyImageData } from 'gatsby-source-sanity';

export type SanityImageType = {
  _type: string;
  asset: {
    gatsbyImageData: any;
  };
};

export type SaintyInlineImageType = {
  _type: string;
  asset: {
    _id: string;
    url: string;
    assetId: string;
    extension: string;
    metadata: any;
  };
  assetId: string;
};

export type DownloadFileType = {
  fileType: 'uploaded' | 'link';
  uploadedFile?: {
    asset: {
      _id: string;
      url: string;
      originalFilename?: string;
    };
  };
  fileLink?: string;
  downloadLabel?: string;
  fileFormat?: string;
};

export type ImageAndTextType = {
  _type: string;
  variant?: 'standard' | 'contrast' | 'guideline';
  order: 'image-first' | 'text-first';
  image: SanityImageType | Parameters<typeof getGatsbyImageData>[0];
  imageDescription?: string;
  hideFromScreenreaders?: boolean;
  text: PortableTextBlock;
  _rawText: any[];
  showDownload?: boolean;
  extraDownloadFiles?: DownloadFileType[];
  imageDisplayPreset?:
    | 'default'
    | 'full-width-image'
    | 'contain-logo-display'
    | 'centered-image'
    | 'contain-full-width';
  // Guideline specific fields
  guidelineVariant?:
    | 'success'
    | 'information'
    | 'warning'
    | 'negative'
    | 'none';
  guidelineTitle?: string;
  noPadding?: boolean;
  textInBox?: boolean;
};

export type LinkType = {
  _type: string;
  linkAddress?: string;
  linkText?: string;
  linkType?:
    | 'text'
    | 'navigationcard'
    | 'button'
    | 'button-secondary'
    | 'button-secondary-small';
  linkAddressType?: 'url' | 'file';
  iconName?: string;
  downloadFile?: {
    asset: {
      _id: string;
      url: string;
      originalFilename?: string;
    };
  };
};

export type InlineIcon = {
  _type: string;
  iconName?: string;
  iconDescription?: string;
  hideFromScreenreaders?: boolean;
};

export type TextBlocksType = {
  _type: string;
  _rawItems: PortableTextBlock[];
  items: PortableTextBlock[];
  variant?: 'normal' | 'information' | 'contrast' | 'alert';
  alertType?: 'success' | 'information' | 'warning' | 'negative';
  title?: string;
};

export type GroupType = {
  _type: string;
  content: Array<PortableTextProps['value']>;
};

export type PageType = {
  _type: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  npmPackage?: string;
  isCategoryLandingPage?: boolean;
  content: PortableTextProps['value'];
};
