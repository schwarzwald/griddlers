import './style.css';
import { solve, createTable } from './griddlers';

function attach() {
  const rowHints = [
    [6],
    [3, 3],
    [2, 2],
    [2, 1, 1, 2],
    [1, 1],

    [1, 1, 1, 1],
    [1, 4, 1],
    [2, 2],
    [3, 3],
    [6],
  ];

  const columnHints = [
    [6],
    [3, 2],
    [2, 1, 2],
    [2, 1, 1, 2],
    [1, 1, 1],

    [1, 1, 1],
    [2, 1, 1, 2],
    [2, 1, 2],
    [3, 2],
    [6],
  ];

  const table = createTable(rowHints, columnHints);
  const container = document.getElementById('container');
  container.appendChild(table);

  solve(rowHints, columnHints, grid => {
    table.griddlers.setData(grid)
  });
}

window.addEventListener('load', () => {
  attach();
});