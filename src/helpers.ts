export type materialType = {    // Exports the material properties of the object
    ns: number;
    ni: number;
    d: number;
    illum: number;
    ka: readonly [number, number, number];
    kd: readonly [number, number, number];
    ks: readonly [number, number, number];
    ke: readonly [number, number, number];
};

export function parseMTLFile(matFile: String): materialType {
    var matFileSplit = matFile.split('\n');

    var ns: number = 0, ni: number = 0, d: number = 0, illum: number = 0;
    var ka = [0, 0, 0]; //ambient color
    var kd = [0, 0, 0]; //diffuse color
    var ks = [0, 0, 0]; //specular color
    var ke = [0, 0, 0];

    //file read per line
    for (var line = 0; line < matFileSplit.length; line++) {
        let lineSplit = matFileSplit[line].split(' ');

        // reads the Ka, Kd, Ks, and Ke attributes from the mtl file
        if (lineSplit[0] == 'Ns') {
            ns = Number(lineSplit[1]);
        } else if (lineSplit[0] == 'Ka' || lineSplit[0] == 'Kd' || lineSplit[0] == 'Ks' || lineSplit[0] == 'Ke') {
            for (var word = 1; word < lineSplit.length; word++) {
                if (lineSplit[0] == 'Ka') {
                    ka[word - 1] = (Number(lineSplit[word]));
                } else if (lineSplit[0] == 'Kd') {
                    kd[word - 1] = (Number(lineSplit[word]));
                } else if (lineSplit[0] == 'Ks') {
                    ks[word - 1] = (Number(lineSplit[word]));
                } else if (lineSplit[0] == 'Ke') {
                    ke[word - 1] = (Number(lineSplit[word]));
                }
            }
        } else if (lineSplit[0] == 'Ni') {     // Reads the Ni, d, and illum components
            ni = Number(lineSplit[1]);
        } else if (lineSplit[0] == 'd') {
            d = Number(lineSplit[1]);
        } else if (lineSplit[0] == 'illum') {
            illum = Number(lineSplit[1]);
        }
    }

    return {    // Returns the different lighting components
        ns,
        ni,
        d,
        illum,
        ka: ka as unknown as readonly [number, number, number],
        kd: kd as unknown as readonly [number, number, number],
        ks: ks as unknown as readonly [number, number, number],
        ke: ke as unknown as readonly [number, number, number],
    }
}

export function getRandom(value: number) {   // Gets a random value to set as the rotation value
    return (Math.random() < 0.5 ? -1 : 1) * Math.random() * value;
}

export function getRandomNegative(value: number) {
    return -1 * Math.random() * value;
}