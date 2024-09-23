import type { Env } from "hono";
import type { Session, User } from "lucia";

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
    file_id: string;
    file_path: string;
    file_name: string;
  };
}
