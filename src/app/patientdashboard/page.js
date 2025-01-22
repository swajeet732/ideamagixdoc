"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../../../src/hooks/patientauth";
import { FaEye } from "react-icons/fa";
const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/api/doctor?page=${page}&limit=10`);
        setDoctors(response.data.doctors);
        setTotalPages(Math.ceil(response.data.total / 10)); // Assuming `total` is returned
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [page]);

  const handleConsultButtonClick = (doctorId) => {
    // Save doctorId to localStorage
    localStorage.setItem("doctorId", doctorId);

    // Navigate to the consultation page with doctorId
    router.push(`/doctor/${doctorId}`);
  };

  const handleViewButtonClick = () => {
    // Save doctorId to localStorage
   

    // Navigate to the consultation page with doctorId
    router.push('/view');
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Doctors List
      </h1>
      <button
       onClick={handleViewButtonClick} 
        className="mt-4 text-blue-500 flex items-center space-x-2"
      >
        <FaEye className="text-lg" /> {/* View icon */}
        <span>View</span>
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src="/emoji.webp"
              alt="Doctor Profile"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {doctor.name}
              </h2>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              <button
                onClick={() => handleConsultButtonClick(doctor._id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Consult
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-lg font-semibold text-gray-800">{page}</span>
          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
