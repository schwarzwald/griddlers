export const Cell = {
  SPACE: 0,
  FULL: 1,
  EMPTY: -1
}

export class Grid {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Array(this.width * this.height);
    this.data.fill(Cell.EMPTY);
  }

  set(row, column, value) {
    this.data[row * this.width + column] = value;
  }

  getRow(row) {
    const rowData = new Array(this.width);
    for (let i = 0; i < this.width; i++) {
      rowData[i] = this.data[row * this.width + i];
    }
    return rowData;
  }

  setRow(row, rowData) {
    for (let i = 0; i < this.width; i++) {
      this.data[row * this.width + i] = rowData[i];
    }
  }

  getColumn(column) {
    const columnData = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      columnData[i] = this.data[i * this.width + column];
    }
    return columnData;
  }

  setColumn(column, columnData) {
    for (let i = 0; i < this.height; i++) {
      this.data[i * this.width + column] = columnData[i];
    }
  }

}
