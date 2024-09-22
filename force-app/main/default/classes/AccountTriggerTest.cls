@isTest
public class AccountTriggerTest {
    @isTest 
    public static void TestCreateNewAccountInBulk(){
        List<Account> accts = new List<Account>();
        for(Integer i = 0; i < 200; i++) {
            Account acc = new Account(Name='Testing Account' + i, BillingState ='CA');
            accts.add(acc);
        }              
 
        Test.startTest();
        insert accts;                               
        Test.stopTest();  
        
        List<Account> verifyAccts = [SELECT ShippingState FROM Account WHERE BillingState = 'CA'];
        
        for(Account a: verifyAccts){
            System.assertEquals('CA', a.ShippingState, 'ERROR');
        }
    }
}