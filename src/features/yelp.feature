Feature: Automation Challenge B UI
    
    Scenario: Automation Challenge B UI
    	Given I am on Yelp Homepage "/"
    	When I click search input and select "Restaurants" in dropdown box in Find
        And Append "Pizza" to Restaurants and click search button
        And I filter the results by "$"
        And I apply the filter "Sandwiches"
        Then I should see a list of restaurants displayed
        Then Restaurants Stars report should be generated
        And Click and expand the first result from the search results
        Then Log all critical information of the selected restaurant details
        Then Log first three customers reviews of the selected restaurant

    Scenario: Failing Scenario Test
    	Given I am on Yelp Homepage "/"
    	When I click search input and select "Restaurants" in dropdown box in Find
    	#This is done just to make a test fail, so it takes a screenshot and save it in ./screenshots directory, and path saved in Allure Reports.
    	Then No restaurants should be displayed
