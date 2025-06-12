import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      name: string;
      email: string;
      role: string;
      organizationId?: number;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  session: Session & {
    user?: {
      id: string;
      username: string;
      name: string;
      email: string;
      role: string;
      organizationId?: number;
    }
  }
}