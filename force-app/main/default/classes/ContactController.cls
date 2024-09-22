public with sharing class ContactController {

    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(){

            List<Contact> contacts = [SELECT FirstName, LastName, Email FROM Contact WITH SECURITY_ENFORCED];

            if(contacts.isEmpty()) {
                throw new AuraHandledException('No contacts found');
            }
            return contacts;
        }
}