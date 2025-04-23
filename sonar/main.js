const canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road ( canvas.width / 2, canvas.width * 0.9 );
const car = new Car( road.getLaneCenter(1), 100, 30, 50, "KEYS" );
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -1100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -1350, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1250, 30, 50, "DUMMY", 2),
];

animate();

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    };
    car.update(road.borders, traffic);

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