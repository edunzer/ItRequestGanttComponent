public with sharing class ITRequestGanttService {
    @AuraEnabled(cacheable=true)
    public static List<IT_Request__c> getITRequests(String agency, String contactName, String projectCode) {
        String baseQuery = 'SELECT Id, Name, Linked_IT_Request__r.Name, Supplier_Assignment__r.Name, Contact__r.Name, ' +
                           'Start_Date__c, Linked_IT_Request_Date__c, Agency__c, Type__c, Supplier_Assignment__r.Project_Code__c ' +
                           'FROM IT_Request__c WHERE Status__c != \'Cancelled\' AND Start_Date__c != null AND Type__c = \'External\'';
        
        // Apply filters if provided
        if (agency != null && agency != '') {
            baseQuery += ' AND Agency__c = :agency';
        }
        if (contactName != null && contactName != '') {
            baseQuery += ' AND Contact__r.Name LIKE \'%' + String.escapeSingleQuotes(contactName) + '%\'';
        }
        if (projectCode != null && projectCode != '') {
            baseQuery += ' AND Supplier_Assignment__r.Project_Code__c LIKE \'%' + String.escapeSingleQuotes(projectCode) + '%\'';
        }
        
        baseQuery += ' ORDER BY Name DESC';
        
        return Database.query(baseQuery);
    }
}
