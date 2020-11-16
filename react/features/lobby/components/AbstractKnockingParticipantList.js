// @flow

import { PureComponent } from 'react';

import { isLocalParticipantModerator } from '../../base/participants';
import { setKnockingParticipantApproval, participantIsKnockingOrUpdated, setKnockingState, knockingParticipantLeft } from '../actions';

import socketIOClient from 'socket.io-client';
import hostAuth from "../../../../current_auth";

declare var interfaceConfig: Object;

export type Props = {

    /**
     * The list of participants.
     */
    _participants: Array<Object>,

    /**
     * True if the list should be rendered.
     */
    _visible: boolean,

    /**
     * The Redux Dispatch function.
     */
    dispatch: Function,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function
};

/**
 * Abstract class to encapsulate the platform common code of the {@code KnockingParticipantList}.
 */
export default class AbstractKnockingParticipantList<P: Props = Props> extends PureComponent<P> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: P) {
        super(props);

        this.state = {
            hostname: hostAuth.auth.nickname,
            meetingId: hostAuth.auth.meetingid,
            endpoint: interfaceConfig.SOCKET_NODE || 'https://oneconf-dev3.cloudns.asia' ///UAT test
        }

    }

    componentDidMount() {
        this.onSocketTest()
    }

    onSocketTest() {
        const { dispatch } = this.props
        const { meetingId, endpoint } = this.state
        const onMeetingId = meetingId
        const socket = socketIOClient(endpoint)
        socket.on(onMeetingId , (incoming) => {
            console.log("Mysocket: ", incoming)
            // dispatch(setKnockingState(true))
            dispatch(participantIsKnockingOrUpdated(incoming));
        })
    }


    /**
     * Function that constructs a callback for the response handler button.
     *
     * @param {string} id - The id of the knocking participant.
     * @param {boolean} approve - The response for the knocking.
     * @returns {Function}
     */
    // return Approve to Socket
    _onRespondToParticipantSocket(id, approve) {
        const { dispatch } = this.props
        const { meetingId, endpoint } = this.state
        const socket = socketIOClient(endpoint)
        const data = {
            meetingid: meetingId,
            id: id,
            approve: approve
        }
        console.log("DATA: ", data)
        socket.emit('handleApprove', data) 
        // dispatch(setKnockingState(false))
        dispatch(knockingParticipantLeft(id))
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
export function mapStateToProps(state: Object): $Shape<Props> {
    const { knockingParticipants, lobbyEnabled } = state['features/lobby'];
    // console.log("KnockingParticipants: ", knockingParticipants)

    return {
        _participants: knockingParticipants,
        _visible: isLocalParticipantModerator(state) && Boolean(knockingParticipants.length)
    };
}
