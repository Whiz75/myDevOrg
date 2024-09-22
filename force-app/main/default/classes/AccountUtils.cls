public class AccountUtils {
    public static LIST<Account> accountsByState(String st){
       LIST<Account> accList = [SELECT Id, Name FROM Account WHERE billingState = :st];
           
           return accList;
    }
}