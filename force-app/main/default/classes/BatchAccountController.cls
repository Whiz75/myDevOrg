public with sharing class BatchAccountController {
    @AuraEnabled(cacheable=true) // Enabled cache for better performance
    public static List<Account> getAccounts(){
        //Query to get all accounts records
        return [SELECT Id, AccountNumber, CreatedDate, Name, Industry, Owner.Name
        FROM Account
        WITH SECURITY_ENFORCED
        LIMIT 10];
    }

    @AuraEnabled(cacheable = true)
    public static List<Account> getAccountListOffset(Integer pageSize, Integer page ) {

        Integer offset = Math.max(0, (page - 1) * pageSize);
        List<Account> accountList = [SELECT Id, AccountNumber, CreatedDate, Name, Industry, Owner.Name 
        FROM Account 
        WITH SECURITY_ENFORCED
        ORDER BY Name ASC 
        LIMIT :pageSize 
        OFFSET :offset];
        //Integer totalRecords = [SELECT COUNT() FROM Account WITH SECURITY_ENFORCED];
        
        return accountList;
    }

    @AuraEnabled
    public static void updateIndustry(List<Id> accountIds, String newIndustry) {
        // List<Account> accountsToUpdate = [SELECT Id, Industry 
        // FROM Account 
        // WHERE Id IN :accountIds
        // WITH SECURITY_ENFORCED];
        
        // for (Account acc : accountsToUpdate) {
        //     acc.Industry = newIndustry;
        // }
        // update accountsToUpdate;

        List<Account> accountsToUpdate = new List<Account>();
        for(Id accId : accountIds) {
            accountsToUpdate.add(new Account(Id = accId, Industry = newIndustry));
        }
        update accountsToUpdate;
    }
}