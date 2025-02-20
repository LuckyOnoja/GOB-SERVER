const paymentController = require('../controllers/paymentController');

router.post('/pay', paymentController.initiatePayment);