import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDairyDetails } from '../../Redux/Slices/dairyActions';

const HomeOperator = () => {
  const dispatch = useDispatch();
  const { dairy, loading, error } = useSelector((state) => state.dairy);

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-center mt-8 text-amber-700 font-medium animate-pulse">
        Loading dairy details...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-8 text-red-600 font-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
        {error}
      </p>
    );
  }

  if (!dairy) {
    return (
      <p className="text-center mt-8 text-stone-500 bg-amber-50 p-4 rounded-lg shadow-inner">
        No dairy found for this operator.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-amber-50 shadow-lg rounded-xl border border-amber-100 transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold text-stone-800 mb-4 pb-2 border-b border-amber-200">
        Dairy Details
      </h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="font-semibold text-stone-700 w-28">Name: </span>
          <span className="text-stone-600">{dairy.name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-stone-700 w-28">Dairy Id: </span>
          <span className="text-stone-600">{dairy.dairyId}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-stone-700 w-28">Operator Id: </span>
          <span className="text-stone-600">{dairy.operatorId}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-stone-700 w-28">Location: </span>
          <span className="text-stone-600">{dairy.location}</span>
        </div>
      </div>
    </div>
  );
};

export default HomeOperator;