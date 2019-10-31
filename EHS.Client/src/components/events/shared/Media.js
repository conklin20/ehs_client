import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Typography,
    Button,
    // LinearProgress as Progress, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Grid, 
    List, 
    ListItem, 
    Avatar, 
    ListItemText, 
    IconButton,
    ListItemAvatar, 
    ListItemSecondaryAction,
    // Paper
} from '@material-ui/core'; 
import { DropzoneArea } from 'material-ui-dropzone'
import { saveFiles, removeFile } from '../../../store/actions/media';
import { connect } from "react-redux";
import AttachmentIcon from '@material-ui/icons/Attachment';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
    saveFilesBtn: {
        marginTop: theme.spacing(3),
    }, 
}));

const Media = (props) => {
    const classes = useStyles();
    
    const { event, refreshEventFiles } = props; 

    const [files, setFiles] = useState([])
    const [openDialog, setOpenDialog] = useState(false); 
    
    const handleClickOpen = () => {
        setOpenDialog(true); 
    }; 

    const handleClose = (e) => {
        setOpenDialog(false);
    }

    const handleChange = (files) => {
        setFiles(files);
    }

    const handleSubmit = e => {
        // console.log(files); 
        // upload files to server 
        if(files.length){
            props.saveFiles(files, { eventId: event.eventId, userId: props.currentUser.user.userId} )
                .then(res => {
                    console.log(res);
                    if(res === 200){
                        // console.log('File uploaded successfully')
                        refreshEventFiles()
                        handleClickOpen()
                        setFiles([])
                    }
                })
                .catch(err => {
                    console.log(err); 
                })
        }
    }

    const handleDelete = (eventFileId) => e => {
        //Only deleting the record from the EventFiles table. Not actually deleting the file from the server directory 
        props.removeFile(eventFileId, props.currentUser.user.userId)
            .then(res => {
                refreshEventFiles()
            })
            .catch(err => {
                console.log(err); 
            })
    }

    const savedFiles = event.files.map(f => {
        return (
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <AttachmentIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={f.userFileName}
                />
                <ListItemSecondaryAction>
                    <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={handleDelete(f.eventFileId)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    })

    console.log(event)
    return (
        <Fragment>  
            <Dialog 
                open={openDialog}
                onClose={handleClose}
                aria-labelledby='confirm-dialog-title'
                aria-describedby='confirm-dialog-description'
            >
                <DialogTitle id='confirm-dialog-title'>{"Saved Successfully!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='confirm-dialog-description'>
                        {`Files have been successfully saved to the file server and database. `}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id='success' onClick={handleClose} color='primary' autofocus>OK</Button>
                </DialogActions>
            </Dialog>
            <Typography variant='h4' gutterBottom>
                Media
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7} >
                    <form  enctype="multipart/form-data" onSubmit={handleSubmit}>

                        <DropzoneArea 
                            dropzoneText='Drag and Drop files here, or click anywhere on in the dropzone to select a file. '
                            filesLimit={5}
                            onChange={handleChange}
                            acceptedFiles={['image/*', 'video/*', 'application/*']}
                            maxFileSize={10500000}  //bytes (~10 mb)
                            showPreviews={false}
                            showPreviewsInDropzone={true}
                            showFileNamesInPreview={true}
                        />

                        <Button 
                            className={classes.saveFilesBtn}
                            type='submit'
                            variant='contained'
                            color='primary'
                            fullWidth
                            >
                            Save Files
                        </Button>
                    </form>
                </Grid>
            {/* <Divider /> */}
                <Grid item xs={12} md={4} >
                {
                    event.files.length ?         
                    // <Paper >                                
                        <Grid item xs={12} >
                            <Typography variant='h6' gutterBottom>
                                Files Currently Saved 
                            </Typography>
                            <List >
                                {savedFiles}
                            </List>
                        </Grid>
                    // </Paper>   
                    : null
                }
                </Grid>
            </Grid>
        </Fragment>
    );
}	

function mapStateToProps(state) {
	return {
			currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
    saveFiles, 
    removeFile
})(Media); 
