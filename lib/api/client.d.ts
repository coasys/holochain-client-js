/// <reference types="ws" />
import Emittery from "emittery";
import IsoWebSocket from "isomorphic-ws";
import { WsClientOptions } from "./common.js";
import { AppAuthenticationToken } from "./admin/index.js";
/**
 * @public
 */
export interface AppAuthenticationRequest {
    token: AppAuthenticationToken;
}
/**
 * A WebSocket client which can make requests and receive responses,
 * as well as send and receive signals.
 *
 * Uses Holochain's WireMessage for communication.
 *
 * @public
 */
export declare class WsClient extends Emittery {
    socket: IsoWebSocket;
    url: URL | undefined;
    options: WsClientOptions;
    private pendingRequests;
    private index;
    private authenticationToken;
    constructor(socket: IsoWebSocket, url?: URL, options?: WsClientOptions);
    /**
     * Instance factory for creating WsClients.
     *
     * @param url - The WebSocket URL to connect to.
     * @param options - Options for the WsClient.
     * @returns An new instance of the WsClient.
     */
    static connect(url: URL, options?: WsClientOptions): Promise<WsClient>;
    /**
     * Sends data as a signal.
     *
     * @param data - Data to send.
     */
    emitSignal(data: unknown): void;
    /**
     * Authenticate the client with the conductor.
     *
     * This is only relevant for app websockets.
     *
     * @param request - The authentication request, containing an app authentication token.
     */
    authenticate(request: AppAuthenticationRequest): Promise<void>;
    /**
     * Close the websocket connection.
     */
    close(code?: number): Promise<IsoWebSocket.CloseEvent>;
    /**
     * Send requests to the connected websocket.
     *
     * @param request - The request to send over the websocket.
     * @returns
     */
    request<Response>(request: unknown): Promise<Response>;
    private exchange;
    private sendMessage;
    private registerMessageListener;
    private registerCloseListener;
    private reconnectWebsocket;
    private handleResponse;
}
export { IsoWebSocket };
