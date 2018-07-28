import React from 'react';
import Input from './Input';
import { withMrr, skip } from '../';
import Element from './Element';

const not = a => !a;
const incr = a => a + 1;
const always = a => _ => a;
const id = a => a;

const state = () => {
  let state = {};
  return (a) => {
    if(a instanceof Array){
      state = Object.assign({}, state);
      state[a[1]] = a[0];
    } else {
      state = Object.assign({}, state, a || {});
    }
    return state;
  };
};

const propOrSkip = (obj, key) => {
  if(obj){
    console.log("RET", obj, key);
    return obj[key];
  } else {
    console.log('SKIP', key);
    return skip;
  }
}

const renderFields = (state, props, $, connectAs) => {
  const fields = [];
  for(let as in props.fields){
      fields.push([as, props.fields[as]]);
  }

  return fields.map(([as, config]) => {
    const Comp = config.type instanceof Function ? config.type : Input;
    const elProps = Object.assign({ key: as }, config, connectAs(as));
    if(config.type instanceof Function){
      delete elProps.type;
      elProps.isChildForm = true;
    }
    if(!config.type){
      elProps.type = 'text';
    }
    return <Comp {...elProps}  />
  })
}

const findFirst = obj => {
  for(let v in obj){
    if(obj[v]) return v;
  }
  return false;
}

function isChecked(a){
  for(let k in a){
    if((a[k] === true) || ((a[k] instanceof Object) && isChecked(a[k]))){
      return true;
    }
  }
  return false;
}

const Form = withMrr(props => {
    const struct = {
        meta: {

        },
        val: ['skipSame', ['closure', state, ['join', '*/valWithName', 'initVal']]],
        valids: ['skipSame', ['closure', state, '*/validWithName']],
        focusedChildren: ['skipSame', ['closure', state, '*/focusedWithName']],
        focused: [findFirst, 'focusedChildren'],
        checkings: ['skipSame', ['closure', state, '*/beingCheckedWithName']],
        beingChecked: ['skipSame', [(a, status) => {
          //console.log('BC', a, status);
          if(status === 'checking'){
            return true;
          }
          return isChecked(a);
        }, 'checkings', 'status']],
        controlsDisabled: ['||', 'disabled', props.disableControlsWhenValidated ? 'somethingIsChecked' : skip],
        inputsDisabled: ['||', 'disabled', props.disableInputsWhenValidated ? 'somethingIsChecked' : skip],
    };
    return struct;
}, (state, props, $, connectAs) => {
  if(!props.fields){
    return <div>Please override me!</div>;
  }
  return ( <div className="form">
    { props.label && <div className="form-title">
      { props.label }
    </div> }
    <div className="form-fields">
    {
      renderFields(state, props, $, connectAs)
    }
    </div>
    { state.errorShown && <div className="form-errors">
      { state.currentError }
    </div> }
    { !props.isChildForm && <div className="form-controls">
        <button className="clear" onClick={ $('clear') } disabled={ state.controlsDisabled }>Clear</button>&nbsp;&nbsp;&nbsp;
        <button className="submit" onClick={ $('submit') } disabled={ state.controlsDisabled }>Submit</button>
    </div> }
  </div> );
}, Element);

export default Form;
