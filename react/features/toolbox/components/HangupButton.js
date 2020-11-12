// @flow

import _ from 'lodash';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app/actions';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractHangupButton } from '../../base/toolbox';
import type { AbstractButtonProps } from '../../base/toolbox';

import optioncon from '../../../../optiononeconference'
import axios from 'axios';

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
    _hangup: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = 'toolbar.hangup';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._hangup = _.once(() => {
            sendAnalytics(createToolbarEvent('hangup'));
            this._endJoin();
            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {
                this.props.dispatch(appNavigate(undefined));
            } else {
                this.props.dispatch(disconnect(true));
            }
        });

        this._endJoin = async () => {
            let domainEnd = interfaceConfig.DOMAIN_BACK
            let urlCheck = optioncon.geturlhref();
            let nameJoin = optioncon.getNameJoin();
            let meetingId = urlCheck.split('/')[3].split('?')[0]
            // console.log("nameJoin: ", nameJoin)

            if (urlCheck.includes('?onechat')) {
                await axios.post(domainEnd + '/service/endjoin', { meetingid : meetingId, name: nameJoin, clientname: 'onechat'})
            } else if (urlCheck.includes('?ManageAi')) {
                await axios.post(domainEnd + '/service/endjoin', { meetingid : meetingId, name: nameJoin, clientname: 'ManageAi'})
            } 
            // else {
            //     await axios.post(interfaceConfig.DOMAIN + '/endmeeting' , { meetingid : moderator.auth.meetingid })
            // }
        }
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        this._hangup();
    }
}

export default translate(connect()(HangupButton));
