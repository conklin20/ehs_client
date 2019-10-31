import React from 'react';
import Slider from '@material-ui/core/Slider';

function valuetext(value) {
  return value;
}

const CustomSlider = (props) => {

  const { min, max, step, defaultValue, className, handleSliderChange } = props;

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
			defaultValue={defaultValue}
			getAriaValueText={valuetext}
			aria-labelledby="discrete-slider"
			valueLabelDisplay="auto"
			step={step}
			marks
			min={min}
			max={max}
			onChange={handleSliderChange}
		/>	  
    </div>
  );
}

export default CustomSlider; 