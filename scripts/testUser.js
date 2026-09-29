require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/user');



(async() =>{

try{

     await connectDB();
     const user = await User.create({
        username : 'testuser',
        email : 'Test@example.com',
        password : 'password123!',

     });
      
     console.log('Returned as JSON:', user.toJSON());

      const found = await User.findOne({ username: 'testuser' }).select('+password');

    console.log('Stored password:', found.password);
    console.log('Correct password matches?', await found.comparePassword('Password123!'));
    console.log('Wrong password matches?', await found.comparePassword('wrong'));

} catch (err) {
    console.error('Error:', err.message, '| code:', err.code);
  } finally {
    await mongoose.disconnect();
  }
})();


