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
}
