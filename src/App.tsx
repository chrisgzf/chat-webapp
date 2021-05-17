import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import PageAudioCall from "./pages/PageAudioCall";
import PageChannelForm from "./pages/PageChannelForm";

function App() {
  // Hack to use 100vh without including browser bar on mobile
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  return (
    <Router>
      <Switch>
        <div className="App">
          <Route exact path="/">
            <PageChannelForm />
          </Route>
          <Route path="/:channelName">
            <PageAudioCall />
          </Route>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
