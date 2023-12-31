import { Grid, Cell } from "./grid";

export class GridSolver {

  constructor(rowHints, columnHints) {
    this.rowHints = rowHints;
    this.columnHints = columnHints;
  }

  solve(progress) {
    let grid = new Grid(this.columnHints.length, this.rowHints.length);

    let columnsToSolve = new Set();
    let rowsToSolve = new Set();

    for (let i = 0; i < grid.height; i++) {
      rowsToSolve.add(i);
    }
    for (let i = 0; i < grid.width; i++) {
      columnsToSolve.add(i);
    }

    while (rowsToSolve.size || columnsToSolve.size) {
      for (let row of rowsToSolve) {
        this.solveRow(grid, row).forEach(c => columnsToSolve.add(c));
        if (progress) {
          progress(grid);
        }
      }
      rowsToSolve.clear();

      for (let col of columnsToSolve) {
        this.solveColumn(grid, col).forEach(r => rowsToSolve.add(r));
        if (progress(grid)) {
          progress(grid);
        }
      }
      columnsToSolve.clear();
    }

    return grid;
  }

  solveRow(grid, row) {
    const [solvedRow, changedColumns] = this.solveData(this.rowHints[row], grid.getRow(row));
    grid.setRow(row, solvedRow);
    return changedColumns;
  }

  solveColumn(grid, column) {
    const [solvedColumn, changedRows] = this.solveData(this.columnHints[column], grid.getColumn(column));
    grid.setColumn(column, solvedColumn);
    return changedRows;
  }

  solveData(hints, data) {
    const solvedData = new GridRowSolver(hints, data).solve();
    return [
      solvedData,
      data
        .map((r, i) => [r, i])
        .filter(r => r[0] !== solvedData[r[1]])
        .map(r => r[1])];
  }

}

export class GridRowSolver {
  constructor(hints, data) {
    this.data = data.slice();
    this.hints = hints.filter(h => h > 0);
    this.validate = true;
  }

  set(type, from, to) {
    if (from < 0 || from > this.data.length - 1) {
      return;
    }

    if (to !== undefined && (to < 0 || to > this.data.length - 1 || to < from)) {
      return;
    }

    for (let i = from; i <= (to || from); i++) {
      if (this.validate) {
        if (this.data[i] !== Cell.EMPTY && this.data[i] !== type) {
          throw 'Cannot change already set cell';
        }
      }

      this.data[i] = type;
    }
  }

  is(type, i) {
    if (i < 0 || i > this.data.length - 1) {
      return type === Cell.SPACE;
    }
    return this.data[i] === type;
  }

  contains(type, from, to) {
    for (let i = from; i <= to; i++) {
      if (this.is(type, i)) {
        return true;
      }
    }
    return false;
  }

  parse(from, to) {
    let runs = [];
    let current = this.data[from];
    let start = from;

    for (let i = from; i <= to; i++) {
      if (this.data[i] !== current) {
        runs.push(this.createRun(current, start, i - 1));
        current = this.data[i];
        start = i;
      }

      if (i == to) {
        runs.push(this.createRun(current, start, i));
      }
    }

    return runs;
  }

  createRun(type, start, end) {
    return { type: type, start: start, end: end, size: end - start + 1 };
  }


  expand(run, size, from, to) {
    let left = this.findLeftBoundary(run, size, from);
    this.set(Cell.FULL, run[1], left + size - 1);

    if (left == run[0] && left + size <= to) {
      this.set(Cell.SPACE, left + size);
    }

    let right = this.findRightBoundary(run, size, to);
    this.set(Cell.FULL, right - size + 1, run[0]);

    if (right == run[1] && right - size >= from) {
      this.set(Cell.SPACE, right - size);
    }
  }


  solve() {
    let orig = [];
    do {
      orig = this.data.slice();
      this.solveRange(this.hints, 0, this.data.length - 1);
    } while (!this.equals(this.data, orig));

    return this.data;
  }

  equals(arr1, arr2) {
    if (arr1.length != arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  overlap(hints, from, to) {
    let start = from;
    let end = to;

    let endIndexes = [];
    let reverseEndIndexes = [];

    for (let i = 0; i < hints.length; i++) {
      while (this.contains(Cell.SPACE, start, start + hints[i] - 1)) {
        start++;
      }

      while (this.contains(Cell.SPACE, end - hints[hints.length - 1 - i] + 1, end)) {
        end--;
      }

      endIndexes.push(start + hints[i] - 1);
      reverseEndIndexes.push(end - hints[hints.length - 1 - i] + 1);

      start += hints[i] + 1;
      end -= hints[hints.length - 1 - i] + 1;
    }

    for (let i = 0; i < hints.length; i++) {
      let endIndex = endIndexes[i];
      let reverseEndIndex = reverseEndIndexes[hints.length - 1 - i];

      if (reverseEndIndex <= endIndex) {
        this.set(Cell.FULL, reverseEndIndex, endIndex);
      }
    }
  }

  fillGaps(hints, from, to) {
    let gaps = this.getRuns(Cell.EMPTY, from, to);
    for (let gap of gaps) {
      if (hints.every(h => h > gap.size
        && this.is(Cell.SPACE, gap.start - 1)
        && this.is(Cell.SPACE, gap.end + 1))) {
        this.set(Cell.SPACE, gap.start, gap.end);
      }
    }
  }

  findLeftBoundary(range, size, from) {
    for (let i = range[0] - 1; i >= from; i--) {
      if (this.is(Cell.SPACE, i)) {
        return i + 1;
      } else if (this.is(Cell.FULL, i)) {
        let start = i;
        while (start >= from && this.is(Cell.FULL, start)) {
          start--;
        }
        start++;
        if (range[1] - start + 1 > size) {
          return i + 2;
        }
      } else if (i + size - 1 == range[1]) {
        if (this.is(Cell.FULL, i - 1)) {
          return i + 1;
        } else {
          return i;
        }
      } else if (i == from) {
        return i;
      }
    }
    return from;
  }

  findRightBoundary(range, size, to) {
    for (let i = range[1] + 1; i <= to; i++) {
      if (this.is(Cell.SPACE, i)) {
        return i - 1;
      } else if (this.is(Cell.FULL, i)) {
        let end = i;
        while (end <= to && this.is(Cell.FULL, end)) {
          end++;
        }
        end--;
        if (end - range[0] + 1 > size) {
          return i - 2;
        }
      } else if (i - size + 1 == range[0]) {
        if (this.is(Cell.FULL, i + 1)) {
          return i - 1;
        } else {
          return i;
        }
      } else if (i == to) {
        return i;
      }
    }
    return to;
  }

  mayRangesOverlap(hints, ranges) {
    if (hints.length != ranges.length) {
      return true;
    }

    for (let i = 0; i < hints.length - 1; i++) {
      let r1 = ranges[i];
      let r2 = ranges[i + 1];

      if (r2[1] - r1[0] + 1 <= hints[i]) {
        return true;
      }
    }

    return false;
  }

  getRuns(type, from, to) {
    return this.parse(from, to).filter(r => r.type === type);
  }

  solveRange(hints, from, to) {
    if (!hints.length) {
      this.set(Cell.SPACE, from, to);
      return this.data;
    }

    this.overlap(hints, from, to);

    let runs = this.parse(from, to);
    let h = 0;
    let found = null;

    for (let i = 0; i < runs.length - 1; i++) {
      let run = runs[i];

      if (run.type === Cell.SPACE) {
        if (found) {
          h++; //TODO: check if next hint exists
          found = null;
          this.solveRange(hints.slice(h), run.start, to);
        }
        continue;
      }

      if (run.type === Cell.EMPTY) {
        if (!found) {
          if (runs[i + 1].type === Cell.SPACE) {
            if (run.size < hints[h]) {
              this.set(Cell.SPACE, run.start, run.end);
            } else {
              break;
            }
          } else if (runs[i + 1].type === Cell.FULL) {
            if (run.size < hints[h] + 1) {
              this.set(Cell.SPACE, run.start, runs[i + 1].end - hints[h]);
            } else {
              break;
            }
          }
        } else {
          if (runs[i + 1].type == Cell.SPACE) {
            if (run.size < hints[h + 1] + 1) {
              this.set(Cell.SPACE, found.start + hints[h], run.end);
            } else {
              break;
            }
          } else if (runs[i + 1].type == Cell.FULL) {
            if (runs.size >= hints[h + 1] + 2) {
              break; //TODO: check if there are 2 more hints
            }
          }
        }
      }
      if (run.type === Cell.FULL) {
        if (found) {
          if (run.end - found.start + 1 > hints[h]) {
            if (run.start - found.end == 2) {
              this.set(Cell.SPACE, run.start - 1);
            }

            //TODO: check if next hint exists
            this.expand([run.start, run.end], hints[h + 1], from, to);
            this.expand([found.start, found.end], hints[h], from, to);

            found = run;
            h++;
          } else if (run.size > hints[h + 1]) {
            this.set(Cell.FULL, found.end + 1, run.start - 1);
            found = this.createRun(Cell.FULL, found.start, run.end);
          }
        } else {
          this.expand([run.start, run.end], hints[h], from, to);
          found = run;
        }
      }
    }

    let filled = this.getRuns(Cell.FULL, from, to);
    if (filled.length) {
      if (!this.mayRangesOverlap(hints, filled)) {
        for (let i = 0; i < hints.length; i++) {
          let leftBoundary = i == 0 ? from : (filled[i - 1].start + hints[i - 1]) + 1;
          let rightBoundary = i == hints.length - 1 ? to : (filled[i + 1].end - hints[i + 1]) - 1;

          this.set(Cell.SPACE, leftBoundary, filled[i].end - hints[i]);
          this.set(Cell.SPACE, filled[i].start + hints[i], rightBoundary);

          this.expand([filled[i].start, filled[i].end], hints[i], from, to);
        }
      } else if (hints.length < filled.length) {
        for (let i = 0; i < hints.length; i++) {
          let r1 = filled[i];
          let r2 = filled[i + 1];

          //if (r2[1] - r1[0] < hint[i])

        }
      }
    }

    this.fillGaps(hints, from, to);

    return this.data;
  }
}
