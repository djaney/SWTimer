var app = angular.module('timer', ['ngAudio']);



function TimerCtrl($scope,$interval,$document,ngAudio,$timeout) {

	var intervalPromise;
	var timeStarted = 0;
	var tickFrom = 0;

	$scope.timerBase = 60;
	$scope.timeElapsed = 0;
	$scope.started = false;


	/*PRIVATE METHODS*/
	var numberPad = function(n, width, z) {
		n = Number(Math.floor(n)).toFixed(0);
		z = z || '0';
		n = n + '';
		return String(n.length >= width ? n : new Array(width - n.length + 1).join(z) + n);
	}

	var timerStep = function(){
		$scope.timeElapsed++;
		var remaining = $scope.timerBase-$scope.timeElapsed;
		if(remaining<=0){
			ngAudio.play('buzz');
			$scope.stop();
		}else if(remaining>0 && remaining<3){
			ngAudio.play('beep');
			$timeout(function(){
				ngAudio.play('beep');
			},333);
			$timeout(function(){
				ngAudio.play('beep');
			},666);
		}else if(remaining>=3 && remaining<10){
			ngAudio.play('beep');
			$timeout(function(){
				ngAudio.play('beep');
			},500);
		}else{
			ngAudio.play('beep');
		}
	};

	/*PUBLIC METHODS*/
	$scope.buzz = function(){
		ngAudio.play('buzz');
	};
	$scope.beep = function(){
		ngAudio.play('beep');
	};

	$scope.setBaseTime = function(seconds){
		$scope.timerBase = seconds;
		$scope.resetTimer();
	};

	$scope.resetTimer = function(){
		$scope.stop();
		$scope.timeElapsed = 0;
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
		$scope.started = true;
		intervalPromise = $interval(timerStep, 1000);
	};

	$scope.stop = function(){
		$interval.cancel(intervalPromise);
		$scope.started = false;
	};
	/* BINDINGS */
	$document.bind('keypress', function(event) {
		if(event.charCode==49){// 1
			$scope.startStop();
		}else if(event.charCode==50){// 2
			$scope.resetTimer();
		}else if(event.charCode==51){// 3
			$scope.buzz();
		}
		if(!$scope.$$phase) $scope.$apply();
	})
}
