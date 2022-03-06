import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class Home extends Component {

  state = {
    isLoading: true,
    countryInfo: []
  }

  async componentDidMount() {
      const response = await fetch('/api/allCountries');
      const body = await response.json();

      this.setState({countryInfo :body, isLoading: false});
  }

  render() {
    const sortingCriteria = ['iso_code', 'continent', 'location', 'date', 'total_cases', 'new_cases', 'total_deaths',
                              'new_deaths', 'total_cases_per_million', 'new_cases_per_million', 'total_deaths_per_million',
                              'icu_patients', 'icu_patients_per_million', 'hosp_patients', 'hosp_patients_per_million',
                              'weekly_icu_admissions', 'weekly_icu_admissions_per_million', 'weekly_hosp_admission',
                              'weekly_hosp_admissions_per_million', 'new_tests', 'total_tests', 'total_tests_per_thousand',
                              'new_tests_per_thousand', 'positive_rate', 'tests_per_case', 'tests_units', 
                              'total_vaccinations', 'people_vaccinated', 'people_fully_vaccinated', 'total_boosters',
                              'new_vaccinations', 'total_vaccinations_per_hundred', 'people_vaccinated_per_hundred',
                              'people_fully_vaccinated_per_hundred', 'total_boosters_per_hundred', 'population_density',
                              'median_age', 'aged_65_older', 'aged_70_older', 'gdp_per_capita', 'extreme_poverty',
                              'cardiovasc_death_rate', 'diabetes_prevalence', 'female_smokers', 'male_smokers', 
                              'handwashing_facilities', 'hospital_beds_per_thousand', 'life_expectancy', 
                              'human_development_index', 'gdp_category', 'death_category'];

    const {countryInfo, isLoading} = this.state;

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
          <Dropdown options={sortingCriteria} placeholder="Criteria"/>
        </Grid>
      </Grid>
      <a href="https://github.com/owid/covid-19-data/blob/master/public/data/owid-covid-codebook.csv">Criteria Definitions</a>
    </main>
    );
  }
}

export default Home;