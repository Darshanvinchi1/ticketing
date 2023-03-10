import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subject";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-services';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Evenet data! ',data);

        console.log(data.id);
        console.log(data.title);
        console.log(data.price);

        msg.ack();
    }
}