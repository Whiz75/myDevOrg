public class AccountTriggerHandler {
    public static void CreateAccounts(List<Account> mAccounts){

            for(Account a : mAccounts){  
                if(a.ShippingState != a.BillingState){
                    a.ShippingState = a.BillingState;
                }
            }     
        
    }        
}