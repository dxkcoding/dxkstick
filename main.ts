enum Slot {
    //% block="Slot_A"
    SlotA = 0x16,
    //% block="Slot_B"
    SlotB = 0x17
}

enum TempHumi {
    //% block="Temperature"
    Temperature = 0x1,
    //% block="Humidity"
    Humidity = 0x2
}

enum HandleButton {
    //% block="Handle_Hand"
    HandlPress = 1,
    //% block="Handle_Up"
    UpBottun = 2,
    //% block="Handle_Down"
    DownBottun = 3,
    //% block="Handle_Left"
    LeftBottun = 4,
    //% block="Handle_Right"
    RightBottun = 5
}

enum HandleAxis {
    //% block="Handle_X"
    HandleX = 6,
    //% block="Handle_Y"
    HandleY = 8
}

enum Neo_grps {
    //% block="Ring_24"
    Ring24 = 1,
    //% block="Array_99"
    Array99 = 2,
    //% block="Belt_30"
    Belt30 = 3
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
    let val = pins.i2cReadNumber(slot, NumberFormat.Int8BE);
    //basic.pause(50);
    return val;
}
function execCmdReturn16(slot: Slot, cmd: string): number {
    pins.i2cWriteBuffer(slot, bufferFromString(cmd), false);
    let val = pins.i2cReadNumber(slot, NumberFormat.Int16BE);
    //basic.pause(50);
    return val;
}
function execCmdReturnBool(slot: Slot, cmd: string): boolean {
    pins.i2cWriteBuffer(slot, bufferFromString(cmd), false);
    let val = true;
    if (pins.i2cReadNumber(slot, NumberFormat.Int8BE) == 0) {
        val = false;
    }
    return val;
}
function execCmdHandle(slot: Slot, ChosenByte: number): number {
    pins.i2cWriteBuffer(slot, bufferFromString("get_key_val"), false);
    let buf = pins.i2cReadBuffer(slot, 9);
    let val = 0;
    if (ChosenByte <= 5) {
        val = buf.getNumber(NumberFormat.Int8BE, ChosenByte - 1);
    }
    else {
        val = buf.getNumber(NumberFormat.Int16BE, ChosenByte - 1);
    }
    //basic.pause(50);
    return val;
}

//% weight=0 color=#f58f98 icon="\uf0ac" block="dxktest"
namespace dxktest {
    //% blockId="Temp_Humi" block="Get %temp_humi from %slot"
    export function getTempHumi(slot: Slot, temp_humi: TempHumi): number {

        switch (temp_humi) {
            case 0x1: return execCmdReturn(slot, "get_temp");
            case 0x2: return execCmdReturn(slot, "get_humi");
            default: return 2;
        }
    }
    //% blockId="potential_value" block="Get Potential Value from %slot"
    export function getPoten(slot: Slot): number {
        return execCmdReturn16(slot, "get_poten_val");
    }
    //% blockId="light_value" block="Get Light Value from %slot"
    export function getLight(slot: Slot): number {
        return execCmdReturn16(slot, "get_light_val");
    }
    //% blockId="Microphone_value" block="Get Microphone Value from %slot"
    export function getMicrophone(slot: Slot): number {
        return execCmdReturn16(slot, "get_mic_val");
    }
    //% blockId="Handle_Button_State" block="Get Handle %handle_button State from %slot"
    export function getHandleButton(slot: Slot, handle_button: HandleButton): boolean {
        if (execCmdHandle(slot, handle_button) > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    //% blockId="Handle_Axis" block="Get %handle_axis from %slot"
    export function getHandleAxis(slot: Slot, handle_axis: HandleAxis): number {
        return execCmdHandle(slot, handle_axis);
    }
    //% blockId="Distance_value" block="Get Distance Value from %slot"
    export function getDistance(slot: Slot): number {
        return execCmdReturn16(slot, "get_distance_val");
    }
    //% blockId="Pressure_value" block="Get Pressure Value from %slot"
    export function getPressure(slot: Slot): number {
        return execCmdReturn16(slot, "get_pressure");
    }
    //% blockId="Touch_State" block="Get Touch State from %slot"
    export function getTouchState(slot: Slot): boolean {
        return execCmdReturnBool(slot, "get_touch");
    }
    //% blockId="led_on" block="LED in %slot ON"
    export function ledON(slot: Slot): void {
        execCmd(slot, "set_led_on");
    }
    //% blockId="led_off" block="LED in %slot OFF"
    export function ledOFF(slot: Slot): void {
        execCmd(slot, "set_led_off");
    }
    //% blockId="set_time" block="Set Time in %slot as "
    export function setTime(slot: Slot, year: number, month: number, day: number, h: number, m: number, s: number): void {
        execCmd(slot, "setT" + year + month + day + h + m + s);
    }
    //% blockId="get_time" block="Get Time in %slot as "
    export function getTime(slot: Slot): string {
        execCmd(slot, "getT" );
        let buf = pins.i2cReadBuffer(slot, 6);
        let datetime= '20';
        datetime = datetime + buf.getNumber(NumberFormat.Int8BE,0).toString() + '-';
        datetime = datetime + buf.getNumber(NumberFormat.Int8BE,1).toString() + '-';
        datetime = datetime + buf.getNumber(NumberFormat.Int8BE,2).toString() + ' ';
        datetime = datetime + buf.getNumber(NumberFormat.Int8BE,3).toString() + ':';
        datetime = datetime + buf.getNumber(NumberFormat.Int8BE,4).toString() + ':';
        datetime = datetime + buf.getNumber(NumberFormat.Int8BE,5).toString();
        return datetime;
    }
    //% blockId="motor" block="Move Motor in %slot"
    export function Motor(slot: Slot, distance: number): void {
        if(distance > 0){
            execCmd(slot, 'getf' + Math.abs(distance));
        }
        else{
            execCmd(slot, 'getb' + Math.abs(distance));
        } 
        basic.pause(1000);
    }
    //% blockId="setup_neo" block="Setup Neo in %slot"
    export function setupNeo(slot: Slot, neo_grps: Neo_grps): void {
        execCmd(slot, "init1" + neo_grps);
        basic.pause(10);
    }
    //% blockId="set_neo_color" block="Set Neo Color in %slot"
    export function setNeoColor(slot: Slot, neo_grps: Neo_grps, pos: number, r: number, g: number, b: number): void {
        execCmd(slot, "setP" + neo_grps + r + g + b);
        basic.pause(10);
    }
    //% blockId="oled_clear" block="OLED in %slot clear screen"
    export function oledClearScreen(slot: Slot): void {
        execCmd(slot, "ClearScreen");
        basic.pause(10);
    }
    //% blockId="oled_show" block="OLED in %slot |show message %msg"
    export function oledShowMsg(slot: Slot, msg: string) {
        execCmd(slot, "DisplayGB2312,0,0," + msg.substr(0, 16));
        basic.pause(15);
    }
} 