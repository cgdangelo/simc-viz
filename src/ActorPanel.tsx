import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { default as MuiTooltip } from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import { withHighcharts } from 'react-jsx-highcharts';
import Chip from './Chip';
import { getPrimaryResourceBySpecialization } from './util/Specializations';

interface ActorPanelProps {
  actor: Actor;
  confidenceEstimator: number;
  simulationLength: number;
}

class ActorPanel extends React.PureComponent<ActorPanelProps> {
  render() {
    const {actor, confidenceEstimator, simulationLength} = this.props;

    const primaryResource = getPrimaryResourceBySpecialization(actor.specialization);
    const primaryResourceLost = actor.collected_data.resource_lost[primaryResource].mean;
    const dpr = actor.collected_data.dmg.mean / primaryResourceLost;

    const dpsError = confidenceEstimator * actor.collected_data.dps.mean_std_dev;
    const dpsErrorPercent = dpsError * 100 / actor.collected_data.dps.mean;

    const waitingTimeMean = actor.collected_data.waiting_time && actor.collected_data.waiting_time.mean || 0;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography style={{flexBasis: '20%'}} type="title">{actor.name}</Typography>
          <Typography color="secondary">
            {Highcharts.numberFormat(actor.collected_data.dps.mean, 0)} DPS
          </Typography>
        </ExpansionPanelSummary>

        <Divider/>

        <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
          <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
            <Chip label="Race" value={actor.race}/>
            <Chip label="Specialization" value={actor.specialization}/>
            <Chip label="Level" value={actor.level}/>
            <Chip label="Role" value={actor.role}/>
            <Chip label="Position" value="Not in JSON"/>
          </div>

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
                          title={
                            'This is the range of values containing 95.00% of the data, roughly centered on ' +
                            'the mean.'
                          }
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
                          title={
                            'This is the percentage of time in which no action can be taken other than autoattacks. ' +
                            'This can be caused by resource starvation, lockouts, and timers.'
                          }
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
                        {Highcharts.numberFormat(
                          actor.collected_data.executed_foreground_actions.mean /
                          actor.collected_data.fight_length.mean * 60,
                          1,
                        )}
                      </TableCell>
                      <TableCell numeric={true}>
                        {Highcharts.numberFormat(
                          actor.collected_data.fight_length.mean / simulationLength * 100,
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
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withHighcharts(ActorPanel, Highcharts);
