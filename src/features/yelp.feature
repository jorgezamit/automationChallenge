Feature: Automation Challenge B
    
    Scenario: Automation Challenge B
    	Given Go to Yelp Site "/"
    	When Select "Restaurants" in dropdown box in Find
        Then Report total number of Search results with number of results in the current page
        And  Append Pizza to Restaurants and search Restaurants Pizza
        Then Report total number of Search results with number of results in the current page
        And Parameterize any 2 of the filtering parameters apply filter and report total no. of searchs results
        Given Go to Yelp Site "/"
        When Select "Restaurants" in dropdown box in Find
        And Report the star rating of each of the results in the first result page
        And  Click and expand the first result from the search results
        Then Log all critical information of the selected restaurant details
        Then Log first three customers reviews of the selected restaurant
	
    Scenario: Failing Scenario Test
    	Given Go to Yelp Site "/"
    	When Select "Restaurants" in dropdown box in Find
    	#This is done just to make a test fail so it takes a screenshot.
    	Then No restaurants should be displayed
    
	Scenario: API Automation Challenge B
		When Select "Restaurants" in API and make report
		And Append "Pizza" to "Restaurants" and search Restaurants Pizza in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with Category "Sandwiches" filter in API and make report
		And Append "Pizza" to "Restaurants" and search Restaurants Pizza with Price "1" filter in API and make report
		Then Report the star rating of each of the results in the first result page in API
		Then Select the "first" result from the search results in API and Log all critical information and first 3 customer reviews
