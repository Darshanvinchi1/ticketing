import { PaymentCreatedEvent, Publisher, Subjects } from "@dvticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}