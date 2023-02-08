import { OrderCreatedEvent, OrderStatus } from "@dvticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup =  async () => {
    // create an listener of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
         title: 'concert',
         price: 99,
         userId: 'asss'
    });

    await ticket.save();

    // create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'assa',
        expiresAt: 'asas',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg:Message ={
        ack: jest.fn()
    }

    return { listener, data, ticket, msg };
}

it('sets the userId of the ticket', async () => {
    const { listener, msg, ticket, data } = await setup();

    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);

    expect(updateTicket!.orderId).toEqual(data.id);
})

it('ack the message', async () => {
    const { listener, msg, ticket, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, msg, ticket, data } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})