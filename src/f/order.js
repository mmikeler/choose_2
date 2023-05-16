export class _ORDER {
  constructor(order) {
    for (let prop in order) {
      this[prop] = order[prop]
    }
  }

  init() {
    const c = this.contacts.replace(/amp;/gi, '').split('&&');
    this.contacts = {
      phone: c[0],
      email: c[1]
    };

    this.post_password = c[2]

    let arr = []
    for (let item in this.items) {
      const n = this.items[item]
      const path = typeof (n) === 'object' && n?.url.match(new RegExp('p=([^&=]+)'))[1]
      const fileName = path && path?.split('/').pop()
      arr.push({
        formatTitle: n.title,
        formatSize: n.width + 'x' + n.height,
        cost: n.cost,
        path: path,
        fileName: fileName,
        count: n.count,
        orderName: this.ID + '_' + this.collectionID + '_' + fileName + '_' + n.count
      })
    }
    this.items = arr;
    return this;
  }

  get_total() {
    return this.amount || 'Unknow'
  }

  get_pay_status() {
    return this.pay_status || 'Unknow'
  }
}