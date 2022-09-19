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

  [Licence]
  @author John Stewart
 */


interface Props {
  exportExcelUrl?: string | undefined
  uploadExcelUrl?: string | undefined
  uploadExcelLangKey?: string | undefined
  children? : any
}

const TableMenu : FC<Props> = ({ 
  exportExcelUrl = undefined, 
  uploadExcelUrl = undefined, 
  uploadExcelLangKey = undefined, 
  children }) => {

  const { setMessage } = useContext(AppContext) as AppContextI
  const [openUpload, setOpenUpload] = useState (false)

  //Table Menu
  const f = new MenuItemFactory ()
  var tableMenu = new MenuItem(9999)

  //Export to excel option
  var downloadX = f.action(
    useLabel('expExcel'), 
    () => download(exportExcelUrl !== undefined? exportExcelUrl : '')
  )
  if (exportExcelUrl !== undefined) {
    tableMenu.menu.push(downloadX)
  }

  //Upload from excel option
  var uploadX = f.action(
    useLabel(uploadExcelLangKey !== undefined? uploadExcelLangKey : 'fileup'), 
    () => setOpenUpload(!openUpload)
  )
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
  