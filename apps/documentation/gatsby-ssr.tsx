import React from 'react';
import { GatsbyBrowser, GatsbySSR } from 'gatsby';

import './src/styles/index.scss';

import { ToastProvider } from '@entur/alert';
import {
  ConsentProvider,
  SettingsProvider,
  MediaContextProvider,
  ColorsProvider,
} from './src/providers';
import { SearchProvider } from './src/components/Search/SearchContext';
import DocLayout from './src/layouts/DocLayout';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
  return (
    <SettingsProvider>
      <ConsentProvider>
        <ToastProvider>
          <ColorsProvider>
            <MediaContextProvider>
              <SearchProvider>{element}</SearchProvider>
            </MediaContextProvider>
          </ColorsProvider>
        </ToastProvider>
      </ConsentProvider>
    </SettingsProvider>
  );
};

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({
  element,
  props,
}) => {
  const children = <ConsentProvider>{element}</ConsentProvider>;
  if (props.location.pathname === '/') return <>{children}</>;
  if (element.type.is404) {
    return <DocLayout {...props}>{children}</DocLayout>;
  }
  return <DocLayout {...props}>{children}</DocLayout>;
};

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHeadComponents,
  setPostBodyComponents,
}) => {
  const usercentricsScript = (
    <script
      key="cmp"
      id="usercentrics-cmp"
      src="https://web.cmp.usercentrics.eu/ui/loader.js"
      data-settings-id="6QfyMRB25Z5CMz"
      async
    ></script>
  );
  const posthogScript = (
    <script
      key={`gatsby-posthog-analytics`}
      type="text/plain"
      data-usercentrics="PostHog.com"
      dangerouslySetInnerHTML={{
        __html: `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_ESGRM1feMLZkHxV0P81O4i7g4I4jTFIYZpuZVxqF3hq', {api_host: 'https://eu.i.posthog.com', opt_out_capturing_by_default: true, debug: true })
        `,
      }}
    />
  );

  setHeadComponents([usercentricsScript, posthogScript]);
  return null;
};
