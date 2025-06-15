
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
    return <p className="text-center mt-4 text-blue-600 font-semibold">Loading dairy details...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-600 font-semibold">{error}</p>;
  }

  if (!dairy) {
    return <p className="text-center mt-4 text-gray-500">No dairy found for this operator.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Dairy Details</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Name: </span>
          <span>{dairy.name}</span>
        </div>
        <div>
          <span className="font-semibold">Dairy Id: </span>
          <span>{dairy.dairyId}</span>
        </div>
        <div>
          <span className="font-semibold">Operator Id : </span>
          <span>{dairy.operatorId}</span>
        </div>
        <div>
          <span className="font-semibold">Location: </span>
          <span>{dairy.location}</span>
        </div>
      </div>
    </div>
  );
};

export default HomeOperator;
