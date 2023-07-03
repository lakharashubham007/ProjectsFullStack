// import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import Video from './components/Video';
import { Route, Switch } from "react-router-dom";

export const config = {
  endpoint: `https://de5966ae-6e41-497b-8ef1-d3feb05ffeba.mock.pstmn.io/v1`,
};

function App() {
  return (
    <div className="App">
       <Switch>
        <Route exact path="/">
            <Dashboard/>
        </Route>

        <Route exact path="/videos/:id">
            <Video />   
        </Route> 
    </Switch>
    </div>
  );
}

export default App;
