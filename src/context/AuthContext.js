import React, {useReducer, createContext} from 'react';
export const AuthContext = createContext();
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE = 'UPDATE';

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      //   localStorage.setItem('userContext', JSON.stringify(action.payload));
      return action.payload;
    case LOGOUT:
      //   localStorage.clear();
      return null;
    default:
      return state;
  }
};
export const AthorContext = props => {
  const [state, dispatch] = useReducer(reducer, '');
  return (
    <AuthContext.Provider value={{state, dispatch}}>
      {props.children}
    </AuthContext.Provider>
  );
};
