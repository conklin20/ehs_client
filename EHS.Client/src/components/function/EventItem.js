import React from 'react'; 
import Moment from 'react-moment'; 
import { Link } from 'react-router-dom'; 



const EventItem = props => {    
    
	return (
		<TableRow
			hover
			onClick={event => handleClick(event, row.name)}
			role="checkbox"
			aria-checked={isItemSelected}
			tabIndex={-1}
			key={row.name}
			selected={isItemSelected}
		>
			<TableCell padding="checkbox">
				<Checkbox
					checked={isItemSelected}
					inputProps={{ 'aria-labelledby': labelId }}
				/>
			</TableCell>
			<TableCell component="th" id={labelId} scope="row" padding="none">
				{row.name}
			</TableCell>
			<TableCell align="right">{row.calories}</TableCell>
			<TableCell align="right">{row.fat}</TableCell>
			<TableCell align="right">{row.carbs}</TableCell>
			<TableCell align="right">{row.protein}</TableCell>
		</TableRow>
	)
};

export default EventItem; 