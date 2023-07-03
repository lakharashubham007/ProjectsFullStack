const express = require("express");
const validate = require("../../middlewares/validate");
const videosValidation = require("../../validations/videos.validation");
const videosController = require("../../controllers/videos.controller");

const router = express.Router();

router.get("/", videosController.getVideos);
router.get("/:videoId",validate(videosValidation.getVideo),videosController.getVideoById)
router.patch("/:videoId/votes",validate(videosValidation.updateVotes),videosController.updateVotes)
router.patch("/:videoId/views",validate(videosValidation.getVideo),videosController.updateViews)
router.post("/",validate(videosValidation.addVideo),videosController.addVideo)


module.exports = router;
