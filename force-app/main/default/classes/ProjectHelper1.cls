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
 * ║ 2024-09-17 : Shane Khotsoka - Initial version                             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * @description This ProjectHelper class contains a updateProjectAmount method for querying a Project__c (Projects) related Project Tasks.
 * It includes a for loop for iterating/looping through the task amounts and adding it to the project's total Amount.
 *
 * @see ProjectTrigger1
 */

public with sharing class ProjectHelper1 {
    public static void updateProjectAmounts1(Project__c project) {
        //Query the project task related to the project 
        List<Project_Task__c> tasks = [SELECT Amount__c 
        FROM Project_Task__c 
        WHERE Project__c = :project.Id];

        Decimal totalAmount = 0;
        //iterate through the project task and add the task amounts to the project total amount
        for (Project_Task__c task : tasks) {
            //iterate and add all task amount to the total amount variable
            totalAmount += task.Amount__c;
        }
        //assign the total amount to the project total amount field
        project.Tot_Amount__c = totalAmount;
    }
}