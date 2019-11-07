import React, {  Fragment } from 'react'; 
import { connect } from "react-redux";
import { Typography, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    done: {
        textDecoration: 'line-through'
    }
  }));

const ReportAside = props => {
    const classes = useStyles(); 	
    
    return (     
        <Fragment >
            <Typography variant="h4" gutterBottom>Report Aside</Typography>
            <Typography>
                <List>
                    To Do List:
                    <ListItem>
                        Change this Aside to Hidden lgDown
                    </ListItem>
                    <ListItem className={classes.done}>
                        Filter User Aside Approvals to current users approval level and Site/Area/Dept
                    </ListItem>
                    <ListItem>
                        Replace AddError code with AddNotification
                    </ListItem>
                    <ListItem>
                        Filter lists based on user role 
                    </ListItem>
                    <ListItem>
                        Finish User Settings page 
                    </ListItem>
                    <ListItem>
                        Email functionality (need to be deployed to vsto servers)
                    </ListItem>
                    <ListItem className={classes.done}>
                       Only allow Safety roles to change incient result (ex TRR)
                    </ListItem>
                    <ListItem>
                        Finish Filter/Search page (low P, dynamic search works well)
                    </ListItem>
                    <ListItem>
                        Helper text on critical fields 
                    </ListItem>
                    <ListItem>
                        Build Reports
                    </ListItem>
                    <ListItem>
                        Build Report Aside Reports
                    </ListItem>
                </List>
                
                <List>
                    Bugs:
                    <ListItem>
                        Review page doesnt show all data when submitted a draft
                    </ListItem>
                </List>
            </Typography>
        </Fragment>
    )
    
}

function mapStateToProps(state) {
    // console.log(state)
    return {
    };
}

export default connect(mapStateToProps, null)(ReportAside); 
