import { LightningElement, track, api } from 'lwc';

export default class AccountSelectionScreen extends LightningElement {
    @api accounts;
    @track selectedAccounts = [];
    @track columns = [
        { label: 'Account Name', fieldName: 'Name' },
        { label: 'Account Owner', fieldName: 'Owner.Name' },
        { label: 'Industry', fieldName: 'Industry' }
    ];

    // Handle row selection
    handleRowSelection(event) {
        this.selectedAccounts = event.detail.selectedRows;
    }

    // Handle search input change
    handleSearch(event) {
        const searchTerm = event.target.value;
        this.dispatchEvent(new CustomEvent('search', { detail: { searchTerm } }));
    }

    // Handle filter selection
    handleFilter(event) {
        const filterCriteria = event.target.value;
        this.dispatchEvent(new CustomEvent('filter', { detail: { filterCriteria } }));
    }

    // Handle "Next" button click
    handleNext() {
        this.dispatchEvent(new CustomEvent('next', { detail: { selectedAccounts: this.selectedAccounts } }));
    }

    handleNext() {

        if ((this.accounts.size < 1)) {
            this.showToast('Error', 'Please select a atleast one record to continue...', 'error');
            return;
        }
        this.showToast('Success', 'Moving to the next page', 'success');
        this.accountSelectionScreen = this.accountSelectionScreen === true ? false : true;
    }
}
