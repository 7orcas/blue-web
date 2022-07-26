import axios from 'axios';
import UrlSearchParams from './util/urlSearchParams'

const params = new UrlSearchParams()
axios.defaults.baseURL = params.baseUrl

export default axios.create({
  baseURL: params.baseUrl
  // baseURL: 'http://localhost:8080/blue/api/' DELETE
});
