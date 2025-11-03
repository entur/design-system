import React from 'react';
import './layer-demo.scss';

export default function LayerDemoPage() {
  return (
    <div className="demo-layer" style={{ padding: '2rem' }}>
      <h2 className="eds-heading eds-heading--title-2">
        Layer demo: app overrides DS
      </h2>

      <p className="eds-text eds-text--paragraph" style={{ marginTop: '1rem' }}>
        This page demonstrates that styles in <code>@layer app</code> override
        the design system regardless of selector specificity. Here is a{' '}
        <a className="eds-text eds-text--link">link</a> with a thicker underline
        and different color applied in the app layer.
      </p>
    </div>
  );
}
