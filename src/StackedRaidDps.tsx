import * as Highcharts from 'highcharts';
import Paper from 'material-ui/Paper';
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

interface StackedRaidDpsProps {
  players: Actor[];
}

class StackedRaidDps extends React.PureComponent<StackedRaidDpsProps> {
  render() {
    const {players} = this.props;

    const playersByDps = players.map((player) => ({
      name: player.name,
      specialization: player.specialization,
      dps: player.collected_data.dps,
    }));

    playersByDps.sort((a, b) => {
      if (a.dps.mean < b.dps.mean) {
        return 1;
      }

      if (a.dps.mean > b.dps.mean) {
        return -1;
      }

      return 0;
    });

    const stackedBarData = playersByDps.map((record) => ({
      color: getColorBySpecialization(record.specialization),
      y: record.dps.mean,
    }));

    const boxPlotData = playersByDps.map((record) => (
      [record.dps.min, record.dps.q1, record.dps.median, record.dps.q3, record.dps.max]
    ));

    return (
      <Paper elevation={5}>
        <HighchartsChart title={{text: 'Damage per Second'}}>
          <Chart height={Math.max(playersByDps.length * 50, 300)}/>

          <XAxis categories={playersByDps.map((record) => record.name)} type="category"/>

          <YAxis id="stackedDps">
            <BarSeries name="Damage per Second" data={stackedBarData}/>
            <BoxPlotSeries name="Damage per Second" data={boxPlotData}/>
          </YAxis>

          <Tooltip/>
        </HighchartsChart>
      </Paper>
    );
  }
}

export default withHighcharts(StackedRaidDps, Highcharts);
