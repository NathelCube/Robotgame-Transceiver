/**
 * Für nachher, wenn ich die Daten für mehrere Roboter aufteilen muss
 */
input.onButtonPressed(Button.A, function () {
    basic.showLeds(`
        . . # . .
        . # . # .
        . # # # .
        # . # . #
        # . . . #
        `)
    radio.sendNumber(50)
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    EmpangeneDaten = serial.readLine()
    datenEmpfangen = 1
})
input.onButtonPressed(Button.B, function () {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . # # .
        # . . . #
        # # # # #
        `)
    radio.sendNumber(10)
})
let datenEmpfangen = 0
let EmpangeneDaten = ""
radio.setGroup(1)
serial.setTxBufferSize(50)
serial.setRxBufferSize(50)
serial.setWriteLinePadding(0)
serial.redirect(
SerialPin.P0,
SerialPin.P14,
BaudRate.BaudRate115200
)
basic.showLeds(`
    # # # . .
    # # # # #
    # # # . .
    # # # . #
    # # # . .
    `)
basic.forever(function () {
    if (datenEmpfangen) {
        serial.writeLine(EmpangeneDaten)
        datenEmpfangen = 0
        radio.sendString(EmpangeneDaten)
    }
})
loops.everyInterval(100, function () {
    radio.sendString("send1")
})
