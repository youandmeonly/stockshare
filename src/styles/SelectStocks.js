/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});



class IntegrationReactSelect extends React.Component {
  state = {
    single: null,
    multi: null,
    stockslist: this.props.stocksdata
  };

  NoOptionsMessage = (props) => {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  inputComponent = ({ inputRef, ...props }) => {
    return <div ref={inputRef} {...props} />;
  }

  Control = (props) => {
    return (
      <div ref={(node) => { this.anchorEl = node; }}>
        <TextField
          fullWidth
          InputProps={{
            inputComponent: this.inputComponent,
            inputProps: {
              className: props.selectProps.classes.input,
              inputRef: props.innerRef,
              children: props.children,
              ...props.innerProps,
            },
          }}
          {...props.selectProps.textFieldProps}
        />
      </div>
    );
  }

  Option = (props) => {
    return (
      <MenuItem
        buttonRef={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
  }

  Placeholder = (props) => {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  SingleValue = (props) => {
    return (
      <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
      </Typography>
    );
  }

  ValueContainer = (props) => {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
  }

  MultiValue = (props) => {
    return (
      <Chip
        tabIndex={-1}
        label={props.children}
        className={classNames(props.selectProps.classes.chip, {
          [props.selectProps.classes.chipFocused]: props.isFocused,
        })}
        onDelete={props.removeProps.onClick}
        deleteIcon={<CancelIcon {...props.removeProps} />}
      />
    );
  }

  Menu = (props) => {
    return (
      <Popper
        open
        anchorEl={this.anchorEl}
        transition
        placement="bottom-start"
        disablePortal={false}
        style={{ zIndex: 2147483601, width: this.anchorEl.clientWidth }}
        modifiers={{
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          }
        }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={150}>
            <Paper square {...props.innerProps}>
              {props.children}
            </Paper>
          </Fade>
        )}
      </Popper>
    );
  }

  components = () => ({
    Control: this.Control,
    Menu: this.Menu,
    MultiValue: this.MultiValue,
    NoOptionsMessage: this.NoOptionsMessage,
    Option: this.Option,
    Placeholder: this.Placeholder,
    ValueContainer: this.ValueContainer,
  })


  handleChange = name => value => {
    if (value.length <= 3) {
      this.props.renderonlytimseriesgraph(value)
      this.setState({
        [name]: value,
      });
    }
    else {
      this.props.showSnackBar("You can select only upto three Stocks")
    }
  };

  componentWillReceiveProps = (newprops, oldprops) => {
    this.setState({
      stockslist: newprops.stocksdata.map(elem => ({
        value: elem.value,
        label: elem.key + ' - ' + elem.value,
      })),
      multi: newprops.clearselectedstocks
    })
  }

  render() {
    const { classes, theme } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };


    return (
      <div>
        <Select
          id="selectStocks"
          classes={classes}
          styles={selectStyles}
          textFieldProps={{
            label: 'Stock',
            InputLabelProps: {
              shrink: true,
            },
          }}
          options={this.state.stockslist}
          components={this.components()}
          value={this.props.multivalues}
          onChange={this.handleChange('multi')}
          placeholder="Stock Names"
          isMulti
        />
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
