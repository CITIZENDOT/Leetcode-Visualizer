import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";

import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

function ErrorBlock({ message }) {
  console.log("[ErrorBlock]: ", message, message.length);
  return message ? (
    <Alert severity="error">
      <AlertTitle>Oh Snap! That's an Error</AlertTitle>
      {message}
    </Alert>
  ) : null;
}

function isValidData(data) {
  if (!("user_name" in data)) return false;
  if (!(("ac_easy" in data) & ("ac_medium" in data) & ("ac_hard" in data)))
    return false;
  if (!("stat_status_pairs" in data)) return false;
  if (!Array.isArray(data.stat_status_pairs)) return false;
  return true;
}

function FileUpload({ setData }) {
  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      setData(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <Grid item xs={10}>
      <form>
        <Button
          variant="outlined"
          size="medium"
          color="secondary"
          component="label"
          style={{ marginBottom: 5 }}
          fullWidth
          startIcon={<CloudUploadIcon />}
        >
          Upload File
          <input type="file" hidden onChange={handleUpload} />
        </Button>
      </form>
    </Grid>
  );
}

function APIContent({ submitted, setSubmitted }) {
  const [data, setData] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = e.target.json_content.value;
    try {
      data = JSON.parse(data);
      if (isValidData(data)) {
        localStorage.setItem("APIData", JSON.stringify(data));
        setSubmitted(true);
      } else;
      setError("Given data isn't a valid Leetcode response.");
    } catch (er) {
      setError("Given data isn't a valid JSON response.");
    }
  };

  const handleChange = (event) => {
    setData(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={0} justify="center">
          <Grid item xs={11}>
            <ErrorBlock message={error} />
          </Grid>

          <Grid item xs={11}>
            <List disablePadding dense>
              <ListItem>
                <ListItemIcon>
                  <LabelImportantIcon />
                </ListItemIcon>
                <ListItemText primary="You're probably here because it's your first visit OR to update your data." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LabelImportantIcon />
                </ListItemIcon>
                <ListItemText primary="Make sure you are logged in Leetcode." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LabelImportantIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      Head over to{" "}
                      <Link
                        href="https://leetcode.com/api/problems/algorithms/"
                        target="_blank"
                      >
                        this page
                      </Link>
                      .
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LabelImportantIcon />
                </ListItemIcon>
                <ListItemText primary="Copy the entire content and paste below." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LabelImportantIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Instead, you could download the page content and upload the file here."
                  secondary={
                    "I know this process is cumbersome. Leetcode doesn't have official API. Also, It makes developer's life extremely hard by including reCaptcha, CSRF token, disabling CORS etc..."
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LabelImportantIcon />
                </ListItemIcon>
                <ListItemText primary="Click Submit." />
              </ListItem>
            </List>
          </Grid>
          <FileUpload setData={setData} />

          <Grid item xs={11} style={{ marginBottom: 10 }}>
            <TextField
              label="Paste JSON content here."
              multiline
              rows={12}
              name="json_content"
              variant="outlined"
              fullWidth
              value={data}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={10} md={6} lg={3}>
            <Button type="submit" variant="contained" fullWidth color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default APIContent;
