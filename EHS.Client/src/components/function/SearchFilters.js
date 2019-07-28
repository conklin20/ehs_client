import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const SearchFilters = props => {
	// console.log(props.showSearchFilters)
	return (
		<div>
			<Dialog open={props.showSearchFilters} onClose={props.onShowSearchFilters} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Search For Events</DialogTitle>
				<DialogContent>
					{/* <DialogContentText>
						To subscribe to this website, please enter your email address here. We will send updates
						occasionally.
					</DialogContentText> */}
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Email Address"
						type="email"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={props.onSearch} color="primary">
						Search!
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default SearchFilters; 