const User = require("../models/users/userModel");
const BadRequestError = require("../common/errors/BadRequestError");

/**
 * @param: req.body object
 * @param: array of allowed fields
 * @returns: filtered request body object
 * */
const filterObject = (reqBodyObject, ...allowedFields) => {
    const newObject = {};
    Object.keys(reqBodyObject).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObject[el] = reqBodyObject[el];
        }
    });
    return newObject;
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).send({
        status: "success",
        results: users.length,
        data: users,
    });
};

//TODO: Only allowed name and email update, more features will be added
exports.updateUser = async (req, res) => {
    if (req.body.password || req.body.passwordConfirm) {
        throw new BadRequestError("This route is NOT for password change.");
    }

    const filterBody = filterObject(req.body, "name", "email");

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, { new: true, runValidators: true });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
};

exports.deleteUser = async (req, res) => {
    await User.deleteOne({ _id: req.user.id });

    res.status(204).json({
        status: "success",
        data: null,
    });
};
