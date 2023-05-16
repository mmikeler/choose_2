import { useContext } from 'react'
import { AspectRatio, Cloud, PersonLinesFill, Speedometer2, Cart, InfoSquare, CurrencyExchange } from 'react-bootstrap-icons'
import { AppContext } from '../App'

export function LK_SIDEBAR(props) {
  const { state } = useContext(AppContext)

  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 text-bg-dark vh-100" style={{ width: '200px' }}>
      <a href="/" className="mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 d-block">Мастерская</span>
        <span className='text-muted small'>фотошеф.рф</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <NAV_ITEM icon={<Speedometer2 size={20} />} label="Обзор" {...props} />
        <NAV_ITEM icon={<Cloud size={20} />} label="Хранилище" {...props} />
        <NAV_ITEM icon={<AspectRatio size={20} />} label="Форматы" {...props} />
        <NAV_ITEM icon={<PersonLinesFill size={20} />} label="Профиль" {...props} />
        <NAV_ITEM icon={<Cart size={20} />} label="Заказы" {...props} />
        <hr />
        <NAV_ITEM icon={<CurrencyExchange size={20} />} label="Касса" {...props} />
        <NAV_ITEM icon={<InfoSquare size={20} />} label="Поддержка" {...props} />
      </ul>

      <hr />
      <span className="fs-6">Ваш ID: {state.user.ID}</span>
      <span className="fs-6">{state.user.real_name}</span>
    </div>
  )
}

function NAV_ITEM(props) {

  const active = props.part === props.label ? ' active' : ' text-white'

  return (
    <li className="nav-item" onClick={() => props.setPartAction(props.label)}>
      <div className={`d-flex align-items-center nav-link ${active}`}>
        {props.icon}
        <span>{props.label}</span>
      </div>
    </li>
  )
}