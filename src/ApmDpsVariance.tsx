import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import StackedRaidApm from './StackedRaidApm';
import StackedRaidDpsVariance from './StackedRaidDpsVariance';

interface ApmDpsVarianceProps {
  players: Actor[];
}

class ApmDpsVariance extends React.PureComponent<ApmDpsVarianceProps> {
  render() {
    const {players} = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography color="inherit" type="title">APM / DPS Variance</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <StackedRaidApm players={players}/>
            </Grid>
            <Grid item={true} xs={6}>
              <StackedRaidDpsVariance players={players}/>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default ApmDpsVariance;
