import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, update, remove, updateTalentList} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
import { Modal, ListCard, EmployeeExtendedCard, Button, Theme, Wizard} from '../components/index';
import Select from 'react-select';
import {Session} from 'bc-react-session';
import {GET} from '../utils/api_wrapper';

export const Favlist = (data) => {
    
    const _defaults = {
        title: '',
        employees: [],
        employer: Session.store.getSession().user.profile.employer,
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
export const AddFavlistsToTalent = ({onChange, formData, onSave, onCancel, catalog}) => (<Theme.Consumer>
    {({bar}) => (<form>
        <div className="row">
            <div className="col-12">
                <label>Pick your favorite lists:</label>
                <Select isMulti className="select-favlists"
                    value={formData.favoriteLists}
                    options={[{ label: "Add new favorite list", value: 'new_favlist', component: AddFavlist }].concat(catalog.favlists)}
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

export const FavlistEmployees = ({ formData, onChange, onSave, catalog }) => {
    const favlist = store.get('favlists', formData.id);
    return (<form>
        <Theme.Consumer>
            {({bar}) => (<span>
                <div className="row">
                    <div className="col-12">
                        <label>Talents:</label>
                        <ul>
                            {(!favlist) ? '':favlist.employees.map((em,i) => (
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
                </div>
                <div className="btn-bar">
                    <button type="button" className="btn btn-primary" onClick={() => 
                        bar.show({ slug: "update_favlist", data: formData, allowLevels: true })
                    }>Rename</button>
                    <button type="button" className="btn btn-secondary" onClick={() => 
                        bar.show({ slug: "add_talent_to_favlist", data: formData, allowLevels: true })
                    }>Add new talent</button>
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

export class AddTalentToFavlist extends React.Component {
    
    constructor(){
        super();
        this.state = {
            employees: [],
            loading: false,
            keyword: ''
        };
    }
    
    getTalentList(search){
        setTimeout(()=>{
            if(search == this.state.keyword)
                GET('employees?full_name='+search)
                    .then(employees => this.setState({employees, loading: false}));
        },700);
    }
    
    render(){
        return (<Theme.Consumer>
            {({bar}) => (<div>
                <div className="row">
                    <div className="col-12">
                        <input type="text" className="form-control" 
                            placeholder="Type employee name"
                            value={this.state.keyword} 
                            onChange={(e)=> {
                                const loading = (e.target.value.length > 3);
                                this.setState({ keyword: e.target.value, loading });
                                if(loading) this.getTalentList(e.target.value);
                            }}
                        />
                        {(this.state.loading) ? 
                            <p>Searching...</p>
                            :
                            (this.state.keyword.length < 3) ? <p>You have to type at least 4 caracters to search</p>:''
                        }
                    </div>
                </div>
                <ul className="mt-2">
                    {(!this.state.employees) ? 
                        <p>No talents match your search</p>
                        :
                        this.state.employees.map((em,i) => (
                            <EmployeeExtendedCard 
                                key={i} 
                                employee={em} 
                                hover={false} 
                                showFavlist={false}
                                onClick={() => bar.show({ slug: "show_single_talent", data: em, allowLevels: true })}
                            >
                                <Button className="mt-0" icon="plus" label="Add to list" onClick={() => {
                                    updateTalentList('add', em,this.props.formData.id);
                                }}/>
                            </EmployeeExtendedCard>))
                    }
                </ul>
            </div>)}
        </Theme.Consumer>);
    }
}
AddTalentToFavlist.propTypes = {
    onSave: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    catalog: PropTypes.object //contains the data needed for the form to load
};