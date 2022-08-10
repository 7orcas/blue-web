import { LabelI } from '../Interfaces'
import axios from '../apiAxios'

const loadLabels = async (baseUrl : string, setLabels : any) => {

    try {
        const response = await axios.get(`${baseUrl}/lang/pack`, {withCredentials: true})
        let labels : Array<LabelI> = []
        for (const l of response.data.data) {
            labels.push ({key : l.c, label : l.l})
        }
        setLabels(labels)
        return labels
    } catch (err : any) {
        console.log('loadLabels' + err.message)
    } finally {

    }
}

export default loadLabels