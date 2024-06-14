import { createStore } from 'redux';

// Define the initial state
const initialState = {
  user: null,
};

// Define the action types
export const actionTypes = {
  SET_USER: 'SET_USER',
};

// Define the action creators
export const actions = {
  setUser: (user: any) => ({ type: actionTypes.SET_USER, payload: user }),
};

// Define the reducer
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

export default store;