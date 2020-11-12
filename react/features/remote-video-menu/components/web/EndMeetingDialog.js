// @flow

import React from 'react';
import axios from 'axios'
import moderator from '../../../../../current_auth'
import optioncon from '../../../../../optiononeconference'
import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { endAllParticipants } from '../../actions';
import { kickParticipant } from '../../../base/participants';
import UIEvents from '../../../../../service/UI/UIEvents';
import { FeedbackDialog  } from '../../../feedback/components/FeedbackDialog.web'
import {
    maybeOpenFeedbackDialog,
    openFeedbackDialog,
    submitFeedback
} from '../../../feedback';
import AbstractEndMeetingParticipantDialog, {
    type Props as AbstractProps
} from '../AbstractEndMeetingParticipantDialog';

declare var APP: Object;
declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of
 * {@link MuteEveryoneDialog}.
 */
type Props = AbstractProps & {

    /**
     * The IDs of the remote participants to exclude from being muted.
     */
    exclude: Array<string>
};

/**
 * Translations needed for dialog rendering.
 */
type Translations = {

    /**
     * Content text.
     */
    content: string,

    /**
     * Title text.
     */
    title: string
}

/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before muting a remote participant.
 *
 * @extends Component
 */
class EndMeetingDialog extends AbstractEndMeetingParticipantDialog<Props> {
    static defaultProps = {
        exclude: [],
        muteLocal: false
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { content, title } = this._getTranslations();
        // console.log('DDDDDD', this._getTranslations());

        return (
            <Dialog
                okKey = 'dialog.endmeet'
                onSubmit = { this._onSubmit }
                titleString = { title }
                width = 'small'>
                <div>
                    { content }
                </div>
            </Dialog>
        );
    }

    _onSubmit: () => boolean;

    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
     */
    async _onSubmit() {
        try {
            const conference = APP;
            const {
                dispatch,
                exclude
            } = this.props;
            const urlCheck = optioncon.geturlhref();
            let domainEnd
            // APP.store.dispatch(maybeOpenFeedbackDialog(conference))
            dispatch(endAllParticipants(exclude))

            if (urlCheck.includes('?onechat')) {
                domainEnd = interfaceConfig.DOMAIN_BACK + '/service/endmeeting'
                await axios.post(domainEnd, { meetingid : moderator.auth.meetingid, clientname: 'onechat'})
            } else if (urlCheck.includes('?ManageAi')) {
                domainEnd = interfaceConfig.DOMAIN_BACK + '/service/endmeeting'
                await axios.post(domainEnd, { meetingid : moderator.auth.meetingid, clientname: 'ManageAi'})
            } else {
                await axios.post(interfaceConfig.DOMAIN + '/endmeeting' , { meetingid : moderator.auth.meetingid })
            }
            conference.UI.emitEvent(UIEvents.LOGOUT)
            // console.log('--------Redirect---------');
            // conference.UI.emitEvent(UIEvents.LOGOUT);
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
        
    }

    /**
     * Method to get translations depending on whether we have an exclusive
     * mute or not.
     *
     * @returns {Translations}
     * @private
     */
     _getTranslations(): Translations {
         const { exclude, t } = this.props;
         // const { conference } = APP;
         // const whom = exclude
         //     // eslint-disable-next-line no-confusing-arrow
         //     .map(id => conference.isLocalId(id)
         //         ? t('dialog.muteEveryoneSelf')
         //         : conference.getParticipantDisplayName(id))
         //     .join(', ');

         const dialog = {
                content: t('dialog.endMeetingDialog'),
                title: t('dialog.endMeetingTitle')
         };

         // console.log('DIALOG--', dialog);
         // console.log('WHO--', whom);
         // console.log('WHOLEN--', whom.length);

         return dialog
     }
}

export default translate(connect()(EndMeetingDialog));
