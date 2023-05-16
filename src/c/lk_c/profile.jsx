import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../App";
import { UPD_META } from "../../f/fetch";
import { CHECKBOX, SELECT, TEXT, TEXTAREA } from "../fields/fields";


export function Profile() {

  const { state } = useContext(AppContext)

  return (
    <>
      <p className="text-muted">Страница предназначена для изменения Ваших публичных и приватных данных.</p>
      <hr className="mb-4" />

      <div className="h5 mb-0">Публичные данные</div>
      <p className="text-muted small mb-4">Данные, в каком либо объеме, доступные для просмотра другим пользователям сервиса.</p>
      <div className="row mb-4">
        <div className="col-12">
          <div className={`alert alert-${state.user.catalog_on === 1 ? 'success' : 'danger'}`}>
            <CHECKBOX
              options={{
                fieldkey: 'catalog_on',
                label: "Показывать мой профиль в каталоге сервиса",
                size: 'lg'
              }}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="h6">Обложка</div>
          <div className="border">
            <Avatar />
          </div>
        </div>
        <div className="col-6">
          <div className="h6">Контакты</div>
          <SELECT
            name="master_business_type"
            notice="Выберите, как Вы ведёте бизнес"
            options={[
              ['1', 'Фотограф'],
              ['2', 'Фото-студия'],
            ]} />
          <TEXT
            label="Имя"
            fieldkey="real_name"
            maxLength="100"
            notice="Имя или название организации"
          />
          <h6>Контакты</h6>
          <TEXT
            label="ВКонтакте"
            fieldkey="vk_link"
            notice="Начиная с https://"
            maxLength="100"
          />
          <TEXT
            label="Telegram"
            fieldkey="tg_link"
            notice="Начиная с https://"
            maxLength="100"
          />
          <TEXT
            label="Номер телефона"
            fieldkey="public_phone"
            notice="С кодом страны"
            maxLength="100"
          />
          <TEXT
            label="Город"
            fieldkey="city"
            notice="Полное официальное название"
            maxLength="100"
          />
        </div>

        <div className="h6">Коротко о себе</div>
        <div className="col-12 mb-4">
          <TEXTAREA
            name="about_us"
            maxLength="500"
            rows="5"
          />
        </div>

        <div className="h6">Галерея работ</div>
        <div className="col-12 mb-5">
          <Gallery />
        </div>

        <div className="h6">Реквизиты</div>
        <div className="alert alert-info">Эти данные необходимо указать для идентификации Вас как клиента кассы, если Вы решите принимать платежи через наш сервис.</div>
        <div className="row row-cols-2 mb-4">
          <div className="col">
            <span className="text-red">ОБРАЗЕЦ</span>
            <ul>
              <li><b>Владелец:</b> Фото Шеф Шефович</li>
              <li><b>Наименование банка:</b> МОСКОВСКОЕ ОТДЕЛЕНИЕ N2323 ПАО СБЕРБАНК</li>
              <li><b>Номер банковского счёта:</b> 11111111111111111111</li>
              <li><b>БИК:</b> 222222222</li>
              <li><b>ИНН:</b>33333333333</li>
            </ul>
          </div>
          <div className="col">
            <TEXTAREA
              name="requisites"
              maxLength="500"
              rows="7"
            />
          </div>
        </div>

      </div>

      <div className="h5 mb-0 mt-5">Приватные данные</div>
      <p className="text-muted small mb-4">Данные, использующиеся системой или для общения с поддержкой.</p>
      <div className="row mb-5">
        <div className="col-6">
          <TEXT
            label="Номер телефона"
            notice="Номер для связи с поддержкой. Может совпадать с публичным."
            fieldkey="phone"
            maxLength="30"
          />
        </div>
      </div>
    </>
  )
}

function Avatar() {
  const { state } = useContext(AppContext)
  const [isError, setIsError] = useState(false)

  const onError = () => {
    setIsError(true)
  }

  return (
    !isError ?
      <img onError={onError} className="d-block m-auto" src={`https://фотошеф.рф/media?p=assets/avatar.jpg&d=${state.user.ID + 33}`} alt="" />
      :
      <div className="alert alert-warning">
        Чтобы добавить аватар для Вашего профиля:<br />
        1. Добавьте в папке приложения в Вашем хранилище папку "assets", если её ещё нет<br />
        2. Добавьте в папку "assets" изображение с названием "avatar.jpg"</div>
  )
}

function Gallery() {
  const { state } = useContext(AppContext)
  const [isError, setIsError] = useState(false)

  const onError = () => {
    setIsError(true)
  }

  const list = [];
  for (let i = 1; i <= 10; i++) {
    list.push(
      <div key={i} className="col p-0">
        <div className="col gallery-item ratio ratio-1x1" style={{ backgroundImage: `url(https://фотошеф.рф/media?p=assets/gallery/${i}.jpg&d=${state.user.ID + 33})` }}></div>
      </div>
    )
  }

  return (
    !isError ?
      <div className="row">
        <img style={{ display: 'none' }} onError={onError} src={`https://фотошеф.рф/media?p=assets/gallery/1.jpg&d=${state.user.ID + 33})`} alt="" />
        <div className="row row-cols-10">{list}</div>
      </div>
      :
      <div className="alert alert-warning">
        Чтобы добавить фото в галерею:<br />
        1. Добавьте в папке приложения в Вашем хранилище папку "assets", если её ещё нет<br />
        2. Добавьте в папку "assets" папку "gallery" <br />
        3. Загрузите в папку "gallery" изображения в формате "jpg" и присвойте им, в качестве названий, номера от 1 до 10.
      </div>
  )
}