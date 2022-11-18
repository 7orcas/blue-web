import { FC, useState, useContext } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import MenuItemFactory, { MenuItem } from '../../menu/MenuItemFactory'
import Menu from "../../menu/Menu"
import useLabel from '../../lang/useLabel'
import download from '../utils/download'
import UploadDialog from '../dialog/UploadDialog'
import { Menu as MenuS, MenuButton } from '@szhsin/react-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

/*
  Display a specific table menu

  Created Oct '22
  [Licence]
  @author John Stewart
 */


interface TableMenuProps {
  exportExcelUrl?: string | undefined
  uploadExcelUrl?: string | undefined
  uploadExcelLangKey?: string | undefined
  children? : any
}

const TableMenu : FC<TableMenuProps> = ({ 
  exportExcelUrl = undefined, 
  uploadExcelUrl = undefined, 
  uploadExcelLangKey = undefined, 
  children }) => {

  const { setMessage } = useContext(AppContext) as AppContextI
  const [openUpload, setOpenUpload] = useState (false)

  //Table Menu
  const f = new MenuItemFactory ()
  var tableMenu = new MenuItem(9999, null)

  //Export to excel option
  var downloadX = f.action(
    useLabel('expExcel'), 
    () => download(exportExcelUrl !== undefined? exportExcelUrl : ''),
    null)
  if (exportExcelUrl !== undefined) {
    tableMenu.menu.push(downloadX)
  }

  //Upload from excel option
  var uploadX = f.action(
    useLabel(uploadExcelLangKey !== undefined? uploadExcelLangKey : 'fileup'), 
    () => setOpenUpload(!openUpload),
    null)
  if (uploadExcelUrl !== undefined) {
    tableMenu.menu.push(uploadX)
  }

  const setSelection = (item : MenuItem) => {
    item.action()
  }

  return (
    <div className='table-menu'>
      {tableMenu.menu.length > 0 &&
        <MenuS 
          menuButton={<MenuButton><FontAwesomeIcon icon={faBars} /></MenuButton>} transition
          className='table-menu-item'
          >
          {tableMenu.menu.map(i => (
            <Menu key={i.key} item={i} setSelection={setSelection}/>
          ))}
        </MenuS>
      }
      { children }
      <UploadDialog 
        title={uploadExcelLangKey !== undefined? uploadExcelLangKey : 'fileup'}
        rest={uploadExcelUrl !== undefined? uploadExcelUrl : ''}
        clazz='upload'
        setMessage={setMessage}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
      />
    </div>
  )
}

export default TableMenu
  
interface TableMenuTabProps {
  code: string
  close?: any
  children?: any
}

export const TableMenuTab : FC<TableMenuTabProps> = ({ 
  code, 
  close,
  children
  }) => {

  //Is Close action
  const closeAction = () => {
    return typeof close !== 'undefined'
  }

  //File the Close action
  const closeX = () => {
    if (typeof close !== 'undefined') {
      close();
    }
  }

  return (
    <TableMenu>
      <div className='table-menu-tab' onClick={closeX}>
        {code}
        {closeAction() && <div className='table-menu-tab-close'>x</div>}
      </div>
      {children}
    </TableMenu>
  )
}



