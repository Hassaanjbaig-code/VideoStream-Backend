const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage or specify a destination
const upload = multer({ storage: storage });

module.exports = upload;
