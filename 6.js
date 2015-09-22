{
    init: function(elevators, floors) {

        var ups = []; 
        var downs = []; 

        // loop over floors
        _.each(floors, function(floor) {
            // if an up button is pressed, add it to the list of up presses
            floor.on("up_button_pressed", function() {
                ups.push(floor.level)
            });

            // if a down button is pressed, add it to the list of down presses
            floor.on("down_button_pressed", function() {
                    downs.push(floor.level);
            }); 
        });
            
        elevator1 = elevators[0];
        elevator2 = elevators[1];
            
        elevator1.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator1.currentFloor()) <= 1)
                elevator1.goToFloor(floorNum, true);
            else 
                elevator1.goToFloor(floorNum);
        } );

        elevator1.on("idle", function() {
            for(i = 0; i < ups.length; i++){
                if (Math.abs(ups[i] - elevator1.currentFloor()) <= 1){
                    elevator1.goToFloor(ups[i]);
                    ups.splice(i, 1);
                }
            }
            
            for(i = 0; i < downs.length; i++){
                if (Math.abs(downs[i] - elevator2.currentFloor()) <= 1){
                    elevator2.goToFloor(downs[i]);
                    downs.splice(i, 1);
                }
            }
        });
        
        elevator1.on("passing_floor", function(floorNum, direction) {
            if (direction == "up"){
                for(i = 0; i < ups.length; i++){
                    if (Math.abs(ups[i] - floorNum) <= 1){
                        elevator.destinationQueue.unshift(ups[i]);
                        elevator.checkDestinationQueue();
                        ups.splice(i, 1);
                    }
                }
            }
            else if (direction == "down"){
                for(i = 0; i < downs.length; i++){
                    if (Math.abs(downs[i] - floorNum) <= 1){
                        elevator.destinationQueue.unshift(downs[i]);
                        elevator.checkDestinationQueue();
                        downs.splice(i, 1);
                    }
                }
            }
        
        });
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
