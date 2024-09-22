@isTest
private class ProjectHelperTest {
    
    // Number of test records to create
    private static final Integer NUM_PROJECTS = 3;
    private static final Integer TASKS_PER_PROJECT = 2;
    
    @TestSetup
    static void setupTestData() {
        // Create test Projects
        List<Project__c> projects = new List<Project__c>();
        for (Integer i = 0; i < NUM_PROJECTS; i++) {
            projects.add(new Project__c(Name = 'Test Project ' + i));
        }
        insert projects;
        
        // Create test Project Tasks
        List<Project_Task__c> tasks = new List<Project_Task__c>();
        for (Project__c project : projects) {
            for (Integer i = 0; i < TASKS_PER_PROJECT; i++) {
                tasks.add(new Project_Task__c(
                    Project__c = project.Id,
                    Name = 'Task ' + i + ' for ' + project.Name,
                    Amount__c = 100 * (i + 1)
                ));
            }
        }
        insert tasks;
    }
    
    @isTest
    static void testUpdateProjectAmounts() {
        // Query for test projects
        List<Project__c> projects = [SELECT Id, Tot_Amount__c FROM Project__c];
        
        // Verify initial state
        for (Project__c project : projects) {
            System.assertEquals(0, project.Tot_Amount__c, 'Initial Tot_Amount__c should be 0');
        }
        
        // Call the method to test
        Test.startTest();
        ProjectHelper.updateProjectAmounts(projects);
        Test.stopTest();
        
        // Query for updated projects
        projects = [SELECT Id, Tot_Amount__c FROM Project__c];
        
        // Verify results
        for (Project__c project : projects) {
            // Expected total: 100 + 200 = 300
            System.assertEquals(300, project.Tot_Amount__c, 'Tot_Amount__c should be updated correctly');
        }
    }
    
    @isTest
    static void testUpdateProjectAmountsWithNoTasks() {
        // Create a project with no tasks
        Project__c projectWithNoTasks = new Project__c(Name = 'Project with No Tasks');
        insert projectWithNoTasks;
        
        // Call the method to test
        Test.startTest();
        ProjectHelper.updateProjectAmounts(new List<Project__c>{projectWithNoTasks});
        Test.stopTest();
        
        // Query for the updated project
        projectWithNoTasks = [SELECT Id, Tot_Amount__c FROM Project__c WHERE Id = :projectWithNoTasks.Id];
        
        // Verify result
        System.assertEquals(0, projectWithNoTasks.Tot_Amount__c, 'Tot_Amount__c should be 0 for a project with no tasks');
    }
    
    @isTest
    static void testUpdateProjectAmountsWithLargeDataSet() {
        // Create a large number of projects and tasks
        List<Project__c> largeProjectSet = new List<Project__c>();
        List<Project_Task__c> largeTasks = new List<Project_Task__c>();
        
        for (Integer i = 0; i < 200; i++) {
            Project__c project = new Project__c(Name = 'Large Project ' + i);
            largeProjectSet.add(project);
        }
        insert largeProjectSet;
        
        for (Project__c project : largeProjectSet) {
            largeTasks.add(new Project_Task__c(
                Project__c = project.Id,
                Name = 'Task for ' + project.Name,
                Amount__c = 1000
            ));
        }
        insert largeTasks;
        
        // Call the method to test
        Test.startTest();
        ProjectHelper.updateProjectAmounts(largeProjectSet);
        Test.stopTest();
        
        // Query for updated projects
        largeProjectSet = [SELECT Id, Tot_Amount__c FROM Project__c WHERE Id IN :largeProjectSet];
        
        // Verify results
        for (Project__c project : largeProjectSet) {
            System.assertEquals(1000, project.Tot_Amount__c, 'Tot_Amount__c should be updated correctly for large data set');
        }
    }
}