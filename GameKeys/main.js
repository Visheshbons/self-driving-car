const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 1500;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(12), 100, 30, 50, "KEYS");

let score = 0; // Declare highScore globally
let highScore = 0;
let topSpeed = 0;
let shownSpeed = 0;

if (localStorage.getItem('highScore')) {
    highScore = parseFloat(localStorage.getItem('highScore')); // Retrieve and parse highScore
};

let trafficSpawnY = -500;
const traffic = []; // Initialize an empty traffic array

function generateInfiniteTraffic() {
    const spacing = 400; // Distance between clusters
    const numVehicles = Math.floor(Math.random() * 4) + 1; // Randomly spawn 1 to 4 vehicles

    // Select unique lanes (no overlap)
    const availableLanes = Array.from({ length: 25 }, (_, i) => i); // 25 lanes
    shuffle(availableLanes);

    // Bias towards left lanes
    const leftBias = availableLanes.filter(lane => lane < 12); // Lanes on the left
    const rightBias = availableLanes.filter(lane => lane >= 12); // Lanes on the right

    const selectedLanes = [];
    for (let i = 0; i < numVehicles; i++) {
        if (Math.random() < 0.7 && leftBias.length > 0) { // 70% chance to pick from left lanes
            selectedLanes.push(leftBias.shift());
        } else if (rightBias.length > 0) {
            selectedLanes.push(rightBias.shift());
        }
    }

    let truckPlaced = false;

    selectedLanes.forEach(lane => {
        const placeTruck = !truckPlaced && Math.random() < 0.3; // Max 1 truck, 30% chance
        const laneSpeed = 5 + lane * 0.5; // Speed increases with lane index
        if (placeTruck) {
            traffic.push(newTruck(lane, trafficSpawnY, laneSpeed)); // Pass speed to newTruck
            truckPlaced = true;
        } else {
            traffic.push(newCar(lane, trafficSpawnY, laneSpeed)); // Pass speed to newCar
        }
    });

    trafficSpawnY -= spacing;
}

// Generate initial traffic
for (let i = 0; i < 25; i++) {
    generateInfiniteTraffic();
}

animate();

function newCar(lane, y, speed) {
    return new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", speed);
}

function newTruck(lane, y, speed) {
    return new Car(road.getLaneCenter(lane), y, 40, 150, "DUMMY", speed);
}

function animate() {
    if (!car.damaged && !car.BROKEN) {
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

        if (car.speed > topSpeed) {
            topSpeed = car.speed;
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

        if (car.speed > 0) {
            shownSpeed = Math.floor(car.speed * 10) + 1; // Convert speed to kph
        } else {
            shownSpeed = 0; // Reset speed if car is not moving
        }

        
        if (canvas.classList.contains('lightspeed-warning')) {
            ctx.fillStyle = "black";
            ctx.font = "bold 40px Monospace";
            ctx.textAlign = "center";
            ctx.fillText("⚠ WARNING: Light Barrier Approaching ⚠", canvas.width / 2, 50);
        }

        // Draw speed text at the top (after restoring transformations)
        ctx.textAlign = "center";
        ctx.fillStyle = "black"; // Set text color to black
        ctx.font = "30px Monospace";
        ctx.fillText("Speed: " + shownSpeed + "kph", canvas.width / 2, 100); // Fixed position at the top
        if (!car.damaged && car.controls?.nitrous) {
            ctx.fillStyle = "red";
            ctx.fillText("NITROUS ENABLED", canvas.width / 2, 150);
        }      

        score = -car.y;
        requestAnimationFrame(animate);
    } else if (car.damaged && !car.BROKEN) {
        score = -car.y; // Update score with the new value

        // Display death screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Your car went", canvas.width / 2, canvas.height / 2 - 110);
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("KAPUT", canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Reload the page to restart", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Score: " + -car.y + "", canvas.width / 2, canvas.height / 2 + 20);
        if (-car.y > highScore) {
            score = -car.y; // Update highScore with the new value
            localStorage.setItem('highScore', score); // Save to localStorage
            ctx.fillStyle = "green";
            ctx.fillText("New High Score: " + score, canvas.width / 2, canvas.height / 2 + 60);
        } else {
            ctx.fillText("High Score: " + highScore, canvas.width / 2, canvas.height / 2 + 60);
        };
        ctx.fillStyle = "white";
        ctx.fillText("Top Speed: " + (Math.floor(topSpeed * 1000) / 100 + 1) + "kph", canvas.width / 2, canvas.height / 2 + 100);

        // Add event listener for restart
        document.addEventListener("keydown", (event) => {
            if (event.key === "r" || event.key === "R") {
                location.reload(); // Reload the page to restart
            }
        }, { once: true });
    } else if (car.BROKEN) {
        // Display lightspeed death screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.font = "30px Monospace";
        ctx.fillText("reality.exe has stopped responding", canvas.width / 2, canvas.height / 2 - 20);
    }
}
