import axios from 'axios';
import UrlSearchParams from './urlSearchParams'

const params = new UrlSearchParams()
axios.defaults.baseURL = params.uploadUrl

console.log('params.uploadUrl=' + params.uploadUrl)

export default axios.create({  
  baseURL: params.uploadUrl,
  headers: { "Content-Type": "multipart/form-data" },
});
