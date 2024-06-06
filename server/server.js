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

// Create a Contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  address: String,
  mobileNumber: String,
  email: String,
  message: String,
});

// Create a Contact model
const Contact = mongoose.model('Contact', contactSchema);

// Create a new contact
app.post('/contacts', async (req, res) => {
  const { name, address, mobileNumber, email, message } = req.body;
  const contact = new Contact({ name, address, mobileNumber, email, message });
  await contact.save();
  res.json(contact);
});

// Get all contacts
app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Update a contact
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, mobileNumber, email, message } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    id,
    { name, address, mobileNumber, email, message },
    { new: true }
  );
  res.json(contact);
});

// Delete a contact
app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  await Contact.findByIdAndDelete(id);
  res.sendStatus(204);
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});