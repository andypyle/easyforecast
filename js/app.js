var app = angular.module('easyForecast', ['ngGeolocation']);

app.config(function($httpProvider){
	$httpProvider.defaults.useXDomain = true;
});

app.controller('fcCtrl', function($scope, $q, $timeout, $http, $geolocation){
	function wait(){
		return $q(function(resolve, reject){
			$timeout(function(){
				resolve();
			}, 4500);
		});
	}


	// Icons object. Associates a class with the returned icon value in getWeather().
	$scope.weatherIcons = [
		{
			text: 'clear-day',
			wiclass: 'wi-day-sunny'
		},
		{
			text: 'clear-night',
			wiclass: 'wi-night-clear'
		},
		{
			text: 'rain',
			wiclass: 'wi-rain'
		},
		{
			text: 'snow',
			wiclass: 'wi-snow'
		},
		{
			text: 'sleet',
			wiclass: 'wi-sleet'
		},
		{
			text: 'wind',
			wiclass: 'wi-windy'
		},
		{
			text: 'fog',
			wiclass: 'wi-fog'
		},
		{
			text: 'cloudy',
			wiclass: 'wi-cloudy'
		},
		{
			text: 'partly-cloudy-day',
			wiclass: 'wi-day-cloudy'
		},
		{
			text: 'partly-cloudy-night',
			wiclass: 'wi-night-alt-cloudy'
		}
	];

	$scope.geoStatus = false;

	// Get current position.
	$geolocation.getCurrentPosition({
        timeout: 60000
    }).then(function() {
        $scope.geoStatus = true;
        $scope.getCity();
        $scope.getWeather();
    }).catch(function() {
    	console.log('Error getting position! Make sure it is enabled in your browser settings.');
    });

	// Set up geolocation watcher.
	// Updates every 60 seconds.
	$geolocation.watchPosition({
            timeout: 60000
         });
	
	// Function for retrieving current location coordinates.
	$scope.getCoords = function(){
		var myLat = $geolocation.position.coords.latitude;
		var myLon = $geolocation.position.coords.longitude;
		var myCoords = {
			lat    :    myLat,
			lon    :    myLon
		}
		return myCoords;
	}	

	// Request to get weather information from coordinates.
	$scope.getWeather = function(){

		var key = "afb3993d6126315791254532f5519d5b";
		var url = "https://api.forecast.io/forecast/" + key + "/" + $scope.getCoords().lat + "," + $scope.getCoords().lon;
		$http({
			method: 'JSONP',
			url: url,
			params: {
				callback: 'JSON_CALLBACK'
			}
		})
		.success(function(data){
			$scope.weatherInfo = data;			
		})
		.error(function(){
			console.log('error!');
		})
		.then(function(){
			var isCloudy = $scope.weatherInfo.currently.cloudCover >= 0.3 ? true:false;
			var isRaining = $scope.weatherInfo.currently.precipIntensity > 0 && $scope.weatherInfo.currently.precipType === 'rain' ? true:false;
			var isSnowing = $scope.weatherInfo.currently.precipIntensity > 0 && $scope.weatherInfo.currently.precipType === 'snow' ? true:false;
			var isClear = !isCloudy && !isRaining && !isSnowing ? true:false;

			var images = {
				'cloudy':'img/cloudy1.jpg',
				'raining':'img/rain1.jpg',
				'snowing':'img/snow1.jpg',
				'clear':'img/clear1.jpg'
			};

			if(isCloudy){
				$('body').css("backgroundImage","url(" + images.cloudy +")");
			}
			else if(isRaining){
				$('body').css("backgroundImage","url(" + images.raining +")");
			}
			else if(isSnowing){
				$('body').css("backgroundImage","url(" + images.snowing +")");
			}
			else if(isClear){
				$('body').css("backgroundImage","url(" + images.clear +")");
			}
			//console.log(isCloudy + ' ' + isRaining + ' ' + isSnowing);
		});
	};

	
	
	

	//

	// API Request to get city name from coordinates.
	$scope.getCity = function(){

		var geoKey = "AIzaSyBtgVTxB-l69vLQPwS-6NtOznCaVwmFkn4";
		var geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?result_type=intersection|locality|colloquial_area|postal_code";
		
		var geoReq = {
			latlng : $scope.getCoords().lat + "," + $scope.getCoords().lon,
			key : geoKey
		};

		$http({
			method: 'GET',
			url: geoUrl,
			params: geoReq
		})
		.success(function(data){
			$scope.cityName = data;
		})
		.error(function(){
			console.log('Could not retrieve location information.');
		});
	};

	

	$scope.showConditions = function(){
		if($scope.curConditions){
			$scope.curConditions = false;
		} else {
			$scope.curConditions = true;
		}
		return $scope.curConditions;
	}
});