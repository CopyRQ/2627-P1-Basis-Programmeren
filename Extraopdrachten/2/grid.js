let grid = [
[0, 0, 0], 
[0, 0, 0],
[0, 0, 0], ];

let numberOfColumns = 3;
let numberOfRows = 3;
let cellSize = 200; // Width and height of each cell in pixels
let cellGap = 20; // Gap between cells in pixels

let gridOffsetX, gridOffsetY; // Distance from the edge of the canvas to the grid

async function setup() {
  createCanvas(1200, 800);

  gridOffsetX = (width - numberOfColumns * cellSize) / 2;
  gridOffsetY = (height - numberOfRows * cellSize) / 2;
}

function draw() {
  frameRate(0)
  background(220);
    for (let column = 0; column < numberOfColumns; column++) {
    for (let row = 0; row < numberOfRows; row++) {
      let cellX = gridOffsetX + column * cellSize;
      let cellY = gridOffsetY + row * cellSize;

      strokeWeight(2);
      rect(
        cellX + cellGap / 2,
        cellY + cellGap / 2,
        cellSize - cellGap,
        cellSize - cellGap
      );
    }
  }
}

function mousePressed (){
  let clickedColumn = floor((mouseX - gridOffsetX) / cellSize);
  let clickedRow = floor((mouseY - gridOffsetY) / cellSize);

   if (clickedColumn >= 0 && clickedColumn < numberOfColumns && clickedRow >= 0 && clickedRow < numberOfRows) 
    { 
    // when you click on any of the boxes in the grid this executes 
    text("hello",random(0,1200),random(0,800))
   }
}
