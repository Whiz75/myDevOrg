import { LightningElement, api } from 'lwc';

export default class AccountSelectionScreen extends LightningElement {
    selectedAccounts = [];

    // Simulating account selection
    handleAccountSelection(event) {
        // Update the selectedAccounts array based on user actions
        this.selectedAccounts = [...event.detail.selectedAccounts];

        // Dispatch the event to pass data to the parent
        const selectedEvent = new CustomEvent('accountsselected', {
            detail: { selectedAccounts: this.selectedAccounts }
        });
        this.dispatchEvent(selectedEvent);
    }

    handleNext() {

        if ((this.accounts.size < 1)) {
            this.showToast('Error', 'Please select a atleast one record to continue...', 'error');
            return;
        }
        this.showToast('Success', 'Moving to the next page in the account selection screen', 'success');
        this.accountSelectionScreen = this.accountSelectionScreen === true ? false : true;
    }
}
