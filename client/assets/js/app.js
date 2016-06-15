(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:true,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  var icons = {

    "clear-day" : "B",
    "clear-night" : "C",
    "rain" : "R",
    "snow" : "G",
    "sleet" : "X",
    "wind" : "S",
    "fog" : "N",
    "cloudy" : "Y",
    "partly-cloudy-day" : "H",
    "partly-cloudy-night" : "I"

  };

  var cities = {

    "frankfurt" : { coords: { latitude: 50.1109221, longitude: 8.682126700000026 } },
    "berlin" : { coords: { latitude: 52.52000659999999, longitude: 13.404953999999975 } },
    "london" : { coords: { latitude: 51.5073509, longitude: -0.12775829999998223 } },
    "new york" : { coords: { latitude: 40.7127837, longitude: -74.00594130000002 } },
    "los angeles" : { coords: { latitude: 34.0522342, longitude: -118.2436849 } },
    "tokyo" : { coords: { latitude: 35.6894875, longitude: 139.69170639999993 } },
    "current location" : {}

  };

  var forecastJsonApiRes = angular.module('application');
  forecastJsonApiRes.controller('ForecastApi', function($scope, $http) {

      $scope.loadWeather = function(cityCoords) {
        var latlng = cityCoords.coords.latitude + "," + cityCoords.coords.longitude;
        var forecastURL = 'https://api.forecast.io/forecast/9c5f115423c6a7bdf61901d449355c00/' + latlng + '?units=si&callback=JSON_CALLBACK';
        $http.jsonp(forecastURL).then(function(res){
          $scope.json = res.data;
          // set icon 
        });
      };

      $scope.loadCity = function(city) {
        $scope.city = city;
        if(city.toLowerCase() == "current location") {
          if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.loadWeather, $scope.loadDefaultCity);
          } else {
            $scope.loadDefaultCity();
          }
        } else {
          $scope.loadWeather(cities[city.toLowerCase()]);
        }
      };
    
      $scope.acceptSelection = function(e) {
        var city = e.currentTarget.innerHTML;
        $scope.loadCity(city);
      };

      $scope.loadDefaultCity = function() {
        $scope.loadCity('Frankfurt');
      };
      $scope.loadDefaultCity();
      $scope.Math = window.Math;
    });


})();
