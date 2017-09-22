const router = require('express').Router();
const controller = require('../controller/controller.js');

router.route('/messages/:username')
.get(controller.getMessagesByUser)
.delete(controller.deleteAllByUser);

router.route('/profiles/createnew')
.post(controller.addProfile);


module.exports = router;