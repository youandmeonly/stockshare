import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

// function handleDelete() {
// //   alert('You clicked the delete icon.'); // eslint-disable-line no-alert
// }

function Chips(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      
      <Chip
        icon={<FaceIcon />}
        label="You can select only upto 3 Stocks"
        // onDelete={this.handleDelete()}
        className={classes.chip}
        color="secondary"
      />
    </div>
  );
}

Chips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Chips);