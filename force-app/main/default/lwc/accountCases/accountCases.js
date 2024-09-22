// accountCases.js
import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCases from '@salesforce/apex/AccountCasesController.getCases';

export default class AccountCases extends LightningElement {
    @api recordId; // Account Id
    cases;
    error;
    columns = [
        { label: 'Case Number', fieldName: 'CaseNumber', type: 'text' },
        { label: 'Subject', fieldName: 'Subject', type: 'text' },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Priority', fieldName: 'Priority', type: 'text' },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date' }
    ];

    @wire(getCases, { accountId: '$recordId' })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.cases = undefined;
            this.showToast('Error', 'Error fetching cases', 'error');
        }
    }

    handleDownload() {
        if (!this.cases || this.cases.length === 0) {
            this.showToast('Info', 'No cases to download', 'info');
            return;
        }

        const csvContent = this.convertToCSV(this.cases);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'account_cases.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        this.showToast('Success', 'Cases downloaded successfully', 'success');
    }

    convertToCSV(objArray) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        const headers = Object.keys(array[0]);
        str += headers.join(',') + '\r\n';
        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line !== '') line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}