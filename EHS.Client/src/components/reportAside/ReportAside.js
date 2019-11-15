import React, {  Fragment } from 'react'; 
import { connect } from "react-redux";
import { Typography, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    body: {
        overflowY: 'scroll',
        height: '90vh'
    },
    header: {
        textDecoration: 'underline', 
        fontWeight: 'bold'
    },
    done: {
        textDecoration: 'line-through'
    }
  }));

const ReportAside = props => {
    const classes = useStyles(); 	
    
    return (     
        <div className={classes.body}>
            <Typography variant="h4" gutterBottom>Report Aside</Typography>
            <Typography variant="body2">
                <List>
                    <span className={classes.header}>Bugs:</span>
                    <ListItem>
                        /events/si/new: Review page doesnt show all data from the event 
                    </ListItem>
                    <ListItem>
                        /events/si/new: after saving 'People Involved' it switched the event to 'Open', even though its still in 'Draft' status
                    </ListItem>
                    <ListItem>
                        /dashboard: Can't search on employees Name, only on employeeId
                    </ListItem>
                    <ListItem>
                        /logout: Sometimes it doesnt gracefully log you out.. you have to refresh a couple of times
                    </ListItem>
                    <ListItem>
                        /manage/hierarchies: Cant type into the text fields, but you're able to copy/paste into them
                    </ListItem>
                </List>                
                <List>
                    <span className={classes.header}>Recently Fixed Bugs: </span>
                    <ListItem>
                        
                    </ListItem>
                </List>
                <List>
                    <span className={classes.header}>Functionality Still Being Developed:</span>
                    <ListItem>
                        Email functionality
                    </ListItem>
                    <ListItem>
                        Hierarchy Attribute Management page. You can currently manage hierarchies themselves, but not the lookup data that can be associated with a hierarchy (pretty much
                        all attributes like shifts, jobs, injury types, first aid types, enviornments, materials etc.)
                    </ListItem>
                    <ListItem>
                        Finish Filter/Search page (low priority, dynamic search works well)
                    </ListItem>
                    <ListItem>
                        Finish User Settings page 
                    </ListItem>
                    <ListItem>
                        Reports Page
                    </ListItem>
                    <ListItem>
                        Build Report Aside Reports
                    </ListItem>
                </List>
                <List>
                    <span className={classes.header}>Open Questions:</span>
                    <ListItem>
                        Closing an Event. Which option would you prefer?<br />
                        1) Automated - built into the workflow. Once the final approval has been received for the final unapproved action, the event will auto-close. <br />
                        2) Manual - Once the final approval has been received for the final unapproved action, Safety will have to manually close the event. 
                    </ListItem>
                </List>
                
            </Typography>
        </div>
    )
    
}

function mapStateToProps(state) {
    // console.log(state)
    return {
    };
}

export default connect(mapStateToProps, null)(ReportAside); 
