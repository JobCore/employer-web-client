export const talentDataMock = {
    "id": 3,
    "positions": [],
    "badges": [
        {
            "title": "First Job",
            "id": 3
        },
        {
            "title": "Spanish Proficient",
            "id": 4
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
        },
        {
            "id": 2,
            "title": "Preferred Employees",
            "created_at": "2018-09-13T19:45:00Z",
            "updated_at": "2018-09-13T19:45:00Z",
            "auto_accept_employees_on_this_list": false,
            "employer": 1,
            "employees": [
                3
            ]
        },
        {
            "id": 3,
            "title": "Best Workers List",
            "created_at": "2022-08-23T19:03:00.675062Z",
            "updated_at": "2022-08-23T19:03:24.696114Z",
            "auto_accept_employees_on_this_list": true,
            "employer": 3,
            "employees": [
                3,
                4,
                6
            ]
        }
    ],
    "user": {
        "first_name": "Paul",
        "last_name": "McCartney",
        "email": "a+employee3@jobcore.co",
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
    "extra_withholding": "0.00"
}

export const talentFiltersPropsMock = {
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
                    "email": "testemployer678@gmail.com"
                },
                "employer": {
                    "id": 3,
                    "title": "test",
                    "picture": "",
                    "website": "test",
                    "bio": "Cruises",
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
                    "created_at": "2022-08-23T19:00:35.658223Z",
                    "updated_at": "2022-08-23T19:00:35.658246Z",
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
                "created_at": "2022-08-23T19:00:35.660438Z",
                "updated_at": "2022-08-23T19:01:24.156249Z",
                "employer_role": "ADMIN",
                "status": "PENDING_EMAIL_VALIDATION",
                "profile_city": null,
                "other_employers": []
            },
            "first_name": "Mary",
            "last_name": "Jane",
            "email": "maryjane@gmail.com",
            "status": "PENDING",
            "phone_number": "000-000-0000",
            "employer_role": "",
            "created_at": "2022-08-23T19:04:10.223348Z",
            "updated_at": "2022-08-23T19:04:10.223369Z",
            "shift": null,
            "employer": null
        }
    ],
    "favlists": [
        {
            "label": "Best Workers List",
            "value": 3
        }
    ],
    "favoriteEmployees": [
        {
            "label": "Paul McCartney",
            "value": 3
        },
        {
            "label": "Frank Sinatra",
            "value": 4
        },
        {
            "label": "Hilary Clinton",
            "value": 6
        }
    ],
    "formData": {
        "positions": [],
        "badges": []
    }
}

export const talentDetailsPropsMock = {
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
        "shifts": [
            {
                "position": {
                    "title": "Executive Chef",
                    "id": 4
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-12-20T20:15:00.000Z",
                "ending_at": "2080-12-20T22:15:00.000Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "3661 South Miami Avenue",
                    "id": 3,
                    "latitude": "25.740640",
                    "longitude": "-80.213021",
                    "street_address": "3661 South Miami Avenue, Miami, FL, USA",
                    "zip_code": 33133
                },
                "status": "OPEN",
                "id": 10,
                "clockin": [],
                "created_at": "2022-08-23T19:02:12.870581Z",
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
                    "title": "Kitchen Assistant",
                    "id": 2
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-11-21T20:15:00.000Z",
                "ending_at": "2080-11-21T22:15:00.000Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "6705 Red Road",
                    "id": 5,
                    "latitude": "25.706114",
                    "longitude": "-80.285187",
                    "street_address": "6705 Red Road, Coral Gables, FL, USA",
                    "zip_code": 33143
                },
                "status": "OPEN",
                "id": 12,
                "clockin": [],
                "created_at": "2022-08-23T19:02:39.444105Z",
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
                    "title": "Floor Manager",
                    "id": 3
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-08-10T19:15:00.000Z",
                "ending_at": "2080-08-10T21:15:00.000Z",
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
                    "id": 4,
                    "latitude": "25.749483",
                    "longitude": "-80.303419",
                    "street_address": "2201 Ludlam Road, Miami, FL, USA",
                    "zip_code": 33155
                },
                "status": "OPEN",
                "id": 11,
                "clockin": [],
                "created_at": "2022-08-23T19:02:24.371128Z",
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
        "jcInvites": [
            {
                "id": 3,
                "sender": {
                    "id": 10,
                    "user": {
                        "first_name": "test",
                        "last_name": "test",
                        "email": "testemployer678@gmail.com"
                    },
                    "employer": {
                        "id": 3,
                        "title": "test",
                        "picture": "",
                        "website": "test",
                        "bio": "Cruises",
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
                        "created_at": "2022-08-23T19:00:35.658223Z",
                        "updated_at": "2022-08-23T19:00:35.658246Z",
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
                    "created_at": "2022-08-23T19:00:35.660438Z",
                    "updated_at": "2022-08-23T19:01:24.156249Z",
                    "employer_role": "ADMIN",
                    "status": "PENDING_EMAIL_VALIDATION",
                    "profile_city": null,
                    "other_employers": []
                },
                "first_name": "Mary",
                "last_name": "Jane",
                "email": "maryjane@gmail.com",
                "status": "PENDING",
                "phone_number": "000-000-0000",
                "employer_role": "",
                "created_at": "2022-08-23T19:04:10.223348Z",
                "updated_at": "2022-08-23T19:04:10.223369Z",
                "shift": null,
                "employer": null
            }
        ],
        "favlists": [
            {
                "label": "Best Workers List",
                "value": 3
            }
        ],
        "favoriteEmployees": [
            {
                "label": "Paul McCartney",
                "value": 3
            },
            {
                "label": "Frank Sinatra",
                "value": 4
            },
            {
                "label": "Hilary Clinton",
                "value": 6
            }
        ],
        "employee": {
            "id": 3,
            "positions": [],
            "badges": [
                {
                    "title": "First Job",
                    "id": 3
                },
                {
                    "title": "Spanish Proficient",
                    "id": 4
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
                },
                {
                    "id": 2,
                    "title": "Preferred Employees",
                    "created_at": "2018-09-13T19:45:00Z",
                    "updated_at": "2018-09-13T19:45:00Z",
                    "auto_accept_employees_on_this_list": false,
                    "employer": 1,
                    "employees": [
                        3
                    ]
                },
                {
                    "id": 3,
                    "title": "Best Workers List",
                    "created_at": "2022-08-23T19:03:00.675062Z",
                    "updated_at": "2022-08-23T19:03:24.696114Z",
                    "auto_accept_employees_on_this_list": true,
                    "employer": 3,
                    "employees": [
                        3,
                        4,
                        6
                    ]
                }
            ],
            "user": {
                "first_name": "Paul",
                "last_name": "McCartney",
                "email": "a+employee3@jobcore.co",
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
                    "title": "Best Workers List",
                    "created_at": "2022-08-23T19:03:00.675062Z",
                    "updated_at": "2022-08-23T19:03:24.696114Z",
                    "auto_accept_employees_on_this_list": true,
                    "employer": 3,
                    "employees": [
                        3,
                        4,
                        6
                    ]
                }
            ]
        },
        "formData": {
            "employees": [
                3
            ],
            "shifts": [
                {
                    "value": {
                        "position": {
                            "title": "Kitchen Assistant",
                            "id": 2
                        },
                        "maximum_allowed_employees": 1,
                        "application_restriction": "ANYONE",
                        "minimum_hourly_rate": "8.0",
                        "starting_at": "2080-11-21T20:15:00.000Z",
                        "ending_at": "2080-11-21T22:15:00.000Z",
                        "employees": [],
                        "pending_invites": [],
                        "pending_jobcore_invites": [],
                        "candidates": [],
                        "allowed_from_list": [],
                        "allowedFavlists": [],
                        "allowedTalents": [],
                        "minimum_allowed_rating": "0",
                        "venue": {
                            "title": "6705 Red Road",
                            "id": 5,
                            "latitude": "25.706114",
                            "longitude": "-80.285187",
                            "street_address": "6705 Red Road, Coral Gables, FL, USA",
                            "zip_code": 33143
                        },
                        "status": "OPEN",
                        "id": 12,
                        "clockin": [],
                        "created_at": "2022-08-23T19:02:39.444105Z",
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
                    "label": ""
                }
            ]
        },
        "invites": [
            {
                "first_name": "",
                "last_name": "",
                "status": "PENDING",
                "created_at": "2022-08-23T19:53:51.498Z",
                "email": "",
                "phone_number": "",
                "employees": [
                    3
                ],
                "shifts": [
                    12
                ],
                "sender": 10,
                "employer": 3,
                "id": 6,
                "shift": {
                    "maximum_allowed_employees": "1",
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8",
                    "starting_at": "2022-08-23T20:00:51.499Z",
                    "ending_at": "2022-08-23T22:00:51.499Z",
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
    "formData": {},
    "history": {
        "length": 6,
        "action": "PUSH",
        "location": {
            "pathname": "/talents",
            "search": "",
            "hash": "",
            "key": "o6zaap"
        }
    }
}

export const shiftInviteDataMock = {
    "employees": [
        3
    ],
    "shifts": [
        {
            "value": {
                "position": {
                    "title": "Kitchen Assistant",
                    "id": 2
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-11-21T20:15:00.000Z",
                "ending_at": "2080-11-21T22:15:00.000Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "6705 Red Road",
                    "id": 5,
                    "latitude": "25.706114",
                    "longitude": "-80.285187",
                    "street_address": "6705 Red Road, Coral Gables, FL, USA",
                    "zip_code": 33143
                },
                "status": "OPEN",
                "id": 12,
                "clockin": [],
                "created_at": "2022-08-23T19:02:39.444105Z",
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
            "label": ""
        }
    ]
}

export const filterTalentsPropsMock = {
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
        "shifts": [
            {
                "position": {
                    "title": "Executive Chef",
                    "id": 4
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-12-20T20:15:00.000Z",
                "ending_at": "2080-12-20T22:15:00.000Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "3661 South Miami Avenue",
                    "id": 3,
                    "latitude": "25.740640",
                    "longitude": "-80.213021",
                    "street_address": "3661 South Miami Avenue, Miami, FL, USA",
                    "zip_code": 33133
                },
                "status": "OPEN",
                "id": 10,
                "clockin": [],
                "created_at": "2022-08-23T19:02:12.870581Z",
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
                    "title": "Kitchen Assistant",
                    "id": 2
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-11-21T20:15:00.000Z",
                "ending_at": "2080-11-21T22:15:00.000Z",
                "employees": [],
                "pending_invites": [],
                "pending_jobcore_invites": [],
                "candidates": [],
                "allowed_from_list": [],
                "allowedFavlists": [],
                "allowedTalents": [],
                "minimum_allowed_rating": "0",
                "venue": {
                    "title": "6705 Red Road",
                    "id": 5,
                    "latitude": "25.706114",
                    "longitude": "-80.285187",
                    "street_address": "6705 Red Road, Coral Gables, FL, USA",
                    "zip_code": 33143
                },
                "status": "OPEN",
                "id": 12,
                "clockin": [],
                "created_at": "2022-08-23T19:02:39.444105Z",
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
                    "title": "Floor Manager",
                    "id": 3
                },
                "maximum_allowed_employees": 1,
                "application_restriction": "ANYONE",
                "minimum_hourly_rate": "8.0",
                "starting_at": "2080-08-10T19:15:00.000Z",
                "ending_at": "2080-08-10T21:15:00.000Z",
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
                    "id": 4,
                    "latitude": "25.749483",
                    "longitude": "-80.303419",
                    "street_address": "2201 Ludlam Road, Miami, FL, USA",
                    "zip_code": 33155
                },
                "status": "OPEN",
                "id": 11,
                "clockin": [],
                "created_at": "2022-08-23T19:02:24.371128Z",
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
        "jcInvites": [
            {
                "id": 3,
                "sender": {
                    "id": 10,
                    "user": {
                        "first_name": "test",
                        "last_name": "test",
                        "email": "testemployer678@gmail.com"
                    },
                    "employer": {
                        "id": 3,
                        "title": "test",
                        "picture": "",
                        "website": "test",
                        "bio": "Cruises",
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
                        "created_at": "2022-08-23T19:00:35.658223Z",
                        "updated_at": "2022-08-23T19:00:35.658246Z",
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
                    "created_at": "2022-08-23T19:00:35.660438Z",
                    "updated_at": "2022-08-23T19:01:24.156249Z",
                    "employer_role": "ADMIN",
                    "status": "PENDING_EMAIL_VALIDATION",
                    "profile_city": null,
                    "other_employers": []
                },
                "first_name": "Mary",
                "last_name": "Jane",
                "email": "maryjane@gmail.com",
                "status": "PENDING",
                "phone_number": "000-000-0000",
                "employer_role": "",
                "created_at": "2022-08-23T19:04:10.223348Z",
                "updated_at": "2022-08-23T19:04:10.223369Z",
                "shift": null,
                "employer": null
            }
        ],
        "favlists": [
            {
                "label": "Best Workers List",
                "value": 3
            }
        ],
        "favoriteEmployees": [
            {
                "label": "Paul McCartney",
                "value": 3
            },
            {
                "label": "Frank Sinatra",
                "value": 4
            },
            {
                "label": "Hilary Clinton",
                "value": 6
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
        "formData": {
            "positions": [
                {
                    "label": "Server",
                    "value": 1
                }
            ],
            "badges": [],
            "first_name": "John",
            "last_name": "Lennon"
        },
        "invites": [
            {
                "first_name": "",
                "last_name": "",
                "status": "PENDING",
                "created_at": "2022-08-23T19:53:51.498Z",
                "email": "",
                "phone_number": "",
                "employees": [
                    3
                ],
                "shifts": [
                    12
                ],
                "sender": 10,
                "employer": 3,
                "id": 6,
                "shift": {
                    "maximum_allowed_employees": "1",
                    "application_restriction": "ANYONE",
                    "minimum_hourly_rate": "8",
                    "starting_at": "2022-08-23T20:00:51.499Z",
                    "ending_at": "2022-08-23T22:00:51.499Z",
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
        "positions": [
            {
                "label": "Server",
                "value": 1
            }
        ],
        "badges": [],
        "first_name": "John",
        "last_name": "Lennon"
    },
    "history": {
        "length": 7,
        "action": "POP",
        "location": {
            "pathname": "/talents",
            "search": "",
            "hash": ""
        }
    }
}