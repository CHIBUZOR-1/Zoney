const notificationModel = require('../Models/NotificationModel');
const postModel = require('../Models/PostModel');

const createPost = async(req, res) => {
    try {
        const {text, image, video} = req.body;

        const newPost = new postModel({
            user: req.user.userId,
            text,
            image,
            video
        })
        await newPost.save();
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
        const likedPost = post.likes.includes(req.user.userId)
        if(likedPost) {
            // unlike Post
            await post.updateOne({_id: req.params.id}, {"$pull": {likes: req.user.userId}})
            res.status(200).json({success: true, message: "Post unliked"})
        } else {
            post.likes.push(req.user.userId)
            const notification = new notificationModel({
                from: req.user.userId,
                to: post.user,
                type: "like"
            })
            await notification.save()
            res.status(200).json({success: true, message: "Post Like"})
        }
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
        const { text } = req.body;
        if(!text) {
            res.json({
                error: true,
                message: "Cannot be empty"
            })
        }
        const post = await postModel.findById(req.params.id);
        if(!post) {
            return res.sjson({
                error: true,
                message: "Not Found"
            })
        }
        const comment = {user: req.user.userId, text};
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: true,
            message: "Error!"
        })
    }
}

const sharepost = async() => {

}

const deletePost = async(req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.id);
        if(post) {
            return res.json({
                error: false,
                message: "Deleted"
            })
        } else {
            res.json({
                error: false,
                message: "delete Usuccessful"
            });
        }
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
module.exports = { createPost, likeUnlikePost, commentOnPost, sharepost, deletePost, getAllPosts };
