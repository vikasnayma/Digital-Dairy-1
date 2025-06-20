import {
  setDairy,
  setError,
  setSuccess,
  setLoading,
  setMilkCollection,
  setPreMilkBookings,
  setMilkExportation,
  setAllFarmers,
  setPayments,
} from "./dairySlice";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const createDairy = (dairyDetails) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("authUser"));
  const operatorId = user.userId;
  dispatch(setLoading(true));
  try {
    const response = await axios.post(
      `${BASE_URL}/dairy-details/${operatorId}`,
      dairyDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    dispatch(setSuccess(true));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || "Failed to fetch users"));
  }
  dispatch(setLoading(false));
};

export const getDairyDetails = () => async (dispatch) => {
  dispatch(setLoading(true));
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("authUser"));
  const operatorId = user.userId;
  try {
    const response = await axios.get(
      `${BASE_URL}/dairy-details/${operatorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data);
    dispatch(setDairy(response.data));
    dispatch(setSuccess(true));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || "Failed to fetch users"));
  }
  dispatch(setLoading(false));
};

export const updateDairyDetails =
  (dairyDetails, operatorId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.put(
        `${BASE_URL}/dairy-details/${operatorId}`,
        { dairyDetails }
      );
      console.log(response.data);
      setDairy(response.data);
      dispatch(setSuccess(true));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Failed to fetch users"));
    }
    dispatch(setLoading(false));
  };

export const addMilkCollection = (milkCollectionData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(
      `${BASE_URL}/milk-collections`,
      milkCollectionData
    );
    console.log(response.data);
    dispatch(setSuccess(true));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || "Failed to fetch users"));
  }
  dispatch(setLoading(false));
};

export const fetchMilkCollectionsByDairy = (dairyId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/milk-collections/dairy/${dairyId}`
    );
    // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
    dispatch(setMilkCollection(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

export const fetchMilkCollectionsByFarmer = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("authUser"));
  const farmerId = user.userId;
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/milk-collections/farmer/${farmerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
    // console.log(res.data);

    dispatch(setMilkCollection(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

export const createPreMilkBooking = (preBookingData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(
      `${BASE_URL}/pre-bookings`,
      preBookingData
    );
    console.log(response.data);
    dispatch(setSuccess(true));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || "Failed to fetch users"));
  }
  dispatch(setLoading(false));
};

export const fetchAllPreMilkBookings = (dairyId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${BASE_URL}/pre-bookings/${dairyId}`);
    // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
    // console.log(res.data);
    dispatch(setPreMilkBookings(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

export const fetchAllPreMilkBookingsByFarmer = () => async (dispatch) => {
  dispatch(setLoading(true));
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("authUser"));
  const farmerId = user.userId;
  try {
    const res = await axios.get(`${BASE_URL}/pre-bookings/farmer/${farmerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
    // console.log(res.data);
    dispatch(setPreMilkBookings(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

export const updateBookingStatus = (bookingId, status) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.put(
      `${BASE_URL}/pre-bookings/${bookingId}/status?status=${status}`
    );

    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to update booking status")
    );
  }
  dispatch(setLoading(false));
};

export const updatePaymentStatus =
  (bookingId, paymentStatus) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await axios.put(
        `${BASE_URL}/pre-bookings/${bookingId}/payment-status?paymentStatus=${paymentStatus}`
      );
      dispatch(setError(null));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.error || "Failed to update payment status")
      );
    }
    dispatch(setLoading(false));
  };

export const addMilkExportation = (milkExportationData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(
      `${BASE_URL}/milk-exportation`,
      milkExportationData
    );
    console.log(response.data);
    dispatch(setSuccess(true));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.response?.data?.error || "Failed to fetch users"));
  }
  dispatch(setLoading(false));
};

export const fetchMilkExportationsByDairy = (dairyId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/milk-exportation/dairy/${dairyId}`
    );
    dispatch(setMilkExportation(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

export const fetchMilkExportationsByClient = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("authUser"));
  const clientId = user.userId;
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/milk-exportation/client/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setMilkExportation(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};


export const fetchAllFarmersByDairy = (dairyId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/auth/farmers/${dairyId}`
    );
    dispatch(setAllFarmers(res.data));
    console.log(res.data);
    
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

export const fetchMilkCollectionsByFarmerInOperator = (farmerId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/milk-collections/farmer/${farmerId}`);
    // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
    console.log(res.data);

    dispatch(setMilkCollection(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};


export const fetchPaymentsByPayee = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("authUser"));
  const payeeId = user.userId;
  dispatch(setLoading(true));
  try {
    const res = await axios.get(
      `${BASE_URL}/payments/payee-payments/${payeeId}` ,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log(res.data);
    dispatch(setPayments(res.data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.error || "Failed to fetch milk collections")
    );
  }
  dispatch(setLoading(false));
};

// export const fetchPreMilkBookingById = (bookingId) => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const res = await axios.get(`${BASE_URL}/pre-bookings/booking/${bookingId}`);
//     // localStorage.setItem('milkCollectionsCache', JSON.stringify(res.data));
//     // console.log(res.data);
//     dispatch(setError(null));
//   } catch (err) {
//     dispatch(
//       setError(err.response?.data?.error || "Failed to fetch milk collections")
//     );
//   }
//   dispatch(setLoading(false));
// };