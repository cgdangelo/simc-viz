import * as React from 'react';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Chip from 'material-ui/Chip';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';

const report = require('./report.json');

console.log(report);

const decorate = withStyles((theme: Theme) => ({
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

class App extends React.Component<WithStyles<'chip' | 'chip:first-child'>> {
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

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="inherit" type="title">Raid Information</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.renderChip('Damage (Mean)', report.sim.statistics.total_dmg.mean.toLocaleString())}
            {this.renderChip('DPS (Mean)', report.sim.statistics.raid_dps.mean.toLocaleString())}
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {report.sim.players.map((player: any, index: number) => (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={{flexBasis: '20%'}}>{player.name}</Typography>
              <Typography color="secondary">{player.collected_data.dps.mean.toLocaleString()} DPS</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default decorate<{}>(App);
