import { Publisher, Subjects, TicketCreatedEvent } from "@dvticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}