const mongoose = require("mongoose");

const videosSchema = mongoose.Schema(
    {
        videoLink: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        contentRating: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: String,
            required: true,
        },
        previewImage: {
            type: String,
            required: true,
            trim: true,
        },
        votes:{
                upVotes: {
                    type: Number,
                    default: 0
                },
                downVotes: {
                    type:Number,
                    default: 0
                },
        },
        viewCount: {
            type: Number,
            default: 0
        }
    },{
        timestamps: false
    }
);

// videosSchema.index( { title_lower: "text" } )

const Videos = mongoose.model("Videos", videosSchema);

module.exports = {
    Videos,
};
