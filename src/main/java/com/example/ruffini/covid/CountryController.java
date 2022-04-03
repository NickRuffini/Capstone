package com.example.ruffini.covid;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//Importing required classes
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Random;
import weka.classifiers.Evaluation;
import weka.classifiers.trees.J48;
import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;
import weka.classifiers.trees.RandomForest;

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

	@GetMapping("/weka/{criteriaName}")
	List<String> getWeka(@PathVariable String criteriaName) {
		
		System.out.println(criteriaName);
		
		// Try block to check for exceptions
        try {
            // Create J48 classifier by
            // creating object of J48 class
            //J48 j48Classifier = new J48();
        	
        	RandomForest randomForestClassifier = new RandomForest();
        	//Where our attribute we WANT to look at is kept!
        	int attributeIndex;
        	//Where the attributes that NEGATIVELY EFFECT our attributes are!
        	int removeArray[] = new int[1];
        	
        	String dataset = "C:/Users/njruf/OneDrive/Documents/Capstone Stuff/CovidMostRecentCaseResultsZero.arff";
        	
            // Data set path
        	switch(criteriaName) {
        		case "GDP":
        			attributeIndex = 2;
        			removeArray[0] = 43;
        			break;
        		default:
        			attributeIndex = 1;
        			removeArray[0] = 12;
        			break;
        	}
 
            // Creating buffered reader to read the data set
            BufferedReader bufferedReader = new BufferedReader(new FileReader(dataset));
 
            // Create data set instances
            Instances datasetInstances = new Instances(bufferedReader);
            
            // Removes attributes that effect our class!
            Remove removeFilter = new Remove();
            removeFilter.setAttributeIndicesArray(removeArray);
            removeFilter.setInputFormat(datasetInstances);
            
            Instances newDatasetInstances = Filter.useFilter(datasetInstances, removeFilter);

            newDatasetInstances.setClassIndex(newDatasetInstances.numAttributes() - attributeIndex);
 
            // Evaluating by creating object of Evaluation
            // class
            Evaluation evaluation = new Evaluation(newDatasetInstances);
 
            // Cross Validate Model with 10 folds
            evaluation.crossValidateModel(randomForestClassifier, newDatasetInstances, 10, new Random(1));
 
            List<String> wekaList = new ArrayList<String>();
            wekaList.add(evaluation.toSummaryString("\nResults", false));
            wekaList.add(evaluation.toMatrixString());
            
            return wekaList;
        }
 
        // Catch block to handle the exceptions
        catch (Exception e) {
 
            // Print message on the console
            return new ArrayList<String>();
        }
	}	
	
	/*@GetMapping("/weka")
	List<String> getWeka() {
		// Try block to check for exceptions
        try {
            // Create J48 classifier by
            // creating object of J48 class
            //J48 j48Classifier = new J48();
        	
        	RandomForest randomForestClassifier = new RandomForest();
 
            // Data set path
            String dataset = "C:/Users/njruf/OneDrive/Documents/Capstone Stuff/CovidMostRecentCaseResultsZero.arff";
 
            // Creating buffered reader to read the data set
            BufferedReader bufferedReader = new BufferedReader(new FileReader(dataset));
 
            // Create data set instances
            Instances datasetInstances = new Instances(bufferedReader);
 
            
            // Set Target Class
            datasetInstances.setClassIndex(datasetInstances.numAttributes() - 2);
 
            // Evaluating by creating object of Evaluation
            // class
            Evaluation evaluation = new Evaluation(datasetInstances);
 
            // Cross Validate Model with 10 folds
            evaluation.crossValidateModel(randomForestClassifier, datasetInstances, 10, new Random(1));
 
            List<String> wekaList = new ArrayList<String>();
            wekaList.add(evaluation.toSummaryString("\nResults", false));
            
            return wekaList;
        }
 
        // Catch block to handle the exceptions
        catch (Exception e) {
 
            // Print message on the console
            return new ArrayList<String>();
        }
	}*/
}
