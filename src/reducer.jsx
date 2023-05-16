import { isJson, UPD_META } from "./f/fetch"


export function reducer(state, action) {
    const { type, pay } = { ...action }

    switch (type) {

        case "LOG_IN":
            for (let meta_key in pay) {
                let meta_value = pay[meta_key]
                state.user[meta_key] = isJson(meta_value) ? JSON.parse(meta_value) : meta_value
            }
            state.user = pay
            break

        case "UPDATE_USER_META":
            state.user[pay.meta_key] = pay.meta_value
            break

        case "SET_DISK_CLASS":
            state.D = pay
            break

        case 'SET_ORDERS':
            state.orders = pay
            break;

        case 'SET_ORDER_STATUS':
            const ind = state.orders.findIndex((order) => { return order.ID === pay.id })
            state.orders[ind].order_status = pay.newStatus
            break;

        default:
            break;
    }

    return { ...state }
}