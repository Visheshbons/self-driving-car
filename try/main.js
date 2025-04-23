const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 250;

const ctx = canvas.getContext('2d');
const road = new Road ( canvas.width / 2, canvas.width * 0.9 );
const car = new Car( road.getLaneCenter(1), 100, 30, 50, "KEYS" );

let trafficSpawnY = -2200; // Start just after your last manual vehicle

function generateInfiniteTraffic() {
    const spacing = 400; // Distance between clusters
    const numVehicles = Math.random() < 0.6 ? 1 : 2; // 60% 1 car, 40% 2

    // Select unique lanes (no overlap)
    const availableLanes = [0, 1, 2, 3];
    shuffle(availableLanes);
    const selectedLanes = availableLanes.slice(0, numVehicles);

    let truckPlaced = false;

    selectedLanes.forEach(lane => {
        const placeTruck = !truckPlaced && Math.random() < 0.3; // Max 1 truck, 30% chance
        if (placeTruck) {
            traffic.push(newTruck(lane, trafficSpawnY));
            truckPlaced = true;
        } else {
            traffic.push(newCar(lane, trafficSpawnY));
        }
    });

    trafficSpawnY -= spacing;
};

const traffic = [
    // Lead vehicle
    newCar(1, -100),

    // Cluster 1
    newCar(0, -200),
    newTruck(1, -280),
    newCar(2, -500),
    newCar(3, -580),

    // Cluster 2
    newCar(1, -700),
    newTruck(2, -780),
    newCar(3, -1000),

    // Cluster 3
    newTruck(0, -1200),
    newCar(1, -1400),
    newCar(2, -1480),
    newTruck(3, -1560),

    // Final stretch
    newCar(0, -1800),
    newTruck(1, -1880),
    newCar(2, -2100),
    newCar(3, -2180)
];



animate();

function newCar( lane, y ) {
    return new Car ( road.getLaneCenter(lane), y, 30, 50, "DUMMY", 2);
};

function newTruck ( lane, y ) {
    return new Car ( road.getLaneCenter(lane), y, 40, 150, "DUMMY", 1.5)
};

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    };
    car.update(road.borders, traffic);

    // Clean up old traffic far behind car
    while (traffic.length > 0 && traffic[0].y > car.y + 1000) {
        traffic.shift(); // remove oldest car
    };

    if (car.y < trafficSpawnY + 1250) {
        generateInfiniteTraffic();
    };

    canvas.height = window.innerHeight;

    if (!car.damaged) {
        ctx.fillStyle = "black"; // Set background to black
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with black
    }

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    if (car.damaged) {
        // Draw road and traffic when the car is damaged
        road.draw(ctx);
        for (let i = 0; i < traffic.length; i++) {
            traffic[i].draw(ctx, 'red');
        };
    }

    car.draw(ctx, 'white');

    ctx.restore();
    requestAnimationFrame(animate);
};