import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from './Logo'
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  outer: {
    paddingRight: theme.spacing.unit ,
    paddingLeft: theme.spacing.unit * 20,
    float: 'right'
  }
});

function DenseAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Share Market
          </Typography>
          <Grid justify="center" alignItems="center" className={classes.outer}>
          <Avatar className={classes.orangeAvatar}>VK</Avatar>
          </Grid>
          <IconButton
                // aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={() => console.log('hai')}
                color="inherit"
              >
                <Avatar className={classes.orangeAvatar}>VK</Avatar>
              </IconButton>
          {/* <Logo /> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

DenseAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DenseAppBar);
