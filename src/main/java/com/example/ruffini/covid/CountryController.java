package com.example.ruffini.covid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CountryController {
	@Autowired
	private JdbcTemplate jbdcTemplate;
	
	//public CountryController()
	
	@GetMapping("/allCountries")
	List<CountryEntry> allCountries() {
		String sql = "SELECT * FROM CovidMostRecentCaseResultsZero";
		List<CountryEntry> list = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return list;
	}
	
	// Selects the top 5 countries with the highest {insert criteria here}
	@GetMapping("/criteria/{criteriaName}")
	List<CountryEntry> getCriteriaTopFive(@PathVariable String criteriaName) {
		String sql = "SELECT TOP(5) * FROM CovidMostRecentCaseResultsZero db ORDER BY cast(db." + criteriaName + " as decimal(18,4)) DESC;";
		List<CountryEntry> list = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return list;
	}
	
	// Gets JUST that country's information
	@GetMapping("/country/{countryName}")
	List<CountryEntry> getSingleCountry(@PathVariable String countryName) {
		String sql = "SELECT * FROM dbo.CovidMostRecentCaseResultsZero db WHERE db.iso_code = '" + countryName + "'";
		List<CountryEntry> country = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return country;
	}
	
	// Gets 5 rows, 2 being just above and 2 being just below the designated country
	// in regards to their total_deaths_per_million statistic
	@GetMapping("/country/onlyCountryInput/{countryName}")
	List<CountryEntry> getOnlyCountryInput(@PathVariable String countryName) {
		String sql = "select * from\r\n"
				+ "(\r\n"
				+ "select * from (SELECT TOP(2) * FROM CovidMostRecentCaseResultsZero db WHERE cast(db.total_deaths_per_million as decimal(18,4)) > (SELECT db.total_deaths_per_million FROM CovidMostRecentCaseResultsZero db WHERE db.[location] = '" + countryName + "') ORDER BY cast(db.total_deaths_per_million as decimal(18,4)) ASC) as firstTwo\r\n"
				+ "union \r\n"
				+ "select * from (SELECT TOP(2) * FROM CovidMostRecentCaseResultsZero db WHERE cast(db.total_deaths_per_million as decimal(18,4)) < (SELECT db.total_deaths_per_million FROM CovidMostRecentCaseResultsZero db WHERE db.[location] = '" + countryName + "') ORDER BY cast(db.total_deaths_per_million as decimal(18,4)) DESC) as firstTwo\r\n"
				+ "union\r\n"
				+ "select * from CovidMostRecentCaseResultsZero db WHERE db.[location] = '" + countryName + "' \r\n"
				+ ") t\r\n"
				+ "order by cast(t.total_deaths_per_million as decimal(18,4)) DESC;";
		List<CountryEntry> country = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return country;
	}
	
	// Gets 5 rows, 2 being just above and 2 being just below the designated country
	// in regards to their designated statistic
	@GetMapping("/country/bothInputs/{countryName}/{criteriaName}")
	List<CountryEntry> getBothInput(@PathVariable String countryName, @PathVariable String criteriaName) {
		String sql = "select * from\r\n"
				+ "(\r\n"
				+ "select * from (SELECT TOP(2) * FROM CovidMostRecentCaseResultsZero db WHERE cast(db." + criteriaName + " as decimal(18,4)) > (SELECT db." + criteriaName + " FROM CovidMostRecentCaseResultsZero db WHERE db.[location] = '" + countryName + "') ORDER BY cast(db." + criteriaName + " as decimal(18,4)) ASC) as firstTwo\r\n"
				+ "union \r\n"
				+ "select * from (SELECT TOP(2) * FROM CovidMostRecentCaseResultsZero db WHERE cast(db." + criteriaName + " as decimal(18,4)) < (SELECT db." + criteriaName + " FROM CovidMostRecentCaseResultsZero db WHERE db.[location] = '" + countryName + "') ORDER BY cast(db." + criteriaName + " as decimal(18,4)) DESC) as firstTwo\r\n"
				+ "union\r\n"
				+ "select * from CovidMostRecentCaseResultsZero db WHERE db.[location] = '" + countryName + "' \r\n"
				+ ") t\r\n"
				+ "order by cast(t." + criteriaName + " as decimal(18,4)) DESC;";
		List<CountryEntry> country = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return country;
	}
	
	
	
}
