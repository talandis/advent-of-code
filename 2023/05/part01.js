const fs = require('fs');

const parseInput = (path) => {
    const lines = fs.readFileSync(path, 'utf8').trim().split('\n');

    const maps = [];
    let seeds = [];

    let currentMap = [];
    let currentMapName = null;

    for (let line of lines) {
        if (line.substring(0, 6) === 'seeds:') {
            seeds = line.substring(6).trim().split(' ').map(n => parseInt(n));
        } else if (line.match(/(.*?) map:/)) {

            if (currentMap.length && currentMapName !== null) {

                const [from, to] = currentMapName.split('-to-');

                maps.push({
                    from, to,
                    ranges: currentMap
                });
                currentMap = [];
            }

            currentMapName = line.match(/(.*?) map:/)[1].trim();
        } else if (line.length > 0) {
            currentMap.push(line.split(' ').map(n => parseInt(n)));
        }
    }

    if (currentMap.length && currentMapName !== null) {
        const [from, to] = currentMapName.split('-to-');

        maps.push({
            from, to,
            ranges: currentMap
        });
    }

    return [seeds, maps];
}

const inRange = (value, range) => {
    return value >= range[1] && value < range[1] + range[2];
}

const remap = (input, maps, mapName) => {

    const actualMap = maps.find(map => map.from === mapName);
    const targets = [];

    if (!actualMap) {
        console.log('failed to find actual map:', mapName);
        return input;
    }

    for (let seed of input) {

        let targetValue = seed;

        for (let range of actualMap.ranges) {
            if (inRange(seed, range)) {
                targetValue = range[0] + (seed - range[1]);
            }
        }

        targets.push(targetValue);
    }

    // console.log(actualMap.to, targets);

    return remap(targets, maps, actualMap.to);
}

const result = (input) => {

    const [seeds, maps] = parseInput(input);

    const locations = remap(seeds, maps, 'seed');

    return Math.min(...locations);
};

// console.log(35 === result('./test.txt'));

console.log(result('./input.txt'));
