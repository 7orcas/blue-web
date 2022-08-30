import axios from 'axios';
import UrlSearchParams from './urlSearchParams'

const params = new UrlSearchParams()
axios.defaults.baseURL = params.baseUrl

export default axios.create({
  baseURL: params.baseUrl,
  withCredentials: true
});
