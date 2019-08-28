import {Button} from '../components/index';
import EventEmitter from 'events';
import React, { useState }  from "react";
import {POST, GET, PUT, DELETE, PUTFiles} from './api_wrapper';

class MyEmitter extends EventEmitter {}
const _emitter = new MyEmitter();
const engine = {
    modes: {
        LIVE: 'live',
        POSPONED: 'posponed'
    },
    total: 0,
    defaults: {
        shifts: {}
    },
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
        _emitter.emit('changes');
    },
    commit: function(){

        POST('employers/me/batch', { changes: this.changes })
            .then((data) => {
                console.log("The commit was a success!!");
                this.changes = Object.assign({}, this.defaults);
                this.total = 0;
                _emitter.emit('changes');
            })
            .catch(err => {
                console.error(err);
                throw new Error(err);
            });
    }
};


const styles = {
    position: "fixed",
    bottom: 0,
    left: 0
};
export const EngineComponent = () => {

    const [,refresh] = React.useState(null);
    React.useEffect(() => {
        _emitter.on('changes', () => {
            refresh(engine.changes);
            console.log("pupupupupupupu");
        });
    },[]);
    return engine.total && <div className="write-engine">
        <span className="mr-2">You have changes to {engine.total} changes without saving</span>
        <Button onClick={() => engine.commit()} color="primary">Apply Changes</Button>
    </div>;
};

export default engine;