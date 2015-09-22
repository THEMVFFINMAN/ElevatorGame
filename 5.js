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
        elevator3 = elevators[2];
        elevator4 = elevators[3];
            
        elevator1.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator1.currentFloor()) <= 1)
                elevator1.goToFloor(floorNum, true);
            else 
                elevator1.goToFloor(floorNum);
        } );

        elevator1.on("idle", function() {
                difference = elevator1.currentFloor();
            if (downs.length > 0){
                difference = downs.pop();
            }
                
            else if (ups.length > 0){
                if (Math.abs(elevator1.currentFloor() - difference)){
                    downs.push(difference);
                    difference = ups.pop();
                }
                    
            }
            
            elevator1.goToFloor(difference);

        });
        
        elevator2.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator2.currentFloor()) <= 1)
                elevator2.goToFloor(floorNum, true);
            else 
                elevator2.goToFloor(floorNum);
        } );

        elevator2.on("idle", function() {
            difference = elevator2.currentFloor();
            if (downs.length > 0){
                difference = downs.pop();
            }

            else if (ups.length > 0){
                if (Math.abs(elevator2.currentFloor() - difference)){
                    downs.push(difference);
                    difference = ups.pop();
                }

            }

            elevator2.goToFloor(difference);

        });
        
        elevator3.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator3.currentFloor()) <= 1)
                elevator3.goToFloor(floorNum, true);
            else 
                elevator3.goToFloor(floorNum);
        } );

        elevator3.on("idle", function() {
            difference = elevator3.currentFloor();
            if (downs.length > 0){
                difference = downs.pop();
            }

            else if (ups.length > 0){
                if (Math.abs(elevator3.currentFloor() - difference)){
                    downs.push(difference);
                    difference = ups.pop();
                }

            }

            elevator3.goToFloor(difference);

        });
        
        elevator4.on("floor_button_pressed", function(floorNum) {

            if (Math.abs(floorNum - elevator4.currentFloor()) <= 1)
                elevator4.goToFloor(floorNum, true);
            else 
                elevator4.goToFloor(floorNum);
        } );

        elevator4.on("idle", function() {
            difference = elevator4.currentFloor();
            if (downs.length > 0){
                difference = downs.pop();
            }

            else if (ups.length > 0){
                if (Math.abs(elevator4.currentFloor() - difference)){
                    downs.push(difference);
                    difference = ups.pop();
                }

            }

            elevator4.goToFloor(difference);

        });
        
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
