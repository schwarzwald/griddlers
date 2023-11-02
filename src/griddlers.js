export const Cell = {
  SPACE: 0,
  FULL: 1,
  EMPTY: -1
}

const solveRange = (hints, copy, from, to) => {
  // overlap(hints, copy, from, to);

  let rangeStart = null;
  for (let i = from; i <= to; i++) {
    if (copy[i] === Cell.EMPTY) {
      if (rangeStart == null) {
        rangeStart = i;
      }
    } else if (copy[i] === Cell.SPACE) {
      if (rangeStart != null) {
        if (i - rangeStart < hints[0]) {
          for (let j = rangeStart; j < i; j++) {
            copy[j] = Cell.SPACE;
          }
          rangeStart = null;
        } else {
          break;
        }
      }
    } else if (copy[i] == Cell.FULL) {
      if (rangeStart != null && i - rangeStart - 1 >= hints[0]) {
        break;
      }
      let rangeEnd = i;
      while (copy[rangeEnd] === Cell.FULL) {
        rangeEnd++;
      }
      expandRange([i, rangeEnd - 1], hints[0], copy);
      break;

    }
  }


  let filled = findFilledRanges(copy);
  if (filled.length) {
    if (!mayRangesOverlap(hints, filled)) {
      for (let i = 0; i < hints.length; i++) {
        let leftBoundary = i == 0 ? from : (filled[i - 1][0] + hints[i - 1]) + 1;
        let rightBoundary = i == hints.length - 1 ? to : (filled[i + 1][1] - hints[i + 1]) - 1;

        for (let j = leftBoundary; j <= (filled[i][1] - hints[i]); j++) {
          copy[j] = Cell.SPACE;
        }
        for (let j = rightBoundary; j >= (filled[i][0] + hints[i]); j--) {
          copy[j] = Cell.SPACE;
        }

        let range = filled[i];
        expandRange(range, hints[i], copy);

      }
    } else if (hints.length < filled.length) {
      for (let i = 0; i < hints.length; i++) {
        let r1 = filled[i];
        let r2 = filled[i + 1];

        //if (r2[1] - r1[0] < hint[i])

      }
    }
  }



  console.log(copy);

  return copy;

}

const expandRange = (range, size, copy) => {
  let left = findLeftBoundary(range, size, copy);
  for (let j = range[1]; j < left + size; j++) {
    copy[j] = Cell.FULL;
  }
  if (left == range[0] && left + size < copy.length) {
    copy[left + size] = Cell.SPACE;
  }

  let right = findRightBoundary(range, size, copy);
  for (let j = range[0]; j > right - size; j--) {
    copy[j] = Cell.FULL;
  }
  if (right == range[1] && right - size >= 0) {
    copy[right - size] = Cell.SPACE;
  }

}

const mayRangesOverlap = (hints, ranges) => {
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

export const solve = (hints, data) => {
  let orig = data;
  let solved = orig;
  do {
    orig = solved;
    solved = solveRange(hints, orig.slice(), 0, orig.length - 1);
  } while (!equals(solved, orig));

  return solved;
}

const equals = (arr1, arr2) => {
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

const findPotentialHints = (range, hints, data) => {
  for (let i = 0; i < hints.length; i++) {
    let hint = hints[i];
    if (range[1] - range[0] + 1 > hint) {
      continue;
    }



  }
  //TODO:
  // check if range size is <= hint size
  // check if previous hints can fit to the left
  // check if next hints can fit to the right
  return [];
}

const fits = (hints, data, from, to) => {

}

const overlap = (hints, data, from, to) => {
  let offsetLeft = from;
  let offsetRight = to;

  while (data[offsetLeft] === Cell.SPACE) {
    offsetLeft++;
  }

  while (data[offsetRight] == Cell.SPACE) {
    offsetRight--;
  }

  for (let i = 0; i < hints.length; i++) {
    let hint = hints[i];
    let startIndex = offsetLeft;
    for (let j = 0; j < i; j++) {
      startIndex += hints[j] + 1;
    }
    let endIndex = startIndex + hint - 1;

    let reverseStartIndex = offsetRight;
    for (let j = hints.length - 1; j > i; j--) {
      reverseStartIndex -= hints[j] + 1;
    }
    let reverseEndIndex = reverseStartIndex - hint + 1;

    if (reverseEndIndex <= endIndex) {
      for (let j = reverseEndIndex; j <= endIndex; j++) {
        data[j] = Cell.FULL;
      }
    }
  }
}

const findLeftBoundary = (range, size, data) => {
  for (let i = range[0] - 1; i >= 0; i--) {
    if (data[i] === Cell.SPACE) {
      return i + 1;
    } else if (i + size - 1 == range[1]) {
      return i;
    } else if (i == 0) {
      return i;
    }
    //TODO: consider overlap with filled data
  }
  return 0;
}

const findRightBoundary = (range, size, data) => {
  for (let i = range[1] + 1; i < data.length; i++) {
    if (data[i] === Cell.SPACE) {
      return i - 1;
    } else if (i - size + 1 == range[0]) {
      return i;
    } else if (i == data.length - 1) {
      return i;
    }
    //TODO: consider overlap with filled data
  }
  return data.length - 1;
}



const identifyRanges = (hints, data) => {
  let filled = findFilledRanges(data);

  //hints[0]

  for (let i = 0; i < hints.length; i++) {
    let hint = hints[i];
  }
}

export const findEmptyRanges = (data, from, to) => {
  let ranges = [];

  let rangeStart = null;
  for (let i = from; i <= to; i++) {
    if (data[i] === Cell.EMPTY) {
      if (rangeStart == null) {
        rangeStart = i;
      }
      if (i == to) {
        ranges.push([rangeStart, i]);
      }
    } else if (rangeStart != null) {
      rangeStart = [rangeStart, i - 1];
      rangeStart = null;
    }
  }
  return ranges;
}

export const findFilledRanges = (data) => {
  let ranges = [];
  let rangeStart = null;
  for (let i = 0; i < data.length; i++) {
    let cell = data[i];
    if (cell === Cell.FULL) {
      if (rangeStart == null) {
        rangeStart = i;
      }
      if (i == data.length - 1) {
        ranges.push([rangeStart, i]);
      }
    } else if (rangeStart != null) {
      ranges.push([rangeStart, i - 1]);
      rangeStart = null;
    }
  }
  return ranges;
}