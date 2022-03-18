import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

class Home extends Component {

  state = {
    isLoading: true,
    countryInfo: [],
    graphInfo: [],
    countrySelected: '',
    criteriaSelected: 'total_deaths_per_million'
  }

  // Initial API call when the component loads up for first time, gets all country names and info for initial graph
  async componentDidMount() {
      Promise.all([fetch('/api/allCountries'), fetch('/api/criteria/total_deaths_per_million')])

      .then(([res1, res2]) => { 
         return Promise.all([res1.json(), res2.json()]) 
      })
      .then(([res1, res2]) => {
        this.setState({countryInfo :res1, graphInfo :res2, isLoading: false});
      });
  }  

  render() {
    // Delete the ones that return null values/aren't integers! (like continent, date, etc.)
    const sortingCriteria = ['total_cases', 'new_cases', 'total_deaths',
                              'new_deaths', 'total_cases_per_million', 'new_cases_per_million', 'total_deaths_per_million',
                              'icu_patients', 'icu_patients_per_million', 'hosp_patients', 'hosp_patients_per_million',
                              'weekly_icu_admissions', 'weekly_icu_admissions_per_million',
                              'weekly_hosp_admissions_per_million',
                              'total_vaccinations', 'people_vaccinated', 'people_fully_vaccinated', 'total_boosters',
                              'new_vaccinations', 'total_vaccinations_per_hundred', 'people_vaccinated_per_hundred',
                              'people_fully_vaccinated_per_hundred', 'total_boosters_per_hundred', 'population_density',
                              'median_age', 'aged_65_older', 'aged_70_older', 'gdp_per_capita', 'extreme_poverty',
                              'cardiovasc_death_rate', 'female_smokers', 'male_smokers', 
                              'handwashing_facilities', 'life_expectancy', 
                              'human_development_index'];

    const {countryInfo, graphInfo, isLoading, countrySelected, criteriaSelected} = this.state;

    // Handles the API call when we change the Country we want to look at in graph
    // 1 case is when there is no criteria to search on as well
    // 2nd case is when there IS a criteria to sort on
    const getCountry = (countryName) => {
      // Default cause, where the criteria hasn't been changed yet!
      if (criteriaSelected === "total_deaths_per_million") {
        Promise.all([fetch('/api/country/onlyCountryInput/' + countryName)])
  
        .then(([res1]) => { 
           return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
          this.setState({graphInfo: res1, countrySelected: countryName});
        });
      }
      else {
        Promise.all([fetch('/api/country/bothInputs/' + countryName + '/' + criteriaSelected)])
  
        .then(([res1]) => { 
           return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
          this.setState({graphInfo: res1, countrySelected: countryName});
        });
      }
    }

    const getCriteria = (criteriaName) => {
      if(countrySelected === "") {
        Promise.all([fetch('/api/criteria/' + criteriaName)])
  
        .then(([res1]) => { 
           return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
          this.setState({graphInfo: res1, criteriaSelected: criteriaName});
        });
      }
      else {
        Promise.all([fetch('/api/country/bothInputs/' + countrySelected + '/' + criteriaName)])
  
        .then(([res1]) => { 
           return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
          this.setState({graphInfo: res1, criteriaSelected: criteriaName});
        });
      }
    }

    if(isLoading) {
      return(<div>Loading...</div>)
    }

    const countryNameInfo = [];
    for (let i = 0; i < countryInfo.length; i++) {
      countryNameInfo[i] = countryInfo.at(i)['location']
    }

    // Graph ---------------------------------------------------------------------------------------------------

    const graphCountryNames = [];
    const graphBarData = [];

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      ArcElement,
      Title,
      Tooltip,
      Legend
    );

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Covid Statistics',
        },
      },
    };

    // Gets the initial names of the countries for the total_deaths_per_million starting query
    for (let i = 0; i < graphInfo.length; i++) {
      graphCountryNames[i] = graphInfo.at(i)['location'] 
    }

    // Gets the values of the graph data, which is stored in the criteriaSelected
    for (let i = 0; i < graphInfo.length; i++) {
      graphBarData[i] = graphInfo.at(i)[criteriaSelected]
    }

    const report2Chart = {
        labels: graphCountryNames,
        datasets: [{
          label: criteriaSelected, // Change to generic variable that we can change when needed
          data: graphBarData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)', // change so that the colors are random? like on the pie chart in nba proj
        }]
    }

    // Return ---------------------------------------------------------------------------------------------------------

    return(
      <main style={{ padding: "1rem 0" }}>
      <h2>General Takeaways</h2>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={3}>
          <Dropdown options={countryNameInfo} placeholder="Countries" onChange={(e)=>{
              getCountry(e.value)
            }}/>
        </Grid>
        <Grid item xs={3}>
          <Dropdown options={sortingCriteria} placeholder="Criteria" onChange={(e)=>{
              getCriteria(e.value)
            }}/>
        </Grid>
        <Grid item xs={12}>
            <div className='chart'>
              <Bar data={report2Chart} options={options}/>
            </div>
          </Grid>
      </Grid>
      <a href="https://github.com/owid/covid-19-data/blob/master/public/data/owid-covid-codebook.csv">Criteria Definitions</a>
    </main>
    );
  }
}

export default Home;