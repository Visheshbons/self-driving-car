const CarCanvas = document.getElementById('carCanvas');
CarCanvas.width = 250;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = CarCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road ( CarCanvas.width / 2, CarCanvas.width * 0.9 );

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"),
        );
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.15);
        }
    };
};

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

function randInt( startNum = 0, endNum ) {
    endNum++;
    const zeroOne = Math.random();
    let numRaw = zeroOne * (endNum - startNum);
    const num = Math.floor(numRaw);
    return num;
};

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
};

function discard() {
    localStorage.removeItem("bestBrain");
};

function redirect(url) {
    window.location.href = url;
}

function tryOut(type) {
    if (type == "main") {
        redirect('sonar/index.html');
    } else {
        redirect('try/index.html');
    }
};

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(
            road.getLaneCenter(1),
            100,
            30,
            50,
            "AI"
        ));
    };
    return cars;
};

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    };
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    };

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y),
        ),
    );

    // Clean up old traffic far behind bestCar
    while (traffic.length > 0 && traffic[0].y > bestCar.y + 1000) {
        traffic.shift(); // remove oldest car
    };

    if (bestCar.y < trafficSpawnY + 1250) {
        generateInfiniteTraffic();
    };

    CarCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + CarCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    };
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'blue');
    };
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true)

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
};