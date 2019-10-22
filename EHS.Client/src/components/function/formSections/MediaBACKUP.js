import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, LinearProgress as Progress } from '@material-ui/core'; 

const useStyles = makeStyles(theme => ({

}));

// Most of this code was pulled from here: https://github.com/krissnawat/simple-react-upload/blob/master/src/App.js
const Media = (props) => {
    const classes = useStyles();
    
    const {  } = props; 

    // const [selectedFile, setSelectedFile] = useState(null); 
    // const [loaded, setLoaded] = useState(0); 
    const [state, setState] = useState({
        selectedFile: null, 
        loaded: 0
    })

    const checkMimeType= (event) => {
        //getting file object
        let files = event.target.files 
        //define message container
        let err = []
        // list allow mime type
       const types = ['image/png', 'image/jpeg', 'image/gif']
        // loop access array
        for(var x = 0; x<files.length; x++) {
         // compare file type find doesn't matach
             if (types.every(type => files[x].type !== type)) {
             // create error message and assign to container   
             err[x] = files[x].type+' is not a supported format\n';
           }
         };
         for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
             // discard selected file
            // toast.error(err[z])
            //display error 
            event.target.value = null
        }
       return true;
    }

    
    const maxSelectFile = (event) => {
        let files = event.target.files
            if (files.length > 3) { 
            const msg = 'Only 3 images can be uploaded at a time'
            event.target.value = null
            // toast.warn(msg)
            // display warning
            return false;
        }
        return true;
    }

    const onChangeHandler = event => {
        var files = event.target.files
        if(maxSelectFile(event) && checkMimeType(event) &&    checkFileSize(event)){ 
            // if return true allow to setState
            setState({
                selectedFile: files,
                loaded:0
            })
        }
    }
    
    const onClickHandler = () => {
        const data = new FormData() 
        for(var x = 0; x < state.selectedFile.length; x++) {
            data.append('file', state.selectedFile[x])
        }

        // axios.post("http://localhost:8000/upload", data, {
        //     onUploadProgress: ProgressEvent => {
        //         setState({
        //             loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        //         })
        //     },
        // })
        // .then(res => { // then print response status
        //     // toast.success('upload success')
        // })
        // .catch(err => { // then print response status
        //     // toast.error('upload fail')
        // })
    }

    const checkFileSize = (event) => {
        let files = event.target.files
        let size = 2000000 
        let err = []; 
        for(var x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err[x] = files[x].type+'is too large, please pick a smaller file\n';
            }
        };
        for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            // toast.error(err[z])
            //display error 
            event.target.value = null
        }
        return true;
    }

    console.log(state); 
    return (
        <Fragment>  
            <Typography variant='h4' gutterBottom>
                Media
            </Typography>


            <div class="container">
                <div class="row">
                    <div class="offset-md-3 col-md-6">
                        <div class="form-group files">
                            <label>Upload Your File </label>
                            <input 
                                type="file" 
                                class="form-control" 
                                multiple onChange={onChangeHandler}
                            />
                        </div>  
                        <div class="form-group">
                        {/* <ToastContainer /> */}
                        <Progress max="100" variant="determinate" value={state.loaded} > 
                            { Math.round(state.loaded, 2) }%
                        </Progress>                    
                        </div> 
                        
                        <Button 
                            variant="primary" 
                            onClick={onClickHandler}
                            fullWidth 
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </div>

        </Fragment>
    );
}	

export default Media; 