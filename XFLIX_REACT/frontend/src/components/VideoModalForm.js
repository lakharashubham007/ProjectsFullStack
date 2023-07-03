import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import UploadIcon from "@mui/icons-material/Upload";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { genreList, contentRating } from "./data";
import FormHelperText from "@mui/material/FormHelperText";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { config } from "../App";
import axios from "axios";

export default function VideoModalForm() {
  const [open, setOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(dayjs());

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", {
      month: "short",
    });
  }

  const [formData, setFormData] = useState({
    videoLink: "",
    title: "",
    genre: "",
    contentRating: "",
    releaseDate: "",
    previewImage: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      videoLink: "",
      title: "",
      genre: "",
      contentRating: "",
      releaseDate: "",
      previewImage: "",
    });
  };

  const handleSubmit = () => {
    setOpen(false);
    performPostApiCall(formData);
  };
  const handleChange = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData((nextFormData) => ({ ...nextFormData, [key]: value }));
    if (currentDate) {
      setFormData((nextFormData) => ({
        ...nextFormData,
        releaseDate: [
          currentDate.$D,
          toMonthName(currentDate.$M),
          currentDate.$y,
        ].join(" "),
      }));
    }
  };

  const performPostApiCall = async (formData) => {
    try {
      const { response } = await axios.post(
        config.endpoint + `/videos`,
        formData
      );
      setFormData({
        videoLink: "",
        title: "",
        genre: "",
        contentRating: "",
        releaseDate: "",
        previewImage: "",
      });
    } catch (error) {
      setFormData({
        videoLink: "",
        title: "",
        genre: "",
        contentRating: "",
        releaseDate: "",
        previewImage: "",
      });

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
    <div>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#4CA3FC" }}
        onClick={handleClickOpen}
      >
        <UploadIcon />
        Upload
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            placeholder="Video Link"
            helperText="This link will be used to derive the video"
            variant="outlined"
            fullWidth
            name="videoLink"
            value={formData.videoLink}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            placeholder="Thumbnail image Link"
            helperText="This link will be used to preview the thumbnail image"
            variant="outlined"
            fullWidth
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            placeholder="Title"
            helperText="This title will be the representative text for video"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              name="genre"
              value={formData.genre}
              label="Genre"
              onChange={handleChange}
            >
              {genreList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.genre}>
                    {item.genre}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>
              Genre will help in categorizing your videos
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
            <InputLabel>Suitable age group for the clip</InputLabel>
            <Select
              name="contentRating"
              value={formData.contentRating}
              onChange={handleChange}
              label="Suitable age group for the clip"
            >
              {contentRating.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.ageLimit}>
                    {item.ageLimit}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>
              This will be used to filter videos on age group suitability
            </FormHelperText>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <DatePicker
                views={["day"]}
                value={currentDate}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue) => {
                  setCurrentDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText="This will be used to sort videos"
                  />
                )}
              />
            </Stack>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
