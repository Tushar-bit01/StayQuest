const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        categories: Joi.array()
                       .items(
                           Joi.string().valid(
                               "Trending",
                               "Rooms",
                               "Iconic City",
                               "Mountain",
                               "Castles",
                               "Amazing pools",
                               "Camping",
                               "Farms",
                               "Arctic"
                           )
                       ),
        // Remove image from here
    }).required(),
    image: Joi.string().allow("").optional() // Place image here, at root level
});
module.exports.reviewSchema=Joi.object({
    review:Joi.object(//ye review form reviw[] wala review h 
        {
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required()
        }
    ).required()
})