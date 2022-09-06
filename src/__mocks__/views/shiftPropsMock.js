import { NOW } from "../../js/components/utils";

export const shiftInvitesPropsMock = {
    "invites": [
        {
            "id": 6,
            "shift": {
                "id": 10,
                "venue": {
                    "title": "5881 North University Drive",
                    "id": 3,
                    "latitude": "26.196893",
                    "longitude": "-80.255457",
                    "street_address": "5881 North University Drive, Tamarac, FL, USA",
                    "zip_code": 33321
                },
                "position": {
                    "title": "Floor Manager",
                    "id": 3
                },
                "employer": {
                    "title": "test",
                    "id": 3,
                    "picture": "",
                    "rating": "0.0",
                    "total_ratings": 0
                },
                "status": "OPEN",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-12-14T21:30:00Z",
                "ending_at": "2080-12-14T23:30:00Z",
                "created_at": "2022-08-21T20:22:52.911316Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null
            },
            "employee": {
                "user": {
                    "first_name": "Martin",
                    "last_name": "Luther King",
                    "profile": {
                        "picture": ""
                    },
                    "date_joined": "2022-08-21T20:12:18.693062Z"
                },
                "id": 7,
                "employment_verification_status": "BEING_REVIEWED"
            },
            "status": "PENDING",
            "manually_created": true,
            "responded_at": null,
            "created_at": "2022-08-21T20:24:05.685905Z",
            "updated_at": "2022-08-21T20:24:05.685922Z",
            "sender": 10
        },
        {
            "id": 5,
            "shift": {
                "id": 10,
                "venue": {
                    "title": "5881 North University Drive",
                    "id": 3,
                    "latitude": "26.196893",
                    "longitude": "-80.255457",
                    "street_address": "5881 North University Drive, Tamarac, FL, USA",
                    "zip_code": 33321
                },
                "position": {
                    "title": "Floor Manager",
                    "id": 3
                },
                "employer": {
                    "title": "test",
                    "id": 3,
                    "picture": "",
                    "rating": "0.0",
                    "total_ratings": 0
                },
                "status": "OPEN",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-12-14T21:30:00Z",
                "ending_at": "2080-12-14T23:30:00Z",
                "created_at": "2022-08-21T20:22:52.911316Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null
            },
            "employee": {
                "user": {
                    "first_name": "Paul",
                    "last_name": "McCartney",
                    "profile": {
                        "picture": ""
                    },
                    "date_joined": "2022-08-21T20:12:18.674061Z"
                },
                "id": 3,
                "employment_verification_status": "BEING_REVIEWED"
            },
            "status": "PENDING",
            "manually_created": true,
            "responded_at": null,
            "created_at": "2022-08-21T20:23:52.703686Z",
            "updated_at": "2022-08-21T20:23:52.703984Z",
            "sender": 10
        }
    ],
    "shift": {
        "position": {
            "title": "Floor Manager",
            "id": 3
        },
        "maximum_allowed_employees": 1,
        "application_restriction": "ANYONE",
        "minimum_hourly_rate": "8.0",
        "starting_at": "2080-12-14T21:30:00.000Z",
        "ending_at": "2080-12-14T23:30:00.000Z",
        "employees": [],
        "pending_invites": [],
        "pending_jobcore_invites": [],
        "candidates": [],
        "allowed_from_list": [],
        "allowedFavlists": [],
        "allowedTalents": [],
        "minimum_allowed_rating": "0.0",
        "venue": {
            "title": "5881 North University Drive",
            "id": 3,
            "latitude": "26.196893",
            "longitude": "-80.255457",
            "street_address": "5881 North University Drive, Tamarac, FL, USA",
            "zip_code": 33321
        },
        "status": "OPEN",
        "id": 10,
        "employer": {
            "title": "test",
            "id": 3,
            "picture": "",
            "rating": "0.0",
            "total_ratings": 0
        },
        "required_badges": [],
        "rating": "0.0",
        "created_at": "2022-08-21T20:22:52.911316Z",
        "updated_at": "2022-08-21T20:22:52.932325Z",
        "description": "",
        "maximum_clockin_delta_minutes": null,
        "maximum_clockout_delay_minutes": null,
        "author": null,
        "expired": false,
        "price": {
            "currency": "usd",
            "currencySymbol": "$",
            "amount": "8.0",
            "timeframe": "hr"
        }
    }
}

export const filterShiftsPropsMock = {
    "positions": [
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
    "venues": [
        {
            "label": "5881 North University Drive",
            "value": 3
        },
        {
            "label": "2805 Southwest 145th Avenue",
            "value": 4
        },
        {
            "label": "751 Southwest 121st Avenue",
            "value": 5
        }
    ],
    "applicants": [],
    "applicationRestrictions": [
        {
            "label": "Anyone that qualifies",
            "value": "ANYONE"
        },
        {
            "label": "Only from favorite lists",
            "value": "FAVORITES"
        },
        {
            "label": "Search for specific people",
            "value": "SPECIFIC_PEOPLE"
        }
    ],
    "employer_role": [
        {
            "label": "Supervisor",
            "value": "SUPERVISOR"
        },
        {
            "label": "Manager",
            "value": "MANAGER"
        },
        {
            "label": "Admin",
            "value": "ADMIN"
        }
    ],
    "stars": [
        {
            "label": "0 Star",
            "value": 0
        },
        {
            "label": "1 Star",
            "value": 1
        },
        {
            "label": "2 Stars",
            "value": 2
        },
        {
            "label": "3 Stars",
            "value": 3
        },
        {
            "label": "4 Stars",
            "value": 4
        },
        {
            "label": "5 Stars",
            "value": 5
        }
    ],
    "shiftStatus": [
        {
            "label": "",
            "value": "Select a status"
        },
        {
            "label": "Draft",
            "value": "DRAFT"
        },
        {
            "label": "Open",
            "value": "OPEN"
        },
        {
            "label": "Filled",
            "value": "FILLED"
        },
        {
            "label": "Completed",
            "value": "EXPIRED"
        },
        {
            "label": "Paid",
            "value": "COMPLETED"
        }
    ],
    "deductionsTypes": [
        {
            "value": "PERCENTAGE",
            "label": "Percentage"
        },
        {
            "value": "AMOUNT",
            "label": "Amount"
        }
    ],
    "badges": [
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
    "jcInvites": [],
    "shifts": [
        {
            "position": {
                "title": "Floor Manager",
                "id": 3
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": "2080-12-14T21:30:00.000Z",
            "ending_at": "2080-12-14T23:30:00.000Z",
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0",
            "venue": {
                "title": "5881 North University Drive",
                "id": 3,
                "latitude": "26.196893",
                "longitude": "-80.255457",
                "street_address": "5881 North University Drive, Tamarac, FL, USA",
                "zip_code": 33321
            },
            "status": "OPEN",
            "id": 10,
            "clockin": [],
            "created_at": "2022-08-21T20:22:52.911316Z",
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
    "formData": {},
    "favlists": [],
    "favoriteEmployees": [],
    "invites": [
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-21T20:25:10.490Z",
            "email": "",
            "phone_number": "",
            "employees": [
                3
            ],
            "shifts": [
                10
            ],
            "pending_invites": [
                {
                    "label": "Paul McCartney",
                    "value": 3
                }
            ],
            "sender": 10,
            "employer": 3,
            "id": 5,
            "shift": {
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8",
                "starting_at": "2022-08-21T20:30:10.490Z",
                "ending_at": "2022-08-21T22:30:10.490Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "status": "UNDEFINED",
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8",
                    "timeframe": "hr"
                }
            }
        },
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-21T20:25:23.114Z",
            "email": "",
            "phone_number": "",
            "employees": [
                7
            ],
            "shifts": [
                10
            ],
            "pending_invites": [
                {
                    "label": "Martin Luther King",
                    "value": 7
                }
            ],
            "sender": 10,
            "employer": 3,
            "id": 6,
            "shift": {
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8",
                "starting_at": "2022-08-21T20:30:23.114Z",
                "ending_at": "2022-08-21T22:30:23.114Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "status": "UNDEFINED",
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8",
                    "timeframe": "hr"
                }
            }
        },
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-21T20:25:39.707Z",
            "email": "",
            "phone_number": "",
            "employees": [
                6,
                5
            ],
            "shifts": [
                12
            ],
            "pending_invites": [
                {
                    "label": "Hilary Clinton",
                    "value": 6
                },
                {
                    "label": "Bill Clinton",
                    "value": 5
                }
            ],
            "sender": 10,
            "employer": 3,
            "id": 7,
            "shift": {
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8",
                "starting_at": "2022-08-21T20:30:39.707Z",
                "ending_at": "2022-08-21T22:30:39.707Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "status": "UNDEFINED",
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8",
                    "timeframe": "hr"
                }
            }
        },
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-21T20:25:39.709Z",
            "email": "",
            "phone_number": "",
            "employees": [
                6,
                5
            ],
            "shifts": [
                12
            ],
            "pending_invites": [
                {
                    "label": "Hilary Clinton",
                    "value": 6
                },
                {
                    "label": "Bill Clinton",
                    "value": 5
                }
            ],
            "sender": 10,
            "employer": 3,
            "id": 8,
            "shift": {
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8",
                "starting_at": "2022-08-21T20:30:39.709Z",
                "ending_at": "2022-08-21T22:30:39.709Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "status": "UNDEFINED",
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8",
                    "timeframe": "hr"
                }
            }
        },
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-21T20:26:01.607Z",
            "email": "",
            "phone_number": "",
            "employees": [
                4,
                2
            ],
            "shifts": [
                11
            ],
            "pending_invites": [
                {
                    "label": "Frank Sinatra",
                    "value": 4
                },
                {
                    "label": "John Lennon",
                    "value": 2
                }
            ],
            "sender": 10,
            "employer": 3,
            "id": 9,
            "shift": {
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8",
                "starting_at": "2022-08-21T20:30:01.607Z",
                "ending_at": "2022-08-21T22:30:01.607Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "status": "UNDEFINED",
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8",
                    "timeframe": "hr"
                }
            }
        },
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-21T20:26:01.608Z",
            "email": "",
            "phone_number": "",
            "employees": [
                4,
                2
            ],
            "shifts": [
                11
            ],
            "pending_invites": [
                {
                    "label": "Frank Sinatra",
                    "value": 4
                },
                {
                    "label": "John Lennon",
                    "value": 2
                }
            ],
            "sender": 10,
            "employer": 3,
            "id": 10,
            "shift": {
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8",
                "starting_at": "2022-08-21T20:30:01.608Z",
                "ending_at": "2022-08-21T22:30:01.608Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "status": "UNDEFINED",
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8",
                    "timeframe": "hr"
                }
            }
        }
    ]
}

export const shiftDataMock = {
    allowedFavlists: [],
    allowedTalents: [],
    allowed_from_list: [],
    application_restriction: "ANYONE",
    candidates: [],
    description: "N/A",
    employees: [],
    employer: 56,
    ending_at: "2050-06-29T20:15:47.883Z",
    has_sensitive_updates: true,
    maximum_allowed_employees: "1",
    minimum_allowed_rating: "0",
    minimum_hourly_rate: "8",
    pending_invites: [],
    pending_jobcore_invites: [],
    position: "3",
    starting_at: "2050-06-29T18:15:47.883Z",
    status: "OPEN",
    venue: "12"
}

//Uses NOW
export const shiftDetailsPropsMock = {
    "error": null,
    "catalog": {
        "positions": [
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
        "venues": [
            {
                "label": "3511 North Pine Island Road",
                "value": 3
            },
            {
                "label": "4747 North Nob Hill Road",
                "value": 4
            },
            {
                "label": "6701 Hiatus Road",
                "value": 5
            }
        ],
        "applicants": [],
        "applicationRestrictions": [
            {
                "label": "Anyone that qualifies",
                "value": "ANYONE"
            },
            {
                "label": "Only from favorite lists",
                "value": "FAVORITES"
            },
            {
                "label": "Search for specific people",
                "value": "SPECIFIC_PEOPLE"
            }
        ],
        "employer_role": [
            {
                "label": "Supervisor",
                "value": "SUPERVISOR"
            },
            {
                "label": "Manager",
                "value": "MANAGER"
            },
            {
                "label": "Admin",
                "value": "ADMIN"
            }
        ],
        "stars": [
            {
                "label": "0 Star",
                "value": 0
            },
            {
                "label": "1 Star",
                "value": 1
            },
            {
                "label": "2 Stars",
                "value": 2
            },
            {
                "label": "3 Stars",
                "value": 3
            },
            {
                "label": "4 Stars",
                "value": 4
            },
            {
                "label": "5 Stars",
                "value": 5
            }
        ],
        "shiftStatus": [
            {
                "label": "",
                "value": "Select a status"
            },
            {
                "label": "Draft",
                "value": "DRAFT"
            },
            {
                "label": "Open",
                "value": "OPEN"
            },
            {
                "label": "Filled",
                "value": "FILLED"
            },
            {
                "label": "Completed",
                "value": "EXPIRED"
            },
            {
                "label": "Paid",
                "value": "COMPLETED"
            }
        ],
        "deductionsTypes": [
            {
                "value": "PERCENTAGE",
                "label": "Percentage"
            },
            {
                "value": "AMOUNT",
                "label": "Amount"
            }
        ],
        "badges": [
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
        "jcInvites": [],
        "shifts": [
            {
                "position": {
                    "title": "Runner",
                    "id": 5
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": NOW("2080-03-07T16:30:00.000Z"),
                "ending_at": NOW("2080-03-07T18:30:00.000Z"),
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0.0",
                "venue": {
                    "title": "3511 North Pine Island Road",
                    "id": 3,
                    "latitude": "26.169419",
                    "longitude": "-80.268675",
                    "street_address": "3511 North Pine Island Road, Sunrise, FL, USA",
                    "zip_code": 33351
                },
                "status": "OPEN",
                "has_sensitive_updates": true,
                "employer": {
                    "title": "test",
                    "id": 3,
                    "picture": "",
                    "rating": "0.0",
                    "total_ratings": 0
                },
                "id": 10,
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8.0",
                    "timeframe": "hr"
                },
                "required_badges": [],
                "rating": "0.0",
                "created_at": "2022-08-21T15:26:12.343261Z",
                "updated_at": "2022-08-21T15:26:12.347707Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null,
                "hide_warnings": true,
                "shift": 10
            },
            {
                "position": {
                    "title": "Floor Manager",
                    "id": 3
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": NOW("2080-08-15T15:30:00.000Z"),
                "ending_at": NOW("2080-08-15T17:30:00.000Z"),
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0.0",
                "venue": {
                    "title": "4747 North Nob Hill Road",
                    "id": 4,
                    "latitude": "26.183872",
                    "longitude": "-80.284604",
                    "street_address": "4747 North Nob Hill Road, Tamarac, FL, USA",
                    "zip_code": 33321
                },
                "status": "OPEN",
                "has_sensitive_updates": true,
                "employer": {
                    "title": "test",
                    "id": 3,
                    "picture": "",
                    "rating": "0.0",
                    "total_ratings": 0
                },
                "id": 11,
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8.0",
                    "timeframe": "hr"
                },
                "required_badges": [],
                "rating": "0.0",
                "created_at": "2022-08-21T15:26:54.664177Z",
                "updated_at": "2022-08-21T15:26:54.668317Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null
            },
            {
                "position": {
                    "title": "Warehouse Utility",
                    "id": 6
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": NOW("2080-12-18T16:30:00.000Z"),
                "ending_at": NOW("2080-12-18T18:30:00.000Z"),
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0.0",
                "venue": {
                    "title": "6701 Hiatus Road",
                    "id": 5,
                    "latitude": "26.203142",
                    "longitude": "-80.293801",
                    "street_address": "6701 Hiatus Road, Tamarac, FL, USA",
                    "zip_code": 33321
                },
                "status": "OPEN",
                "has_sensitive_updates": true,
                "employer": {
                    "title": "test",
                    "id": 3,
                    "picture": "",
                    "rating": "0.0",
                    "total_ratings": 0
                },
                "id": 12,
                "expired": false,
                "price": {
                    "currency": "usd",
                    "currencySymbol": "$",
                    "amount": "8.0",
                    "timeframe": "hr"
                },
                "required_badges": [],
                "rating": "0.0",
                "created_at": "2022-08-21T15:27:20.959270Z",
                "updated_at": "2022-08-21T15:27:20.963594Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null
            }
        ],
        "formData": {
            "position": {
                "title": "Floor Manager",
                "id": 3
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": NOW("2080-08-15T15:30:00.000Z"),
            "ending_at": NOW("2080-08-15T17:30:00.000Z"),
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0.0",
            "venue": {
                "title": "4747 North Nob Hill Road",
                "id": 4,
                "latitude": "26.183872",
                "longitude": "-80.284604",
                "street_address": "4747 North Nob Hill Road, Tamarac, FL, USA",
                "zip_code": 33321
            },
            "status": "OPEN",
            "id": 11,
            "employer": {
                "title": "test",
                "id": 3,
                "picture": "",
                "rating": "0.0",
                "total_ratings": 0
            },
            "required_badges": [],
            "rating": "0.0",
            "created_at": "2022-08-21T15:26:54.664177Z",
            "updated_at": "2022-08-21T15:26:54.668317Z",
            "description": "",
            "maximum_clockin_delta_minutes": null,
            "maximum_clockout_delay_minutes": null,
            "author": null,
            "expired": false,
            "price": {
                "currency": "usd",
                "currencySymbol": "$",
                "amount": "8.0",
                "timeframe": "hr"
            }
        },
        "favlists": [],
        "favoriteEmployees": [],
        "invites": [
            {
                "first_name": "",
                "last_name": "",
                "status": "PENDING",
                "created_at": "2022-08-21T15:28:09.659Z",
                "email": "",
                "phone_number": "",
                "id": 10,
                "shift": {
                    "position": {
                        "title": "Runner",
                        "id": 5
                    },
                    "maximum_allowed_employees": "1",
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8.0",
                    "starting_at": NOW("2080-03-07T16:30:00.000Z"),
                    "ending_at": NOW("2080-03-07T18:30:00.000Z"),
                    "employees": [],
                    "pending_invites": [],
                    "pending_jobcore_invites": [],
                    "candidates": [],
                    "allowed_from_list": [],
                    "allowedFavlists": [],
                    "allowedTalents": [],
                    "minimum_allowed_rating": "0",
                    "venue": {
                        "title": "3511 North Pine Island Road",
                        "id": 3,
                        "latitude": "26.169419",
                        "longitude": "-80.268675",
                        "street_address": "3511 North Pine Island Road, Sunrise, FL, USA",
                        "zip_code": 33351
                    },
                    "status": "OPEN",
                    "id": 10,
                    "employer": {
                        "title": "test",
                        "id": 3,
                        "picture": "",
                        "rating": "0.0",
                        "total_ratings": 0
                    },
                    "created_at": "2022-08-21T15:26:12.343261Z",
                    "description": "",
                    "maximum_clockin_delta_minutes": null,
                    "maximum_clockout_delay_minutes": null,
                    "author": null,
                    "expired": false,
                    "price": {
                        "currency": "usd",
                        "currencySymbol": "$",
                        "amount": "8.0",
                        "timeframe": "hr"
                    }
                },
                "employee": {
                    "user": {
                        "first_name": "Hilary",
                        "last_name": "Clinton",
                        "profile": {
                            "picture": ""
                        },
                        "date_joined": "2022-08-21T15:12:44.163424Z"
                    },
                    "id": 6,
                    "employment_verification_status": "BEING_REVIEWED"
                },
                "manually_created": true,
                "responded_at": null,
                "updated_at": "2022-08-21T15:28:09.659771Z",
                "sender": 10
            },
            {
                "first_name": "",
                "last_name": "",
                "status": "PENDING",
                "created_at": "2022-08-21T15:28:09.290Z",
                "email": "",
                "phone_number": "",
                "id": 9,
                "shift": {
                    "position": {
                        "title": "Runner",
                        "id": 5
                    },
                    "maximum_allowed_employees": "1",
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8.0",
                    "starting_at": NOW("2080-03-07T16:30:00.000Z"),
                    "ending_at": NOW("2080-03-07T18:30:00.000Z"),
                    "employees": [],
                    "pending_invites": [],
                    "pending_jobcore_invites": [],
                    "candidates": [],
                    "allowed_from_list": [],
                    "allowedFavlists": [],
                    "allowedTalents": [],
                    "minimum_allowed_rating": "0",
                    "venue": {
                        "title": "3511 North Pine Island Road",
                        "id": 3,
                        "latitude": "26.169419",
                        "longitude": "-80.268675",
                        "street_address": "3511 North Pine Island Road, Sunrise, FL, USA",
                        "zip_code": 33351
                    },
                    "status": "OPEN",
                    "id": 10,
                    "employer": {
                        "title": "test",
                        "id": 3,
                        "picture": "",
                        "rating": "0.0",
                        "total_ratings": 0
                    },
                    "created_at": "2022-08-21T15:26:12.343261Z",
                    "description": "",
                    "maximum_clockin_delta_minutes": null,
                    "maximum_clockout_delay_minutes": null,
                    "author": null,
                    "expired": false,
                    "price": {
                        "currency": "usd",
                        "currencySymbol": "$",
                        "amount": "8.0",
                        "timeframe": "hr"
                    }
                },
                "employee": {
                    "user": {
                        "first_name": "Frank",
                        "last_name": "Sinatra",
                        "profile": {
                            "picture": ""
                        },
                        "date_joined": "2022-08-21T15:12:44.155228Z"
                    },
                    "id": 4,
                    "employment_verification_status": "BEING_REVIEWED"
                },
                "manually_created": true,
                "responded_at": null,
                "updated_at": "2022-08-21T15:28:09.290809Z",
                "sender": 10
            }
        ]
    },
    "formData": {
        "position": {
            "title": "Floor Manager",
            "id": 3
        },
        "maximum_allowed_employees": 1,
        "application_restriction": "ANYONE",
        "minimum_hourly_rate": "8.0",
        "starting_at": NOW("2080-08-15T15:30:00.000Z"),
        "ending_at": NOW("2080-08-15T17:30:00.000Z"),
        "employees": [],
        "pending_invites": [],
        "pending_jobcore_invites": [],
        "candidates": [],
        "allowed_from_list": [],
        "allowedFavlists": [],
        "allowedTalents": [],
        "minimum_allowed_rating": "0.0",
        "venue": {
            "title": "4747 North Nob Hill Road",
            "id": 4,
            "latitude": "26.183872",
            "longitude": "-80.284604",
            "street_address": "4747 North Nob Hill Road, Tamarac, FL, USA",
            "zip_code": 33321
        },
        "status": "OPEN",
        "id": 11,
        "employer": {
            "title": "test",
            "id": 3,
            "picture": "",
            "rating": "0.0",
            "total_ratings": 0
        },
        "required_badges": [],
        "rating": "0.0",
        "created_at": "2022-08-21T15:26:54.664177Z",
        "updated_at": "2022-08-21T15:26:54.668317Z",
        "description": "",
        "maximum_clockin_delta_minutes": null,
        "maximum_clockout_delay_minutes": null,
        "author": null,
        "expired": false,
        "price": {
            "currency": "usd",
            "currencySymbol": "$",
            "amount": "8.0",
            "timeframe": "hr"
        }
    },
    "history": {
        "length": 7,
        "action": "PUSH",
        "location": {
            "pathname": "/home",
            "search": "",
            "hash": "",
            "key": "yksi86"
        }
    }
}

//Uses NOW
export const shiftEmployeesPropsMock = {
    "catalog": {
        "shift": {
            "position": {
                "title": "Floor Manager",
                "id": 3
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            starting_at: NOW("2080-07-10T20:00:00.000Z"),
            ending_at: NOW("2080-07-10T22:00:00.000Z"),
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0.0",
            "venue": {
                "title": "400 Michigan Avenue",
                "id": 4,
                "latitude": "41.876850",
                "longitude": "-87.624573",
                "street_address": "400 Michigan Avenue, Chicago, IL, USA",
                "zip_code": 60605
            },
            "status": "OPEN",
            "id": 12,
            "employer": {
                "title": "test",
                "id": 3,
                "picture": "",
                "rating": "0.0",
                "total_ratings": 0
            },
            "required_badges": [],
            "rating": "0.0",
            "created_at": "2022-08-19T19:47:33.324248Z",
            "updated_at": "2022-08-19T19:47:33.333191Z",
            "description": "",
            "maximum_clockin_delta_minutes": null,
            "maximum_clockout_delay_minutes": null,
            "author": null,
            "expired": false,
            "price": {
                "currency": "usd",
                "currencySymbol": "$",
                "amount": "8.0",
                "timeframe": "hr"
            }
        },
        "showShift": true
    }
}

export const shiftApplicantPropsMock = {
    "error": null,
    "catalog": {
        "positions": [
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
        "venues": [],
        "applicants": [],
        "applicationRestrictions": [
            {
                "label": "Anyone that qualifies",
                "value": "ANYONE"
            },
            {
                "label": "Only from favorite lists",
                "value": "FAVORITES"
            },
            {
                "label": "Search for specific people",
                "value": "SPECIFIC_PEOPLE"
            }
        ],
        "employer_role": [
            {
                "label": "Supervisor",
                "value": "SUPERVISOR"
            },
            {
                "label": "Manager",
                "value": "MANAGER"
            },
            {
                "label": "Admin",
                "value": "ADMIN"
            }
        ],
        "stars": [
            {
                "label": "0 Star",
                "value": 0
            },
            {
                "label": "1 Star",
                "value": 1
            },
            {
                "label": "2 Stars",
                "value": 2
            },
            {
                "label": "3 Stars",
                "value": 3
            },
            {
                "label": "4 Stars",
                "value": 4
            },
            {
                "label": "5 Stars",
                "value": 5
            }
        ],
        "shiftStatus": [
            {
                "label": "",
                "value": "Select a status"
            },
            {
                "label": "Draft",
                "value": "DRAFT"
            },
            {
                "label": "Open",
                "value": "OPEN"
            },
            {
                "label": "Filled",
                "value": "FILLED"
            },
            {
                "label": "Completed",
                "value": "EXPIRED"
            },
            {
                "label": "Paid",
                "value": "COMPLETED"
            }
        ],
        "deductionsTypes": [
            {
                "value": "PERCENTAGE",
                "label": "Percentage"
            },
            {
                "value": "AMOUNT",
                "label": "Amount"
            }
        ],
        "shifts": [],
        "badges": [
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
        "jcInvites": [],
        "formData": {
            "position": {
                "title": "Server",
                "id": 1
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": "2080-12-21T15:45:00.000Z",
            "ending_at": "2080-12-21T17:45:00.000Z",
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0.0",
            "venue": {
                "title": "2201 Ludlam Road",
                "id": 3,
                "latitude": "25.749483",
                "longitude": "-80.303419",
                "street_address": "2201 Ludlam Road, Miami, FL, USA",
                "zip_code": 33155
            },
            "status": "OPEN",
            "id": 10,
            "employer": {
                "title": "test",
                "id": 3,
                "picture": "",
                "rating": "0.0",
                "total_ratings": 0
            },
            "required_badges": [],
            "rating": "0.0",
            "created_at": "2022-08-24T14:39:30.302061Z",
            "updated_at": "2022-08-24T14:39:30.317855Z",
            "description": "",
            "maximum_clockin_delta_minutes": null,
            "maximum_clockout_delay_minutes": null,
            "author": null,
            "expired": false,
            "price": {
                "currency": "usd",
                "currencySymbol": "$",
                "amount": "8.0",
                "timeframe": "hr"
            }
        },
        "shift": {
            "position": {
                "title": "Server",
                "id": 1
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": "2080-12-21T15:45:00.000Z",
            "ending_at": "2080-12-21T17:45:00.000Z",
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0.0",
            "venue": {
                "title": "2201 Ludlam Road",
                "id": 3,
                "latitude": "25.749483",
                "longitude": "-80.303419",
                "street_address": "2201 Ludlam Road, Miami, FL, USA",
                "zip_code": 33155
            },
            "status": "OPEN",
            "id": 10,
            "employer": {
                "title": "test",
                "id": 3,
                "picture": "",
                "rating": "0.0",
                "total_ratings": 0
            },
            "required_badges": [],
            "rating": "0.0",
            "created_at": "2022-08-24T14:39:30.302061Z",
            "updated_at": "2022-08-24T14:39:30.317855Z",
            "description": "",
            "maximum_clockin_delta_minutes": null,
            "maximum_clockout_delay_minutes": null,
            "author": null,
            "expired": false,
            "price": {
                "currency": "usd",
                "currencySymbol": "$",
                "amount": "8.0",
                "timeframe": "hr"
            }
        }
    },
    "formData": {},
    "history": {
        "length": 16,
        "action": "POP",
        "location": {
            "pathname": "/home",
            "search": "",
            "hash": "",
            "key": "x11f5g"
        }
    }
}