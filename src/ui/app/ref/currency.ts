import { BaseEntRefI, initEntRefBase, initEntBaseOV } from '../../../sys/definition/interfaces'
import { EditorConfig } from '../../../sys/component/editor/EditorConfig'
import apiGet from '../../../sys/api/apiGet'
import Message from '../../../sys/system/Message'

/*
  Currency configurations.
  Includes
  - editor configuration
  - entity interfaces
  - get (data) functions

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

export interface CurrencyListI extends BaseEntRefI {
  
}

export const editorConfigCurrency = () : EditorConfig<CurrencyListI, CurrencyListI> => {
  var ed : EditorConfig<CurrencyListI, CurrencyListI> = new EditorConfig()
  ed.EDITOR_TITLE = 'currs'
  ed.CONFIG_ENTITIES = ['app.ref.ent.EntCurrency']
  ed.POST_URL = 'ref/currency'
  ed.EXCEL_URL = 'ref/currency/excel'
  return ed
}

//Load Currency list and populate the fields
export const loadCurrencyList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('ref/currency', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<CurrencyListI> = []

      for (const l of data) {
        var ent : CurrencyListI = {} as CurrencyListI  
        initEntRefBase(l, ent)
        list.push (ent)
        initEntBaseOV(ent)
      }

      return list
    }
  } catch (err : any) {
    console.log (err)
  } 
}

//Create new entity
export const newCurrencyList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('ref/currency/new', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var ent : CurrencyListI = {} as CurrencyListI
      for (const l of data) {
        initEntRefBase(l, ent)
      }
      return ent
    }

  } catch (err : any) {
    console.log (err)
  }
}
