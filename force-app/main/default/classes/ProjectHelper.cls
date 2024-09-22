/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗              ║
 * ║   ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝              ║
 * ║   ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║                 ║
 * ║   ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║                 ║
 * ║   ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║                 ║
 * ║   ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝                 ║
 * ║                      ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗      ║
 * ║                      ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗     ║
 * ║                      ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝     ║
 * ║                      ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗     ║
 * ║                      ██║  ██║███████╗███████╗██║     ███████╗██║  ██║     ║
 * ║                      ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝     ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ Title       : ProjectHelper                                               ║
 * ║ Description : Unoptimized class version on Project__c                     ║
 * ║ Author      : Shane Khotsoka                                              ║
 * ║ Created     : 2024-09-16                                                  ║
 * ║ Version     : 1.0                                                         ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ Modification History:                                                     ║
 * ║ 2024-09-17 : Shane Khotsoka - Optimized version                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * @description This ProjectHelper class contains a updateProjectAmount method for querying a Project__c (Projects) 
 * where the project Id is provided and iterate through related Project Tasks. It includes a for loop for iterating/looping 
 * through the task amounts and adding it to the project's total Amount.
 *
 * @see ProjectTrigger1
 */
public with sharing class ProjectHelper {
    public static void updateProjectAmounts(List<Project__c> projects) {
        Set<Id> projectIds = new Set<Id>();
        for (Project__c project : projects) {
            if (project.Id != null) {
                projectIds.add(project.Id);
            }
        }
        
        Map<Id, Decimal> projectTotalAmounts = new Map<Id, Decimal>();
        
        // Query for related Project Tasks in bulk
        for (AggregateResult ar : [SELECT Project__c, SUM(Amount__c) totalAmount 
                                    FROM Project_Task__c
                                    WHERE Project__c IN: projectIds
                                    GROUP BY Project__c]) {
            Id projectId = (Id)ar.get('Project__c');
            Decimal totalAmount = (Decimal)ar.get('totalAmount');
            projectTotalAmounts.put(projectId, totalAmount);
        }
        
        // Update Project Total Amounts
        for (Project__c project : projects) {
            if (project.Id != null && projectTotalAmounts.containsKey(project.Id)) {
                project.Tot_Amount__c = projectTotalAmounts.get(project.Id);
            } else {
                project.Tot_Amount__c = 0;
            }
        }
    }
}  