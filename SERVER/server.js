const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const crypto = require('crypto');
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

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Generate nonce
    next();
});

app.use((req, res, next) => {
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", `'nonce-${res.locals.nonce}'`],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "https:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            }
        }
    })(req, res, next);
});



const PORT = process.env.HOSTP;

connectDB();



app.use('/api/users', userRouter);
app.use('/api/requests', requestRouter);
app.use('/api/posts', createPostRouter(io));
app.use('/api/storys', createStoryRouter(io));
app.use('/api/notifications', notificationRouter);
app.use("/uploads", express.static('uploads'));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.get('/', (req, res) => {
    res.send("Welcome to ZONEY");
 });

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});