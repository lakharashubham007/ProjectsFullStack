import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import "./GenrePanel.css";
import MuiToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { genreList, contentRating } from "./data";

const ToggleButton = styled(MuiToggleButton)({
  borderRadius: 50,
  fontSize: "0.8rem",
  margin: "0.7rem",
  color: "#E5E5E5", //white
  backgroundColor: "#252526", //black
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "#252526",
    backgroundColor: "#E5E5E5",
    borderRadius: 18,
  },
});

const SortByButton = ({ handleSortBy }) => {
  const [isViewCount, setIsViewCount] = useState(false);
  return (
    <ToggleButton
      value="SortBy"
      selected={true}
      onChange={() => {
        setIsViewCount(!isViewCount);
        handleSortBy(isViewCount);
      }}
    >
      Sort By: {isViewCount ? "View Count" : "Release Date"}
    </ToggleButton>
  );
};
const ContentPanel = ({ handleSearchContentRating }) => {
  const [alignment, setAlignment] = React.useState("Any age group");
  const [selected, setSelected] = React.useState(true);

  const handleAlignment = (event, newAlignment) => {
    setSelected(false);
    setAlignment(newAlignment); //alignment- previous value newAlignment- present value

    if (!newAlignment) {
      setSelected(true);
      setAlignment("Any age group");
    }
    handleSearchContentRating(newAlignment);
  };
  return (
    <div>
      <ToggleButton
        value="Any age group"
        selected={selected}
        onChange={() => {
          setSelected(true);
          setAlignment("Any age group");
        }}
      >
        Any age group
      </ToggleButton>

      {contentRating.map((item, index) => {
        return (
          <ToggleButtonGroup
            key={index}
            value={alignment}
            exclusive
            onChange={handleAlignment}
          >
            <ToggleButton key={item.id} value={item.ageLimit}>
              {item.ageLimit}
            </ToggleButton>
          </ToggleButtonGroup>
        );
      })}
    </div>
  );
};

const GenrePanel = ({
  handleSearchGenre,
  handleSearchContentRating,
  handleSortBy,
}) => {
  // const data = "Thisisdata"
  const [selected, setSelected] = React.useState(true);
  const [formats, setFormats] = React.useState(() => []);

  const handleFormat = (event, newFormats) => {
    setSelected(false);
    setFormats(newFormats);
    if (newFormats.length === 0) {
      setSelected(true);
    }
    // console.log(newFormats);
    handleSearchGenre(newFormats);
  };
  return (
    <div className="panel">
      <ToggleButton
        value="All Genre"
        selected={selected}
        onChange={() => {
          setSelected(true);
          setFormats([]);
        }}
      >
        All Genre
      </ToggleButton>

      {genreList.map((item, index) => {
        return (
          <ToggleButtonGroup
            key={index}
            value={formats}
            onChange={handleFormat}
          >
            <ToggleButton key={item.id} value={item.genre}>
              {item.genre}
            </ToggleButton>
          </ToggleButtonGroup>
        );
      })}

      <SortByButton handleSortBy={handleSortBy} />
      <ContentPanel handleSearchContentRating={handleSearchContentRating} />
      <br />
      <br />
    </div>
  );
};
export default GenrePanel;
