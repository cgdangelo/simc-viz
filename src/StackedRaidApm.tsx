import * as Highcharts from 'highcharts';
import * as React from 'react';
import {
  BarSeries,
  BoxPlotSeries,
  Chart,
  HighchartsChart,
  Tooltip,
  withHighcharts,
  XAxis,
  YAxis,
} from 'react-jsx-highcharts';
import { getColorBySpecialization } from './util/Specializations';

interface StackedRaidApmProps {
  players: Actor[];
}

class StackedRaidApm extends React.PureComponent<StackedRaidApmProps> {
  render() {
    const {players} = this.props;

    const playersByApm = players.map((player) => ({
      name: player.name,
      specialization: player.specialization,
      apm: player.collected_data.executed_foreground_actions.mean / player.collected_data.fight_length.mean * 60,
    }));

    playersByApm.sort((a, b) => {
      if (a.apm < b.apm) {
        return 1;
      }

      if (a.apm > b.apm) {
        return -1;
      }

      return 0;
    });

    const stackedBarData = playersByApm.map((record) => ({
      color: getColorBySpecialization(record.specialization),
      y: record.apm,
    }));

    return (
      <HighchartsChart title={{text: 'Actions per Minute'}}>
        <Chart height={Math.max(playersByApm.length * 50, 300)}/>

        <XAxis categories={playersByApm.map((player) => player.name)} type="category"/>

        <YAxis id="stackedApm">
          <BarSeries name="Actions per Minute" data={stackedBarData}/>
        </YAxis>

        <Tooltip/>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(StackedRaidApm, Highcharts);
