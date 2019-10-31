import React, {  } from 'react';
import SearchBar from './SearchBar';

const EventSearch = props => {
	return (
		<div>
			<SearchBar 
				{...props}
			/>
		</div>
	)
}

export default EventSearch; 