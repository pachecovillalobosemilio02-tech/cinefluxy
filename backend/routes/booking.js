const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createBooking, validateTicket, getMyBookings, getOccupiedSeats } = require('../controllers/bookingController')

router.get('/validate/:id', validateTicket)

router.use(authMiddleware)

router.get('/occupied', getOccupiedSeats)
router.post('/', createBooking)
router.get('/mine', getMyBookings)

module.exports = router
