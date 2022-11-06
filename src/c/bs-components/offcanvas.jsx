

export function OFFCANVAS(props) {

  return (
    <div className="offcanvas offcanvas-end show" style={{ width: props.width ?? '400px' }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">{props.title}</h5>
        <button type="button" className="btn-close" onClick={() => props.closeAction(null)}></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        {props.children}
      </div>
    </div>
  )
}