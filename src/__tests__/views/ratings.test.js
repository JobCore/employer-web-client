// /**
//  * We need sample data to mock first, and I cannot print it
//  */
// import React from 'react';
// import '@testing-library/jest-dom';
// import { render } from '@testing-library/react';
// import { render as EnzymeRender } from 'enzyme';
// import { Rating, getRatingtInitialFilters, RatingDetails, UnratingEmployees, RatingEmployees, PendingRatings, ReviewTalentAndShift, ReviewTalent } from '../../js/views/ratings';

// const onCancel = jest.fn()
// const onSave = jest.fn()
// const onChange = jest.fn()

// describe("Testing functions of the 'Rating' view", () => {

//     test("Testing 'getRatingtInitialFilters' function", () => {
//         expect(getRatingtInitialFilters({})).toHaveProperty("badges")
//     })

//     test("Testing 'Rating' function", () => {
//         expect(Rating(ratingDataMock).defaults()).toMatchObject(ratingDataMock);
//     })

//     test("Testing 'RatingDetails' function", () => {
//         render(
//             <RatingDetails bar={{}} catalog={RatingDetailsPropsMock.catalog} />
//         )
//         expect(RatingDetails).toHaveLength(1)
//     })

//     test("Testing 'PendingRatings' function", () => {
//         render(
//             <PendingRatings bar={{}} catalog={PendingRatingsPropsMock.catalog} />
//         )
//         expect(PendingRatings).toHaveLength(1)
//     })

//     test("Testing 'ReviewTalentAndShift' function", () => {
//         render(
//             <ReviewTalentAndShift bar={{}} catalog={ReviewTalentAndShiftPropsMock.catalog} />
//         )
//         expect(ReviewTalentAndShift).toHaveLength(1)
//     })

//     test("Testing 'RatingEmployees' function", () => {
//         render(
//             <RatingEmployees
//                 bar={{}}
//                 catalog={RatingEmployeesPropsMock.catalog}
//                 context={RatingEmployeesPropsMock.context}
//                 formData={RatingEmployeesPropsMock.formData}
//                 onCancel={onCancel}
//                 onSave={onSave}
//             />
//         )
//         expect(RatingEmployees).toHaveLength(1)
//     })

//     test("Testing 'UnratingEmployees' function", () => {
//         render(
//             <UnratingEmployees
//                 bar={{}}
//                 catalog={UnratingEmployeesPropsMock.catalog}
//                 context={UnratingEmployeesPropsMock.context}
//                 formData={UnratingEmployeesPropsMock.formData}
//                 onCancel={onCancel}
//                 onSave={onSave}
//             />
//         )
//         expect(UnratingEmployees).toHaveLength(1)
//     })

//     test("Testing 'ReviewTalent' function", () => {
//         render(
//             <ReviewTalent
//                 bar={{}}
//                 catalog={ReviewTalentPropsMock.catalog}
//                 formData={ReviewTalentPropsMock.formData}
//                 onCancel={onCancel}
//                 onSave={onSave}
//                 onChange={onChange}
//             />
//         )
//         expect(ReviewTalent).toHaveLength(1)
//     })
// })