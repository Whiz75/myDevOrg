@isTest
public class DataGenerationTest {
	@testSetup
  static void dataCreation() {
      Opportunity opp = New Opportunity();
      opp.Name = 'Long lost record';
      opp.CloseDate = Date.today().addDays(14);
      opp.StageName = 'Prospecting';
      insert opp;
  }
  @isTest
  static void testBruteForceAccountCreation() {
      List<Account> accts = new List<Account>();
      Test.startTest();
          accts = [SELECT Id FROM Account];
      Test.stopTest();
      System.assert(accts.size() > 0, 'Was expecting to find at least one account created on the Test Setup');
  }
  @isTest
  static void testUseTestFactoryToCreateAccountsWithContacts() {
      List<Account> accts;
      List<Contact> contacts;
      Test.startTest();
          accts = [SELECT Id FROM Account];
          contacts = [SELECT Id FROM Contact];
      Test.stopTest();
      System.assert(accts.size() > 0, 'Was expecting to find at least one account created');
      System.assert(contacts.size() == 6, 'Was expecting to find 6 contacts');
      System.assertNotEquals(accts.size(), contacts.size(), 'Was expecting there to be a different number of account and contacts');
  }
    
  @isTest
  static void testAtTestSetupMethodsRule() {
      List<Opportunity> opps = [SELECT Id, AccountId FROM Opportunity];
      System.assertEquals(1, opps.size(), 'Expected test to find a single Opp');
  }
}