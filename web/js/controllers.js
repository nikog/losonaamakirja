'use strict';

/* Controllers */

function IndexCtrl($scope, Person) {

    $scope.user = {};

    $scope.search = function() {

        var user = angular.copy($scope.user);

        user.first_name = (user.first_name || '') + '%';
        user.last_name = (user.last_name || '') + '%';

        $scope.results = Person.query(user);

    };

/*
    $scope.recommendation = '';

    $scope.change = function() {

        $location.path("/recommends/" + this.recommendation);

    };
    */
}

function PersonCtrl($scope, $routeParams, Person, Post, Friend) {

    $scope.posts = [];
   
    $scope.person = Person.get({
        username: $routeParams.username
        }, function(person) {
        $scope.backgroundImage = 'http://place.manatee.lc/' + person.backgroundId + '/1170/293.jpg';
        $scope.profileImage = '/api/image/' + person.primaryImageId + '/thumb';

        $scope.birthdayx = Friend.query({
            'username': person.username, 
            'birthday': true
        });

    });

}

function CompaniesCtrl($scope, Company) {
    
    $scope.page = 0;
    $scope.companies = [];
    
    var limit = 9;
    
    var fetchCompanies = function() {
        Company.query(
        {
            'orderBy': 'name ASC',
            'page' : ++$scope.page,
            'limit' : limit
        }, function(companies) {
            $scope.companies = $scope.companies.concat(companies);
        });
    };
    
    fetchCompanies();
    
    addInfiniteScroll(fetchCompanies);
}

function CompanyCtrl($scope, $routeParams, Company, Person) {

    $scope.page = 0;
    $scope.persons = [];

    $scope.company = Company.get({
        'name': $routeParams.name
    }, function(company) {

        $scope.backgroundImage = 'http://place.manatee.lc/' + company.backgroundId + '/2000/500.jpg';
        $scope.profileImage = '/api/image/' + company.primaryImageId + '/thumb';
        
        var fetchPersons = function() {
            Person.query(
            {
                'company': company.name,
                'page': ++$scope.page,
                'limit': 20
            }, function(persons) {
                $scope.persons = $scope.persons.concat(persons);
            });
        };
        
        fetchPersons();
        addInfiniteScroll(fetchPersons);
    });
}

function addInfiniteScroll(callback) {
    $(window).on('scroll', function() {
        if($(window).scrollTop() + $(window).height() >= $(document).height()) {
            callback();
        } 
    });
}
