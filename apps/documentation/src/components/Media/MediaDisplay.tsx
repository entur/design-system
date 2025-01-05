import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ImageDisplay, ImageDisplayProps } from './ImageDisplay';

const MediaDisplay: React.FC<ImageDisplayProps> = ({
  name,
  downloadSources,
  alt = '',
  alwaysShowDownload = false,
  className,
  preset,
  style,
  ...rest
}) => {
  const data = useStaticQuery(graphql`
    query {
      imageSharpFiles: allFile(
        filter: {
          sourceInstanceName: { eq: "media" }
          extension: { in: ["png", "jpg", "jpeg"] }
        }
      ) {
        nodes {
          name
          extension
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
          publicURL
        }
      }
      otherMediaFiles: allFile(
        filter: {
          sourceInstanceName: { eq: "media" }
          extension: { in: ["svg", "mp4"] }
        }
      ) {
        nodes {
          name
          extension
          publicURL
        }
      }
    }
  `);

  const allFiles = [
    ...data.imageSharpFiles.nodes,
    ...data.otherMediaFiles.nodes,
  ];
  const file = allFiles.find((file: any) => file.name === name);

  if (!file) {
    return <p>No media found with name: {name}</p>;
  }

  const isVideo = file.extension === 'mp4';

  if (isVideo) {
    return (
      <video
        controls
        style={{ width: '100%', marginBottom: '20px' }}
        controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
      >
        <source src={file.publicURL} type="video/mp4" />
      </video>
    );
  }

  const isSvg = file.name.endsWith('.svg');
  const imgSource = isSvg
    ? file.publicURL
    : file.childImageSharp?.gatsbyImageData;

  return (
    <ImageDisplay
      imgSource={imgSource}
      alt={alt}
      preset={preset}
      downloadSources={downloadSources}
      alwaysShowDownload={alwaysShowDownload}
      className={className}
      name={name}
      style={style}
      {...rest}
    />
  );
};

export default MediaDisplay;
