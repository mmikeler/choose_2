

export function BS_MODAL(props) {

  return (
    <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props.title}</h5>
            <button type="button" onClick={props.closeAction} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {props.children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={props.submitAction}>Добавить</button>
          </div>
        </div>
      </div>
    </div>
  )
}