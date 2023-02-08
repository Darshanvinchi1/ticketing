import { Publisher, Subjects, OrderCancelled } from "@dvticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
    subject: Subjects.OrderCancelled =  Subjects.OrderCancelled;
}