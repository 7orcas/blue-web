class UrlSearchParams {
  baseUrl : string = ''
  uploadUrl : string = ''
  init : string = ''
  sid : string = ''
  
  constructor() {
    const url = new URL (window.location.href)
    this.baseUrl = this.getParamString(url.searchParams.get("base"))
    this.uploadUrl = this.getParamString(url.searchParams.get("upload"))
    this.init = this.getParamString(url.searchParams.get("init"))
    this.sid = this.getParamString(url.searchParams.get("sid"))
  }

  getParamString (p : string | null) : string {
    if (p !== null) return p
    return ''
  }

  getParamInteger (p : string | null) : number {
    if (p !== null) return parseInt(p)
    return -1
  }

  isValid = () => {
      if (this.baseUrl === null || this.baseUrl.length === 0) return false
      if (this.uploadUrl === null || this.uploadUrl.length === 0) return false
      if (this.init === null || this.init.length === 0) return false
      if (this.sid === null || this.sid.length === 0) return false
      return true
  }
}

export default UrlSearchParams
