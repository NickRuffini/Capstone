package com.example.ruffini.covid;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class CovidRealApplication implements CommandLineRunner {

	@Autowired
	private JdbcTemplate jbdcTemplate;
	
	public static void main(String[] args) {
		SpringApplication.run(CovidRealApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {
		String sql = "SELECT TOP 3 * FROM CovidMostRecentCaseResultsZero";
		List<CountryEntry> list = jbdcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CountryEntry.class));
		
		list.forEach(System.out :: println);
	}

}
