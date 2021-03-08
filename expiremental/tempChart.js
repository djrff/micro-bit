let globalColumn = 0
let globalEdge = 0;
let row = 0
let overThreshold = 0
let steps = 0
let brightnessSteps: number[] = []
let lowerThreshold = 0
brightnessSteps = [1, 5, 25, 100, 255]

led.plotBrightness(0, 4, brightnessSteps[0])
led.plotBrightness(0, 3, brightnessSteps[1])
led.plotBrightness(1, 3, brightnessSteps[1])
led.plotBrightness(0, 2, brightnessSteps[2])
led.plotBrightness(1, 2, brightnessSteps[2])
led.plotBrightness(2, 2, brightnessSteps[2])
led.plotBrightness(0, 1, brightnessSteps[3])
led.plotBrightness(1, 1, brightnessSteps[3])
led.plotBrightness(2, 1, brightnessSteps[3])
led.plotBrightness(3, 1, brightnessSteps[3])
led.plotBrightness(0, 0, brightnessSteps[4])
led.plotBrightness(1, 0, brightnessSteps[4])
led.plotBrightness(2, 0, brightnessSteps[4])
led.plotBrightness(3, 0, brightnessSteps[4])
led.plotBrightness(4, 0, brightnessSteps[4])
lowerThreshold = 10
steps = 5
let temp = 20
const shortPause = 50;
basic.pause(500)
basic.clearScreen();

const measurements: number[] = [];

function addBar (temp: number, column: number) {
    let row = 4;
    let overThreshold = temp - lowerThreshold;
    while (row > -1) {
        if (overThreshold > 5) {
            led.plotBrightness(column, row, brightnessSteps[4])
        } else if (overThreshold > 0) {
            led.plotBrightness(column, row, brightnessSteps[overThreshold -1])
        }        
        overThreshold = overThreshold - 5;
        row--;
    }
}

function clearColumn(col: number) {
    for(let row = 0; row < 5; row++) {
        led.unplot(col, row)
    }
}

function copyColumn(fromCol: number, toCol: number) {
    for(let row = 0; row < 5; row++) {
        const brightness = led.pointBrightness(fromCol, row);
        led.plotBrightness(toCol, row, brightness);
    }
}
function shiftLeft() {
    globalColumn--;
    for(let i = 0; i < 4; i++) {
        copyColumn(i + 1, i);
        basic.pause(shortPause)
    }
    clearColumn(4);
    globalEdge = measurements.length;
}

function shiftRight() {
    globalEdge--;
    for(let i = 4; i > 0; i--) {
        copyColumn(i - 1, i);
        basic.pause(shortPause)
    }
    clearColumn(0);
    addBar(measurements[globalEdge - 5], 0);
}

function redrawChart() {
    basic.clearScreen();
    let columns;
    if (measurements.length > 4) {
        columns = measurements.slice(-5);
        globalColumn = 5;
    } else {
        columns = measurements
        globalColumn = columns.length;
    }
    columns.forEach((temp, column) => {
        addBar(temp, column);
    });
    globalEdge = measurements.length;
}

input.onButtonPressed(Button.B, function () {
    const temp = input.temperature();
    if (globalEdge !== measurements.length) {
        redrawChart();
    }
    if (globalColumn === 5) {
        shiftLeft();
    }
    addBar(input.temperature(), globalColumn);
    measurements.push(temp);
    globalEdge++;
    globalColumn++;
})

input.onButtonPressed(Button.A, function () {
    if (globalEdge > 5) {
        shiftRight();
    }
})

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
  redrawChart();  
})