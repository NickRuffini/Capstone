import React, {Component} /*, {useState, useEffect}*/ from "react";
import Grid from "@material-ui/core/Grid";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
//import Axios from 'axios';

class Home extends Component {

  state = {
    isLoading: true,
    countryInfo: []
  }

  async componentDidMount() {
      const response = await fetch('/api/country/SHN');
      const body = await response.json();
      this.setState({countryInfo :body, isLoading: false});
  }

  //const[countryList, setCountryList] = useState([])

  /*useEffect(() => {
    Axios.get('http://localhost:8080/api/country/SHN').then((response) => {
      setCountryList(response.data.recordset)
      console.log(countryList);
    })
  }, [])*/
  render() {
    const {countryInfo, isLoading} = this.state;
    console.log(countryInfo);

    if(isLoading) {
      return(<div>Loading...</div>)
    }

    const countryNameInfo = [];
    for (let i = 0; i < countryInfo.length; i++) {
      countryNameInfo[i] = countryInfo.at(i)['location']
    }

    return(
      <main style={{ padding: "1rem 0" }}>
      <h2>General Takeaways</h2>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={3}>
          <Dropdown options={countryNameInfo} placeholder="Countries" />
        </Grid>
        <Grid item xs={3}>
          <Dropdown placeholder="Criteria"/>
        </Grid>
      </Grid>
    </main>
    );
  }
}

export default Home;