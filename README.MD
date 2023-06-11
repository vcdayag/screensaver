# Foodie Shower
> A screensaver of different interactable falling treats through keyboard presses and sliders. 
## Group Members and Section
CMSC 161 B2L

- Dayag, Van Paul 
- Dalangin, Martin Ivan
- Evangelista, Lae Nicole 
- Miranda, Myka Ricci 
- Pascual, Jemimah Lorelai 

## Dependencies
1.  gl-matrix
    * package containing functions designed to perform vertex and matrix operations.
2. webgl-obj-loader
    * A simple script to allow easy importing of object files to web.

## Deployed Screensaver
> Visit the link [here](https://foodieshower.vercel.app/
)

## Development

> Fork this repository and add you changes to your own fork.
Then send a pull request to this repo.
## How to Run
### Local Run 
1. Download [NodeJs v18](https://nodejs.org/en/download)

### Running

1. Download libraries.

```
npm install
```

2. Start develop view.

```
npm run dev
```

## Parameters
1. Light Direction
    - the light direction can be adjusted by the user upon adjusting the slider through the click and drag. 
2. Rotation Direction
    - the direction of rotation of an object can be adjusted upon user's discretion by pressing the arrow keys of their keyboard. Clicking the `arrow up` key will rotate the objects along the x-axis. The `arrow down` key will rotate the objects along the y-axis. Lastly, the `arrow left` key will rotate the objects along the z-axis.
3. Number of Objects Falling
    - the number of objects rendered can be adjusted by pressing the `-` key for decreasing the number of objects or `+` key for increasing the number of objects rendered.

## Interactions
1. Light and Dark Theme
    - The screensaver has a light theme and dark theme that can be toggled just by clicking the `T` key. 
2. Pause and Play
    - The screensaver can be paused or played just by pressing the space bar. 
3. Object Add/Remove Onclick
    - Screensaver objects can be added on the area where the `left mouse click` is clicked. On the other hand, clicking the `right mouse click` will remove the recently added object. 