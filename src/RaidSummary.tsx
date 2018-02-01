import { numberFormat } from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
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

        <ExpansionPanelDetails>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <Chip label="Damage (Mean)" value={numberFormat(totalDamage, 0)}/>
              <Chip label="DPS (Mean)" value={numberFormat(raidDps, 0)}/>
            </Grid>

            <Grid item={true} xs={12}>
              <StackedRaidDps {...{players}}/>
            </Grid>

            <Grid item={true} xs={12}>
              <RaidEvents {...{raidEvents}}/>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default RaidSummary;
