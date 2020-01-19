declare const WebSocketWS: any;
declare var Botkit: {
    config: {
        ws_url: string;
        reconnect_timeout: number;
        max_reconnect: number;
        enable_history: boolean;
    };
    options: {
        use_sockets: boolean;
    };
    reconnect_count: number;
    guid: any;
    current_user: any;
    on: (event: any, handler: any) => void;
    request: (url: any, body: any) => Promise<unknown>;
    send: (text: any, e: any) => boolean;
    deliverMessage: (message: any) => void;
    getHistory: (guid: any) => void;
    webhook: (message: any) => void;
    connect: (user_guid: any) => void;
    connectWebhook: () => void;
    connectWebsocket: (ws_url: any) => void;
    quickReply: (payload: any) => void;
    triggerScript: (script: any, thread: any) => void;
    identifyUser: (user: any) => void;
    receiveCommand: (event: any) => void;
    generate_guid: () => string;
    boot: (user: any) => any;
};
