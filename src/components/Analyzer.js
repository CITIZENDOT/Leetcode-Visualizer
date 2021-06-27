import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";

import QuestionsLevel from "./plots/QuestionsLevel";
import CategoryPlots from "./plots/CategoryPlots";

function BasicInfo({ apiData }) {
  // TODO: Fetch User details like Avatar, Recent Contest rating etc...
  // This requires backend, Since leetcode has CORS, CSRF protection.

  return (
    <Card elevation={5} style={{ margin: 4 }}>
      <CardActionArea>
        <Link
          href={`https://leetcode.com/${apiData.user_name}`}
          target="_blank"
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <CardHeader
            avatar={
              <Avatar
                style={{ backgroundColor: "rgb(182, 213, 7)" }}
                alt={apiData.user_name}
                src=""
              />
            }
            title={apiData.user_name}
          />
        </Link>
      </CardActionArea>
    </Card>
  );
}

function Analyzer({ submitted }) {
  const [loading, setLoading] = React.useState(true);
  const [apiData, setApiData] = React.useState("");

  React.useEffect(() => {
    setApiData(JSON.parse(localStorage.getItem("APIData")));
    setLoading(false);
  }, []);

  return loading ? (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ minHeight: "80vh" }}
    >
      <Grid item>
        <CircularProgress size={100} />
      </Grid>
    </Grid>
  ) : apiData ? (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6} lg={4} container justify="center">
          <Grid item xs={11}>
            <BasicInfo apiData={apiData} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={8} container justify="center">
          <Grid item xs={12}>
            <QuestionsLevel apiData={apiData} />
          </Grid>
        </Grid>
        <Grid item xs={12} container justify="center">
          <CategoryPlots apiData={apiData} />
        </Grid>
      </Grid>
    </div>
  ) : (
    <Redirect to="/update" />
  );
}

export default Analyzer;
