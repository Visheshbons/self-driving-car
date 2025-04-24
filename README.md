# Self Driving Car

You can see this at work [here](https://v-autopilot-ai-trainer.onrender.com/). \
This is a self driving car program, which runs using a _genetic algorithm_. \
Our AI has 16 neurons: 6 input neurons, 6 hidden layer neurons, and 4 output neurons. \
Our _"world"_ is a 4 lane highway, with traffic moving in the same direction as our AI. 

## How to use

When you first load the site, you will see 750 randomly generated _"brains"_ controlling a car each. \
By random chance, a few should survive the longest. This will narrow down to one quite fast. \
When you are foccused on the _"best"_ car, simply press the `save` button, then reload the page. \
The new 750 AI cars will be 15% mutated from the previously selected _"best car"_. \
Keep doing this until you get an AI that can do reasonably well. 

## Game modes

There are two game modes so far: **Challenge**, and **LIDAR**. 

### Challenge mode

In challenge mode, you are tasked with driving the car, but you can only see what the AI gets as inputs. \
IE: Sensors, and Car Position. \
Based off this data, you need to drive the car using the arrow keys on your keyboard. \
When you 'die', you can see how you died, and can reload the page to try again. 

### LIDAR mode

This is just an easier version of Challenge mode, as you get 75 sensors, in 360 degrees of vision. \
I made this purely for fun, and to see what would happen. \
This mode demonstrates how LIDAR cannot see through objests, hence they cast long shadows. \
You still drive using th arrow keys on your keboard for this one as well. \
Again, death causes you to be able to see where you crashed.

## Some good starter `bestBrain`s
One is: 
```
{"levels":[{"inputs":[1,0,1,1,1,1],"outputs":[0,0,1,1,1,1],"biases":[-0.01182040785823895,0.35406253191755443,-0.05206691814153308,0.20706919974535298,-0.10797246745394426,-0.23915153622827912],"weights":[[0.19312911183954673,-0.09200335328741513,0.41928911838014143,0.15297713944334845,-0.04963911292127097,0.12303722951415212],[0.3178589608680969,0.09724358964010252,0.03966817114944489,-0.015354983530439542,-0.014024368521189802,0.20644620364912813],[-0.06321847932962285,-0.10468754111231586,-0.06270737103616492,0.09457287954791482,0.20359037014142134,-0.07448118111569169],[-0.06472104156669874,0.23197740767251976,0.057441868930755965,0.15651838211236999,-0.024679343794898834,-0.04954557468760923],[-0.17152075936864145,0.06016540124731053,-0.17836976458073597,-0.26353788716794463,-0.00535062805458851,-0.03793241134860208],[-0.18091575649800412,0.16530744602794284,0.07591930049720866,0.20541665678103702,0.3861037689937129,-0.05784733953840896]]},{"inputs":[0,0,1,1,1,1],"outputs":[0,0,1,0],"biases":[0.08100829849580543,-0.11582416749187557,0.08617079080799692,0.12353568590423061],"weights":[[0.21891338356855222,-0.04158431449605559,0.3198489768019803,0.06679566228150612],[-0.29106956239817205,-0.06287517874909779,-0.07416431961277913,0.2769391796878701],[0.09183320386748935,-0.25377431673830075,0.17482845683703083,0.09930874948178121],[-0.1024929932356744,-0.15928341595908885,0.09406043178031394,-0.3177475675790124],[0.052974337185940856,0.181291337827442,-0.0043183264061466,-0.17002953494170442],[-0.03523973878923449,-0.2695064766892798,0.17600868823366508,-0.04530570929298176]]}]}
```
***
To use these, just run 
```
localStorage.bestBrain = /** the brain JSON in question */
```
Then reload.

## Credits

- **Project Developer:** [Vishesh Kudva](https://github.com/Visheshbons)
- **Original Concept & Tutorials:** [Dr. Radu Mariescu-Istodor](https://github.com/gniziemazity/Self-driving-car)
- **AI & Code Assistance:** [ChatGPT by OpenAI](https://openai.com/chatgpt)
- **Source Code:** [GitHub Repository](https://github.com/Visheshbons/self-driving-car)
- **Live Demo:** [v-autopilot-ai-trainer.onrender.com](https://v-autopilot-ai-trainer.onrender.com)


***

Version 2.1.0 | &copy; 2025 Vishesh Kudva. | All rights reserved.
