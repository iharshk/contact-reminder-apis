const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports.connectDb = function() {
    mongoose.connect(process.env.DB_URL, options).then(() => {
        console.log('Connected With Database !!')
    }).catch((err) => {
        console.log('Failde To Connect With Database !!', err);
        process.exit(1); // Node normally exits with a 0 status code when no more async operations are pending  but There are other exit codes too. Here 0 code means 'Uncaught Fatal Exception'.
    });
}
