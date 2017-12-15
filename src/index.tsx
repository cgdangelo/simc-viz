import { blueGrey, grey } from 'material-ui/colors';
import { Theme } from 'material-ui/styles';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'typeface-roboto';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const muiTheme = (theme: Theme) => (
  createMuiTheme({
    palette: {
      type: 'dark',
      background: {
        paper: blueGrey[800],
        default: blueGrey[700],
        contentFrame: grey[900],
      },
      text: {
        divider: blueGrey[900],
      },
    },
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: blueGrey[900],
        },
      },
      MuiBackdrop: {
        root: {
          backgroundColor: grey[900],
        },
      },
      MuiPaper: {
        root: {
          color: grey[50],
        },
      },
      MuiTableCell: {
        head: {
          backgroundColor: blueGrey[900],
        },
        root: {
          borderBottomColor: blueGrey[900],
        },
      },
      MuiTooltip: {
        tooltip: {
          backgroundColor: blueGrey[600],
          border: '1px solid',
          borderColor: blueGrey[300],
          padding: '0.25rem',
        },
      },
    },
  })
);

ReactDOM.render(
  <MuiThemeProvider theme={muiTheme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
