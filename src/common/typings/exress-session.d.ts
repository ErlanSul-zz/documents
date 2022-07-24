import { USER_ROLES } from '../../users/constants/enum.constants';

declare global {
  namespace Express {
    interface User {
      id: number;
      guestId: string;
      username: string;
      roles: USER_ROLES[];
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: Express.User;
      guest: {
        id: string;
      };
      id?: string;
    };
  }
}
