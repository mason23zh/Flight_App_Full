const APIFeatures = require("../utils/apiFeatures");
const NotFoundError = require("../common/errors/NotFoundError");

exports.getAll = (Model) => async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query).filter().sort().limitFields().paginate();

    const doc = await features.query;

    if (!doc) {
        throw new NotFoundError("No document found.");
    }

    res.status(200).json({
        status: "success",
        result: doc.length,
        data: {
            data: doc,
        },
    });
};
