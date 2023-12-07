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
    'J': 1,
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

const isFullHouse = (groupValues, jokers) => {

    // 3 ir 2
    if (groupValues.indexOf(3) !== -1 && groupValues.indexOf(2) !== -1) {
        return true;
    }

    // 3 ir 1+Joker
    if (groupValues.indexOf(3) !== -1 && groupValues.indexOf(1) !== -1 && jokers === 1) {
        return true;
    }

    // 3 ir 2 jokeriai
    if (groupValues.indexOf(3) !== -1 && jokers >= 2) {
        return true;
    }

    // 2 ir 3 jokeriai
    if (groupValues.indexOf(2) !== -1 && jokers >= 3) {
        return true;
    }

    // 2+joker ir 2
    if (groupValues.filter(value => value === 2).length === 2 && jokers >= 1) {
        return true;
    }

    // 1+joker ir 2+joker
    if (groupValues.indexOf(1) !== -1 && groupValues.indexOf(2) !== -1 && jokers === 2) {
        return true;
    }

    return false;
}

const getCardType = (groupValues, jokers) => {

    let cardType = 'HighCard';
    if (groupValues.indexOf(5) !== -1
        || (groupValues.indexOf(4) !== -1 && jokers === 1)
        || (groupValues.indexOf(3) !== -1 && jokers === 2)
        || (groupValues.indexOf(2) !== -1 && jokers === 3)
        || (groupValues.indexOf(1) !== -1 && jokers === 4)
        || jokers === 5
    ) {
        cardType = 'FiveOfKind';
    } else if (groupValues.indexOf(4) !== -1
        || (groupValues.indexOf(3) !== -1 && jokers === 1)
        || (groupValues.indexOf(2) !== -1 && jokers === 2)
        || (groupValues.indexOf(1) !== -1 && jokers === 3)
    ) {
        cardType = 'FourOfKind';
    } else if (isFullHouse(groupValues, jokers)) {
        cardType = 'FullHouse';
    } else if (groupValues.indexOf(3) !== -1
        || (groupValues.indexOf(2) !== -1 && jokers === 1)
        || (groupValues.indexOf(1) !== -1 && jokers === 2)
    ) {
        cardType = 'ThreeOfKind';
    } else if (groupValues.filter(value => value === 2).length === 2
        || (groupValues.filter(value => value === 2).length === 1 && jokers === 2)
        || (groupValues.filter(value => value === 2).length === 1 && groupValues.filter(value => value === 1).length === 1 && jokers === 1)
    ) {
        cardType = 'TwoPairs';
    } else if (groupValues.indexOf(2) !== -1
        || (groupValues.indexOf(1) !== -1 && jokers === 1)
    ) {
        cardType = 'OnePair';
    }

    return cardType;
}

const getHandRating = (hand) => {

    if (ratings[hand]) {
        return ratings[hand];
    }

    const cards = hand.split('').map(card => cardSortMap[card] || parseInt(card));
    let jokers = 0;
    const groups = cards.reduce((acc, card) => {
        if (card === 1) {
            jokers++;
        } else {
            acc[card] = acc[card] || 0;
            acc[card]++;
        }

        return acc;
    }, {});
    const groupValues = Object.values(groups);

    const cardType = getCardType(groupValues, jokers);

    let rating = 10000000000 * typesSortMap[cardType];

    rating += cards[0] * 100000000;
    rating += cards[1] * 1000000;
    rating += cards[2] * 10000;
    rating += cards[3] * 100;
    rating += cards[4] * 1;

    //     console.log(hand, cardType, rating, cards, groups, jokers);

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

    return games.reduce((acc, game, index) => {
        return acc + (parseInt(game[1]) * (index + 1));
    }, 0);
};

console.log(5905 === result('./test.txt'));

console.log(result('./input.txt'));
