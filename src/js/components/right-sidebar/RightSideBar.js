import React, { useState } from "react";
import { SideBar, ButtonBar } from '../index';

const RightSideBar = ({ children, hidden, catalog }) => {

    const [sideBarLevels, setSideBarLevels] = useState([]);

    const closeRightBar = (level = 'last') => {
        level = level == 'all' ? 0 : level == 'last' ? sideBarLevels.length - 1 : parseInt(level, 10);
        // const lastLevel = this.state.sideBarLevels[this.state.sideBarLevels.length-1];
        // if(Array.isArray(lastLevel.watchers)) lastLevel.watchers.forEach((w) => w.unsubscribe());
        const newLevels = sideBarLevels.filter((e, i) => i < level);
        setSideBarLevels(newLevels);
    };

    return <div>
        <ButtonBar onClick={(option) => this.state.bar.show(option)} />
        <div>{children}</div>;
    {!hidden && <SideBar
            sideBarLevels={sideBarLevels}
            catalog={catalog}
            onClose={() => closeRightBar()}
            onBackdropClick={() => closeRightBar()}
        />
        }
    </div>;
};
export default RightSideBar;

export const bar = {
    show: (option) => {
        log.info("Right Bar Action: ", option.slug);
        switch (option.slug) {
            case 'create_shift':
                this.showRightBar(ShiftDetails, option, { formData: Shift(option.data).defaults() });
                break;
            case 'create_expired_shift':
                this.showRightBar(EditOrAddExpiredShift, option, { formData: Shift(option.data).defaults() });
                break;
            case 'filter_talent':
                this.showRightBar(FilterTalents, option, { formData: getTalentInitialFilters(this.state.catalog) });
                break;
            case 'filter_shift':
                this.showRightBar(FilterShifts, option, { formData: getShiftInitialFilters(this.state.catalog) });
                break;
            case 'filter_applications':
                this.showRightBar(FilterApplications, option, { formData: getApplicationsInitialFilters(this.state.catalog) });
                break;
            case 'show_shift_applications': {
                this.showRightBar(ShiftApplicants, option, {
                    applicants: option.data.candidates,
                    shift: option.data
                });
            } break;
            case 'show_shift_employees': {
                this.showRightBar(ShiftEmployees, option, { shift: option.data });
            } break;
            case 'show_single_applicant':
                this.showRightBar(ApplicationDetails, option, { applicant: option.data });
                break;
            case 'shift_details':
                fetchSingle('shifts', option.data.id);
                this.showRightBar(ShiftDetails, option, { formData: Shift(option.data).getFormData() });
                break;
            case 'review_shift_invites':
                searchMe('invites', '?shift=' + option.data.id).then((data) =>
                    this.showRightBar(ShiftInvites, option, {
                        formData: {
                            invites: data,
                            shift: option.data
                        }
                    })
                );
                break;
            case 'talent_shift_clockins':
                searchMe('clockins', '?shift=' + option.data.id).then((data) =>
                    this.showRightBar(ShiftInvites, option, {
                        formData: {
                            invites: data,
                            shift: option.data
                        }
                    })
                );
                break;
            case 'favlist_employees':
                option.title = "List Details";
                this.showRightBar(FavlistEmployees, option, { formData: Favlist(option.data).getFormData() });
                break;
            case 'invite_talent_to_shift':
                option.title = "Invite Talent";
                this.showRightBar(SearchShiftToInviteTalent, option, { formData: ShiftInvite(option.data).getFormData() });
                break;
            case 'search_talent_and_invite_to_shift':
                option.title = "Invite Talent";
                this.showRightBar(SearchTalentToInviteToShift, option, { formData: ShiftInvite(option.data).getFormData() });
                break;
            case 'invite_talent_to_jobcore':
                this.showRightBar(InviteTalentToJobcore, option);
                break;
            case 'show_pending_jobcore_invites':
                this.showRightBar(PendingJobcoreInvites, option);
                break;
            case 'show_single_talent':
                option.title = "Talent Details";
                this.showRightBar(TalentDetails, option, { employee: option.data });
                break;
            case 'add_to_favlist':
                option.title = "Add to favorite lists";
                console.log('favlist option',option.data);
                this.showRightBar(AddFavlistsToTalent, option, { formData: Talent(option.data).getFormData() });
                break;
            case 'create_favlist':
                option.title = "Create Favorite List";
                this.showRightBar(AddorUpdateFavlist, option, {formData: Favlist(option.data).getFormData()});
            break;
          case 'create_deduction':
            option.title = "Create Deduction";
            this.showRightBar(CreateDeduction, option, {formData: Deduction(option.data).getFormData()});
            break;
          case 'update_deduction':
            option.title = "Update Deduction";
            this.showRightBar(UpdateDeduction, option, {formData: Deduction(option.data).getFormData()});
            break;
            case 'update_favlist':
                option.title = "Update list";
                this.showRightBar(AddorUpdateFavlist, option, { formData: Favlist(option.data).getFormData() });
                break;
            case 'create_location':
                option.title = "Create New Venue";
                this.showRightBar(AddOrEditLocation, option, { formData: Location(option.data).getFormData() });
                break;
            case 'update_location':
                option.title = "Update Venue";
                this.showRightBar(AddOrEditLocation, option, { formData: Location(option.data).getFormData() });
                break;
            case 'add_talent_to_favlist':
                option.title = "Search for the talent";
                this.showRightBar(AddTalentToFavlist, option, { formData: Favlist(option.data).getFormData() });
                break;
            case 'show_single_rating':
                option.title = "Rating";
                fetchSingle('ratings', option.data.id)
                    .then(rating => this.showRightBar(RatingDetails, option, { formData: Rating(rating).getFormData() }));
                break;
            case 'review_talent':
                option.title = "Review Talent";
                this.showRightBar(ReviewTalent, option, { formData: option.data });
                break;
            case 'select_timesheet':
                searchMe('payroll-periods').then((periods) =>
                    this.showRightBar(SelectTimesheet, option, {
                        formData: {
                            periods: periods
                        }
                    })
                );
                break;
            case 'filter_timesheet':
                this.showRightBar(SelectTimesheet, option, { formData: option.data });
                break;
            default:
                if (typeof option.to == 'string') this.props.history.push(option.to);
                else log.error("Option slug not found: " + option.slug);
                break;
        }
    },
    close: () => this.closeRightBar()
};
