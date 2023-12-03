const fs = require('fs');

const isSpecialCharacter = (character) => {
    return character !== '.' && isNaN(parseInt(character));
}

const hasAdjacentCharacter = (matrix, row, col) => {
    return (col > 0 && isSpecialCharacter(matrix[row][col - 1]))                         // left
        || (col < matrix[row].length - 1 && isSpecialCharacter(matrix[row][col + 1])) // right
        || (row > 0 && isSpecialCharacter(matrix[row - 1][col]))                      // top
        || (row < matrix.length - 1 && isSpecialCharacter(matrix[row + 1][col]))      // bottom
        || (row > 0 && col > 0 && isSpecialCharacter(matrix[row - 1][col - 1]))       // top left
        || (row > 0 && col < matrix[row].length - 1 && isSpecialCharacter(matrix[row - 1][col + 1])) // top right
        || (row < matrix.length - 1 && col > 0 && isSpecialCharacter(matrix[row + 1][col - 1])) // bottom left
        || (row < matrix.length - 1 && col < matrix[row].length - 1 && isSpecialCharacter(matrix[row + 1][col + 1])) // bottom right
}

const result = (input) => {

    const matrix = fs.readFileSync(input, 'utf8').trim().split('\n').map(row => row.split(''));
    let sum = 0;

    for (let row = 0; row < matrix.length; row++) {

        let number = '';
        let numberHasAdjacentCharacter = false;

        for (let col = 0; col < matrix[row].length; col++) {

            const value = matrix[row][col];

            if (!isNaN(parseInt(value))) {

                number += value;
                numberHasAdjacentCharacter |= hasAdjacentCharacter(matrix, row, col);

                const nextInRowNotANumber = isNaN(parseInt(matrix[row][col + 1]));
                const isLastCharacter = col === matrix[row].length - 1;

                if (nextInRowNotANumber || isLastCharacter) {
                    console.log(number, numberHasAdjacentCharacter);

                    if (numberHasAdjacentCharacter) {
                        sum += parseInt(number);
                    }

                    number = '';
                    numberHasAdjacentCharacter = false;
                }
            }
        }
    }

    return sum;
};

// console.log(4361 === result('./test.txt'));

console.log(result('./input.txt'));
