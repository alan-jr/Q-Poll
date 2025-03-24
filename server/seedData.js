require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Poll = require('./models/Poll');

const uri = process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB Connected');
  
  try {
    // Clear existing data
    await User.deleteMany({});
    await Poll.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword
    });
    console.log('Created user 1');

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword
    });
    console.log('Created user 2');

    // Create sample polls
    const poll1 = await Poll.create({
      title: 'Favorite Programming Language',
      description: 'What programming language do you prefer?',
      creator: {
        id: user1._id,
        name: user1.name
      },
      options: [
        { id: 'opt1', text: 'JavaScript', votes: 3 },
        { id: 'opt2', text: 'Python', votes: 2 },
        { id: 'opt3', text: 'Java', votes: 1 }
      ],
      voters: [user1._id, user2._id],
      totalVotes: 6,
      active: true
    });
    console.log('Created poll 1');

    const poll2 = await Poll.create({
      title: 'Best Framework',
      description: 'Which web framework do you prefer?',
      creator: {
        id: user2._id,
        name: user2.name
      },
      options: [
        { id: 'opt1', text: 'React', votes: 4 },
        { id: 'opt2', text: 'Angular', votes: 2 },
        { id: 'opt3', text: 'Vue', votes: 3 }
      ],
      voters: [user1._id],
      totalVotes: 9,
      active: true
    });
    console.log('Created poll 2');

    console.log('\nSample data added successfully!');
    console.log('\nUsers created:');
    console.log('1. John Doe (john@example.com)');
    console.log('2. Jane Smith (jane@example.com)');
    console.log('\nPolls created:');
    console.log('1. Favorite Programming Language');
    console.log('2. Best Framework');
    console.log('\nPassword for all users: password123');

  } catch (error) {
    console.error('Error seeding data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
}); 