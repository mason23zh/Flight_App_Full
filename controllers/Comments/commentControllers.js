const Comment = require("../../models/airport_comment/commentModel");
const factory = require("../factoryController");

exports.setCommentUserId = (req, res, next) => {
    if (!req.body.airport) {
        req.body.airport = req.params.airportId;
    }
    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    next();
};

exports.getAllComments = factory.getAll(Comment);

exports.createComment = async (req, res) => {
    const { comment, landingRate, route, originAirport, destinationAirport, airport, user } = req.body;
    const newReview = await Comment.create({
        comment,
        landingRate,
        route,
        originAirport,
        destinationAirport,
        airport,
        user,
    });
    res.status(201).json({
        status: "success",
        data: {
            newReview,
        },
    });
};
