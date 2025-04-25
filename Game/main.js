const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 1500;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(12), 100, 30, 50, "KEYS");

let trafficSpawnY = -500;
const traffic = []; // Initialize an empty traffic array

function generateInfiniteTraffic() {
    const spacing = 400; // Distance between clusters
    const numVehicles = Math.floor(Math.random() * 4) + 1; // Randomly spawn 1 to 4 vehicles

    // Select unique lanes (no overlap)
    const availableLanes = Array.from({ length: 25 }, (_, i) => i); // 10 lanes
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
}

// Generate initial traffic
for (let i = 0; i < 25; i++) {
    generateInfiniteTraffic();
}

animate();

function newCar(lane, y) {
    return new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", 2);
}

function newTruck(lane, y) {
    return new Car(road.getLaneCenter(lane), y, 40, 150, "DUMMY", 1.5);
}

function animate() {
    if (!car.damaged) {
        for (let i = 0; i < traffic.length; i++) {
            traffic[i].update(road.borders, []);
        }
        car.update(road.borders, traffic);

        // Clean up old traffic far behind car
        while (traffic.length > 0 && traffic[0].y > car.y + 1000) {
            traffic.shift(); // Remove oldest car
        }

        if (car.y < trafficSpawnY + 1250) {
            generateInfiniteTraffic();
        }

        canvas.height = window.innerHeight;

        ctx.save();
        ctx.translate(0, -car.y + canvas.height * 0.7);

        // Always draw road and traffic
        road.draw(ctx);
        for (let i = 0; i < traffic.length; i++) {
            traffic[i].draw(ctx, 'red');
        }

        car.draw(ctx, 'blue');

        ctx.restore();
        requestAnimationFrame(animate);
    } else {
        // Display death screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Your car went", canvas.width / 2, canvas.height / 2 - 70);
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("KAPUT", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Reload the page to restart", canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Score: " + -car.y + "", canvas.width / 2, canvas.height / 2 + 60);

        // Add event listener for restart
        document.addEventListener("keydown", (event) => {
            if (event.key === "r" || event.key === "R") {
                location.reload(); // Reload the page to restart
            }
        }, { once: true });
    }
}