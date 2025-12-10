import userService from '../services/user.service.js';
import mongoose from 'mongoose';

export default {
  async updateUser(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const updates = req.body;
    if (updates.id || updates.password) {
      return res.status(400).json({ error: 'Cannot update sensitive fields.' });
    }

    try {
      const updatedUser = await userService.updateUser(id, updates);
      res.status(200).json(updatedUser);
    } catch (err) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      } else {
        console.error('Update User Error:', err.message);
        res.status(500).json({ error: 'Failed to update user.' });
      }
    }
  },
};
