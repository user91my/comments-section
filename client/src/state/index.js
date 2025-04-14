import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
};

// `createSlice` returns an object with two keys:-
// -- 'actions' : action creators used to dispatch actions
// -- 'reducer' : represents the store's reducer function
export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
  },
});

// Exports action creators (whose names are determined by the keys provided
// in the 'reducers' object within 'globalSlice').
export const { setComments } = formSlice.actions;

// Exports reducer functions.
// To be imported by 'client\src\index.js' as 'formReducer'.
// (Note: it can be imported as any custom variable name, in this case 'formReducer').
export default formSlice.reducer;
