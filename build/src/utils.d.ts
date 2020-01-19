export declare function generateGuid(): string;
export declare enum ConnectEvent {
    HELLO = "hello",
    WELCOME_BACK = "welcome_back",
    MESSAGE = "message"
}
export declare enum ListenerEvent {
    OPEN = "open",
    MESSAGE = "message",
    ERROR = "error",
    CLOSE = "close"
}
