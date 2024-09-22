public with sharing class BatchAccountController {
    @AuraEnabled(cacheable=true) // Enabled cache for better performance
    public static List<Account> getAccounts(){
        return [SELECT Id, AccountNumber, CreatedDate, Name, Industry
        FROM Account
        WITH SECURITY_ENFORCED];
    }
}