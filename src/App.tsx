import * as Highcharts from 'highcharts';
import * as React from 'react';
import {
  AreaSplineSeries,
  Chart,
  ColumnSeries,
  HighchartsChart,
  Legend,
  Title,
  Tooltip,
  XAxis,
  YAxis
} from 'react-jsx-highcharts';

const report = require('./report.json');

function binData(data: number[]) {
  const hData: number[][] = [];
  const size = data.length;

  let bins = Math.round(Math.sqrt(size));
  bins = bins > 50 ? 50 : bins;

  const max = Math.max.apply(null, data);
  const min = Math.min.apply(null, data);
  const range = max - min;
  const width = range / bins;
  let binBottom;
  let binTop;

  for (let i = 0; i < bins; i++) {

    binBottom = min + (i * width);
    binTop = binBottom + width;

    if (!hData[i]) {
      hData[i] = new Array(2);
      hData[i][0] = binBottom + (width / 2);
    }

    for (let j = 0; j < size; j++) {
      let x = data[j];

      binBottom = i === 0 && j === 0 ? binBottom - 1 : binBottom;

      if (x > binBottom && x <= binTop) {
        !hData[i][1] ? hData[i][1] = 1 : hData[i][1]++;
      }
    }
  }

  return hData;
}

function computeSlidingWindowAverages(data: number[], windowSize: number = 20) {
  let out = [];

  if (data.length > windowSize) {
    const halfWindow = Math.floor(windowSize / 2);

    let windowSum = 0;

    const first = data[Symbol.iterator]();
    const right = data[Symbol.iterator]();

    let outIndex = 0;

    for (let i = 0; i < halfWindow; ++i) {
      windowSum += right.next().value;
    }

    for (let i = halfWindow; i < windowSize; ++i) {
      windowSum += right.next().value;
      out[outIndex++] = windowSum / windowSize;
    }

    let rightValue;

    while (rightValue = right.next().value) {
      windowSum += rightValue;
      windowSum -= first.next().value;
      out[outIndex++] = windowSum / windowSize;
    }

    for (let i = 2 * halfWindow; i > halfWindow; --i) {
      windowSum -= first.next().value;
      out[outIndex++] = windowSum / windowSize;
    }

    return out;
  } else {
    out = Array.prototype.fill(data.reduce((p, v) => p + v, 0), windowSize);
  }

  return out;
}

type PlayerData = {
  name: string;
  collected_data: {
    dps: {
      data: number[]
    }
    timeline_dmg: {
      data: number[]
    }
    resource_timelines: {
      mana: {
        data: number[]
      }
    }
  }
};

class App extends React.Component {
  createDpsTimelines() {
    return report.sim.players.map((player: PlayerData, index: number) => (
      <AreaSplineSeries
        key={index}
        id={`p_${index}_timeline`}
        name={player.name}
        data={computeSlidingWindowAverages(player.collected_data.timeline_dmg.data)}
      />
    ));
  }

  createHistograms() {
    return report.sim.players.map((player: PlayerData, index: number) => {
      return (
        <ColumnSeries
          key={index}
          id={`p_${index}_histogram`}
          name={player.name}
          data={binData(player.collected_data.dps.data)}
          type="histogram"
        />
      );
    });
  }

  createManaTimelines() {
    return report.sim.players.map((player: PlayerData, index: number) => (
      <AreaSplineSeries
        key={index}
        id={`p_${index}_timeline`}
        name={player.name}
        data={computeSlidingWindowAverages(player.collected_data.resource_timelines.mana.data)}
      />
    ));
  }

  componentDidMount() {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    });
  }

  render() {
    console.log(report); // tslint:disable-line no-console

    return (
      <div className="App">
        <HighchartsChart>
          <Chart zoomType="x"/>

          <Title>DPS Timeline</Title>

          <Tooltip
            headerFormat=""
            pointFormat="{series.name}: <b>{point.y:,.0f} DPS</b><br/>"
          />

          <Legend/>

          <XAxis crosshair={true}>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis id="timeline_dps">
            <YAxis.Title>DPS</YAxis.Title>

            {this.createDpsTimelines()}
          </YAxis>
        </HighchartsChart>

        <HighchartsChart>
          <Chart zoomType="x"/>

          <Title>DPS Distribution</Title>

          <Tooltip
            headerFormat="{series.name}: {point.key:,.0f}<br/>"
            pointFormat="Iterations: {point.y:,.0f}<br/>"
          />

          <Legend/>

          <XAxis crosshair={true}>
            <XAxis.Title>DPS</XAxis.Title>
          </XAxis>

          <YAxis id="dps_distribution">
            <YAxis.Title>Iterations</YAxis.Title>

            {this.createHistograms()}
          </YAxis>
        </HighchartsChart>

        <HighchartsChart>
          <Chart zoomType="x"/>

          <Title>Mana Timeline</Title>

          <Tooltip
            headerFormat=""
            pointFormat="{series.name}: <b>{point.y:,.0f} DPS</b><br/>"
          />

          <Legend/>

          <XAxis crosshair={true}>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis id="timeline_dps">
            <YAxis.Title>Mana</YAxis.Title>

            {this.createManaTimelines()}
          </YAxis>
        </HighchartsChart>
      </div>
    );
  }
}

export default App;
