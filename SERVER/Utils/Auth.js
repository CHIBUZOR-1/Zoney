const jwt = require('jsonwebtoken');
const userModel = require('../Models/UserModel');

const setCookiesWithToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn: "1d"});

    res.cookie('jwt', token, {
        maxAge: 1*24*60*60*1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
    });
};

const socketToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.cookie('socket', token, {
        maxAge: 1*24*60*60*1000,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
    });
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized Access"
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode) {
            return res.status(401).json({
                error: true,
                message: "Invalid Token"
            })
        }
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "An error occured!"
        })
    }
    

}

 const getDetailsFromToken = async(token) => {
    if(!token) {
        return {
            loggedOut: true,
            message: "Session Timeout"
        }
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.userId);
    return user;
 }

const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if(user.role !== "ADMIN") {
            return res.status(401).json({
                success: false,
                message: "unauthorized"
            })
        } else {
           next();
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "middleware error"
        })
    }
}

module.exports = { verifyToken, isAdmin, setCookiesWithToken, socketToken, getDetailsFromToken };