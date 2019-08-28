import {Button} from '../components/index';
import React  from "react";

const engine = {
    modes: {
        LIVE: 'live',
        POSPONED: 'posponed'
    },
    total: 0,
    changes: {
        shifts: {}
    },
    isValid: function(action){
        if(typeof this.changes[action.entity] == "undefined") return false;

        return true;
    },
    get: function(entity, id){
        if(typeof this.changes[entity] == "undefined") return null;
        else return this.changes[entity][id];
    },
    add: function(action){
        const { entity, method, id, data } = action;
        if(!this.isValid(action)){
            throw new Error(`Invalid posponed action ${method} for ${entity}`);
        }

        if(typeof this.changes[entity][id] === "undefined")  this.changes[entity][id] = data;
        else this.changes[entity][id] = Object.assign(this.changes[entity][id], data);

        this.total = 0;
        for(let key in this.changes) this.total++;
    }
};

const WEngine = React.createContext(engine);
export const EngineProducer = (propers) => <WEngine.Provider value={engine}>{propers.children}</WEngine.Provider>;


const styles = {
    position: "fixed",
    bottom: 0,
    left: 0
};
export const EngineComponent = () => {
    const value = React.useContext(WEngine);
    return value.total && <div className="write-engine">
        <span className="mr-2">You have changes to {value.total} changes without saving</span>
        <Button color="primary">Apply Changes</Button>
    </div>;
};

export default engine;