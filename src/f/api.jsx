

export class API {
  constructor(apiurl) {
    this.apiurl = apiurl;
  }

  addCollection = () => {
    return fetch(this.apiurl, {
      method: 'GET',
      headers: this.headers
    })
  }

  getOrders = () => {
    return fetch(this.apiurl, {
      method: 'GET',
      headers: this.headers
    })
  }
}