Feature: Automation Challeng B API
	@Pending
	Scenario: API Automation Challenge B
		When Select "Restaurants" in API and make report
		And Append "Pizza" to "Restaurants" and search Restaurants Pizza in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with Price "1" filter in API and make report
        And Append "Pizza" to "Restaurants" and search Restaurants Pizza with Category "Sandwiches" filter in API and make report
		Then Report the star rating of each of the results in the first result page in API
		Then Select the "first" result from the search results in API and Log all critical information and first 3 customer reviews