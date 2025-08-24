import React from 'react';
import { Heading3, Paragraph, CodeText } from '@entur/typography';
import { CopyableText } from '@entur/alert';
import {
  getComponentTokens,
  ComponentToken,
} from '../../utils/componentTokens';

type Props = {
  npmPackage: string;
  title?: string;
  description?: string;
};

export const ComponentTokensTable: React.FC<Props> = ({
  npmPackage,
  title = 'Komponent tokens',
  description,
}) => {
  const tokens = getComponentTokens(npmPackage);

  if (tokens.length === 0) {
    return (
      <div style={{ margin: '1rem 0' }}>
        <Heading3>{title}</Heading3>
        {description && <Paragraph>{description}</Paragraph>}
        <Paragraph>
          Ingen tokens funnet for komponenten "{npmPackage}". Tokens må legges
          til i componentTokens.ts filen.
        </Paragraph>
      </div>
    );
  }

  // Group tokens by category
  const tokensByCategory = tokens.reduce((acc, token) => {
    if (!acc[token.category]) {
      acc[token.category] = [];
    }
    acc[token.category].push(token);
    return acc;
  }, {} as Record<string, ComponentToken[]>);

  const categoryLabels = {
    color: 'Farger',
    spacing: 'Spacing',
    typography: 'Typografi',
    other: 'Andre',
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <Heading3>{title}</Heading3>
      {description && <Paragraph>{description}</Paragraph>}

      {Object.entries(tokensByCategory).map(([category, categoryTokens]) => (
        <div key={category} style={{ marginBottom: '2rem' }}>
          <Heading3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            {categoryLabels[category as keyof typeof categoryLabels]}
          </Heading3>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  CSS Variable
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  Token Value
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  Copy
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryTokens.map((token, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    <CodeText>{token.variable}</CodeText>
                  </td>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    <CodeText>{token.value}</CodeText>
                  </td>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    {token.description}
                  </td>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    <CopyableText
                      textToCopy={token.variable}
                      successMessage="CSS variabel ble kopiert til utklippstavla."
                    >
                      Kopier
                    </CopyableText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
