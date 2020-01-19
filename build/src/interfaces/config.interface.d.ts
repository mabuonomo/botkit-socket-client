export interface IBotkitConfig {
    ws_url: string;
    reconnect_timeout: number;
    max_reconnect: number;
    enable_history: boolean;
    use_sockets: boolean;
    userGuid?: string;
}
