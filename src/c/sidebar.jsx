import { AspectRatio, Cloud, PersonLinesFill, Speedometer2, Cart } from 'react-bootstrap-icons'

export function LK_SIDEBAR(props) {

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '200px' }}>
      <a href="/" className="mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 d-block">Выбирай</span>
        <span className='text-muted small'>ты можешь выбирать</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <NAV_ITEM icon={<Speedometer2 size={20} />} label="Обзор" {...props} />
        <NAV_ITEM icon={<Cloud size={20} />} label="Хранилище" {...props} />
        <NAV_ITEM icon={<AspectRatio size={20} />} label="Форматы" {...props} />
        <NAV_ITEM icon={<PersonLinesFill size={20} />} label="Профиль" {...props} />
        <NAV_ITEM icon={<Cart size={20} />} label="Заказы" {...props} />
      </ul>

      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>mdo</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li><a className="dropdown-item" href="#">New project...</a></li>
          <li><a className="dropdown-item" href="#">Settings</a></li>
          <li><a className="dropdown-item" href="#">Profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
  )
}

function NAV_ITEM(props) {

  const active = props.part === props.label ? ' active' : ' text-white'

  return (
    <li className="nav-item" onClick={() => props.setPartAction(props.label)}>
      <a href="#" className={`d-flex align-items-center nav-link ${active}`}>
        {props.icon}
        {props.label}
      </a>
    </li>
  )
}