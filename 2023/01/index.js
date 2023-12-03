const fs = require('fs');

const findFirstNumber = (inputWord) => {

    const replacements = {
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'zero': 0,
    }

    let first = null;

    for (let i = 0; i < inputWord.length; i++) {

        if (first === null && !isNaN(parseInt(inputWord[i]))) {
            first = parseInt(inputWord[i]);
            break;
        }

        for (let window = 1; window <= 5; window++) {
            const word = inputWord.substring(i, i + window);

            if (replacements[word]) {
                first = replacements[word];
                break;
            }
        }

        if (first) {
            break;
        }
    }

    return first;
}

const findLastNumber = (inputWord) => {

    const replacements = {
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'zero': 0,
    }

    let first = null;

    for (let i = inputWord.length; i >= 0; i--) {

        if (first === null && !isNaN(parseInt(inputWord[i]))) {

            first = parseInt(inputWord[i]);
            break;
        }

        for (let window = 1; window <= 5; window++) {
            const word = inputWord.substring(i - window, i);

            if (replacements[word]) {
                first = replacements[word];
                break;
            }
        }

        if (first) {
            break;
        }
    }

    return first;
}

const calculate = (inputFilePath) => {

    const locations = fs.readFileSync(inputFilePath, 'utf8').split('\n');

    let sum = 0;


    for (let location of locations) {

        let first = findFirstNumber(location);
        let last = findLastNumber(location);

        // Take first and last position
        sum += parseInt(first * 10 + last);
    }

    return sum;
}

console.log(calculate('./input.txt'));
