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
radio.onReceivedString(function (receivedString) {
    empfangenFunk = receivedString
    serial.writeLine(empfangenFunk)
    Polling_Zähler += 1
    if (Polling_Zähler < Anzahl_Roboter) {
        radio.sendString("send2")
    } else {
        PollingFertig = true
    }
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
let Polling_Zähler = 0
let empfangenFunk = ""
let datenEmpfangen = 0
let EmpangeneDaten = ""
let PollingFertig = false
let Anzahl_Roboter = 0
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
Anzahl_Roboter = 2
PollingFertig = true
basic.forever(function () {
    if (datenEmpfangen) {
        serial.writeLine(EmpangeneDaten)
        datenEmpfangen = 0
        radio.sendString(EmpangeneDaten)
    }
})
loops.everyInterval(100, function () {
    if (PollingFertig) {
        radio.sendString("send1")
        PollingFertig = false
        Polling_Zähler = 0
    }
})
