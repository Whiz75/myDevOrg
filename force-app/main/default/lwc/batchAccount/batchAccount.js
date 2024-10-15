import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import getAccounts from '@salesforce/apex/BatchAccountController.getAccounts';
import getAccountListOffset from '@salesforce/apex/BatchAccountController.getAccountListOffset';
import LightningConfirm from 'lightning/confirm';
import LightningAlert from 'lightning/alert';
import { refreshApex } from '@salesforce/apex';

const PAGE_SIZE = 10;

export default class AccountTable extends NavigationMixin(LightningElement) {

    // Tracks accounts fetched from Apex
    @track accounts = [];
    // Tracks selected rows in the datatable
    @track selectedAccounts = [];
    // Stores the search input
    @track searchKey = '';
    // Tracks filtered accounts based on search
    @track filteredAccounts;
    //Track which component is being showing/displayed
    @track isShowing = true; 

    // Tracks the current page number for lazy loading
  @track currentPage = 1;
  // Stores the total number of records
  @track totalRecords = 0;
 
    // Define columns for the datatable
    columns = [
        { label: 'Id', fieldName: 'Id', type: 'text' },
        { label: 'Account Name', fieldName: 'Name', type: 'url', typeAttributes: {
            target: '_self',
            label: {fieldName: 'Name'},
            sortable: true,
            variant: 'base',
            }},
        { label: 'Industry', fieldName: 'Industry', type: 'text' },
        {label: 'Account Owner', fieldName: 'OwnerName', type: 'text'}
    ];
    
    //bool to show spinner when loading data
    //@track isLoading = true;

    //store the wired Accounts result
    wiredAccountResults;

    // Pagination related variables
    currentPage = 1;
    hasMoreData = true;

    //sorting related variables
    @track sortDirection = 'asc';
    @track sortedBy = 'Name';

    //call the loadAccounts method
    connectedCallback() {
        // Call the loadAccounts method initially and on 'loadmore' event
        this.loadAccounts();
        console.log('BatchAccount component connected');
    }

    // @wire(getAccounts)
    // wiredAccounts(result){
    //     try{
    //         this.wiredAccountResults = result;

    //         if(result.data){
    //             this.accounts = result.data; //assign the data to the accounts variable
    //             //map Owner.Name to OwnerName
    //             this.accounts = result.data.map((record) => ({
    //                 ...record,
    //                 OwnerName: record.Owner != null ? record.Owner.Name : 'N/A' // Handle null case
    //             }));

    //             this.isLoading = false;
    //             //return to the original data
    //             this.filteredAccounts = this.accounts;
    //             // If there's an active search, apply the filter
    //             if (this.searchKey) {
    //                 this.handleSearchChange({ target: { value: this.searchKey } });
    //             }
    //         }
    //     }catch(error){
    //         //alert(error.message);
    //         LightningAlert.open({
    //             message: error.message,
    //             theme: "error",
    //             label: "Error!",
    //           });
    //     }
    // }

    @wire(getAccounts)
    wiredAccounts(result){
    }

    // Method to load accounts with lazy loading
    loadAccounts() {
        if (!this.hasMoreData || this.isLoading) return;

        this.isLoading = true;
        getAccountListOffset({ pageSize: PAGE_SIZE, page: this.currentPage })
            .then((result) => {

                //initiaze to result for refreshing
                this.wiredAccountResults = result;

                const newAccounts = result.map((record) => ({
                    ...record,
                    OwnerName: record.Owner ? record.Owner.Name : 'N/A'
                }));

                this.accounts = [...this.accounts, ...newAccounts];
                this.filteredAccounts = [...this.accounts];

                // If fewer results are returned than the page size, we know there's no more data
                if (newAccounts.length < PAGE_SIZE) {
                    this.hasMoreData = false;
                }

                this.currentPage += 1;
                this.isLoading = false;
                this.isInfiniteLoading = false;  // Reset loading state after data load
            })
            .catch((error) => {
                LightningAlert.open({
                    message: error.message,
                    theme: "error",
                    label: "Error!",
                });
                this.isLoading = false;
                this.isInfiniteLoading = false;
            });
    }

    // Method to load more accounts (called on button click or infinite scroll)
    handleLoadMore(event) {
        if (this.isLoading || this.isInfiniteLoading || !this.hasMoreData) return;

        // Mark as infinite loading in progress
        this.isInfiniteLoading = true;

        // Call loadAccounts method to load more data
        this.loadAccounts();

        // Notify the datatable that loading is completed
        event.target.isLoading = false;
    }

    handleSort(event){
        const {fieldName: sortedBy, sortDirection: sortedDirection} = event.detail;
        const cloneAccounts = [...this.accounts];

        // Sort data based on the column selected
        cloneAccounts.sort((currentRecord, nextRecord) => {
            const currentValue = currentRecord[sortedBy];
            const nextValue = nextRecord[sortedBy];
            
            return sortDirection === 'asc' ? (currentValue > nextValue ? 1 : -1) : (currentValue < nextValue ? 1 : -1);
        });

        //set the sorted value
        this.accounts = cloneAccounts;
        this.sortedBy = sortedBy;
        this.sortDirection = sortedDirection;
    }

    //Handle search chanage on account name or number
    handleSearchChange(event) {
        //convert the search input to lower case
        this.searchKey = event.target.value.toLowerCase();

        if(this.searchKey && this.accounts){
            //return a match for the keyword
            this.filteredAccounts = this.accounts.filter(account => 
            account.Name.toLowerCase().includes(this.searchKey) ||
            account.OwnerName.toLowerCase().includes(this.searchKey));
        }else{
            //return the full list
            this.filteredAccounts = this.accounts;
        }
    }

    //Handle when a record is selected and add to the selectedAccounts
    handleRowSelection(event) {
        this.selectedAccounts = event.detail.selectedRows;
    }

    //triggered when the refresh button is clicked to refresh the account list
    handleRefresh(){
        try{
            //alert('Your accounts list has refreshed');
            LightningAlert.open({
                message: "Your accounts list has refreshed",
                theme: "success",
                label: "Success!",
              });

            // Call method to re-fetch accounts data
            return refreshApex(this.wiredAccountResults);
        
            
        }catch(error){
            //alert(error.message);
            LightningAlert.open({
                message: error.message,
                theme: "error",
                label: "Error!",
              });
        }
    }

    navigateToNextPage(){
        //navigate to the next page
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'c__confirmationAndUpdateScreen'
            }
        });
    }

    navigateToRecordPage(event){
        //get the record id of the account
        const recordId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard_recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: 'view'
            },
        });
    }

    //triggered when the next button is clicked to pass the selected accounts to the next component
    async handleNext() {
        //Get selected rows from the datatable
        const datatable = this.template.querySelector('lightning-datatable');
        const selectedRows = datatable.getSelectedRows();

        //set isShowing to false so the component is not rendering currently
        this.isShowing = false;

        try{
            //check if atleast one account is selected
            if (selectedRows.length === 0) {

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
    
            //Event to send data to the next component
            const confirmationEvent = new CustomEvent('accountsconfirmation', {
                detail: { 
                    accounts: this.selectedAccounts,
                    isShowing: this.isShowing
                 }
            });
            this.dispatchEvent(confirmationEvent);
        }catch(error){
            //alert(error.message);
            LightningAlert.open({
                message: error.message,
                theme: "error",
                label: "Error!",
              });
        }
    }
}