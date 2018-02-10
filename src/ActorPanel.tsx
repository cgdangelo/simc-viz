import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { default as MuiTooltip } from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import { withHighcharts } from 'react-jsx-highcharts';
import Chip from './Chip';
import { getPrimaryResourceBySpecialization } from './util/Specializations';
import { getTalentLevelByTier } from './util/Talents';
import { LinearProgress } from 'material-ui/Progress';

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
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Grid container={true}>
            <Grid item={true} xs={4}>
              <Typography type="title">{actor.name}</Typography>
            </Grid>
            <Grid item={true} xs={8}>
              <Typography color="textSecondary">
                {Highcharts.numberFormat(actor.collected_data.dps.mean, 0)} DPS
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <Chip label="Race" value={actor.race}/>
              <Chip label="Specialization" value={actor.specialization}/>
              <Chip label="Level" value={actor.level}/>
              <Chip label="Role" value={actor.role}/>
              <Chip label="Position" value="Not in JSON"/>
            </Grid>

            <Grid item={true} xs={12}>
              <ExpansionPanel elevation={5} defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                  <Typography type="subheading">Results, Spec &amp; Gear</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container={true}>
                    <Grid item={true} xs={12}>
                      <Paper>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <MuiTooltip title="Average damage per active player duration.">
                                  <div>DPS</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>
                                <MuiTooltip title="Average damage per fight duration.">
                                  <div>DPSe</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>
                                <MuiTooltip title="Estimator for the 95.00% confidence interval.">
                                  <div>DPS Error</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>
                                <MuiTooltip
                                  title={
                                    'This is the range of values containing 95.00% of the data, roughly centered on ' +
                                    'the mean.'
                                  }
                                >
                                  <div>DPS Range</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>
                                <MuiTooltip title="Average damage per resource point spent.">
                                  <div>DPR</div>
                                </MuiTooltip>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {Highcharts.numberFormat(actor.collected_data.dps.mean, 0)}
                              </TableCell>
                              <TableCell>
                                {Highcharts.numberFormat(actor.collected_data.dpse.mean, 0)}
                              </TableCell>
                              <TableCell>
                                {Highcharts.numberFormat(dpsError, 0)} / {Highcharts.numberFormat(dpsErrorPercent, 3)}%
                              </TableCell>
                              <TableCell>Not in JSON</TableCell>
                              <TableCell>
                                {Highcharts.numberFormat(dpr, 0)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </Grid>

                    <Grid item={true} xs={12}>
                      <Paper>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <MuiTooltip title="Average primary resource points consumed per second.">
                                  <div>RPS Out</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>
                                <MuiTooltip title="Average primary resource points generated per second.">
                                  <div>RPS In</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>Primary Resource</TableCell>
                              <TableCell>
                                <MuiTooltip
                                  title={
                                    'This is the percentage of time in which no action can be ' +
                                    'taken other than autoattacks. This can be caused by resource ' +
                                    'starvation, lockouts, and timers.'
                                  }
                                >
                                  <div>Waiting</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>
                                <MuiTooltip title="Average number of actions executed per minute.">
                                  <div>APM</div>
                                </MuiTooltip>
                              </TableCell>
                              <TableCell>Active</TableCell>
                              <TableCell>Skill</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {Highcharts.numberFormat(primaryResourceLost / actor.collected_data.fight_length.mean)}
                              </TableCell>
                              <TableCell>Not in JSON</TableCell>
                              <TableCell>{primaryResource}</TableCell>
                              <TableCell>
                                {Highcharts.numberFormat(
                                  waitingTimeMean / actor.collected_data.fight_length.mean * 100, 3,
                                )}%
                              </TableCell>
                              <TableCell>
                                {Highcharts.numberFormat(
                                  actor.collected_data.executed_foreground_actions.mean /
                                  actor.collected_data.fight_length.mean * 60,
                                  1,
                                )}
                              </TableCell>
                              <TableCell>
                                {Highcharts.numberFormat(
                                  actor.collected_data.fight_length.mean / simulationLength * 100,
                                  3,
                                )}%
                              </TableCell>
                              <TableCell>Not in JSON</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </Grid>

                    <Grid item={true} xs={12}>
                      <Paper>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Talents</TableCell>
                              <TableCell type="body">
                                <Grid container={true} justify="space-around">
                                  {actor.talents.map((talent, index) => (
                                    <Grid key={index} item={true}>
                                      <Typography type="button" align="center">
                                        {getTalentLevelByTier(talent.tier)}&nbsp;
                                      </Typography>
                                      <Typography type="button" color="primary">
                                        {talent.name}
                                      </Typography>
                                    </Grid>
                                  ))}
                                </Grid>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Artifact</TableCell>
                              <TableCell type="body">
                                <Grid container={true} justify="space-around">
                                  {actor.artifact.map((trait, index) => (
                                    trait.spell_id < 250000 && (
                                      <Grid key={index} item={true}>
                                        <Typography type="button" align="center">
                                          {/* tslint:disable-next-line */}
                                          {trait.total_rank} ({trait.purchased_rank} + {trait.relic_rank} + {trait.crucible_rank})
                                        </Typography>
                                        <div style={{margin: '0.25rem 0'}}>
                                          <LinearProgress mode="determinate" value={(trait.purchased_rank / 4) * 100}/>
                                          <LinearProgress mode="determinate" value={(trait.relic_rank / 3) * 100}/>
                                          <LinearProgress mode="determinate" value={(trait.crucible_rank / 3) * 100}/>
                                        </div>
                                        <Typography type="button" color="primary">
                                          {trait.name}
                                        </Typography>
                                      </Grid>
                                    )
                                  ))}
                                </Grid>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Crucible</TableCell>
                              <TableCell type="body">
                                <Grid container={true} justify="space-around">
                                  {actor.artifact.map((trait, index) => (
                                    trait.spell_id > 250000 && (
                                      <Grid key={index} item={true}>
                                        <Typography type="button" align="center">
                                          {trait.total_rank}
                                        </Typography>
                                        <LinearProgress mode="determinate" value={(trait.crucible_rank / 3) * 100}/>
                                        <Typography type="button" color="primary">
                                          {trait.name}
                                        </Typography>
                                      </Grid>
                                    )
                                  ))}
                                </Grid>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                        </Table>
                      </Paper>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withHighcharts(ActorPanel, Highcharts);
