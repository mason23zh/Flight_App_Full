const jwt = require("jsonwebtoken");
const User = require("../models/users/userModel");
const BadRequestError = require("../common/errors/BadRequestError");
const UnAuthorizedError = require("../common/errors/UnAuthorizedError");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

exports.signup = async (req, res, next) => {
    try {
        // Create new user
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt,
        });

        // Create JWT token
        const token = signToken(newUser._id);

        res.status(201).json({
            status: "success",
            token,
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError("Please Provide Email Or Password");
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new UnAuthorizedError("Email or Password Not Correct");
        }

        // Create JWT Token
        const token = signToken(user._id);

        res.status(201).json({
            status: "success",
            token,
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};
