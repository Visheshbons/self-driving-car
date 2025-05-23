const carCanvas=document.getElementById("carCanvas");
carCanvas.width=window.innerWidth - 330;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
const miniMapCanvas=document.getElementById("miniMapCanvas");
miniMapCanvas.width=300;
miniMapCanvas.height=300;

carCanvas.height=window.innerHeight;
networkCanvas.height=window.innerHeight-300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

/*
const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) : null;
const world = worldInfo
    ? World.load(worldInfo)
    : new World(new Graph());
*/
const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);

const N=50;
let keysCar = null;
let keysCarExists = false;

const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic=[];
const roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0
        ? startPoints[0].center
        : new Point(100, 100);
    const dir = startPoints.length > 0
        ? startPoints[0].directionVector
        : new Point(0, -1);
    const startAngle = - angle(dir) + Math.PI / 2;

    const cars=[];
    if (N > 1) {
        for(let i=1;i<=N;i++){
            cars.push(new Car(startPoint.x, startPoint.y,30,50,"AI",startAngle));
        }
    } else {
        cars.push(new Car(startPoint.x, startPoint.y,30,50,"KEYS",startAngle,{
            maxSpeed: 180,
            color: "lightgreen",
            acceleration: 0.2,
            steerSense: 0.075,
            drift: true
        }));
        keysCar = cars.find(car => car.controlType === "KEYS");
        keysCarExists = true;
        // Immediately set the viewport offset for the initial keysCar
        viewport.offset.x = -keysCar.x;
        viewport.offset.y = -keysCar.y;
    }
    return cars;
}

function drive () {
    if (!keysCarExists) {
        const startPoints = world.markings.filter((m) => m instanceof Start);
        const startPoint = startPoints.length > 0
            ? startPoints[0].center
            : new Point(100, 100);
        const dir = startPoints.length > 0
            ? startPoints[0].directionVector
            : new Point(0, -1);
        const startAngle = -angle(dir) + Math.PI / 2;
    
        const newKeysCar = new Car(startPoint.x, startPoint.y, 30, 50, "KEYS", startAngle, {
            maxSpeed: 180,
            color: "lightgreen",
            acceleration: 0.2,
            steerSense: 0.075,
            drift: true
        });
        cars.push(newKeysCar);
        keysCar = newKeysCar;
        keysCarExists = true;
        // Immediately update the viewport offset when drive() is called
        viewport.offset.x = -keysCar.x;
        viewport.offset.y = -keysCar.y;
    } else {
        alert("You are already driving a car!");
    }
};

function animate(time){

    if (keysCarExists && keysCar){
        bestCar = keysCar;
    }

    for(let i=0;i<traffic.length;i++){
        traffic[i].update(roadBorders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(roadBorders,traffic);
    }
    bestCar=cars.find(
        c=>c.fittness==Math.max(
            ...cars.map(c=>c.fittness)
        ));

    world.cars = cars;
    world.bestCar = bestCar;

    if (keysCarExists && keysCar) {
        viewport.offset.x = -keysCar.x;
        viewport.offset.y = -keysCar.y;
    } else if (bestCar) {
        viewport.offset.x = -bestCar.x;
        viewport.offset.y = -bestCar.y;
    }

    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint, false);
    miniMap.update(viewPoint);

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    networkCtx.lineDashOffset=-time/50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}

fetch('/Test/world/saves/big.world')
  .then(res => {
    if (!res.ok) throw new Error(res.statusText);
    return res.arrayBuffer();
  })
  .then(buffer => {
    // Handle the binary data buffer here
    console.log('World data loaded successfully:', buffer);
    // You can parse or process the buffer as needed
  })
  .catch(console.error);