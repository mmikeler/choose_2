import { TEXT } from "../fields/fields";


export function Profile() {
  return (
    <>
      <p className="text-muted">Страница предназначена для изменения Ваших публичных и приватных данных.</p>
      <hr className="mb-4" />
      <div className="h6 mb-0">Публичные данные</div>
      <p className="text-muted small mb-4">Данные, в каком либо объеме, доступные для просмотра другим пользователям сервиса.</p>
      <div className="row mb-4">
        <div className="col-6">
          <TEXT
            label="Имя"
            fieldkey="real_name"
            maxLength="10"
          />
        </div>
      </div>

      <div className="h6 mb-0">Приватные данные</div>
      <p className="text-muted small mb-4">Данные, использующиеся системой или для общения с поддержкой.</p>
      <div className="row">
        <div className="col-6">
          <TEXT
            label="Номер телефона"
            notice="Номер для связи с поддержкой. Может совпадать с рабочим."
            fieldkey="phone"
            maxLength="20"
          />
        </div>

      </div>
    </>
  )
}