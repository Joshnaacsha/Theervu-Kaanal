import mongoose from 'mongoose';

const officialSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    employeeId: { type: String, required: true, trim: true }, // 🔹 Removed unique: true
    department: {
        type: String,
        required: true,
        enum: ['Water', 'RTO', 'Electricity']
    },
    designation: { type: String, required: true, trim: true },
    officeAddress: { type: String, required: false, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, match: /^[0-9]{6}$/ },
    taluk: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    division: { type: String, required: true, trim: true },
    officeCoordinates: {
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false }
    },
    password: { type: String, required: true },
    role: { type: String, default: 'official' }
}, { timestamps: true });

// 🔹 Ensure employeeId is unique *only within each department*
officialSchema.index({ department: 1, employeeId: 1 }, { unique: true });

// Add geospatial index for location-based queries
officialSchema.index({ officeCoordinates: '2dsphere' });

export default mongoose.model('Official', officialSchema);

