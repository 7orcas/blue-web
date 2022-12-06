import { BaseEntRefI, initEntRefBase, initEntBaseOV } from '../../../sys/definition/interfaces'
import { EditorConfig } from '../../../sys/component/editor/EditorConfig'
import apiGet from '../../../sys/api/apiGet'
import Message from '../../../sys/system/Message'

/*
  Country configurations.
  Includes
  - editor configuration
  - entity interfaces
  - get (data) functions

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

export interface CountryListI extends BaseEntRefI {
  
}

export const editorConfigCountry = () : EditorConfig<CountryListI, CountryListI> => {
  var ed : EditorConfig<CountryListI, CountryListI> = new EditorConfig()
  ed.EDITOR_TITLE = 'countries'
  ed.CONFIG_ENTITIES = ['app.ref.ent.EntCountry']
  ed.POST_URL = 'ref/country'
  ed.EXCEL_URL = 'ref/country/excel'
  return ed
}

//Load Country list and populate the fields
export const loadCountryList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('ref/country', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<CountryListI> = []

      for (const l of data) {
        var ent : CountryListI = {} as CountryListI  
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
export const newCountryList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('ref/country/new', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var ent : CountryListI = {} as CountryListI
      for (const l of data) {
        initEntRefBase(l, ent)
      }
      return ent
    }

  } catch (err : any) {
    console.log (err)
  }
}
