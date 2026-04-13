const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createBooking, validateTicket, getMyBookings } = require('../controllers/bookingController')

router.use(authMiddleware)

router.post('/', createBooking)
router.get('/mine', getMyBookings)
router.get('/validate/:id', validateTicket)

module.exports = router