import { useContext, useState } from "react"
import { ArrowLeftSquare } from "react-bootstrap-icons"
import { AppContext } from "../../App"
import { BS_MODAL } from "../bs-components/bs-modal"
import { UNC_TEXT } from "../fields/fields"

export function LEVEL_OPTIONS(props) {
  const { state } = useContext(AppContext)

  let levelOptions = []
  switch (state.D.storageLevel) {
    case 1:
      levelOptions.push(<ADD_COLLECTION key="add_collections" reloadAction={props.forceUpdate} />)
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

  let data = {
    path: state.D.path,
    user_id: state.user.ID,
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

  return (
    <>
      <div className="btn btn-outline-secondary" onClick={() => { setOpen(true) }}>Добавить сессию</div>
      {open &&
        <BS_MODAL title="Добавить сессию" submitAction={submitAction} closeAction={() => setOpen(false)}>
          <div className="alert alert-info text-center">Код коллекции будет добавлен автоматически</div>
          <UNC_TEXT label="Название" callbackAction={(v) => CB('name', v)} />
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
      label = 'Группы > Сессии'
      break

    case 2:
      label = 'Группы > Сессии > Разделы'
      break

    case 3:
      label = 'Группы > Сессии > Разделы > Фото'
      break

    default:
      label = '/'
      break
  }
  return (
    <span className="storage-level h6 ms-4 mb-0">{label}</span>
  )
}