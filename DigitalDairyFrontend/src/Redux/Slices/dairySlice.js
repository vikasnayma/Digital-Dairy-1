import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  dairy: [],
  milkCollection: [],
  milkExportation:[],
  preMilkBookings : [],
  payments : [],
  milkRates : [],
  allFarmers : [],
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
      setMilkRates: (state , action) => {
        state.milkRates = action.payload;
      },
      setPayments: (state , action) => {
        state.payments = action.payload;
      },
      setAllFarmers :(state , action) => {
        state.allFarmers = action.payload;
      },
      setMilkCollection: (state,action) => {
        state.milkCollection = action.payload;
      },
      setMilkExportation: (state,action) => {
        state.milkExportation = action.payload;
      },
      setPreMilkBookings: (state,action) => {
        state.preMilkBookings = action.payload;
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


export const {  setLoading, setError , setSuccess , setDairy , setMilkCollection , setPreMilkBookings ,setMilkExportation , setAllFarmers , setPayments , setMilkRates } = dairySlice.actions;

export default dairySlice.reducer;