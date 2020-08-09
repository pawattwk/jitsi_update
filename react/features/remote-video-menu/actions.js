// @flow
import type { Dispatch } from 'redux';
import axios from 'axios';
import UIEvents from '../../../service/UI/UIEvents';
import {
    AUDIO_MUTE,
    createRemoteMuteConfirmedEvent,
    createToolbarEvent,
    sendAnalytics
} from '../analytics';
import { hideDialog } from '../base/dialog';
import { setAudioMuted } from '../base/media';
import {
    getLocalParticipant,
    muteRemoteParticipant
} from '../base/participants';

import { RemoteVideoMenu } from './components';

import { kickParticipant } from '../base/participants';

declare var APP: Object;

/**
 * Hides the remote video menu.
 *
 * @returns {Function}
 */
export function hideRemoteVideoMenu() {
    return hideDialog(RemoteVideoMenu);
}

/**
 * Mutes the local participant.
 *
 * @param {boolean} enable - Whether to mute or unmute.
 * @returns {Function}
 */
export function muteLocal(enable: boolean) {
    return (dispatch: Dispatch<any>) => {
        sendAnalytics(createToolbarEvent(AUDIO_MUTE, { enable }));
        dispatch(setAudioMuted(enable, /* ensureTrack */ true));

        // FIXME: The old conference logic as well as the shared video feature
        // still rely on this event being emitted.
        typeof APP === 'undefined'
            || APP.UI.emitEvent(UIEvents.AUDIO_MUTED, enable, true);
    };
}

/**
 * Mutes the remote participant with the given ID.
 *
 * @param {string} participantId - ID of the participant to mute.
 * @returns {Function}
 */
export function muteRemote(participantId: string) {
    return (dispatch: Dispatch<any>) => {
        sendAnalytics(createRemoteMuteConfirmedEvent(participantId));
        dispatch(muteRemoteParticipant(participantId));
    };
}

/**
 * Mutes all participants.
 *
 * @param {Array<string>} exclude - Array of participant IDs to not mute.
 * @returns {Function}
 */
export function muteAllParticipants(exclude: Array<string>) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const localId = getLocalParticipant(state).id;
        const participantIds = state['features/base/participants']
            .map(p => p.id);

        /* eslint-disable no-confusing-arrow */
        participantIds
            .filter(id => !exclude.includes(id))
            .map(id => id === localId ? muteLocal(true) : muteRemote(id))
            .map(dispatch);
        /* eslint-enable no-confusing-arrow */

        // console.log('state--', state);
        // console.log('localId--', localId);
        // console.log('participantsId2--', participantIds.filter(id => !exclude.includes(id)));
        // console.log('participantsId3--', participantIds.filter(id => !exclude.includes(id)).map(id => id === localId ? muteLocal(true) : muteRemote(id)));
        // console.log('participantsId4--', participantIds.filter(id => !exclude.includes(id)).map(id => id === localId ? muteLocal(true) : muteRemote(id)).map(dispatch));
    };
}
/////////////////////////// End Meeting - Kick all PARTICIPANT //////////////////////////////////////

export function endAllParticipants(exclude: Array<string>) {
    
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const localId = getLocalParticipant(state).id;
        const participantIds = state['features/base/participants'].map(p => p.id);
        const numUser = state['features/base/participants']
        // const nameConference = state['features/base/participants'][1]

        /* eslint-disable no-confusing-arrow */
        const setParticipants = participantIds.filter(id => !exclude.includes(id));

        console.log('Stateconference--', state['features/base/participants']);

            // let nameConf = nameConference.conference.options.name;
            // console.log('NameConference: ', nameConf);

            setParticipants.map(person => {
              console.log(person)
              dispatch(kickParticipant(person));
              // api.executeCommand('hangup');
              // window.close();

              });
              
        // APP.UI.emitEvent(UIEvents.LOGOUT);
        // window.location.href = 'https://chat.one.th'
        // console.log('--------Redirect---------');

        // dispatch(participantLeft(setParticipants),

        // console.log('---------------')
        // console.log('Kick');
        //
        // setParticipants.map(person => {
        //   console.log(person)
        //   dispatch(kickParticipant(person));
        //   });

            // .map(id => id === localId ? muteLocal(true) : muteRemote(id))
            // .map(dispatch);
        /* eslint-enable no-confusing-arrow */

        // console.log('state--', state);
        // console.log('localId--', localId);
        // console.log('participantsId2--', participantIds.filter(id => !exclude.includes(id)));
        // console.log('participantsId3--', participantIds.filter(id => !exclude.includes(id)).map(id => id === localId ? muteLocal(true) : muteRemote(id)));
        // console.log('participantsId4--', participantIds.filter(id => !exclude.includes(id)).map(id => id === localId ? muteLocal(true) : muteRemote(id)).map(dispatch));
    };
}
