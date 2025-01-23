'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/patientauth';
import { useRouter } from 'next/navigation';

const ConsultationPage = () => {
  useAuth();

  const [formData, setFormData] = useState({
    currentIllness: '',
    recentSurgery: '',
    surgeryTimeSpan: '',
    diabeticsStatus: '',
    allergies: '',
    others: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    age: '',
    doctorId: '',
  });

  const [upiId, setUpiId] = useState(''); // Store UPI ID
  const [loading, setLoading] = useState(false); // Spinner loading state
  const [showUpiModal, setShowUpiModal] = useState(false); // Modal visibility state
  const router = useRouter();

  useEffect(() => {
    const storedPatientData = JSON.parse(localStorage.getItem('patientData'));
    const storedDoctorId = localStorage.getItem('doctorId');
    console.log(storedDoctorId);

    if (storedPatientData) {
      setFormData((prevData) => ({
        ...prevData,
        patientName: storedPatientData.name,
        patientEmail: storedPatientData.email,
        patientPhone: storedPatientData.phone,
        age: storedPatientData.age,
        doctorId: storedDoctorId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value); // Update UPI ID state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedPatientData = JSON.parse(localStorage.getItem('patientData'));
    if (!storedPatientData || !storedPatientData.name || !storedPatientData.email || !storedPatientData.phone || !storedPatientData.age) {
      alert('Patient details are missing or incomplete!');
      return;
    }

    // Show UPI modal
    setShowUpiModal(true);
  };

  const handleUpiSubmit = async () => {
    setLoading(true); // Start loading spinner

    try {
      const response = await axios.post('/api/consultation', {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        age: formData.age,
        currentIllness: formData.currentIllness,
        recentSurgery: formData.recentSurgery,
        surgeryTimeSpan: formData.surgeryTimeSpan,
        diabetics: formData.diabeticsStatus === 'Yes' ? 'diabetics' : 'non-diabetics',
        allergies: formData.allergies,
        others: formData.others,
        doctorId: formData.doctorId,
        upiId, // Include UPI ID in the request
      });

      // Handle success response
      alert('Consultation saved successfully!');
      console.log(response.data);

      // Clear localStorage and reset form data
      localStorage.removeItem('patientDetails');
      localStorage.removeItem('consultationFormData');
      setFormData({
        currentIllness: '',
        recentSurgery: '',
        surgeryTimeSpan: '',
        diabeticsStatus: '',
        allergies: '',
        others: '',
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        age: '',
        doctorId: '',
      });

      // Navigate to patient dashboard
      router.push('/patientdashboard');
    } catch (error) {
      // Handle error
      alert('Error submitting consultation data');
      console.error(error);
    } finally {
      setLoading(false); // Stop loading spinner
      setShowUpiModal(false); // Close UPI modal
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Consultation Form</h1>

      {/* Consultation Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Consultation Form</h2>

        {/* Patient Name, Email, Phone, and Age are fetched from localStorage */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Patient Name</label>
          <p>{formData.patientName || 'Not Available'}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Patient Email</label>
          <p>{formData.patientEmail || 'Not Available'}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Patient Phone</label>
          <p>{formData.patientPhone || 'Not Available'}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Age</label>
          <p>{formData.age || 'Not Available'}</p>
        </div>

        {/* Step 1: Current Illness History and Recent Surgery */}
        <div className="mb-4">
          <label htmlFor="currentIllness" className="block text-sm font-medium text-gray-600">Current Illness</label>
          <textarea
            id="currentIllness"
            name="currentIllness"
            value={formData.currentIllness || ''}  // Prevent undefined
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="recentSurgery" className="block text-sm font-medium text-gray-600">Recent Surgery</label>
          <textarea
            id="recentSurgery"
            name="recentSurgery"
            value={formData.recentSurgery || ''}  // Prevent undefined
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="surgeryTimeSpan" className="block text-sm font-medium text-gray-600">Surgery Time Span</label>
          <input
            id="surgeryTimeSpan"
            name="surgeryTimeSpan"
            type="text"
            value={formData.surgeryTimeSpan || ''}  // Prevent undefined
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Step 2: Family Medical History */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Diabetics Status</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="diabeticsStatus"
                value="Yes"
                checked={formData.diabeticsStatus === 'Yes'}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="diabeticsStatus"
                value="No"
                checked={formData.diabeticsStatus === 'No'}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-600">Allergies</label>
          <input
            id="allergies"
            name="allergies"
            type="text"
            value={formData.allergies || ''}  // Prevent undefined
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="others" className="block text-sm font-medium text-gray-600">Others</label>
          <input
            id="others"
            name="others"
            type="text"
            value={formData.others || ''}  // Prevent undefined
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-md">Submit</button>
      </form>

      {/* UPI Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter UPI ID</h2>
            <input
              type="text"
              value={upiId}
              onChange={handleUpiChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              placeholder="Enter UPI ID"
            />
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={() => setShowUpiModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleUpiSubmit}
                disabled={loading} // Disable if loading
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
