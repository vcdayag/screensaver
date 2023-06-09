import { ObjectContainer } from './ObjectContainer';

// objects
import gourd from './objects/gourd.obj?raw';
import banana from './objects/new_banana.obj?raw';
import strawberry from './objects/strawberry.obj?raw';
import icecream from './objects/icecream.obj?raw';
import flan from './objects/flan.obj?raw';
import flanMtl from './objects/flan.mtl?raw';
import icecreamMtl from './objects/icecream.mtl?raw';
import strawberryMtl from './objects/strawberry.mtl?raw';
import bananaMtl from './objects/new_banana.mtl?raw';
import cakeMtl from './objects/cake.mtl?raw';
import cake from './objects/cake.obj?raw';
import bread from './objects/bread.obj?raw';
import breadMtl from './objects/bread.mtl?raw';

export const RawObjects = [
    icecream,
    strawberry,
    banana,
    flan,
    cake,
    bread
];

export const mtlFiles = [
    icecreamMtl,
    strawberryMtl,
    bananaMtl,
    flanMtl,
    cakeMtl,
    breadMtl
];

export const objectColors = [
    [1,0,1,1],
    [1,1,0,1],
    [1,1,0.0]
];