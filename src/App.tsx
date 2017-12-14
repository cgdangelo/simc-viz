import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {
  blue,
  brown,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  yellow,
} from 'material-ui/colors';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import { Simulate } from 'react-dom/test-utils';
import {
  BarSeries,
  BoxPlotSeries,
  Chart,
  HighchartsChart,
  Tooltip,
  withHighcharts,
  XAxis,
  YAxis,
} from 'react-jsx-highcharts';
import './App.css';
import play = Simulate.play;

require('highcharts/highcharts-more')(Highcharts);

const classColorMap = {
  'frost death knight': red[500],
  'unholy death knight': red[500],
  'havoc demon hunter': purple[500],
  'balance druid': orange[500],
  'feral druid': orange[500],
  'beast mastery hunter': green[500],
  'marksmanship hunter': green[500],
  'survival hunter': green[500],
  'arcane mage': lightBlue[500],
  'fire mage': lightBlue[500],
  'frost mage': lightBlue[500],
  'windwalker monk': lightGreen[500],
  'retribution paladin': pink[500],
  'shadow priest': grey[200],
  'assassination rogue': yellow[500],
  'outlaw rogue': yellow[500],
  'subtlety rogue': yellow[500],
  'elemental shaman': blue[700],
  'enhancement shaman': blue[700],
  'affliction warlock': deepPurple[500],
  'demonology warlock': deepPurple[500],
  'destruction warlock': deepPurple[500],
  'arms warrior': brown[500],
  'fury warrior': brown[500],

  'default': indigo[200],
};

Highcharts.setOptions({
  chart: {
    backgroundColor: indigo[50],
    borderColor: indigo[500],
    borderWidth: 1,
  },
  lang: {
    thousandsSep: ',',
  },
  plotOptions: {
    bar: {
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
          color: grey[700],
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1rem',
        },
        verticalAlign: 'middle',
        x: 5,
        y: 3,
      },
    },
    boxplot: {
      color: 'black',
      fillColor: 'rgba(255, 255, 255, 0.2)',
      whiskerLength: '50%',
    },
  },
  title: {
    style: {
      color: grey[900],
      fontFamily: 'Roboto, sans-serif',
    },
  },
  tooltip: {
    valueDecimals: 1,
  },
  xAxis: {
    labels: {
      style: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
      },
      y: 6,
    },
    lineColor: indigo[500],
    tickColor: indigo[500],
  },
  yAxis: {
    gridLineColor: indigo[100],
    labels: {
      enabled: false,
    },
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

  getColorBySpecialization(specialization: string) {
    const lowerSpecialization = specialization.toLowerCase();

    if (lowerSpecialization in classColorMap) {
      return classColorMap[lowerSpecialization];
    }

    return indigo[500];
  }

  renderRaidSummary() {
    const raidDps = report.sim.players.map((player) => ({
      name: player.name,
      specialization: player.specialization,
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
    const stackedBarData = raidDps.map((record) => ({
      color: this.getColorBySpecialization(record.specialization),
      y: record.dps.mean,
    }));
    const boxPlotData = raidDps.map((record) => (
      [record.dps.min, record.dps.q1, record.dps.median, record.dps.q3, record.dps.max]
    ));

    return this.renderExpansionPanel(
      'Raid Summary',

      (
        <div style={{flexBasis: '100%'}}>
          <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
            {this.renderChip('Damage (Mean)', report.sim.statistics.total_dmg.mean.toLocaleString())}
            {this.renderChip('DPS (Mean)', report.sim.statistics.raid_dps.mean.toLocaleString())}
          </div>
          <div style={{flexBasis: '100%', marginBottom: '1rem'}}>
            <HighchartsChart
              title={{
                text: 'Damage per Second',
              }}
              width='100%'
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
                {report.sim.raid_events.map((raidEvent, index, array) => {
                  const {name, ...conditions} = raidEvent;

                  let conditionsStringPieces = [];

                  for (const key in conditions) {
                    if (conditions.hasOwnProperty(key)) {
                      conditionsStringPieces.push(`${key}: ${conditions[key]}`);
                    }
                  }

                  return (
                    <div key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <Typography>{index + 1}</Typography>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          className={this.props.classes.raidEventItem}
                          primary={<b>{name}</b>}
                          secondary={conditionsStringPieces.join(', ')}
                        />
                      </ListItem>

                      {index !== array.length - 1 && <Divider/>}
                    </div>
                  );
                })}
              </List>
            </Paper>
          </div>
        </div>
      ),
    );
  }

  renderApm() {
    const playersByApm = report.sim.players
      .map((player) => ({
        apm: (player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean * 60),
        name: player.name,
        specialization: player.specialization,
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

    return (
      <HighchartsChart>
        <Chart
          height={report.sim.players.length * 50}
        />
        <XAxis categories={playersByApm.map((player) => player.name)} type="category"/>
        <YAxis id="stackedApm">
          <BarSeries
            name="Actions per Minute"
            data={playersByApm.map((player) => ({
              color: this.getColorBySpecialization(player.specialization),
              y: player.apm,
            }))}
          />
        </YAxis>
        <Tooltip/>
      </HighchartsChart>
    );
  }

  renderDpsVariance() {
    const playersByDpsVariance = report.sim.players
      .map((player) => ({
        name: player.name,
        specialization: player.specialization,
        variance: player.collected_data.dps.std_dev / player.collected_data.dps.mean * 100,
      }))
      .sort((a, b) => {
        if (a.variance < b.variance) {
          return 1;
        }

        if (a.variance > b.variance) {
          return -1;
        }

        return 0;
      });

    return (
      <HighchartsChart>
        <Chart
          height={report.sim.players.length * 50}
        />
        <XAxis categories={playersByDpsVariance.map((player) => player.name)} type="category"/>
        <YAxis id="stackedDpsVariance">
          <BarSeries
            name="Actions per Minute"
            data={playersByDpsVariance.map((player) => ({
              color: this.getColorBySpecialization(player.specialization),
              y: player.variance,
            }))}
            dataLabels={{
              format: '{point.y:,.1f}',
            }}
          />
        </YAxis>
        <Tooltip/>
      </HighchartsChart>
    );
  }

  renderApmDpsVariance() {
    return this.renderExpansionPanel(
      'Actions per Minute / DPS Variance Summary',

      (
        <div style={{display: 'flex', flexBasis: '100%', justifyContent: 'space-between'}}>
          <div style={{flexBasis: '49%'}}>
            {this.renderApm()}
          </div>
          <div style={{flexBasis: '49%'}}>
            {this.renderDpsVariance()}
          </div>
        </div>
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

        {this.renderApmDpsVariance()}

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
