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
    .controller('ForecastApi', function($scope, $http, $location) {

      $scope.Math = window.Math;
      $scope.location = $location;

      $scope.loadWeather = function(cityCoords) {
        $scope.loading = true;
        var latlng = cityCoords.coords.latitude + "," + cityCoords.coords.longitude;
        var forecastURL = 'https://api.darksky.net/forecast/9c5f115423c6a7bdf61901d449355c00/' + latlng + '?units=si&callback=JSON_CALLBACK';
        $http.jsonp(forecastURL).then(function(res){
          $scope.json = res.data;
          $scope.icon = icons[$scope.json.currently.icon];
          $scope.icon1 = icons[$scope.json.daily.data[1].icon];
          $scope.icon2 = icons[$scope.json.daily.data[2].icon];
          $scope.icon3 = icons[$scope.json.daily.data[3].icon];
        }).finally(function() {
          $scope.loading = false;
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

      var degrees = 360;

      $scope.reloadCity = function(e) {
        $scope.loadCity($scope.city);
        // angular.element(e.currentTarget).find('svg').css('transition', '-webkit-transform 800ms ease');
        // angular.element(e.currentTarget).find('svg').css('-webkit-transform', 'rotate(' + degrees + 'deg)');
        // degrees += 360;
      };


    })
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  var icons = {

    "clear-day" : "icon-2",
    "clear-night" : "icon-3",
    "rain" : "icon-18",
    "snow" : "icon-7",
    "sleet" : "icon-24",
    "wind" : "icon-19",
    "fog" : "icon-14",
    "cloudy" : "icon-25",
    "partly-cloudy-day" : "icon-8",
    "partly-cloudy-night" : "icon-9"

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

})();
