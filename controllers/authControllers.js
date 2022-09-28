const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/users/userModel");
const BadRequestError = require("../common/errors/BadRequestError");
const UnAuthorizedError = require("../common/errors/UnAuthorizedError");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    //send cookie
    if (process.env.NODE_DEV === "production") {
        cookieOptions.secure = true;
    }
    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.protect = async (req, res, next) => {
    // Get the token and check if the token is exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new UnAuthorizedError("You are not logged in, please login first.");
    }

    // Token Validation
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        throw new UnAuthorizedError("Invalid Token, user does not exist");
    }

    // Check if user change password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        throw new UnAuthorizedError("Password has already changed, please login again");
    }

    // Grant Access to protected user
    req.user = currentUser;
    next();
};

exports.signup = async (req, res, next) => {
    // Create new user
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    // Create JWT token
    //const token = signToken(newUser._id);
    createSendToken(newUser, 201, res);
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please Provide Email Or Password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new UnAuthorizedError("Email or Password Not Correct");
    }

    // Create and send JWT Token
    createSendToken(user, 200, res);
};
