import React, {  useEffect } from 'react'; 
import { connect } from "react-redux";
import { Typography, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchSafetyIncidents } from '../../store/actions/reports';
import SafeDays from './SafeDays';
import OpenEvents from './OpenEvents';

const useStyles = makeStyles(theme => ({
    body: {
        height: '94vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingLeft: theme.spacing(2),
        fontSize: '.8em',
    },
}));

const ReportAside = props => {
    const classes = useStyles(); 	

    const { lookupData, reportData } = props; 

    useEffect(() => {
        
        props.fetchSafetyIncidents('safedaysAside', `?resultingCategory=Recordable`)
            .then(res => {
                
            });

        props.fetchSafetyIncidents('openbyhierarchyAside', `?EventStatuses=Open`)
            .then(res => {
                
            });
    

        return () => {

        }
    },[]);
    
    // console.log(reportData)
    return (     
        <div className={classes.body}>            
            {
                Object.keys(reportData).includes('safedaysAside') && reportData.safedaysAside.length 
                ? <SafeDays 
                    lookupData={lookupData} 
                    reportData={reportData.safedaysAside}
                 />
                : null
            }
            
            {
                Object.keys(reportData).includes('openbyhierarchyAside')  && reportData.openbyhierarchyAside.length 
                ? <OpenEvents 
                    lookupData={lookupData} 
                    reportData={reportData.openbyhierarchyAside} 
                  />
                : null
            }
        </div>
    )
}

function mapStateToProps(state) {
    // console.log(state)
    return {
        lookupData: state.lookupData,
        reportData: state.reportData,
    };
}

export default connect(mapStateToProps, {
    fetchSafetyIncidents, 
})(ReportAside); 
