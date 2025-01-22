// pages/api/consultations/[doctorId].js
import dbConnect from '../../src/app/utils/db';
import Consultation from '../../src/app/models/consultation';

export default async function handler(req, res) {
  const { method } = req;
  const { doctorId } = req.query;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Find consultations by doctorId
        const consultations = await Consultation.find({ doctorId })
          .populate('doctorId', 'name specialty') // Optionally populate doctor details
          .exec();

        if (consultations.length === 0) {
          return res.status(404).json({ error: 'No consultations found for this doctor.' });
        }

        // Return consultations
        return res.status(200).json({ consultations });
      } catch (error) {
        console.error('Error fetching consultations:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    default:
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
