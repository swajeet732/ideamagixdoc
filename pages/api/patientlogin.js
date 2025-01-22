import dbConnect from '../../src/app/utils/db';
import Patient from '../../src/app/models/patientmodel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect(); // Connect to the database

      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      // Find patient by email
      const patient = await Patient.findOne({ email });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      // Generate JWT token
      const token = jwt.sign({ _id: patient._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

      // Return patient data
      const { name, age, phone, historyOfSurgery, historyOfIllness } = patient;
      res.status(200).json({
        message: 'Login successful.',
        token,
        patient: { name, age, email, phone, historyOfSurgery, historyOfIllness },
      });
    } catch (error) {
      console.error('Error logging in patient:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
