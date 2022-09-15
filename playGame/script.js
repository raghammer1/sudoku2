let numSelected = null;
var tileSelected = null;

var mistakes = 0;

let hint = 5;

let sudoku = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

solver(sudoku, 0, 0);

let sudStrArrSol = ['', '', '', '', '', '', '', '', ''];

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    sudStrArrSol[i] += sudoku[i][j];
  }
}

let solution = sudStrArrSol;

let level = 'expert'.toLowerCase();

if (level == 'easy') {
  // remove 43 numbers
  numRemover(43);
} else if (level == 'medium') {
  // remove 48 numbers
  numRemover(48);
} else if (level == 'hard') {
  // remove 53 numbers
  numRemover(53);
} else if (level == 'expert') {
  // remove 59 numbers
  numRemover(59);
}

let sudStrArrQues = ['', '', '', '', '', '', '', '', ''];

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (sudoku[i][j] === 0) {
      sudStrArrQues[i] += '-';
    } else {
      sudStrArrQues[i] += sudoku[i][j];
    }
  }
}

let board = sudStrArrQues;

var newGame = function () {
  setGame();
};

window.onload = newGame;

function setGame() {
  for (let i = 0; i < 9; i++) {
    let number = document.createElement('div');
    number.id = i + 1;
    number.innerText = i + 1;
    number.classList.add('number');
    document.getElementById('digits').appendChild(number);
    number.addEventListener('click', selectNumber);
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let tile = document.createElement('div');
      tile.id = i.toString() + '-' + j.toString();
      tile.addEventListener('click', selectTile);
      if (i == 2 || i == 5) tile.classList.add('horizontal-border');
      if (j == 2 || j == 5) tile.classList.add('vertical-border');
      tile.classList.add('tile');
      if (board[i][j] != '-') {
        tile.innerText = board[i][j];
        tile.classList.add('tile-selected');
      } else {
        tile.classList.add('make-thin');
      }
      document.getElementById('board').appendChild(tile);
    }
  }
  document.querySelector('.submit-btn').addEventListener('click', function () {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        id = i.toString() + '-' + j.toString();
        if (board[i][j] == '-') {
          if (solution[i][j] !== document.getElementById(id).innerText) {
            document.body.classList.add('game-lost');
            document.querySelector('.head').innerText = 'Game lost';
            document.getElementById('submit').classList.add('hidden2');
            document.getElementById('solve').classList.add('hidden2');
            document.getElementById('restart').classList.remove('hidden2');
            document.getElementById('digits').innerHTML = '';
            numSelected = null;
            tileSelected = null;
            document.querySelector('.hint-btn').classList.add('hidden2');
            document.querySelector('#hints').classList.add('hidden2');
            return;
          }
        }
      }
    }
    document.body.classList.add('game-won');
    document.querySelector('.head').innerText = 'Game won';
    document.getElementById('submit').classList.add('hidden2');
    document.getElementById('solve').classList.add('hidden2');
    document.getElementById('digits').innerHTML = '';
  });
  document.querySelector('.hint-btn').addEventListener('click', function () {
    hinted();
  });
  document.getElementById('solve').addEventListener('click', function () {
    const childrens = document.getElementById('board').childNodes;
    for (let children of childrens) {
      let coords = children.id.split('-');
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);
      children.innerText = solution[r][c];
    }
    document.body.classList.add('game-solved-by-AI');
    document.querySelector('.head').innerText = 'Try again';
    document.getElementById('submit').classList.add('hidden2');
    document.getElementById('solve').classList.add('hidden2');
    document.getElementById('digits').innerHTML = '';
    document.getElementById('restart').classList.remove('hidden2');
    numSelected = null;
    tileSelected = null;
  });
  document.getElementById('restart').addEventListener('click', function () {
    numSelected = null;
    tileSelected = null;
    reload = location.reload();
  });
  document.getElementById('reset').addEventListener('click', function () {
    document.getElementById('board').innerHTML = '';
    document.getElementById('digits').innerHTML = '';
    mistakes = 0;
    document.getElementById('incorrect').innerText = mistakes;
    hint = 1;
    document.getElementById('hints').innerText = hint;
    document.querySelector('.head').innerText = 'Game Reset';
    if (document.querySelector('.hint-btn').classList.contains('hidden2')) {
      document.querySelector('.hint-btn').classList.remove('hidden2');
      document.querySelector('#hints').classList.remove('hidden2');
    }
    if (document.body.classList.contains('game-solved-by-AI')) {
      document.body.classList.remove('game-solved-by-AI');
      document.getElementById('submit').classList.remove('hidden2');
      document.getElementById('solve').classList.remove('hidden2');
    } else if (document.body.classList.contains('game-lost')) {
      document.body.classList.remove('game-lost');
      document.getElementById('submit').classList.remove('hidden2');
      document.getElementById('solve').classList.remove('hidden2');
    } else if (document.body.classList.contains('game-won')) {
      document.body.classList.remove('game-won');
      document.getElementById('submit').classList.remove('hidden2');
      document.getElementById('solve').classList.remove('hidden2');
    }
    numSelected = null;
    tileSelected = null;
    newGame();
  });
  document.getElementById('rules').addEventListener('click', function () {
    openModal();
  });
  document.getElementById('close-btn').addEventListener('click', closeModal);
  document.getElementById('over').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'Escape' &&
      !document.getElementById('mod').classList.contains('hidden')
    ) {
      closeModal();
    }
    if (
      e.key === 'r' &&
      document.getElementById('mod').classList.contains('hidden')
    ) {
      openModal();
    } else if (
      e.key === 'r' &&
      !document.getElementById('mod').classList.contains('hidden')
    ) {
      closeModal();
    }
    if (e.key === 'h') {
      hinted();
    }
  });
  // document.querySelector('#difficulty').addEventListener('click', function () {
  //   document.querySelector('.drop-links').classList.toggle('hidden2');
  // });
}

const closeModal = function () {
  document.getElementById('mod').classList.add('hidden');
  document.getElementById('over').classList.add('hidden');
};

const openModal = function () {
  document.getElementById('mod').classList.remove('hidden');
  document.getElementById('over').classList.remove('hidden');
};

const hinted = function () {
  if (hint === 0) {
    return;
  }
  const childrens = document.getElementById('board').childNodes;
  let childArr = [];
  for (let children of childrens) {
    let coords = children.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    if (children.innerText == '' || children.innerText !== solution[r][c]) {
      childArr.push(children);
    }
  }
  var item = childArr[Math.floor(Math.random() * childArr.length)];
  item.classList.add('game-won');
  setTimeout(function () {
    item.classList.remove('game-won');
  }, 1000);
  let coords = item.id.split('-');
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  item.innerText = solution[r][c];
  hint -= 1;
  document.getElementById('hints').innerText = hint;
  return;
};

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove('number-selected');
  }
  numSelected = this;
  this.classList.add('number-selected');
}

function selectTile() {
  let coords = this.id.split('-');
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  if (board[r][c] != '-') {
    return;
  } else if (solution[r][c] != numSelected.innerText && this.innerText == '') {
    document.getElementById('incorrect').classList.add('blink-bg');
    mistakes += 1;
    document.getElementById('incorrect').innerText = mistakes;
    if (mistakes >= 5) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          id = i.toString() + '-' + j.toString();
          if (board[i][j] == '-') {
            if (solution[i][j] !== document.getElementById(id).innerText) {
              document.body.classList.add('game-lost');
              document.querySelector('.head').innerText = 'Game lost';
              document.getElementById('submit').classList.add('hidden2');
              document.getElementById('restart').classList.remove('hidden2');
              document.getElementById('digits').innerHTML = '';
              numSelected = null;
              tileSelected = null;
              return;
            }
          }
        }
      }
    }
    setTimeout(function () {
      document.getElementById('incorrect').classList.remove('blink-bg');
    }, 1000);
  } else if (board[r][c] != '-') {
    return;
  }
  if (solution[r][c] != numSelected.innerText && this.innerText == '') {
    this.innerText = numSelected.innerText;
    let hi = this;
    this.classList.add('game-lost');
    setTimeout(function () {
      hi.innerText = '';
      hi.classList.remove('game-lost');
    }, 1000);
  } else if (numSelected != null && this.innerText == '') {
    this.innerText = numSelected.innerText;
  }
}

function solver(sudoku, row, col) {
  if (row == 8 && col == 9) {
    return true;
  }
  if (col === 9) {
    col = 0;
    row++;
  }
  if (sudoku[row][col] > 0) {
    return solver(sudoku, row, col + 1);
  }
  for (let num = 1; num < 10; num++) {
    // console.log(num);
    randNum = randomNumGenerator(1, 9);
    if (checker(sudoku, row, col, randNum)) {
      sudoku[row][col] = randNum;
      if (solver(sudoku, row, col + 1)) {
        return true;
      }
    }
    sudoku[row][col] = 0;
  }
  return false;
}

function randomNumGenerator(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checker(sudoku, row, col, num) {
  if (
    unusedInColumn(num, sudoku, col) == false ||
    unusedInRow(num, sudoku, row) == false
  ) {
    return false;
  }
  row = row - (row % 3);
  col = col - (col % 3);
  return boxChecker(sudoku, row, col, num);
}

function unusedInColumn(num, sudoku, col) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][col] === num) {
      return false;
    }
  }
}

function unusedInRow(num, sudoku, row) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === num) {
      return false;
    }
  }
}

function boxChecker(sudoku, row, col, num) {
  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      if (sudoku[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}

function numRemover(howMany) {
  for (let i = 0; i < howMany; i++) {
    let rand1 = randomNumGenerator(0, 8);
    let rand2 = randomNumGenerator(0, 8);
    if (sudoku[rand1][rand2] === 0) {
      i -= 1;
    } else {
      sudoku[rand1][rand2] = 0;
    }
  }
}
