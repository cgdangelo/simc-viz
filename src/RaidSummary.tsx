import { numberFormat } from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import Chip from './Chip';
import RaidEvents from './RaidEvents';
import StackedRaidDps from './StackedRaidDps';

interface RaidSummaryProps {
  players: Actor[];
  raidEvents: RaidEvent[];
  totalDamage: number;
  raidDps: number;
}

class RaidSummary extends React.PureComponent<RaidSummaryProps> {
  render() {
    const {players, raidDps, raidEvents, totalDamage} = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography color="inherit" type="title">Raid Summary</Typography>
        </ExpansionPanelSummary>

        <Divider/>

        <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
          <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
            <Chip label="Damage (Mean)" value={numberFormat(totalDamage, 0)}/>
            <Chip label="DPS (Mean)" value={numberFormat(raidDps, 0)}/>
          </div>

          <StackedRaidDps {...{players}}/>

          <RaidEvents {...{raidEvents}}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default RaidSummary;
