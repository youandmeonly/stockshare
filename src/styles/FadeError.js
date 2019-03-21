import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import ErrorChip from './ErrorChip'

const styles = theme => ({
  root: {
    height: 180,
  },
  container: {
    display: 'flex',
  },
  paper: {
    margin: theme.spacing.unit,
  },
});

class SimpleFade extends React.Component {
  state = {
    error: false,
  };

  componentWillReceiveProps(newprops){
      this.setState({
          error : newprops.error
      })
  }

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div className={classes.root}>
        {/* <Switch checked={checked} onChange={this.handleChange} aria-label="Collapse" /> */}
        <div className={classes.container}>
          <Fade in={error}>
            <Paper elevation={0} className={classes.paper}>
              <ErrorChip />
            </Paper>
          </Fade>
        </div>
      </div>
    );
  }
}

SimpleFade.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleFade);
