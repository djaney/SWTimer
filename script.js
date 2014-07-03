angular.module('timer', []);


function TimerCtrl($scope,$interval) {

	var intervalPromise;
	var timeStarted = 0;
	var tickFrom = 0;

	$scope.timerBase = 60;
	$scope.timeElapsed = 0;
	$scope.started = false;




	var numberPad = function(n, width, z) {
		z = z || '0';
		n = n + '';
		return String(n.length >= width ? n : new Array(width - n.length + 1).join(z) + n);
	}

	var timerStep = function(){
		if($scope.timerBase-$scope.timeElapsed<=0){
			$scope.stop();
		}else if(tickFrom==0){
			tickFrom = new Date().getTime();
		}else if(new Date().getTime()-tickFrom>1000){
			tickFrom = 0;
			$scope.timeElapsed++;
		}
	};

	$scope.setBaseTime = function(seconds){
		$scope.timerBase = seconds;
		$scope.resetTimer();
	};

	$scope.resetTimer = function(){
		$scope.stop();
		$scope.timeElapsed = 0;
		tickFrom = 0;
		timeStarted = new Date().getTime();
	};

	$scope.getTimeHumanReadable = function(){
		var sec = $scope.timerBase - $scope.timeElapsed;
		var minutes = Math.floor((sec)/60);
		var seconds = sec-(minutes*60);

		return numberPad(minutes,2)+':'+numberPad(seconds,2);
	}

	$scope.startStop = function(){
		if($scope.started){
			$scope.stop();
		}else{
			$scope.start();
		}

	};

	$scope.start = function(){
		intervalPromise = $interval(timerStep, 500);
		$scope.started = true;
	};

	$scope.stop = function(){
		if(intervalPromise){
			$interval.cancel(intervalPromise);
		}
		$scope.started = false;
	};
}
