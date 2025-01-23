const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  careToBeTaken: {
    type: String,
    required: true,
  },
  medicines: {
    type: String,
  },
  consultationId: {
    type: String,
    required: true,
    unique: true, // Ensures one prescription per consultation
  },
}, { timestamps: true });

// Use existing model if it exists, otherwise create a new one
const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
