import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import {
  ArrowDownCircleFill,
  ArrowLeftCircleFill,
  ArrowRightCircleFill,
  ChevronDoubleDown,
  ChevronDoubleUp,
  Envelope,
  Laptop,
  Person,
  Phone,
  QuestionOctagonFill,
  Tablet,
  Telephone
} from "react-bootstrap-icons"
import { AppContext } from "../../../App"
import { ORDERS_FILTERS } from "./orders_inc"
import { _ORDER } from "../../../f/order"


export function ORDERS() {
  const { state, dispatch } = useContext(AppContext)

  let list = state.orders.map((el, ind) => {
    return <ORDER key={ind} order={el} />
  })

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

  return (
    <>
      <ORDERS_FILTERS />

      {list.length > 0 ? list : <tr><td align="center" colSpan={6}>Заказы не найдены</td></tr>}
    </>
  )
}

function ORDER(props) {
  const { state, dispatch } = useContext(AppContext)
  const order = new _ORDER(props.order)
  const [open, setOpen] = useState(false);

  const pay_status = (status) => {
    let statusDOM = ''
    switch (status) {
      case 'succeeded':
        statusDOM = <><ArrowRightCircleFill color="green" /><span className="ms-1">Оплачен</span> </>
        break;

      case 'canceled':
        statusDOM = <><ArrowLeftCircleFill color="gray" /><span className="ms-1">Отменён</span> </>
        break;

      default:
        statusDOM = <><ArrowDownCircleFill color="orange" /><span className="ms-1">Создан</span> </>
        break;
    }

    return <div className="d-flex align-items-center">{statusDOM}</div>
  }

  const orderStatusColor = () => {
    return order.get_pay_status() === 'succeeded' ? '--bs-green' : '--bs-gray-300'
  }

  const getDeviceType = () => {
    const ua = order?.user_agent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return <Tablet />;
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return <Phone />;
    }
    return <Laptop />;
  };

  return (
    <div className="order text-muted small d-flex flex-wrap justify-content-between p-2 mt-3"
      style={{
        borderTop: '1px solid #ddd',
        borderLeft: `5px solid var(${orderStatusColor()})`
      }}>
      <div>
        <div>
          <span className="fw-bold text-black">
            <span className="text-muted small">#</span>{order.ID}
          </span>
          <span className="ms-2 small">[{order.collectionID}]</span>
        </div>
        <div>{getDeviceType()}</div>
        <div>{order.order_date_gmt}</div>
      </div>

      <div>
        <div><Person className="me-2" size={'15'} />{order.billing_name}</div>
        <div><Telephone className="me-2" size={'15'} />{order.billing_phone}</div>
        <div><Envelope className="me-2" size={'15'} /> {order.billing_email}</div>
      </div>

      <div className="align-self-center">
        <div>{pay_status(order.get_pay_status())}</div>
        <div className="fw-bold text-black">
          <span>{order.get_total()}</span>
          <span className="ms-1">{order.currency}</span>
        </div>
      </div>

      <div>
        <div><POST_STATUS wrap order={order} /></div>
      </div>

      <div
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: 'var(--bs-gray-300)',
          padding: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {open ? <ChevronDoubleUp size={'20'} /> : <ChevronDoubleDown size={'20'} />}
      </div>

      {open &&
        <div className="mt-3 w-100">
          <ORDER_MEDIA_LIST list={order} />
        </div>
      }

    </div >
  )
}

export function POST_STATUS(props) {
  const { state, dispatch } = useContext(AppContext)
  const [openChanger, setOpenChanger] = useState(false);

  let color = 'secondary'
  let text = '-'
  switch (props.order?.order_status) {
    case 'publish':
      text = 'Создан'
      break;

    case 'completed':
      text = 'Выполнен'
      color = 'primary'
      break;

    case 'issued':
      text = 'Выдан'
      color = 'success'
      break;

    case 'archive':
      text = 'В архиве'
      color = 'warning'
      break;

    case 'in_work':
      text = 'В работе'
      color = 'danger'
      break;

    case 'cancel':
      text = 'Отменён'
      color = 'secondary'
      break;

    case 'unloaded':
      text = 'Выгружен'
      color = 'info'
      break;

    default:
      break;
  }

  const onChange = (e) => {
    state.API.setOrderStatus(props.order, e.target.value)
    dispatch({
      type: 'SET_ORDER_STATUS',
      pay: {
        id: props.order.ID,
        newStatus: e.target.value
      }
    })
    setOpenChanger(false)
  }

  return (
    !openChanger ?
      props.wrap ?
        <span
          onClick={() => setOpenChanger(true)}
          className={`badge bg-${color}`}>{text}</span> : text
      :
      <select onChange={onChange} defaultValue={props.order?.order_status || "publish"}>
        <option key="publish" value="publish">Создан</option>
        <option key="unloaded" value="unloaded">Выгружен</option>
        <option key="in_work" value="in_work">В работе</option>
        <option key="archive" value="archive">В архиве</option>
        <option key="cancel" value="cancel">Отменён</option>
        <option key="completed" value="completed">Выполнен</option>
        <option key="issued" value="issued">Выдан</option>
      </select>
  )

}

function ORDER_MEDIA_LIST(props) {
  let rows = []

  const isError = () => {
    props.errorAction(true)
  }

  for (let row in props.list.items) {
    let r = props.list.items[row]
    let count = r.count
    const url = r.url?.replace('amp;', '').replace('http://choose2/', '')
    const d = url?.split('&')[0].split('/')

    rows.push(

      <div key={row} className="col-12 col-sm-6 col-md-3 col-lg-2">
        <div className="border rounded-1 bg-light mb-4">
          <div className="small p-1 text-center">{d.pop()}</div>

          <ORDER_MEDIA_LIST_THUMB
            url={url}
            isErrorAction={isError}
          />

          <div className="small d-flex p-1">
            {r.title}({r.width + 'x' + r.height})
            <span className="fw-bold ms-auto">x{count}</span>
          </div>
        </div>
      </div>

    )
  }

  return (
    <div className="container">
      <div className="row">
        {rows}
      </div>
    </div>
  )
}

function ORDER_MEDIA_LIST_THUMB(props) {

  const [error, setErrorStatus] = useState(false)

  return (

    error ?
      <div className="w-100 d-flex text-center justify-content-center">
        < QuestionOctagonFill className="m-4" size={30} color="#dc3545" />
      </div >
      :
      <img className="w-100 my-1" onError={() => {
        props.isErrorAction()
        setErrorStatus(true)
      }} src={`https://фотошеф.рф/${props.url}`} alt="" />

  )
}