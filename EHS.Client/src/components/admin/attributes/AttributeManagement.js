import React, { Fragment, useEffect, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core'; 
import GlobalTree from './GlobalTree';
import LogicalTree from './LogicalTree';
import PhysicalTree from './PhysicalTree';
import { fetchHierarchyTreeWithDepth, fetchHierarchyLevels, } from '../../../store/actions/hierarchies';
import { 
    fetchAttributes
    , fetchGlobalHierarchyAttributes
    , fetchLogicalHierarchyAttributes
    , fetchPhysicalHierarchyAttributes
    , postNewHierarchyAttribute
    , updateHierarchyAttribute
    , deleteHierarchyAttribute
 } from '../../../store/actions/attributes';
import { addNotification } from '../../../store/actions/notifications'; 
import { HIERARCHY_ATTRIBUTE_ADD_SUCCESS
        , HIERARCHY_ATTRIBUTE_ADD_FAILED 
        , HIERARCHY_ATTRIBUTE_UPDATE_SUCCESS
        , HIERARCHY_ATTRIBUTE_UPDATE_FAILED
        , HIERARCHY_ATTRIBUTE_DELETE_SUCCESS
        , HIERARCHY_ATTRIBUTE_DELETE_FAILED
} from '../../../helpers/notificationMessages';
import { MIN_ADMIN_ROLE_LEVEL } from '../adminRoleLevel';

const useStyles = makeStyles(theme => ({
    header: {
        margin: theme.spacing(2), 
    },
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
        marginLeft: theme.spacing(5),
        marginTop: theme.spacing(5),
    },
    hierarchyContainer: {
        // width: '20vw',
        marginBottom: theme.spacing(3), 
    },
    attributeButtons: {
        margin: theme.spacing(3)
    },
    textField: {
        width: '40vw'
    }
}));


const AttributeManagement = props => {
    const classes = useStyles(); 

    const [attributes, setAttributes] = useState([]);
    const [selectedAttribute, setSelectedAttribute] = useState({})
    const [selectedHierarchy, setSelectedHierarchy] = useState(1000)
    const [logicalHierarchies, setLogicalHierarchies] = useState([]); 
    const [physicalHierarchies, setPhysicalHierarchies] = useState([]); 
    const [hierarchyLevels, setHierarchyLevels] = useState([]);
    const [globalHierarchyAttributes, setGlobalHierarchyAttributes] = useState([])
    const [logicalHierarchyAttributes, setLogicalHierarchyAttributes] = useState([])
    const [physicalHierarchyAttributes, setPhysicalHierarchyAttributes] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const [attributeToEdit, setAttributeToEdit] = useState({});
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)

    const { currentUser, match, dispatch, lookupData } = props;

    let newAttributeValue = '';
    
    const handleClose = () => {
        setOpenDialog(false);
    };

 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {

        fetchData();         

		return () => {
			// console.log('HierarchyManagement Component Unmounting')
		}

    }, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
   
    
	const fetchData =  () => {
        
        props.fetchAttributes()
            .then(res => {
                if(res.status === 200){
                    setAttributes(res.data.filter(a => a.enabled === true));
                    setSelectedAttribute(res.data.find(a => a.attributeName === 'Global'))
                } else {

                }
            })

         props.fetchHierarchyTreeWithDepth('logical', 2001)
            .then(res => {
                if(res.type === 'logical' && res.res.status === 200){
                    setLogicalHierarchies(res.res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Logical Hierarchies`, 'error')); 
                }
            });
         props.fetchHierarchyTreeWithDepth('physical', 2000)
            .then(res => {
                if(res.type === 'physical' && res.res.status === 200){
                    setPhysicalHierarchies(res.res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Logical Hierarchies`, 'error')); 
                }
            });
        props.fetchHierarchyLevels()
            .then(res => {
                if(res.status === 200){
                    // console.log(res.data)
                    setHierarchyLevels(res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Hierarchy Levels`, 'error')); 
                }
            })
        
		props.fetchGlobalHierarchyAttributes(selectedHierarchy, 'singlepath', '?attributetype=global&enabled=true')
            .then(res => {
                if(res.status === 200){
                    setGlobalHierarchyAttributes(res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Hierarchy Levels`, 'error')); 
                }
            })
		props.fetchLogicalHierarchyAttributes(selectedHierarchy, 'fulltree', '?attributetype=logical&enabled=true')
            .then(res => {
                if(res.status === 200){
                    setLogicalHierarchyAttributes(res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Hierarchy Levels`, 'error')); 
                }
            })
        props.fetchPhysicalHierarchyAttributes(selectedHierarchy, 'fulltree', '?attributetype=physical&enabled=true')
            .then(res => {
                if(res.status === 200){
                    setPhysicalHierarchyAttributes(res.data); 
                } else {
                    dispatch(addNotification(`Error retrieving Hierarchy Levels`, 'error')); 
                }
            })
      
    }

    const handleChange = e => {
        // console.log(e.target.value)
        newAttributeValue = e.target.value;
    }
    
    const handleClick = hierarchy => e => {
        console.log(hierarchy); 
        
    }

    const handleEdit = (attribute) => e => {
        // console.log(attribute)
        setAttributeToEdit(attribute);
        setOpenDialog(true)
    }

    const handleSave = () => {      
        console.log(attributeToEdit)
        props.updateHierarchyAttribute(attributeToEdit, currentUser.user.userId)
            .then(res => {
                if(res.status === 202){
                    switch(selectedAttribute.attributeName){
                        case 'Global':
                            setGlobalHierarchyAttributes( [...globalHierarchyAttributes.filter(ha => ha.hierarchyAttributeId !== attributeToEdit.hierarchyAttributeId), res.data] )
                        case 'Logical':
                            setLogicalHierarchyAttributes( [...logicalHierarchyAttributes.filter(ha => ha.hierarchyAttributeId !== attributeToEdit.hierarchyAttributeId), res.data] )
                        case 'Physical':
                            setPhysicalHierarchyAttributes( [...physicalHierarchyAttributes.filter(ha => ha.hierarchyAttributeId !== attributeToEdit.hierarchyAttributeId), res.data] )
                        default:
                            dispatch(addNotification(`Invalid Attribute: ${selectedAttribute.attributeName}`, 'success'));
                    }
                    dispatch(addNotification(HIERARCHY_ATTRIBUTE_UPDATE_SUCCESS.replace('{0}', attributeToEdit.value), 'success')); 
                    setAttributeToEdit({});
                } else {
                    console.log(res.data)
                    dispatch(addNotification(HIERARCHY_ATTRIBUTE_UPDATE_FAILED.replace('{0}', attributeToEdit.value), 'error')); 
                }
            })
            handleClose(); 
    }
    
    const handleConfirmDelete = () => {
        setOpenConfirmDeleteDialog(true); 
    }

    const handleDelete = () => {
        //Delete attribute (Mark as disabled, not actually deleting)
        props.deleteHierarchyAttribute(attributeToEdit.hierarchyAttributeId, currentUser.user.userId)
            .then(res => {
                if(res.status === 202){
                    switch(selectedAttribute.attributeName){
                        case 'Global':
                            setGlobalHierarchyAttributes( [...globalHierarchyAttributes.filter(ha => ha.hierarchyAttributeId !== attributeToEdit.hierarchyAttributeId)] )
                        case 'Logical':
                            setLogicalHierarchyAttributes( [...logicalHierarchyAttributes.filter(ha => ha.hierarchyAttributeId !== attributeToEdit.hierarchyAttributeId)] )
                        case 'Physical':
                            setPhysicalHierarchyAttributes( [...physicalHierarchyAttributes.filter(ha => ha.hierarchyAttributeId !== attributeToEdit.hierarchyAttributeId)] )
                        default:
                            dispatch(addNotification(`Invalid Attribute: ${selectedAttribute.attributeName}`, 'success'));
                    }
                    dispatch(addNotification(HIERARCHY_ATTRIBUTE_DELETE_SUCCESS.replace('{0}', attributeToEdit.value), 'success')); 
                    setAttributeToEdit({});
                } else {
                    dispatch(addNotification(HIERARCHY_ATTRIBUTE_DELETE_FAILED.replace('{0}', attributeToEdit.value), 'error')); 
                }
            })
        setOpenConfirmDeleteDialog(false); 
        setOpenDialog(false); 
    }
    
    const handleSubmit = (attributeCategory, hierarchy) => e => {         
        e.preventDefault(); 
        
        const newAttribute = {
            hierarchyId: hierarchy.hierarchyId,
            attributeId: selectedAttribute.attributeId,
            key: attributeCategory.key,
            value: newAttributeValue, 
            enabled: true, 

        }
        
        props.postNewHierarchyAttribute(newAttribute, currentUser.user.userId)
            .then(res => {
                // console.log(res); 
                if(res.status === 201){
                    switch(selectedAttribute.attributeName){
                        case 'Global':
                            setGlobalHierarchyAttributes( [...globalHierarchyAttributes, res.data] )
                        case 'Logical':
                            setLogicalHierarchyAttributes( [...logicalHierarchyAttributes, res.data] )
                        case 'Physical':
                            setPhysicalHierarchyAttributes( [...physicalHierarchyAttributes, res.data] )
                        default:
                            dispatch(addNotification(`Invalid Attribute: ${selectedAttribute.attributeName}`, 'success'));
                    }

                    dispatch(addNotification(HIERARCHY_ATTRIBUTE_ADD_SUCCESS.replace('{0}', newAttributeValue), 'success'));
                    newAttributeValue = '';
                    
                } else {
                    console.log(res.data)
                    dispatch(addNotification(HIERARCHY_ATTRIBUTE_ADD_FAILED.replace('{0}', newAttributeValue), 'error')); 
                }
            })
    }

    const attributeButtons = () => {
        return (
            <ButtonGroup fullWidth>
                { attributes.map(a => {
                    return (
                        <Button
                            key={a.attributeId}
                            onClick={() => setSelectedAttribute(a)}
                            >
                            {a.attributeName}
                        </Button>
                    )
                })}                    
            </ButtonGroup>
        )
    }

    const sectionToShow = () => {
        switch(selectedAttribute.attributeName){
            case 'Global':
                return (
                    <Fragment>                
                        {globalHierarchyAttributes.length && selectedAttribute.attributeName === 'Global' ?
                            <div className={classes.treeContainer}>
                                <Typography variant='h6'>
                                    Global Hierarchy Attributes
                                </Typography>
                                <GlobalTree
                                    globalHierarchyAttributes={globalHierarchyAttributes}
                                    handleChange={handleChange}
                                    handleClick={handleClick}
                                    handleEdit={handleEdit}
                                    handleSubmit={handleSubmit}
                                    currentUser={currentUser}
                                />
                            </div>
                            : 
                            <Typography className={classes.loading} variant='h6'>
                                {`Loading Data... `}
                            </Typography>
                        }
                    </Fragment>
                )
                
            case 'Logical':
                return (
                    <Fragment>                     
                        {logicalHierarchyAttributes.length && logicalHierarchies.length && hierarchyLevels.length && selectedAttribute.attributeName === 'Logical' ?
                            <div className={classes.treeContainer}>
                                <Typography variant='h6'>
                                    Logical Hierarchy Attributes
                                </Typography>
                                <LogicalTree
                                    logicalHierarchyAttributes={logicalHierarchyAttributes}
                                    logicalHierarchies={logicalHierarchies}
                                    hierarchyLevels={hierarchyLevels}
                                    handleChange={handleChange}
                                    handleClick={handleClick}
                                    handleEdit={handleEdit}
                                    handleSubmit={handleSubmit}
                                    currentUser={currentUser}
                                />
                            </div>
                            : 
                            <Typography className={classes.loading} variant='h6'>
                                {`Loading Data... `}
                            </Typography>
                        }
                    </Fragment>
                )
            case 'Physical':
                return (
                    <Fragment>
                        {physicalHierarchyAttributes.length && physicalHierarchies.length && hierarchyLevels.length && selectedAttribute.attributeName === 'Physical' ?
                            <div className={classes.treeContainer}>
                                <Typography variant='h6'>
                                    Physical Hierarchy Attributes
                                </Typography>
                                <PhysicalTree
                                    physicalHierarchyAttributes={physicalHierarchyAttributes}
                                    physicalHierarchies={physicalHierarchies}
                                    hierarchyLevels={hierarchyLevels}
                                    handleChange={handleChange}
                                    handleClick={handleClick}
                                    handleEdit={handleEdit}
                                    handleSubmit={handleSubmit}
                                    currentUser={currentUser}
                                />
                            </div>
                            : 
                            <Typography className={classes.loading} variant='h6'>
                                {`Loading Data... `}
                            </Typography>
                        }
                    </Fragment>
                )
            default: {
                // dispatch(addNotification(`Invalid attribute selected `, 'error')); <-- BREAKS EVERYTHING
                return (
                    <div>Invalid Section</div>
                )
            }
        }
    }

    return (
        <Paper className={classes.paper} square={true} >
            <Typography variant='h4'  className={classes.header}>
                Manage Attributes
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
                        <DialogTitle id="form-dialog-title">Edit Hierarchy Attribute</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Update Attribute Value
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id='hierarchy-attribute'
                                label='Attribute Value'
                                value={attributeToEdit.value}
                                onChange={(e) => {
                                    // console.log(hierarchy)
                                    setAttributeToEdit({
                                        ...attributeToEdit,
                                        value: e.target.value
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
                        <DialogTitle id="confirm-delete-dialog">Delete Attribute</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this Attribute? This option will no longer be available in the dropdown lists.
                            </DialogContentText>
                            <Typography variant="h5" gutterBottom>
                                {`Attribute: ${attributeToEdit.value}`}
                            </Typography>
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

                    <Typography variant='body2' >
                        {`Attributes make up most of the options available to users in dropdown lists, among other things. Attributes can be applied to any hierarchy, which 
                        gives you unlimited flexibility in how you want things configured for your sites. `}
                    </Typography>

                    <div className={classes.attributeButtons}>
                        {attributeButtons()}
                    </div>

                    <div>
                        {sectionToShow()}
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
        fetchAttributes,
        fetchHierarchyTreeWithDepth,
        fetchHierarchyLevels,
        fetchGlobalHierarchyAttributes,
        fetchLogicalHierarchyAttributes, 
        fetchPhysicalHierarchyAttributes,
        postNewHierarchyAttribute,
        updateHierarchyAttribute,
        deleteHierarchyAttribute,
        dispatch, 
    }
}

//wrapping withRouter HOC so we can access the history object 
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AttributeManagement)); 