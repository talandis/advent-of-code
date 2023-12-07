const fs = require('fs');

const parseInput = (path) => {
    const lines = fs.readFileSync(path, 'utf8')
        .trim()
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim().split(' '));

    return lines;
}

const cardSortMap = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
}

const typesSortMap = {
    'FiveOfKind': 7,
    'FourOfKind': 6,
    'FullHouse': 5,
    'ThreeOfKind': 4,
    'TwoPairs': 3,
    'OnePair': 2,
    'HighCard': 1
}

const ratings = {};

const getHandRating = (hand) => {

    if (ratings[hand]) {
        return ratings[hand];
    }

    const cards = hand.split('').map(card => cardSortMap[card] || parseInt(card));
    const groups = cards.reduce((acc, card) => {
        acc[card] = acc[card] || 0;
        acc[card]++;
        return acc;
    }, {});
    const groupValues = Object.values(groups);

    let cardType = 'HighCard';
    if (groupValues.indexOf(5) !== -1) {
        cardType = 'FiveOfKind';
    } else if (groupValues.indexOf(4) !== -1) {
        cardType = 'FourOfKind';
    } else if (groupValues.indexOf(3) !== -1 && groupValues.indexOf(2) !== -1) {
        cardType = 'FullHouse';
    } else if (groupValues.indexOf(3) !== -1) {
        cardType = 'ThreeOfKind';
    } else if (groupValues.filter(value => value === 2).length === 2) {
        cardType = 'TwoPairs';
    } else if (groupValues.indexOf(2) !== -1) {
        cardType = 'OnePair';
    }

    let rating = 10000000000 * typesSortMap[cardType];

    rating += cards[0] * 100000000;
    rating += cards[1] * 1000000;
    rating += cards[2] * 10000;
    rating += cards[3] * 100;
    rating += cards[4] * 1;

    // console.log(hand, cardType, rating, cards);

    ratings[hand] = rating;

    return rating;
}

const result = (input) => {

    let games = parseInput(input);

    games = games.sort(function (a, b) {
        const handRatingA = getHandRating(a[0]);
        const handRatingB = getHandRating(b[0]);

        return handRatingA >= handRatingB ? 1 : -1;
    });

    // console.log(games);

    return games.reduce((acc, game, index) => {

        // console.log(parseInt(game[1]), index + 1);

        return acc + (parseInt(game[1]) * (index + 1));
    }, 0);
};

console.log(6440 === result('./test.txt'));

console.log(result('./input.txt'));
