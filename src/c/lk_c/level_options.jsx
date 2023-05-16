import { useContext, useState } from "react"
import { ArrowLeftSquare } from "react-bootstrap-icons"
import { AppContext } from "../../App"
import { BS_MODAL } from "../bs-components/bs-modal"
import { UNC_TEXT } from "../fields/fields"

export function LEVEL_OPTIONS(props) {
  const { state } = useContext(AppContext)

  let levelOptions = []
  switch (state.D.storageLevel) {
    case 0:
      levelOptions.push(<ADD_DIRECTORY key="add_dir" reloadAction={props.forceUpdate} />)
      break

    case 1:
      levelOptions.push(<ADD_COLLECTION key="add_collections" reloadAction={props.forceUpdate} />)
      break

    case 2:
      levelOptions.push(<ADD_DIRECTORY key="add_part" reloadAction={props.forceUpdate} />)
      break

    default:
      break;
  }

  return (
    <div className="top-bar w-100 mb-3">
      {state.D.storageLevel > 0 &&
        <ArrowLeftSquare
          className="cursor-pointer"
          size="30"
          onClick={() => props.changeResource(state.D.backPath)} />
      }
      <STORAGE_LEVEL level={state.D.storageLevel} />
      <div className="level-options ms-auto">
        {levelOptions}
      </div>
    </div>
  )
}

function ADD_COLLECTION(props) {
  const { state } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const isOpenDir = state.D.path.includes('Заказы') || state.D.path.includes('assets') ? true : false

  let data = {
    path: state.D.path,
  }
  const CB = (name, value) => {
    data[name] = value
  }

  const submitAction = () => {
    console.log(data);
    state.D.addResource(data).then(res => res.json()).then(res => {
      if (res?.href) {
        props.reloadAction()
      }
    })
  }

  if (isOpenDir) return null

  return (
    <>
      <div className="btn btn-outline-secondary btn-sm" onClick={() => { setOpen(true) }}>Добавить сессию</div>
      {open &&
        <BS_MODAL title="Добавить сессию" submitAction={submitAction} closeAction={() => setOpen(false)}>
          <div className="alert alert-info text-center">Код коллекции будет добавлен автоматически</div>
          <UNC_TEXT label="Название" callBackAction={(v) => CB('name', v)} />
        </BS_MODAL>
      }
    </>
  )
}

function ADD_DIRECTORY(props) {
  const { state } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const isOpenDir = state.D.path.includes('Заказы') || state.D.path.includes('assets') ? true : false


  let data = {
    path: state.D.path,
  }
  const CB = (name, value) => {
    data[name] = value
  }

  const submitAction = () => {
    state.D.addResource(data).then(res => res.json()).then(res => {
      if (res?.href) {
        props.reloadAction()
      }
    })
  }

  if (isOpenDir) return null

  return (
    <>
      <div className="btn btn-outline-secondary btn-sm" onClick={() => { setOpen(true) }}>Добавить папку</div>
      {open &&
        <BS_MODAL title="Добавить папку" submitAction={submitAction} closeAction={() => setOpen(false)}>
          <UNC_TEXT label="Название" callBackAction={(v) => CB('name', v)} />
        </BS_MODAL>
      }
    </>
  )
}

function STORAGE_LEVEL(props) {
  let label = '';
  switch (props.level) {
    case 0:
      label = 'Группы'
      break

    case 1:
      label = 'Группы > Коллекции'
      break

    case 2:
      label = 'Группы > Коллекции > Разделы'
      break

    case 3:
      label = 'Группы > Коллекции > Разделы > Фото'
      break

    default:
      label = '/'
      break
  }
  return (
    <span className="storage-level h6 ms-4 mb-0">{label}</span>
  )
}