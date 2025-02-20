const { authenticate } = require('../middleware/auth');

router.get('/dashboard', authenticate, (req, res) => {
  res.send('Welcome to the dashboard');
});