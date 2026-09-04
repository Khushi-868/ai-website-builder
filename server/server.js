import express from 'express';
import "dotenv/config"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import projectRouter from './routes/projectRoutes.js';


const app = express();


await connectDB()
app.use(cors({origin:process.env.ORIGINS.split(","), credentials:true}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is live!');
});
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

// Centralize error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
