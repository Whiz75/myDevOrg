public class AccountUtility {
    public static void viewAnnualRevenue(){
        List<Account> accountsList = [SELECT Name,	AnnualRevenue FROM Account];
        
        FOR(Account acc: accountsList){
            String acctRev = 'revenue:<' + acc.Name + '> : <'+ acc.AnnualRevenue +'>';
            System.debug(acctRev);
        }
    }

}