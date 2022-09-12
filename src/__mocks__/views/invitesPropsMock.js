import { NOW } from "../../js/components/utils";

export const shiftOptionDataMock = {
    "value": {
        "position": {
            "title": "Executive Chef",
            "id": 4
        },
        "maximum_allowed_employees": 1,
        "application_restriction": "ANYONE",
        "minimum_hourly_rate": "8.0",
        "starting_at": NOW("2090-08-12T14:30:00.000Z"),
        "ending_at": NOW("2090-08-12T16:30:00.000Z"),
        "employees": [],
        "pending_invites": [],
        "pending_jobcore_invites": [],
        "candidates": [],
        "allowed_from_list": [],
        "allowedFavlists": [],
        "allowedTalents": [],
        "minimum_allowed_rating": "0",
        "venue": {
            "title": "4767 Northwest 36th Street",
            "id": 3,
            "latitude": "25.808258",
            "longitude": "-80.275043",
            "street_address": "4767 Northwest 36th Street, Miami Springs, FL, USA",
            "zip_code": 33166
        },
        "status": "OPEN",
        "id": 10,
        "clockin": [],
        "created_at": "2022-08-22T14:22:56.121450Z",
        "description": "",
        "employer": 4,
        "author": null,
        "expired": false,
        "price": {
            "currency": "usd",
            "currencySymbol": "$",
            "amount": "8.0",
            "timeframe": "hr"
        }
    },
    "label": ""
}

export const SSTITPropsMock = {
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
        "favlists": [
            {
                "label": "Best Workers",
                "value": 3
            }
        ],
        "favoriteEmployees": [
            {
                "label": "Paul McCartney",
                "value": 3
            },
            {
                "label": "Bill Clinton",
                "value": 5
            },
            {
                "label": "Martin Luther King",
                "value": 7
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
        "formData": {
            "employees": [
                5
            ],
            "shifts": [
                {
                    "value": {
                        "position": {
                            "title": "Runner",
                            "id": 5
                        },
                        "maximum_allowed_employees": 1,
                        "application_restriction": "ANYONE",
                        "minimum_hourly_rate": "8.0",
                        "starting_at": NOW("2071-01-01T15:30:00.000Z"),
                        "ending_at": NOW("2071-01-01T17:30:00.000Z"),
                        "employees": [],
                        "pending_invites": [
                            {
                                "label": "Paul McCartney",
                                "value": 3
                            }
                        ],
                        "pending_jobcore_invites": [],
                        "candidates": [],
                        "allowed_from_list": [],
                        "allowedFavlists": [],
                        "allowedTalents": [],
                        "minimum_allowed_rating": "0",
                        "venue": {
                            "title": "2201 Ludlam Road",
                            "id": 5,
                            "latitude": "25.749483",
                            "longitude": "-80.303419",
                            "street_address": "2201 Ludlam Road, Miami, FL, USA",
                            "zip_code": 33155
                        },
                        "status": "OPEN",
                        "id": 12,
                        "clockin": [],
                        "created_at": "2022-08-22T14:23:25.679118Z",
                        "description": "",
                        "employer": 4,
                        "author": null,
                        "expired": false,
                        "price": {
                            "currency": "usd",
                            "currencySymbol": "$",
                            "amount": "8.0",
                            "timeframe": "hr"
                        }
                    },
                    "label": ""
                }
            ]
        },
        "employee": {
            "id": 5,
            "positions": [],
            "badges": [],
            "favoritelist_set": [
                {
                    "id": 3,
                    "title": "Best Workers",
                    "created_at": "2022-08-22T14:24:20.361315Z",
                    "updated_at": "2022-08-22T14:48:16.547170Z",
                    "auto_accept_employees_on_this_list": true,
                    "employer": 4,
                    "employees": [
                        3,
                        5,
                        7
                    ]
                }
            ],
            "user": {
                "first_name": "Bill",
                "last_name": "Clinton",
                "email": "a+bill@jobcore.co",
                "profile": {
                    "picture": "",
                    "bio": "",
                    "phone_number": ""
                }
            },
            "minimum_hourly_rate": "8.0",
            "stop_receiving_invites": false,
            "rating": null,
            "total_ratings": 0,
            "total_pending_payments": 0,
            "maximum_job_distance_miles": 50,
            "job_count": 0,
            "created_at": "2018-09-13T19:45:00Z",
            "updated_at": "2018-09-13T19:45:00Z",
            "response_time": 0,
            "total_invites": 0,
            "employability_expired_at": null,
            "employment_verification_status": "BEING_REVIEWED",
            "filing_status": "SINGLE",
            "allowances": 0,
            "w4_year": 0,
            "step2c_checked": false,
            "dependants_deduction": "0.00",
            "other_income": "0.00",
            "additional_deductions": "0.00",
            "extra_withholding": "0.00",
            "favoriteLists": [
                {
                    "id": 3,
                    "title": "Best Workers",
                    "created_at": "2022-08-22T14:24:20.361315Z",
                    "updated_at": "2022-08-22T14:48:16.547170Z",
                    "auto_accept_employees_on_this_list": true,
                    "employer": 4,
                    "employees": [
                        3,
                        5,
                        7
                    ]
                }
            ]
        },
        "shifts": [
            {
                "position": {
                    "title": "Executive Chef",
                    "id": 4
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": NOW("2090-08-12T14:30:00.000Z"),
                "ending_at": NOW("2090-08-12T16:30:00.000Z"),
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "4767 Northwest 36th Street",
                    "id": 3,
                    "latitude": "25.808258",
                    "longitude": "-80.275043",
                    "street_address": "4767 Northwest 36th Street, Miami Springs, FL, USA",
                    "zip_code": 33166
                },
                "status": "OPEN",
                "id": 10,
                "clockin": [],
                "created_at": "2022-08-22T14:22:56.121450Z",
                "description": "",
                "employer": 4,
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
                    "title": "Kitchen Assistant",
                    "id": 2
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": NOW("2080-12-26T15:30:00.000Z"),
                "ending_at": NOW("2080-12-26T17:30:00.000Z"),
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "5040 Northwest 7th Street",
                    "id": 4,
                    "latitude": "25.778169",
                    "longitude": "-80.276820",
                    "street_address": "5040 Northwest 7th Street, Miami, FL, USA",
                    "zip_code": 33126
                },
                "status": "OPEN",
                "id": 11,
                "clockin": [],
                "created_at": "2022-08-22T14:23:12.580894Z",
                "description": "",
                "employer": 4,
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
                    "title": "Runner",
                    "id": 5
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": NOW("2071-01-01T15:30:00.000Z"),
                "ending_at": NOW("2071-01-01T17:30:00.000Z"),
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "2201 Ludlam Road",
                    "id": 5,
                    "latitude": "25.749483",
                    "longitude": "-80.303419",
                    "street_address": "2201 Ludlam Road, Miami, FL, USA",
                    "zip_code": 33155
                },
                "status": "OPEN",
                "id": 12,
                "clockin": [],
                "created_at": "2022-08-22T14:23:25.679118Z",
                "description": "",
                "employer": 4,
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
        "invites": [
            {
                "first_name": "",
                "last_name": "",
                "status": "PENDING",
                "created_at": "2022-08-22T14:30:55.060Z",
                "email": "",
                "phone_number": "",
                "employees": [
                    7
                ],
                "shifts": [
                    12,
                    10
                ],
                "sender": 11,
                "employer": 4,
                "id": 5,
                "shift": {
                    "maximum_allowed_employees": "1",
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8",
                    "starting_at": NOW("2022-08-22T14:45:55.061Z"),
                    "ending_at": NOW("2022-08-22T16:45:55.061Z"),
                    "employees": [],
                    "pending_invites": [],
                    "pending_jobcore_invites": [],
                    "candidates": [],
                    "allowed_from_list": [],
                    "allowedFavlists": [],
                    "allowedTalents": [],
                    "minimum_allowed_rating": "0",
                    "venue": null,
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
                "created_at": "2022-08-22T14:30:55.061Z",
                "email": "",
                "phone_number": "",
                "employees": [
                    7
                ],
                "shifts": [
                    12,
                    10
                ],
                "sender": 11,
                "employer": 4,
                "id": 6,
                "shift": {
                    "maximum_allowed_employees": "1",
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8",
                    "starting_at": NOW("2022-08-22T14:45:55.062Z"),
                    "ending_at": NOW("2022-08-22T16:45:55.062Z"),
                    "employees": [],
                    "pending_invites": [],
                    "pending_jobcore_invites": [],
                    "candidates": [],
                    "allowed_from_list": [],
                    "allowedFavlists": [],
                    "allowedTalents": [],
                    "minimum_allowed_rating": "0",
                    "venue": null,
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
    },
    "formData": {
        "employees": [
            5
        ],
        "shifts": [
            {
                "value": {
                    "position": {
                        "title": "Runner",
                        "id": 5
                    },
                    "maximum_allowed_employees": 1,
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8.0",
                    "starting_at": NOW("2071-01-01T15:30:00.000Z"),
                    "ending_at": NOW("2071-01-01T17:30:00.000Z"),
                    "employees": [],
                    "pending_invites": [],
                    "pending_jobcore_invites": [],
                    "candidates": [],
                    "allowed_from_list": [],
                    "allowedFavlists": [],
                    "allowedTalents": [],
                    "minimum_allowed_rating": "0",
                    "venue": {
                        "title": "2201 Ludlam Road",
                        "id": 5,
                        "latitude": "25.749483",
                        "longitude": "-80.303419",
                        "street_address": "2201 Ludlam Road, Miami, FL, USA",
                        "zip_code": 33155
                    },
                    "status": "OPEN",
                    "id": 12,
                    "clockin": [],
                    "created_at": "2022-08-22T14:23:25.679118Z",
                    "description": "",
                    "employer": 4,
                    "author": null,
                    "expired": false,
                    "price": {
                        "currency": "usd",
                        "currencySymbol": "$",
                        "amount": "8.0",
                        "timeframe": "hr"
                    }
                },
                "label": ""
            }
        ]
    },
    "history": {
        "length": 11,
        "action": "POP",
        "location": {
            "pathname": "/favorites",
            "search": "",
            "hash": ""
        }
    }
}

export const STTITSPropsMock = {
    "employees": [
        3
    ],
    "shifts": [
        {
            "position": {
                "title": "Floor Manager",
                "id": 3
            },
            "maximum_allowed_employees": 1,
            "application_restriction": "ANYONE",
            "minimum_hourly_rate": "8.0",
            "starting_at": NOW("2090-12-23T19:30:00.000Z"),
            "ending_at": NOW("2090-12-23T21:30:00.000Z"),
            "employees": [],
            "pending_invites": [],
            "pending_jobcore_invites": [],
            "candidates": [],
            "allowed_from_list": [],
            "allowedFavlists": [],
            "allowedTalents": [],
            "minimum_allowed_rating": "0.0",
            "venue": {
                "title": "4251 Northwest 11th Street",
                "id": 3,
                "latitude": "25.782816",
                "longitude": "-80.264931",
                "street_address": "4251 Northwest 11th Street, Miami, FL, USA",
                "zip_code": 33126
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
            "created_at": "2022-08-22T18:26:59.364426Z",
            "updated_at": "2022-08-22T18:26:59.373585Z",
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
    ],
    "pending_invites": [
        {
            "label": "Paul McCartney",
            "value": 3
        }
    ]
}

export const PIformDataMock = {
    "invites": [
        {
            "id": 7,
            "shift": {
                "id": 11,
                "venue": {
                    "title": "3686 Grand Avenue",
                    "id": 4,
                    "latitude": "25.727411",
                    "longitude": "-80.253288",
                    "street_address": "3686 Grand Avenue, Miami, FL, USA",
                    "zip_code": 33133
                },
                "position": {
                    "title": "Kitchen Assistant",
                    "id": 2
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
                "starting_at": "2080-11-20T15:45:00Z",
                "ending_at": "2080-11-20T17:45:00Z",
                "created_at": "2022-08-24T14:39:42.383656Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null
            },
            "employee": {
                "user": {
                    "first_name": "John",
                    "last_name": "Lennon",
                    "profile": {
                        "picture": ""
                    },
                    "date_joined": "2022-08-24T14:20:01.027387Z"
                },
                "id": 2,
                "employment_verification_status": "BEING_REVIEWED"
            },
            "status": "PENDING",
            "manually_created": true,
            "responded_at": null,
            "created_at": "2022-08-24T18:27:40.203022Z",
            "updated_at": "2022-08-24T18:27:40.203046Z",
            "sender": 10
        },
        {
            "id": 6,
            "shift": {
                "id": 10,
                "venue": {
                    "title": "2201 Ludlam Road",
                    "id": 3,
                    "latitude": "25.749483",
                    "longitude": "-80.303419",
                    "street_address": "2201 Ludlam Road, Miami, FL, USA",
                    "zip_code": 33155
                },
                "position": {
                    "title": "Server",
                    "id": 1
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
                "starting_at": "2080-12-21T15:45:00Z",
                "ending_at": "2080-12-21T17:45:00Z",
                "created_at": "2022-08-24T14:39:30.302061Z",
                "description": "",
                "maximum_clockin_delta_minutes": null,
                "maximum_clockout_delay_minutes": null,
                "author": null
            },
            "employee": {
                "user": {
                    "first_name": "John",
                    "last_name": "Lennon",
                    "profile": {
                        "picture": ""
                    },
                    "date_joined": "2022-08-24T14:20:01.027387Z"
                },
                "id": 2,
                "employment_verification_status": "BEING_REVIEWED"
            },
            "status": "PENDING",
            "manually_created": true,
            "responded_at": null,
            "created_at": "2022-08-24T18:27:35.810105Z",
            "updated_at": "2022-08-24T18:27:35.810122Z",
            "sender": 10
        }
    ],
    "talent": {
        "id": 2,
        "positions": [
            {
                "id": 1,
                "picture": "",
                "title": "Server",
                "description": "",
                "meta_description": "",
                "meta_keywords": "",
                "created_at": "2018-09-13T19:45:00Z",
                "updated_at": "2018-09-13T19:45:00Z",
                "status": "ACTIVE",
                "pay_rate": []
            },
            {
                "id": 3,
                "picture": "",
                "title": "Floor Manager",
                "description": "",
                "meta_description": "",
                "meta_keywords": "",
                "created_at": "2018-09-13T19:45:00Z",
                "updated_at": "2018-09-13T19:45:00Z",
                "status": "ACTIVE",
                "pay_rate": []
            }
        ],
        "badges": [
            {
                "title": "English Proficient",
                "id": 1
            },
            {
                "title": "Service Quality",
                "id": 2
            }
        ],
        "favoritelist_set": [
            {
                "id": 1,
                "title": "Preferred Employees",
                "created_at": "2018-09-13T19:45:00Z",
                "updated_at": "2018-09-13T19:45:00Z",
                "auto_accept_employees_on_this_list": true,
                "employer": 1,
                "employees": [
                    2,
                    3
                ]
            }
        ],
        "user": {
            "first_name": "John",
            "last_name": "Lennon",
            "email": "lennon@jobcore.co",
            "profile": {
                "picture": "",
                "bio": "",
                "phone_number": ""
            }
        },
        "minimum_hourly_rate": "8.0",
        "stop_receiving_invites": false,
        "rating": null,
        "total_ratings": 0,
        "total_pending_payments": 0,
        "maximum_job_distance_miles": 50,
        "job_count": 0,
        "created_at": "2018-09-13T19:45:00Z",
        "updated_at": "2018-09-13T19:45:00Z",
        "response_time": 0,
        "total_invites": 0,
        "employability_expired_at": null,
        "employment_verification_status": "BEING_REVIEWED",
        "filing_status": "SINGLE",
        "allowances": 0,
        "w4_year": 0,
        "step2c_checked": false,
        "dependants_deduction": "0.00",
        "other_income": "0.00",
        "additional_deductions": "0.00",
        "extra_withholding": "0.00",
        "favoriteLists": []
    }
}

export const PIcatalogMock = {
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
    "jcInvites": [],
    "favlists": [],
    "favoriteEmployees": [],
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
    "employee": {
        "id": 2,
        "positions": [
            {
                "id": 1,
                "picture": "",
                "title": "Server",
                "description": "",
                "meta_description": "",
                "meta_keywords": "",
                "created_at": "2018-09-13T19:45:00Z",
                "updated_at": "2018-09-13T19:45:00Z",
                "status": "ACTIVE",
                "pay_rate": []
            },
            {
                "id": 3,
                "picture": "",
                "title": "Floor Manager",
                "description": "",
                "meta_description": "",
                "meta_keywords": "",
                "created_at": "2018-09-13T19:45:00Z",
                "updated_at": "2018-09-13T19:45:00Z",
                "status": "ACTIVE",
                "pay_rate": []
            }
        ],
        "badges": [
            {
                "title": "English Proficient",
                "id": 1
            },
            {
                "title": "Service Quality",
                "id": 2
            }
        ],
        "favoritelist_set": [
            {
                "id": 1,
                "title": "Preferred Employees",
                "created_at": "2018-09-13T19:45:00Z",
                "updated_at": "2018-09-13T19:45:00Z",
                "auto_accept_employees_on_this_list": true,
                "employer": 1,
                "employees": [
                    2,
                    3
                ]
            }
        ],
        "user": {
            "first_name": "John",
            "last_name": "Lennon",
            "email": "lennon@jobcore.co",
            "profile": {
                "picture": "",
                "bio": "",
                "phone_number": ""
            }
        },
        "minimum_hourly_rate": "8.0",
        "stop_receiving_invites": false,
        "rating": null,
        "total_ratings": 0,
        "total_pending_payments": 0,
        "maximum_job_distance_miles": 50,
        "job_count": 0,
        "created_at": "2018-09-13T19:45:00Z",
        "updated_at": "2018-09-13T19:45:00Z",
        "response_time": 0,
        "total_invites": 0,
        "employability_expired_at": null,
        "employment_verification_status": "BEING_REVIEWED",
        "filing_status": "SINGLE",
        "allowances": 0,
        "w4_year": 0,
        "step2c_checked": false,
        "dependants_deduction": "0.00",
        "other_income": "0.00",
        "additional_deductions": "0.00",
        "extra_withholding": "0.00",
        "favoriteLists": []
    },
    "invites": [
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-24T18:27:40.203Z",
            "email": "",
            "phone_number": "",
            "id": 7,
            "shift": {
                "position": {
                    "title": "Kitchen Assistant",
                    "id": 2
                },
                "maximum_allowed_employees": "1",
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-11-20T15:45:00.000Z",
                "ending_at": "2080-11-20T17:45:00.000Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "3686 Grand Avenue",
                    "id": 4,
                    "latitude": "25.727411",
                    "longitude": "-80.253288",
                    "street_address": "3686 Grand Avenue, Miami, FL, USA",
                    "zip_code": 33133
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
                "created_at": "2022-08-24T14:39:42.383656Z",
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
                    "first_name": "John",
                    "last_name": "Lennon",
                    "profile": {
                        "picture": ""
                    },
                    "date_joined": "2022-08-24T14:20:01.027387Z"
                },
                "id": 2,
                "employment_verification_status": "BEING_REVIEWED"
            },
            "manually_created": true,
            "responded_at": null,
            "updated_at": "2022-08-24T18:27:40.203046Z",
            "sender": 10
        },
        {
            "first_name": "",
            "last_name": "",
            "status": "PENDING",
            "created_at": "2022-08-24T18:27:35.810Z",
            "email": "",
            "phone_number": "",
            "id": 6,
            "shift": {
                "position": {
                    "title": "Server",
                    "id": 1
                },
                "maximum_allowed_employees": "1",
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
                "minimum_allowed_rating": "0",
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
                "created_at": "2022-08-24T14:39:30.302061Z",
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
                    "first_name": "John",
                    "last_name": "Lennon",
                    "profile": {
                        "picture": ""
                    },
                    "date_joined": "2022-08-24T14:20:01.027387Z"
                },
                "id": 2,
                "employment_verification_status": "BEING_REVIEWED"
            },
            "manually_created": true,
            "responded_at": null,
            "updated_at": "2022-08-24T18:27:35.810122Z",
            "sender": 10
        }
    ],
    "formData": {
        "invites": [
            {
                "id": 7,
                "shift": {
                    "id": 11,
                    "venue": {
                        "title": "3686 Grand Avenue",
                        "id": 4,
                        "latitude": "25.727411",
                        "longitude": "-80.253288",
                        "street_address": "3686 Grand Avenue, Miami, FL, USA",
                        "zip_code": 33133
                    },
                    "position": {
                        "title": "Kitchen Assistant",
                        "id": 2
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
                    "starting_at": "2080-11-20T15:45:00Z",
                    "ending_at": "2080-11-20T17:45:00Z",
                    "created_at": "2022-08-24T14:39:42.383656Z",
                    "description": "",
                    "maximum_clockin_delta_minutes": null,
                    "maximum_clockout_delay_minutes": null,
                    "author": null
                },
                "employee": {
                    "user": {
                        "first_name": "John",
                        "last_name": "Lennon",
                        "profile": {
                            "picture": ""
                        },
                        "date_joined": "2022-08-24T14:20:01.027387Z"
                    },
                    "id": 2,
                    "employment_verification_status": "BEING_REVIEWED"
                },
                "status": "PENDING",
                "manually_created": true,
                "responded_at": null,
                "created_at": "2022-08-24T18:27:40.203022Z",
                "updated_at": "2022-08-24T18:27:40.203046Z",
                "sender": 10
            },
            {
                "id": 6,
                "shift": {
                    "id": 10,
                    "venue": {
                        "title": "2201 Ludlam Road",
                        "id": 3,
                        "latitude": "25.749483",
                        "longitude": "-80.303419",
                        "street_address": "2201 Ludlam Road, Miami, FL, USA",
                        "zip_code": 33155
                    },
                    "position": {
                        "title": "Server",
                        "id": 1
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
                    "starting_at": "2080-12-21T15:45:00Z",
                    "ending_at": "2080-12-21T17:45:00Z",
                    "created_at": "2022-08-24T14:39:30.302061Z",
                    "description": "",
                    "maximum_clockin_delta_minutes": null,
                    "maximum_clockout_delay_minutes": null,
                    "author": null
                },
                "employee": {
                    "user": {
                        "first_name": "John",
                        "last_name": "Lennon",
                        "profile": {
                            "picture": ""
                        },
                        "date_joined": "2022-08-24T14:20:01.027387Z"
                    },
                    "id": 2,
                    "employment_verification_status": "BEING_REVIEWED"
                },
                "status": "PENDING",
                "manually_created": true,
                "responded_at": null,
                "created_at": "2022-08-24T18:27:35.810105Z",
                "updated_at": "2022-08-24T18:27:35.810122Z",
                "sender": 10
            }
        ],
        "talent": {
            "id": 2,
            "positions": [
                {
                    "id": 1,
                    "picture": "",
                    "title": "Server",
                    "description": "",
                    "meta_description": "",
                    "meta_keywords": "",
                    "created_at": "2018-09-13T19:45:00Z",
                    "updated_at": "2018-09-13T19:45:00Z",
                    "status": "ACTIVE",
                    "pay_rate": []
                },
                {
                    "id": 3,
                    "picture": "",
                    "title": "Floor Manager",
                    "description": "",
                    "meta_description": "",
                    "meta_keywords": "",
                    "created_at": "2018-09-13T19:45:00Z",
                    "updated_at": "2018-09-13T19:45:00Z",
                    "status": "ACTIVE",
                    "pay_rate": []
                }
            ],
            "badges": [
                {
                    "title": "English Proficient",
                    "id": 1
                },
                {
                    "title": "Service Quality",
                    "id": 2
                }
            ],
            "favoritelist_set": [
                {
                    "id": 1,
                    "title": "Preferred Employees",
                    "created_at": "2018-09-13T19:45:00Z",
                    "updated_at": "2018-09-13T19:45:00Z",
                    "auto_accept_employees_on_this_list": true,
                    "employer": 1,
                    "employees": [
                        2,
                        3
                    ]
                }
            ],
            "user": {
                "first_name": "John",
                "last_name": "Lennon",
                "email": "lennon@jobcore.co",
                "profile": {
                    "picture": "",
                    "bio": "",
                    "phone_number": ""
                }
            },
            "minimum_hourly_rate": "8.0",
            "stop_receiving_invites": false,
            "rating": null,
            "total_ratings": 0,
            "total_pending_payments": 0,
            "maximum_job_distance_miles": 50,
            "job_count": 0,
            "created_at": "2018-09-13T19:45:00Z",
            "updated_at": "2018-09-13T19:45:00Z",
            "response_time": 0,
            "total_invites": 0,
            "employability_expired_at": null,
            "employment_verification_status": "BEING_REVIEWED",
            "filing_status": "SINGLE",
            "allowances": 0,
            "w4_year": 0,
            "step2c_checked": false,
            "dependants_deduction": "0.00",
            "other_income": "0.00",
            "additional_deductions": "0.00",
            "extra_withholding": "0.00",
            "favoriteLists": []
        }
    }
}

export const ITTJBFormDataMock = {
    "talent": true,
    "include_sms": false,
    "first_name": "Paola",
    "last_name": "Sanchez",
    "email": "paola@mail.com",
    "phone_number": "954-000-0000"
}

export const ITTJBCatalogMock = {
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
    "jcInvites": [
        {
            "id": 3,
            "sender": {
                "id": 10,
                "user": {
                    "first_name": "test",
                    "last_name": "test",
                    "email": "testemployer256@gmail.com"
                },
                "employer": {
                    "id": 3,
                    "title": "test",
                    "picture": "",
                    "website": "test",
                    "bio": "Catering",
                    "response_time": 0,
                    "rating": "0.0",
                    "total_ratings": 0,
                    "status": "APPROVED",
                    "automatically_accept_from_favlists": true,
                    "payroll_period_starting_time": null,
                    "payroll_period_length": 7,
                    "payroll_period_type": "DAYS",
                    "last_payment_period": null,
                    "maximum_clockin_delta_minutes": null,
                    "maximum_clockout_delay_minutes": null,
                    "created_at": "2022-08-22T18:25:07.930903Z",
                    "updated_at": "2022-08-22T18:25:07.930931Z",
                    "badges": []
                },
                "employee": null,
                "picture": "",
                "resume": "True",
                "bio": "",
                "show_tutorial": false,
                "location": "",
                "street_address": "",
                "country": "",
                "city": null,
                "state": "",
                "zip_code": null,
                "latitude": "0.00000000000",
                "longitude": "0.00000000000",
                "birth_date": null,
                "phone_number": "",
                "last_4dig_ssn": "",
                "created_at": "2022-08-22T18:25:07.934206Z",
                "updated_at": "2022-08-22T18:26:25.085825Z",
                "employer_role": "ADMIN",
                "status": "PENDING_EMAIL_VALIDATION",
                "profile_city": null,
                "other_employers": []
            },
            "first_name": "Paola",
            "last_name": "Sanchez",
            "email": "paola@mail.com",
            "status": "PENDING",
            "phone_number": "954-000-0000",
            "employer_role": "",
            "created_at": "2022-08-22T18:40:32.272052Z",
            "updated_at": "2022-08-22T18:40:32.272079Z",
            "shift": null,
            "employer": null
        }
    ],
    "formData": {
        "talent": true,
        "include_sms": false,
        "first_name": "Paola",
        "last_name": "Sanchez",
        "email": "paola@mail.com",
        "phone_number": "954-000-0000"
    }
}

export const invitesCatalog = {
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
        "talent": true,
        "include_sms": false
    }
}