import connectDb from '../../src/app/utils/db'; // Ensure this is correctly pointing to the db utility
import Prescription from '../../src/app/models/prescription'; // Correct import of the Prescription model

export default async function handler(req, res) {
  const { method } = req;
  const { consultationId } = req.query;

  // Connect to the database
  await connectDb();

  switch (method) {
    case 'POST':
      // Create or update prescription
      const { careToBeTaken, medicines } = req.body;

      if (!careToBeTaken || !consultationId) {
        return res.status(400).json({ error: 'Care to be taken and Consultation ID are required.' });
      }

      try {
        // Check if a prescription already exists for the given consultationId
        let prescription = await Prescription.findOne({ consultationId });

        if (prescription) {
          // Update existing prescription
          prescription.careToBeTaken = careToBeTaken;
          prescription.medicines = medicines || ''; // If medicines field is empty, set it as empty string

          await prescription.save(); // Save the updated prescription
          return res.status(200).json(prescription); // Return the updated prescription
        } else {
          // Create new prescription if not exists
          prescription = new Prescription({
            careToBeTaken,
            medicines,
            consultationId,
          });

          await prescription.save(); // Save the new prescription
          return res.status(201).json(prescription); // Return the new prescription
        }
      } catch (error) {
        console.error('Error creating or updating prescription:', error);
        return res.status(500).json({ error: 'Error creating or updating prescription' });
      }

    case 'GET':
      // Get prescription by consultationId
      try {
        const prescription = await Prescription.findOne({ consultationId }).populate('consultationId'); // Optionally populate consultation data

        if (!prescription) {
          return res.status(404).json({ error: 'Prescription not found for this consultation.' });
        }

        return res.status(200).json(prescription); // Return the prescription details
      } catch (error) {
        console.error('Error fetching prescription:', error);
        return res.status(500).json({ error: 'Error fetching prescription' });
      }

    case 'PUT':
      // Update prescription by consultationId
      const { careToBeTaken: updatedCareToBeTaken, medicines: updatedMedicines } = req.body;

      try {
        // Find and update prescription by consultationId
        const updatedPrescription = await Prescription.findOneAndUpdate(
          { consultationId },
          { careToBeTaken: updatedCareToBeTaken, medicines: updatedMedicines },
          { new: true }  // Return the updated prescription
        );

        if (!updatedPrescription) {
          return res.status(404).json({ error: 'Prescription not found for this consultation.' });
        }

        return res.status(200).json(updatedPrescription); // Return the updated prescription
      } catch (error) {
        console.error('Error updating prescription:', error);
        return res.status(500).json({ error: 'Error updating prescription' });
      }

    default:
      // Method Not Allowed
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
