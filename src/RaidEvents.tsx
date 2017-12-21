import { numberFormat } from 'highcharts';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import * as React from 'react';

interface RaidEventsProps {
  raidEvents: RaidEvent[];
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

class RaidEvents extends React.PureComponent<WithStyles<'raidEventItem' | 'raidEventsPaper'> & RaidEventsProps> {
  render() {
    const {raidEvents} = this.props;

    return (
      <Paper className={this.props.classes.raidEventsPaper} elevation={5}>
        <Typography type="subheading">Raid Events</Typography>
        <List>
          {raidEvents.map((raidEvent, index) => {
            const {name, ...conditions} = raidEvent;

            let conditionsStringPieces = [];

            for (const key in conditions) {
              if (conditions.hasOwnProperty(key)) {
                conditionsStringPieces.push(`${key}: ${conditions[key]}`);
              }
            }

            return (
              <ListItem key={index}>
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
            );
          })}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles)(RaidEvents);
