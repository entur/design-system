import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ImageDisplay, ImageDisplayProps } from './ImageDisplay';

const MediaDisplayWrapper: React.FC<ImageDisplayProps> = ({
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
      files: allFile(filter: { sourceInstanceName: { eq: "media" } }) {
        nodes {
          name
          extension
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
          publicURL
        }
      }
    }
  `);

  const file = data.files.nodes.find((file: any) => file.name === name);

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

export default MediaDisplayWrapper;
