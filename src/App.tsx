import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import PageAudioCall from "./pages/PageAudioCall";
import PageChannelForm from "./pages/PageChannelForm";

function App() {
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
