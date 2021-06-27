import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Layout from "./layout/layout";
import APIContent from "./components/APIContent";
import Analyzer from "./components/Analyzer";

function App() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route
            path="/update"
            render={() =>
              submitted ? (
                <Redirect to="/" />
              ) : (
                <APIContent submitted={submitted} setSubmitted={setSubmitted} />
              )
            }
          />
          <Route path="/" component={Analyzer} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
