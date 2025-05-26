/**
 * @public
 */
export var CountersigningSessionStateType;
(function (CountersigningSessionStateType) {
    CountersigningSessionStateType["Accepted"] = "Accepted";
    CountersigningSessionStateType["SignaturesCollected"] = "SignaturesCollected";
    CountersigningSessionStateType["Unknown"] = "Unknown";
})(CountersigningSessionStateType || (CountersigningSessionStateType = {}));
/**
 * The reason why a countersigning session can not be resolved automatically and requires manual resolution.
 *
 * @public
 */
export var ResolutionRequiredReason;
(function (ResolutionRequiredReason) {
    /** The session has timed out, so we should try to resolve its state before abandoning. */
    ResolutionRequiredReason["Timeout"] = "Timeout";
    /** Something happened, like a conductor restart, and we lost track of the session. */
    ResolutionRequiredReason["Unknown"] = "Unknown";
})(ResolutionRequiredReason || (ResolutionRequiredReason = {}));
/**
 * Decision about an incomplete countersigning session.
 *
 * @public
 */
export var SessionCompletionDecisionType;
(function (SessionCompletionDecisionType) {
    /** Evidence found on the network that this session completed successfully. */
    SessionCompletionDecisionType["Complete"] = "Complete";
    /**
     * Evidence found on the network that this session was abandoned and other agents have
     * added to their chain without completing the session.
     */
    SessionCompletionDecisionType["Abandoned"] = "Abandoned";
    /**
     * No evidence, or inconclusive evidence, was found on the network. Holochain will not make an
     * automatic decision until the evidence is conclusive.
     */
    SessionCompletionDecisionType["Indeterminate"] = "Indeterminate";
    /**There were errors encountered while trying to resolve the session. Errors such as network
     * errors are treated differently to inconclusive evidence. We don't want to force a decision
     * when we're offline, for example. In this case, the resolution must be retried later and this
     * attempt should not be counted.
     */
    SessionCompletionDecisionType["Failed"] = "Failed";
})(SessionCompletionDecisionType || (SessionCompletionDecisionType = {}));
export var SignalType;
(function (SignalType) {
    SignalType["App"] = "app";
    SignalType["System"] = "system";
})(SignalType || (SignalType = {}));
