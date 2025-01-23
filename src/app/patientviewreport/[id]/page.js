'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PrescriptionForm = () => {
  const [careToBeTaken, setCareToBeTaken] = useState('');
  const [medicines, setMedicines] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [consultationId, setConsultationId] = useState(null);

  useEffect(() => {
    // Retrieve the consultation ID from localStorage
    const storedConsultationId = localStorage.getItem('selectedPatientId'); // Use the correct key
    if (storedConsultationId) {
      setConsultationId(storedConsultationId);
    } else {
      console.error('Consultation ID not found in localStorage.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!careToBeTaken) {
      alert('Care to be Taken is required.');
      return;
    }
  
    const consultationId = localStorage.getItem('selectedPatientId'); // Ensure this key is correct
    console.log(consultationId, 'consultationId');
  
    if (!consultationId) {
      alert('Consultation ID not found in localStorage.');
      return;
    }
  
    const prescriptionData = {
      careToBeTaken,
      medicines,
      consultationId, // Include consultationId
    };
  
    try {
      const response = await axios.post('/api/prescription', prescriptionData); // Ensure this endpoint is correct
      console.log(response.data); // Debugging: Log response from backend
      alert('Prescription submitted successfully!');
      router.push('/doctorreport');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('An error occurred while submitting the prescription.');
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Write Prescription</h1>
      <form onSubmit={handleSubmit}>
        {/* Care to Be Taken */}
        <div className="mb-4">
          <label htmlFor="careToBeTaken" className="block text-lg font-medium text-gray-700">
            Care to be Taken (mandatory)
          </label>
          <textarea
            id="careToBeTaken"
            required
            value={careToBeTaken}
            onChange={(e) => setCareToBeTaken(e.target.value)}
            placeholder="Enter care instructions"
            rows={4}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Medicines */}
        <div className="mb-6">
          <label htmlFor="medicines" className="block text-lg font-medium text-gray-700">
            Medicines
          </label>
          <textarea
            id="medicines"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder="Enter medicines"
            rows={4}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 text-white font-semibold rounded-md focus:outline-none ${
              loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
