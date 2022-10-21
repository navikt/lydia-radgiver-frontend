import { Session } from "express-session";

declare module "express-session" {
    export interface Session {
        azureOboToken: string;
        accessToken: string;
    }
}
