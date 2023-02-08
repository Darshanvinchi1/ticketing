import { Listener } from "@dvticketing/common";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent } from "@dvticketing/common/build/events/order-created-event";
import { Subjects } from "@dvticketing/common/build/events/subject";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay =  new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:', delay);

        await expirationQueue.add({
            orderId: data.id
        },
        {
            delay,
        }
        );

        msg.ack();
    }

}