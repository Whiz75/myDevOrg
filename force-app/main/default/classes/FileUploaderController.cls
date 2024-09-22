/**
* @File Name : FileUploaderController.cls
* @Description :
* @Author : Shane Khotsoka
* @Last Modified By :
* @Last Modified On : August 16, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | August 16, 2024 |   | Initial Version
**/

public with sharing class FileUploaderController {
	@AuraEnabled
	Public static String uploadFile(String base64, String filename, Id recordId){
		try{
             // Decode the base64 string to get the file blob
			Blob fileBlob = EncodingUtil.base64Decode(base64);
            // Create a new ContentVersion object
			ContentVersion contentVersion = new ContentVersion();
			contentVersion.Title = filename;
			contentVersion.PathOnClient = filename;
			contentVersion.VersionData = fileBlob;
			contentVersion.FirstPublishLocationId = recordId;

            // Insert the ContentVersion record
			insert contentVersion;

            // Query and return the ContentDocumentId
            ContentVersion cv = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id  WITH SECURITY_ENFORCED];

			return cv.ContentDocumentId;
            
		}catch(Exception e){
			throw new AuraHandledException('Error uploading file:'+ e.getMessage());
		}
	}
}