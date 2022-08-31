import axios from '../api/apiAxios'

export interface LabelI {
  id: number
  org: number
  key: string
  label: string
}

const loadLabels = async (loadFlag? : string) => {

    try {
        const response = await axios.get(`lang/pack?load=${loadFlag}`)
        let labels : Array<LabelI> = []
        if (response.status === 200){
          for (const l of response.data.data) {
              labels.push ({id : l.id, org : l.org, key : l.code, label : l.label})
          }
        }
        return labels
    } catch (err : any) {
        console.log('loadLabels' + err.message)
    } finally {
    }
}

export default loadLabels