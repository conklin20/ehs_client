import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Paper, Box } from '@material-ui/core';
import Moment from 'react-moment'; 
// import EventItem from '../function/EventItem'; 
import SearchBar from '../function/SearchBar';


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
  { id: 'eventId', numeric: true, disablePadding: false, label: 'Id' , width: 'auto' },
  // { id: 'type', numeric: true, disablePadding: false, label: 'Event Type' }, (Safety, Env, Obs etc)
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' , width: 'auto' },
  { id: 'dateOccurred', numeric: false, disablePadding: false, label: 'Date' , width: 'auto' },
  { id: 'timeOccurred', numeric: false, disablePadding: false, label: 'Time' , width: 'auto' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' , width: 'auto' },
  { id: 'employeeId', numeric: false, disablePadding: false, label: 'Emplooyee ID' , width: 'auto' },
  { id: 'job', numeric: false, disablePadding: false, label: 'Job' , width: 'auto' },
  { id: 'area', numeric: false, disablePadding: false, label: 'Area' , width: 'auto' },
  { id: 'department', numeric: false, disablePadding: false, label: 'Dept.' , width: 'auto' },
  { id: 'localePlant', numeric: false, disablePadding: false, label: 'Plant' , width: 'auto' },
  { id: 'localePlantArea', numeric: false, disablePadding: false, label: 'Plant Area' , width: 'auto' },
  { id: 'whatHappened', numeric: false, disablePadding: false, label: 'What Happened' , width: '20%' },
  { id: 'openAction', numeric: true, disablePadding: false, label: 'Open Actions' , width: 'auto' },
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
  root: {
    width: '100%',
    // marginTop: theme.spacing(3),
  },
  paper: {
		width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
		minWidth: 750,	
  },
  tableWrapper: {
		overflowX: 'auto',
  },
}));

const EventList = props => {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('dateOccurred');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex), 
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

	const { safetyIncidents, currentUser } = props;
	
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, safetyIncidents.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
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
							handleChangeDense={handleChangeDense}
            />
            <TableBody>
              {stableSort(safetyIncidents, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.eventId)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.eventId}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" size="small" padding="none" align="right">
                        {row.eventId}
                      </TableCell>
                      <TableCell size="small">{row.eventStatus}</TableCell>
											<TableCell size="small">
												<Moment format={currentUser.user.dateFormat || 'YYYY/MM/DD'}>{row.eventDate}</Moment>	
											</TableCell>
											<TableCell size="small">
												<Moment format="LTS" add={{ hours: currentUser.user.timeZone}}>{row.eventDate}</Moment>	
											</TableCell>
                      <TableCell size="small">{
												row.initialCategory === row.resultingCategory 
													? row.resultingCategory
													: `${row.initialCategory}|${row.resultingCategory}`
											}</TableCell>
                      <TableCell size="small">{row.employeeId}</TableCell>
                      <TableCell size="small">{row.jobTitle}</TableCell>
                      <TableCell size="small">{row.area}</TableCell>
                      <TableCell size="small">{row.department}</TableCell>
                      <TableCell size="small">{row.localePlant}</TableCell>
                      <TableCell size="small">{row.localePlantArea}</TableCell>
                      <TableCell size="small">{row.whatHappened.length > 100 ? row.whatHappened.substring(0, 100).concat('...') : row.whatHappened }</TableCell>
                      <TableCell size="small">{row.actions.length}</TableCell>
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
        </div>
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