import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Search } from "react-bootstrap-icons";
import { AppContext } from "../../../App";
import { SELECT, UNC_DATE_FROMTO, UNC_TEXT } from "../../fields/fields";
import { POST_STATUS } from "./orders";
import { UNLOADED } from "./unloaded";

export function ORDERS_FILTERS() {

  const { state, dispatch } = useContext(AppContext)
  const submitBtn = useRef()

  const submit = (e) => {
    e.preventDefault();
    state.API.getOrders(e.target, (res) => {
      dispatch({
        type: 'SET_ORDERS',
        pay: res
      })
    })
  }

  useEffect(() => {
    submitBtn.current.click()
  }, [])

  return (
    <>

      <form onSubmit={submit} className="bg-light bg-gradient p-3 d-flex flex-wrap">
        <ORDERS_SEARCH_FIELDS />
        <div className="ms-auto d-flex align-items-center align-self-baseline">
          <UNLOADED o={state.orders} />
          <button type="button" className="btn btn-secondary btn-sm align-self-baseline mx-1" onClick={(e) => e.target.closest('form').reset()}>Сброс</button>
          <button ref={submitBtn} className="btn btn-primary btn-sm align-self-baseline mx-1">Найти</button>
        </div>

      </form>

    </>
  )
}

function ORDERS_SEARCH_FIELDS() {

  return (
    <>
      <UNC_TEXT type="number" size="input-group-sm" mod="col-3 mb-1 px-1" name="orderID" label="ID" />
      <UNC_TEXT type="number" size="input-group-sm" mod="col-3 mb-1 px-1" name="sessionID" label="ID Сессии" />
      <UNC_TEXT size="input-group-sm" mod="col-4 mb-1 px-1" name="client_name" label="Имя" />

      <div className="col-2">
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text">Статус</span>
          <SELECT
            name="order_status"
            onChange={() => { }}
            options={[
              ['any', 'Любой'],
              ['publish', <POST_STATUS s="publish" />],
              ['in_work', <POST_STATUS s="in_work" />],
              ['unloaded', <POST_STATUS s="unloaded" />],
              ['completed', <POST_STATUS s="completed" />],
              ['issued', <POST_STATUS s="issued" />],
              ['cancel', <POST_STATUS s="cancel" />],
              ['archive', <POST_STATUS s="archive" />],
            ]} />
        </div>
      </div>

      <UNC_DATE_FROMTO size="input-group-sm" mod="col-5 mb-1 px-1" />

    </>
  )
}