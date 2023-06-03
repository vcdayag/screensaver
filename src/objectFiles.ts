import { ObjectContainer } from './ObjectContainer';

// objects
import gourd from './objects/gourd.obj?raw';
import kyub from './objects/cube.obj?raw';
import donut from './objects/donut.obj?raw';
import bdaycake from './objects/bday_cake.obj?raw';
import pizza from './objects/pizza.obj?raw';
import banana from './objects/banana.obj?raw';
import strawberry from './objects/strawberry.obj?raw';
import icecream from './objects/icecream.obj?raw';

import icecreamMtl from './objects/icecream.mtl?raw';
import strawberryMtl from './objects/strawberry.mtl?raw';


export const RawObjects = [
    icecream,
    strawberry,
    //banana,
    //donut
];

export const mtlFiles = [
    icecreamMtl,
    strawberryMtl,
];

export const objectColors = [
    [1,0,1,1],
    [1,1,0,1],
    [1,1,1,1],
    [0,0,1,1]
];