import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../../App";
import { Disk } from "../../../f/disk";
import { _ORDER } from "../../../f/order";

export function UNLOADED(props) {
  const { state, dispatch } = useContext(AppContext)
  const [busy, isBusy] = useState(false)
  const ordersArray = props.o ?? []

  const unloadOrder = () => {

    isBusy(true)

    const orders = {}

    ordersArray.map(order => {

      const o = new _ORDER(order).init()

      o.items.forEach(el => {
        let option = el.path
        if (orders[option] === undefined) orders[option] = []

        orders[option].push({
          format: el.formatTitle,
          fileTitle: el.orderName,
        })

      })
    });

    if (Object.keys(orders).length > 0) {

      const D = new Disk(state.user._yandex_app_key)

      D.unloadOrders(orders, (ordersDir) => {
        isBusy(false)

        // Меняем статус выгруженных заказов на "выгружен"
        ordersArray.forEach(order => {
          state.API.setOrderStatus(order, 'unloaded', () => {
            dispatch({
              type: 'SET_ORDER_STATUS',
              pay: {
                id: order.ID,
                newStatus: 'unloaded'
              }
            })
            state.API.updateOrderMeta(order.ID, '_orders_dir', ordersDir)
            alert('Выгрузка завершена в папку ' + ordersDir)
          })

        })

      })
    }

  }

  return (

    busy ?
      <button className="btn btn-outline-primary btn-sm mx-3 d-flex align-items-center" type="button" disabled>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Обработка...
      </button>
      :
      <button type="button" className="btn btn-outline-primary btn-sm mx-3" onClick={unloadOrder}>Выгрузить</button>

  )
}