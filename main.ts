enum Slot {
    //% block="A"
    SlotA = 0x16,
    //% block="B"
    SlotB = 0x17
}
//% weight=0 color=#94070A icon="\uf57e" block="dxktest"
namespace dxktest {
    //% blockId="humidity" block="Get Humidity slot %slot"
    export function getHumidity(slot: Slot): number
    {
        return slot
    }
} 