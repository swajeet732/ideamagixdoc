import dbConnect from '../../src/app/utils/db';
import Prescription  from '../../src/app/models/prescription';

export default async function handler(req, res) {
  const { consultationId } = req.query;

  // Ensure the database is connected
  await dbConnect();

  try {
    // Find the prescription based on the consultationId
    const prescriptions = await Prescription.find({ consultationId });

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: 'No prescriptions found for this consultation ID.' });
    }

    return res.status(200).json({ prescriptions });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
}
