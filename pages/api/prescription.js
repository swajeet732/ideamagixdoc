import connectDb from '../../src/app/utils/db'; // Ensure this points to your database utility
import Prescription from '../../src/app/models/prescription'; // Correct import for your Prescription model

export default async function handler(req, res) {
  const { method } = req;
  const { consultationId } = req.query;

  // Connect to the database
  try {
    await connectDb();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Failed to connect to the database.' });
  }

  switch (method) {
    case 'POST':
      const { careToBeTaken, medicines, consultationId } = req.body;
    
      if (!careToBeTaken || !consultationId) {
        return res.status(400).json({ error: 'Care to be taken and Consultation ID are required.' });
      }
    
      try {
        // Check if a prescription already exists
        let prescription = await Prescription.findOne({ consultationId });
    
        if (prescription) {
          prescription.careToBeTaken = careToBeTaken;
          prescription.medicines = medicines || '';
          await prescription.save();
          return res.status(200).json(prescription);
        }
    
        // Create new prescription
        prescription = new Prescription({
          careToBeTaken,
          medicines,
          consultationId,
        });
        await prescription.save();
        return res.status(201).json(prescription);
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error creating or updating prescription.' });
      }
    

    case 'GET': {
      try {
        const prescription = await Prescription.findOne({ consultationId }).populate('consultationId');

        if (!prescription) {
          return res.status(404).json({ error: 'Prescription not found for this consultation.' });
        }

        return res.status(200).json(prescription);
      } catch (error) {
        console.error('Error fetching prescription:', error);
        return res.status(500).json({ error: 'Error fetching prescription.' });
      }
    }

    case 'PUT': {
      const { careToBeTaken, medicines } = req.body;

      // Validation
      if (!careToBeTaken || !consultationId) {
        return res.status(400).json({ error: 'Care to be taken and Consultation ID are required.' });
      }

      try {
        const updatedPrescription = await Prescription.findOneAndUpdate(
          { consultationId },
          { careToBeTaken, medicines: medicines || '' },
          { new: true } // Return the updated document
        );

        if (!updatedPrescription) {
          return res.status(404).json({ error: 'Prescription not found for this consultation.' });
        }

        return res.status(200).json({ message: 'Prescription updated successfully.', updatedPrescription });
      } catch (error) {
        console.error('Error updating prescription:', error);
        return res.status(500).json({ error: 'Error updating prescription.' });
      }
    }

    default:
      // Method Not Allowed
      return res.status(405).json({ error: `Method ${method} not allowed.` });
  }
}
