import client, {Registry} from "prom-client";

export const konfigurerMetrikker = () => {
    const register = new Registry();
    client.collectDefaultMetrics({ register });
    return register;
}