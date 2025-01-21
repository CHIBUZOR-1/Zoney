const bcrypt = require('bcryptjs');
const userModel = require('../Models/UserModel');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { setCookiesWithToken, socketToken } = require('../Utils/Auth');
const crypto = require('crypto');
const { sendMail } = require('../Utils/Email');

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
            return res.json({
                success: false,
                message: "Username already in use"
            })
        }

        const existsEmail = await userModel.findOne({email});
        if(existsEmail) {
            return res.json({
                success: false,
                message: "Email already in use"
            })
        }
        // validating email format & password
        if(!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid Email Address"
            })
        }

        if(password.length < 6) {
            return res.json({
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
        const msg = `<p>Hello ${newUser.firstname + " " + newUser.lastname}, Please verify your email address by clicking on the link below</p>
    <br>
    <a href="${process.env.ORIGIN}/verify-email/${newUser.verificationToken}">CLICK here</a>`;
    const sub = "Email Verification..";
        await sendMail(newUser.email, sub, msg);
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

        if (!user.verified) {
            return res.json({ success: false, message: 'User not verified' });
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
        const friendz = await userModel.findById(req.user.userId).select('friends').populate({ 
            path:'friends',
            select: '_id',
        }).lean();
        const users = await userModel.aggregate([
            {
                $match: {
                    _id: { $ne: req.user.userId},
                },
            },
            { $sample: { size: 20 } },
        ]);
        const friendIds = friendz.friends.map(friend => friend._id.toString());
        const filteredUsers = users.filter(user => { 
            const userIdStr = user._id.toString(); 
            return userIdStr !== req.user.userId && !friendIds.includes(userIdStr); 
        });
        console.log(filteredUsers)
        const suggestedUsers = filteredUsers.slice(0, 8)
        suggestedUsers.forEach((user)=> { user.password = null });
        res.status(200).json({ success: true, suggestedUsers});
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

const forgotPassword = async(req, res) => {
    try {
       const { email } = req.body;
        const user = await userModel.findOne({ email });
    
        if (!user) {
        return res.json({
            success: false,
            message: "Email Does Not Exist"
        });
        }
    
        const token = crypto.randomBytes(20).toString('hex');
        user.verificationToken = token;
    // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
        await user.save();
        const topic = "Password Reset Request";
        const info = `<div><p>${user.firstname} ${user.lastname},</p> <p>An attempt was made to reset the password of your account.</p>
        <p>If this was you click on the link below:</p> <br> <a href="${process.env.ORIGIN}/reset-password/${user.verificationToken}">click here</a> <p>You can ignore the message if you didn't make the request.</p></div>`
        await sendMail(user.email, topic, info) 
        res.status(200).json({
            success: true,
            message: "Password Reset Link Sent"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "An error occurred!"
        })
    }

    
}

const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {  newPassword } = req.body;

        if(!newPassword) {
            return res.json({success: false, message: "Password required"});
        }
        const user = await userModel.findOne({verificationToken: token});
        if(!user) {
            return res.json({
                success: false,
                message: "Inavlid token"
            })
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, `${salt}`);

        user.password = hashedPassword;
        user.verificationToken = null;
        await user.save()
        const topic = "Password Reset Successful";
        const info = `<div><p>Your password has been reset successfully.</p></div>`

        await sendMail(user.email, topic, info);
        res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error: true,
            message: "Something went wrong!"
        })
    }
}

const emailVerification = async(req, res) => {
    try {
        const { token } = req.params;
        const user = await userModel.findOne({verificationToken: token});
        if(!user) {
             return res.json({
                success: false,
                message: "invalid token!"
            })
        }
        user.verified = true;
        user.verificationToken = null;
        await user.save();
        const msg = `<p>Your Email Verification is Successful.</p>`;
        const sub = "Email Verified";
        await sendMail(user.email, sub, msg)
        res.status(200).json({
            success: true,
            message: "Verified Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: true,
            message: "An error occurred!"
        })
    }
}





module.exports = { userRegisteration, forgotPassword, emailVerification, resetPassword, updateCoverImg, updateAbout, updateProfilePhoto, googleAuthSignUp, allUsers, getMutualFriends, userLogin, searchUsers, logout, getSuggestions, getuserDetails, updateProfile, googleAuthLogin, getAllFriends}