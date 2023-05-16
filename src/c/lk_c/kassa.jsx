import { useContext } from "react";
import { AppContext } from "../../App";
import { CHECKBOX } from "../fields/fields";


export function KASSA() {
  const { state, dispatch } = useContext(AppContext)

  return (
    state.user._ykassa_app_success ? <K /> : <M />
  )
}

function M() {

  return (
    <>
      <div className="alert alert-warning">
        <p>Вы пока не подключили кассу к своему аккаунту. Сделайте это, чтобы иметь возможность принимать платежи онлайн.</p>

        Для этого:
        <ol>
          <li>Зарегистрируйтесь на сайте <a target="_blank" rel="noreferrer" href="https://yookassa.ru/joinups/?source=fotoshef">ЮКасса</a></li>
          <li>Создайте на сайте ЮКасса свой магазин</li>
          <li>Подключите наше приложение к своему новому или существующему магазину пройдя по <a
            target="_blank"
            rel="noreferrer"
            href="https://yookassa.ru/oauth/v2/authorize?client_id=ncqjj8f59i5gnrb6399gih29j1h28q10&response_type=code&state=confirm_ykassa">
            этой ссылке
          </a>. Важно выбрать только один магазин, через который Вы планируете работать.</li>
        </ol>

      </div>
    </>
  )
}

function K() {

  return (
    <>
      <div className="alert alert-success text-center">Касса подключена</div>
      <fieldset>
        <legend>Настройки кассы</legend>

        <CHECKBOX options={{
          fieldkey: 'use_payment',
          label: 'Принимать оплату через сервис'
        }} />

      </fieldset>
    </>
  )
}