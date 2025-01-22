import dbConnect from '../../src/app/utils/db';
import Consultation from '../../src/app/models/consultation';
import Doctor from '../../src/app/models/doctormodel'; // Import the Doctor model
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      // Log the incoming request payload
      console.log('Received Payload:', req.body);

      const { 
        patientName, patientEmail, patientPhone, age, 
        currentIllness, recentSurgery, surgeryTimeSpan, 
        diabetics, allergies, others, doctorId 
      } = req.body;

      // Validate if doctorId is a valid ObjectId format
    //   if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    //     return res.status(400).json({ error: 'Invalid doctorId format' });
    //   }

    //   // Validate if the doctor exists in the database
    //   const doctorExists = await Doctor.findById(doctorId);
    //   if (!doctorExists) {
    //     return res.status(400).json({ error: 'Doctor not found with the provided doctorId' });
    //   }

      // Create a new Consultation document
      const newConsultation = new Consultation({
        patientName,
        patientEmail,
        patientPhone,
        age,
        currentIllness,
        recentSurgery,
        surgeryTimeSpan,
        familyMedicalHistory: { diabeticsStatus: diabetics, allergies },
        diabetics, allergies, others, doctorId, // Use doctorId here
        others,
      });

      // Log the consultation before saving
      console.log('Consultation Data Before Save:', newConsultation);

      // Save the consultation to MongoDB
      await newConsultation.save();

      // Log the saved consultation response
      console.log('Consultation Saved:', newConsultation);

      // Respond with the saved data
      res.status(201).json({ message: 'Consultation data saved successfully', consultation: newConsultation });
    } catch (error) {
      console.error('Error saving consultation:', error);
      res.status(500).json({ error: 'Server Error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
