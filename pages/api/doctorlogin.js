import dbConnect from '../../src/app/utils/db';
import Doctor from '../../src/app/models/doctormodel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Debugging logs
      console.log('Entered password:', password);
      console.log('Stored hashed password:', doctor.password);

      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      console.log('Password comparison result:', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      let token = doctor.token;
      if (!token) {
        token = jwt.sign(
          { id: doctor._id, email: doctor.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' }
        );

        doctor.token = token;
        await doctor.save();
      }

      return res.status(200).json({
        message: 'Login successful',
        token,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          email: doctor.email,
          phone: doctor.phone,
          experience: doctor.experience,
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
