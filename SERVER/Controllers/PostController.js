const notificationModel = require('../Models/NotificationModel');
const postModel = require('../Models/PostModel');
const userModel = require('../Models/UserModel');
const fs = require('fs');
const path = require('path');


const createPost = async(req, res, io) => {
    try {
        const {text, image, video} = req.body;
        const newPost = new postModel({
            user: req.user.userId,
            text,
            image,
            video
        })
        await newPost.save();
        const user = await userModel.findById(req.user.userId).populate('friends'); 
        const friends = user.friends;
        friends.forEach(friend => {
            const notification = new notificationModel({ 
                from: req.user.userId, 
                to: friend._id, 
                type: 'newPost', 
                read: false, 
                postId: newPost._id 
            });
            notification.save(); 
            io.to(friend._id.toString()).emit('newNotification', notification);
        })
        res.status(201).json({
            success: true,
            newPost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error!"
        })
    }
}

const likeUnlikePost = async(req, res)=> {
    try {
        const post = await postModel.findById(req.params.id);
        if(!post) {
            return res.json({
                error: true,
                message: "Not found"
            })
        }
        const likedPost = post.likes.includes(req.user.userId);
        if(likedPost) {
            // unlike Post
            post.likes.pull(req.user.userId);
            await post.save();
        } else {
            post.likes.push(req.user.userId)
            await post.save();
        }
        const updatedPost = await postModel.findById(req.params.id).populate({
            path: "user",
            select: "-password"
        });
        res.status(200).json({success: true, message: "Post Like", updatedPost})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error!"
        })
    }
}

const commentOnPost = async(req, res)=> {
    try {
        const { newText } = req.body;
        
        const post = await postModel.findById(req.params.id).populate({
            path: 'comments.user',
            select: '-password'
        }); // Fetch the post by ID 
        if (!post) { 
            return res.status(404).json({ error: true, message: "Post not found" }); 
        }
        
        const comment = {user: req.user.userId, text: newText};
        post.comments.push(comment);
        await post.save();
        res.status(200).json({ success: true, post})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error!"
        })
    }
}

const getPostById = async(req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        }); 
        res.status(200).json({
            success: true,
            error: false,
            post
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error"
        })
    }
}

const deletePost = async(req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if(!post)  {
            res.json({
                success: false,
                message: "delete Usuccessful"
            });
        }

        if (post.image) { 
            const imagePath = path.join(__dirname, '..', '..', post.image);
            console.log('Deleting image at:', imagePath);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => { 
                    if (err) { 
                        console.error('Error deleting image file:', err); 
                    } 
                });  
            } else { console.log('Image file does not exist:', imagePath); }
        }
        if (post.video) { 
            const videoPath = path.join(__dirname, '..', '..', post.video);
            console.log('Deleting video at:', videoPath);
            if (fs.existsSync(videoPath)) {
                fs.unlink(videoPath, (err) => { 
                    if (err) { 
                        console.error('Error deleting video file:', err); 
                    } 
                }); 
            } else { console.log('Video file does not exist:', videoPath); }
            
        }
        /*if (post.image) { 
            const imagePath = path.join(__dirname, '../uploads/images/', post.image); 
            fs.unlink(imagePath, (err) => { 
                if (err) { 
                    console.error('Error deleting image file:', err); 
                } 
            });
        }

        if (post.video) { 
            const videoPath = path.join(__dirname, '../uploads/videos/', post.video); 
            fs.unlink(videoPath, (err) => { 
                if (err) { 
                    console.error('Error deleting video file:', err); 
                } 
            }); 
        }*/
        await postModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error!"
        })
    }
}

const getAllPosts = async(req, res)=> {
    try {
        const posts = await postModel.find({}).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        }); 
        res.status(200).json({
            success: true,
            error: false,
            posts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "Error"
        })
    }
}

const postByUserId = async (req, res) => {
    try {
        const myPosts = await postModel.find({user: req.params.id}).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });
        res.status(200).json({
            success: true,
            myPosts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving posts"
        })
    }
}
module.exports = { createPost, getPostById, likeUnlikePost, commentOnPost, postByUserId, deletePost, getAllPosts };
