

const apiURL = window.myajax.url

export function UPD_META(userID, meta_key, meta_value, cb = false) {

    let FD = new FormData()
    FD.append('action', 'UPDATE_USER_META')
    FD.append('userID', userID)
    FD.append('meta_key', meta_key)
    FD.append('meta_value', meta_value)

    fetch(apiURL, {
        method: 'POST',
        body: FD,
        //mode: "no-cors"
    })
        .then(res => isJson(res) ? res.json() : "")
        .then(res => cb && cb(res))
        .catch()
}

export function INIT_REQUEST(superkey, cb) {
    let FD = new FormData()
    FD.append('action', 'init')
    FD.append('_SUPERKEY', superkey)
    fetch(apiURL, {
        method: 'POST',
        body: FD,
        //mode: "no-cors"
    })
        .then(res => res.json())
        .then(res => cb && cb(res))
        .catch()
}

export function REGISTER_SESSION(userID, path, cb) {
    let FD = new FormData()
    FD.append('action', 'REGISTER_SESSION')
    FD.append('path', path)
    FD.append('user_id', userID)
    fetch(apiURL, {
        method: 'POST',
        body: FD,
        //mode: "no-cors"
    })
        .then(res => res.json())
        .then(res => cb && cb(res))
        .catch()
}

export function API(action, userID, path, cb = false) {
    let FD = new FormData()
    FD.append('action', action)
    FD.append('path', path)
    FD.append('user_id', userID)
    fetch(apiURL, {
        method: 'POST',
        body: FD,
        //mode: "no-cors"
    })
        .then(res => res.json())
        .then(res => cb && cb(res))
        .catch()
}

export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}