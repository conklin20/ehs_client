import React, { Fragment, Component } from 'react'; 
import Table from '../function/Table'
import Moment from 'react-moment';
import moment from 'moment'; 
import { Typography } from '@material-ui/core'; 
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid grey;

    tr {
        :last-child {
            td {
            border-bottom: 0;
            }
        }
    }

    th,
    td {
        cursor: pointer;
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid grey;
        border-right: 1px solid grey;

        :last-child {
            border-right: 0;
        }
    }
  }

  .pagination {
    display: flex; 
    justify-content: center;
    padding: 0.5rem;
    height: 30px;
  }
`

const EventList = props => {

    const columns = [
        {
            Header: 'Event Information',
            columns: [        
                {
                    Header: 'Event #', 
                    accessor: 'eventId', 
                },
                {
                    Header: 'Status', 
                    accessor: 'status',             
                },
                {
                    Header: 'Date', 
                    // accessor: 'eventDate',    
                    accessor: d => {
                      return moment(d.eventDate)
                        .add(props.currentUser.user.timeZone, 'hours')
                        .format('YYYY-MM-DD hh:mm a')
                        // return <Moment 
                        //             // format={props.currentUser.user.dateFormat || 'YYYY/MM/DD'} 
                        //             // add={{ hours: props.currentUser.user.timeZone}}
                        //         >
                        //             {d.eventDate}
                        //         </Moment>	
                                                    
                    }
                },
                // {
                //     Header: 'Time', 
                //     accessor: 'timeOccurred',             
                // },
                {
                    Header: 'Category', 
                    accessor: 'category',             
                },
            ]
        },
        {
            Header: 'Employee Information',
            columns: [  
                {
                    Header: 'Employee', 
                    accessor: 'employee',             
                },
                {
                    Header: 'Job', 
                    accessor: 'job',             
                }
            ]
        },
        {
            Header: 'Location Information',
            columns: [
                {
                    Header: 'Area', 
                    accessor: 'area',             
                },
                {
                    Header: 'Dept.', 
                    accessor: 'department',             
                },
            ]
        },
        {
            Header: '**Actions',
            columns: [
                {
                    Header: 'O', 
                    accessor: 'openActions',          
                },
                {
                    Header: 'PA', 
                    accessor: 'pendingApprovals',             
                },
            ]
        }
    ]

    const { safetyIncidents, employees } = props
    
    const siData = safetyIncidents.map(si => {
        return {
            eventId: si.eventId, 
            status: si.eventStatus, 
            eventDate: si.eventDate, 
            category: si.resultingCategory ? si.resultingCategory : si.initialCategory, 
            employee: employees.some(e => e.employeeId === si.employeeId) 
                ? employees.find(e => e.employeeId === si.employeeId).fullName 
                : `${si.employeeId} - Employee Not Found`,
            job: si.jobTitle, 
            area: si.area, 
            department: si.department, 
            openActions: si.actions.filter(a => !a.completionDate).length,
            pendingApprovals: si.actions.filter(a => a.completionDate && !a.approvalDate).length
        }
    }); 

    // console.log(safetyIncidents); 
    return (
        <Fragment>
            <Styles>            
                <Table columns={columns} data={siData} {...props} />
            </Styles>
            <Typography variant="caption" display="block" gutterBottom>
                *Hint - Click anywhere on the row of an event to navigate to the details of the event
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                **O = Open (Incomplete) Actions. PA = Actions Pending Approval
            </Typography>
        </Fragment>
    )
}
 
function mapStateToProps(state){
    return {
    }
}

//wrapping withRouter HOC so we can access the history object in the table (for row clicks)
export default withRouter(
    connect(mapStateToProps, 
        { 
        })(EventList)
); 