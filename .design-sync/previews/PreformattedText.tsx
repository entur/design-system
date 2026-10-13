import React from 'react';
import { PreformattedText, Paragraph } from '@entur/linje';

export const Default = () => (
  <PreformattedText>
    {`{
  "from": "NSR:StopPlace:337",
  "to": "NSR:StopPlace:548",
  "dateTime": "2025-06-01T08:25:00+02:00"
}`}
  </PreformattedText>
);

export const InContext = () => (
  <div style={{ maxWidth: 520 }}>
    <Paragraph>
      Hent de neste avgangene fra Oslo S med Journey Planner-API-et:
    </Paragraph>
    <PreformattedText>
      {`query {
  stopPlace(id: "NSR:StopPlace:337") {
    name
    estimatedCalls(numberOfDepartures: 3) {
      expectedDepartureTime
      destinationDisplay { frontText }
    }
  }
}`}
    </PreformattedText>
  </div>
);
