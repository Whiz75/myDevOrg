trigger ProjectTrigger1 on Project__c (before insert, before update) {
    System.debug('ProjectTrigger 1 executing for '+ Trigger.new.size() + ' records');
    ProjectHelper1.updateProjectAmounts1(Trigger.new);

}