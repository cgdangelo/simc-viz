import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {
  blue,
  blueGrey,
  brown,
  deepPurple,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from 'material-ui/colors';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import { default as MuiTooltip } from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import * as React from 'react';
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

require('highcharts/highcharts-more')(Highcharts);

const classColorMap = {
  'frost death knight': red[500],
  'unholy death knight': red[500],
  'havoc demon hunter': purple[500],
  'balance druid': orange[500],
  'feral druid': orange[500],
  'beast mastery hunter': lightGreen[500],
  'marksmanship hunter': lightGreen[500],
  'survival hunter': lightGreen[500],
  'arcane mage': lightBlue[500],
  'fire mage': lightBlue[500],
  'frost mage': lightBlue[500],
  'windwalker monk': teal.A400,
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

const classResourceMap = {
  'frost death knight': 'runic_power',
  'unholy death knight': 'runic_power',
  'havoc demon hunter': 'fury',
  'balance druid': 'astral_power',
  'feral druid': 'energy',
  'beast mastery hunter': 'focus',
  'marksmanship hunter': 'focus',
  'survival hunter': 'focus',
  'arcane mage': 'mana',
  'fire mage': 'mana',
  'frost mage': 'mana',
  'windwalker monk': 'energy',
  'retribution paladin': 'holy_power',
  'shadow priest': 'insanity',
  'assassination rogue': 'energy',
  'outlaw rogue': 'energy',
  'subtlety rogue': 'energy',
  'elemental shaman': 'maelstrom',
  'enhancement shaman': 'maelstrom',
  'affliction warlock': 'mana',
  'demonology warlock': 'mana',
  'destruction warlock': 'mana',
  'arms warrior': 'rage',
  'fury warrior': 'rage',

  'default': indigo[200],
};

Highcharts.setOptions({
  chart: {
    // backgroundColor: indigo[50],
    // borderColor: indigo[500],
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
      fillColor: blueGrey[700],
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

  getPrimaryResourceBySpecialization(specialization: string) {
    const lowerSpecialization = specialization.toLowerCase();

    if (lowerSpecialization in classResourceMap) {
      return classResourceMap[lowerSpecialization];
    }

    return 'mana';
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
            {this.renderChip('Damage (Mean)', Highcharts.numberFormat(report.sim.statistics.total_dmg.mean, 0))}
            {this.renderChip('DPS (Mean)', Highcharts.numberFormat(report.sim.statistics.raid_dps.mean, 0))}
          </div>
          <div style={{flexBasis: '100%', marginBottom: '1rem'}}>
            <HighchartsChart
              title={{
                text: 'Damage per Second',
              }}
              width="100%"
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
      <HighchartsChart
        title={{
          text: 'Actions per Minute',
        }}
      >
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
      <HighchartsChart
        title={{
          text: 'DPS Variance Percentage',
        }}
      >
        <Chart
          height={report.sim.players.length * 50}
        />
        <XAxis categories={playersByDpsVariance.map((player) => player.name)} type="category"/>
        <YAxis id="stackedDpsVariance">
          <BarSeries
            name="DPS Variance Percentage"
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

  renderActor(actor: Actor, index: number) {
    const primaryResource = this.getPrimaryResourceBySpecialization(actor.specialization);
    const primaryResourceLost = actor.collected_data.resource_lost[primaryResource].mean;
    const dpr = actor.collected_data.dmg.mean / primaryResourceLost;

    const dpsError = report.sim.options.confidence_estimator * actor.collected_data.dps.mean_std_dev;
    const dpsErrorPercent = dpsError * 100 / actor.collected_data.dps.mean;

    const waitingTimeMean = actor.collected_data.waiting_time && actor.collected_data.waiting_time.mean || 0;

    return (
      <ExpansionPanel key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography style={{flexBasis: '20%'}} type="title">{actor.name}</Typography>
          <Typography color="secondary">
            {Highcharts.numberFormat(actor.collected_data.dps.mean, 0)} DPS
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
          <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
            {this.renderChip('Race', actor.race)}
            {this.renderChip('Specialization', actor.specialization)}
            {this.renderChip('Level', actor.level)}
            {this.renderChip('Role', actor.role)}
            {this.renderChip('Position', 'Not in JSON')}
          </div>

          <div style={{flexBasis: '100%'}}>
            <ExpansionPanel elevation={5}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography type="subheading">Results, Spec &amp; Gear</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Paper style={{flexBasis: '50%', marginRight: '1rem'}}>
                  <Table style={{overflow: 'visible'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Average damage per active player duration."
                          >
                            <div>DPS</div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Average damage per fight duration."
                          >
                            <div>
                              DPSe
                            </div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Estimator for the 95.00% confidence interval."
                          >
                            <div>
                              DPS Error
                            </div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="This is the range of values containing 95.00% of the data, roughly centered on the mean."
                          >
                            <div>
                              DPS Range
                            </div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Average damage per resource point spent."
                          >
                            <div>
                              DPR
                            </div>
                          </MuiTooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(actor.collected_data.dps.mean, 0)}
                        </TableCell>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(actor.collected_data.dpse.mean, 0)}
                        </TableCell>
                        <TableCell>
                          {Highcharts.numberFormat(dpsError, 0)} / {Highcharts.numberFormat(dpsErrorPercent, 3)}%
                        </TableCell>
                        <TableCell>Not in JSON</TableCell>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(dpr, 0)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>

                <Paper style={{flexBasis: '50%'}}>
                  <Table style={{overflow: 'visible'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Average primary resource points consumed per second."
                          >
                            <div>RPS Out</div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Average primary resource points generated per second."
                          >
                            <div>RPS In</div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell>
                          Primary Resource
                        </TableCell>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="This is the percentage of time in which no action can be taken other than autoattacks. This can be caused by resource starvation, lockouts, and timers."
                          >
                            <div>Waiting</div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell numeric={true}>
                          <MuiTooltip
                            PopperProps={{
                              PopperClassName: 'muiPopper',
                            }}
                            title="Average number of actions executed per minute."
                          >
                            <div>APM</div>
                          </MuiTooltip>
                        </TableCell>
                        <TableCell numeric={true}>
                          Active
                        </TableCell>
                        <TableCell numeric={true}>
                          Skill
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(primaryResourceLost / actor.collected_data.fight_length.mean)}
                        </TableCell>
                        <TableCell numeric={true}>
                          Not in JSON
                        </TableCell>
                        <TableCell>
                          {primaryResource}
                        </TableCell>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(waitingTimeMean / actor.collected_data.fight_length.mean * 100, 3)}%
                        </TableCell>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(actor.collected_data.executed_foreground_actions.mean / actor.collected_data.fight_length.mean * 60, 1)}
                        </TableCell>
                        <TableCell numeric={true}>
                          {Highcharts.numberFormat(
                            actor.collected_data.fight_length.mean / report.sim.statistics.simulation_length.mean * 100,
                            3,
                          )}%
                        </TableCell>
                        <TableCell numeric={true}>
                          Not in JSON
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  render() {
    const {max_time: fightLength, vary_combat_length: varyCombatLength} = report.sim.options;
    const minFightLength = fightLength * (1 - varyCombatLength)
    const maxFightLength = fightLength * (1 + varyCombatLength)
    const fightLengthString = `${Highcharts.numberFormat(minFightLength, 0)}${maxFightLength > minFightLength ? ` - ${Highcharts.numberFormat(maxFightLength, 0)}` : null}`;

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
              {this.renderChip('Fight Length', fightLengthString)}
              {this.renderChip('Fight Style', report.sim.options.fight_style)}
            </div>
          </Toolbar>
        </AppBar>

        {this.renderRaidSummary()}

        {this.renderApmDpsVariance()}

        {report.sim.players.map((player, index) => (
          this.renderActor(player, index)
        ))}
      </div>
    );
  }
}

export default withHighcharts(withStyles(styles)<{}>(App), Highcharts);
