import React from 'react';
import { expect, assert } from 'chai';
import { shallow, configure, mount } from 'enzyme';
import { describe, it } from 'mocha';
import Adapter from 'enzyme-adapter-react-16';

import a from './setup';

import LoginForm from './testComponents/LoginForm';
import TimerWrapper from './testComponents/TimerWrapper';
import InputForm from './testComponents/InputForm';
import Merge from './testComponents/Merge';
import Split from './testComponents/Split';
import SkipN from './testComponents/SkipN';
import Init from './testComponents/Init';
import TestGG, { GG } from './testComponents/TestGG';

import { CardForm } from './testComponents/CardForm';
import Form1 from './testComponents/Form1';
import CascadeForm from './testComponents/CascadeForm';

import UndescribedCellError from './testComponents/UndescribedCellError';
import WrongStreamError from './testComponents/WrongStreamError';

configure({ adapter: new Adapter() });

const wait = ms => resolve => {
  setTimeout(resolve, ms);
};
const wwait = ms => () => {
  return new Promise(wait(ms));
};

describe('Form validation', () => {
  const wrapper = mount(<LoginForm />);
  it('Should validate', () => {
    wrapper.find('.submitButton').simulate('click');
    expect(wrapper.find('.error')).to.have.length(2);
    //console.log('_______________________');
  });
  it('Should validate 2', () => {
    wrapper.find('.chb').simulate('change', { target: { checked: true, type: 'checkbox' } });
    expect(wrapper.find('.error')).to.have.length(0);
  });
  it('Should validate 3', () => {
    wrapper.find('.submitButton').simulate('click');
    expect(wrapper.find('.error')).to.have.length(1);
    //console.log('_______________________');
  });
});

describe('Some input form', () => {
  const wrapper = mount(<InputForm />);
  it('Should show error on empty input', (done) => {

    wrapper.find('.submit').simulate('click');
    expect(wrapper.find('.error')).to.have.length(1);


    wrapper.find('.input-value')
      .simulate('change',  {target: {type: 'text', value: '12345'}});

    new Promise(wait(0))
    .then(() => {
      wrapper.find('.submit').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert(state['submission.success'], undefined);
        assert(state['apiRequest.error'], 'Wrong number!');

        wrapper.find('.input-value')
          .simulate('change',  {target: {type: 'text', value: '123456'}});
        wrapper.find('.submit').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        //console.log('ST', state);
        assert(state['submission.success'], '123456');
        done();
    }).catch(e => {
      console.log("E", e);
    });
    //expect(wrapper.find('.error')).to.have.length(0);

  });
});

describe('Ticks', () => {
  it('Test timer', (done) => {
    let c = 0;
    let d = 0;
    const onTimerMount = () => {
      ++c;
    };
    const onTimerUnmount = () => {
      ++d;
    };
    const props = {
      onTimerMount,
      onTimerUnmount,
    };
    mount(<TimerWrapper { ...props } />);
    setTimeout(() => {
      expect(c).to.equal(2);
      expect(d).to.equal(2);
      done();
    }, 1900);
  });
});


describe('Mrr Forms', () => {
  it('Test validation', (done) => {
    const getStateObj_1 = {};
    const getStateObj_2 = {};
    const wrapper = mount(<CardForm dbg1={ getStateObj_1 } dbg2={ getStateObj_2 } />);


    new Promise(wait(0))
    .then(() => {
        wrapper.find('.submit').simulate('click');
    })
    .then(wwait(200))
    .then(() => {
        const disabled = wrapper.find('.submit').prop('disabled');
        expect(disabled).to.equal(true);
    })
    .then(wwait(800))
    .then(() => {
        expect(getStateObj_1.getState().controlsDisabled).to.equal(false);
        expect(getStateObj_2.getState().currentError).to.equal('Please enter card number');
        done();
    })
    .catch(e => {
        console.log("Error:", e);
    });
  });
  it('Test CascadeForm', done => {
    const wrapper = mount(<CascadeForm/>);
    new Promise(wait(0))
    .then(() => {
        expect(wrapper.find('select').length).to.equal(2);
        wrapper.find('select').first().simulate('change', {target: {value: '', type: 'select'}});
    })
    .then(wwait(300))
    .then(() => {
        expect(wrapper.find('select').length).to.equal(1);
        wrapper.find('select').first().simulate('change', {target: {value: 'Ukraine', type: 'select'}});
    })
    .then(wwait(300))
    .then(() => {
        expect(wrapper.find('select').length).to.equal(2);
        wrapper.find('select').at(1).simulate('change', {target: {value: 'Kyiv', type: 'select'}});
    })
    .then(wwait(300))
    .then(() => {
        expect(wrapper.find('select').length).to.equal(3);
        wrapper.find('select').first().simulate('change', {target: {value: '', type: 'select'}});
    })
    .then(wwait(300))
    .then(() => {
        expect(wrapper.find('select').length).to.equal(1);
        done();
    })
  });
  it('Test Form1', done => {
    const initVals = {
      "name": "Myk",
      "cities": [
        {
          "state": "UA",
          "city": "Konst"
        },
        {
          "state": "UA",
          "city": "Kyiv"
        },
        {
          "state": "GE",
          "city": "Atlanta"
        },
      ]
    }
    const wrapper = mount(<Form1 defaultValue={ initVals }/>);

    new Promise(wait(0))
    .then(() => {
        wrapper.find('.my-submit').simulate('click');
    })
    .then(wwait(200))
    .then(() => {
        expect(wrapper.find('.error').first().html()).to.equal('<div class="error">Empty</div>');
        //console.log('Html', wrapper.html());
        done();
        return;
    })
//    .then(wwait(600))
//    .then(() => {
//        const disabled = wrapper.find('.submit').prop('disabled');
//        assert(disabled, false);
//        done();
//    })
    .catch(e => {
        console.log("Error:", e);
        done();
    });
  })
});

describe('Macros', () => {
  it('Test "merge" macro', (done) => {
    const wrapper = mount(<Merge />);
    const state = wrapper.state();
    assert(state.d, 20);

    new Promise(wait(0))
    .then(() => {
        wrapper.find('.input-a').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert(state.d, 42);


        wrapper.find('.input-c').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state.d, 0);
        done();
    }).catch(e => {
        console.log("E", e);
    });
  });
  
  
  it('Test "split" macro', (done) => {
    const wrapper = mount(<Split />);
    const state = wrapper.state();
    assert.strictEqual(state.a, 11);
    assert.strictEqual(state['a.c'], undefined);

    new Promise(wait(0))
    .then(() => {
        wrapper.find('.input-1').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state['a.c'], true);
        
        wrapper.find('.input-2').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state['a.d'], 10);
        done();
    }).catch(e => {
        console.log("E", e);
        done();
    });
  });
  it('Test "skipN" macro', (done) => {
    const wrapper = mount(<SkipN />);
    const state = wrapper.state();
    assert.strictEqual(state.b, 20);

    new Promise(wait(0))
    .then(() => {
        wrapper.find('.input-a').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state['b'], 20);
        
        wrapper.find('.input-a').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state['b'], 20);
        
        wrapper.find('.input-a').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state['b'], 20);
        
        wrapper.find('.input-a').simulate('click');
    })
    .then(wwait(10))
    .then(() => {
        const state = wrapper.state();
        assert.strictEqual(state['b'], 11);
        done();
        
    }).catch(e => {
        console.log("E", e);
        done();
    });
  });
  it('Test init execution', () => {
    const wrapper = mount(<Init />);
  });
});


describe('Testing global grid', () => {
  it('Test cells\' linking with $expose', () => {
    const component = mount(<TestGG />);
    
    assert.strictEqual(GG.mrrState['*/bar'], 10);
    assert.strictEqual(GG.mrrState['a'], 20);
    assert.strictEqual(GG.mrrState['*/baz'], undefined);
    assert.strictEqual(GG.mrrState['b'], undefined);
  });
});

describe('Testing readFromDOM', () => {
  it('Should throw an exception when linking to undescribed cell', () => {
    //const component = mount(<UndescribedCellError />);
    expect(() => { 
        const a = mount(<UndescribedCellError />); 
    }).to.throw(Error);
  });
  it('Should throw an exception for trying to set an undescribed stream', () => {
    //const component = mount(<UndescribedCellError />);
    expect(() => { 
        const a = mount(<WrongStreamError />); 
    }).to.throw(Error);
  });
});


/*

describe('', () => {
  it('', (done) => {
    const wrapper = mount(<TimerWrapper { ...props } />);

    expect(wrapper.find('div')).to.have.length(0);

    done();
  });
});

*/
