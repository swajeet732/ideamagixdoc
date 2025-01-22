'use client';
import { useState, useEffect } from 'react';
import useAuth from '@/hooks/patientauth';
import { useRouter } from 'next/navigation'

const PatientConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useAuth();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // Retrieve patient data from localStorage
        const patientData = localStorage.getItem('patientData');
        console.log(patientData);  // Check if this prints the correct patientData

        if (!patientData) {
          console.log("No patient data found in localStorage");
          return;
        }

        // Parse patientData and extract the email
        const parsedPatientData = JSON.parse(patientData);
        const patientEmail = parsedPatientData.email;
        console.log(patientEmail);  // Check if the correct email is retrieved

        // Make the API call to get consultations for the patient
        const response = await fetch(`http://localhost:3000/api/patientrecord?patientEmail=${patientEmail}`);
        const data = await response.json();

        // Update the consultations state
        if (data.consultations) {
          setConsultations(data.consultations);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [router]);

  // Render the table with consultation data
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Patient Consultations</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Patient Name</th>
              <th className="px-4 py-2 border border-gray-300">Patient Email</th>
              <th className="px-4 py-2 border border-gray-300">Doctor Name</th>
              <th className="px-4 py-2 border border-gray-300">Specialty</th>
              <th className="px-4 py-2 border border-gray-300">Consultation Date</th>
              <th className="px-4 py-2 border border-gray-300">Current Illness</th>
              <th className="px-4 py-2 border border-gray-300">Recent Surgery</th>
              <th className="px-4 py-2 border border-gray-300">Surgery Time Span</th>
              <th className="px-4 py-2 border border-gray-300">Allergies</th>
              <th className="px-4 py-2 border border-gray-300">Diabetes Status</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation._id}>
                <td className="px-4 py-2 border border-gray-300">{consultation.patientName}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.patientEmail}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.doctorId.name}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.doctorId.specialty}</td>
                <td className="px-4 py-2 border border-gray-300">{new Date(consultation.consultationDate).toLocaleString()}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.currentIllness}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.recentSurgery}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.surgeryTimeSpan}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.familyMedicalHistory.allergies}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.familyMedicalHistory.diabeticsStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientConsultations;
