import { setDairy , setError , setSuccess , setLoading , setMilkCollection } from './dairySlice';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const createDairy = (dairyDetails) => async(dispatch) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("authUser"));
    const operatorId = user.userId;
    dispatch(setLoading(true));
    try {
        const response = await axios.post(`${BASE_URL}/dairy-details/${operatorId}` , dairyDetails ,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
    });
        console.log(response.data);
        dispatch(setSuccess(true));
        dispatch(setError(null));
    } catch (err) {
        dispatch(setError(err.response?.data?.error || 'Failed to fetch users'));
      }
      dispatch(setLoading(false));
}


export const getDairyDetails = () => async(dispatch) => {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("authUser"));
    const operatorId = user.userId;
    try {
        const response = await axios.get(`${BASE_URL}/dairy-details/${operatorId}` ,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
});
        // console.log(response.data);
        dispatch(setDairy(response.data));
        dispatch(setSuccess(true));
        dispatch(setError(null));
    } catch (err) {
        dispatch(setError(err.response?.data?.error || 'Failed to fetch users'));
      }
      dispatch(setLoading(false));
}

export const updateDairyDetails = (dairyDetails , operatorId) => async(dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.put(`${BASE_URL}/dairy-details/${operatorId}` , {dairyDetails});
        console.log(response.data);
        setDairy(response.data);
        dispatch(setSuccess(true));
        dispatch(setError(null));
    } catch (err) {
        dispatch(setError(err.response?.data?.error || 'Failed to fetch users'));
      }
      dispatch(setLoading(false));
}

export const addMilkCollection = (milkCollectionData) => async(dispatch) =>{
    dispatch(setLoading(true));
    try {
        const response = await axios.post(`${BASE_URL}/milk-collections` ,  milkCollectionData);
        console.log(response.data);
        dispatch(setSuccess(true));
        dispatch(setError(null));
    } catch (err) {
        dispatch(setError(err.response?.data?.error || 'Failed to fetch users'));
      }
      dispatch(setLoading(false));
}


export const fetchMilkCollectionsByDairy = (dairyId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${BASE_URL}/milk-collections/dairy/${dairyId}`);
      // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
      dispatch(setMilkCollection(res.data));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err.response?.data?.error || 'Failed to fetch milk collections'));
    }
    dispatch(setLoading(false));
  };
  