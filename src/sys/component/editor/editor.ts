import apiGet from '../../api/apiGet'
import useLabelX from '../../lang/useLabel'

/*
  Editor utility functions

  [Licence]
  Created 15.09.22
  @author John Stewart
*/


export interface BaseListI {
  id: number
  org: number
  code: string
  active: boolean
  descr: string
  changed: boolean
}

export const loadList = async <T extends BaseListI>(list : Array<T>, url : string, setSession : any, setMessage : any) => {
  try {
    const data = await apiGet(url, setSession, setMessage)
    
    for (const l of data) {
      var base : T = {} as T  
      base.id = l.id
      base.org = l.org
      base.code = l.code
      base.descr = ''
      base.active = l.active
      base.changed = false
      list.push (base)
    }
    
    return data
  } catch (err : any) { } 
}


export interface BaseEntI {
  id: number
  org: number
  code: string
  active: boolean
  originalValue: string | undefined
}

export const loadEnt = (data : any, ent : BaseEntI) => {
  ent.id = data.id
  ent.org = data.org
  ent.code = data.code
  ent.active = data.active
}

/**
 * When using JSON.stringify on entity, don't include the 'originalValue' field
 * @param key 
 * @param value 
 * @returns 
 */
export const jsonReplacer = (key : string, value : any) => {
  if (key === 'originalValue') return undefined;
  else return value;
}

/**
 * Conveniece method to return a label
 * @param key 
 * @returns 
 */
export const useLabel = (key : string) => {
  return useLabelX(key)
}
