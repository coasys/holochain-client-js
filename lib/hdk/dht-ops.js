// https://github.com/holochain/holochain/blob/develop/crates/types/src/dht_op.rs
/**
 * @public
 */
export var ChainOpType;
(function (ChainOpType) {
    ChainOpType["StoreRecord"] = "StoreRecord";
    ChainOpType["StoreEntry"] = "StoreEntry";
    ChainOpType["RegisterAgentActivity"] = "RegisterAgentActivity";
    ChainOpType["RegisterUpdatedContent"] = "RegisterUpdatedContent";
    ChainOpType["RegisterUpdatedRecord"] = "RegisterUpdatedRecord";
    ChainOpType["RegisterDeletedBy"] = "RegisterDeletedBy";
    ChainOpType["RegisterDeletedEntryAction"] = "RegisterDeletedEntryAction";
    ChainOpType["RegisterAddLink"] = "RegisterAddLink";
    ChainOpType["RegisterRemoveLink"] = "RegisterRemoveLink";
})(ChainOpType || (ChainOpType = {}));
/**
 * @public
 */
export function getChainOpType(op) {
    return Object.keys(op)[0];
}
/**
 * @public
 */
export function getChainOpAction(op) {
    const opType = getChainOpType(op);
    const action = Object.values(op)[0][1];
    if (opType === ChainOpType.RegisterAddLink) {
        return {
            type: "CreateLink",
            ...action,
        };
    }
    if (opType === ChainOpType.RegisterUpdatedContent ||
        opType === ChainOpType.RegisterUpdatedRecord) {
        return {
            type: "Update",
            ...action,
        };
    }
    if (action.author)
        return action;
    else {
        const actionType = Object.keys(action)[0];
        return {
            type: actionType,
            ...action[actionType],
        };
    }
}
/**
 * @public
 */
export function getChainOpEntry(op) {
    return Object.values(op)[0][2];
}
/**
 * @public
 */
export function getChainOpSignature(op) {
    return Object.values(op)[0][1];
}
