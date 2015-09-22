{
    init: function(elevators, floors) {
        var elevator1 = elevators[0];
        var elevator2 = elevators[1];

        var ups1 = []; 
        var downs1 = []; 
        var ups2 = []; 
        var downs2 = []; 

        // loop over floors
        _.each(floors, function(floor) {
            // if an up button is pressed, add it to the list of up presses
            floor.on("up_button_pressed", function() {
                if (floor.level >= 4)
                    ups2.push(floor.level)
                else
                    ups1.push(floor.level);
            });

            // if a down button is pressed, add it to the list of down presses
            floor.on("down_button_pressed", function() {
                if (floor.level >= 4)
                    downs2.push(floor.level)
                else
                    downs1.push(floor.level);
            }); 
        });

        
        elevator1.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator1.currentFloor()) <= 1)
                elevator1.goToFloor(floorNum, true);
            else 
                elevator1.goToFloor(floorNum);
        } );

        elevator1.on("idle", function() {
            difference = elevator1.currentFloor();
            if (downs1.length > 0){
                difference = downs1.pop();
            }
                
            else if (ups1.length > 0){
                if (Math.abs(elevator1.currentFloor() - difference)){
                    downs.push(difference);
                    difference = ups1.pop();
                }
                    
            }
            
            elevator1.goToFloor(difference);

        });
        
        elevator2.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator1.currentFloor()) <= 1)
                elevator2.goToFloor(floorNum, true);
            else 
                elevator2.goToFloor(floorNum);
        } );

        elevator2.on("idle", function() {
            difference = elevator2.currentFloor();
            if (downs2.length > 0){
                difference = downs2.pop();
            }

            else if (ups2.length > 0){
                if (Math.abs(elevator2.currentFloor() - difference)){
                    downs2.push(difference);
                    difference = ups2.pop();
                }

            }

            elevator2.goToFloor(difference);

        });
        
        elevator1.on("passing_floor", function(floorNum, direction) {

        });
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
