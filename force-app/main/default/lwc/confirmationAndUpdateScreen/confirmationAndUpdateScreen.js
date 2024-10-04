import { LightningElement, wire, track,api } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_SELECTION_CHANNEL from '@salesforce/messageChannel/AccountSelectedChannel__c';

export default class ConfirmationAndUpdateScreen extends LightningElement {
    @api accounts = [];
    @api selectedAccounts = [];

    @api
    handleAccountsConfirmation(selectedAccounts) {
        this.accounts = selectedAccounts;
    }

    // Define columns for the datatable
    columns = [
        { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' },
        { label: 'Account Name', fieldName: 'Name', type: 'url', typeAttributes: {
            target: '_self',
            label: {fieldName: 'Name'},
            variant: 'base'
            }},
        { label: 'Industry', fieldName: 'Industry', type: 'text' },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'text'}
    ];

    //handle selected account update
    handleUpdate(){
        
    }
}