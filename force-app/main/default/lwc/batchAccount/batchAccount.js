import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/BatchAccountController.getAccounts';
//import { publish, MessageContext } from 'lightning/messageService';
//import ConfirmationAndUpdate from 'c/confirmationAndUpdateScreen';
//import ACCOUNT_SELECTION_CHANNEL from '@salesforce/messageChannel/AccountSelectedChannel__c';

export default class AccountTable extends NavigationMixin(LightningElement) {

    // Tracks accounts fetched from Apex
    @track accounts = [];
    // Tracks selected rows in the datatable
    @track selectedAccounts = [];
    // Stores the search input
    @track searchKey = '';
    // Tracks filtered accounts based on search
    @track filteredAccounts;

    //call the loadAccounts method
    connectedCallback() {
        this.loadAccounts();
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

    //Load account records
    loadAccounts() {
        getAccounts()
            .then(result => {
                this.accounts = result;
                this.filteredAccounts = data;  // Assign data to filteredAccounts
            })
            .catch(error => {
                console.error('Error loading accounts', error);
                this.showToast('Error','Failed to load accounts!','error');
            });
    }

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;  // Assign data to accounts
            this.filteredAccounts = data;  // Assign data to filteredAccounts
        } else if (error) {
            console.error('Error fetching accounts:', error);  // Log any errors
        }
    }

    //Handle search chanage on account name or number
    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();
        //return a match for the keyword
        this.filteredAccounts = this.accounts.filter(account => account.Name.toLowerCase().includes(this.searchKey));
    }


    filterAccount() {
        //filter accounts based on name or account number
        if(this.searchKey){
            this.filteredAccount = this.accounts.filter(account => 
                account.Name.toLowerCase().includes(this.searchKey) || account.AccountNumber.toLowerCase().includes(this.searchKey)
            );
        }else {
            //No filter applied
            this.filteredAccounts = this.accounts;
        }
    }

    //Handle when a record is selected and add to the selectedAccounts
    handleRowSelection(event) {
        this.selectedAccounts = event.detail.selectedRows;
    }

    //triggered when the next button is clicked to pass the selected accounts to the next component
    handleNext() {
        const confirmationEvent = new CustomEvent('accountsconfirmation', {
            detail: { accounts: this.selectedAccounts }
        });
        this.dispatchEvent(confirmationEvent);
        this.showToast('success','Successfully passed accounts to the next page!','success');
    }

    //custom toast message to notify users
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}