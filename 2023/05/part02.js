const fs = require('fs');

const parseInput = (path) => {
    const lines = fs.readFileSync(path, 'utf8').trim().split('\n');

    const maps = {};
    let seeds = [];

    let currentMap = [];
    let currentMapName = null;

    for (let line of lines) {
        if (line.substring(0, 6) === 'seeds:') {
            const seedInput = line.substring(6).trim().split(' ').map(n => parseInt(n));
            for (let i = 0; i < seedInput.length; i += 2) {
                seeds.push({from: seedInput[i], length: seedInput[i + 1]});
            }

        } else if (line.match(/(.*?) map:/)) {

            if (currentMap.length && currentMapName !== null) {

                const [from, to] = currentMapName.split('-to-');

                maps[from] = {
                    from, to,
                    ranges: currentMap.sort((a, b) => a[1] - b[1])
                };
                currentMap = [];
            }

            currentMapName = line.match(/(.*?) map:/)[1].trim();
        } else if (line.length > 0) {
            currentMap.push(line.split(' ').map(n => parseInt(n)));
        }
    }

    if (currentMap.length && currentMapName !== null) {
        const [from, to] = currentMapName.split('-to-');

        maps[from] = {
            to,
            ranges: currentMap.sort((a, b) => a[1] - b[1])
        };
    }

    return [seeds, maps];
}

const inRange = (from, length, range) => {
    return from < range[1] + range[2] && from + length > range[1];
}

const remap = (input, maps, mapName) => {

    if (!maps[mapName]) {
        return input;
    }

    const actualMap = maps[mapName];

    for (let seed of input) {
        for (let range of actualMap.ranges) {

            const [rangeTarget, rangeSource, rangeLength] = range;

            if (inRange(seed.from, seed.length, range)) {

                // Cut the beginning of the seed
                if (seed.from < rangeSource) {

                    const cutLength = rangeSource - seed.from;

                    input.push({
                        from: seed.from + cutLength,
                        length: cutLength
                    });

                    seed.length -= cutLength;

                // Cut the end of the seed and remap front part
                } else if (seed.from + seed.length > rangeSource + rangeLength) {

                    const length = (seed.from + seed.length) - (rangeSource + rangeLength);

                    input.push({
                        from: (seed.from + seed.length) - length,
                        length: length
                    });

                    seed.length -= length;
                    seed.from += rangeTarget - rangeSource; // Remap to target value

                // Seed fits into the range and we can just remap it
                } else {
                    seed.from += rangeTarget - rangeSource;
                }

                break;
            }
        }
    }

    return remap(input, maps, actualMap.to);
}

const result = (input) => {

    const [seeds, maps] = parseInput(input);

    const items = remap(seeds, maps, 'seed');

    return Math.min(...items.map(i => i.from));
};

// console.log(46 === result('./test.txt'));

console.log( 2520479 === result('./input.txt'));

// Too high: 171049374
// Too high:  10516670
//             2520479
