"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import doctorAuth from "@/hooks/doctorauth";
import { FaEye } from "react-icons/fa"; // Import the visibility icon

export default function DoctorReport() {
  const [doctorRecord, setDoctorRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  doctorAuth();

  useEffect(() => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      setError("Doctor ID not found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchDoctorRecord = async () => {
      try {
        const response = await axios.get(
          `/api/doctorrecord?doctorId=${doctorId}`
        );
        setDoctorRecord(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch doctor record.");
        setLoading(false);
      }
    };

    fetchDoctorRecord();
  }, [router]);

  const handlePatientView = (patientId) => {
    // Log the patient ID for debugging purposes
    console.log("Navigating to patient report for ID:", patientId);
  
    // Store the patient ID in localStorage
    localStorage.setItem("selectedPatientId", patientId);
  
    // Navigate to the "patientviewreport" page
    router.push(`/patientviewreport/${patientId}`);
  };
  
  if (loading) return <p>Loading doctor record...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Doctor Report
      </h1>

      <div className="consultations-table">
        <h2 className="text-2xl font-semibold mb-4">Consultations</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Patient Name</th>
              <th className="border px-4 py-2 text-left">Consultation Date</th>
              <th className="border px-4 py-2 text-left">Age</th>
              <th className="border px-4 py-2 text-left">Current Illness</th>
              <th className="border px-4 py-2 text-left">Recent Surgery</th>
              <th className="border px-4 py-2 text-left">Diabetic Status</th>
              <th className="border px-4 py-2 text-left">Allergies</th>
              <th className="border px-4 py-2 text-left">Visibility</th>
            </tr>
          </thead>
          <tbody>
            {doctorRecord?.consultations?.map((consultation) => (
              <tr key={consultation._id}>
                <td className="border px-4 py-2">{consultation.patientName}</td>
                <td className="border px-4 py-2">
                  {new Date(consultation.consultationDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{consultation.age}</td>
                <td className="border px-4 py-2">
                  {consultation.currentIllness}
                </td>
                <td className="border px-4 py-2">
                  {consultation.recentSurgery}
                </td>
                <td className="border px-4 py-2">
                  {consultation.familyMedicalHistory.diabeticsStatus}
                </td>
                <td className="border px-4 py-2">
                  {consultation.familyMedicalHistory.allergies}
                </td>
                <td className="border px-4 py-2 text-center">
                  <FaEye
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => handlePatientView(consultation._id)} // Pass the patientId here
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
