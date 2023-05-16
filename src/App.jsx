import { useReducer } from 'react';
import { createContext } from 'react';
import './App.css';
import { reducer } from './reducer';

// c
import { LK } from './c/lk';
import { useEffect } from 'react';
import { INIT_REQUEST } from './f/fetch';
import { API } from './f/api';


export let AppContext = createContext(null)

function App() {

  const [state, dispatch] = useReducer(reducer, {
    ajaxUrl: window.myajax.url,
    API: new API(window.myajax.url),
    orders: [],
    user: {
      _SUPERKEY: 'demokey2',
      ID: 1,
      formats: []
    },
    style: {
      iconColor: '#fdefb2',
      iconBorderColor: '#d1c27f',
    }

  })

  useEffect(() => {

    INIT_REQUEST(state.user._SUPERKEY, (res) => {
      dispatch({
        type: 'LOG_IN',
        pay: res
      })
    })

  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <LK />
    </AppContext.Provider>
  );
}

export default App;