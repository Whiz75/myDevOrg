import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    handleAccountsConfirmation(event) {
        const confirmationComponent = this.template.querySelector('c-confirmation-and-update-screen');
        confirmationComponent.handleAccountsConfirmation(event.detail.accounts);
    }
}