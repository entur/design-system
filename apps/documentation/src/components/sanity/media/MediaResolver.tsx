import React from 'react';
import { graphql } from 'gatsby';
import { getGatsbyImageData } from 'gatsby-source-sanity';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { MediaType } from '../types';

type Props = {
  value: MediaType;
};

export const MediaResolver = ({ value }: Props) => {
  const { mediaType } = value;

  if (mediaType === 'image') {
    const {
      image,
      imageDescription,
      imageDisplayPreset = 'default',
      hideFromScreenreaders,
      showDownload,
      extraDownloadFiles = [],
    } = value;
    if (!image || typeof image === 'string' || !('asset' in image)) return null;

    const imageData =
      'gatsbyImageData' in image.asset
        ? image.asset.gatsbyImageData
        : getGatsbyImageData(
            // @ts-expect-error Images inserted inline from Sanity do not contain gatsbyImageData when deeply resolved
            image,
            {},
            { projectId: 'npa0lfls', dataset: 'production' },
          );
    if (imageData === null) return null;

    return (
      <ImageDisplay
        imgSource={imageData}
        alt={imageDescription}
        preset={
          imageDisplayPreset === 'default'
            ? 'contain-full-width'
            : imageDisplayPreset
        }
        alwaysShowDownload={showDownload || extraDownloadFiles.length > 0}
        downloadSources={
          showDownload || extraDownloadFiles.length > 0
            ? (() => {
                const sources: Array<{
                  src: string;
                  format: string;
                  label?: string;
                }> = [];
                if (showDownload) {
                  sources.push({
                    src: imageData.images.fallback?.src + '&dl=',
                    format: 'png',
                    label: 'Last ned som PNG',
                  });
                }
                extraDownloadFiles.forEach(file => {
                  if (file?.fileLink) {
                    sources.push({
                      src: file.fileLink,
                      format: file.fileFormat || 'fil',
                      label: file.downloadLabel,
                    });
                  } else if (file?.uploadedFile?.asset?.url) {
                    sources.push({
                      src: file.uploadedFile.asset.url,
                      format: file.fileFormat || 'fil',
                      label: file.downloadLabel,
                    });
                  }
                });
                return sources;
              })()
            : undefined
        }
        aria-hidden={hideFromScreenreaders}
      />
    );
  }

  // video
  const {
    sourceType = 'upload',
    file,
    externalUrl,
    poster,
    alt,
    title,
  } = value;
  const posterUrl = poster?.asset?.url;
  const src = sourceType === 'upload' ? file?.asset?.url : externalUrl;
  if (!src) return null;

  return (
    <video
      controls
      style={{ width: '100%', borderRadius: '0.5rem' }}
      controlsList="noremoteplayback noplaybackrate"
      disablePictureInPicture
      poster={posterUrl}
      title={title}
      aria-label={alt}
    >
      <source src={src} />
    </video>
  );
};

export const MediaFragment = graphql`
  fragment MediaFragment on SanityMedia {
    _key
    _type
    mediaType
    # image fields
    image {
      asset {
        gatsbyImageData
      }
    }
    imageDescription
    hideFromScreenreaders
    showDownload
    imageDisplayPreset
    extraDownloadFiles {
      fileType
      uploadedFile {
        asset {
          _id
          url
          originalFilename
        }
      }
      fileLink
      downloadLabel
      fileFormat
    }
    # video fields
    sourceType
    file {
      asset {
        url
        mimeType
      }
    }
    externalUrl
    poster {
      asset {
        url
      }
    }
    title
    alt
  }
`;
