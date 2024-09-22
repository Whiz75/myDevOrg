import { LightningElement, api } from 'lwc';
import uploadFile from '@salesforce/apexFileUploaderController.uploadFile';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class FileUploader extends LightningElement {
    @api recordId;
    fileData;

    handleFileChange(event){
        if(event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            
            reader.onload = (event) => {
                this.fileData = {
                    filename:  file.name,
                    base64: reader.result.split(',')[1],
                    recordId: this.recordId,
                };
            }

            reader.readAsDataURL(file);
        }
    }

    handleFileUpload(event) {
        const {base64, filename, recordId} = this.fileData;

        uploadFile({base64, filename, recordId})
            .then((result) => {
                console.log('File uploaded successfully:'+ result);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'File uploaded successfully',
                        message: 'File uploaded successfully',
                        variant: 'success',
                    })
                );
            }
        )
        .catch((error) =>{

            console.error('Error uploading file:',error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error uploading file',
                    message: error.message,
                    variant: 'error',
                })
            );

    });
        this.fileData = event.target.files[0];
    }
}