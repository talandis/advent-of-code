const fs = require('fs');

const result = (input) => {

    let maxRed = 12;
    let maxGreen = 13;
    let maxBlue = 14;

    const games = fs.readFileSync(input, 'utf8').split('\n');

    const validGameIds = [];

    for (let game of games) {

        if (game.length === 0) {
            continue;
        }

        const [gameName, rollsList] = game.split(':');
        const gameId = gameName.split(' ')[1];

        console.log('gameId:', gameId);

        const rolls = rollsList.split(';');

        let rollRed = 0, rollGreen = 0, rollBlue = 0;

        for (let roll of rolls) {

            console.log('Roll X:', roll);

            const colors = roll.split(',');

            let red = 0, blue = 0, green = 0;
            for (let color of colors) {
                const [count, colorName] = color.trim().split(' ');

                if (colorName === 'red') {
                    red = parseInt(count);
                } else if (colorName === 'blue') {
                    blue = parseInt(count);
                } else if (colorName === 'green') {
                    green = parseInt(count);
                }

                console.log(count, colorName);
            }

            rollRed = Math.max(red, rollRed);
            rollBlue = Math.max(blue, rollBlue);
            rollGreen = Math.max(green, rollGreen);
        }

        validGameIds.push(rollRed * rollBlue * rollGreen);
    }

    console.log(validGameIds);

    return validGameIds.reduce((a, c) => a + parseInt(c), 0)
};

console.log(2286 === result('./test.txt'));

console.log(result('./input.txt'));
