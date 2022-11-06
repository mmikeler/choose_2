import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../App"
import { UPD_META } from "../../f/fetch"


export function TEXT(props) {

  const { state, dispatch } = useContext(AppContext)
  const v = state.user[props.fieldkey] || ''

  const change = (e) => {
    dispatch({
      type: 'UPDATE_USER_META',
      pay: {
        meta_key: props.fieldkey,
        meta_value: e.target.value
      }
    })
  }

  const onBlur = (e) => {
    UPD_META(state.user.ID, props.fieldkey, e.target.value)
  }

  return (
    <>
      <div className="input-group">
        <span className="input-group-text">{props.label}</span>
        <input className="form-control" onChange={change} onBlur={onBlur} type="text" value={v} {...props} />
      </div>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </>
  )
}

// ================================ UNCONTROLED FIELDS VARIATION

export function UNC_TEXT(props) {

  const [value, setValue] = useState(props.defaultValue || '')

  useEffect(() => {
    props.callbackAction && props.callbackAction(value)
  }, [value])

  return (
    <>
      <div className="input-group">
        <span className="input-group-text">{props.label}</span>
        <input className="form-control" onChange={(e) => setValue(e.target.value)} type="text" value={value} />
      </div>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </>
  )
}

export function UNC_TEXTAREA(props) {

  const [value, setValue] = useState(props.defaultValue || '')

  useEffect(() => {
    props.callBackAction && props.callBackAction(value)
  }, [value])

  return (
    <>
      <div className="input-field">
        <label className="input-label">{props.label}</label>
        <textarea className="form-control" onChange={(e) => setValue(e.target.value)} type="text" defaultValue={value}></textarea>
      </div>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </>
  )
}

export function UNC_HIDDEN(props) {
  return (
    <input name={props.name} type="hidden" value={props.value} />
  )
}

export function UNC_CHECKBOX(props) {

  return (
    <div className="form-check form-switch">
      <input name={props.name} checked={props.checked} className="form-check-input" type="checkbox" role="switch" />
    </div>
  )
}