import { ChipProps as MuiChipProps, default as MuiChip } from 'material-ui/Chip';
import { Theme } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import * as React from 'react';

interface ChipProps {
  label: string;
  value: {};
  muiProps?: MuiChipProps;
}

const styles = ((theme: Theme) => ({
  root: {
    margin: theme.spacing.unit,
    '&:first-child': {
      marginLeft: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
  },
}));

class Chip extends React.PureComponent<WithStyles<'root'> & ChipProps> {
  render() {
    const {label, value, muiProps, classes: {root}} = this.props;

    return (
      <MuiChip
        className={root}
        label={
          <Typography>
            <b>{label}</b> {value}
          </Typography>
        }
        {...muiProps}
      />
    );
  }
}

export default withStyles(styles)(Chip);
