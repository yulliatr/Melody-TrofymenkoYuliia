const authService = require('../services/auth.service');

module.exports = {
  async register(req, res) {
    const { email, password } = req.body;
    try {
      const result = await authService.register(email, password);
      res.status(201).json({ message: 'User registered', user: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    const { usernameOrEmail, password } = req.body;
    try {
      const data = await authService.login(usernameOrEmail, password);
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
