var mongoose = require('mongoose');
mongoose.connect(process.env.mongodb_URI);
module.exports = {mongoose};
