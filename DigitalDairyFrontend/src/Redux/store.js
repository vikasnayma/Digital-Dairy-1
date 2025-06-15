import { configureStore } from '@reduxjs/toolkit';
import dairyReducer from '../Redux/Slices/dairySlice';
import milkCollectionReducer from '../Redux/Slices/dairySlice'
export const store = configureStore({
  reducer: {
    dairy : dairyReducer,
    milkCollection : milkCollectionReducer,
  },
})