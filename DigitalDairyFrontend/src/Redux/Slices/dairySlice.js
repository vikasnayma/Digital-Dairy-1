import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  dairy: [],
  milkCollection: [],
  loading: false,
  error: null,
  success: false,
};

export const dairySlice = createSlice({
    name: 'dairy',
    initialState,
    reducers: {
      setDairy: (state , action) => {
        state.dairy = action.payload;
      },
      setMilkCollection: (state,action) => {
        state.milkCollection = action.payload;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setSuccess: (state, action) => {
        state.success = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      }
    },
  });


export const {  setLoading, setError , setSuccess , setDairy , setMilkCollection  } = dairySlice.actions;

export default dairySlice.reducer;