import * as Highcharts from 'highcharts';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
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
import Chip from './Chip';
import { getColorBySpecialization } from './util/Specializations';

interface RaidSummaryProps {
  players: Actor[];
  raidEvents: RaidEvent[];
  totalDamage: number;
  raidDps: number;
}

const styles = (theme: Theme) => ({
  raidEventItem: {
    '& > p': {
      fontFamily: '"Roboto Mono", Consolas, "Courier New", monospace',
    },
  },

  raidEventsPaper: {
    flexBasis: '100%',
    ...theme.mixins.gutters({
      paddingTop: theme.spacing.unit * 2,
    }),
  },
});

class RaidSummary extends React.PureComponent<WithStyles<'raidEventItem' | 'raidEventsPaper'> & RaidSummaryProps> {
  render() {
    const {players, raidDps, raidEvents, totalDamage} = this.props;

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
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography color="inherit" type="title">Raid Summary</Typography>
        </ExpansionPanelSummary>

        <Divider/>

        <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
          <div style={{display: 'flex', flexBasis: '100%', marginBottom: '1rem'}}>
            <Chip label="Damage (Mean)" value={Highcharts.numberFormat(totalDamage, 0)}/>
            <Chip label="DPS (Mean)" value={Highcharts.numberFormat(raidDps, 0)}/>
          </div>

          <Paper elevation={5} style={{flexBasis: '100%', marginBottom: '1rem'}}>
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

          <Paper className={this.props.classes.raidEventsPaper} elevation={5}>
            <Typography type="headline" component="h3">Raid Events</Typography>
            <List>
              {raidEvents.map((raidEvent, index, array) => {
                const {name, ...conditions} = raidEvent;

                let conditionsStringPieces = [];

                for (const key in conditions) {
                  if (conditions.hasOwnProperty(key)) {
                    conditionsStringPieces.push(`${key}: ${conditions[key]}`);
                  }
                }

                return (
                  <div key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <Typography>{index + 1}</Typography>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        className={this.props.classes.raidEventItem}
                        primary={<b>{name}</b>}
                        secondary={conditionsStringPieces.join(', ')}
                      />
                    </ListItem>

                    {index !== array.length - 1 && <Divider/>}
                  </div>
                );
              })}
            </List>
          </Paper>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withHighcharts(withStyles(styles)(RaidSummary), Highcharts);
