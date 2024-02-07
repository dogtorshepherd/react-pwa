import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import Header from '@/sections/Header';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import Sidebar from '@/sections/Sidebar';
import '@fontsource/inter';

const materialTheme = materialExtendTheme();

function App() {
  return (
    <MaterialCssVarsProvider
      defaultMode="system"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider defaultMode="system">
        <CssBaseline enableColorScheme />
        <Fragment>
          <CssBaseline />
          <Notifications />
          <HotKeys />
          <SW />
          <BrowserRouter>
            {/* <Header />
            <Sidebar /> */}
            <Pages />
          </BrowserRouter>
        </Fragment>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
