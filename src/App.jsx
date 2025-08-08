import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import AuthPage from "./components/Authpage";
import Dashboard from "./components/Dashboard";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <>
            <Navigation />
            <Header data={landingPageData.Header} />
            <About data={landingPageData.About} />
            <Testimonials data={landingPageData.Testimonials} />
            <Team data={landingPageData.Team} />
            <Contact data={landingPageData.Contact} />
          </>
        </Route>
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
};

export default App;
