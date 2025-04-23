# Self Driving Car

You can see this at work at https://v-autopilot-ai-trainer.onrender.com/. \
This is a self driving car program, which runs using a _genetic algorithm_. \
Our AI has one input layer with 6 neurons, one hidden layer with 6 neurons, and 1 output layer, with 4 outputs. \
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
Again, death causes you to be able to see where you crashed. /

Version 2.1.0 | &copy; 2025, Vishesh Kudva. | All rights reserved.
