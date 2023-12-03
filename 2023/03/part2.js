const fs = require('fs');


const isNumber = (character) => {
    return !isNaN(parseInt(character));
}

const getAdjacentNumberCoordinates = (matrix, row, col) => {

    const coordinates = [];

    if (col > 0 && isNumber(matrix[row][col - 1])) {
        coordinates.push([row, col - 1]);
    }

    if (col < matrix[row].length - 1 && isNumber(matrix[row][col + 1])) {
        coordinates.push([row, col + 1]);
    }

    if (row > 0 && isNumber(matrix[row - 1][col])) {
        coordinates.push([row - 1, col]);
    }

    if (row < matrix.length - 1 && isNumber(matrix[row + 1][col])) {
        coordinates.push([row + 1, col]);
    }

    if (row > 0 && col > 0 && isNumber(matrix[row - 1][col - 1])) {
        coordinates.push([row - 1, col - 1]);
    }

    if (row > 0 && col < matrix[row].length - 1 && isNumber(matrix[row - 1][col + 1])) {
        coordinates.push([row - 1, col + 1]);
    }

    if (row < matrix.length - 1 && col > 0 && isNumber(matrix[row + 1][col - 1])) {
        coordinates.push([row + 1, col - 1]);
    }

    if (row < matrix.length - 1 && col < matrix[row].length - 1 && isNumber(matrix[row + 1][col + 1])) {
        coordinates.push([row + 1, col + 1]);
    }

    return coordinates;

}

const getNumbers = (coordinates, matrix) => {

    const numbers = [];

    for (let coordinate of coordinates) {

        let number = '';

        // Find start of the number
        let col = coordinate[1];
        while (col > 0 && isNumber(matrix[coordinate[0]][col - 1])) {
            col--;
        }

        // Find end of the number
        while (col < matrix[coordinate[0]].length && isNumber(matrix[coordinate[0]][col])) {
            number += matrix[coordinate[0]][col];
            col++;
        }

        if (number.length === 0 || numbers.indexOf(number) !== -1) {
            continue;
        }

        numbers.push(number);
    }

    return numbers;
}

const result = (input) => {

    const matrix = fs.readFileSync(input, 'utf8').trim().split('\n').map(row => row.split(''));
    let sum = 0;

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {

            const value = matrix[row][col];

            if (value === '*') {

                const adjacentNumberCoordinates = getAdjacentNumberCoordinates(matrix, row, col);

                if (adjacentNumberCoordinates.length >= 2) {

                    const numbers = getNumbers(adjacentNumberCoordinates, matrix);

                    if (numbers.length >= 2) {
                        sum += numbers[0] * numbers[1];
                        console.log(numbers, value);
                    }
                }
            }
        }
    }

    return sum;
};

console.log(467835 === result('./test.txt'));

console.log(result('./input.txt'));
