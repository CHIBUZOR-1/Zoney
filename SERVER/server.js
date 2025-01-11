const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const {app, server, io} = require('./Socket/index');
require('../SERVER/Utils/CronJob');


const { connectDB } = require('./db');
const userRouter = require('./Routes/UserRoutes');
const requestRouter = require('./Routes/RequestRoutes');
const createPostRouter = require('./Routes/PostRoutes');
const notificationRouter = require('./Routes/NotificationRoutes');
const createStoryRouter = require('./Routes/StoryRoutes');

dotenv.config();


app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true
}));

app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json({ urlencoded: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());



const PORT = process.env.HOSTP;

connectDB();

app.get('/', (req, res) => {
    res.send("Welcome to ZONEY");
 });

app.use('/api/users', userRouter);
app.use('/api/requests', requestRouter);
app.use('/api/posts', createPostRouter(io));
app.use('/api/storys', createStoryRouter(io));
app.use('/api/notifications', notificationRouter);
app.use("/uploads", express.static('uploads'));
/*app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});*/

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});