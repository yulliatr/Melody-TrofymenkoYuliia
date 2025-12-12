import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

router.post('/delete-test-user', async (req, res) => {
  const { email } = req.body;

  try {
    await User.deleteOne({ email });
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-test-user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      username: email.split('@')[0],
      stats: {},
    });

    res.json({ status: 'ok', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
