import * as React from 'react';
import ActorPanel from './ActorPanel';
import ApmDpsVariance from './ApmDpsVariance';
import RaidSummary from './RaidSummary';
import TitleBar from './TitleBar';

interface ReportProps {
  simulationData: JsonReport;
}

export default class Report extends React.PureComponent<ReportProps> {
  render() {
    const {
      build_date: buildDate,
      build_time: buildTime,
      sim: {
        options: {
          confidence_estimator: confidenceEstimator,
          iterations,
          max_time: maxTime,
          fight_style: fightStyle,
          target_error: targetError,
          vary_combat_length: varyCombatLength,
        },
        players,
        raid_events: raidEvents,
        statistics: {
          raid_dps: {
            mean: raidDps,
          },
          simulation_length: {
            mean: simulationLength
          },
          total_dmg: {
            mean: totalDamage,
          },
        },
      },
    } = this.props.simulationData;

    return (
      <div>
        <TitleBar {...{buildDate, buildTime, fightStyle, iterations, maxTime, targetError, varyCombatLength}}/>

        <RaidSummary {...{players, raidDps, raidEvents, totalDamage}}/>

        <ApmDpsVariance players={players}/>

        {players.map((actor, index) => (
          <ActorPanel {...{actor, confidenceEstimator, simulationLength, key: index}}/>
        ))}
      </div>
    );
  }
}
