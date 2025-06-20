import { configureStore } from '@reduxjs/toolkit';
import dairyReducer from '../Redux/Slices/dairySlice';
import milkCollectionReducer from '../Redux/Slices/dairySlice'
import preMilkBookingsReducer from '../Redux/Slices/dairySlice'
import milkExportationReducer from '../Redux/Slices/dairySlice'
import AllFarmersReducer from '../Redux/Slices/dairySlice'
import paymentsReducer from '../Redux/Slices/dairySlice'




export const store = configureStore({
  reducer: {
    dairy : dairyReducer,
    milkCollection : milkCollectionReducer,
    preMilkBookings : preMilkBookingsReducer,
    milkExportation : milkExportationReducer,
    allFarmers : AllFarmersReducer,
    payments : paymentsReducer,
  },
})