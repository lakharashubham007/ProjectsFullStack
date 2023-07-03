import React from "react";
import "./Dashboard.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useHistory } from "react-router-dom";

const VideoCard= (props)=>{
  const history = useHistory();
  const { id, imgLink, genre, title, releaseDate } = props;
  // console.log(id);
    return (
         <Card sx={{ maxWidth: 345,background:"black",color:"white"}} key={id} onClick={()=>{
          history.push(`/videos/${id}`)}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imgLink}
          alt="img"
          id={id}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="gray">
           {releaseDate}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
   )
}
export default VideoCard;