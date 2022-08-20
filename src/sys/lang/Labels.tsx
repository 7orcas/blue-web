import '../../css/Table.css';
import React from 'react'
import { useTable } from 'react-table'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Labels = () => {

  const { session } = useContext(AppContext) as AppContextI
  
  // var arr = session.labels.map(l => ({l.key, l.label}))

  const data : Array<any> = React.useMemo(() => session.labels, [])
  //const data = React.useMemo(() => [{key:'k1', label:'l1'}, {key:'k2', label:'l2'}], [])

  const columns : Array<any> = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', 
      },
      {
        Header: 'Code',
        accessor: 'key', // accessor is the "key" in the data
      },
      {
        Header: 'Label',
        accessor: 'label',
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
  } = useTable({ columns, data})

  return (
    

    <table {...getTableProps()} className='md-table'>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()} className='table-header'>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 className='table-header'
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
    

   )
}

export default Labels