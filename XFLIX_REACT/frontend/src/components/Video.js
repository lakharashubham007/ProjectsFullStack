import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { config } from "../App";
import Stack from "@mui/material/Stack";
// import * as React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActions, CardActionArea } from "@mui/material";
// import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
// import Box from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import VideoCard from "./VideoCard";


const Button = styled(MuiButton)(({ pill }) => ({
  borderRadius: 50,
  borderColor: "white",
  fontSize: "0.8rem",
  margin: "0.7rem",
  color: "#E5E5E5",
  // backgroundColor:"#E5E5E5",
  ":hover": {
    color: "#252526", //black
    backgroundColor: "#E5E5E5" //white
  }
}));
const handleUpvote= async(videoId)=>{
  // console.log("upvote")
  
  try {
    const {response} = await axios
  .patch(config.endpoint + `/videos/${videoId}/votes`, {
    vote: "upVote",
    change: "increase"
}, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
  });
  // console.log(videoId,response);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(error.response.data.message);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }

}
const handleDownvote= async(videoId)=>{
  // console.log("upvote")
  try {
    const {response} = await axios
  .patch(config.endpoint + `/videos/${videoId}/votes`, {
    vote: "downVote",
    change: "increase"
}, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
  });
  // console.log(videoId,response);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(error.response.data.message);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
}
const VideoFrame = ({ video }) => {
  const { _id, title, videoLink, contentRating, releaseDate, upVotes ,downVotes} = video;

  return (
    <div>
      <Stack justifyContent="center" alignItems="center" spacing={2}>
        <Card sx={{ maxWidth: 700,backgroundColor:"black",color:"white" }}>
          <CardActionArea>
            <iframe
              src={`https://www.${videoLink}?autoplay=1`}
              title={title}
              frameBorder="0"
              allow="autoplay"
              // allow="fullscreen"
              allowFullScreen
              width="700"
              height="400"
            />
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Stack spacing={2}
                justifyContent="space-between"
                alignItems="flex-start">
                  <Typography gutterBottom variant="h6" component="div">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {contentRating} {releaseDate}
                  </Typography>
                </Stack>
                <CardActions>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="flex-start"
                >
                  <Button  variant="contained" onClick={()=>handleUpvote(_id)}>
                  {upVotes}
                  </Button>
                  <Button   variant="contained" onClick={()=>handleDownvote(_id)}>
                  {downVotes}
                  </Button>
                </Stack>
                </CardActions>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </div>
  );
};


const getVideoById= async(videoId)=>{
    try {
        const { data } = await axios.get(
          config.endpoint + `/videos/${videoId}`
        );
        // console.log("data::",data);
        return data;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      }
}

const Video = () => {
    const params = useParams();
    // console.log("params",params.id);
    const [video, setVideo] = useState({});
    const [videoList, setVideoList] = useState([]);

    useEffect(() => {
        const callAPI = async () => {
            const videosResponseAPI = await getVideoById(params.id);
            if(videosResponseAPI){
              setVideo({
                _id:videosResponseAPI._id,
                title: videosResponseAPI.title,
                videoLink: videosResponseAPI.videoLink,
                contentRating: videosResponseAPI.contentRating,
                releaseDate: videosResponseAPI.releaseDate,
                upVotes: videosResponseAPI.votes.upVotes,  
                downVotes: videosResponseAPI.votes.downVotes,
              }); 
            }
            const allVideos = await performAPICall();
            setVideoList(allVideos);
                    
          };
      
          callAPI();
    }, [params.id]);

    const performAPICall = async () => {
      try {
        const { data } = await axios.get(config.endpoint + `/videos`);
  
        return data;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      }
    };

    return (
        <div className="dashboard">
            <Header/>
            <VideoFrame video={video} />
            <Grid container spacing={2} mt={1}>
            {videoList.videos &&
          videoList.videos.map((video, index) => {
            const { _id, previewImage, genre, title, releaseDate } = video;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <VideoCard
                  imgLink={previewImage}
                  genre={genre}
                  title={title}
                  releaseDate={releaseDate}
                  key={_id}
                  id={_id}
                />
              </Grid>
            );
          })}
          </Grid>
        </div>
      );
}
export default Video;