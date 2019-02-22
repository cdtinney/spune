////////////////////////////
// External dependencies  //
////////////////////////////

import { createMuiTheme } from '@material-ui/core/styles';

export default function createTheme() {
  return createMuiTheme({
    typography: {
      // Use Typography v2 immediately.
      // More info here:
      // https://material-ui.com/style/typography/#migration-to-typography-v2
      useNextVariants: true,
    },
    palette: {
      type: 'dark',
      primary: {
        main: '#828282',
      },
    },
  });
}
