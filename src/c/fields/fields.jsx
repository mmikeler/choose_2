import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../App"
import { UPD_META } from "../../f/fetch"


export function TEXT(props) {

  const { state, dispatch } = useContext(AppContext)
  const v = state.user[props.fieldkey] || (props.defaultValue ?? '')

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
    e.target.value.length > 0 &&
      UPD_META(state.user.ID, props.fieldkey, e.target.value)
  }

  return (
    <>
      <div className="input-group">
        <span className="input-group-text">{props.label}</span>
        <input className="form-control" onChange={change} onBlur={onBlur} type="text" defaultValue={v} {...props} />
      </div>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </>
  )
}

export function TEXTAREA(props) {
  const { state, dispatch } = useContext(AppContext)

  const change = (e) => {
    dispatch({
      type: 'UPDATE_USER_META',
      pay: {
        meta_key: props.name,
        meta_value: e.target.value
      }
    })
  }

  const onBlur = (e) => {
    e.target.value.length > 0 &&
      UPD_META(state.user.ID, props.name, e.target.value)
  }

  return (
    <>
      <div className="input-field">
        {props.label && <label className="input-label">{props.label}</label>}
        <textarea
          className="form-control"
          onBlur={onBlur}
          onChange={change}
          {...props}
          defaultValue={state.user[props.name]}></textarea>
      </div>
      <p className="mb-3 text-muted small d-block">
        {props.notice}
        <span className="float-end">{props.maxLength - (state.user[props.name]?.length ?? 0)}</span>
      </p>
    </>
  )
}

export function SELECT(props) {
  const { state, dispatch } = useContext(AppContext)

  const options = props.options ?
    props.options.map((option, ind) => {
      return <option value={option[0]} key={ind}>{option[1]}</option>
    }) :
    []

  const onChange = (e) => {
    dispatch({
      type: 'UPDATE_USER_META',
      pay: {
        meta_key: props.name,
        meta_value: e.target.value
      }
    })
  }

  const onBlur = (e) => {
    e.target.value.length > 0 &&
      UPD_META(state.user.ID, props.name, e.target.value)
  }

  return (
    <>
      <select
        className="form-select form-select"
        name={props.name}
        value={state.user[props.name]}
        onChange={onChange}
        onBlur={onBlur}>
        {options}
      </select>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </>
  )
}

export function RADIOSET(props) {

  const { state, dispatch } = useContext(AppContext)

  const list = props.set.map((r) => {
    return (
      <div className="form-check">
        <input className="form-check-input" type="radio" name={r.name} id={r.label} />
        <label className="form-check-label" for={r.label}>
          {r.label}
        </label>
      </div>
    )
  })

  return list;
}

export function CHECKBOX(props) {

  const { state, dispatch } = useContext(AppContext)
  const fieldID = "id" + Math.random().toString(16).slice(2)
  const o = props.options
  const checked = state.user[o.fieldkey] == 1 ? true : false

  const onchange = (e) => {
    const val = e.target.checked ? 1 : 0
    dispatch({
      type: 'UPDATE_USER_META',
      pay: {
        meta_key: o.fieldkey,
        meta_value: val
      }
    })
    UPD_META(state.user.ID, o.fieldkey, val)
  }

  return (
    <div className="form-check form-switch">
      <input onChange={onchange} className={`form-check-input ${o.size}`} type="checkbox" role="switch" id={fieldID} checked={checked} />
      <label className="form-check-label" htmlFor={fieldID}>{o.label}</label>
    </div>
  )
}

// ================================ UNCONTROLED FIELDS VARIATION

export function UNC_TEXT(props) {

  const change = (e) => {
    props.callBackAction && props.callBackAction(e.target.value)
  }

  return (
    <div className={props.mod}>
      <div className={`input-group mb-3 ${props.size}`}>
        <span className="input-group-text">{props.label}</span>
        <input name={props.name} onChange={change} className="form-control" type={props.type ?? 'text'} />
      </div>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </div>
  )
}

export function UNC_TEXTAREA(props) {

  const [value, setValue] = useState(props.defaultValue ?? '')

  useEffect(() => {
    props.callBackAction && props.callBackAction(value)
  }, [value])

  return (
    <>
      <div className="input-field">
        <label className="input-label">{props.label}</label>
        <textarea name={props.name} className="form-control" onChange={(e) => setValue(e.target.value)} type="text" defaultValue={value}></textarea>
      </div>
      <p className="mb-3 text-muted small d-block">{props.notice}</p>
    </>
  )
}

export function UNC_SELECT(props) {
  const { dispatch } = useContext(AppContext)
  const [value, setValue] = useState(props.value)

  const options = props.options ?
    props.options.map((option, ind) => {
      return <option value={option[0]} key={ind}>{option[1]}</option>
    }) :
    []

  const onChange = (e) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    props.value !== value && props?.onChange(value)
  }, [value])

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <select className="form-select form-select-sm" name={props.name} value={value} onChange={onChange}>
      {options}
    </select>
  )
}

export function UNC_DATE_FROMTO(props) {

  return (
    <div className={props.mod}>
      <div className={`input-group ${props.size}`}>
        <span className="input-group-text">Дата от</span>
        <input name="date_from" type="date" className="form-control" defaultValue={props?.date_from ?? ''} />
        <span className="input-group-text">до</span>
        <input name="date_to" type="date" className="form-control" defaultValue={props?.date_to ?? ''} />
      </div>
    </div>
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