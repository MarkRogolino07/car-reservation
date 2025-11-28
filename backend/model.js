let inventory = [
    { car_id: 101, available_date: new Date('2025-11-20'), location: 'A' },
    { car_id: 102, available_date: new Date('2025-11-20'), location: 'B' },
    { car_id: 103, available_date: new Date('2025-11-20'), location: 'A' },
];

function checkAvailability(request) {
    const carInInventory = inventory.find(car => car.car_id === request.car_id);

    if (!carInInventory) {
        return false;
    }
    
    const isInLocation = carInInventory.location === request.start_location;
    const isAvailableInTime = carInInventory.available_date <= request.start_date;
    const isEndTime = !carInInventory.end_date || request.end_date < carInInventory.end_date;


    return isInLocation && isAvailableInTime && isEndTime;
}

function updateInventory(request) {
    const indexToUpdate = inventory.findIndex(car => car.car_id === request.car_id);

    if (indexToUpdate === -1) {
        console.error("Error: Cannot update inventory. Car ID not found.");
        return;
    }

    const newInventory = {
        car_id: request.car_id,
        available_date: inventory[indexToUpdate].available_date,
        end_date: request.start_date,
        location: request.start_location,
    }

    inventory[indexToUpdate].available_date = request.end_date;
    inventory[indexToUpdate].location = request.end_location;

    inventory.push(newInventory);
}

