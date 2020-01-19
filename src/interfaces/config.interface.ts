export interface IBotkitConfig {
  ws_url: string; //"ws://localhost:3000",
  reconnect_timeout: number; //3000,
  max_reconnect: number; //5,
  enable_history: boolean; //false
  use_sockets: boolean;
  userGuid?: string;
}
