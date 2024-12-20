const bcrypt = require('bcryptjs');
const userModel = require('../Models/UserModel');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { setCookiesWithToken, socketToken } = require('../Utils/Auth');
const crypto = require('crypto');
const { sendMail } = require('../Utils/Auth');
const { resolve4 } = require('dns');

const userRegisteration = async (req, res) => {
    try {

        const { username, firstname, lastname, phone, gender, birthdate, email, password } = req.body;
        if(!firstname) {
            return res.send({error: "name is required"});
        }
        if(!lastname) {
            return res.send({error: "lastname is required"});
        }
        if(!phone) {
            return res.send({error: "Phone Number is required"});
        }
        if(!username) {
            return res.send({error: "username is required"});
        }
        if(!email) {
            return res.send({error: "email is required"});
        }
        if(!gender) {
            return res.send({error: "gender is required"});
        }
        if(!birthdate) {
            return res.send({error: "Birthdate is required"});
        }
        if(!password) {
            return res.send({error: "password is required"});
        }

        const age = new Date().getFullYear() - new Date(birthdate).getFullYear();

        const existsUsername = await userModel.findOne({username});
        if(existsUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already in use"
            })
        }

        const existsEmail = await userModel.findOne({email});
        if(existsEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            })
        }
        // validating email format & password
        if(!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid Email Address"
            })
        }

        if(password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, `${salt}`);
        const newUser = await new userModel({
            username,
            firstname,
            lastname,
            phone,
            email,
            birthdate,
            gender,
            age,
            password: `${hashedPassword}`,
            verificationToken: crypto.randomBytes(32).toString('hex')
        }).save();
        /*const msg = `<p>Hello ${newUser.firstname}, Please verify your email address by clicking on the link below</p>
    <br>
    <a href="${process.env.ORIGIN}/verify-email/${newUser.verificationToken}">CLICK here</a>`;
    const sub = "Email Verification..";
        await sendMail(newUser.email, sub, msg)*/
        res.status(201).json({
            success: true,
            error: false,
            message: "Registered sucessfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: true,
            message: "Registration Error"
        })
    }
}

const searchUsers = async(req, res) => {
    try {
        const {phrase} = req.body;
        const user = await userModel.find({
            $or: [
                {firstname: {$regex : phrase, $options: "i"}},
                {lastname: {$regex: phrase, $options: "i"}},
                {email: {$regex: phrase, $options: "i"}},
                {username: {$regex: phrase, $options: "i"}}
            ]
        }).select("-password");
        return res.status(200).json({
            success: true,
            message: "all users",
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: true,
            success: false,
            message: "Error"
        })
        
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email) {
            return res.send({error: "field required"})
        }
        if(!password) {
            return res.send({error: "Input password"})
        }
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.json({
                error: true,
                success: false,
                message: "User not found"
            })
        } 

        const matchedPassword = await bcrypt.compare(password, user.password);
        if(!matchedPassword) {
            return res.json({
                error: true,
                success: false,
                message: "Invalid password"
            });
        }
        setCookiesWithToken(user._id, res);
        socketToken(user._id, res);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                age: user.age,
                gender: user.gender,
                profilePic: user.profileImg,
                coverImage: user.coverImg
            }
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Login Unsuccessful"
        })
        
    }
}

const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0});
        res.cookie("socket", "", { maxAge: 0});
        res.status(200).json({
            success: true,
            message: "Logged Out successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            success: false,
            message: "An error occured!"
        })
    }
}

module.exports = { userRegisteration, userLogin, searchUsers, logout}