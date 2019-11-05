import React, { Fragment } from 'react'; 
import Table from '../../shared/Table';
// import moment from 'moment'; 
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

const UserList = props => {
    
    const { users, lookupData } = props

    // console.log(props)

    const columns = [
        {
            Header: 'UserId', 
            accessor: 'id'
        }, 
        {
            Header: 'First', 
            accessor: 'firstName'
        }, 
        {
            Header: 'Last', 
            accessor: 'lastName'
        }, 
        {
            Header: 'Email', 
            accessor: 'email'
        }, 
        {
            Header: 'Phone', 
            accessor: 'phone'
        }, 
        {
            Header: 'Logical Hierarchy', 
            accessor: h => {
              return lookupData.logicalHierarchies.find(l => l.hierarchyId === h.logicalHierarchyId).hierarchyName
            }
        }, 
        {
            Header: 'Physical Hierarchy', 
            accessor: h => {
              return lookupData.physicalHierarchies.find(l => l.hierarchyId === h.physicalHierarchyId).hierarchyName
            }
        }, 
        {
            Header: 'Role', 
            accessor: 'roleName'
        }, 
        {
            Header: 'Approval Level', 
            accessor: 'approvalLevelName'
        }, 
        {
            Header: 'Account Enabled', 
            accessor: 'enabled' ,
            // Cell: ({ enabled }) => {
            //     return (
            //         <Checkbox
            //             name='enabled'
            //             checked={Boolean(enabled.enabled)}
            //             color="primary"
            //         />
            //     );
            // },
        }, 
    ]
    
    const userData = users.map(u => {
        return {
            id: u.userId, 
            firstName: u.firstName, 
            lastName: u.lastName, 
            email: u.email, 
            phone: u.phone, 
            logicalHierarchyId: u.logicalHierarchyId,
            physicalHierarchyId: u.physicalHierarchyId,
            roleName: u.roleName, 
            approvalLevelName: u.approvalLevelName, 
            enabled: u.enabled,
        }
    }); 

    // console.log(safetyIncidents); 
    return (
        <Fragment>
            <Styles>            
                <Table columns={columns} data={userData} route='/manage/users/' {...props} />
            </Styles>
            <Typography variant="caption" display="block" gutterBottom>
                *Hint - Click anywhere on the row of a user to edit the user
            </Typography>
        </Fragment>
    )
}
 
function mapStateToProps(state){
    // console.log(state); 
    return {
        lookupData: state.lookupData
    }
}

//wrapping withRouter HOC so we can access the history object in the table (for row clicks)
export default withRouter(
    connect(mapStateToProps, 
        {

        })(UserList)
); 