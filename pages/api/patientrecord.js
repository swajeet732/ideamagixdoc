import dbConnect from '../../src/app/utils/db';
import Consultation from '../../src/app/models/consultation';
import Doctor from '../../src/app/models/doctormodel'; // Import Doctor model
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { patientEmail } = req.query; // Extract patient email from query parameters

      // Fetch all consultations related to the patient's email
      const consultations = await Consultation.find({ patientEmail })
        .populate('doctorId', 'name specialty email phone experience'); // Populate doctor data from doctorId field

      // Check if consultations are found
      if (!consultations || consultations.length === 0) {
        return res.status(404).json({ error: 'No consultations found for this patient' });
      }

      // Respond with the consultations data
      res.status(200).json({ consultations });
    } catch (error) {
      console.error('Error fetching consultations:', error);
      res.status(500).json({ error: 'Server Error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
