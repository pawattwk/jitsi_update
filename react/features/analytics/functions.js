// @flow

import { API_ID } from '../../../modules/API';
import auth from '../../../current_auth'
import attendee from '../../../attendee_join'
import optioncon from '../../../optiononeconference'
import env from '../../../env_nodejs'
import {
    checkChromeExtensionsInstalled,
    isMobileBrowser
} from '../base/environment/utils';
import JitsiMeetJS, {
    analytics,
    browser,
    isAnalyticsEnabled
} from '../base/lib-jitsi-meet';
import { getJitsiMeetGlobalNS, loadScript } from '../base/util';

import { AmplitudeHandler, MatomoHandler } from './handlers';
import logger from './logger';

import axios from 'axios'

/**
 * Sends an event through the lib-jitsi-meet AnalyticsAdapter interface.
 *
 * @param {Object} event - The event to send. It should be formatted as
 * described in AnalyticsAdapter.js in lib-jitsi-meet.
 * @returns {void}
 */
export function sendAnalytics(event: Object) {
    try {
        analytics.sendEvent(event);
    } catch (e) {
        logger.warn(`Error sending analytics event: ${e}`);
    }
}

/**
 * Resets the analytics adapter to its initial state - removes handlers, cache,
 * disabled state, etc.
 *
 * @returns {void}
 */
export function resetAnalytics() {
    analytics.reset();
}

/**
 * Creates the analytics handlers.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @returns {Promise} Resolves with the handlers that have been successfully loaded.
 */
export async function createHandlers({ getState }: { getState: Function }) {
    getJitsiMeetGlobalNS().analyticsHandlers = [];
    window.analyticsHandlers = []; // Legacy support.

    if (!isAnalyticsEnabled(getState)) {
        return Promise.resolve([]);
    }
    const state = getState();
    const config = state['features/base/config'];
    const { locationURL } = state['features/base/connection']
    optioncon.seturlhref(locationURL.href)
    if(locationURL.href.includes('?attendee')){
        const name = await decodeURI(locationURL.href.split('?')[2])
        // const name = locationURL.href.split('?')[2]
        const inputkey = locationURL.href.split('?')[3]
        const option = locationURL.href.split('?')[4]
        // const roomname = locationURL.href.split('?')[5]
        const roomname = await decodeURI(locationURL.href.split('?')[5])
        const userid = locationURL.href.split('?')[7]
        const meetingids = locationURL.href.split("/")[3].split("?")[0]
        optioncon.setNameJoin(name)
        attendee.setname(name)
        attendee.setoption(option)
        attendee.setroomname(roomname)
        attendee.setuserid(userid)
        attendee.setmeetingid(meetingids)
        try {
            let keydb 
            let meetingid = locationURL.pathname.split('/')[1]
            if(locationURL.href.split('?')[6] == 'oneconference' || locationURL.href.split('?')[6] == 'onemail'){
                keydb = await axios.post(interfaceConfig.DOMAIN+'/checkkey',{meetingid : meetingid , clientname: 'oneconference'})
                optioncon.seturlInvite(keydb.data.urlInvite)
            }
            else if (locationURL.href.split('?')[6] == 'ManageAi') {
                keydb = await axios.post(interfaceConfig.DOMAIN_BACK+'/checkkey',{meetingid : meetingid , name: name, clientname: 'ManageAi'})
            }else{
                keydb = await axios.post(interfaceConfig.DOMAIN_BACK+'/checkkey',{meetingid : meetingid , name: name, clientname: 'onechat'})
            }
            if(inputkey == keydb.data.key){
                attendee.setpass('true')
            }else{
                attendee.setpass('false')
            }
        } catch (error) {
            console.log(error)
        }
    }else{
        const idauth = locationURL.href.split('?')[1]
        const passauth = locationURL.href.split('?')[2]
        // const nickname = locationURL.href.split('?')[3]
        const nickname = await decodeURI(locationURL.href.split('?')[3])
        const option = locationURL.href.split('?')[4]
        const roomname = await decodeURI(locationURL.href.split('?')[5])
        // const roomname = locationURL.href.split('?')[5]
        const userids = locationURL.href.split('?')[6]
        const meetingid = locationURL.href.split("/")[3].split("?")[0]
        optioncon.setNameJoin(nickname)
        auth.setauth({id: idauth, pass: passauth, nickname: nickname , option: option , roomname : roomname , meetingid: meetingid , userid : userids})
        try {
            let keydb
            if (userids == 'ManageAi' || userids == 'onechat') {
                keydb = await axios.post(interfaceConfig.DOMAIN_BACK +'/checkkey',{meetingid : meetingid , name: nickname, clientname: userids})
                // optioncon.seturlInvite(keydb.data.urlInvite)
            } else {
                keydb = await axios.post(interfaceConfig.DOMAIN +'/checkkey',{meetingid : meetingid , clientname: 'oneconference'})
                optioncon.seturlInvite(keydb.data.urlInvite)
            }
        } catch (error) {
            console.log(error)
        }
    }
    document.title = 'Oneconference-Meeting'
    const host = locationURL ? locationURL.host : '';
    const {
        analytics: analyticsConfig = {},
        deploymentInfo
    } = config;
    const {
        amplitudeAPPKey,
        blackListedEvents,
        scriptURLs,
        googleAnalyticsTrackingId,
        matomoEndpoint,
        matomoSiteID,
        whiteListedEvents
    } = analyticsConfig;
    const { group, user } = state['features/base/jwt'];
    const handlerConstructorOptions = {
        amplitudeAPPKey,
        blackListedEvents,
        envType: (deploymentInfo && deploymentInfo.envType) || 'dev',
        googleAnalyticsTrackingId,
        matomoEndpoint,
        matomoSiteID,
        group,
        host,
        product: deploymentInfo && deploymentInfo.product,
        subproduct: deploymentInfo && deploymentInfo.environment,
        user: user && user.id,
        version: JitsiMeetJS.version,
        whiteListedEvents
    };
    const handlers = [];

    try {
        const amplitude = new AmplitudeHandler(handlerConstructorOptions);

        handlers.push(amplitude);
    // eslint-disable-next-line no-empty
    } catch (e) {}

    try {
        const matomo = new MatomoHandler(handlerConstructorOptions);

        handlers.push(matomo);
    // eslint-disable-next-line no-empty
    } catch (e) {}

    return (
        _loadHandlers(scriptURLs, handlerConstructorOptions)
            .then(externalHandlers => {
                handlers.push(...externalHandlers);
                if (handlers.length === 0) {
                    // Throwing an error in order to dispose the analytics in the catch clause due to the lack of any
                    // analytics handlers.
                    throw new Error('No analytics handlers created!');
                }

                return handlers;
            })
            .catch(e => {
                analytics.dispose();
                logger.error(e);

                return [];
            }));

}

/**
 * Inits JitsiMeetJS.analytics by setting permanent properties and setting the handlers from the loaded scripts.
 * NOTE: Has to be used after JitsiMeetJS.init. Otherwise analytics will be null.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @param {Array<Object>} handlers - The analytics handlers.
 * @returns {void}
 */
export function initAnalytics({ getState }: { getState: Function }, handlers: Array<Object>) {
    if (!isAnalyticsEnabled(getState) || handlers.length === 0) {
        return;
    }

    const state = getState();
    const config = state['features/base/config'];
    const {
        deploymentInfo
    } = config;
    const { group, server } = state['features/base/jwt'];
    const roomName = state['features/base/conference'].room;
    const permanentProperties = {};
    if (server) {
        permanentProperties.server = server;
    }
    if (group) {
        permanentProperties.group = group;
    }

    //  Report if user is using websocket
    permanentProperties.websocket = navigator.product !== 'ReactNative' && typeof config.websocket === 'string';

    // permanentProperties is external api
    permanentProperties.externalApi = typeof API_ID === 'number';

    // Report if we are loaded in iframe
    permanentProperties.inIframe = _inIframe();

    // Optionally, include local deployment information based on the
    // contents of window.config.deploymentInfo.
    if (deploymentInfo) {
        for (const key in deploymentInfo) {
            if (deploymentInfo.hasOwnProperty(key)) {
                permanentProperties[key] = deploymentInfo[key];
            }
        }
    }

    analytics.addPermanentProperties(permanentProperties);
    analytics.setConferenceName(roomName);
    // analytics.setConferenceName(auth.auth.roomname);

    // Set the handlers last, since this triggers emptying of the cache
    analytics.setAnalyticsHandlers(handlers);

    if (!isMobileBrowser() && browser.isChrome()) {
        const bannerCfg = state['features/base/config'].chromeExtensionBanner;

        checkChromeExtensionsInstalled(bannerCfg).then(extensionsInstalled => {
            if (extensionsInstalled?.length) {
                analytics.addPermanentProperties({
                    hasChromeExtension: extensionsInstalled.some(ext => ext)
                });
            }
        });
    }
}

/**
 * Checks whether we are loaded in iframe.
 *
 * @returns {boolean} Returns {@code true} if loaded in iframe.
 * @private
 */
function _inIframe() {
    if (navigator.product === 'ReactNative') {
        return false;
    }

    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

/**
 * Tries to load the scripts for the analytics handlers and creates them.
 *
 * @param {Array} scriptURLs - The array of script urls to load.
 * @param {Object} handlerConstructorOptions - The default options to pass when creating handlers.
 * @private
 * @returns {Promise} Resolves with the handlers that have been successfully loaded and rejects if there are no handlers
 * loaded or the analytics is disabled.
 */
function _loadHandlers(scriptURLs = [], handlerConstructorOptions) {
    const promises = [];

    for (const url of scriptURLs) {
        promises.push(
            loadScript(url).then(
                () => {
                    return { type: 'success' };
                },
                error => {
                    return {
                        type: 'error',
                        error,
                        url
                    };
                }));
    }

    return Promise.all(promises).then(values => {
        for (const el of values) {
            if (el.type === 'error') {
                logger.warn(`Failed to load ${el.url}: ${el.error}`);
            }
        }

        // analyticsHandlers is the handlers we want to use
        // we search for them in the JitsiMeetGlobalNS, but also
        // check the old location to provide legacy support
        const analyticsHandlers = [
            ...getJitsiMeetGlobalNS().analyticsHandlers,
            ...window.analyticsHandlers
        ];
        const handlers = [];

        for (const Handler of analyticsHandlers) {
            // Catch any error while loading to avoid skipping analytics in case
            // of multiple scripts.
            try {
                handlers.push(new Handler(handlerConstructorOptions));
            } catch (error) {
                logger.warn(`Error creating analytics handler: ${error}`);
            }
        }
        logger.debug(`Loaded ${handlers.length} analytics handlers`);

        return handlers;
    });
}
