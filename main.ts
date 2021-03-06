/**
 * Wenn ein Roboter nach 100-200ms keine Antwort gibt, wird er übersprungen.
 * 
 * Was passiert wenn diese "every" loop den "wenn Text empfangen" loop unterbricht?
 */
/**
 * FunkDatenArt: Hier wird reingeschrieben ob die empfangenen Funkdaten Sensordaten sind oder sonstiges.
 * 
 * Polling_Zähler:
 * 
 * Hier wird gezählt, von welchem Roboter die aktuell empfangenen Sensordaten sind.
 * 
 * PollingWarteZähler:
 * 
 * Hiermit wird die Verbindung zu den einzelnen Robotern überwacht. Pro 100ms, wo das Programm auf eine Antwort eines Roboters wartet wird 1 raufgezählt. Wenn der Zähler bei 2 ist, hat der Roboter 100-200ms lange nichts gesendet und wird übersprungen.
 */
// Für nachher, wenn ich die Daten für mehrere Roboter aufteilen muss
function DatenWeiterleiten (SeriellDaten: string) {
    EmpangeneDaten = SeriellDaten
    radio.sendString(EmpangeneDaten)
    EmpfangenesArray = EmpangeneDaten.split(",")
}
input.onButtonPressed(Button.A, function () {
    basic.showLeds(`
        . . . . .
        . . . . #
        . # . # .
        . . # . .
        . . . . .
        `)
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    DatenWeiterleiten(serial.readLine())
})
radio.onReceivedString(function (receivedString) {
    if (receivedString.substr(0, 1) == "R") {
        FunkDatenArt = "Sensordaten"
        PollingZeitZuletzt = control.millis()
        GesendetZuletzt = control.millis()
        empfangenFunk = receivedString
        serial.writeLine(empfangenFunk)
        Polling_Zähler += 1
        if (Polling_Zähler < Anzahl_Roboter) {
            radio.sendString("send" + (Polling_Zähler + 1))
        } else {
            PollingFertig = true
        }
    } else {
        FunkDatenArt = "Sonstiges"
    }
})
let ÜbertragungSchlecht = false
let Polling_Zähler = 0
let empfangenFunk = ""
let GesendetZuletzt = 0
let PollingZeitZuletzt = 0
let FunkDatenArt = ""
let EmpfangenesArray: string[] = []
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
    . . . # .
    # # # # #
    . # . # .
    # # # # #
    . # . . .
    `)
Anzahl_Roboter = 4
PollingFertig = true
basic.forever(function () {
    if (PollingFertig) {
        radio.sendString("send1")
        PollingFertig = false
        Polling_Zähler = 0
    }
    if (control.millis() - GesendetZuletzt >= 5) {
        radio.sendString("send" + (Polling_Zähler + 1))
        GesendetZuletzt = control.millis()
    }
    if (control.millis() - PollingZeitZuletzt >= 200) {
        ÜbertragungSchlecht = true
        PollingZeitZuletzt = control.millis()
        Polling_Zähler += 1
        if (Polling_Zähler < Anzahl_Roboter) {
            radio.sendString("send" + (Polling_Zähler + 1))
        } else {
            PollingFertig = true
        }
    }
})
