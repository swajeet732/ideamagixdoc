'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/patientauth';
import jsPDF from 'jspdf';

const PatientConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Authentication Hook
  useAuth();

  // Fetch consultations on component mount
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const patientData = localStorage.getItem('patientData');

        if (!patientData) {
          console.error('No patient data found in localStorage');
          return;
        }

        const { email: patientEmail } = JSON.parse(patientData);

        const response = await fetch(
          `http://localhost:3000/api/patientrecord?patientEmail=${patientEmail}`
        );
        const data = await response.json();

        if (data.consultations) {
          setConsultations(data.consultations);
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [router]);

  // Handle the 'View' button click and fetch the consultation report
  const handleViewClick = async (consultationId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/patientreport?consultationId=${consultationId}`
      );
      const data = await response.json();

      console.log(data);  // Log the response to inspect its structure

      if (response.ok && data) {
        generatePDF(data);
      } else {
        alert('Doctor has not generated a PDF for this consultation.');
      }
    } catch (error) {
      console.error('Error fetching consultation report:', error);
      alert('An error occurred while fetching the report. Please try again later.');
    }
  };

  // Generate PDF report for the consultation
  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Consultation Report', 105, 20, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);

    doc.text(`Consultation ID: ${data.prescriptions[0]?.consultationId || 'N/A'}`, 20, 40);
    doc.text(`Care to be Taken: ${data.prescriptions[0]?.careToBeTaken || 'N/A'}`, 20, 50);
    doc.text(`Medicines: ${data.prescriptions[0]?.medicines || 'N/A'}`, 20, 60);

    // doc.text(`Patient Name: ${data.patientName || 'N/A'}`, 20, 70);
    // doc.text(`Patient Email: ${data.patientEmail || 'N/A'}`, 20, 80);
    // doc.text(`Doctor Name: ${data.doctorName || 'N/A'}`, 20, 90);
    // doc.text(`Specialty: ${data.specialty || 'N/A'}`, 20, 100);
    // doc.text(`Consultation Date: ${new Date(data.consultationDate).toLocaleString() || 'N/A'}`, 20, 110);
    // doc.text(`Current Illness: ${data.currentIllness || 'N/A'}`, 20, 120);
    // doc.text(`Recent Surgery: ${data.recentSurgery || 'N/A'}`, 20, 130);
    // doc.text(`Surgery Time Span: ${data.surgeryTimeSpan || 'N/A'}`, 20, 140);
    // doc.text(`Allergies: ${data.allergies || 'N/A'}`, 20, 150);
    // doc.text(`Diabetes Status: ${data.diabeticsStatus || 'N/A'}`, 20, 160);

    doc.save(`Consultation_Report_${data.patientName || 'Unknown'}.pdf`);
  };

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
              <th className="px-4 py-2 border border-gray-300">View</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation._id}>
                <td className="px-4 py-2 border border-gray-300">{consultation.patientName || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.patientEmail || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.doctorId?.name || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">{consultation.doctorId?.specialty || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(consultation.consultationDate).toLocaleString() || 'N/A'}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <button
                    onClick={() => handleViewClick(consultation._id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientConsultations;
