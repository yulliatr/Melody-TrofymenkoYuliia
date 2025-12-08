import authService from '../services/auth.service.js';

export default {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json({ user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
