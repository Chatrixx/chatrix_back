import { Request } from "express";

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export type RequestWithAnyQuery = Request<any, any, any, any>;

export type AuthenticatedRequest = RequestWithAnyQuery & {
  auth: { user: AuthenticatedUser };
};
