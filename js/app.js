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

	$scope.geoStatus = false;

	// Get current position.
	$geolocation.getCurrentPosition({
        timeout: 60000
    }).then(function() {
        $scope.geoStatus = true;
        $scope.getWeather();
    }).catch(function() {
    	console.log('Error getting position! Make sure it is enabled in your browser settings.');
    });

	// Set up geolocation watcher.
	// Updates every 60 seconds.
	$geolocation.watchPosition({
            timeout: 60000
         });
	
	// Get current location.
	$scope.getCoords = function(){
		var myLat = $geolocation.position.coords.latitude;
		var myLon = $geolocation.position.coords.longitude;
		var myCoords = {
			lat    :    myLat,
			lon    :    myLon
		}
		return myCoords;
	}	

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
		});
	};
});

/*
Google Location api
https://maps.googleapis.com/maps/api/geocode/json?latlng=LATITUDE,LONGITUDE&key=API_KEY

API KEY = AIzaSyBtgVTxB-l69vLQPwS-6NtOznCaVwmFkn4
*/