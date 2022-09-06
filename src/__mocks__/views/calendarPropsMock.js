export const calendarPropsMock = {
    positions: [
        {
            "label": "Executive Chef",
            "value": 4
        },
        {
            "label": "Floor Manager",
            "value": 3
        },
        {
            "label": "Kitchen Assistant",
            "value": 2
        },
        {
            "label": "Runner",
            "value": 5
        },
        {
            "label": "Server",
            "value": 1
        },
        {
            "label": "Warehouse Utility",
            "value": 6
        }
    ],
    venues: [
        {
            label: "5201 Blue Lagoon Drive",
            value: 3
        },
        {
            label: "747 Ponce de Leon",
            value: 4
        }
    ],
    applicants: [],
    applicationRestrictions: [
        { label: "Anyone that qualifies", value: "ANYONE" },
        { label: "Only from favorite lists", value: "FAVORITES" },
        { label: "Search for specific people", value: "SPECIFIC_PEOPLE" },
    ],
    badges: [
        {
            "label": "English Proficient",
            "value": 1
        },
        {
            "label": "First Job",
            "value": 3
        },
        {
            "label": "Service Quality",
            "value": 2
        },
        {
            "label": "Spanish Proficient",
            "value": 4
        }
    ],
    shifts: [
        {
            "position": {
                "title": "Kitchen Assistant",
                "id": 2
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": "2050-08-16T17:00:31.832Z",
            "ending_at": "2050-08-16T19:00:31.832Z",
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0",
            "venue": {
                "title": "747 Ponce de Leon",
                "id": 4,
                "latitude": "25.764850",
                "longitude": "-80.258280",
                "street_address": "747 Ponce de Leon, Coral Gables, FL, USA",
                "zip_code": 33134
            },
            "status": "OPEN",
            "id": 11,
            "clockin": [],
            "created_at": "2022-08-16T16:53:22.589153Z",
            "description": "",
            "employer": 3,
            "author": null,
            "expired": false,
            "price": {
                "currency": "usd",
                "currencySymbol": "$",
                "amount": "8.0",
                "timeframe": "hr"
            }
        },
        {
            "position": {
                "title": "Executive Chef",
                "id": 4
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": "2050-08-16T17:00:09.780Z",
            "ending_at": "2050-08-16T19:00:09.780Z",
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0",
            "venue": {
                "title": "5201 Blue Lagoon Drive",
                "id": 3,
                "latitude": "25.782916",
                "longitude": "-80.280739",
                "street_address": "5201 Blue Lagoon Drive, Miami, FL, USA",
                "zip_code": 33126
            },
            "status": "OPEN",
            "id": 10,
            "clockin": [],
            "created_at": "2022-08-16T16:50:14.274880Z",
            "description": "",
            "employer": 3,
            "author": null,
            "expired": false,
            "price": {
                "currency": "usd",
                "currencySymbol": "$",
                "amount": "8.0",
                "timeframe": "hr"
            }
        }
    ],
    employer_role: [
        { label: "Supervisor", value: "SUPERVISOR" },
        { label: "Manager", value: "MANAGER" },
        { label: "Admin", value: "ADMIN" },
    ],
    stars: [
        { label: "0 Star", value: 0 },
        { label: "1 Star", value: 1 },
        { label: "2 Stars", value: 2 },
        { label: "3 Stars", value: 3 },
        { label: "4 Stars", value: 4 },
        { label: "5 Stars", value: 5 },
    ],
    shiftStatus: [
        { label: "", value: "Select a status" },
        { label: "Draft", value: "DRAFT" },
        { label: "Open", value: "OPEN" },
        { label: "Filled", value: "FILLED" },
        { label: "Completed", value: "EXPIRED" },
        { label: "Paid", value: "COMPLETED" },
    ],
    deductionsTypes: [
        { value: "PERCENTAGE", label: "Percentage" },
        { value: "AMOUNT", label: "Amount" },
    ],
    jcInvites: [],
    formData: {}
}