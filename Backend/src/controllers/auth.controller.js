const authModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model");


const registerUser = async (req, res) => {

    const { email, username, password } = req.body;

    if(!email || !username || !password) {
        return res.status(400).json({
            message: "Email, Username, password are required"
        });
    }

    const isUserAlreadyExists = await authModel.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if(isUserAlreadyExists) {
        return res.status(409).json({
            message: "User with same username or email already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await authModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username
        }, 
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    });

}

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await authModel.findOne({ email });

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username
        }, 
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged-in successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    });

}

const logoutUser = async (req, res) => {

    const token = req.cookies.token;

    if(token) {
        await blacklistTokenModel.create({ token });
    }

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged-out successfully"
    });
}

const getMe = async (req, res) => {

    const user = await authModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    });

}


module.exports = { 
    registerUser,
    loginUser,
    logoutUser,
    getMe
};