import { useReducer } from 'react';
import { createContext } from 'react';
import './App.css';
import { reducer } from './reducer';

// c
import { LK } from './c/lk';
import { useEffect } from 'react';
import { INIT_REQUEST } from './f/fetch';


export let AppContext = createContext(null)

function App() {

  const [state, dispatch] = useReducer(reducer, {
    ajaxUrl: window.myajax.url,
    user: {
      _SUPERKEY: 'demokey',
      ID: 2,
      formats: []
    },
    style: {
      iconColor: 'cornflowerblue',
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