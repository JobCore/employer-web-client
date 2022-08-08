import React from 'react';
import { ReactDOM } from 'react-dom';

// const Shift = require('./shifts.js');

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
const Shift = require('./shifts.js');
// import {Shift} from "./shifts.js";
jest.mock('./shifts.js');
const mockFn = jest.fn();
const mockMethod = jest.fn();
const a = new mockFn();

Shift.withStatus(() => {
    return {
      method: mockMethod,
    };
  });
const some = new Shift();
some.method('a', 'b');
console.log('Calls to method: ', mockMethod.mock.calls);
test('Creating a shift with: no recurrent, single date, anyone', () => {
    expect(Shift({
        allowedFavlists: [],
        allowedTalents: [],
        allowed_from_list: [],
        application_restriction: "ANYONE",
        candidates: [],
        description: "N/A",
        employees: [],
        employer: 56,
        ending_at: "2022-06-29T20:15:47.883Z",
        has_sensitive_updates: true,
        maximum_allowed_employees: "1",
        minimum_allowed_rating: "0",
        minimum_hourly_rate: "8",
        pending_invites: [],
        pending_jobcore_invites: [],
        position: "3",
        starting_at: "2022-06-29T18:15:47.883Z",
        status: "OPEN",
        venue: "12"
    }).defaults()).toBe([{
        "allowedFavlists": [], 
        "allowedTalents": [], 
        "allowed_from_list": [], 
        "application_restriction": "ANYONE", 
        "candidates": [], 
        "description": "N/A", 
        "employees": [], 
        "employer": 56, 
        "ending_at": "2022-06-29T20:15:47.883Z", 
        "has_sensitive_updates": true, 
        "maximum_allowed_employees": "1", 
        "minimum_allowed_rating": "0", 
        "minimum_hourly_rate": "8", 
        "pending_invites": [], 
        "pending_jobcore_invites": [],
        "position": "3", 
        "serialize": a, 
        "starting_at": "2022-06-29T18:15:47.883Z", 
        "status": "OPEN", 
        "unserialize": a, 
        "venue": "12", 
        "withStatus": a
    }])
})