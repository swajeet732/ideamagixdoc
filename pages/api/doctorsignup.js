import dbConnect from '../../src/app/utils/db';
import Doctor from '../../src/app/models/doctormodel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Ensure the database is connected
      await dbConnect();

      const { name, specialty, email, phone, experience, password } = req.body;

      // Validate required fields
      if (!email || !password || !name || !specialty || !phone || !experience) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if email already exists
      const existingDoctorByEmail = await Doctor.findOne({ email });
      if (existingDoctorByEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Check if phone number already exists
      const existingDoctorByPhone = await Doctor.findOne({ phone });
      if (existingDoctorByPhone) {
        return res.status(400).json({ error: 'Phone number already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new doctor
      const newDoctor = new Doctor({
        name,
        specialty,
        email,
        phone,
        experience,
        password: hashedPassword,
      });

      // Save the new doctor to the database
      await newDoctor.save();

      // Generate a JWT token
      const token = jwt.sign(
        { id: newDoctor._id, email: newDoctor.email }, // Payload
        process.env.JWT_SECRET_KEY,                    // Secret key from environment variables
        { expiresIn: '1h' }                            // Token expiry time
      );

      // Optionally, store the token in the database (if required)
      newDoctor.token = token;
      await newDoctor.save();

      // Respond with the doctor data and the JWT token
      return res.status(201).json({
        message: 'Doctor registered successfully',
        token, // JWT token
        doctor: {
          id: newDoctor._id,
          name: newDoctor.name,
          specialty: newDoctor.specialty,
          email: newDoctor.email,
          phone: newDoctor.phone,
          experience: newDoctor.experience,
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
