import * as Highcharts from 'highcharts';
import { blueGrey, grey } from 'material-ui/colors';
import { Theme } from 'material-ui/styles';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'typeface-roboto';
import 'typeface-roboto-mono';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Report from './Report';

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

require('highcharts/highcharts-more')(Highcharts);

Highcharts.setOptions({
  chart: {
    backgroundColor: blueGrey[900],
    borderColor: blueGrey[700],
    borderWidth: 1,
  },
  lang: {
    thousandsSep: ',',
  },
  plotOptions: {
    bar: {
      borderColor: 'transparent',
      dataLabels: {
        align: 'left',
        color: 'contrast',
        crop: false,
        enabled: true,
        format: '{point.y:,.0f}',
        inside: true,
        overflow: 'none',
        padding: 0,
        style: {
          color: grey[50],
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1rem',
        },
        verticalAlign: 'middle',
        x: 5,
        y: 3,
      },
    },
    boxplot: {
      color: grey[50],
      fillColor: 'rgba(255, 255, 255, 0.15)',
      lineWidth: 2,
      whiskerLength: '50%',
    },
  },
  title: {
    style: {
      color: grey[50],
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
    },
  },
  tooltip: {
    backgroundColor: blueGrey[500],
    borderColor: blueGrey[300],
    style: {
      color: grey[50],
      textShadow: '1px 1px 1px #000000',
    },
    valueDecimals: 1,
  },
  xAxis: {
    labels: {
      style: {
        color: grey[50],
        fontFamily: 'Roboto',
        fontSize: '1rem',
      },
      y: 6,
    },
    lineWidth: 0,
    tickLength: 0,
    gridLineColor: 'transparent',
  },
  yAxis: {
    gridLineColor: 'transparent',
    labels: {
      enabled: false,
    },
  },
});

const simulationData: JsonReport = require('./report.json');

ReactDOM.render(
  <MuiThemeProvider theme={muiTheme}>
    {/*<App />*/}
    <Report {...{simulationData}}/>
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
