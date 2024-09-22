trigger AccountAddressTrigger on Account (before insert, before update) {
    
    if(Trigger.isInsert){
        if(Trigger.isUpdate){
            for (Account acc : Trigger.new) {
                if (acc.Match_Billing_Address__c == true) {
                    acc.ShippingPostalCode = acc.BillingPostalCode;
                }else{
                    acc.ShippingPostalCode = acc.BillingPostalCode;
                }
    		}
        }
    }
}