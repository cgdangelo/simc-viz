import * as React from 'react';
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

        {/*{simulationData.sim.players.map((player, index) => (*/}
        {/*this.renderActor(player, index)*/}
        {/*))}*/}
      </div>
    );
  }
}
