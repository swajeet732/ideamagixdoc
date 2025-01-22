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
    doctorId: '', // Initialize doctorId as an empty string
  });

  const router = useRouter();

  // Load patient details and doctorId from localStorage on component mount
  useEffect(() => {
    const storedPatientData = JSON.parse(localStorage.getItem('patientData'));
    const storedDoctorId = localStorage.getItem('doctorId'); // Retrieve doctorId from localStorage
    console.log(storedDoctorId);
    

    if (storedPatientData) {
      setFormData((prevData) => ({
        ...prevData,
        patientName: storedPatientData.name,
        patientEmail: storedPatientData.email,
        patientPhone: storedPatientData.phone,
        age: storedPatientData.age,
        doctorId: storedDoctorId, // Set doctorId from localStorage
      }));
    }
  }, []); // Dependency array is empty, runs only on initial render

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required patient data exists
    const storedPatientData = JSON.parse(localStorage.getItem('patientData'));
    if (!storedPatientData || !storedPatientData.name || !storedPatientData.email || !storedPatientData.phone || !storedPatientData.age) {
      alert('Patient details are missing or incomplete!');
      return;
    }

    try {
      // Create the request body
      const response = await axios.post('/api/consultation', {
        patientName: storedPatientData.name,
        patientEmail: storedPatientData.email,
        patientPhone: storedPatientData.phone,
        age: storedPatientData.age,
        currentIllness: formData.currentIllness,
        recentSurgery: formData.recentSurgery,
        surgeryTimeSpan: formData.surgeryTimeSpan,
        diabetics: formData.diabeticsStatus === 'Yes' ? 'diabetics' : 'non-diabetics',
        allergies: formData.allergies,
        others: formData.others,
        doctorId: formData.doctorId, // Use doctorId from the formData state
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
    } catch (error) {
      // Handle error
      alert('Error submitting consultation data');
      console.error(error);
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
    </div>
  );
};

export default ConsultationPage;
