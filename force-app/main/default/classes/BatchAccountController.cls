public with sharing class BatchAccountController {
    @AuraEnabled(cacheable=true) // Enabled cache for better performance
    public static List<Account> getAccounts(){
        //Query to get all accounts records
        return [SELECT Id, AccountNumber, CreatedDate, Name, Industry
        FROM Account
        WITH SECURITY_ENFORCED
        LIMIT 10];
    }

    // Apex Controller method for Aura Component
    @AuraEnabled(cacheable=true)
    public static List<Account> getSelectedAccounts(List<String> accountIds) {
        return [SELECT Id, Name 
        FROM Account 
        WHERE Id IN :accountIds
        WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static void accountToUpdate(String accoundId, String newIndustry){
        try {
            Account account = [SELECT Id, Industry 
            FROM Account 
            WHERE Id =: accoundId 
            WITH SECURITY_ENFORCED
            LIMIT 1];

            //Update the industry field with the new value
            account.Industry = newIndustry;
            //Perform the update
            update account;
            System.debug('Account Industry updated successfully!');
        } catch (Exception e) {
            //throw new AuraHandledException(e.getMessage());
            // Handle any errors that occur
            System.debug('Error updating account: ' + e.getMessage());
        }
    }
}