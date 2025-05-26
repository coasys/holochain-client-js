import { ActionHash, AgentPubKey, Signature, Timestamp } from "../types.js";
import { Entry } from "./entry.js";
import { CreateLink, Delete, DeleteLink, Action, NewEntryAction, Update } from "./action.js";
/**
 * @public
 */
export declare enum ChainOpType {
    StoreRecord = "StoreRecord",
    StoreEntry = "StoreEntry",
    RegisterAgentActivity = "RegisterAgentActivity",
    RegisterUpdatedContent = "RegisterUpdatedContent",
    RegisterUpdatedRecord = "RegisterUpdatedRecord",
    RegisterDeletedBy = "RegisterDeletedBy",
    RegisterDeletedEntryAction = "RegisterDeletedEntryAction",
    RegisterAddLink = "RegisterAddLink",
    RegisterRemoveLink = "RegisterRemoveLink"
}
/**
 * @public
 */
export type DhtOp = {
    ChainOp: ChainOp;
} | {
    WarrantOp: WarrantOp;
};
/**
 * @public
 */
export interface WarrantOp {
    /** The warrant which was issued */
    warrant: Warrant;
    /** author of the warrant */
    author: AgentPubKey;
    /** signature of (Warrant, Timestamp) by the author */
    signature: Signature;
    /** time when the warrant was issued */
    timestamp: Timestamp;
}
/**
 * @public
 */
export type ChainOp = {
    [ChainOpType.StoreRecord]: [Signature, Action, Entry | undefined];
} | {
    [ChainOpType.StoreEntry]: [Signature, NewEntryAction, Entry];
} | {
    [ChainOpType.RegisterAgentActivity]: [Signature, Action];
} | {
    [ChainOpType.RegisterUpdatedContent]: [
        Signature,
        Update,
        Entry | undefined
    ];
} | {
    [ChainOpType.RegisterUpdatedRecord]: [
        Signature,
        Update,
        Entry | undefined
    ];
} | {
    [ChainOpType.RegisterDeletedBy]: [Signature, Delete];
} | {
    [ChainOpType.RegisterDeletedEntryAction]: [Signature, Delete];
} | {
    [ChainOpType.RegisterAddLink]: [Signature, CreateLink];
} | {
    [ChainOpType.RegisterRemoveLink]: [Signature, DeleteLink];
};
/**
 * @public
 */
export interface Warrant {
    /**
     * Signifies evidence of a breach of chain integrity
     */
    ChainIntegrity: ChainIntegrityWarrant;
}
/**
 * @public
 */
export type ChainIntegrityWarrant = {
    /**
     * Something invalid was authored on a chain.
     * When we receive this warrant, we fetch the Action and validate it
     * under every applicable DhtOpType.
     */
    InvalidChainOp: {
        /** The author of the action */
        action_author: AgentPubKey;
        /** The hash of the action to fetch by */
        action: ActionHashAndSig;
        /** Whether to run app or sys validation */
        validation_type: ValidationType;
    };
} | {
    /** Proof of chain fork. */
    ChainFork: {
        /** Author of the chain which is forked */
        chain_author: AgentPubKey;
        /** Two actions of the same seq number which prove the fork */
        action_pair: [ActionHashAndSig, ActionHashAndSig];
    };
};
/**
 * @public
 */
export type ValidationType = {
    /** Sys validation */
    Sys: null;
    /** App validation */
    App: null;
};
/**
 * Action hash with the signature of the action at that hash
 * @public
 */
export type ActionHashAndSig = [ActionHash, Signature];
/**
 * @public
 */
export declare function getChainOpType(op: ChainOp): ChainOpType;
/**
 * @public
 */
export declare function getChainOpAction(op: ChainOp): Action;
/**
 * @public
 */
export declare function getChainOpEntry(op: ChainOp): Entry | undefined;
/**
 * @public
 */
export declare function getChainOpSignature(op: ChainOp): Signature;
