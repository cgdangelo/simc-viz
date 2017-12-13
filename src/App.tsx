import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AppBar from 'material-ui/AppBar';
import Chip from 'material-ui/Chip';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import {
  BoxPlotSeries,
  Chart,
  ColumnSeries,
  HighchartsChart,
  Tooltip,
  withHighcharts,
  XAxis,
  YAxis
} from 'react-jsx-highcharts';

require('highcharts/highcharts-more')(Highcharts);

const report = require('./report.json');

console.log(report);

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
}));

class App extends React.Component<WithStyles<'chip'>> {
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

  render() {
    const {simulation_length: fightLength} = report.sim.statistics;

    const raidDps = report.sim.players.map((player: any) => ({
      name: player.name,
      // data: player.collected_data.timeline_dmg.data
      dps: player.collected_data.dps
    }));

    raidDps.sort((a: any, b: any) => {
      if (a.dps.max > b.dps.max) {
        return 1;
      }

      if (a.dps.max < b.dps.max) {
        return -1;
      }

      return 0;
    });

    const stackedBarData = raidDps.map((record: any) => [record.dps.mean]);
    const boxPlotData = raidDps.map((record: any) => [record.dps.min, record.dps.q1, record.dps.median, record.dps.q3, record.dps.max]);

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

        <ExpansionPanel expanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="inherit" type="title">Raid Information</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
            <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
              {this.renderChip('Damage (Mean)', report.sim.statistics.total_dmg.mean.toLocaleString())}
              {this.renderChip('DPS (Mean)', report.sim.statistics.raid_dps.mean.toLocaleString())}
            </div>

            <div style={{flexBasis: '100%'}}>
              <HighchartsChart>
                <Chart inverted={true} type="boxplot"/>

                <XAxis categories={raidDps.map((record: any) => record.name)} type="category">
                  <XAxis.Title>Player</XAxis.Title>
                </XAxis>

                <YAxis id="playerDps">
                  <YAxis.Title>DPS</YAxis.Title>
                  <ColumnSeries data={stackedBarData}/>
                  <BoxPlotSeries name="DPS" data={boxPlotData}/>
                </YAxis>

                <Tooltip/>
              </HighchartsChart>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {report.sim.players.map((player: any, index: number) => (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={{flexBasis: '20%'}}>{player.name}</Typography>
              <Typography color="secondary">{player.collected_data.dps.mean.toLocaleString()}
                DPS</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default withHighcharts(withStyles(styles)
  < {} > (App), Highcharts);
