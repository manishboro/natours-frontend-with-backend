const dotenv = require('dotenv');
const mongoose = require('mongoose');

//to handle uncaught exceptions / errors occurred in synchronous code
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Unhandled exception. Shutting down!!');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(process.env);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful'));

const port = 8501 || process.env.PORT;
const server = app.listen(port, () => console.log(`app running on ${port}..`));

//to handle unhandled rejection / errors occurred in asynchronous code
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection. Shutting down!!');
  server.close(() => process.exit(1));
});
