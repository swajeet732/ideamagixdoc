import dbConnect from '../../src/app/utils/db';
import Patient from '../../src/app/models/patientmodel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect(); // Connect to the database

      const { name, age, email, phone, historyOfSurgery, historyOfIllness, password } = req.body;

      // Check if all required fields are provided
      if (!name || !age || !email || !phone || !password) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      // Check if the email or phone already exists
      const existingPatient = await Patient.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingPatient) {
        return res.status(400).json({ error: 'Email or phone number already exists.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new patient
      const patient = new Patient({
        name,
        age,
        email,
        phone,
        historyOfSurgery,
        historyOfIllness,
        password: hashedPassword, // Save the hashed password
      });

      // Generate JWT token
      const token = jwt.sign({ _id: patient._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
      patient.token = token;

      // Save patient to the database
      await patient.save();

      res.status(201).json({ message: 'Patient registered successfully.', token });
    } catch (error) {
      console.error('Error registering patient:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
