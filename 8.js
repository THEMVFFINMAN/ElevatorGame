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
            if (ups.length > 0)
                elevator1.goToFloor(ups.pop());
            if (downs.length > 0)
                elevator1.goToFloor(downs.pop());
        });

        elevator2.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator2.currentFloor()) <= 1)
                elevator2.goToFloor(floorNum, true);
            else 
                elevator2.goToFloor(floorNum);
        } );

        elevator2.on("idle", function() {
            if (downs.length > 0)
                elevator2.goToFloor(downs.pop());
            if (ups.length > 0)
                elevator2.goToFloor(ups.pop());
            
        });
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}
