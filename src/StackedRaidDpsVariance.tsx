import * as Highcharts from 'highcharts';
import * as React from 'react';
import { BarSeries, Chart, HighchartsChart, Tooltip, withHighcharts, XAxis, YAxis } from 'react-jsx-highcharts';
import { getColorBySpecialization } from './util/Specializations';

interface StackedRaidDpsVarianceProps {
  players: Actor[];
}

class StackedRaidDpsVariance extends React.PureComponent<StackedRaidDpsVarianceProps> {
  render() {
    const {players} = this.props;

    const playersByDpsVariance = players.map((player) => ({
      name: player.name,
      specialization: player.specialization,
      variance: player.collected_data.dps.std_dev / player.collected_data.dps.mean * 100,
    }));

    playersByDpsVariance.sort((a, b) => {
      if (a.variance < b.variance) {
        return 1;
      }

      if (a.variance > b.variance) {
        return -1;
      }

      return 0;
    });

    const stackedBarData = playersByDpsVariance.map((player) => ({
      color: getColorBySpecialization(player.specialization),
      y: player.variance,
    }));

    return (
      <HighchartsChart title={{text: 'DPS Variance Percentage'}}>
        <Chart height={Math.max(playersByDpsVariance.length * 50, 300)}/>

        <XAxis categories={playersByDpsVariance.map((player) => player.name)} type="category"/>

        <YAxis id="stackedDpsVariance">
          <BarSeries
            name="DPS Variance Percentage"
            data={stackedBarData}
            dataLabels={{format: '{point.y:,.1f}'}}
          />
        </YAxis>

        <Tooltip/>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(StackedRaidDpsVariance, Highcharts);
