import { numberFormat } from 'highcharts';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import Chip from './Chip';

interface TitleBarProps {
  buildDate: string;
  buildTime: string;
  fightStyle: string;
  iterations: number;
  maxTime: number;
  targetError: number;
  varyCombatLength: number;
}

export default class TitleBar extends React.PureComponent<TitleBarProps> {
  render() {
    const {buildDate, buildTime, fightStyle, iterations, maxTime, targetError, varyCombatLength} = this.props;

    const minFightLength = maxTime * (1 - varyCombatLength);
    const maxFightLength = maxTime * (1 + varyCombatLength);

    let fightLengthString = numberFormat(minFightLength, 0);

    if (minFightLength !== maxFightLength) {
      fightLengthString += ` - ${numberFormat(maxFightLength, 0)}`;
    }

    return (
      <AppBar position="static">
        <Toolbar style={{justifyContent: 'space-between'}}>
          <Typography color="inherit" type="title">
            SimulationCraft
          </Typography>
          <div style={{display: 'flex'}}>
            <Chip label="Timestamp" value={`${buildDate} ${buildTime}`}/>
            <Chip label="Iterations" value={iterations}/>
            <Chip label="Target Error" value={targetError}/>
            <Chip label="Fight Length" value={fightLengthString}/>
            <Chip label="Fight Style" value={fightStyle}/>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}
