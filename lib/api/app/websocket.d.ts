import { UnsubscribeFunction } from "emittery";
import { AgentPubKey, InstalledAppId, RoleName } from "../../types.js";
import { AppInfo, ClonedCell, DumpNetworkMetricsRequest, DumpNetworkMetricsResponse, DumpNetworkStatsResponse, MemproofMap } from "../admin/index.js";
import { WsClient } from "../client.js";
import { AbandonCountersigningSessionStateRequest, AppClient, AppEvents, AppWebsocketConnectionOptions, CallZomeRequest, CallZomeRequestSigned, CreateCloneCellRequest, DisableCloneCellRequest, EnableCloneCellRequest, GetCountersigningSessionStateRequest, GetCountersigningSessionStateResponse, PublishCountersigningSessionStateRequest, RoleNameCallZomeRequest, SignalCb } from "./types.js";
/**
 * A class to establish a websocket connection to an App interface, for a
 * specific agent and app.
 *
 * @public
 */
export declare class AppWebsocket implements AppClient {
    readonly client: WsClient;
    readonly myPubKey: AgentPubKey;
    readonly installedAppId: InstalledAppId;
    private readonly defaultTimeout;
    private readonly emitter;
    private readonly callZomeTransform;
    cachedAppInfo?: AppInfo | null;
    private readonly appInfoRequester;
    private readonly callZomeRequester;
    private readonly provideMemproofRequester;
    private readonly enableAppRequester;
    private readonly createCloneCellRequester;
    private readonly enableCloneCellRequester;
    private readonly disableCloneCellRequester;
    private readonly dumpNetworkStatsRequester;
    private readonly dumpNetworkMetricsRequester;
    private readonly getCountersigningSessionStateRequester;
    private readonly abandonCountersigningSessionRequester;
    private readonly publishCountersigningSessionRequester;
    private constructor();
    /**
     * Instance factory for creating an {@link AppWebsocket}.
     *
     * @param token - A token to authenticate the websocket connection. Get a token using AdminWebsocket#issueAppAuthenticationToken.
     * @param options - {@link (WebsocketConnectionOptions:interface)}
     * @returns A new instance of an AppWebsocket.
     */
    static connect(options?: AppWebsocketConnectionOptions): Promise<AppWebsocket>;
    /**
     * Request the app's info, including all cell infos.
     *
     * @param timeout - A timeout to override the default.
     * @returns The app's {@link AppInfo}.
     */
    appInfo(timeout?: number): Promise<AppInfo>;
    /**
     * Request network stats.
     *
     * @returns The conductor's {@link TransportStats}.
     */
    dumpNetworkStats(timeout?: number): Promise<DumpNetworkStatsResponse>;
    /**
     * Request network metrics.
     *
     * @returns The {@link NetworkMetrics}.
     */
    dumpNetworkMetrics(req: DumpNetworkMetricsRequest, timeout?: number): Promise<DumpNetworkMetricsResponse>;
    /**
     * Provide membrane proofs for the app.
     *
     * @param memproofs - A map of {@link MembraneProof}s.
     */
    provideMemproofs(memproofs: MemproofMap): Promise<void>;
    /**
     * Enable an app only if the app is in the `AppStatus::Disabled(DisabledAppReason::NotStartedAfterProvidingMemproofs)`
     * state. Attempting to enable the app from other states (other than Running) will fail.
     */
    enableApp(): Promise<void>;
    /**
     * Get a cell id by its role name or clone id.
     *
     * @param roleName - The role name or clone id of the cell.
     * @param appInfo - The app info containing all cell infos.
     * @returns The cell id or throws an error if not found.
     */
    getCellIdFromRoleName(roleName: RoleName, appInfo: AppInfo): import("../../types.js").CellId;
    /**
     * Call a zome.
     *
     * @param request - The zome call arguments.
     * @param timeout - A timeout to override the default.
     * @returns The zome call's response.
     */
    callZome<ReturnType>(request: CallZomeRequest | RoleNameCallZomeRequest, timeout?: number): Promise<ReturnType>;
    /**
     * Clone an existing provisioned cell.
     *
     * @param args - Specify the cell to clone.
     * @returns The created clone cell.
     */
    createCloneCell(args: CreateCloneCellRequest): Promise<ClonedCell>;
    /**
     * Enable a disabled clone cell.
     *
     * @param args - Specify the clone cell to enable.
     * @returns The enabled clone cell.
     */
    enableCloneCell(args: EnableCloneCellRequest): Promise<ClonedCell>;
    /**
     * Disable an enabled clone cell.
     *
     * @param args - Specify the clone cell to disable.
     */
    disableCloneCell(args: DisableCloneCellRequest): Promise<void>;
    /**
     * Get the state of a countersigning session.
     */
    getCountersigningSessionState(args: GetCountersigningSessionStateRequest): Promise<GetCountersigningSessionStateResponse>;
    /**
     * Abandon an unresolved countersigning session.
     *
     * If the current session has not been resolved automatically, it can be forcefully abandoned.
     * A condition for this call to succeed is that at least one attempt has been made to resolve
     * it automatically.
     *
     * # Returns
     *
     * [`AppResponse::CountersigningSessionAbandoned`]
     *
     * The session is marked for abandoning and the countersigning workflow was triggered. The session
     * has not been abandoned yet.
     *
     * Upon successful abandoning the system signal [`SystemSignal::AbandonedCountersigning`] will
     * be emitted and the session removed from state, so that [`AppRequest::GetCountersigningSessionState`]
     * would return `None`.
     *
     * In the countersigning workflow it will first be attempted to resolve the session with incoming
     * signatures of the countersigned entries, before force-abandoning the session. In a very rare event
     * it could happen that in just the moment where the [`AppRequest::AbandonCountersigningSession`]
     * is made, signatures for this session come in. If they are valid, the session will be resolved and
     * published as usual. Should they be invalid, however, the flag to abandon the session is erased.
     * In such cases this request can be retried until the session has been abandoned successfully.
     *
     * # Errors
     *
     * [`CountersigningError::WorkspaceDoesNotExist`] likely indicates that an invalid cell id was
     * passed in to the call.
     *
     * [`CountersigningError::SessionNotFound`] when no ongoing session could be found for the provided
     * cell id.
     *
     * [`CountersigningError::SessionNotUnresolved`] when an attempt to resolve the session
     * automatically has not been made.
     */
    abandonCountersigningSession(args: AbandonCountersigningSessionStateRequest): Promise<null>;
    /**
     * Publish an unresolved countersigning session.
     *
     * If the current session has not been resolved automatically, it can be forcefully published.
     * A condition for this call to succeed is that at least one attempt has been made to resolve
     * it automatically.
     *
     * # Returns
     *
     * [`AppResponse::PublishCountersigningSessionTriggered`]
     *
     * The session is marked for publishing and the countersigning workflow was triggered. The session
     * has not been published yet.
     *
     * Upon successful publishing the system signal [`SystemSignal::SuccessfulCountersigning`] will
     * be emitted and the session removed from state, so that [`AppRequest::GetCountersigningSessionState`]
     * would return `None`.
     *
     * In the countersigning workflow it will first be attempted to resolve the session with incoming
     * signatures of the countersigned entries, before force-publishing the session. In a very rare event
     * it could happen that in just the moment where the [`AppRequest::PublishCountersigningSession`]
     * is made, signatures for this session come in. If they are valid, the session will be resolved and
     * published as usual. Should they be invalid, however, the flag to publish the session is erased.
     * In such cases this request can be retried until the session has been published successfully.
     *
     * # Errors
     *
     * [`CountersigningError::WorkspaceDoesNotExist`] likely indicates that an invalid cell id was
     * passed in to the call.
     *
     * [`CountersigningError::SessionNotFound`] when no ongoing session could be found for the provided
     * cell id.
     *
     * [`CountersigningError::SessionNotUnresolved`] when an attempt to resolve the session
     * automatically has not been made.
     */
    publishCountersigningSession(args: PublishCountersigningSessionStateRequest): Promise<null>;
    /**
     * Register an event listener for signals.
     *
     * @param eventName - Event name to listen to (currently only "signal").
     * @param listener - The function to call when event is triggered.
     * @returns A function to unsubscribe the event listener.
     */
    on<Name extends keyof AppEvents>(eventName: Name | readonly Name[], listener: SignalCb): UnsubscribeFunction;
    private static requester;
}
/**
 * @public
 */
export declare const signZomeCall: (request: CallZomeRequest) => Promise<CallZomeRequestSigned>;
