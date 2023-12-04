const fs = require('fs');

const getScore = (amountOfNumbers) => {

    if (amountOfNumbers === 0) {
        return 0;
    }

    return Math.pow(2, amountOfNumbers - 1);
}

let extraCards = {};

const result = (input) => {

    const cards = fs.readFileSync(input, 'utf8').trim().split('\n');
    let sum = 0;

    for (let card of cards) {
        let [cardName, numbers] = card.replace('Card ', '').split(':');
        let currentCardIndex = parseInt(cardName);

        let [winningNumbers, actualNumbers] = numbers
            .split('|')
            .map(n => n.split(' ').map(n => n.trim()).filter(n => n.length > 0));

        const matchingNumbers = actualNumbers.filter(value => winningNumbers.indexOf(value) !== -1);

        const numberOfCards = 1 + (extraCards[currentCardIndex] || 0);

        for (let i = 1; i <= matchingNumbers.length; i++) {
            const winningCardIndex = currentCardIndex + i;

            if (!extraCards[winningCardIndex]) {
                extraCards[winningCardIndex] = 0;
            }

            extraCards[winningCardIndex] += numberOfCards;
        }

        sum += numberOfCards;

        // console.log(cardName, extraCards, matchingNumbers, 'num of cards:' + (numberOfCards), 'sum: ' + sum);
    }

    return sum;
};

// console.log(30 === result('./test.txt'));

console.log(result('./input.txt'));
