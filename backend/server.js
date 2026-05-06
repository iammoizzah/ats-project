const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || '*'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/branches',     require('./routes/branchRoutes'));
app.use('/api/jobs',         require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/interviews',   require('./routes/interviewRoutes'));
app.use('/api/upload',       require('./routes/uploadRoutes'));
app.use('/api/email',        require('./routes/emailRoutes'));

app.get('/', (req, res) => {
  res.send('ATS API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));