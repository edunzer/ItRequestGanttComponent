import { LightningElement, track, wire } from 'lwc';
import getITRequests from '@salesforce/apex/ITRequestGanttService.getITRequests';

export default class ItRequestGantt extends LightningElement {
    @track records = [];
    @track dates = [];
    @track formattedStartDate;
    @track formattedEndDate;

    startDate = new Date();
    endDate = new Date(this.startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    connectedCallback() {
        this.fetchRecords();
        this.generateTimeline();
    }

    fetchRecords() {
        getITRequests()
            .then((data) => {
                this.records = data.map((record) => {
                    return {
                        Id: record.Id,
                        ContactName: record.Contact__r ? record.Contact__r.Name : 'Unknown',
                        barStyle: `left: ${this.calculatePosition(
                            record.Start_Date__c
                        )}; width: ${this.calculateWidth(
                            record.Start_Date__c,
                            record.Linked_IT_Request_Date__c
                        )};`,
                    };
                });
            })
            .catch((error) => {
                console.error('Error fetching IT requests:', error);
            });
    }

    generateTimeline() {
        const day = 24 * 60 * 60 * 1000;
        let currentDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        const days = [];

        while (currentDate <= endDate) {
            days.push({
                key: currentDate.toDateString(),
                label: currentDate.toLocaleDateString(),
                style: `width: ${100 / 7}%;`,
            });
            currentDate = new Date(currentDate.getTime() + day);
        }

        this.dates = days;
        this.formattedStartDate = this.startDate.toLocaleDateString();
        this.formattedEndDate = this.endDate.toLocaleDateString();
    }

    calculatePosition(startDate) {
        const totalDays = Math.ceil(
            (this.endDate - this.startDate) / (24 * 60 * 60 * 1000)
        );
        const daysFromStart = Math.ceil(
            (new Date(startDate) - this.startDate) / (24 * 60 * 60 * 1000)
        );
        return `${(daysFromStart / totalDays) * 100}%`;
    }

    calculateWidth(startDate, endDate) {
        const totalDays = Math.ceil(
            (this.endDate - this.startDate) / (24 * 60 * 60 * 1000)
        );
        const eventDays = Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000)
        );
        return `${(eventDays / totalDays) * 100}%`;
    }

    navigateToToday() {
        this.startDate = new Date();
        this.endDate = new Date(this.startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        this.generateTimeline();
        this.fetchRecords();
    }

    navigateToPrevious() {
        this.startDate = new Date(this.startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.endDate = new Date(this.endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.generateTimeline();
        this.fetchRecords();
    }

    navigateToNext() {
        this.startDate = new Date(this.startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.endDate = new Date(this.endDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.generateTimeline();
        this.fetchRecords();
    }
}
