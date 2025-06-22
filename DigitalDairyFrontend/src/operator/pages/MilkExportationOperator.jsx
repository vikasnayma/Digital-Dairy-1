import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMilkExportation,
  fetchMilkExportationsByDairy,
  getDairyDetails
} from '../../Redux/Slices/dairyActions';

const MilkExportationOperator = () => {
  const dispatch = useDispatch();
  const { loading, error, success, milkExportation } = useSelector((state) => state.milkExportation);
  const { dairy } = useSelector((state) => state.dairy);

  const [formData, setFormData] = useState({
    clientId: '',
    dairyId: '',
    date: '',
    shift: 'morning',
    quantityLitres: '',
    fatContent: '',
    qualityGrade: '',
    rateApplied: ''
  });

  const [filter, setFilter] = useState({
    date: '',
    shift: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      quantityLitres: parseFloat(formData.quantityLitres),
      fatContent: parseFloat(formData.fatContent),
      rateApplied: parseFloat(formData.rateApplied)
    };

    dispatch(addMilkExportation(payload));
    setFormData({
      clientId: '',
      dairyId: '',
      date: '',
      shift: 'morning',
      quantityLitres: '',
      fatContent: '',
      qualityGrade: '',
      rateApplied: ''
    });
  };

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairy?.dairyId) {
      setFormData(prev => ({ ...prev, dairyId: dairy.dairyId }));
      dispatch(fetchMilkExportationsByDairy(dairy.dairyId));
    }
  }, [dairy, dispatch]);

  const filteredCollections = milkExportation?.filter(entry =>
    (!filter.date || entry.date === filter.date) &&
    (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-amber-50 mt-12 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* === Add Milk Exportation Form === */}
        <div className="bg-amber-100 p-6 rounded-xl shadow-lg border border-amber-200 transform transition-all hover:shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-amber-700 p-2 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-900">Add Milk Exportation</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Client ID", name: "clientId", type: "text", placeholder: "Enter client ID" },
              { label: "Dairy ID", name: "dairyId", type: "text", placeholder: "Dairy ID" },
              { label: "Date", name: "date", type: "date" },
              { label: "Shift", name: "shift", type: "select", options: ["morning", "evening"] },
              { label: "Quantity (L)", name: "quantityLitres", type: "number", step: "0.1", placeholder: "0.0" },
              { label: "Fat Content (%)", name: "fatContent", type: "number", step: "0.1", placeholder: "0.0" },
              { label: "Quality Grade", name: "qualityGrade", type: "text", placeholder: "A, B, C, etc." },
              { label: "Rate (₹/L)", name: "rateApplied", type: "number", step: "0.1", placeholder: "0.0" }
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="block text-sm font-medium text-amber-800">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    step={field.step}
                    placeholder={field.placeholder}
                    className="w-full p-3 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="col-span-full mt-2 py-3 px-6 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Submit Exportation'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded animate-pulse">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded animate-bounce">
              <p>Milk Exportation added successfully!</p>
            </div>
          )}
        </div>

        {/* === Filter Milk Exportation === */}
        <div className="bg-amber-100 p-6 rounded-xl shadow-lg border border-amber-200">
          <div className="flex items-center mb-6">
            <div className="bg-amber-700 p-2 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-amber-900">Filter Milk Exportations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Filter by Date</label>
              <input
                type="date"
                name="date"
                value={filter.date}
                onChange={handleFilterChange}
                className="w-full p-3 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Filter by Shift</label>
              <select
                name="shift"
                value={filter.shift}
                onChange={handleFilterChange}
                className="w-full p-3 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All Shifts</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </div>

          {(filter.date || filter.shift) && (
            <div className="mt-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                {filter.date && `Entries on ${filter.date}`}
                {filter.date && filter.shift && ' - '}
                {filter.shift && `${filter.shift.charAt(0).toUpperCase() + filter.shift.slice(1)} Shift`}
              </h3>

              {filteredCollections?.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-amber-200">
                  <table className="min-w-full divide-y divide-amber-200">
                    <thead className="bg-amber-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Client</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Qty (L)</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Fat %</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Rate</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-amber-100 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-200">
                      {filteredCollections.map(entry => (
                        <tr key={entry.exportId} className="hover:bg-amber-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-amber-900">{entry.clientId}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-amber-900">{entry.quantityLitres}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-amber-900">{entry.fatContent}%</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-amber-900">₹{entry.rateApplied}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-amber-900">₹{(entry.quantityLitres * entry.rateApplied).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-amber-700">
                  No entries found for selected filters
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilkExportationOperator;