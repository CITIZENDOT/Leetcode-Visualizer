import React from "react";
import uniqueTags from "./tags.json";
import tagsData from "./TagsData.json";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

function parseTotalData(apiData, tags) {
  const _data = {};
  const data = [];
  const notac_questions = [];
  tags.forEach((tag) => {
    _data[tag] = {
      ac_easy: 0,
      ac_medium: 0,
      ac_hard: 0,
      notac_easy: 0,
      notac_medium: 0,
      notac_hard: 0,
      null_easy: 0,
      null_medium: 0,
      null_hard: 0,
    };
  });

  apiData.stat_status_pairs.forEach((element) => {
    const id = element.stat.question_id.toString();
    if (element.status === "notac" && id in tagsData) {
      const topicTags = tagsData[id].tags;
      notac_questions.push({
        id: id,
        title: element.stat.question__title,
        difficulty: element.difficulty.level,
        tags: topicTags.join(", "),
        url: `https://leetcode.com/problems/${element.stat.question__title_slug}`,
      });
    }
    if (id in tagsData) {
      const topicTags = tagsData[id].tags;
      topicTags.forEach((tag) => {
        if (element.status === "ac") {
          if (element.difficulty.level === 1) _data[tag].ac_easy++;
          else if (element.difficulty.level === 2) _data[tag].ac_medium++;
          else if (element.difficulty.level === 3) _data[tag].ac_hard++;
        } else if (element.status === "notac") {
          if (element.difficulty.level === 1) _data[tag].notac_easy++;
          else if (element.difficulty.level === 2) _data[tag].notac_medium++;
          else if (element.difficulty.level === 3) _data[tag].notac_hard++;
        } else if (element.status == null) {
          if (element.difficulty.level === 1) _data[tag].null_easy++;
          else if (element.difficulty.level === 2) _data[tag].null_medium++;
          else if (element.difficulty.level === 3) _data[tag].null_hard++;
        }
      });
    }
  });
  Object.keys(_data).forEach(function (tag) {
    data.push({
      name: tag,
      ..._data[tag],
    });
  });
  return [data, notac_questions];
}

export default function CategoryPlots({ apiData }) {
  const [loading, setLoading] = React.useState(true);
  const [selectedTags, setSelectedTags] = React.useState(["Array"]);
  const [data, setData] = React.useState("");
  const [totalData, setTotalData] = React.useState("");
  const [mode, setMode] = React.useState("ac");
  const theme = useTheme();
  const notac_questions = React.useRef([]);

  React.useEffect(() => {
    let _parsed;
    [_parsed, notac_questions.current] = parseTotalData(
      apiData,
      uniqueTags,
      notac_questions
    );
    setTotalData(_parsed);
  }, [apiData]);

  React.useEffect(() => {
    setLoading(false);
    if (totalData)
      setData(totalData.filter((tagObj) => selectedTags.includes(tagObj.name)));
  }, [totalData, selectedTags]);

  React.useEffect(() => {
    if (totalData)
      setData(totalData.filter((tagObj) => selectedTags.includes(tagObj.name)));
  }, [selectedTags, totalData]);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const xs = useMediaQuery(theme.breakpoints.up("xs"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  return loading ? (
    <CircularProgress />
  ) : (
    <Grid item xs={12} md={10} style={{ margin: "0 10px" }}>
      <Grid container justify="space-around">
        <Grid item xs={11} md={7}>
          <Autocomplete
            onChange={(event, value) => {
              setSelectedTags(value);
            }}
            multiple
            options={uniqueTags}
            getOptionLabel={(tag) => tag}
            defaultValue={[uniqueTags[0]]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Category"
              />
            )}
          />
        </Grid>
        <Grid item xs={11} md={3}>
          <FormControl component="fieldset">
            <RadioGroup row value={mode} onChange={handleModeChange}>
              <FormControlLabel
                value="ac"
                control={<Radio />}
                label={<Typography variant="body2">Accepted</Typography>}
              />
              <FormControlLabel
                value="notac"
                control={<Radio />}
                label={<Typography variant="body2">Not Accepted</Typography>}
              />
              <FormControlLabel
                value="null"
                control={<Radio />}
                label={<Typography variant="body2">Unattempted</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      {data ? (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={`${mode}_easy`} stackId="a" fill="#8884d8" />
            <Bar
              dataKey={`${mode}_medium`}
              stackId={
                (xs && selectedTags.length <= 2) ||
                (md && selectedTags.length <= 3) ||
                (lg && selectedTags.length <= 4)
                  ? "b"
                  : "a"
              }
              fill="#82ca9d"
            />
            <Bar
              dataKey={`${mode}_hard`}
              stackId={
                (xs && selectedTags.length <= 2) ||
                (md && selectedTags.length <= 3) ||
                (lg && selectedTags.length <= 4)
                  ? "c"
                  : "a"
              }
              fill="#ffc658"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : null}

      {notac_questions.current ? (
        <Grid item xs={11}>
          <List>
            <Typography variant="h5" align="center">
              <b>Unsolved Problems</b>
            </Typography>
            {notac_questions.current.map((question) => {
              return (
                <ListItem>
                  <ListItemText
                    primary={
                      <Link href={question.url} target="_blank" color="inherit">
                        {question.title}
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography>
                          Difficulty: {question.difficulty}
                        </Typography>
                        <Typography>Category: {question.tags}</Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Grid>
      ) : null}
    </Grid>
  );
}
