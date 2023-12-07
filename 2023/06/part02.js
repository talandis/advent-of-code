const fs = require('fs');

const parseInput = (path) => {
    const lines = fs.readFileSync(path, 'utf8')
        .trim()
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim().split(' '));

    const races = [];

    for (let i = 1; i < lines[0].length; i++) {
        races.push({
            time: parseInt(lines[0][i]),
            duration: parseInt(lines[1][i])
        })
    }

    return races;
}

const result = (input) => {

    const races = parseInput(input);

    const options = [];

    for (let race of races) {

        let winningOptions = 0;
        let timeHolding = race.time;

        while (timeHolding > 0) {

            const distance = timeHolding * (race.time - timeHolding);

            if (distance > race.duration) {
                winningOptions++;
            }

            timeHolding--;
        }

        options.push(winningOptions);

        // Hold the button for 1 millisecond at the start of the race. Then, the boat will travel at a speed of 1 millimeter per millisecond for 6 milliseconds, reaching a total distance traveled of 6 millimeters.
        // Hold the button for 2 milliseconds, giving the boat a speed of 2 millimeters per millisecond. It will then get 5 milliseconds to move, reaching a total distance of 10 millimeters.
        // Hold the button for 3 milliseconds. After its remaining 4 milliseconds of travel time, the boat will have gone 12 millimeters.
        // Hold the button for 4 milliseconds. After its remaining 3 milliseconds of travel time, the boat will have gone 12 millimeters.
        // Hold the button for 5 milliseconds, causing the boat to travel a total of 10 millimeters.
        // Hold the button for 6 milliseconds, causing the boat to travel a total of 6 millimeters.
        // Hold the button for 7 milliseconds. That's the entire duration of the race. You never let go of the button. The boat can't move until you let you of the button. Please make sure you let go of the button so the boat gets to move. 0 millimeters.
        // Since the current record for this race is 9 millimeters, there are actually 4 different ways you could win: you could hold the button for 2, 3, 4, or 5 milliseconds at the start of the race.


    }

    return options.reduce((a, b) => a * b, 1);
};

console.log(288 === result('./test.txt'));

console.log(result('./input02.txt'));
