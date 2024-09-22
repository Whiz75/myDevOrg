// messageChannel.js
import { createMessageContext, releaseMessageContext, APPLICATION_SCOPE, subscribe, unsubscribe, publish } from 'lightning/messageService';
import ACCOUNT_LIST_UPDATE_CHANNEL from '@salesforce/messageChannel/AccountListUpdate__c';

const messageContext = createMessageContext();

export default {
    subscribe: (callback) => {
        return subscribe(messageContext, ACCOUNT_LIST_UPDATE_CHANNEL, callback, { scope: APPLICATION_SCOPE });
    },
    unsubscribe: (subscription) => {
        unsubscribe(subscription);
    },
    publish: (message) => {
        publish(messageContext, ACCOUNT_LIST_UPDATE_CHANNEL, message);
    }
};
