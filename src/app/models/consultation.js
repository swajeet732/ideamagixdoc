// models/Consultation.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  age: { type: Number, required: true },

  // Step 1: Current illness history and recent surgery (time span)
  currentIllness: { type: String, required: true },
  recentSurgery: { type: String, required: true },
  surgeryTimeSpan: { type: String, required: true }, // e.g., "6 months ago"

  // Step 2: Family medical history
  familyMedicalHistory: {
    diabeticsStatus: { type: String, enum: ['diabetics', 'non-diabetics'], required: true },
    allergies: { type: String, required: true }, // Can store allergy information
  },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
// Ensure doctorId is included and referenced
  others: { type: String },

  consultationDate: { type: Date, default: Date.now }
});

const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
