import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


function valuetext(value) {
  return value;
}

const CustomSlider = (props) => {

  const { min, max, step, value, className } = props;

  let marks = [];
  for(let i = min; i <= max; i += step){
	marks.push({
		value: i, 
		label: i
	})
  }

  return (
	<div className={className}>
		<Slider
			defaultValue={value}
			getAriaValueText={valuetext}
			aria-labelledby="discrete-slider"
			valueLabelDisplay="auto"
			step={step}
			marks
			min={min}
			max={max}
			
		/>	  
    </div>
  );
}

export default CustomSlider; 