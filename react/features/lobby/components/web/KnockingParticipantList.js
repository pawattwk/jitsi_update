// @flow

import React from 'react';

import { Avatar } from '../../../base/avatar';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { isToolboxVisible } from '../../../toolbox';
import AbstractKnockingParticipantList, {
    mapStateToProps as abstractMapStateToProps,
    type Props as AbstractProps
} from '../AbstractKnockingParticipantList';

import socketIOClient from 'socket.io-client'
import axios from 'axios';

declare var interfaceConfig: Object;

type Props = AbstractProps & {

    /**
     * True if the toolbox is visible, so we need to adjust the position.
     */
    _toolboxVisible: boolean,
};

/**
 * Component to render a list for the actively knocking participants.
 */
class KnockingParticipantList extends AbstractKnockingParticipantList<Props> {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    constructor() {
        super()
        this.state = {
            hostname: '',
            meetingId: '',
            member: [],
            endpoint: interfaceConfig.SOCKET_NODE || 'https://oneconference-new.inet.co.th' //UAT socket
        }
        const socket = socketIOClient(this.state.endpoint)
    }
    onHostname = () => {
        const { hostname, meetingId } = this.state
        let dataBody = {
            meetingId: meetingId
        }
        // console.log("MEETING_ID--> ",window.location.href)
        // axios.post(interfaceConfig.DOMAIN_BACK, dataBody)
        //     .then( (res) => {
        //         console.log("Check session -->> ", res)
        //     })
    }
    resMember = () => {
        const { member } = this.state

    }
    render() {
        const { _participants, _visible, t } = this.props;
        const knockingBox = true
        this.onHostname()

        if (!_visible) {
            return null;
        }

        return (
            <div
                className = { knockingBox ? 'toolbox-visible' : '' }
                id = 'knocking-participant-list'>
                <span className = 'title'>
                    Knocking participant list
                </span>
                <ul>
                    { _participants.map(p => (
                        <li key = { p.id }>
                            {/* <Avatar
                                displayName = { p.name }
                                size = { 48 }
                                url = { p.loadableAvatarUrl } /> */}
                            <div className = 'details'>
                                <span>
                                    { p.name }
                                </span>
                                { p.email && (
                                    <span>
                                        { p.email }
                                    </span>
                                ) }
                            </div>
                            <button
                                className = 'primary'
                                onClick = { this._onRespondToParticipant(p.id, true) }
                                type = 'button'>
                                { t('lobby.allow') }
                            </button>
                            <button
                                className = 'borderLess'
                                onClick = { this._onRespondToParticipant(p.id, false) }
                                type = 'button'>
                                { t('lobby.reject') }
                            </button>
                        </li>
                    )) }
                </ul>
            </div>
        );
    }

    _onRespondToParticipant: (string, boolean) => Function;
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state: Object): $Shape<Props> {
    return {
        ...abstractMapStateToProps(state),
        _toolboxVisible: isToolboxVisible(state)
    };
}

export default translate(connect(_mapStateToProps)(KnockingParticipantList));
