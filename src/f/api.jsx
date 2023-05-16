

export class API {
  constructor(apiurl) {
    this.apiurl = apiurl;
    this.headers = '';
  }

  addCollection = () => {
    return fetch(this.apiurl, {
      method: 'GET',
      headers: this.headers
    })
  }

  getOrders = (form, cb) => {
    const queryString = new URLSearchParams(new FormData(form)).toString()
    return fetch(this.apiurl + '?action=GET_ORDERS&' + queryString, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => cb(res))
  }

  getCustomAction = (formDataObj) => {
    let formData = new FormData();

    for (let f in formDataObj) {
      formData.append(f, formDataObj[f])
    }

    return fetch(this.apiurl, {
      method: 'POST',
      body: formData
    })
  }

  setOrderStatus = (order, status, cb) => {
    return this.getCustomAction({
      action: 'SET_ORDER_STATUS',
      orderID: order.ID,
      orderStatus: status
    }).then(res => res.json())
      .then(res => cb())
  }

  updateOrderMeta = (orderID, meta_key, meta_value) => {
    return this.getCustomAction({
      action: 'UPDATE_ORDER_META',
      orderID: orderID,
      meta_key: meta_key,
      meta_value: meta_value,
    })
  }
}