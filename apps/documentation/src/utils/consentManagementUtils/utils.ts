import { ConsentDetails, Consents } from './types';

export function getCMP() {
  return typeof window !== 'undefined' ? window.__ucCmp : null;
}

export function formatConsentEvent(
  event: Event & { detail?: ConsentDetails },
): Consents {
  return Object.entries(event?.detail?.services ?? {}).map(service => {
    return {
      id: service[0],
      name: service[1].name,
      consentGiven: service[1].consent?.given ?? false,
      category: service[1].category,
    };
  });
}

export function formatConsentDetails(
  consentDetails?: ConsentDetails,
): Consents {
  if (consentDetails === undefined) return [];
  return Object.entries(consentDetails?.services ?? {}).map(service => {
    return {
      id: service[0],
      name: service[1].name,
      consentGiven: service[1].consent?.given ?? false,
      category: service[1].category,
    };
  });
}
