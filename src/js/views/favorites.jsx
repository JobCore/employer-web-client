import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, update, remove, updateTalentList} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
import { ListCard, EmployeeExtendedCard, Button, Theme, Wizard, SearchCatalogSelect} from '../components/index';
import Select from 'react-select';
import {Session} from 'bc-react-session';
import {Notify} from 'bc-react-notifier';
import {GET} from '../utils/api_wrapper';

export const Favlist = (data) => {

    const _defaults = {
        title: '',
        auto_accept_employees_on_this_list: true,
        employees: [],
        employer: Session.getPayload().user.profile.employer,
        serialize: function(filters=[]){

            const newEntity = {
                id: data.id,
                employees: _defaults.employees.map((emp) => emp.id || emp)
            };
            let response = Object.assign(this, newEntity);

            filters.forEach((property) => delete response[property]);
            return response;
        }
    };

    let _entity = Object.assign(_defaults, data);
    return {
        validate: () => {
            // if(!validator.isEmail(_entity.email)) throw new ValidationError('Please specify the email');
            // if(validator.isEmpty(_entity.first_name)) throw new ValidationError('Please specify the first name');
            // if(validator.isEmpty(_entity.last_name)) throw new ValidationError('Please specify the last name');
            return _entity;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            let _formShift = {
                id: _entity.id,
                title: _entity.title,
                auto_accept_employees_on_this_list: _entity.auto_accept_employees_on_this_list,
                employees: _entity.employees
            };
            return _formShift;
        },
        filters: () => {
            const _filters = {
                // positions: _entity.positions.map( item => item.value ),
            };
            return Object.assign(_entity, _filters);
        }
    };
};

export class ManageFavorites extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            lists: [],
            runTutorial: hasTutorial(),
            steps: [
                {
                    target: '#your-favorites-heading',
                    content: 'Here you can manage you favorite lists',
                    placement: 'right'
                }
                // {
                //     target: '#filter_applicants',
                //     content: 'You can also filter this list of applicants by any desired criteria',
                //     placement: 'left',
                // },
            ]
        };
    }

    componentDidMount(){

        const lists = store.getState('favlists');
        this.subscribe(store, 'favlists', (lists) => {
            this.setState({ lists });
        });
        this.setState({ lists: (lists) ? lists:[], runTutorial: true });
    }

    render() {
        return (<div className="p-1 listcontents">
            <Wizard continuous
              steps={this.state.steps}
              run={this.state.runTutorial}
              callback={callback}
            />
            <h1><span id="your-favorites-heading">Your favorite lists</span></h1>
            <Theme.Consumer>
                {({bar}) =>
                    (this.state.lists.length == 0) ?
                        <p>You have no favorite lists yet, <a href="#" className="text-primary" onClick={() => bar.show({ slug: "create_favlist" })}>click here</a> to create your first</p>
                    :
                    this.state.lists.map((list,i) => (
                        <ListCard key={i} list={list} onClick={() =>
                            bar.show({ slug: "favlist_employees", data: list, title: "List Details" })}
                        >
                            <button type="button" className="btn btn-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    bar.show({ slug: "update_favlist", data: list, title: "List Details" });
                            }}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button type="button" className="btn btn-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const noti = Notify.info("Are you sure?",(answer) => {
                                        if(answer) remove('favlists', list);
                                        noti.remove();
                                    });

                                }
                            }>
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </ListCard>
                    ))
                }
            </Theme.Consumer>
        </div>);
    }
}

/**
 * Add To Favorite List
 */
export const AddFavlistsToTalent = ({onChange, formData, onSave, onCancel, catalog}) => (<Theme.Consumer>
    {({bar}) => (<form>
        <div className="row">
            <div className="col-12">
                <label>Pick your favorite lists:</label>
                <Select isMulti className="select-favlists"
                    value={formData.favoriteLists}
                    options={[{ label: "Add new favorite list", value: 'new_favlist', component: AddorUpdateFavlist }].concat(catalog.favlists)}
                    onChange={(selection)=> {
                        const create = selection.find(opt => (opt.value == 'new_favlist'));
                        if(create) bar.show({ slug: "create_favlist", allowLevels: true });
                        else onChange({ favoriteLists: selection });
                    }}
                />
            </div>
        </div>
        <p>Click on invite add the talent to your favorite lists</p>
        <div className="btn-bar">
            <Button color="primary" onClick={() => onSave()}>Save</Button>
            <Button color="secondary" onClick={() => onCancel()}>Cancel</Button>
        </div>
    </form>)}
</Theme.Consumer>);

AddFavlistsToTalent.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

export const AddorUpdateFavlist = ({ formData, onChange, onSave, onCancel }) => (<form>
    <div className="row">
        <div className="col-12">
            <label>List name:</label>
            <input type="text" className="form-control"
                placeholder="List name"
                value={formData.title}
                onChange={(e)=> onChange({title: e.target.value})}
            />
        </div>
    </div>
    <div className="row mt-1">
        <div className="col-1 text-center">
            <input type="checkbox"
                placeholder="List name"
                checked={formData.auto_accept_employees_on_this_list}
                onChange={(e)=> onChange({ auto_accept_employees_on_this_list: e.target.checked})}
            />
        </div>
        <div className="col-11">
            Talents on this list do not require approval to join shifts
        </div>
    </div>
    <div className="btn-bar">
        <Button color="light" onClick={() => onCancel()}>Cancel</Button>
        <Button color="success" className="ml-2" onClick={() => onSave()}>
            Save
        </Button>
    </div>
</form>);
AddorUpdateFavlist.propTypes = {
    onSave: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    catalog: PropTypes.object //contains the data needed for the form to load
};

export const FavlistEmployees = ({ formData, onChange, onSave, catalog }) => {
    const favlist = store.get('favlists', formData.id);
    return (<form>
        <Theme.Consumer>
            {({bar}) => (<span>
                <div className="top-bar">
                    <button type="button" className="btn btn-primary btn-sm rounded" onClick={() =>
                            bar.show({ slug: "update_favlist", data: formData, allowLevels: true })
                        }><i className="fas fa-pencil-alt"></i></button>
                    <button type="button" className="btn btn-secondary btn-sm rounded" onClick={() => onChange({ _mode: 'add_talent' })}>
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label>Title:{' '}</label>
                        <span>{favlist.title}</span>
                    </div>
                </div>
                { (typeof formData._mode == 'undefined' || formData._mode == 'default') ?
                    <div className="row">
                        <div className="col-12">
                            <label>Talents: </label>
                            {(!favlist || favlist.employees.length == 0) ? <span>There are no talents in this list yet, <span className="anchor" onClick={() => onChange({ _mode: 'add_talent' })}>click here to add a new one</span></span>:'' }
                        </div>
                    </div>:''
                }
                { (typeof formData._mode != 'undefined' && formData._mode=='add_talent') ?
                    <div className="row mb-2">
                        <div className="col-12">
                            <label>Search for the talents you want to add</label>
                            <SearchCatalogSelect
                                isMulti={false}
                                onChange={(selection)=> {
                                    if(selection.value == 'invite_talent_to_jobcore') bar.show({
                                        allowLevels: true,
                                        slug: "invite_talent_to_jobcore"
                                    });
                                    else updateTalentList('add', selection.value, formData.id)
                                            .then(() => onChange({ _mode: 'default'  }))
                                            .catch((error) => alert(error));
                                }}
                                searchFunction={(search) => new Promise((resolve, reject) =>
                                    GET('catalog/employees?full_name='+search)
                                        .then(talents => resolve([
                                            { label: `${(talents.length==0) ? 'No one found: ':''}Invite "${search}" to JobCore?`, value: 'invite_talent_to_jobcore' }
                                        ].concat(talents)))
                                        .catch(error => reject(error))
                                )}
                            />
                        </div>
                    </div>:''
                }
                {(favlist && favlist.employees.length > 0) ?
                    <div className="row">
                        <div className="col-12">
                            <ul>
                                {favlist.employees.map((em,i) => (
                                    <EmployeeExtendedCard
                                        key={i}
                                        employee={em}
                                        hover={false}
                                        showFavlist={false}
                                        onClick={() => bar.show({ slug: "show_single_talent", data: em, allowLevels: true })}
                                    >
                                        <Button className="mt-0" icon="trash" label="Delete" onClick={() => {
                                            updateTalentList('delete', em.id,formData.id);
                                            //.then(() => onChange);
                                        }}/>
                                    </EmployeeExtendedCard>)
                                )}
                            </ul>
                        </div>
                    </div>:''
                }
            </span>)}
        </Theme.Consumer>
    </form>);
};
FavlistEmployees.propTypes = {
    onSave: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    catalog: PropTypes.object //contains the data needed for the form to load
};