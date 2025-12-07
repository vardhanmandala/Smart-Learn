const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/mernapp'; // Change DB name if needed

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Define a simple User schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
    });

    // Create User model
    const User = mongoose.model('User', userSchema);

    // Insert a sample user
    return User.create({ name: 'Test User', email: 'test@example.com' });
  })
  .then(() => {
    console.log('Sample user added, database created');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
