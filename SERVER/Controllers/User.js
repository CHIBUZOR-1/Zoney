const bcrypt = require('bcryptjs');
const userModel = require('../Models/UserModel');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { setCookiesWithToken, socketToken } = require('../Utils/Auth');
const crypto = require('crypto');
const { sendMail } = require('../Utils/Auth');

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

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).send({success: false, message: "field required"})
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
        const details = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            age: user.age,
            gender: user.gender,
            profilePic: user.profileImg,
            coverImage: user.coverImg
        };
        res.status(200).json({
            success: true,
            message: "Login successful",
            details
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
const getUserFriends = async (userId) => {
    try {
        const user = await userModel.findById(userId).populate('friends');
        return user.friends;
    } catch (error) {
        console.error('Error fetching user friends:', error);
        return [];
    }
};

const googleAuthSignUp = async(req, res)=> {
    try {
        const { username, firstname, lastname,  email} = req.body;
        if(!username || !firstname || !lastname  || !email) {
            return res.send({error: "ll fields  are required"});
        }
        const existsEmail = await userModel.findOne({email});
        if(existsEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            })
        }
        
        const newUser = await new userModel({
            username,
            firstname,
            lastname,
            email,
            verified: true,
            googleId: req.body.googleId
        }).save();

        res.status(201).json({
            success: true,
            error: false,
            message: "Registered sucessfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error Ocurred"
        })
    }
}

const googleAuthLogin = async(req, res)=> {
    try {
        const {email, googleId} = req.body;
        const user = await userModel.findOne({ email, googleId });
        if (!user) { 
            return res.status(400).json({ success: false, message: "User not found or incorrect credentials" }); 
        }
        setCookiesWithToken(user._id, res);
        socketToken(user._id, res);
        const details = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            gender: user.gender,
            profilePic: user.profileImg,
            coverImage: user.coverImg
        };
        res.status(200).json({
            success: true,
            message: "Login successful",
            details
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error Ocurred"
        });
    }
}

const findMutualFriends = async (userId1, userId2) => {
    try {
        const friends1 = await getUserFriends(userId1);
        const friends2 = await getUserFriends(userId2);

        const friends1Set = new Set(friends1.map(friend => friend._id.toString()));
        const mutualFriends = friends2.filter(friend => friends1Set.has(friend._id.toString()));

        return mutualFriends;
    } catch (error) {
        console.error('Error finding mutual friends:', error);
        return [];
    }
};

const getMutualFriends = async (req, res) => {
    const userId1 = req.user.userId;
    const {  userId2 } = req.query;

    try {
        const mutualFriends = await findMutualFriends(userId1, userId2);
        res.status(200).json({
            success: true,
            mutualFriends
        });
    } catch (error) {
        console.error('Error fetching mutual friends:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const allUsers = async(req, res)=> {
    try {
        const users = await userModel.find({_id: { $ne : req.user.userId }}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "Error"
        })
    }
}
const getSuggestions = async(req, res)=> {
    try {
        const friendz = await userModel.findById(req.user.userId).select('friends');
        const users = await userModel.aggregate([
            {
                $match: {
                    _id: { $ne: req.user.userId},
                },
            },
            { $sample: { size: 10 } },
        ]);
        const fileterUsers = users.filter((user)=> !friendz.friends.includes(user._id));
        const suggestedUsers = fileterUsers.slice(0, 8)
        suggestedUsers.forEach((user)=> { user.password = null });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getuserDetails = async(req, res)=> {
    try {
        const details = await userModel.findById(req.params.id).select('-password');
        if(!details) {
            return res.status(400).json({error: "user not found"})
        }
        res.status(200).json({
            success: true,
            details
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to update profile photo
const updateProfilePhoto = async (req, res) => {
  const { image } = req.body;
  const userId = req.user.userId; // Assuming you have userId from authentication middleware

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profileImg = image; // Update the profile photo URL
    await user.save();

    res.status(200).json({ success: true, message: 'Profile photo updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
const updateCoverImg = async (req, res) => {
    const { image } = req.body;
    const userId = req.user.userId; // Assuming you have userId from authentication middleware
  
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.coverImg = image; // Update the cover photo URL
      await user.save();
  
      res.status(200).json({ success: true, message: 'Profile photo updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

const getAllFriends = async (req, res) => { 
    try { 
        const userId = req.user.userId; 
        const user = await userModel.findById(userId).populate({
            path: 'friends',
            select: '-password'
        }); 
        if (!user) { 
            return res.status(404).json({ success: false, message: 'User not found', }); 
        } res.status(200).json({ success: true, friends: user.friends, }); 
    } catch (error) { 
        console.error('Error fetching user friends:', error); 
        res.status(500).json({ success: false, message: 'Internal Server Error', }); 
    } 
};

const updateProfile = async (req, res)=> {
     try {
        const { newFirstname, newLastname, newBirthdate, newGender } = req.body;
        const newAge = new Date().getFullYear() - new Date(newBirthdate).getFullYear();
        const userUpdate = await userModel.findByIdAndUpdate(req.user.userId, {
            firstname: newFirstname,
            lastname: newLastname,
            birthdate: newBirthdate,
            gender: newGender,
            age: newAge
        }, { new: true });
        if (!userUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user: userUpdate });
     } catch (error) {
        console.error('Error updating user about field:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
     }
}

// Update user's 'about' field
const updateAbout = async (req, res) => {
    // Update user's 'about' field
    try {
        const userId = req.user.userId; // Assuming you have userId from the authentication middleware
        const { bio, city, country, worksAt, education } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { 
                $set: {
                    'about.bio': bio,
                    'about.city': city,
                    'about.country': country,
                    'about.worksAt': worksAt,
                    'about.education': education
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user about field:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};





module.exports = { userRegisteration, updateCoverImg, updateAbout, updateProfilePhoto, googleAuthSignUp, allUsers, getMutualFriends, userLogin, searchUsers, logout, getSuggestions, getuserDetails, updateProfile, googleAuthLogin, getAllFriends}