import User from '../models/User.js';

export default {
  async updateUser(userId, updates) {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) throw new Error('User not found');

    const { password, ...safeUser } = updatedUser.toObject();
    return safeUser;
  },

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },
};
