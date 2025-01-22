import dbConnect from '../../src/app/utils/db';
import Doctor from '../../src/app/models/doctormodel';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to the database
      await dbConnect();

      // Check if there's an id in the query parameters
      const { id } = req.query;

      // If an id is provided, fetch a specific doctor by id
      if (id) {
        const doctor = await Doctor.findById(id);

        // If doctor not found, return a 404 error
        if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
        }

        // Return the specific doctor data
        return res.status(200).json({ doctor });
      }

      // Otherwise, fetch all doctors from the database
      const doctors = await Doctor.find();

      // Return the doctors list in the response
      return res.status(200).json({ doctors });
      
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Method Not Allowed for other request methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
