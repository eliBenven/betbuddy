require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/items', require('./routes/items/routes'));
app.use('/api/items', require('./routes/[id]/routes'));
app.use('/auth', authRoutes); // Mount auth routes
app.use('/api/friends', require('./routes/friends'));
app.use('/api/open-bets', require('./routes/openBets'));
app.use('/api/bet-history', require('./routes/betHistory'));
app.use('/api/place-bet', require('./routes/placeBet'));
app.use('/api/bets', require('./routes/bets'));


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
