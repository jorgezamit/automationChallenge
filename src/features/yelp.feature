Feature: Automation Challenge B
    
    Scenario: Generic restaurant search
    	Given I am on Yelp Homepage "/"
    	And As a Yelp user I select "Restaurants" in dropdown box in Find
        Then A list of restaurants is displayed
    
    Scenario: Append pizza to restaurant search
        Given I am on Yelp Homepage "/"
        And As a Yelp user I select "Restaurants" in dropdown box in Find
        And Append "Pizza" to Restaurants and click search button
        Then A list of restaurants is displayed
    
    Scenario: Add price filter to pizza restaurants
        Given I am on Yelp Homepage "/"
        And As a Yelp user I select "Restaurants" in dropdown box in Find
        And Append "Pizza" to Restaurants and click search button
        And Use the price filter "$"
        Then A list of restaurants is displayed
    
    Scenario: Add price filter and category filter to pizza restaurants
        Given I am on Yelp Homepage "/"
        And As a Yelp user I select "Restaurants" in dropdown box in Find
        And Append "Pizza" to Restaurants and click search button
        And Use the price filter "$"
        And Use the Category filter "Sandwiches"
        Then A list of restaurants is displayed
      
    Scenario: Report the star rating of each of the results in the first result page
        Given I am on Yelp Homepage "/"
        And As a Yelp user I select "Restaurants" in dropdown box in Find
        Then Report the star rating of each of the results in the first result page
    
    Scenario: Log all critical information of first result from the search results
        Given I am on Yelp Homepage "/"
        And As a Yelp user I select "Restaurants" in dropdown box in Find
        When Click and expand the first result from the search results
        Then Log all critical information of the selected restaurant details
        And Log first three customers reviews of the selected restaurant
    
    Scenario: Failing Scenario Test
    	Given I am on Yelp Homepage "/"
    	And As a Yelp user I select "Restaurants" in dropdown box in Find
    	#This is done just to make a test fail so it takes a screenshot.
    	Then No restaurants should be displayed

	Scenario: API Automation Challenge B
		When Select "Restaurants" in API and make report
		And Append "Pizza" to "Restaurants" and search Restaurants Pizza in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with Price "1" filter in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with Price "1" and Category "Sandwiches" filter in API and make report
		Then Report the star rating of each of the results in the first result page in API
		Then Select the "first" result from the search results in API and Log all critical information and first 3 customer reviews
