import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Typography,
    Button,
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
    
    const handleChange = (files) => {
        setFiles(files);
    }

    const handleSubmitFiles = e => {
        e.preventDefault();
        // upload files to server 
        if(files.length){
            props.saveFiles(files, { eventId: event.eventId, userId: props.currentUser.user.userId} )
                .then(res => {
                    if(res === 200){
                        refreshEventFiles()
                        
                    } else {
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
        console.log(f)
        return (
            <ListItem key={f.eventFileId}>
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

    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Media
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7} >
                    <form  encType="multipart/form-data" onSubmit={handleSubmitFiles}>
                        <DropzoneArea 
                            dropzoneText='Drag and Drop files here, or click anywhere on in the dropzone to select a file. '
                            filesLimit={5}
                            onChange={handleChange}
                            acceptedFiles={['image/*', 'video/*', 'application/*']}
                            maxFileSize={10500000}  //bytes (~10 mb)
                            showPreviews={false}
                            showAlerts={false}
                            // getFileAddedMessage={() => `File(s) successfully queued for upload. ` }
                            // getFileRemovedMessage={() => `File successfuly removed from queue`}
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
                            Upload Files
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
