const mongoose = require('mongoose');



const prescriptionSchema = new mongoose.Schema({
  careToBeTaken: {
    type: String,
    required: true,
  },
  medicines: {
    type: String,
    required: false,
  },
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',  // Reference to the Consultation model
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
