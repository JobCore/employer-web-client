import React from 'react';
import { useState } from "react";
import { ToggleButtonGroup, ToggleButton, render} from "react";



export function ToggleButtonGroupControlled() {
    const [value, setValue] = useState([1, 3]);
  
    const handleChange = (val) => {
      // setValue(val);
      console.log("value###", val)
    }
    return (
      <div type="checkbox" className="btn-group btn-group-toggle m-3" data-toggle="buttons" onChange={handleChange}>
      {/* <div  className=" m-3"> */}
      <div className="btn-group" role="group" >
        <button  id="b1" type="button" className="btn btn-secondary rounded-left" value={1}>Incoming</button>
        <button  id="b2" type="button" className="btn btn-secondary" value={2}>Verify</button>
        <button  onClick={console.log("presionaste el 3")} id="b3" type="button" className="btn btn-secondary rounded-right" value={3}>Unverify</button>
      </div>
      </div>
    //   <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
    //   <ToggleButton id="tbg-btn-1" value={1}>
    //     Option 1
    //   </ToggleButton>
    //   <ToggleButton id="tbg-btn-2" value={2}>
    //     Option 2
    //   </ToggleButton>
    //   <ToggleButton id="tbg-btn-3" value={3}>
    //     Option 3
    //   </ToggleButton>
    // </ToggleButtonGroup>


    
    );
  }
  
  // render(<ToggleButtonGroupControlled />);