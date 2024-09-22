import { LightningElement, api } from 'lwc';

export default class ConfirmationAndUpdateScreen extends LightningElement {
    @api selectedAccounts;
    @api field;
    //@track newValue;

    // Handle the input value change
    handleValueChange(event) {
        //this.newValue = event.target.value;
    }

    // Handle the "Update" button click
    handleUpdate() {
        //this.dispatchEvent(new CustomEvent('update', { detail: { updatedValue: this.newValue } }));
    }

    // Handle the "Back" button click
    handleBack() {
        this.dispatchEvent(new CustomEvent('back'));
    }
}
