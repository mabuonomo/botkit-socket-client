declare const WebSocket: any;
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
    trigger: (event: any, details: any) => void;
    request: (url: any, body: any) => Promise<unknown>;
    send: (text: any, e: any) => boolean;
    deliverMessage: (message: any) => void;
    getHistory: (guid: any) => void;
    webhook: (message: any) => void;
    connect: (user: any) => void;
    connectWebhook: () => void;
    connectWebsocket: (ws_url: any) => void;
    clearReplies: () => void;
    quickReply: (payload: any) => void;
    focus: () => void;
    renderMessage: (message: any) => void;
    triggerScript: (script: any, thread: any) => void;
    identifyUser: (user: any) => void;
    receiveCommand: (event: any) => void;
    sendEvent: (event: any) => void;
    setCookie: (cname: any, cvalue: any, exdays: any) => void;
    getCookie: (cname: any) => string;
    generate_guid: () => string;
    boot: (user: any) => any;
};
