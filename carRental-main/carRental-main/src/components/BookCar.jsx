import { useEffect, useState } from "react";

let inventory = [
    { car_id: 101, available_date: new Date('2025-11-20'), location: 'A' },
    { car_id: 102, available_date: new Date('2025-11-20'), location: 'B' },
    { car_id: 103, available_date: new Date('2025-11-20'), location: 'A' },
];

let bookings = [];

function checkAvailability(request) {
    
    let result = false;
    inventory.forEach(carInInventory => {
        const isInLocation = carInInventory.location === request.start_location;
        const isAvailableInTime = carInInventory.available_date <= request.start_date;
        const isEndTime = !carInInventory.end_date || (request.end_date < carInInventory.end_date && request.start_location === request.end_location);
 
        result = isInLocation && isAvailableInTime && isEndTime;
        return;
    });

    return result;
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
        end_date: new Date(request.start_date),
        location: request.start_location,
    }

    inventory[indexToUpdate].available_date = request.end_date;
    inventory[indexToUpdate].location = request.end_location;

    inventory.push(newInventory);
}



function reserve(request) {
    bookings.push(request);
}


const BookCar = () => {
    const [inventoryState, setInventoryState] = useState([...inventory]);
    const [message, setMessage] = useState('');

    const [selectedCarId, setSelectedCarId] = useState(inventory[0].car_id.toString());
    const [startDateStr, setStartDateStr] = useState('2025-12-01');
    const [endDateStr, setEndDateStr] = useState('2025-12-05');
    const [startLocation, setStartLocation] = useState('A');
    const [endLocation, setEndLocation] = useState('B');

    const handleBookingSubmit = (event) => {
        event.preventDefault();
        setMessage('');

        const request = {
            car_id: parseInt(selectedCarId), 
            start_date: new Date(startDateStr),
            end_date: new Date(endDateStr),
            start_location: startLocation,
            end_location: endLocation,
        };

        if (checkAvailability(request)) {
            updateInventory(request);
            reserve(request);

            setInventoryState([...inventory]); 
            setMessage(`SUCCESS: Car ${selectedCarId} booked from ${startLocation} to ${endLocation}.`);
        } else {
            setMessage(`FAILED: Car ${selectedCarId} is not available at Location ${startLocation} for that date range.`);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1> Car Booking </h1>

            <form onSubmit={handleBookingSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexDirection: 'column', maxWidth: '300px' }}>
                
                <label>
                    Select Car (Combo Box):
                    <select
                        value={selectedCarId}
                        onChange={e => setSelectedCarId(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    >
                        {/* Populate dropdown with all available static car IDs */}
                        {inventory.map(car => (
                            <option key={car.car_id} value={car.car_id}>Car {car.car_id}</option>
                        ))}
                    </select>
                </label>
                <label>
                    User:
                    <input type="text" required />
                </label>
                <label>
                    Start Date:
                    <input type="date" value={startDateStr} onChange={e => setStartDateStr(e.target.value)} required />
                </label>
                <label>
                    End Date:
                    <input type="date" value={endDateStr} onChange={e => setEndDateStr(e.target.value)} required />
                </label>
                <label>
                    Pick-up Loc (A/B):
                    <input type="text" value={startLocation} onChange={e => setStartLocation(e.target.value)} maxLength={1} required />
                </label>
                <label>
                    Drop-off Loc (A/B):
                    <input type="text" value={endLocation} onChange={e => setEndLocation(e.target.value)} maxLength={1} required />
                </label>
                <button type="submit">Check & Reserve Selected Car</button>
            </form>

            {message && (
                <div style={{ padding: '10px', border: '1px solid', color: message.startsWith('SUCCESS') ? 'green' : 'red' }}>
                    {message}
                </div>
            )}

            <hr />

            

            <hr />

            <h2>Current Inventory Status (External Array)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Car ID</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Next Available Date</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Available End Date</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryState.map((car) => (
                        <tr key={car.car_id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{car.car_id}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{car.available_date.toISOString()}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{car.end_date ? car.end_date.toISOString() : 'N/A'}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{car.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Current Bookings</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Car ID</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Start Date</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>End Date</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Start Location</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>End Location</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((book) => (
                        <tr key={book.car_id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.car_id}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.start_date.toISOString()}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.end_date.toISOString()}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.start_location}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{book.end_location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookCar;
