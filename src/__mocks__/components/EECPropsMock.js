const defineEmployee = jest.fn()
const onClick = jest.fn()

export const EECPropsMock = {
    "employee": {
        "id": 7,
        "user": {
            "first_name": "Martin",
            "last_name": "Luther King",
            "email": "a+martin@jobcore.co",
            "profile": {
                "picture": "",
                "bio": "",
                "phone_number": ""
            }
        },
        "favoritelist_set": [],
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
        "positions": [],
        "badges": []
    },
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
    "form": "",
    "formLoading": false,
    "hover": true,
    "hoverEffect": true,
    "showButtonsOnHover": true,
    "showFavlist": true, 
    "className": "",
    "defineEmployee": defineEmployee,
    "onClick": onClick
}