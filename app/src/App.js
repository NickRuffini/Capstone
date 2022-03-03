import './App.css';
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <h1> Covid-19 Analytics </h1>
        <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
        >
          <Link to="/home">Home</Link> |{" "}
          <Link to="/gdp">GDP vs Vacc</Link> |{" "}
        </nav>
        <Outlet/>
    </div>
    
  );
}

export default App;
