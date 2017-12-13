import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AppBar from 'material-ui/AppBar';
import Chip from 'material-ui/Chip';
import { grey, indigo } from 'material-ui/colors';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import {
  BoxPlotSeries,
  Chart,
  BarSeries,
  HighchartsChart,
  Tooltip,
  withHighcharts,
  XAxis,
  YAxis,
} from 'react-jsx-highcharts';
import './App.css';

require('highcharts/highcharts-more')(Highcharts);

Highcharts.setOptions({
  chart: {
    backgroundColor: indigo[50],
    borderColor: indigo[500],
    borderWidth: 1,
  },
  colors: [
    indigo[200],
    indigo[500],
  ],
  lang: {
    thousandsSep: ',',
  },
  plotOptions: {
    bar: {
      borderColor: indigo[500],
      dataLabels: {
        align: 'left',
        crop: false,
        enabled: true,
        format: '{point.y:,.0f}',
        inside: true,
        overflow: 'none',
        padding: 0,
        style: {
          color: grey[700],
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1rem',
        },
        verticalAlign: 'middle',
      },
    },
    boxplot: {
      fillColor: 'rgba(0, 0, 0, 0)',
      whiskerLength: '50%',
    },
  },
  title: {
    style: {
      color: grey[900],
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
    },
  },
  tooltip: {
    valueDecimals: 1,
  },
  xAxis: {
    labels: {
      style: {
        color: grey[700],
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 'bold',
      },
      y: 5,
    },
    lineColor: indigo[500],
    tickColor: indigo[500],
  },
  yAxis: {
    gridLineColor: indigo[100],
  },
});

const report: JsonReport = require('./report.json');

const styles = ((theme: Theme) => ({
  chip: {
    margin: theme.spacing.unit,
    '&:first-child': {
      marginLeft: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
  },

  raidEventItem: {
    '& > p': {
      fontFamily: 'monospace',
    },
  },

  raidEventsPaper: theme.mixins.gutters({
    paddingTop: theme.spacing.unit * 2,
  }),
}));

class App extends React.Component<WithStyles<'chip' | 'raidEventItem' | 'raidEventsPaper'>> {
  renderChip(label: string, value: {}) {
    return (
      <Chip
        className={this.props.classes.chip}
        label={
          <Typography>
            <b>{label}</b> {value}
          </Typography>
        }
      />
    );
  }

  renderExpansionPanel(title: string, content: JSX.Element) {
    return (
      <ExpansionPanel>
        {this.renderExpansionPanelTitle(title)}

        <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
          {content}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  renderExpansionPanelTitle(title: string) {
    return (
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography color="inherit" type="title">{title}</Typography>
      </ExpansionPanelSummary>
    );
  }

  renderRaidSummary() {
    const raidDps = report.sim.players.map((player) => ({
      name: player.name,
      dps: player.collected_data.dps,
    }));

    raidDps.sort((a, b) => {
      if (a.dps.mean < b.dps.mean) {
        return 1;
      }

      if (a.dps.mean > b.dps.mean) {
        return -1;
      }

      return 0;
    });
    const stackedBarData = raidDps.map((record) => [record.dps.mean]);
    const boxPlotData = raidDps.map((record) => (
      [record.dps.min, record.dps.q1, record.dps.median, record.dps.q3, record.dps.max]
    ));

    return this.renderExpansionPanel(
      'Raid Summary',

      (
        <div>
          <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
            {this.renderChip('Damage (Mean)', report.sim.statistics.total_dmg.mean.toLocaleString())}
            {this.renderChip('DPS (Mean)', report.sim.statistics.raid_dps.mean.toLocaleString())}
          </div>
          <div style={{flexBasis: '100%', marginBottom: '1rem'}}>
            <HighchartsChart
              title={{
                text: 'Damage per Second',
              }}
            >
              <Chart
                height={raidDps.length * 50}
              />

              <XAxis
                categories={raidDps.map((record) => record.name)}
                type="category"
              />

              <YAxis
                id="stackedDps"
                labels={false}
              >
                <BarSeries
                  name="Damage per Second"
                  data={stackedBarData}
                />
                <BoxPlotSeries name="Damage per Second" data={boxPlotData}/>
              </YAxis>

              <Tooltip/>
            </HighchartsChart>
          </div>

          <Divider/>

          <div style={{flexBasis: '100%'}}>
            <Paper className={this.props.classes.raidEventsPaper}>
              <Typography type="headline" component="h3">Raid Events</Typography>
              <List>
                {report.sim.raid_events.map((raidEvent, index) => {
                  const {name, ...conditions} = raidEvent;

                  let conditionsStringPieces = [];

                  for (const key in conditions) {
                    if (conditions.hasOwnProperty(key)) {
                      conditionsStringPieces.push(`${key}=${conditions[key]}`);
                    }
                  }

                  return (
                    <ListItem key={index}>
                      <ListItemText
                        className={this.props.classes.raidEventItem}
                        primary={name}
                        secondary={conditionsStringPieces.join(',')}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </div>
        </div>
      ),
    );
  }

  renderDpsVariance() {
    const playersByApm = report.sim.players
      .map((player) => ({
        name: player.name,
        apm: (player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean * 60),
      }))
      .sort((a, b) => {
        if (a.apm < b.apm) {
          return 1;
        }

        if (a.apm > b.apm) {
          return -1;
        }

        return 0;
      });

    return this.renderExpansionPanel(
      'Actions per Minute / DPS Variance Summary',

      (
        <HighchartsChart>
          <Chart
            height={report.sim.players.length * 50}
          />
          <XAxis categories={playersByApm.map((player) => player.name)} type="category"/>
          <YAxis id="stackedApm">
            <BarSeries
              name="Actions per Minute"
              data={playersByApm.map((player) => player.apm)}
            />
          </YAxis>
          <Tooltip/>
        </HighchartsChart>
      ),
    );
  }

  render() {
    const {simulation_length: fightLength} = report.sim.statistics;

    return (
      <div>
        <AppBar position="static">
          <Toolbar style={{justifyContent: 'space-between'}}>
            <Typography
              color="inherit"
              type="title"
            >
              SimulationCraft
            </Typography>
            <div style={{display: 'flex'}}>
              {this.renderChip('Timestamp', `${report.build_date} ${report.build_time}`)}
              {this.renderChip('Iterations', report.sim.options.iterations)}
              {this.renderChip('Target Error', report.sim.options.target_error)}
              {this.renderChip('Fight Length', `${fightLength.min.toFixed()} - ${fightLength.max.toFixed()}`)}
              {this.renderChip('Fight Style', report.sim.options.fight_style)}
            </div>
          </Toolbar>
        </AppBar>

        {this.renderRaidSummary()}

        {this.renderDpsVariance()}

        {report.sim.players.map((player, index) => (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography style={{flexBasis: '20%'}}>{player.name}</Typography>
              <Typography color="secondary">{player.collected_data.dps.mean.toLocaleString()} DPS</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default withHighcharts(withStyles(styles)<{}>(App), Highcharts);
