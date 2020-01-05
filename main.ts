enum Slot {
    //% block="Slot_A"
    SlotA = 0x16,
    //% block="Slot_B"
    SlotB = 0x17
}

function bufferFromString(s: string): Buffer {
    let buf = pins.createBuffer(s.length);
    for (let i = 0; i < s.length; i++) {
        buf.setNumber(NumberFormat.Int8LE, i, s.charCodeAt(i));
    }
    return buf;
}
function execCmd(slot: Slot, cmd: string): void {
    pins.i2cWriteBuffer(slot, bufferFromString(cmd), false);
    //basic.pause(20);
    return;
}
function execCmdReturn(slot: Slot, cmd: string): number {
    pins.i2cWriteBuffer(slot, bufferFromString(cmd), false);
    let val = pins.i2cReadNumber(slot, NumberFormat.Int8LE);
    //basic.pause(50);
    return val;
}
//% weight=0 color=#94070A icon="\uf0ac" block="dxktest"
namespace dxktest {
    //% blockId="humidity" block="Get Humidity from %slot"
    export function getHumidity(slot: Slot): number {
        return execCmdReturn(slot, "get_humi");
    }
    //% blockId="temperature" block="Get Temperature from %slot"
    export function getTemp(slot: Slot): number {
        return execCmdReturn(slot, "get_temp");
    }
    //% blockId="led_on" block="LED in %slot ON"
    export function ledON(slot: Slot): void {
        execCmd(slot, "set_led_on");
    }
    //% blockId="led_off" block="LED in %slot OFF"
    export function ledOFF(slot: Slot): void {
        execCmd(slot, "set_led_off");
    }
    //% blockId="oled_clear" block="OLED in %slot clear screen"
    export function oledClearScreen(slot: Slot): void {
        execCmd(slot, "ClearScreen");
        basic.pause(10);
    }
    //% blockId="oled_show" block="OLED in %slot |show message %msg"
    export function oledShowMsg(slot: Slot, msg: string) {
        execCmd(slot, "DisplayGB2312,0,0,"+msg.substr(0,16));
        basic.pause(15); 
    }
} 