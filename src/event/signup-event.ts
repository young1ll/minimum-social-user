import { BaseAuthEvent } from './base-event';
import { UserDocument } from '../models';

export type SignUpRestPayload = {
  id: string;
  email: string;
};

export default class EventSignedUp extends BaseAuthEvent<SignUpRestPayload> {
  private user: UserDocument;

  private statusCode = 201;

  constructor(user: UserDocument) {
    super();
    this.user = user;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeRest(): SignUpRestPayload {
    return {
      id: this.user._id,
      email: this.user.email,
    };
  }
}
