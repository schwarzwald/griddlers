import { Cell } from "./grid";
import { GridSolver } from "./solver";

export function solve(rowHints, columnHints, progress) {
  return new GridSolver(rowHints, columnHints).solve(progress);
}

export function createTable(rowHints, columnHints) {

  let table = document.createElement('table');
  table.classList.add('griddlers');

  let columnHintsSize = Math.max(...columnHints.map(c => c.length));
  let rowHintsSize = Math.max(...rowHints.map(r => r.length));

  for (let i = 0; i < columnHintsSize + rowHints.length; i++) {
    let row = document.createElement('tr');

    for (let j = 0; j < rowHintsSize + columnHints.length; j++) {
      let cell = document.createElement('td');

      if (i < columnHintsSize && j >= rowHintsSize) {
        let hints = columnHints[j - rowHintsSize];

        let idx = columnHintsSize - i - 1;
        if (idx < hints.length) {
          cell.textContent = hints[hints.length - 1 - idx];
        }

        if ((j - rowHintsSize) % 5 == 0) {
          cell.classList.add('column-border');
        }
      } else if (j < rowHintsSize && i >= columnHintsSize) {
        let hints = rowHints[i - columnHintsSize];

        let idx = rowHintsSize - j - 1;
        if (idx < hints.length) {
          cell.textContent = hints[hints.length - 1 - idx];
        }

        if ((i - columnHintsSize) % 5 == 0) {
          cell.classList.add('row-border');
        }
      } else if (i >= columnHintsSize && j >= rowHintsSize) {
        cell.classList.add('cell');

        if ((i - columnHintsSize) % 5 == 0) {
          cell.classList.add('row-border');
        }
        if ((j - rowHintsSize) % 5 == 0) {
          cell.classList.add('column-border');
        }
      }

      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  table.griddlers = new GridController(table);

  return table;
}


class GridController {

  constructor(table) {
    this.table = table;
  }


  setData(grid) {
    let cells = this.table.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];

      cell.classList.remove('full');
      cell.classList.remove('empty');

      if (grid.data[i] === Cell.FULL) {
        cell.classList.add('full');
      } else if (grid.data[i] === Cell.SPACE) {
        cell.classList.add('empty');
      }
    }
  }
}