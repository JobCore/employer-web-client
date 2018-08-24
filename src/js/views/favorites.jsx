import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, update, remove, updateTalentList} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
import { Modal, ListCard, EmployeeExtendedCard, Button, Theme, Wizard} from '../components/index';
import Select from 'react-select';
import {Session} from 'bc-react-session';

export const Favlist = (data) => {
    
    const _defaults = {
        title: '',
        employees: [],
        employer: Session.store.getSession().user.profile.employer,
        serialize: function(filters=[]){
            
            const newEntity = {
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
                                    remove('favlists', list);
                            }}>
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
export const AddTalentToFavlist = (props) => {
    
    return (<form>
        <div className="row">
            <div className="col-12">
                <label>Pick your favorite lists:</label>
                <Select isMulti className="select-favlists"
                    value={props.formData.favoriteLists}
                    onChange={(selectedOption) => props.onChange({favoriteLists: selectedOption})} 
                    options={props.catalog.favlists}
                />
            </div>
        </div>
        <p>Click on invite add the talent to your favorite lists</p>
        <div className="btn-bar">
            <Button color="primary" onClick={() => props.onSave()}>Save</Button>
            <Button color="secondary" onClick={() => props.onCancel()}>Cancel</Button>
        </div>
    </form>);
};
AddTalentToFavlist.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

export const AddFavlist = ({ formData, onChange, onSave, onCancel }) => (<form>
    <input type="text" className="form-control" 
        placeholder="List name"
        value={formData.title} 
        onChange={(e)=> onChange({title: e.target.value})} 
    />
    <div className="btn-bar">
        <Button color="light" onClick={() => onCancel()}>Cancel</Button>
        <Button color="success" className="ml-2" onClick={() => onSave()}>
            Save
        </Button>
    </div>
</form>);
AddFavlist.propTypes = {
    onSave: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    catalog: PropTypes.object //contains the data needed for the form to load
};

export const FavlistEmployees = ({ formData, onChange, onSave }) => {
    return (<form>
        <Theme.Consumer>
            {({bar}) => (<span>
                <div className="row">
                    <div className="col-12">
                        <label>Talents:</label>
                        <ul>
                            {formData.employees.map((em,i) => (
                                <EmployeeExtendedCard 
                                    key={i} 
                                    employee={em} 
                                    hover={false} 
                                    showFavlist={false}
                                    onClick={() => bar.show({ slug: "show_single_talent", data: em, allowLevels: true })}
                                >
                                    <Button className="mt-0" icon="trash" label="Delete" onClick={() => {
                                        updateTalentList('delete', em.id,formData.id);
                                    }}/>
                                </EmployeeExtendedCard>)
                            )}
                        </ul>
                    </div>
                </div>
                <div className="btn-bar">
                    <button type="button" className="btn btn-primary" onClick={() => 
                        bar.show({ slug: "update_favlist", data: formData, allowLevels: true })
                    }>Rename</button>
                    <button type="button" className="btn btn-secondary" onClick={() => onSave()}>Add Talents</button>
                </div>
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