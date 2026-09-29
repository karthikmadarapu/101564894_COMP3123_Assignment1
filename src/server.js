require('dotenv').config();   // must run first so process.env is filled
const app = require('./app');
const connectDB = require('./config/db')

const PORT = process.env.PORT || 3000;

async function start() {   //Here in server.js im using Try catch block  and a new function which represents all the functions and port connections created in  src/config/db.js && src/app.js (express start).
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();