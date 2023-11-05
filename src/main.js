import './style.css';
import { solve, Cell } from './griddlers';

function attach() {
  const hints = [5, 4, 3, 3];
  //const row = [-1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, -1, 0, -1, -1, 0, -1, 0, -1, -1, 0, 1, 1, 1, -1, -1, -1, -1, -1];//, -1, -1, -1, -1, -1];
  const row = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, 0, -1, 0, -1, -1, 0, 1, 1, 1, -1, -1, -1, -1, -1];//, -1, -1, -1, -1, -1];
  //row.fill(Cell.UNKNOWN);

  const row2 = new Array(25);
  row2.fill(Cell.EMPTY);
  row2[15] = Cell.FULL;
  row2[9] = Cell.FULL;

  const container = document.getElementById('container');
  const solved = solve(hints, row);
  draw(container, hints, row);
  draw(container, hints, solved);

  draw(container, [2, 1], row2);
  draw(container, [2, 1], solve([2, 1], row2));
}

function draw(container, hints, data) {
  const row = document.createElement('div');
  row.classList.add('row');

  hints.forEach(h => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add('hint');
    cell.textContent = h;
    row.appendChild(cell);
  });

  data.forEach((d, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (i % 5 == 0) {
      cell.classList.add('border');
    }
    if (d === Cell.FULL) {
      cell.classList.add('full');
    } else if (d == Cell.SPACE) {
      cell.classList.add('empty');
    }
    row.appendChild(cell);
  });

  container.appendChild(row);
}

window.addEventListener('load', () => {
  attach();
});