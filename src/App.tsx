import * as React from 'react';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpansionPanel, { ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
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
  },
}));

class App extends React.Component<WithStyles<'chip'>> {
  renderTitleChip(label: string, value: {}) {
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
          <Toolbar>
            <Typography color="inherit" type="title">SimulationCraft</Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: '1rem',
                width: '100%',
              }}
            >
              {this.renderTitleChip('Timestamp', `${report.build_date} ${report.build_time}`)}
              {this.renderTitleChip('Iterations', report.sim.options.iterations)}
              {this.renderTitleChip('Target Error', report.sim.options.target_error)}
              {this.renderTitleChip('Fight Length', `${fightLength.min.toFixed()} - ${fightLength.max.toFixed()}`)}
            </div>
          </Toolbar>
        </AppBar>

        {report.sim.players.map((player: any, index: number) => (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                style={{
                  flexBasis: '33.3%',
                  flexShrink: 0,
                }}
              >
                {player.name}
              </Typography>
              <Typography color="secondary">{player.collected_data.dps.mean.toLocaleString()} DPS</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default decorate<{}>(App);
