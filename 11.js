{
    init: function(elevators, floors) {

        var ups = []; 
        var downs = []; 

        _.each(floors, function(floor) {
            floor.on("up_button_pressed", function() {
                ups.push(floor.level)
            });

            floor.on("down_button_pressed", function() {
                downs.push(floor.level);
            }); 
        });
		
		queue = [];
        
        elevators.forEach(function(elevator) {
			
		    elevator.on("floor_button_pressed", function(floorNum) {
				queue = queue.concat(elevator.destinationQueue);
                if (Math.abs(floorNum - elevator.currentFloor()) <= 1)
                    elevator.goToFloor(floorNum, true);
                else 
                    elevator.goToFloor(floorNum);
            } );
            
            elevator.on("idle", function() {
				queue = queue.concat(elevator.destinationQueue);
				var randomNumber = Math.random() >= 0.5;
				if (randomNumber){
					if (ups.length > 0){
						elevator.goToFloor(ups.pop());
					}
					else if (downs.length > 0){
						elevator.goToFloor(downs.pop());
					}
				}
				else{
					if (downs.length > 0){
						elevator.goToFloor(downs.pop());
					}
					else if (ups.length > 0){
						elevator.goToFloor(ups.pop());
					}
				}
					
				elevator.destinationQueue.splice(queue[0], queue[1]);
				queue.splice(0, 2);
				elevator.checkDestinationQueue();
				
            });
			
			console.log(queue);
        });

    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}
