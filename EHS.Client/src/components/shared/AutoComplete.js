import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import Select from 'react-select';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, NoSsr, TextField, Paper, MenuItem } from '@material-ui/core';

// this code essentially comes from https://material-ui.com/components/autocomplete/
// made tweaks to work dynamically for this app 

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 2,
  },
  input: {
    display: 'flex',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  valueContainer: {
    display: 'flex',
    // flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    // overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  // placeholder: {
  //   position: 'absolute',
  //   left: 2,
  //   bottom: 6,
  //   fontSize: 16,
  // },
  // paper: {
  //   position: 'absolute',
  //   zIndex: 1,
  //   marginTop: theme.spacing(1),
  //   left: 0,
  //   right: 0,
  // }
}));

function NoOptionsMessage(props) {
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

NoOptionsMessage.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * Props to be passed on to the wrapper.
   */
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
};

function Control(props) {
  const {
		children,
		innerProps,
		innerRef,
		selectProps: { classes, TextFieldProps },
  } = props;
  // console.log(props); 
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
        className: classes.input,
        ref: innerRef,
        children,
        ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  /**
   * Children to render.
   */
  children: PropTypes.node,
  /**
   * The mouse down event and the innerRef to pass down to the controller element.
   */
  innerProps: PropTypes.shape({
    onMouseDown: PropTypes.func.isRequired,
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  selectProps: PropTypes.object.isRequired,
};

function Option(props) {
  // Fix https://github.com/JedWatson/react-select/issues/3128#issuecomment-439207355
  const { onMouseMove, onMouseOver, ...newInnerProps } = props.innerProps;
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...newInnerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired,
  }).isRequired,
  /**
   * Inner ref to DOM Node
   */
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  /**
   * Whether the option is focused.
   */
  isFocused: PropTypes.bool.isRequired,
  /**
   * Whether the option is selected.
   */
  isSelected: PropTypes.bool.isRequired,
};

function Placeholder(props) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

Placeholder.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * Props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.any.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
};

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.element.isRequired,
  /**
   * Props to be passed to the menu wrapper.
   */
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const AutoComplete = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const { label, placeholder, name, options, value, handleChange, className, required, error, helperText } = props; 
  
  return (
    <div className={className}>
      <NoSsr>
        <Select
          name={name}
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          TextFieldProps={{            
            required,
            error, 
            helperText,
            label: label,
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
          // filterOption={createFilter({ignoreAccents: false})}
          }}
          placeholder={placeholder}
          options={options}
          components={components}
          value={value}
          onChange={handleChange}
        />
      </NoSsr>
    </div>
  );
}

export default AutoComplete; 