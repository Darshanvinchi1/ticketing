import { Subjects, Publisher, ExpirationCompleteEvent } from '@dvticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}