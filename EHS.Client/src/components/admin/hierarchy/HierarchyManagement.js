import React, { Fragment, useEffect, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@material-ui/core'; 
import LogicalTree from './LogicalTree';
import { fetchHierarchyTreeWithDepth, fetchHierarchyLevels, postNewHierarchy, updateHierarchy, deleteHierarchy } from '../../../store/actions/hierarchies';
import PhysicalTree from './PhysicalTree';
import { addNotification } from '../../../store/actions/notifications'; 
import { MIN_ADMIN_ROLE_LEVEL } from '../adminRoleLevel';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
        minHeight: '94vh',		
    },
	icon: {
		margin: theme.spacing(0),
		fontSize: 20,
	},
	loading: {
        marginTop: theme.spacing(5), 
    },
    noAccessImg: {
        height: '50vh',
        width: '50vw',
        marginTop: theme.spacing(5),
        backgroundSize: 'cover',
        borderRadius: '2%',
        overflow: 'hidden',
    },
    treeContainer: {
        width: '100%',
        // overflowY: 'scroll',
        minHeight: '94vh',		
    },
    hierarchyContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(3), 
    }
  }));

const HierarchyManagement = props => {
    const classes = useStyles(); 

    const [logicalHierarchies, setLogicalHierarchies] = useState([]); 
    const [physicalHierarchies, setPhysicalHierarchies] = useState([]); 
    const [hierarchyLevels, setHierarchyLevels] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
    const [hierarchy, setHierarchy] = useState({})
    const [confirmDeleteHierarchy, setConfirmDeleteHierarchy] = useState('');    
    //For whatever reason, the useState hook is not working with newHierarchy. But just using a local variable is. cannot for the life of me figure out why 
    // const [newHierarchy, setNewHierarchy] = useState({
    //     newLevel2: '',
    //     newLevel3: '',
    //     newLevel4: '',
    //     newLevel5: '', 
    // })
    let newHierarchyName = '';

    const handleClose = () => {
        setOpenDialog(false);
        setOpenConfirmDeleteDialog(false);
    };


    const { currentUser, match, dispatch } = props;
    
 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        fetchData();         

		return () => {
			console.log('HierarchyManagement Component Unmounting')
		}

    }, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
    
	const fetchData =  () => {
        // console.log(props.fetchHierarchyTreeWithDepth)
         props.fetchHierarchyTreeWithDepth('logical', 2001)
            .then(res => {
                if(res.type === 'logical' && res.res.status === 200){
                    // console.log(res.res.data)
                    setLogicalHierarchies(res.res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Logical Hierarchies`, 'error')); 
                }
            });
         props.fetchHierarchyTreeWithDepth('physical', 2000)
            .then(res => {
                if(res.type === 'physical' && res.res.status === 200){
                    // console.log(res.res.data)
                    setPhysicalHierarchies(res.res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Logical Hierarchies`, 'error')); 
                }
            });
        props.fetchHierarchyLevels()
            .then(res => {
                if(res.status === 200){
                    setHierarchyLevels(res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Hierarchy Levels`, 'error')); 
                }
            })
        
		// if(!lookupData.logicalHierarchyAttributes) await props.fetchLogicalHierarchyAttributes(1000, 'fulltree', ''); //'?enabled=true');
		// if(!lookupData.physicalHierarchyAttributes) await  props.fetchPhysicalHierarchyAttributes(1000, 'fulltree', ''); // '?enabled=true&excludeglobal=true');
    }

    const handleSubmit = (leftHierarchy, firstChild, hierarchyLevelId) => e => {         
        e.preventDefault(); 
        const newHierarchy = {
            hierarchyName: newHierarchyName, 
            lft: -1, 
            rgt: -1, 
            hierarchyLevelId: hierarchyLevelId
        }
        // console.log(newHierarchy)
        const hierarchies = [newHierarchy, leftHierarchy]
        props.postNewHierarchy(hierarchies, firstChild,currentUser.user.userId)
            .then(res => {
                // console.log(res); 
                if(res.status === 201){
                    setLogicalHierarchies([...logicalHierarchies, res.data])
                    dispatch(addNotification(`Successfully created hierarchy: ${newHierarchyName}`, 'success')); 
                    newHierarchyName = '';
                    setHierarchy({});
                    fetchData(); 
                } else {
                    console.log(res.data)
                    dispatch(addNotification(`Error creating hierarchy: ${newHierarchyName}`, 'error')); 
                }
            })
    }

    // const handleChange = (input) => e => {
    const handleChange = e => {
        newHierarchyName = e.target.value
    }

    const handleEdit = (hierarchy, leftHierarchy) => e => {
        setHierarchy(hierarchy );
        setOpenDialog(true); 
    }

    const handleSave = () => {      
        // console.log(hierarchy)
        props.updateHierarchy(hierarchy, currentUser.user.userId)
            .then(res => {
                if(res.status === 202){
                    dispatch(addNotification(`Successfully updated hierarchy name: ${hierarchy.hierarchyName}`, 'success')); 
                    setHierarchy({});
                } else {
                    console.log(res.data)
                    dispatch(addNotification(`Error updating hierarchy name: ${hierarchy.hierarchyName}`, 'error')); 
                }
            })
            handleClose(); 
    }

    const handleConfirmDelete = () => {
        setOpenConfirmDeleteDialog(true); 
    }

    const handleDelete = () => {
        if(confirmDeleteHierarchy === hierarchy.hierarchyName){
            //delete hierarchy 
            props.deleteHierarchy(hierarchy.hierarchyId, currentUser.user.userId)
                .then(res => {
                    if(res.status === 202){
                        dispatch(addNotification(`Successfully deleted hierarchy: ${confirmDeleteHierarchy}`, 'success')); 
                    } else {
                        dispatch(addNotification(`Error deleting hierarchy: ${confirmDeleteHierarchy}`, 'error')); 
                    }
                })
        } else {
            console.log(`Hierarchy was NOT Deleteted. Names did not match. ${confirmDeleteHierarchy} != ${hierarchy.hierarchyName   }`)
            dispatch(addNotification(`Hierarchy wasn't deleted. Name mismatch: ${confirmDeleteHierarchy} != ${hierarchy.hierarchyName}`, 'warning')); 
        }
        setConfirmDeleteHierarchy('');
        setOpenConfirmDeleteDialog(false); 
        setOpenDialog(false); 
    }

    // console.log(`Re-rendering! Logical: ${logicalHierarchies.length}. Physical: ${physicalHierarchies.length}. Levels: ${hierarchyLevels.length}.`)
    return (
        <Paper className={classes.paper} square={true} >
            <Typography variant='h4' >
                Manage Hierarchies
            </Typography>
            { currentUser.user.roleLevel >= MIN_ADMIN_ROLE_LEVEL
                ?      
                <Fragment>      
                    <Dialog 
                        open={openDialog} 
                        onClose={handleClose} 
                        maxWidth='sm'
                        fullWidth
                    >
                        <DialogTitle id="form-dialog-title">Edit Hierarchy</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Update Hierarchy Name
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id='hierarchy-name'
                                label='Hierarchy Name'
                                value={hierarchy.hierarchyName}
                                onChange={(e) => {
                                    // console.log(hierarchy)
                                    setHierarchy({
                                        ...hierarchy,
                                        hierarchyName : e.target.value
                                    })
                                }}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} color="primary">
                                Delete
                            </Button>
                            <Button onClick={handleSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog 
                        open={openConfirmDeleteDialog} 
                        onClose={handleClose} 
                        maxWidth='sm'
                    >
                        <DialogTitle id="confirm-delete-dialog">Delete Hierarchy</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete ths hierarchy? All Hierarchies within this hierarchy will also be deleted.
                                This action will not be undoable. If you want to proceed, re-type the name of the hierarchy you want to delete. 
                            </DialogContentText>
                            <TextField
                                autoFocus
                                autoComplete={false}
                                margin="dense"
                                id='hierarchy-name'
                                label='Hierarchy Name'
                                value={confirmDeleteHierarchy}
                                onChange={(e) => setConfirmDeleteHierarchy(e.target.value)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} color="primary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Typography variant='body2'>
                        {`Hierarchies drive nearly all system functionality in terms of what users will see, and how the application will react when certain selections are made.
                        You have the flexibility to manage these hierarchies, but it is important that you ensure you know exactly what you're going to change, and what impacts
                        the changes may have on the system. `}
                    </Typography>
                    <div className={classes.hierarchyContainer}>   
                        {logicalHierarchies.length && hierarchyLevels.length ?
                            <div className={classes.treeContainer}>
                                <Typography variant='h6'>
                                    Logical Hierarchy
                                </Typography>
                                <LogicalTree
                                    id='logical-tree'
                                    logicalHierarchies={logicalHierarchies}
                                    hierarchyLevels={hierarchyLevels}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    handleEdit={handleEdit}
                                />
                            </div>
                            : 
                            <Typography className={classes.loading} variant='h6'>
                                {`Loading Data... `}
                            </Typography>
                        }
                        
                        {physicalHierarchies.length && hierarchyLevels.length ?
                            <div className={classes.treeContainer}>
                                <Typography variant='h6'>
                                    Physical Hierarchy
                                </Typography>
                                <PhysicalTree
                                    id='physical-tree'
                                    physicalHierarchies={physicalHierarchies}
                                    hierarchyLevels={hierarchyLevels}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    handleEdit={handleEdit}
                                />
                            </div>
                            : 
                            <Typography className={classes.loading} variant='h6'>
                                {`Loading Data... `}
                            </Typography>
                        }
                    </div>
                </Fragment>    
                :
                <Fragment>
                    <Typography variant='h4' gutterBottom>
                        Your role does not permit you to manage system data 
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        If you think you're not assigned to the correct role, please contact your System Admin or your Environmental, Health and Safety Department 
                    </Typography>
                    <img className={classes.noAccessImg} src={`https://images.unsplash.com/photo-1543933441-40fbd6b34481?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1537&q=80`}
                    />
                </Fragment>
            }
        </Paper>
    )
}

function mapStateToProps(state) {
	// console.log(state)
	return {
        currentUser: state.currentUser,
        lookupData: state.lookupData, 
	};
}

function mapDispatchToProps(dispatch, ownProps) {
    // console.log(ownProps)
    return {
        fetchHierarchyTreeWithDepth,
        fetchHierarchyLevels,
        postNewHierarchy, 
        updateHierarchy,
        deleteHierarchy,
        dispatch, 
    }
}

//wrapping withRouter HOC so we can access the history object 
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HierarchyManagement)); 