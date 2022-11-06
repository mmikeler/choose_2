import { useContext } from "react"
import { AppContext } from "../../App"
import { UNC_CHECKBOX } from "../fields/fields"


export function FORMATS_OPTION(props) {
  const { state, dispatch } = useContext(AppContext)
  const addedFormats = props.value
  const formats = state.user.formats && state.user.formats.map((row, i) => {
    const checked = addedFormats.findIndex(n => n === row.title) >= 0 ? true : false
    return (
      <tr key={i}>
        <td>{row.title}</td>
        <td align="center">{row.width + 'x' + row.height}</td>
        <td align="center">{row.cost}</td>
        <td>
          <div className="form-check form-switch">
            <input
              onChange={(e) => props.toggleFormatAction(row.title, e.target.checked)}
              name={row.title}
              checked={checked}
              className="form-check-input" type="checkbox" role="switch" />
          </div>
        </td>
      </tr>
    )
  })

  if (state.D.storageLevel !== 2) return null

  return (
    <>
      <div className="h6">Форматы ({addedFormats?.length})</div>

      {addedFormats && addedFormats.length === 0 &&
        <div className="alert alert-warning text-center">Вы ещё не добавили ни одного формата</div>
      }

      <table className="table table-hover table-striped mb-5">
        <thead>
          <tr>
            <td>Название</td>
            <td align="center">Размер, см</td>
            <td align="center">Стоимость, руб</td>
            <td align="center">Добавлен</td>
          </tr>
        </thead>
        <tbody>
          {formats.length < 1 ? <tr><td align="center" colSpan={4}>Список пуст</td></tr> : formats}
        </tbody>
      </table>
      <hr />
    </>
  )
}