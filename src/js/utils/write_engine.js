import {Button} from '../components/index';
import React  from "react";

const engine = {
    modes: {
        LIVE: 'live',
        POSPONED: 'posponed'
    },
    isValid: (actionName)=>{
        const possibleActions = [/PUTemployers\/me\/shifts\/(\d+)/gm];
        for(let i =0; i<possibleActions.length;i++){
            if(possibleActions[i].exec(actionName)) return true;
        }
        return false;

    },
    changes: [],
    add: function(action){
        console.log("New change", action);
        if(!this.isValid(action.method+action.path)){
            throw new Error(`Invalid action ${action.method+action.path}`);
        }
        this.changes.push(action);
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
    return value.changes.length && <div className="write-engine">
        <span className="mr-2">You have changes to {value.changes.length} shifts without saving</span>
        <Button color="primary">Apply Changes to Shifts</Button>
    </div>;
};

export default engine;