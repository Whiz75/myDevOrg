trigger ProjectTrigger on Project__c (before insert, before Update) {
    System.debug('ProjectTrigger executing for ' + Trigger.new.size() + ' records');
    ProjectHelper.updateProjectAmounts(Trigger.new);
}