import '../css/lk.css'
import { useState } from 'react'
import { LK_SIDEBAR } from './sidebar'
import { Dashboard } from './lk_c/dashboard'
import { DISK_SPACE_BAR, Storage } from './lk_c/storage'
import { Profile } from './lk_c/profile'
import { FORMATS } from './lk_c/formats'
import { ORDERS } from './lk_c/orders/orders'
import { SUPPORT } from './lk_c/support'
import { KASSA } from './lk_c/kassa'

export function LK(props) {

  const [part, setPart] = useState('Обзор')

  return (
    <div className='lk page d-flex flex-no-wrap'>
      <LK_SIDEBAR part={part} setPartAction={setPart} />
      <LK_BODY part={part} />
    </div>
  )
}

function LK_BODY(props) {
  let body = null
  switch (props.part) {

    case 'Хранилище':
      body = <Storage />
      break

    case 'Профиль':
      body = <Profile />
      break

    case 'Форматы':
      body = <FORMATS />
      break

    case 'Заказы':
      body = <ORDERS />
      break

    case 'Поддержка':
      body = <SUPPORT />
      break

    case 'Касса':
      body = <KASSA />
      break

    default:
      body = <Dashboard />
      break
  }
  return (
    <div className="px-5 py-3 w-100 lk-body position-relative">
      <div className="h4">
        {props.part}
        {props.part === 'Хранилище' && <DISK_SPACE_BAR />}
      </div>
      {body}
    </div>
  )
}