{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        var ups = []; //keep track of up button presses
        var downs = []; //keep track of down button presses

        // loop over floors
        _.each(floors, function(floor) {
            // if an up button is pressed, add it to the list of up presses
            floor.on("up_button_pressed", function() {
                ups.push(floor.level);
            });

            // if a down button is pressed, add it to the list of down presses
            floor.on("down_button_pressed", function() {
                downs.push(floor.level);
            }); 
        });

        
        elevator.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator.currentFloor()) <= 1)
                elevator.goToFloor(floorNum, true);
            else 
                elevator.goToFloor(floorNum);
        } );

        elevator.on("idle", function() {
            difference = elevator.currentFloor();
            if (downs.length > 0){
                difference = downs.pop();
            }
                
            else if (ups.length > 0){
                if (Math.abs(elevator.currentFloor() - difference)){
                    downs.push(difference);
                    difference = ups.pop();
                }
                    
            }
            
            elevator.goToFloor(difference);

        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
