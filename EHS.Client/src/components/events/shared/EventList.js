import React, { Component, Fragment, useRef } from 'react'; 
import Table from '../../shared/Table';
// import Moment from 'react-moment';
import moment from 'moment'; 
import { Typography, Button } from '@material-ui/core'; 
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components'
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print'

const Styles = styled.div`  
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

  .print {
      float: right;
      margin: 0; 
  }
`

// const EventListWithPrintOption = props => {
class EventListWithPrintOption extends Component {    
    constructor(props){
        super(props);
    }

    render() {
        const columns = [
            {
                Header: 'Event Information',
                columns: [        
                    {
                        Header: 'Event #', 
                        accessor: 'id', 
                    },
                    {
                        Header: 'Status', 
                        accessor: 'status',             
                    },
                    {
                        Header: 'Date',    
                        accessor: d => {
                        return moment(d.eventDate)
                            // .subtract(new Date(d.eventDate).getTimezoneOffset(), 'minutes')
                            .format('ll')
                        }
                    },
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

        const { safetyIncidents, employees } = this.props
        
        const siData = safetyIncidents.map(si => {
            return {
                id: si.eventId, 
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
                    <Table columns={columns} data={siData} route='/events/si/' {...this.props} />
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
}


const EventList = props => {
    const componentRef = useRef(); 
    return (
        <div>
            <ReactToPrint
                trigger={() => <Styles><Button className='print' variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button></Styles> }
                content={() => componentRef.current }
            />
            <EventListWithPrintOption ref={componentRef} {...props} />
        </div>
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