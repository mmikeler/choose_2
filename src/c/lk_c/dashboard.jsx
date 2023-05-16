import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../App"
import { _ORDER } from "../../f/order"
import { Laptop, Phone, Table, Tablet } from "react-bootstrap-icons"


export function Dashboard() {

  return (
    <FORMATS_STATIC />
  )
}

function FORMATS_STATIC() {
  const { state, dispatch } = useContext(AppContext)
  const [fStatic, setStatic] = useState({})
  const [stat, setStat] = useState({
    total: 0,
    orderStatuses: {
      succeeded: 0,
      pending: 0,
      canceled: 0,
      refund: 0
    },
    userDevices: {
      phone: 0,
      tablet: 0,
      laptop: 0
    }
  });

  const list = [];
  for (let format in fStatic) {
    list.push(<tr key={format}><td>{format}</td><td>{fStatic[format]}</td></tr>)
  }

  useEffect(() => {
    let FD = new FormData()
    FD.append('action', 'GET_ORDERS')
    fetch(state.ajaxUrl, {
      method: 'POST',
      body: FD,
      //mode: "no-cors"
    })
      .then(res => res.json())
      .then(res => dispatch({
        type: 'SET_ORDERS',
        pay: res
      }))
      .catch()
  }, [])

  useEffect(() => {
    let formats = {};
    let stat = {
      total: 0,
      orderStatuses: {
        succeeded: 0,
        pending: 0,
        canceled: 0,
        refund: 0
      },
      userDevices: {
        phone: 0,
        tablet: 0,
        laptop: 0
      }
    };

    const getDeviceType = (order) => {
      const ua = order?.user_agent;

      if (ua === 'unknow') return

      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        stat.userDevices.tablet += 1;
      }
      else if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          ua
        )
      ) {
        stat.userDevices.phone += 1;
      }
      else {
        stat.userDevices.laptop += 1;
      }
    };

    state.orders.forEach((order, index) => {
      let ORDER = new _ORDER(order)

      stat.orderStatuses[ORDER.get_pay_status()] += 1
      getDeviceType(order)

      if (order.ID === 0 || ORDER.get_pay_status() !== 'succeeded') { return }

      for (let item in order.items) {
        let itemData = order.items[item]
        if (itemData?.title) {
          if (itemData.title in formats) {
            formats[itemData.title] += itemData.count
          } else {
            formats[itemData.title] = itemData.count
          }
        }
      }

      stat.total += ORDER.get_total() === 'Unknow' ? 0 : +ORDER.get_total()
    })

    const sorted = Object.keys(formats)
      .sort((key1, key2) => formats[key2] - formats[key1])
      .reduce((obj, key) => ({
        ...obj,
        [key]: formats[key]
      }), {})

    setStatic(sorted)
    setStat(stat)

  }, [state.orders])

  return (
    <>
      <div className="d-flex flex-wrap">
        <div className="mt-3 w-25 p-2">
          <DashboardWidget title={'Выручка'}>
            <div>
              <div className="small mb-1">Доход: <span className="h4">{stat.total - (stat.total / 100 * 3.5) - (stat.total / 100 * 9)}&nbsp;₽</span></div>
              <div className="small">Комиссия кассы: {stat.total / 100 * 3.5}&nbsp;₽ (3.5%)</div>
              <div className="small">Комиссия сервиса: {stat.total / 100 * 9}&nbsp;₽ (9%)</div>
            </div>
          </DashboardWidget>
        </div>

        <div className="mt-3 w-25 p-2">
          <DashboardWidget title={'Заказы'}>
            <div className="small d-flex">
              <div className="p-1 fw-bold text-success">Оплачен: {stat.orderStatuses.succeeded}</div>
              <div className="p-1 fw-bold text-secondary">Отменён: {stat.orderStatuses.canceled}</div>
              <div className="p-1 fw-bold text-danger">Возврат: {stat.orderStatuses.refund}</div>
            </div>
          </DashboardWidget>
        </div>

        <div className="mt-3 w-25 p-2">
          <DashboardWidget title={'Устройства'}>
            <div className="d-flex">
              <div className="mx-auto h5"><Phone />&nbsp;{stat.userDevices.phone}</div>
              <div className="mx-auto h5"><Tablet />&nbsp;{stat.userDevices.tablet}</div>
              <div className="mx-auto">/</div>
              <div className="mx-auto h5"><Laptop />&nbsp;{stat.userDevices.laptop}</div>
            </div>
          </DashboardWidget>
        </div>

        <div className="mt-3 w-50 p-2">
          <DashboardWidget title={'Популярность форматов'}>
            <table className="table small">
              <thead>
                <tr>
                  <th>Формат</th>
                  <th>Кол-во</th>
                </tr>
              </thead>
              <tbody>{list}</tbody>
            </table>
          </DashboardWidget>
        </div>

      </div>

    </>
  )
}

function DashboardWidget(props) {
  return (
    <div className="dashboard-widget card" >
      <div className="card-header">
        <div className="h6">{props.title || 'Unknow title'}</div>
      </div>
      <div className="card-body d-flex w-100" style={{ minHeight: '130px' }}>
        <div className="my-auto w-100">{props.children}</div>
      </div>
    </div>
  )
}