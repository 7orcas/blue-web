class UrlSearchParams {
  baseUrl : string = ''
  uploadUrl : string = ''
  init : string = ''
  sid : string = ''
  clientNr : number = -1
  adminLoggedIn : boolean = false
  
  constructor() {
    const url = new URL (window.location.href)
    this.baseUrl = this.getParamString(url.searchParams.get("base"))
    this.uploadUrl = this.getParamString(url.searchParams.get("upload"))
    this.init = this.getParamString(url.searchParams.get("init"))
    this.sid = this.getParamString(url.searchParams.get("sid"))
    this.clientNr = this.getParamInteger(url.searchParams.get("cn"))
    this.adminLoggedIn = this.getParamBoolean(url.searchParams.get("ali"))
  }

  getParamString (p : string | null) : string {
    if (p !== null) return p
    return ''
  }

  getParamInteger (p : string | null) : number {
    if (p !== null) return parseInt(p)
    return -1
  }

  getParamBoolean (p : string | null) : boolean {
    if (p !== null && p === 'true') return true
    return false
  }

  isValid = () => {
      if (this.baseUrl === null || this.baseUrl.length === 0) return false
      if (this.uploadUrl === null || this.uploadUrl.length === 0) return false
      if (this.init === null || this.init.length === 0) return false
      if (this.sid === null || this.sid.length === 0) return false
      if (this.clientNr === null) return false
      return true
  }
}

export default UrlSearchParams
