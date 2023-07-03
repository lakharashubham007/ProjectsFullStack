const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getVideo = {
  params: Joi.object().keys({
    videoId: Joi.string().custom(objectId),
  }),
};

const addVideo = {
    body: Joi.object().keys({
    videoLink: Joi.string().required(),
    title: Joi.string().required(),
    genre: Joi.string().required(),
    contentRating: Joi.string().required(),
    releaseDate: Joi.string().required(),
    previewImage: Joi.string().required(),
    }),
  };

  const updateVotes = {
    body: Joi.object().keys({
    vote: Joi.string().required(),
    change: Joi.string().required()
    }),
  };



module.exports = {
  getVideo,
  addVideo,
  updateVotes,
};
