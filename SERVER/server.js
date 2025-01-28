const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const {app, server, io} = require('./Socket/index');
require('../SERVER/Utils/CronJob');


const { connectDB } = require('./db');
const userRouter = require('./Routes/UserRoutes');
const requestRouter = require('./Routes/RequestRoutes');
const createPostRouter = require('./Routes/PostRoutes');
const notificationRouter = require('./Routes/NotificationRoutes');
const createStoryRouter = require('./Routes/StoryRoutes');

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
                scriptSrc: ["'self'", `'nonce-${res.locals.nonce}'`, "https://www.gstatic.com", "https://www.googleapis.com", "https://apis.google.com", "https://your-emoji-picker-cdn.com", "https://emoji-picker.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://your-emoji-picker-cdn.com", "https://emoji-picker.com"],
                imgSrc: ["'self'", "data:", "https://www.gstatic.com", "blob:", "https://as2.ftcdn.net", "https://res.cloudinary.com", "https://emoji-picker.com"],
                connectSrc: ["'self'", "https://www.googleapis.com", "https://firebasestorage.googleapis.com", "https://identitytoolkit.googleapis.com", "blob:", "https://res.cloudinary.com", "https://your-emoji-picker-cdn.com", "https://emoji-picker.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'", "blob:", "https://res.cloudinary.com", "https://emoji-picker.com"],
                frameSrc: ["'self'", "https://mern-zoney.firebaseapp.com", "https://accounts.google.com"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
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