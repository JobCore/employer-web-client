import React from 'react';
import { render } from '@testing-library/react';
import { Favlist, AddFavlistsToTalent, AddorUpdateFavlist, ManagePayrates, FavlistEmployees } from '../../js/views/favorites';
import { AFLTTcatalogMock, AFLTTformDataMock, AOUFLformDataMock, favlistDataMock, favlistEmployeesCatalogMock, favlistEmployeesFormDataMock, favlistMock } from "../../__mocks__/views/favoritesPropsMock";
import { Session } from "bc-react-session";
import { userMock } from '../../__mocks__/views/userMock';

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()

describe("Testing functions of the 'Favorites' view", () => {

    beforeEach(() => {
        Session.start({
            payload: userMock
        });
    })

    afterEach(() => {
        Session.destroy();
    })

    test("Testing 'FavList' function", () => {
        expect(Favlist(favlistDataMock).defaults()).toMatchObject(favlistDataMock)
    })

    test("Testing 'AddFavlistsToTalent' function", () => {
        render(
            <AddFavlistsToTalent
                bar={{}}
                onCancel={onCancel}
                onSave={onSave}
                onChange={onChange}
                catalog={AFLTTcatalogMock}
                formData={AFLTTformDataMock}
            />)
        expect(AddFavlistsToTalent).toHaveLength(1)
    })

    test("Testing 'AddorUpdateFavlist' function", () => {
        render(
            <AddorUpdateFavlist
                onCancel={onCancel}
                onSave={onSave}
                onChange={onChange}
                formData={AOUFLformDataMock}
            />)
        expect(AddorUpdateFavlist).toHaveLength(1)
    })

    //Requires test store
    // describe("Tests that require a store", () => {

    //     beforeEach(() => {
    //         testStore.getState("favlists");
    //     })

    //     test("Testing 'FavlistEmployees' function", () => {

    //         render(
    //             <FavlistEmployees
    //                 store={favlistMock}
    //                 bar={{}}
    //                 onCancel={onCancel}
    //                 onSave={onSave}
    //                 onChange={onChange}
    //                 formData={favlistEmployeesFormDataMock}
    //                 catalog={favlistEmployeesCatalogMock}
    //             />)
    //         expect(FavlistEmployees).toHaveLength(1)
    //     })
    // })
})