import { Publisher, OrderCreatedEvent, Subjects } from "@dvticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}