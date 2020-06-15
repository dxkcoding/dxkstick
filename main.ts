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

enum BMPDataType {
    //% block="BMP_Pressure"
    BMPPressure = 0x1,
    //% block="BMP_Temperature"
    BMPTemperature = 0x2,
    //% block="BMP_Altitude"
    BMPAltitude = 0x3
}

enum DateTimeOption {
    //% block="Date_And_Time"
    DateAndTime = 0x1,
    //% block="Only_Date"
    OnlyDate = 0x2,
    //% block="Only_Time"
    OnlyTime = 0x3
}

enum DateTimeSingleOption {
    //% block="Only_Year"
    OnlyYear = 0x1,
    //% block="Only_Month"
    OnlyMonth = 0x2,
    //% block="Only_Day"
    OnlyDay = 0x3,
    //% block="Only_Hour"
    OnlyHour = 0x4,
    //% block="Only_Minute"
    OnlyMinute = 0x5,
    //% block="Only_Second"
    OnlySecond = 0x6
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

enum Animation_Type {
    //% block="Rainbaw"
    Rainbaw = 0,
    //% block="Shinelon"
    Shinelon = 1
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
    if (pins.i2cReadNumber(slot, NumberFormat.Int8BE) > 0) {
        return true;
    }
    else {
        return false;
    }
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
    //% blockId="Distance_Value" block="Get Distance Value from %slot"
    export function getDistance(slot: Slot): number {
        return execCmdReturn16(slot, "get_distance_val");
    }
    //% blockId="BMP_Data" block="Get %bmpdatatype from %slot"
    export function getBMPData(slot: Slot, bmpdatatype: BMPDataType): number {
        switch (bmpdatatype) {
            case 0x1: return execCmdReturn16(slot, "getP");
            case 0x2: return execCmdReturn16(slot, "getT");
            case 0x3: return execCmdReturn16(slot, "getA");
            default: return 1;
        }
    }
    //% blockId="Touch_State" block="Get Touch State from %slot"
    export function getTouchState(slot: Slot): boolean {
        return execCmdReturnBool(slot, "get_touch");
    }
    //% blockId="Led_ON" block="Set LED ON in %slot"
    export function LedON(slot: Slot): void {
        execCmd(slot, "set_led_on");
    }
    //% blockId="Led_OFF" block="Set LED OFF in %slot"
    export function LedOFF(slot: Slot): void {
        execCmd(slot, "set_led_off");
    }
    //% blockId="set_time" block="Set Time in %slot as "
    export function setTime(slot: Slot, year: number, month: number, day: number, h: number, m: number, s: number): void {
        execCmd(slot, "setT" + String.fromCharCode(year) + String.fromCharCode(month) + String.fromCharCode(day) + String.fromCharCode(h) + String.fromCharCode(m) + String.fromCharCode(s));
    }
    //% blockId="get_time" block="Get %datetimeoption in %slot as "
    export function getTime(slot: Slot, datetimeoption: DateTimeOption): string {
        pins.i2cWriteBuffer(slot, bufferFromString("getT"), false);
        let buf = pins.i2cReadBuffer(slot, 6);
        let yearnumber = buf.getNumber(NumberFormat.Int8BE, 0);
        let year = '';
        if (yearnumber > 10) {
            year = '20' +  + (yearnumber - 1).toString(); 
        }
        else {
             year = '20' + '0' + (yearnumber - 1).toString();
        }
        let month=(buf.getNumber(NumberFormat.Int8BE, 1) - 1).toString();
        let day = (buf.getNumber(NumberFormat.Int8BE, 2) - 1).toString();
        let hour = (buf.getNumber(NumberFormat.Int8BE, 3) - 1).toString();
        let minute = (buf.getNumber(NumberFormat.Int8BE, 4) - 1).toString();
        let second = (buf.getNumber(NumberFormat.Int8BE, 5) - 1).toString();
        switch (datetimeoption) {
            case 0x1: return(year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second);
            case 0x2: return(year + '-' + month + '-' + day);
            case 0x3: return(hour + ':' + minute + ':' + second);
            default: return(year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second);
        }
    }
    //% blockId="get_time_single" block="Get %datetimesingleoption in %slot as "
    export function getTimeSingle(slot: Slot, datetimesingleoption: DateTimeSingleOption): number {
        pins.i2cWriteBuffer(slot, bufferFromString("getT"), false);
        let buf = pins.i2cReadBuffer(slot, 6);
        switch (datetimesingleoption) {
            case 0x1: return(2000 + buf.getNumber(NumberFormat.Int8BE, 0) - 1);
            case 0x2: return(buf.getNumber(NumberFormat.Int8BE, 1) - 1);
            case 0x3: return(buf.getNumber(NumberFormat.Int8BE, 2) - 1);
            case 0x4: return(buf.getNumber(NumberFormat.Int8BE, 3) - 1);
            case 0x5: return(buf.getNumber(NumberFormat.Int8BE, 4) - 1);
            case 0x6: return(buf.getNumber(NumberFormat.Int8BE, 5) - 1);
            default: return(buf.getNumber(NumberFormat.Int8BE, 0) - 1);
        }
    }    
    //% blockId="motor" block="Move Motor in %slot at Speed %speed"
    export function Motor(slot: Slot, speed: number): void {
        if (speed > 0) {
            execCmd(slot, 'getf' + String.fromCharCode(Math.abs(speed)));
        }
        else {
            execCmd(slot, 'getb' + String.fromCharCode(Math.abs(speed)));
        }
        //basic.pause(1000);
    }
    //% blockId="steering_engine" block="Move steering_engine in %slot to Angle %speed"
    export function SetSteeringEngine(slot: Slot, angle: number): void {
        execCmd(slot, 'conA' + String.fromCharCode(Math.abs(angle)));
        //basic.pause(1000);
    }
    //% blockId="setup_neo" block="Setup Neo in %slot"
    export function setupNeo(slot: Slot, neo_grps: Neo_grps): void {
        execCmd(slot, "init1" + String.fromCharCode(neo_grps));
        basic.pause(10);
    }
    //% blockId="set_neo_pixel_color" block="Set Neo NO.%pos Pixel's Color to (r:%r ,g:%g ,b:%b ) in %slot"
    export function setNeoPixelColor(slot: Slot, pos: number, r: number, g: number, b: number): void {
        execCmd(slot, "setP" + String.fromCharCode(0) + String.fromCharCode(pos) + String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b));
        basic.pause(10);
    }
    //% blockId="set_neo_array99_color" block="Set Neo Array99 Pixel's Color at (X:%x ,Y:%y ) to (r:%r ,g:%g ,b:%b ) in %slot"
    export function setNeoArray99Color(slot: Slot, x: number, y: number, r: number, g: number, b: number): void {
        execCmd(slot, "setX" + String.fromCharCode(0) + String.fromCharCode(x) + String.fromCharCode(y) + String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b));
        basic.pause(10);
    }
    //% blockId="fill_neo_color" block="Fill Neo with Color of (r:%r ,g:%g ,b:%b ) in %slot"
    export function fillNeoColor(slot: Slot, r: number, g: number, b: number): void {
        execCmd(slot, "fill" + String.fromCharCode(0) + String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b));
        basic.pause(10);
    }
    //% blockId="set_neo_rainbpow" block="Set Neo Rainbow %t at Position %x with Lenth %n in %slot"
    export function setNeoRainbow(slot: Slot, t: Animation_Type, x: number, n: number): void {
        execCmd(slot, "rnbl" + String.fromCharCode(0) + String.fromCharCode(t) + String.fromCharCode(x) + String.fromCharCode(n));
        basic.pause(10);
    }
    //% blockId="oled_clear" block="OLED in %slot clear screen"
    export function oledClearScreen(slot: Slot): void {
        execCmd(slot, "ClearScreen");
        basic.pause(10);
    }
    //% blockId="oled_show" block="OLED in %slot |show message %msg"
    export function oledShowMsg(slot: Slot, msg: string) {
        for (let ii = 0; ii < 4; ii++) {
            if (msg.length > 16 * ii) {
                execCmd(slot, "DisplayGB2312," + ii * 2 + ",0," + msg.substr(16 * ii, 16 * ii + 15));
            }
        }
        //basic.pause(15);
    }
} 
