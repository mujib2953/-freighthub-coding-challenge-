async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

async function randomDelay() {
    const randomTime = Math.round(Math.random() * 1000)
    return sleep(randomTime)
}

class ShipmentSearchIndex {
    async updateShipment(id: string, shipmentData: any) {
        const startTime = new Date()
        await randomDelay()
        const endTime = new Date()
        console.log(`update ${id}@${
            startTime.toISOString()
            } finished@${
            endTime.toISOString()
            }`
        )

        return { startTime, endTime }
    }
}

// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any)
}


// ---------------------------
// class Shipment extends ShipmentSearchIndex implements ShipmentUpdateListenerInterface {
class Shipment implements ShipmentUpdateListenerInterface {

    private shipmentQueue: string[];

    constructor(private shipmentSearchIndex: ShipmentSearchIndex) {
        this.shipmentQueue = [];
    }

    async receiveUpdate(id: string, shipmentData:  any) {

        if (this.shipmentQueue.includes(id)) {
            // --- this id is present in the queue so not to proceed.
            console.info(`Sorry, This shipment: ${id} is already in the queue`);
            return;
        }

        // --- Adding new shipment to process
        this.shipmentQueue.push(id);

        try {
            const time = await this.shipmentSearchIndex.updateShipment(id, shipmentData);
            console.info(`Shipment updated for ${id}. and ${shipmentData}`);
        } catch(e) {
            console.info(`Shipment updated unsuccessfull for ${id} -  ${shipmentData}.`, e);
        } finally {
            // --- we have to update the queue after every success/error in updateShipment
            this.shipmentQueue = this.shipmentQueue.filter(ids => ids !== id);
            console.log("Queue is updated.");
        }
    }
}
