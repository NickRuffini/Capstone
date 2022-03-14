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
		String sql = "SELECT TOP(5) * FROM CovidMostRecentCaseResultsZero db ORDER BY db." + criteriaName + " DESC;";
		List<CountryEntry> list = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return list;
	}
	
	@GetMapping("/country/{countryName}")
	List<CountryEntry> getSingleCountry(@PathVariable String countryName) {
		String sql = "SELECT * FROM dbo.CovidMostRecentCaseResultsZero db WHERE db.iso_code = '" + countryName + "'";
		List<CountryEntry> country = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		return country;
	}
	
	
	
	
}
