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

    const targets = [];

    if (!maps[mapName]) {
        // console.log('failed to find actual map:', mapName);
        return input;
    }

    const actualMap = maps[mapName]; // maps.find(map => map.from === mapName);


    // Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
    // Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.

    // seeds: 79 14 55 13
    //
    // seed-to-soil map:
    // 50 98 2
    // 52 50 48

    // range1 - 98 99
    // range2 - 50 51 52 ... 97

    // naujos seklos (SOIL)
    // 81 14 57 13

    // --------------------------------
    // soil-to-fertilizer map:
    // 0 15 37
    // 37 52 2
    // 39 0 15

    // range1 - 15 16 ... 36
    // range2 - 52 53
    // range3 - 0 1 ... 14

    // naujos seklos (FERTILIZER)
    // 81 14 57 13

    // --------------------------------
    // fertilizer-to-water map:
    // 49 53 8
    // 0 11 42
    // 42 0 7
    // 57 7 4

    // range1 - 53 54 ... 60
    // range2 - 11 12 ... 52
    // range3 - 0 1 ... 6
    // range4 - 7 8 ... 10

    // 57 58 59 60 61 62  63 64 65  66 67 68  69

    // 81 14 (57 13) -> (53 4)(61 9)

    // naujos seklos (WATER)
    // 81 14 53 4 61 9


    for (let seed of input) {

        // @todo
        // console.log('----------------');
        // console.log('seed in: ', seed);

        for (let range of actualMap.ranges) {

            const [rangeTarget, rangeSource, rangeLength] = range;

            if (inRange(seed.from, seed.length, range)) {

                // console.log( 'in range:', seed, range );

                const rangeDiff = rangeTarget - rangeSource;

                // seeds: 50 15
                //
                // seed-to-soil map:
                // 100 55 2: 55 56 -> 100 101
                // 102 50 5: 50 51 52 53 54 -> 102 103 104 105 106

                // 50 51 52 53 54 | 55 56 57 58 59 60 61 62 63 64
                // 102 103 104 105 106 | 100 101

                // 45 46 47 48 49 | 50  51  52  53  54  | 55  56  | 57 58 59
                //                  102 103 104 105 106 | 100 101

                // range pradzia patenka, bet galas nepatenka
                // range pradzia patenka ir galas patenka

                // Cut the beginning of the seed
                if (seed.from < rangeSource) {

                    const cutLength = rangeSource - seed.from;

                    // console.log(cutLength, rangeSource, seed.from );

                    input.push({
                        from: seed.from + cutLength,
                        length: cutLength
                    });

                    seed.length -= cutLength;

                    // console.log('cut start', input);

                // Cut the end of the seed and remap front part
                } else if (seed.from + seed.length > rangeSource + rangeLength) {

                    // seed: 55 56 57 58 59 60 61 62 63 64
                    // range: 55 56

                    const length = (seed.from + seed.length) - (rangeSource + rangeLength);

                    // console.log( 'len:', length );

                    input.push({
                        from: (seed.from + seed.length) - length,
                        length: length
                    });

                    seed.length -= length;
                    seed.from += rangeTarget - rangeSource; // Remap to target value

                    // cia reikia remap'inti seed.from nes nukapotas galas eis toliau

                    // console.log('cut end', input);

                // Seed fits into the range and we can just remap it
                } else {
                    seed.from += rangeTarget - rangeSource;
                }

                // likuti modifikuojam nes jis patenka i range

                /*
                                if (rangeLength >= seed.length) {

                                    // @todo:
                                    console.log('whole seed is in range:', seed, range);

                                    seed.from += rangeDiff;
                                } else {

                                    const newLength = (rangeSource + rangeLength) - seed.from;

                                    //  @todo:
                                    console.log('update length', seed, newLength);
                                    console.log('add seed', {
                                        from: seed.from + newLength,
                                        length: seed.length - newLength
                                    });

                                    input.push({
                                        from: seed.from + newLength,
                                        length: seed.length - newLength
                                    });

                                    seed.from += rangeDiff;
                                    seed.length = newLength;
                                    // seed.length =


                                    // 79 -> 179

                                    // 79 100
                                    // range length 48 starting at 50
                                    // new length from 79

                                    // kiek skaitmenu yra nuo 97 iki 79

                                    //

                                    // @todo Range kuris nepaima pilnai input
                                    // range1: 98 99 100 ... 297
                                    // range2: 50 51 52 ... 97

                                    // console.log('splitting required');

                                    // Split seed into multiple seeds
                                }
                */
                // console.log(range, rangeDiff, seed.from);

                // permappinti 79 + 14 i 81 + 14
                break;
            }
        }

        // @todo
        // console.log('seeds out:');
        // console.log(input);

        // seeds: 79 14 55 13
        //
        // seed-to-soil map:
        // 50 98 2
        // 52 50 48

        // range1 - 98 99
        // range2 - 50 51 52 ... 97

        // naujos seklos (SOIL)
        // 81 14 57 13

        // let targetValue = seed;
        //
        // for (let range of actualMap.ranges) {
        //     if (seed >= range[1] && seed < range[1] + range[2]) {
        //         targetValue = range[0] + (seed - range[1]);
        //     }
        // }
        //
        // targets.push(targetValue);
    }

    // console.log(actualMap.to, input);

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
