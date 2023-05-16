

export function OFFCANVAS(props) {

  return (
    <>
      <div className="offcanvas offcanvas-end show" style={{ width: props.width ?? '400px' }}>
        <div className="offcanvas-header p-0">
          <h5 className="offcanvas-title">{props.title}</h5>
          <div className="offcanvas-header-body me-auto px-3">{props.headerBodyContent}</div>
          <div className="btn-close-wrapper" onClick={() => props.closeAction(null)}>
            <button type="button" className="btn-close p-0 fs-5 m-auto"></button>
          </div>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {props.children}
        </div>
      </div>
      <div className="offcanvas-backdrop fade show"></div>
    </>
  )
}