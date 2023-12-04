const fs = require('fs');

const getScore = (amountOfNumbers) => {

    if (amountOfNumbers === 0) {
        return 0;
    }

    return Math.pow(2, amountOfNumbers - 1);
}

const result = (input) => {

    const cards = fs.readFileSync(input, 'utf8').trim().split('\n');
    let sum = 0;

    for (let card of cards) {
        let [_, numbers] = card.split(':');

        let [winningNumbers, actualNumbers] = numbers
            .split('|')
            .map(n => n.split(' ').map(n => n.trim()).filter(n => n.length > 0));

        const matchingNumbers = actualNumbers.filter(value => winningNumbers.indexOf(value) !== -1);

        console.log(matchingNumbers, getScore(matchingNumbers.length));

        sum += getScore(matchingNumbers.length);
    }

    return sum;
};

// console.log(13 === result('./test.txt'));

console.log(result('./input.txt'));
