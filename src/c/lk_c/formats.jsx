import { useEffect } from "react"
import { useContext } from "react"
import { useState, useRef } from "react"
import { CurrencyExchange, Fonts, X, XCircle } from "react-bootstrap-icons"
import { AppContext } from "../../App"
import { UPD_META } from "../../f/fetch"


export function FORMATS() {
  const { state, dispatch } = useContext(AppContext)
  const form = useRef(null)

  const submit = (e) => {
    e.preventDefault()
    let data = {}
    form.current.querySelectorAll('input,textarea').forEach(f => {
      data[f.name] = f.value;
    })
    let formats = [...state.user.formats]

    // Обновляем формат, если такой уже есть
    const formatExistsIndex = formats.findIndex((f) => f.title === data.title)

    if (formatExistsIndex >= 0) {
      formats[formatExistsIndex] = data
    }
    // И добавляем, если нет
    else {
      formats.push(data)
    }

    dispatch({
      type: 'UPDATE_USER_META',
      pay: {
        meta_key: 'formats',
        meta_value: formats
      }
    })
    UPD_META(state.user.ID, 'formats', JSON.stringify(formats))

    form.current.reset()
  }

  const remove = (ind) => {
    let formats = [...state.user.formats]
    formats.splice(ind, 1)
    dispatch({
      type: 'UPDATE_USER_META',
      pay: {
        meta_key: 'formats',
        meta_value: formats
      }
    })
    UPD_META(state.user.ID, 'formats', JSON.stringify(formats))
  }

  let table = state.user.formats && state.user.formats?.map((row, i) => {
    return (
      <tr key={i}>
        <td>{row.title}</td>
        <td>{row.width}</td>
        <td>{row.height}</td>
        <td>{row.cost}</td>
        <td><span className="small text-muted">{row.comment}</span></td>
        <td>
          {row.title !== 'Исходник' ? <span className="cursor-pointer" onClick={() => remove(i)}>
            <XCircle size={15} color="red" />
          </span> : "Постоянный**"}
        </td>
      </tr>
    )
  })

  return (
    <>
      <p className="small">Раздел для добавления и редактирования форматов Ваших работ.</p>
      <hr className="mb-2" />

      <table className="table table-hover table-striped mb-5">
        <thead>
          <tr>
            <td>Название</td>
            <td>Ширина, см</td>
            <td>Высота, см</td>
            <td>Стоимость, руб</td>
            <td>Комментарий</td>
            <td>Опции</td>
          </tr>
        </thead>
        <tbody>
          {table?.length < 1 ? <tr><td align="center" colSpan={5}>Список пуст</td></tr> : table}
        </tbody>
      </table>

      <form ref={form} onSubmit={submit}>
        <h6 className="mb-3">Добавить формат*</h6>
        <div className="row">
          <div className="col-4">
            <div className="input-group mb-3">
              <span className="input-group-text"><Fonts size={20} /></span>
              <input required name="title" placeholder="Название" type="text" className="form-control" />
            </div>
          </div>
          <div className="col-4">
            <div className="input-group mb-3">
              <input required name="width" type="text" placeholder="ширина, см" className="form-control" />
              <span className="input-group-text">x</span>
              <input required name="height" type="text" placeholder="высота, см" className="form-control" />
            </div>
          </div>
          <div className="col-2">
            <div className="input-group mb-3">
              <span className="input-group-text"><CurrencyExchange /></span>
              <input required name="cost" type="text" placeholder="Цена(руб)" className="form-control" />
            </div>
          </div>
          <div className="col-2">
            <button className="btn btn-primary w-100">Добавить</button>
          </div>
          <div className="col-10 mb-3">
            <textarea className="form-control" name="comment" rows="3" placeholder="Ваш комментарий к формату"></textarea>
          </div>
        </div>
      </form>

      <hr />
      <div className="small">* Чтобы изменить формат добавьте формат с таким же названием и новыми настройками</div>
      <div className="small">** Постоянный формат можно изменить, но нельзя удалить</div>
    </>
  )
}