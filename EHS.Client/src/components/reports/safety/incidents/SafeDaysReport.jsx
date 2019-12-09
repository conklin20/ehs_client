import React, { Component, useEffect, useState, useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import moment, { now } from 'moment';
import { Grid, Typography, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { ATTR_CATS } from '../../../../helpers/attributeCategoryEnum';
import filterLookupDataByKey  from '../../../../helpers/filterLookupDataByKey';
import PrintIcon from '@material-ui/icons/Print'
import ReactToPrint from 'react-to-print';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    header: {
        marginBottom: theme.spacing(1), 
    },
    reportBody: {
        textAlign: 'left',
    },
    print: {
        float: 'right',
        margin: 0,
    },
    link: {
        textDecoration: 'none',
        color: 'black',
    },
}));

// To use the ReactToPrint lib these have to be class based components
// WPO = WithPrintOption
class SafeDaysReportWPO extends Component {    
    constructor(props){
        super(props);
    }

    render() {
        //data return initially is ALL Recordable events for the provided hierarchy. 
        const { data, lookupData, classes } = this.props;

        //get all hierarhcies, in case some dont have Recordables, we still want to include them in the report 
        const safeDaysByLogicalHierarchy = [];        
        lookupData.logicalHierarchies.map(h => {
            safeDaysByLogicalHierarchy.push({                
                name: h.hierarchyName,
            })
        });

        //sort data by most recent events 
        const sortedData = data.sort((a, z) => {return new Date(z.eventDate) - new Date(a.eventDate) })

        const listItemData = [];
        lookupData.logicalHierarchies.map(h => {
            return sortedData.find(e => e.department === h.hierarchyName)
                ? listItemData.push({
                    hierarchy: h, 
                    event: sortedData.find(e => e.department === h.hierarchyName),
                })
                : listItemData.push({
                    hierarchy: h, 
                    event: {
                        eventId: null, 
                        eventDate: '2000-01-01' //manually setting date so the sort works 
                    }
                })
        })
        // console.log(listItemData)
        
        const listItems = listItemData
            .sort((a, z) => { return new Date(z.event.eventDate) - new Date(a.event.eventDate) })
            .map(h => {
                return (
                    h.event.eventId
                    ?   <ListItem>
                            <Link to={`/events/si/${h.event.eventId}`} className={classes.link} >
                                <ListItemText
                                    primary={h.event.department} 
                                    secondary={`${moment(h.event.eventDate).fromNow()} 
                                        - ${h.event.eventId}`}
                                />
                            </Link>
                        </ListItem>
                    :   <ListItem>
                            <ListItemText
                                primary={h.hierarchy.hierarchyName}
                                secondary="0 Recordables Logged!"
                            />
                        </ListItem>
                )
            })

        // console.log(listItems)
            
        return (          
            <div className={classes.reportBody}>	
                <Typography variant='h5' gutterBottom>
                    Safe Days Report
                </Typography>
                <List className={classes.root} dense>
                    {listItems}
                </List>
            </div>  
        )
    }
}

const SafeDaysReport = props => {
    const classes = useStyles();
    const componentRef = useRef();
    const { data, lookupData } = props; 

    return (        
        <Fragment>
            <ReactToPrint
                trigger={() => <Button className={classes.print} variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button> }
                content={() => componentRef.current }
            />
            <SafeDaysReportWPO ref={componentRef} classes={classes} data={data} lookupData={lookupData} />
        </Fragment>
    )
}

export default SafeDaysReport;