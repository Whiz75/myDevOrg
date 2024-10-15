import { LightningElement, api, track } from 'lwc';
//import batchAccountTemplate from 'c/batchAccount/batchAccount.html';
//import confirmationAndUpdateTemplate from 'c/confirmationAndUpdateScreen/confirmationAndUpdateScreen.html';

export default class ParentComponent extends LightningElement {

    @api accounts = [];
    @api selectedAccounts = [];
    @track isShowing = true;

    handleAccountsConfirmation(event) {
        const confirmationComponent = this.template.querySelector('c-confirmation-and-update-screen');
        confirmationComponent.handleAccountsConfirmation(event.detail.accounts);
    }
    

    // isBatchAccountScreen = true;  // Default to show batchAccount
    // isConfirmationAndUpdateScreen = false; // Hidden initially

    // // Method to handle the 'Next' button click
    // handleNext() {
    //     this.isBatchAccountScreen = false;
    //     this.isConfirmationAndUpdateScreen = true;
    // }

    // // Method to handle the 'Back' button click
    // handleBack() {
    //     this.isBatchAccountScreen = true;
    //     this.isConfirmationAndUpdateScreen = false;
    // }
    
}