import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
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

        <Divider/>

        <ExpansionPanelDetails style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
          <div style={{width: '49.5%'}}>
            <StackedRaidApm players={players}/>
          </div>
          <div style={{width: '49.5%'}}>
            <StackedRaidDpsVariance players={players}/>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default ApmDpsVariance;
