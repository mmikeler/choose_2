

export class Disk {
  constructor(key, id) {
    this.key = key;
    this.iserID = id;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'OAuth ' + this.key
    })
    this.info = null
    this.backPath = null
    this.path = 'disk:/Приложения/CHOOSE'
    this.baseUrl = 'https://cloud-api.yandex.net/v1/disk'
    this.storageLevel = this.path.split('/').length - 3
  }

  addResource = async (data) => {
    return fetch(this.baseUrl + '/resources?path=' + data.path + '/' + data.name, {
      method: 'PUT',
      headers: this.headers
    })
  }

  getResource = (path) => {
    this.setBackPath(path)
    this.path = path
    this.storageLevel = path.split('/').length - 3
    return this.getResourceMeta(path);
  }

  getResourceMeta = (path) => {
    return fetch(this.baseUrl + '/resources?path=' + path, {
      method: 'GET',
      headers: this.headers
    })
  }

  setBackPath = (path) => {
    let backPathArray = path.split('/')
    if (backPathArray.length > 3) {
      backPathArray.splice(-1, 1)
      this.backPath = backPathArray.join('/');
    }
    else {
      this.backPath = path
    }
  }

  updateResourceCustomProperties = (path, data) => {
    return fetch(this.baseUrl + '/resources?path=' + path, {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'OAuth ' + this.key,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ 'custom_properties': data })
    })
  }

  removeResource = (path) => {
    return fetch(this.baseUrl + '/resources?path=' + path, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'OAuth ' + this.key,
        'Content-Type': 'application/json'
      }),
    })
  }

  getThumb = (path) => {
    return fetch(this.baseUrl + '/resources?path=' + path + '&preview_size=150x150', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'OAuth ' + this.key
      })
    })
  }

  init = () => {
    return fetch(this.baseUrl, {
      method: 'GET',
      headers: this.headers
    })
  }
}