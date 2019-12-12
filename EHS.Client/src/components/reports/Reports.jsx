import React, { useEffect, Fragment } from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, ButtonGroup, Button } from '@material-ui/core';
import { 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	fetchGlobalHierarchyAttributes, 
	fetchLogicalHierarchyAttributes, 
	fetchPhysicalHierarchyAttributes, 
	fetchEmployees } from '../../store/actions/lookupData'; 
import SIReports from './safety/incidents/SIReports';
import { REPORT_CATS } from './reportConfig';

const useStyles = makeStyles(theme => ({
    header: {
        margin: theme.spacing(1), 
    },
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
        minHeight: '94vh',	
	},
    button: {
        margin: theme.spacing(5), 
        height: '8em',
        width: '12em',
    }, 
    link: {
        textDecoration: 'none',
        color: 'black',

    },
    back: {
        // float: 'left',
        paddingLeft: theme.spacing(2),
    },
}));

const Reports = props => {
    const classes = useStyles();

    const { match, history, lookupData, currentUser } = props; 
    
    useEffect(() => {        
        fetchData(); 
        
		return () => {
            //unmount
		}

	}, []);

    const fetchData = async () => {        
		if(!lookupData.employees) await props.fetchEmployees();
		if(!lookupData.logicalHierarchies ) await props.fetchLogicalHierarchyTree(currentUser.user.logicalHierarchyPath.split('|')[currentUser.user.logicalHierarchyPath.split('|').length-1]);
		if(!lookupData.physicalHierarchies) await props.fetchPhysicalHierarchyTree(currentUser.user.physicalHierarchyPath.split('|')[currentUser.user.physicalHierarchyPath.split('|').length-1]);
		if(!lookupData.globalHierarchyAttributes) await props.fetchGlobalHierarchyAttributes(1000, 'fulltree', '?attributetype=global&enabled=true'); //will be the root hierarchy 
		if(!lookupData.logicalHierarchyAttributes) await props.fetchLogicalHierarchyAttributes(1000, 'fulltree', '?attributetype=logical&enabled=true'); 
		if(!lookupData.physicalHierarchyAttributes) await  props.fetchPhysicalHierarchyAttributes(1000, 'fulltree', '?attributetype=physical&enabled=true'); 
		
    }

    const reportCategories = Object.keys(REPORT_CATS)
                                .filter(cat => REPORT_CATS[cat].enabled === true)
                                .map(cat => {
                                    return REPORT_CATS[cat]
                                });
                                
    const reportBaseComponents = () => {
        if(Object.keys(match.params).length){
            switch(match.params.type){
                case 'user':
                    return (
                        <Fragment />
                    )
                case 'hierarchies':
                    return (
                        <Fragment />
                    )
                case 'hierarchyattributes':
                    return (
                        <Fragment />
                    )
                case 'si':
                    return (
                        <SIReports { ...props } />
                    )
                default: 
                    return null 
            }
        }
    }
    // console.log(history)
    return (
        <Paper className={classes.paper}>
            { 
                !Object.keys(match.params).length
                    ?
                    <Fragment>
                        <Typography className={classes.header} variant="h4" >
                            Reports
                        </Typography>
                        {reportCategories.map(cat => {
                            return (
                                <Link key={cat.url} to={cat.url} className={classes.link}>
                                    <Button className={classes.button} variant="contained" color="primary" >
                                        {cat.name}
                                    </Button>
                                </Link>
                            )
                        })}
                    </Fragment>
                    :
                    reportBaseComponents()
                
            }
        </Paper>
    )
}

function mapStateToProps(state) {
	return {
		lookupData: state.lookupData,
		currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, {
        fetchEmployees,
        fetchGlobalHierarchyAttributes, 
        fetchLogicalHierarchyAttributes, 
        fetchPhysicalHierarchyAttributes, 
        fetchLogicalHierarchyTree, 
        fetchPhysicalHierarchyTree, 
})(Reports);