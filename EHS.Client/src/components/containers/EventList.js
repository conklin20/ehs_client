import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Paper } from '@material-ui/core';
import Moment from 'react-moment'; 
import SearchBar from '../function/SearchBar';
import { Link } from 'react-router-dom'; 


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headerRows = [
  { id: 'eventId', numeric: true, disablePadding: false, label: 'Id' , render: ({ row }) => (<Link to={{ pathname: `/events/si/${row.id}`}}>{row.name}</Link>) },
  // { id: 'type', numeric: true, disablePadding: false, label: 'Event Type' }, (Safety, Env, Obs etc)
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' ,  },
  { id: 'dateOccurred', numeric: false, disablePadding: false, label: 'Date' ,  },
  { id: 'timeOccurred', numeric: false, disablePadding: false, label: 'Time' ,  },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' ,  },
  { id: 'employeeId', numeric: false, disablePadding: false, label: 'Employee ID' ,  },
  { id: 'job', numeric: false, disablePadding: false, label: 'Job' ,  },
  { id: 'area', numeric: false, disablePadding: false, label: 'Area' ,  },
  { id: 'department', numeric: false, disablePadding: false, label: 'Dept.' ,  },
  { id: 'localePlant', numeric: false, disablePadding: false, label: 'Plant' ,  },
  // { id: 'localePlantArea', numeric: false, disablePadding: false, label: 'Plant Area' ,  },
  // { id: 'whatHappened', numeric: false, disablePadding: false, label: 'What Happened' , width: '20%' },
  { id: 'openAction', numeric: true, disablePadding: false, label: 'Open Actions' ,  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headerRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
						padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
            size='small'
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles(theme => ({
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    link: {
        textDecoration: 'none', 
        // textAlign: 'left',
        // position: 'absolute',
    },
}));

const EventList = props => {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('dateOccurred');
  const [selected, setSelected] = useState(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleClick(event, name) {
    setSelected(name);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const { safetyIncidents, currentUser, dense } = props;
	
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, safetyIncidents.length - page * rowsPerPage);

  return (
    <div >
      <Paper className={classes.paper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'medium' : 'small'} 
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
							onRequestSort={handleRequestSort}
							dense={dense}
            />
            <TableBody>
              {stableSort(safetyIncidents, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                        hover
                        // onClick={event => handleClick(event, row.eventId)}
                        // aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.eventId}
                        selected={selected}
                        >
                        {/* This link will display the safety event form for the given eventId (See Routes.js) */}
                        {/* <Link to={`/events/si/${row.eventId}`} className={classes.link} > */}

                            <TableCell component="th" id={labelId} scope="row"  padding="none" align="right">
                                {row.eventId}
                            </TableCell>
                            <TableCell >{row.eventStatus}</TableCell>
                                                    <TableCell >
                                                        <Moment format={currentUser.user.dateFormat || 'YYYY/MM/DD'} add={{ hours: currentUser.user.timeZone}}>{row.eventDate}</Moment>	
                                                    </TableCell>
                                                    <TableCell >
                                                        <Moment format="LTS" add={{ hours: currentUser.user.timeZone}}>{row.eventDate}</Moment>	
                                                    </TableCell>
                            <TableCell >{
                                                        row.initialCategory === row.resultingCategory 
                                                            ? row.resultingCategory
                                                            : `${row.initialCategory}|${row.resultingCategory}`
                                                    }</TableCell>
                            <TableCell >{row.employeeId}</TableCell>
                            <TableCell >{row.jobTitle}</TableCell>
                            <TableCell >{row.area}</TableCell>
                            <TableCell >{row.department}</TableCell>
                            <TableCell >{row.localePlant}</TableCell>
                            {/* <TableCell >{row.localePlantArea}</TableCell> */}
                            {/* <TableCell >{row.whatHappened.length > 100 ? row.whatHappened.substring(0, 100).concat('...') : row.whatHappened }</TableCell> */}
                            <TableCell >{row.actions.filter(a => a.completionDate !== null).length}</TableCell>
                        {/* </Link> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={safetyIncidents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default EventList;