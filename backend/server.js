const express = require('express'); //lets us build APIs easily
const mongoose = require('mongoose'); //lets us talk to mongoDB
const cors = require('cors'); //allows frontend and backend to talk to each other
require('dotenv').config(); //Lets us use .env files for secret keys

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());               // Allow frontend to connect
app.use(express.json());       // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

//Routes
const budgetRoutes = require('./routes/budget');
app.use('/api/budget', budgetRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);  // This enables /api/auth/register and /login

const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));