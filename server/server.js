const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://risabht043:Skt230144@cluster0.30tgn5p.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a User schema
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  age: Number,
  city: String,
  zipCode: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/worko/user', async (req, res) => {
  const { email, name, age, city, zipCode } = req.body;

  try {
    const user = new User({ email, name, age, city, zipCode });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users
app.get('/worko/user', async (req, res) => {
  const users = await User.find({ isDeleted: false });
  res.json(users);
});




app.get('/worko/user/:userId', async (req, res) => {
    try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/worko/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, name, age, city, zipCode } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { email, name, age, city, zipCode },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Partially update a user
app.patch('/worko/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Soft delete a user
app.delete('/worko/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});