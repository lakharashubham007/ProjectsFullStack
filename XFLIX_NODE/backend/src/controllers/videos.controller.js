const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { videosService } = require("../services");


const getVideos = catchAsync(async (req, res) => {
  let data;
  if(Object.keys(req.query).length >0){
    data = await videosService.getQueriedVideos(req.query)
  }else{
    data = await videosService.getAllVideos()
  }
  if (data === null) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
    res.status(httpStatus.OK).send({
      "videos": data
    });
});

const getVideoById = catchAsync(async (req,res) => {
  const data = await videosService.getVideoById(req.params);
  if (data === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }
  res.status(httpStatus.OK).send(data);
});

const addVideo = catchAsync(async (req,res) => {
  const video = req.body;
  const data = await videosService.addVideo(video);
  if (data === null) {
    throw new ApiError(httpStatus[500], "Internal Server Error");
  }
  res.status(httpStatus.CREATED).send(data);
});

const updateViews = catchAsync(async (req,res) => {
  const data = await videosService.updateViews(req.params);
  if (data === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const updateVotes = catchAsync(async (req,res) => {
  const data = await videosService.updateVotes(req);
  if (data === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  getVideos,
  getVideoById,
  addVideo,
  updateViews,
  updateVotes
};
