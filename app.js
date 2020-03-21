const path = require('path');
const express = require('express');
const morgan = require('morgan'); //http request middleware to generate logs for eg : /api/v1/tours/11 200 12.177 ms - 104b
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');

// console.log(process.env.NODE_ENV);

const app = express();
app.enable('trust proxy');

//specifying the type of template engine to be used. pug is a template engine.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//implement cors
app.use(cors());
//add headers like Access-Control-Allow-Origin etc
//backend api.natours.com and frontend natours.com
//app.use(cors({
//   origin: https://www.natours.com
// })
//to allow the above url or the frontend to access the api or the backend

app.options('*', cors()); //to allow all the routes to be accessed
//app.options('/api/v1/tours/:id',cors()); //to allow only specific routes to be accessed
//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//SET SECURITY HTTP HEADERS
app.use(helmet());

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //middleware
}

//implementing rate limiting to prevent denial of service attack and brute force attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //100 requests allowed in 1 hr
  message: 'Too many requests from a single IP, please try again in an hour!'
});

//implementing rate limiting in /api route
app.use('/api', limiter);
//we require stripe body in raw form and not in json. that is why '/webhook-checkout' is called before 'express.json'
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

//BODY PARSER, TO READ DATA FROM req.body
app.use(express.json({ limit: '10kB' }));
//COOKIE PARSER, TO PARSE COOKIES COMING FROM A REQUEST
app.use(cookieParser());

//DATA SANITIZATION FROM NOSQL INJECTION ATTACKS, FOR EXAMPLE : entering the following email would lead to successful login "email" : { "$gt" : "" }
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS ATTACKS
app.use(xss());

//PREVENTING PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
  })
);

//our own middleware, TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use(compression());

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //middleware
app.use('/api/v1/users', userRouter); //middleware
app.use('/api/v1/reviews', reviewRouter); //middleware
app.use('/api/v1/bookings', bookingRouter); //middleware

//all the unmatched url's will generate the below error
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404)); //argument passed inside 'next' function will automatically indicate that its an error and it will be passed to the error handling middleware skipping middlewares in between if any
});

app.use(globalErrorHandler);

module.exports = app;
