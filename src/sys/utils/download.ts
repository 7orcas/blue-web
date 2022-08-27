import axios from '../api/apiAxiosDownload'
import { saveAs } from 'file-saver'

const download = async (baseUrl : string, rest : string, filename? : string) => {

  try {
    const response = await axios.get(`${baseUrl}${rest}`, {withCredentials: true})

    if (response.status === 200){
      if (filename === null){
        filename = 'Download.xlsx'
      }

      try {
        const headers : string = response.headers['content-disposition']
        const header : string[] = headers.split(';')
        const fn : string[] = header[1].split('=')
        filename = fn[1]

      } catch (err : any) {
        console.log('downloadExcel filename:' + err.message)
      }

      saveAs(new Blob([response.data]), filename);
    }
  } catch (err : any) {
      console.log('exportExcel:' + err.message)
  } finally {

  }
}

export default download