import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  historyOfSurgery: {
    type: String, // Store as a comma-separated string
    default: '',
  },
  historyOfIllness: {
    type: String, // Store as a comma-separated string
    default: '',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  token: {
    type: String,
  },
});

// Export the model
const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;
