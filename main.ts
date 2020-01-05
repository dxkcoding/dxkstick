enum Slot {
    //% block="A"
    SlotA = 0x16,
    //% block="B"
    SlotB = 0x17
}

function bufferFromString(s: string): Buffer {
    let buf = pins.createBuffer(s.length);
    for (let i = 0; i < s.length; i++) {
        buf.setNumber(NumberFormat.Int8LE, i, s.charCodeAt(i));
    }
    return buf;
}

function execCmd(slot: Slot, cmd: string): number {
    pins.i2cWriteBuffer(slot, bufferFromString(cmd), false);
    let val = pins.i2cReadNumber(slot, NumberFormat.Int8LE);
    basic.pause(50);
    return val;
}
//% weight=0 color=#94070A icon="\uf0ac" block="dxktest"
namespace dxktest {
    //% blockId="humidity" block="MyGet Humidity from slot %slot"
    export function getHumidity(slot: Slot): number {
        //let cmd = pins.createBufferFromArray(Array "get_humi")
        return execCmd(slot, "get_humi");
    }
    //% blockId="temperature" block="Get Temperature from slot %slot"
    export function getTemp(slot: Slot): number {
        return execCmd(slot, "get_temp");
    }
} 