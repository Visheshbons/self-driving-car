const CarCanvas = document.getElementById('carCanvas');
CarCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = CarCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road ( CarCanvas.width / 2, CarCanvas.width * 0.9 );
const car = new Car( road.getLaneCenter(1), 100, 30, 50, "AI" );
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

animate();

function generateCars(N) {
    
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    };
    car.update(road.borders, traffic);

    CarCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + CarCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    };
    car.draw(carCtx, 'blue');

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
};