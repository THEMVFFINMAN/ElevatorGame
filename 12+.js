// I'll admit it doesn't work 100% but I did get it to pass all the next tests

{
  init: function(elevators, floors) {

    var showLogStatements = false;

    function createFloorObj(floor, index) {
      var floorObj = {
        upArrowOn: false,
        downArrowOn: false,

        floorNum: floor.floorNum()
      };

      floor.on('up_button_pressed', function() {
        floorObj.upArrowOn = true;
        wakeAnIdleElevator();
      });

      floor.on('down_button_pressed', function() {
        floorObj.downArrowOn = true;
        wakeAnIdleElevator();
      });

      return floorObj;
    }

    // Returns a nifty string that shows the up/down arrow state for every floor in the
    // building.  Great for use in logging/debugging/
    function getFloorsStatus() {
      var logs = _.map(floorObjs, function(floorObj) {
        return '( ' + (floorObj.upArrowOn ? '▲' : '-') + ' ' + (floorObj.downArrowOn ? '▼' : '-') + ' )';
      }, this);
      return logs.join(' ');
    }

    var floorObjs = _.map(floors, createFloorObj, this);

    function createElevatorObj(elevator, index) {
      var elevatorObj = {

        id: index,
        destinationFloor: NaN,
        stoppingAtFloor: NaN,
        goingUp: true,
        defaultFloor: 0,

        floorButtonOn: _.map(floors, function() {
          return false;
        }, this),

        hasRoom: function() {
          return elevator.loadFactor() < 0.6;
        },

        currentFloor: function() {
          return elevator.currentFloor();
        },

        updateArrowIndicator: function() {
          elevator.goingUpIndicator(elevatorObj.goingUp);
          elevator.goingDownIndicator(!elevatorObj.goingUp);
        },

        shouldStopAtFloor: function(floorNum) {
          if (elevatorObj.floorButtonOn[floorNum]) return true;

          if (!elevatorObj.hasRoom()) return false;

          var floorObj = floorObjs[floorNum];
          if ((elevatorObj.goingUp && floorObj.upArrowOn) ||
              (!elevatorObj.goingUp && floorObj.downArrowOn))
          {
            for (var i = 0; i < elevatorObjs.length; i++) {
              var otherElevatorObj = elevatorObjs[i];
              if (otherElevatorObj !== elevatorObj &&
                otherElevatorObj.stoppingAtFloor === floorNum &&
                otherElevatorObj.goingUp === elevatorObj.goingUp &&
                otherElevatorObj.hasRoom())
              {
                return false;
              }
            }

            return true;
          }

          return false;
        },

        isGoodDestination: function(floorNum) {

          if (elevatorObj.floorButtonOn[floorNum]) {
            return true;
          }

          if (floorObjs[floorNum].upArrowOn || floorObjs[floorNum].downArrowOn) {

            var floorDistance = Math.abs(floorNum - elevatorObj.currentFloor());

            for (var i = 0; i < elevatorObjs.length; i++) {
              var otherElevatorObj = elevatorObjs[i];
              var otherFloorDistance = Math.abs(floorNum - otherElevatorObj.currentFloor());

              if (elevatorObj !== otherElevatorObj &&
                otherFloorDistance <= floorDistance &&
                otherElevatorObj.destinationFloor === floorNum &&
                otherElevatorObj.goingUp === elevatorObj.goingUp &&
                otherElevatorObj.hasRoom())
              {

                return false;
              }
            }

            return true;
          }

          return false;
        },

        getBottomFloorToVisit: function() {
          for (var floorNum = 0; floorNum < floors.length; floorNum++) {
            if (elevatorObj.isGoodDestination(floorNum)) {
              return floorNum;
            }
          }
        },

        getTopFloorToVisit: function() {
          for (var floorNum = elevatorObj.floorButtonOn.length - 1; floorNum >= 0; floorNum--) {
            if (elevatorObj.isGoodDestination(floorNum)) {
              return floorNum;
            }
          }
        },

        setDestinationFloor: function(floorNum) {

          if (elevatorObj.destinationFloor === floorNum) return;

          elevatorObj.destinationFloor = floorNum;

          elevator.destinationQueue = [];
          if (_.isFinite(floorNum)) {
            elevator.destinationQueue.push(floorNum);
            elevatorObj.goingUp = (floorNum >= elevatorObj.currentFloor());
          }
          elevatorObj.updateArrowIndicator();
          elevator.checkDestinationQueue();
        },

        updateDesitnationFloor: function() {
          var floorToVisit;

          if (elevatorObj.goingUp) {
            floorToVisit = elevatorObj.getTopFloorToVisit();
            if (!_.isFinite(floorToVisit)) {
              floorToVisit = elevatorObj.getBottomFloorToVisit();
              elevatorObj.goingUp = false;
            }
          } else {
            floorToVisit = elevatorObj.getBottomFloorToVisit();
            if (!_.isFinite(floorToVisit)) {
              floorToVisit = elevatorObj.getTopFloorToVisit();
              elevatorObj.goingUp = true;
            }
          }

          if (!_.isFinite(floorToVisit)) {
            floorToVisit = elevatorObj.defaultFloor;
          }

          elevatorObj.setDestinationFloor(floorToVisit);
          elevatorObj.logStatus('updateDesitnationFloor');
        },

        logStatus: function() {
          if (!showLogStatements) return;

          console.log('Elevator', elevatorObj.id, '-', arguments);
          console.log('currentFloor:', elevatorObj.currentFloor());
          console.log('goingUp:', elevatorObj.goingUp, '( ', elevator.goingUpIndicator() ? '▲' : '-', ' ', elevator.goingDownIndicator() ? '▼' : '-', ' )');
          console.log('destinationFloor:', elevatorObj.destinationFloor);
          console.log('destinationQueue:', elevator.destinationQueue);
          console.log('floorButtonOn:', elevatorObj.floorButtonOn);
          console.log('floors', getFloorsStatus());
          console.log('load', elevator.loadFactor());
          console.log('');
        }
      };

      elevator.on("floor_button_pressed", function(floorNum) {
        elevatorObj.floorButtonOn[floorNum] = true;
        elevatorObj.updateDesitnationFloor();
      });

      elevator.on("passing_floor", function(floorNum, direction) {
        elevatorObj.updateDesitnationFloor();

        if (elevatorObj.shouldStopAtFloor(floorNum)) {

          elevator.goToFloor(floorNum, true);
          elevatorObj.stoppingAtFloor = floorNum;
        }

        elevatorObj.logStatus('passing_floor');
      });

      elevator.on('stopped_at_floor', function(floorNum) {
        var floorObj = floorObjs[floorNum];
        elevatorObj.stoppingAtFloor = NaN;

        if (elevatorObj.destinationFloor === floorNum) {

          elevatorObj.destinationFloor = NaN;
          if (elevatorObj.goingUp && !floorObj.upArrowOn && floorObj.downArrowOn) {
            elevatorObj.goingUp = false;
            elevatorObj.updateArrowIndicator();
          } else if (!elevatorObj.goingUp && floorObj.upArrowOn && !floorObj.downArrowOn) {
            elevatorObj.goingUp = true;
            elevatorObj.updateArrowIndicator();
          } else if (!floorObj.upArrowOn && !floorObj.downArrowOn) {
            elevatorObj.updateDesitnationFloor();
          }
        }

        elevatorObj.floorButtonOn[floorNum] = false;

        if (elevatorObj.goingUp && floorObj.upArrowOn) {
          floorObj.upArrowOn = false;
        } else if (!elevatorObj.goingUp && floorObj.downArrowOn) {
          floorObj.downArrowOn = false;
        }

        elevatorObj.logStatus('stopped_at_floor');
      });

      elevator.on('idle', function() {
        elevator.goingUpIndicator(true);
        elevator.goingDownIndicator(true);
        elevatorObj.updateDesitnationFloor();
        elevatorObj.logStatus('idle');
      });

      return elevatorObj;
    }

    var elevatorObjs = _.map(elevators, createElevatorObj, this);
    function wakeAnIdleElevator() {
      for (var i = 0; i < elevatorObjs.length; i++) {
        var elevatorObj = elevatorObjs[i];
        if (!_.isFinite(elevatorObj.destinationFloor)) {
          elevatorObj.updateDesitnationFloor();
          break;
        }
      }
    }
  },

  update: function(dt, elevators, floors) {
  }
}
