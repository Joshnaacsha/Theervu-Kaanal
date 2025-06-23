import bcrypt from 'bcryptjs';
import Petitioner from '../models/Petitioner.js';
import Official from '../models/Official.js';
import Admin from '../models/Admin.js';

// Helper to get model by role
const getModelByRole = (role) => {
    switch (role) {
        case 'petitioner': return Petitioner;
        case 'official': return Official;
        case 'admin': return Admin;
        default: throw new Error('Invalid user role');
    }
};

export const getProfile = async (req, res) => {
    try {
        const Model = getModelByRole(req.user.role);
        const user = await Model.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const Model = getModelByRole(req.user.role);
        const updates = req.body;
        delete updates.password;
        const user = await Model.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const Model = getModelByRole(req.user.role);
        const user = await Model.findByIdAndUpdate(req.user.id, { preferences: req.body }, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both current and new password are required' });
        const Model = getModelByRole(req.user.role);
        const user = await Model.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}; 