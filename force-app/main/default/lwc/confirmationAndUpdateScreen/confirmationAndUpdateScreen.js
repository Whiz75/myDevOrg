import { LightningElement, wire, track,api } from 'lwc';
import updateIndustry from '@salesforce/apex/BatchAccountController.updateIndustry';
import LightningConfirm from 'lightning/confirm';
import LightningAlert from 'lightning/alert'

export default class ConfirmationAndUpdateScreen extends LightningElement {
    @api accounts = [];
    @api isShowing;
    @api selectedAccounts = []; //store the selected record passed from component 1 
    @track accountToUpdate = []; // store the selected record to update
    @track industryValue = ''; // Holds the selected picklist value


    @api
    handleAccountsConfirmation(selectedAccounts, isShowing) {
        this.accounts = selectedAccounts;
        this.isShowing = isShowing;
    }

    connectedCallback() {
        console.log('ConfirmationAndUpdate component connected');
    }

    // Define columns for the datatable
    columns = [
        { label: 'Id', fieldName: 'Id', type: 'text' },
        { label: 'Account Name', fieldName: 'Name', type: 'url', typeAttributes: {
            target: '_self',
            label: {fieldName: 'Name'},
            variant: 'base'
            }},
        { label: 'Industry', fieldName: 'Industry', type: 'picklist',
            editable: true,
            typeAttributes: {
                options: [
                    { label: 'Agriculture', value: 'Agriculture' },
                    { label: 'Apparel', value: 'Apparel' },
                    { label: 'Banking', value: 'Banking' }
                ],
                value: {fieldName: 'Industry'},
                context: {fieldName: 'Id'}
            }
         },
         {label: 'Account Owner', fieldName: 'OwnerName', type: 'text'}
    ];

    @track industryOptions = [
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Banking', value: 'Banking' },
        { label: 'Construction', value: 'Construction' },
        { label: 'Education', value: 'Education' },
        { label: 'Energy', value: 'Energy' },
        { label: 'Communications', value: 'Communications' },
        { label: 'Consulting', value: 'Consulting' }
        // Add more options as needed
    ];

    //Handle when a record is selected and add to the selectedAccounts
    handleRowSelection(event) {
        this.accountToUpdate = event.detail.selectedRows;
    }

    // Method to handle the industry picklist change
    handleIndustryChange(event) {
        this.industryValue = event.target.value;
        // Update the datatable to reflect the new industry for selected rows
        this.updateDatatableSelection();
    }

    // Method to update datatable selection based on industry change
    updateDatatableSelection() {
        //query the datatable
        const datatable = this.template.querySelector('lightning-datatable');
        if (datatable) {
            //get the selected rows from the datatable
            const selectedRows = datatable.getSelectedRows();

            const updatedAccounts = this.accounts.map(account => {
                if (selectedRows.some(row => row.Id === account.Id)) {
                    return { ...account, Industry: this.industryValue };
                }
                return account;
            });
            this.accounts = [...updatedAccounts];
        }
    }

    //handle selected account update
    async handleUpdate(){

        //get selected rows
        const datatable = this.template.querySelector('lightning-datatable');
        const selectedRows = datatable.getSelectedRows();

        //check if atleast one account is selected
        if (selectedRows.length === 0) {
            // console.log('Please select atleast one account and an industry');

            const confirmMessage = 'Please kindly select at least one account to proceed.';
            const result = await LightningConfirm.open({
                message: confirmMessage,
                theme: 'error',
                label: 'Select account',
            });

            if(result){
                return;
            }
        }

        //check if an industry value is selected 
        if(!this.industryValue){
            const confirmMessage = 'Please kindly select an industry to proceed.';
            const result = await LightningConfirm.open({
                message: confirmMessage,
                theme: 'error',
                label: 'Confirm Industry Update',
            });

            if(result){
                return;
            }
        }

        //concatenate account names to display in the toast
        const accountNames = selectedRows.map(row => row.Name).join(', ');
        const confirmMessage = `Are you sure you want to update the industry to "${this.industryValue}" for the following accounts: 
        ${accountNames}?`;

        //display the warning before updating the records
        const result = await LightningConfirm.open({
            message: confirmMessage,
            theme: 'warning',
            label: 'Confirm Industry Update',
        });

        // User confirmed, proceed with the update
        if(result){
            //check if there are selected records and industry value is not null
            if (selectedRows.length > 0 && this.industryValue) {
                //get account Ids for the selected rows
                const accountIds = selectedRows.map(row => row.Id);
                
                try{
                    //update selected accounts industry
                    updateIndustry({ accountIds: accountIds, newIndustry: this.industryValue });
                    this.updateDatatableSelection();
                    //an alert to show the success and the number of updated records
                    //alert(`The industry has been successfully updated for ${selectedRows.length} records.`);
                    
                    LightningAlert.open({
                        message: `The industry has been successfully updated for ${selectedRows.length} records.`,
                        theme: "success",
                        label: "Successfully updated!",
                      });

                }catch(error){
                    //display an alert to show the error
                    //alert('Unable to update the industry: ' + error.body.message);
                    LightningAlert.open({
                        message: "Unable to update the industry: " + error.body.message,
                        theme: "error",
                        label: "Error!",
                      });
                }
                
            } else {
                //this.showToast('Error', 'Please select accounts and an industry', 'error');
                //alert('Please kindly select both accounts and an industry to proceed.');
                LightningAlert.open({
                    message: "Please kindly select both accounts and an industry to proceed.",
                    theme: "error",
                    label: "Error!",
                  });
            }
        }else{
            // User canceled the operation
           //alert('Industry update canceled');
           LightningAlert.open({
            message: "Industry update canceled.",
            theme: "error",
            label: "Error!",
          });
        }
        
    }

    //handle back button clicked
    handleBack(){
        //console.log('ConfirmationAndUpdate: Back button clicked');
        // const event = new CustomEvent('back');
        console.log('ConfirmationAndUpdate: Dispatching back event', event);
        // Dispatch the 'back' event to the parent component
        // const backEvent = new CustomEvent('back');
        // this.dispatchEvent(backEvent);
    }
}