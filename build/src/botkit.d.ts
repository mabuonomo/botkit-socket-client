import ws = require("ws");
import { IBotkitConfig } from "./interfaces/config.interface";
export default class BotKitClient {
    config: IBotkitConfig;
    socket: ws;
    constructor(config: IBotkitConfig);
    private getGuid;
    send(text: string): boolean;
    private deliverMessage;
    private connectWebsocket;
}
