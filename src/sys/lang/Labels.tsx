import '../../css/Table.css';
import React, { useState, useContext } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Labels = () => {

  const [filterInput, setFilterInput] = useState("");
  const { session } = useContext(AppContext) as AppContextI
  
  const handleFilterChange = (e : any) => {
    const value = e.target.value || undefined;
    setFilter("label", value); 
    setFilterInput(value);
  };

  const data : Array<any> = React.useMemo(() => session.labels, [])
  //const data = React.useMemo(() => [{key:'k1', label:'l1'}, {key:'k2', label:'l2'}], [])

  const columns : Array<any> = React.useMemo(
    () => [
      {
        Header: 'Key',
        columns: [
          {
            Header: 'ID',
            accessor: 'id', 
            Cell: ({value}: any) => <span>{value * -1}</span>,
            maxWidth: 400,
            minWidth: 200,
            width: 300,
          },
          {
            Header: 'Code',
            accessor: 'key', // accessor is the "key" in the data
          },
        ]
      },
      {
        Header: 'en',
        columns: [
          {
            Header: 'Label',
            accessor: 'label',
            maxWidth: 800,
            minWidth: 400,
            width: 600,
          },
          {
            Header: 'Edit',
            Cell: ({value}: any) => <span>edit</span>
          }
        ]
      }
    ],
    []
  )
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable({ columns, data}, useFilters, useSortBy)

  return (
    <>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={"Search label"}
      />
      <table {...getTableProps()} className='md-table'>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className='table-header'>
              {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} 
                    className={'table-header ' 
                    + column.isSorted? column.isSortedDesc? 'sort-desc': 'sort-asc': ''}
                    style={{ minWidth: column.minWidth, width: column.width }}
                    >
                      {column.render('Header')}
                  </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className={'table-row-' + index % 2}>
                {row.cells.map(cell => {
                  return (<td {...cell.getCellProps()}>{cell.render('Cell')}</td>)
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
   )
}

export default Labels