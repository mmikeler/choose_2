import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Envelope, Phone } from "react-bootstrap-icons"
import { AppContext } from "../../App"
import { isJson } from "../../f/fetch"
import { OFFCANVAS } from "../bs-components/offcanvas"


export function ORDERS() {
  const { state } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [changeOrder, setChangeOrder] = useState(null)
  const contacts = changeOrder?.post_excerpt.split('&&')

  let list = orders.map((el, ind) => {
    return <ORDER key={ind} order={el} changeAction={setChangeOrder} />
  })

  useEffect(() => {
    let FD = new FormData()
    FD.append('action', 'GET_ORDERS')
    FD.append('user_id', state.user.ID)
    fetch(state.ajaxUrl, {
      method: 'POST',
      body: FD,
      //mode: "no-cors"
    })
      .then(res => res.json())
      .then(res => setOrders(res))
      .catch()
  }, [])

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Имя</th>
            <th scope="col">Дата</th>
            <th scope="col">Контакты</th>
            <th scope="col">Статус</th>
            <th scope="col">Опции</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>

      {
        changeOrder ?
          <OFFCANVAS
            width="50%"
            closeAction={() => setChangeOrder(null)}
            title={'#' + changeOrder.ID + ' ' + changeOrder.post_title}>

            <div className="mb-3">
              <div className="d-flex align-items-center mb-4">
                <Phone size={'20'} className="me-1" /> {contacts[0]} <br />
                <Envelope size={'20'} className="ms-4 me-1" /> {contacts[1]}
              </div>
              <div className="order-content">
                <ORDER_MEDIA_LIST list={changeOrder.post_content} />
              </div>
            </div>

          </OFFCANVAS> : null
      }
    </>
  )
}

function ORDER(props) {
  const o = props.order
  const contacts = o.post_excerpt.split('&amp;&amp;')
  return (
    <tr onClick={() => props.changeAction(o)}>
      <th>{o.ID}</th>
      <td>{o.post_title}</td>
      <td>{o.post_date}</td>
      <td>{contacts[0]} <br /> {contacts[1]}</td>
      <td></td>
      <td></td>
    </tr>
  )
}

function ORDER_MEDIA_LIST(props) {
  let rows = []
  for (let row in props.list.items) {
    let r = isJson(row) ? JSON.parse(row) : {}
    let count = props.list.items[row]
    rows.push(
      <tr key={row}>
        <td><img src={r.url} alt="" /></td>
        <td>{r.title}<br />{r.width + 'x' + r.height}</td>
        <td>{count}</td>
      </tr>
    )
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Миниатюра</th>
          <th>Формат</th>
          <th>Кол-во</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}