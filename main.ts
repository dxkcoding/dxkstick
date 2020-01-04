basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `);
pins.i2cReadNumber(0, NumberFormat.Int8LE)
pins.i2cWriteNumber(0, 0, NumberFormat.Int8LE)
