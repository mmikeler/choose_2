

export class Disk {
  constructor(key, id) {
    this.key = key;
    this.userID = id;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'OAuth ' + this.key
    })
    this.info = null
    this.backPath = null
    this.path = 'app:'
    this.baseUrl = 'https://cloud-api.yandex.net/v1/disk'
    this.storageLevel = this.path.split('/').length - 3
  }

  reset = () => {
    this.path = 'app:'
    this.storageLevel = 0
  }

  addResource = async (data) => {
    this.setBackPath(data.path)
    this.storageLevel = data.path.split('/').length - 3
    return await fetch(this.baseUrl + '/resources?path=' + data.path + '/' + data.name.replace(/\s/g, '-'), {
      method: 'PUT',
      headers: this.headers
    })
  }

  getResource = (path) => {
    path = path === 'app:' ? 'app:/' : path
    this.setBackPath(path)
    this.path = path
    this.storageLevel = path.includes('app') ? path.split('/').length - 2 : path.split('/').length - 3
    return this.getResourceMeta(path);
  }

  getResourceMeta = async (path) => {
    return await fetch(this.baseUrl + '/resources?path=' + path, {
      method: 'GET',
      headers: this.headers
    })
  }

  setBackPath = (path) => {
    let backPathArray = path.split('/')
    if (backPathArray.length > 3) {
      backPathArray.splice(backPathArray.length - 1, 1)
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
        'Authorization': 'OAuth ' + this.key,
        'Content-Type': 'application/json'
      })
    })
  }

  copyResource = async (path, newFilePath, cb = () => { }) => {
    return await fetch(this.baseUrl + '/resources/copy?from=' + path + '&path=' + newFilePath + '&force_async=false', {
      method: 'POST',
      headers: this.headers
    }).then(r => r.json()).then(r => cb(r))
  }

  isDirExists = async (path, cb) => {
    try {
      await this.getResourceMeta(path)
        .then(res => res.json())
        .then(res => {
          if ('error' in res) {
            let p = path.split('/')
            let t = p.pop()
            this.addResource({ path: p.join('/'), name: t })
              .then(res => res.json())
              .then(res => {
                if ('href' in res) {
                  cb && cb()
                  console.log(`Dir ${path} create`);
                }
                else {
                  console.log(`Dir ${path} NOT create`);
                  return false;
                }
              })
          }
          else {
            console.log(`Dir ${path} is exist`);
            cb()
          }
        })
    } catch (error) {
      console.log(error);
    }

  }

  getOperationStatus = (href) => {
    return fetch(href, {
      method: 'GET',
      headers: this.headers
    });
  }

  async unloadOrders(orders, cb) {

    // Собираем промисы для каждого файла
    const Promises = [];
    const formats = [];
    for (let filePath in orders) {
      Promises.push(this.getResourceMeta(this.path + '/' + filePath).then(r => r.json()))
      // Заодно соберём требуемые форматы
      orders[filePath].forEach(f => {
        formats.push(f.format)
      })
    }

    // Ожидаем проверку файлов
    await Promise.all(Promises)
      .then(
        responses => {
          // Обрабатываем результаты проверки
          let isAllPromisesCorrect = true;
          responses.map((response, index) => {
            if ('error' in response) {
              console.log(response.error);
              isAllPromisesCorrect = false;
            }
          })
          // Если хотябы один файл отсутствует, то прерываем процесс
          if (isAllPromisesCorrect) {

            // Генерируем название новой папки заказов
            const D = new Date();
            let dirName = (D.toLocaleDateString('ru-RU') + '_' + D.toLocaleTimeString('ru-RU')).replace(/[.:]/gi, '-')
            let newOrdersDir = this.path + '/Заказы/' + dirName

            // Проверяем наличие папок заказов
            this.isDirExists(this.path + '/Заказы', () => {

              this.isDirExists(newOrdersDir, () => {

                // Добавляем папки форматов
                Promise.all([...new Set(formats)].map(f => {
                  return this.addResource({
                    path: newOrdersDir,
                    name: f
                  })
                })).then(r => {

                  // Приступаем к копированию
                  let Copyed = []
                  for (let filePath in orders) {
                    Copyed.push(this.RcopyResource(filePath, orders, newOrdersDir))
                  }

                  Promise.all(Copyed).then((responses) => { cb(newOrdersDir) })
                })
              })
            })
          }
          else {
            console.log('Stop')
            alert('Выгрузка прервана. Файл(ы) не найдены')
          }
        })
  }

  RcopyResource = async (filePath, orders, dirName) => {

    let i = orders[filePath].length - 1;

    const m = async (it) => {

      const endFileName = orders[filePath][it].fileTitle
      const formatTitle = orders[filePath][it].format

      await this.copyResource(
        [this.path, filePath].join('/'),
        [dirName, formatTitle, endFileName].join('/')
      ).then(r => {
        it > 0 && m(i--)
      })
    }

    await m(i)
  }

  init = () => {
    return fetch(this.baseUrl + '/', {
      method: 'GET',
      headers: this.headers
    })
  }
}