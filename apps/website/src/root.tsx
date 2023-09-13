import {
  component$,
  useContextProvider,
  useStore,
  useStyles$,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import { RouterHead } from './routes/_components/router-head/router-head';

import { useAppStateProvider } from './_state/use-app-state';
import { THEME_STORAGE_KEY, useCSSTheme } from './_state/use-css-theme';
import { OLD_APP_STATE_CONTEXT_ID } from './constants';
import globalStyles from './global.css?inline';
import { OldAppState } from './types';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  useStyles$(globalStyles);

  const appState = useAppStateProvider();

  useVisibleTask$(() => {
    const userStoredTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (userStoredTheme) {
      appState.mode = userStoredTheme === 'dark' ? 'dark' : 'light';
    } else {
      appState.mode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  });

  // TODO: remove this old state once refactored
  const state = useStore<OldAppState>({
    darkMode: false,
  });
  useContextProvider(OLD_APP_STATE_CONTEXT_ID, state);

  useCSSTheme(appState);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body
        lang="en"
        class={{
          'overflow-y-hidden': appState.isSidebarOpened,
        }}
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
