import React, { Fragment } from 'react'
import {
    useTable,
    useSortBy,
    usePagination,
  } from 'react-table';
import { Typography, Select, MenuItem, Table as MaUTable, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import ArrowDropDownIcon  from '@material-ui/icons/ArrowDropDown';  
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronLeftRight from '@material-ui/icons/ChevronRight';

function Table({ ...props }) {

    const { columns, data, route } = props; 

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        // getTableBodyProps,
        headerGroups,
        // rows,
        prepareRow,
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
    },
        useSortBy,
        usePagination
    )

  // Render the UI for your table
  return (
    <Fragment>
        
        {/* 
            Pagination can be built however you'd like. 
            This is just a very basic UI implementation:
        */}
        <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {<FirstPageIcon />}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {<ChevronLeftIcon />}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
                {<ChevronLeftRight />}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {<LastPageIcon />}
            </button>{' '}
            
            <Typography variant="overline" display="block" gutterBottom>
                <span style={{ margin: '1rem' }}>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>|</span>
                <span style={{ margin: '1rem' }}>
                    Showing{' '}
                    <strong>
                        {pageSize >= data.length ? data.length : pageSize} of {data.length}
                    </strong>{' '}
                </span>
            </Typography>
            <Select 
                value={pageSize}
                variant='outlined'
                onChange={e => {
                    setPageSize(Number(e.target.value))
                }}
                style={{ width: '200px' }}
                >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <MenuItem  key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </MenuItem >
                ))}
            </Select >
        </div>

        
        <MaUTable {...getTableProps()}>
            <TableHead>
                {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                                {column.isSorted
                                ? column.isSortedDesc
                                    ? <ArrowDropDownIcon />
                                    : <ArrowDropUpIcon />
                                : ''}
                            </span>
                        </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {page.map(
                    (row, i) =>
                        prepareRow(row) || (
                        <TableRow 
                            {...row.getRowProps()}
                            onClick={() => props.history.push(route + row.values.id)} //must pass in the id of the row as 'id' (not eventId etc..)
                        >   
                            {row.cells.map(cell => {
                                return (
                                    <TableCell {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    )
                )}
            </TableBody>
        </MaUTable>
    </Fragment>
  )
}

export default Table; 