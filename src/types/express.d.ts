// import { UserDocument } from '@/models';

declare namespace Express {
  export interface Request {
    currentUser?: UserDocument;
    // userRole?: string;
  }
}
