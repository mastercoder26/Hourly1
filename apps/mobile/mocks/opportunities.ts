export interface Opportunity {
  id: string;
  orgName: string;
  roleTitle: string;
  cause: string;
  distance: number;
  dateTime: string;
  hours: number;
  spotsRemaining: number;
  creditEligible: boolean;
  latitude: number;
  longitude: number;
}

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp_1",
    orgName: "City Food Bank",
    roleTitle: "Weekend Pantry Organizer",
    cause: "Food",
    distance: 2.4,
    dateTime: "Sat, Oct 14 • 9:00 AM",
    hours: 4,
    spotsRemaining: 3,
    creditEligible: true,
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: "opp_2",
    orgName: "Green Earth Initiative",
    roleTitle: "Beach Cleanup Volunteer",
    cause: "Environment",
    distance: 5.1,
    dateTime: "Sun, Oct 15 • 10:00 AM",
    hours: 3,
    spotsRemaining: 12,
    creditEligible: true,
    latitude: 37.7849,
    longitude: -122.4094
  },
  {
    id: "opp_3",
    orgName: "Local Animal Shelter",
    roleTitle: "Dog Walking Assistant",
    cause: "Animals",
    distance: 1.2,
    dateTime: "Wed, Oct 18 • 4:00 PM",
    hours: 2,
    spotsRemaining: 1,
    creditEligible: false,
    latitude: 37.7649,
    longitude: -122.4294
  }
];
