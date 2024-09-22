import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import library for toast messages
import getAccounts from '@salesforce/apex/BatchAccountController.getAccounts'; // Importing Apex method to fetch accounts
import accountSelectionScreen from './accountSelectionScreen.html'; //import the first screen
import confirmationAndUpdateScreen from './confirmationAndUpdateScreen.html'; //import the second screen
import Id from '@salesforce/schema/Account.Id';

export default class AccountTable extends LightningElement {
    // Tracks accounts fetched from Apex
    @track accounts;
    // Tracks filtered accounts based on search
    @track filteredAccounts;
    // Stores the search input
    @track searchKey = '';
    // Tracks selected rows in the datatable
    @track selectedAccounts = [];
    //count the number of selected items
    @track selectedAccountIds = new Set();
    //paased from the record
    @api accountId;
    //check the selected records
    @track allSelected = false;
    // New property to control Next button state
    //@track isNextButtonDisabled = true;
    @track isLoading = false;

    error;

    //render first screen
    accountSelectionScreen = true;

    render(){
        return this.accountSelectionScreen ? accountSelectionScreen : confirmationAndUpdateScreen;
    }

    /* Account Selection Screen */
    
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

    // Wire service to call the Apex method and fetch accounts
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;  // Assign data to accounts
            this.filteredAccounts = data;  // Assign data to filteredAccounts
        } else if (error) {
            console.error('Error fetching accounts:', error);  // Log any errors
        }
    }

    //Handle search input change
    handleSearchChange(event){
        //convert search input to lower case
        this.searchKey = event.target.value.toLowerCase();
        //return a match for the keyword
        this.filteredAccounts = this.accounts.filter(account => account.Name.toLowerCase().includes(this.searchKey));
    }

    //Filter accounts based on the search key
    filterAccount(){
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

    // Handle next and back button click
    handleNextAndBack() {

        if ((this.accounts.size < 1)) {
            this.showToast('Error', 'Please select a atleast one record to continue...', 'error');
            return;
        }
        this.showToast('Success', 'Moving to the next page', 'success');
        this.accountSelectionScreen = this.accountSelectionScreen === true ? false : true;
    }

    handleRowAction(event) {
        const Id = event.detail.row.Id;
    
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: Id,
                objectApiName: 'Account',
                actionName: 'view'
            },
            state: {
                nooverride: '1',
            }
        }, true);  // The 'true' argument here opens in a new tab
    }



    /* Confirmation and Update Screen */

    // Handle industry selection change
    handleIndustryChange(event) {
        this.newIndustry = event.target.value;
    }

    // Perform the batch update
    handleUpdate() {
        if (!this.newIndustry) {
            this.showToast('Error', 'Please select a new industry', 'error');
            return;
        }

        this.isLoading = true;
        try {
            const result = updateAccounts({
                accountIds: this.selectedAccounts.map(account => account.Id),
                newIndustry: this.newIndustry
            });
            this.showToast('Success', `Updated ${result} accounts`, 'success');
            this.handleNextAndBack();
        } catch (error) {
            this.showToast('Error', 'Failed to update accounts', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    //handle record click
    getNameUrl(accountId) {
        return `/${accountId}`;
    }

    // Handle row selection event
    handleRowSelection(event) {
        this.selectedAccounts = event.detail.selectedRows;
        this.selectedAccountIds = new Set(this.selectedAccounts.map(row => row.Id));
        this.showToast('Success', '${selectedAccounts.Id} accounts', 'success','dismissable');
    }

    //handle the select all logic 
    handleSelectAll(event) {
        this.allSelected = event.target.checked;
        const datatable = this.template.querySelector('lightning-datatable');
        if (this.allSelected) {
            datatable.selectedAccounts = this.accounts.map(account => account.Id);
        } else {
            datatable.selectedAccounts = [];
        }
        // Trigger the row selection handler to update selectedAccounts
        this.handleRowSelection({ detail: { selectedAccounts: datatable.selectedAccounts } });
        this.showToast('Success', `Selected all accounts`, 'success','dismissable');
    }

    get selectedAccountCount() {
        //return this.selectedAccounts.size;
        return this.selectedAccountIds.size;
    }

    //custom toast to display warnings, errors or messages
    //Helper method to show toast notifications
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
