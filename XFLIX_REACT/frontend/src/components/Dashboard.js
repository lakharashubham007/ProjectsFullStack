import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import { config } from "../App";
import VideoCard from "./VideoCard";
import Header from "./Header";
import GenrePanel from "./GenrePanel";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import { Button, Stack } from "@mui/material";

import Box from "@mui/material/Box";
import VideoModalForm from "./VideoModalForm";

const Dashboard = () => {
  const [videoList, setVideoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchGenre, setSearchGenre] = useState([]);
  const [searchContentRating, setSearchContentRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);

  const handleSearchGenre = (data) => {
    setSearchGenre(data);

    if (data.length > 0) {
      performSearchByGenre(data.join());
    }
  };
  const handleSearchContentRating = (data) => {
    setSearchContentRating(data.slice(0, -1));

    if (data.length > 0) {
      performSearchByContent(data.slice(0, -1));
    }
  };
  const handleSortBy = (isViewCount) => {
    if (isViewCount) {
      setSortBy("viewCount");
      performSortBy("viewCount");
    } else {
      setSortBy("releaseDate");
      performSortBy("releaseDate");
    }
  };
  useEffect(() => {
    const callAPI = async () => {
      const videosResponseAPI = await performAPICall();
      setVideoList(videosResponseAPI);
    };

    callAPI();
  }, []); // <-- empty array means 'run once'

  const debounceSearch = (event, debounceTimeout) => {
    setSearchText(event.target.value);
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);
    setDebounceTimeout(timeout);
  };

  let timeout;

  const performSearch = async (text) => {
    if (searchGenre.length > 0 || searchContentRating.length > 0) {
      performMultipleFilters(text, searchGenre, searchContentRating);
    }
    try {
      const { data } = await axios.get(
        config.endpoint + `/videos?title=${text}`
      );

      setFilteredList(data);
    } catch (error) {
      setFilteredList([]);
      clearInterval(timeout);
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };

  const performSearchByGenre = async (genre) => {
    if (searchText.length > 0 || searchContentRating.length > 0) {
      performMultipleFilters(searchText, genre, searchContentRating);
    }

    try {
      const { data } = await axios.get(
        config.endpoint + `/videos?genres=${genre}`
      );

      setFilteredList(data);
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
  const performSearchByContent = async (ageGroup) => {
    // console.log(ageGroup);
    if (searchText.length > 0 || searchGenre.length > 0) {
      performMultipleFilters(searchText, searchGenre, ageGroup);
    }
    try {
      const { data } = await axios.get(
        config.endpoint + `/videos?contentRating=${ageGroup}%2B`
      );

      setFilteredList(data);
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
  const performSortBy = async (option) => {
    try {
      const { data } = await axios.get(
        config.endpoint + `/videos?sortBy=${option}`
      );

      setFilteredList(data);
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
  const performMultipleFilters = async (text, genre, contentRating) => {
    // console.log("filters")

    if (genre.length === 0) genre = "All";
    if (contentRating === "") contentRating = "Anyone";
    else contentRating = contentRating + "%2B";
    let url = `/videos?title=${text}&genres=${genre}&contentRating=${contentRating}`;

    try {
      const { data } = await axios.get(config.endpoint + url);
      // console.log("data::",text,genre,contentRating,data);
      setFilteredList(data);
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
      <Header>
        <Box
          sx={{
            width: 573,
          }}
        >
          <TextField
            className="search"
            size="small"
            fullWidth
            placeholder="Search"
            name="search"
            onChange={(e) => {
              debounceSearch(e, debounceTimeout);
            }}
            InputProps={{
              style: {
                color: "white",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <Stack direction="row">
            <VideoModalForm />
            {/* <Button variant="contained" sx={{ backgroundColor: "#4CA3FC" }} onClick={handleUpload}><UploadIcon />Upload</Button> */}
          </Stack>
        </Box>
      </Header>
      <GenrePanel
        handleSearchGenre={handleSearchGenre}
        handleSearchContentRating={handleSearchContentRating}
        handleSortBy={handleSortBy}
      />
      <Grid container spacing={2} mt={1}>
        {searchText.length > 1 ||
        searchGenre.length > 0 ||
        searchContentRating.length > 0 ||
        sortBy.length > 0
          ? filteredList.videos &&
            filteredList.videos.map((video, index) => {
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
            })
          : videoList.videos &&
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
};
export default Dashboard;
