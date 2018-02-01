import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
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

                    {actor.talents.length > 0 && (
                      <Grid item={true} xs={12}>
                        <Paper>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Talents</TableCell>
                                <TableCell colSpan={actor.talents.length - 1}>
                                  <Typography align="right">
                                    <Button href="/">Talent Calculator</Button>
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                {actor.talents.map((talent, index) => (
                                  <TableCell key={index}>
                                    <Button
                                      href={`//wowhead.com/spell=${talent.spell_id}`}
                                      data-wowhead={`spell=${talent.spell_id}`}
                                    >
                                      {talent.name}
                                    </Button>
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    )}

                    {actor.artifact.length > 0 && (
                      <Grid item={true} xs={12}>
                        <Paper>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Artifact</TableCell>
                                <TableCell colSpan={4}>
                                  <Typography align="right">
                                    <Button href="/">Artifact Calculator</Button>
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell numeric={true}>
                                  <TableSortLabel>Total Rank</TableSortLabel>
                                </TableCell>
                                <TableCell numeric={true}>
                                  <TableSortLabel>Artifact Rank</TableSortLabel>
                                </TableCell>
                                <TableCell numeric={true}>
                                  <TableSortLabel>Relic Rank</TableSortLabel>
                                </TableCell>
                                <TableCell numeric={true}>
                                  <TableSortLabel>Crucible Rank</TableSortLabel>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {actor.artifact.map((trait, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Button
                                      href={`//wowhead.com/spell=${trait.spell_id}`}
                                      data-wowhead={`spell=${trait.spell_id}`}
                                    >
                                      {trait.name}
                                    </Button>
                                  </TableCell>
                                  <TableCell numeric={true}>{trait.total_rank}</TableCell>
                                  <TableCell numeric={true}>{trait.purchased_rank}</TableCell>
                                  <TableCell numeric={true}>{trait.relic_rank}</TableCell>
                                  <TableCell numeric={true}>{trait.crucible_rank}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    )}
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
