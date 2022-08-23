import axios from '../api/apiAxios'

export interface LabelI {
  id: number
  org: number
  key: string
  label: string
}

const loadLabels = async (baseUrl : string) => {

    try {
        const response = await axios.get(`${baseUrl}/lang/pack`, {withCredentials: true})
        let labels : Array<LabelI> = []
        for (const l of response.data.data) {
            labels.push ({id : l.i, org : l.o, key : l.c, label : l.l})
        }
        return labels
    } catch (err : any) {
        console.log('loadLabels' + err.message)
    } finally {

    }
}

export default loadLabels