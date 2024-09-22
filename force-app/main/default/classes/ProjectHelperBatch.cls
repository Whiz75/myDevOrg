public class ProjectHelperBatch implements Database.Batchable<Project__c>, Database.Stateful {
    
    private Integer recordsProcessed = 0;
    
    public Iterable<Project__c> start(Database.BatchableContext bC) {
        // Query for all Project__c records
        return [SELECT Id, Tot_Amount__c FROM Project__c];
    }
    
    public void execute(Database.BatchableContext bC, List<Project__c> proj) {
        Set<Id> projectIds = new Set<Id>();
        for (Project__c project : proj) {
            projectIds.add(project.Id);
        }
        
        Map<Id, Decimal> projectTotalAmounts = new Map<Id, Decimal>();
        
        // Query for related Project Tasks in bulk
        for (AggregateResult ar : [SELECT Project__c, SUM(Amount__c) totalAmount 
                                    FROM Project_Task__c
                                    WHERE Project__c IN :projectIds
                                    GROUP BY Project__c]) {
            Id projectId = (Id)ar.get('Project__c');
            Decimal totalAmount = (Decimal)ar.get('totalAmount');
            projectTotalAmounts.put(projectId, totalAmount);
        }
        
        // Update Project Total Amounts
        for (Project__c project : proj) {
            if (projectTotalAmounts.containsKey(project.Id)) {
                project.Tot_Amount__c = projectTotalAmounts.get(project.Id);
            } else {
                project.Tot_Amount__c = 0;
            }
        }
        
        // Update the projects
        update proj;
        
        // Increment the counter
        recordsProcessed += proj.size();
    }
    
    public void finish(Database.BatchableContext bC) {
        // Send an email notification
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {'shanekhotsoka@gmail.com'};
        mail.setToAddresses(toAddresses);
        mail.setSubject('Project Total Amount Batch Job Completed');
        mail.setPlainTextBody('The batch job processing Project Total Amounts has completed. Total records processed: ' + recordsProcessed);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}