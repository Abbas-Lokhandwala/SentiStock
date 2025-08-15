import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Testimonials } from "./components/testimonials";
import { Contact } from "./components/contact";
import AuthPage from "./components/Authpage";
import Dashboard from "./components/Dashboard";

import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";

import "./App.css";

// Smooth scrolling for anchor links
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const LandingPage = () => (
    <>
      <Navigation />
      <Header data={landingPageData.Header} />
      <About data={landingPageData.About} />
      <Testimonials data={landingPageData.Testimonials} />
      <Contact data={landingPageData.Contact} />
    </>
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route render={() => <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>} />
      </Switch>
    </Router>
  );
};

export default App;
