
var express = require('express');
const app = express();
var { apiRoutes } = require('./module/index');
require('dotenv').config(); // initialise environment
var cors = require('cors');
var http = require('http').Server(app); 
const { connectDb } = require('./config/database')
// var http = require('http').Server(app); // Create Server
// http.createServer()  can also be used to create server and there is no difference in both. http.createServer() internally calls http.Server() and returns a instance.

app.use(express.json()); //express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in application using the code: app.use(express.json());
app.use(express.urlencoded({ extended : false })); //express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. its also a middleware.
app.use(cors()); // Enable All CORS Requests; #Cross-origin resource sharing (CORS) allows AJAX requests to skip the Same-origin policy and access resources from remote hosts;

// app.use takes only one callback function and it's meant for Middleware. Middleware usually doesn't handle request and response, (technically they can) they just process input data, and hand over it to next handler in queue
// instead of express.json() and express.urlencoded() == bodyParser.json() and bodyParser.urlencoded() can also be used.

connectDb();

app.get('/', (req, res) => {
    res.status(200).send({
        'error': false,
        'status': 200,
        'message': 'Welcome To Your Contact-Details !!'
    });
});

try{
    require('./module/index')(app, http);
} catch (error) {
    console.log(`Error in Loading Plugins ${error}`);
}

// app.all() attaches to the application's router, so it's used whenever the app.router middleware is reached (which handles all the method routes... GET, POST, etc).

app.all('*', (req,res) => {
    res.status(404).send({
        'error': true,
        'status': 404,
        'message': 'API Not Found'
    });
});

const PORT = process.env.PORT || 8000;

http.listen(PORT, function () {
    console.log(`Express Server Running On Port ${PORT}`);
})