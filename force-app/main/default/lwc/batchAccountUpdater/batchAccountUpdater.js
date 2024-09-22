import { LightningElement, track, api,wire } from 'lwc';
//import accountSelectionScreen from '/accountSelectionScreen/accountSelectionScreen.html';
//import confirmationAndUpdateScreen from '/confirmationAndUpdateScreen/confirmationAndUpdateScreen.html';
import getAccounts from '@salesforce/apex/BatchAccountController.getAccounts'; // Importing Apex method to fetch accounts

export default class BatchAccountUpdater extends LightningElement {
    // Tracks accounts fetched from Apex
    @track accounts;
    @track showAccountSelection = true;
    @track showConfirmationAndUpdate = false;
    @track selectedAccounts = [];
    @track accounts = []; // This would be fetched from server
    @track fieldToUpdate = 'Industry'; // Default field to update


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

    // Handle the "Next" button click from Account Selection Screen
    handleNext(event) {
        this.selectedAccounts = event.detail.selectedAccounts;
        this.showAccountSelection = false;
        this.showConfirmationAndUpdate = true;
    }

    // Handle the search event to filter accounts
    handleSearch(event) {
        const searchTerm = event.detail.searchTerm;
        // Add logic to search accounts based on the searchTerm
    }

    // Handle the filter event to narrow down the list
    handleFilter(event) {
        const filterCriteria = event.detail.filterCriteria;
        // Add logic to filter accounts based on the filterCriteria
    }

    // Handle the "Back" button click from Confirmation and Update Screen
    handleBack() {
        this.showConfirmationAndUpdate = false;
        this.showAccountSelection = true;
    }

    // Handle the "Update" button click
    handleUpdate(event) {
        const updatedValue = event.detail.updatedValue;
        // Add logic to update the selected accounts with the new value
    }
}
