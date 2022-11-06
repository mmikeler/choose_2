import { useContext, useCallback, useReducer } from "react"
import { AppContext } from "../../App"
import { TEXT, UNC_TEXTAREA, UNC_HIDDEN } from "../fields/fields"
import { Disk } from "../../f/disk"
import { useState } from "react"
import { useEffect } from "react"
import { Alarm, Cart2, Cloud, ExclamationCircle, Stack } from "react-bootstrap-icons"
import { OFFCANVAS } from "../bs-components/offcanvas"
import { useRef } from "react"
import { FORMATS_OPTION } from "./formats_option"
import { LEVEL_OPTIONS } from "./level_options"
import { API, REGISTER_SESSION } from "../../f/fetch"


export function Storage() {
  const { state } = useContext(AppContext)
  let out = state.user._yandex_app_key ? <DISK /> : <GET_YANDEX_APP_KEY_FORM />

  return (
    <>
      <p className="small">Раздел для взаимодействия с хранилищем Ваших работ.</p>
      <hr className="mb-2" />
      {out}
    </>
  )
}

function DISK() {

  const { state, dispatch } = useContext(AppContext)
  const D = new Disk(state.user._yandex_app_key, state.user.ID)

  useEffect(() => {
    D.init().then(res => res.json()).then(res => {
      D.info = res
      dispatch({
        type: 'SET_DISK_CLASS',
        pay: D
      })
    })
  }, [])

  return state.D?.info ? <DISK_CONTENT /> : null
}

function DISK_CONTENT(props) {

  const { state } = useContext(AppContext)
  const [path, setPath] = useState(state.D.path)
  const [resource, setResource] = useState(state.D.resourse)
  const [uploadStatus, setUploadStatus] = useState(false)
  const [_, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    setUploadStatus(true)
    state.D.getResource(path).then(res => res.json()).then(res => {
      setResource(res?._embedded)
      setUploadStatus(false)
    })
  }, [path, _])

  return (
    <>
      {resource && !uploadStatus &&
        <TABLE
          resource={resource}
          path={path}
          forceUpdate={forceUpdate}
          setPath={setPath} />}
      <span className="bg-icon"><Cloud /></span>
    </>
  )
}

function TABLE(props) {
  const { state } = useContext(AppContext)
  const [list, setList] = useState(null)

  const changeResource = (path) => {
    props.setPath(path)
  }
  const createList = () => props.resource.items.map((item, i) => {
    if (state.D.storageLevel >= 3 && item.type === 'dir') { return null }

    return <TABLE_ROW key={i} item={item} changeResource={changeResource} />
  })

  useEffect(() => {
    setList(createList())
  }, [])

  return (
    <>
      <div className="disk-wrapper wrapper">
        <LEVEL_OPTIONS changeResource={changeResource} forceUpdate={props.forceUpdate} />
        <div className="d-flex flex-wrap">{list}</div>
      </div>
    </>
  )
}

function TABLE_ROW(props) {

  const { state } = useContext(AppContext)
  const [open, toggleOpen] = useState(false)
  const [item, setItemData] = useState(props.item)

  if (!item) return null

  const prepareName = (name) => {
    let end = name.split('.')[1]
    if (name.length > 10) {
      return name.substr(0, 10) + '...' + end
    }
    else {
      return name
    }
  }

  return (
    <div className={`item${' ' + item.type}`}
      onContextMenu={(e) => {
        e.preventDefault()
        toggleOpen(true)
      }}
      onDoubleClick={(e) => props.changeResource(item.path, e)}>

      <THUMB item={item} />

      {state.D.storageLevel === 1 && !item?.custom_properties?._CODE &&
        <span className="icon">< ExclamationCircle color="red" size="18" /></span>
      }

      <div className="dir-name text-center pt-1">{prepareName(item.name)}</div>

      {open &&
        <OFFCANVAS title="Настройки папки" closeAction={() => toggleOpen(false)}>
          <RESOURCE_META resource={item} setItemDataAction={setItemData} />
        </OFFCANVAS>}
    </div>
  )
}

export function THUMB(props) {

  const { state } = useContext(AppContext)
  const D = state.D
  const [base64IMG, setIMG] = useState(null)

  useEffect(() => {
    props.item.type === "file" &&
      D.getThumb(props.item.path).then(res => res.json()).then(res => {
        setIMG(res.preview)
      })
  }, [props.item.path])

  return (
    <>
      {
        props.item.type === "dir" ?
          (props.item.name === 'Заказы' ?
            <Cart2 size={60} color={state.style.iconColor} /> :
            <Stack size={60} color={state.style.iconColor} />) :
          <div className="thumb" style={{ backgroundImage: `url(${base64IMG})` }}></div>
      }
    </>
  )
}

function RESOURCE_META(props) {
  const { state } = useContext(AppContext)
  const [meta, setMeta] = useState(props.resource)
  const form = useRef(null)
  const [addedFormats, setAddedFormats] = useState([])

  const saveMeta = () => {
    let data = {}
    form.current.querySelectorAll('input,textarea').forEach(f => {
      data[f.name] = f.value;
    })
    state.D.updateResourceCustomProperties(props.resource.path, data)
      .then(res => res.json())
      .then(res => setMeta(res))
  }

  const toggleFormatAction = (formatName, checked) => {
    let f = [...addedFormats]
    const hasFormat = f.findIndex((item) => item === formatName)
    checked ?
      f.push(formatName)
      :
      hasFormat >= 0 && f.splice(hasFormat, 1)

    setAddedFormats(f);
  }

  const sessionRegAction = () => {
    REGISTER_SESSION(state.user.ID, props.resource.path, (res) => {
      if (res?.code === 'ok') {
        let s = { ...meta }
        s.custom_properties = meta.custom_properties ?? {}
        s.custom_properties._CODE = res.message[0]
        s.custom_properties.ID = res.message[1]
        state.D.updateResourceCustomProperties(props.resource.path, s.custom_properties)
        setMeta(s)
        props.setItemDataAction(s)
      }
    })
  }

  const removeResource = () => {
    window.confirm('Удалить папку и все вложенные материалы?') &&
      state.D.removeResource(props.resource.path)
        .then(res => {
          if (res.status === 204 || res.status === 202) {
            props.setItemDataAction(null)
            API('REMOVE_RESOURCE', state.user.ID, props.resource.path)
          }
        })
  }

  useEffect(() => {
    setAddedFormats(meta?.custom_properties?.formats?.split(',') ?? [])
  }, [meta])

  return (
    <>
      <form ref={form}>

        {state.D.storageLevel === 1 && !meta?.custom_properties?._CODE &&
          <div className="alert alert-warning d-flex flex-wrap">
            <p className="w-100">Ваша сессия ещё не внесена в реестр и не доступна для пользователей</p>
            <div className="btn btn-success btn-small ms-auto" onClick={sessionRegAction}>Зарегистрировать</div>
          </div>
        }

        {meta?.custom_properties?._CODE &&
          <div>
            <div className="meta-id">#{meta.custom_properties.ID}</div>
            <div className="meta-code">
              {meta.custom_properties._CODE}
            </div>
          </div>
        }

        <div className="h6">Заметки</div>

        <UNC_TEXTAREA label="Видите только Вы" name="comment_self" maxLength="100"
          defaultValue={meta.custom_properties?.comment_self} />

        <UNC_TEXTAREA label="Видят Ваши клиенты" name="comment_client" maxLength="100"
          defaultValue={meta.custom_properties?.comment_client} />

        {state.D.storageLevel === 2 &&
          <UNC_HIDDEN name="formats" value={addedFormats.join()} />
        }
      </form>

      <hr />

      <FORMATS_OPTION
        toggleFormatAction={toggleFormatAction}
        value={addedFormats} />

      <button className="btn btn-primary ms-auto" onClick={saveMeta}>Сохранить</button>

      <button className="btn btn-danger mt-auto w-100" onClick={removeResource}>Удалить ресурс</button>
    </>
  )
}

export function DISK_SPACE_BAR(props) {
  const { state } = useContext(AppContext)
  const info = state.D?.info
  const space = info && Math.round(info.used_space / info.total_space * 100)
  return (
    <span className="ms-3 disk-space-badge">{space}%</span>
  )
}

function GET_YANDEX_APP_KEY_FORM() {
  const clientID = '159527890aee42b699bc57022fb0afbc';
  const OAuthUrl = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=' + clientID + '&display=popup'
  return (
    <>
      <p>Получите ключ приложения <a target="_blank" href={OAuthUrl}>ЗДЕСЬ</a> и скопируйте его в поле ниже.</p>
      <TEXT
        label="Яндекс ключ"
        notice="Приватный ключ хранилища"
        fieldkey="_yandex_app_key"
        maxLength="100"
      />
    </>
  )
}

