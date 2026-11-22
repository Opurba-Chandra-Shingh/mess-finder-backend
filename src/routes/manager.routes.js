// /api/manager  (only for logged in managers)
const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const messSetup = require('../controllers/manager-mess.controller');
const vacancyPost = require('../controllers/vacancy-post.controller');
const interest = require('../controllers/interest.controller');

router.use(authenticate, requireRole('manager'));

// the mess
router.post('/mess', messSetup.createMess);
router.get('/mess', messSetup.getMess);
router.put('/mess', messSetup.updateMess);

// rooms
router.post('/rooms', messSetup.createRoom);
router.patch('/rooms/:id', messSetup.updateRoom);
router.patch('/rooms/:id/deactivate', messSetup.setRoomActive(false));
router.patch('/rooms/:id/activate', messSetup.setRoomActive(true));

// seats
router.post('/rooms/:id/seats', messSetup.createSeat);
router.patch('/seats/:id/rent', messSetup.updateSeatRent);
router.patch('/seats/:id/deactivate', messSetup.setSeatActive(false));
router.patch('/seats/:id/activate', messSetup.setSeatActive(true));
router.get('/rooms-seats', messSetup.roomsAndSeats);

// vacancy posts
router.post('/posts', vacancyPost.createPost);
router.get('/posts', vacancyPost.myPosts);
router.patch('/posts/:id/close', vacancyPost.closePost);

// students who are interested in the mess
router.get('/interests', interest.forManager);

module.exports = router;
