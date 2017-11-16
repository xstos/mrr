import React from 'react';

// if polyfill used
const isPromise = a => a instanceof Object && a.toString && a.toString().indexOf('Promise') !== -1;

const cell_types = ['funnel', 'closure', 'nested', 'async'];


export default class Mrr extends React.Component {
    constructor(props, context) {
        super(props, context);
		this.__mrrInternal = {
			closureFuncs: {},
		};
		this.__mrrConstructing = true;
		this.__mrrChildren = {};
		this.__mrrLinksNeeded = {};
		this.__real_computed = Object.assign({}, this.computed);
		this.__mrrAnonCells = 0;
		this.__mrrThunks = {};
		this.parseMrr();
		this.childrenCounter = 0;
		if(this.props.mrrConnect){
			this.props.mrrConnect.subscribe(this);
		}
		this.setState({$start: true});
		this.__mrrConstructing = false;
    }
	get __mrrMacros(){
		return { 
			map: ([map]) => {
				var res = ['funnel', (cell, val) => {
					return map[cell] instanceof Function ? map[cell](val) : map[cell];
				}];
				for(let cell in map){
					res.push(cell);
				}
				return res;
			},
			mapPrev: ([map]) => {
				var res = ['closure.funnel', (prev) => {
					return (cell, val) => {
						prev = map[cell] instanceof Function ? map[cell](prev, val) : map[cell];
						return prev;
					}
				}];
				for(let cell in map){
					res.push(cell);
				}
				return res;
			},
			join: ([...fields]) => ['funnel', (cell, val) => val, ...fields],
			'&&': ([a, b]) => {
				return [(a, b) => (a && b), a, b];
			}
		}
	}
	parseRow(row, key, depMap){
		if(key === "$log") return;
		for(let k in row){
			var cell = row[k];
			if(k === '0') {
				if(!(cell instanceof Function) && (!cell.indexOf ||  (cell.indexOf('.') === -1) && (cell_types.indexOf(cell) === -1))){
					// it's macro
					if(!this.__mrrMacros[cell]){
						throw new Error('Macros ' + cell + ' not found!');
					}
					var new_row = this.__mrrMacros[cell](row.slice(1));
					this.__real_computed[key] = new_row;
					this.parseRow(new_row, key, depMap);
					return;
				} 
				continue;
			}
			if(cell instanceof Function) continue;
			if(cell instanceof Array) {
				// anon cell
				const anonName = '@@anon' + (++this.__mrrAnonCells);
				this.__real_computed[anonName] = cell;
				this.__real_computed[key][k] = anonName;
				this.parseRow(cell, anonName, depMap);
				cell = anonName;
			}
			if(cell.indexOf('/') !== -1){
				const [from, parent_cell] = cell.split('/');
				if(!this.__mrrLinksNeeded[from]){
					this.__mrrLinksNeeded[from] = {};
				}
				if(!this.__mrrLinksNeeded[from][parent_cell]){
					this.__mrrLinksNeeded[from][parent_cell] = [];
				}
				if(this.__mrrLinksNeeded[from][parent_cell].indexOf(cell) === -1){
					this.__mrrLinksNeeded[from][parent_cell].push(cell);
				}
			}
			if(cell === '^'){
				// prev val of cell
				continue;
			}
			if(cell[0] === '-'){
				// prev val of cell
				continue;
			}
			if(cell === '^') continue;
			if(!depMap[cell]){
				depMap[cell] = [];
			}
			depMap[cell].push(key);
		}
	}
	parseMrr(){
		const depMap = {};
		const mrr = this.__real_computed;
		const initial_compute = [];
		this.mrrState = Object.assign({}, this.state);
		const updateOnInit = {};
		for(let key in mrr){
			if(key === '$init'){
				for(let cell in mrr[key]){
					this.__mrrSetState(cell, mrr[key][cell]);
					updateOnInit[cell] = mrr[key][cell];
					initial_compute.push(cell);
				}
				continue;
			}
			let fexpr = mrr[key];
			if(!(fexpr instanceof Array)){
				if(typeof fexpr === 'string'){
					// another cell
					fexpr = [a => a, fexpr];
					this.__real_computed[key] = fexpr;
				} else {
					// dunno
					console.warn('Strange F-expr:', fexpr);
					continue;
				}
			}
			this.parseRow(fexpr, key, depMap);
		}
		this.initialState = updateOnInit;
		this.mrrDepMap = depMap;
		for(let cell1 of initial_compute){
			this.checkMrrCellUpdate(cell1, updateOnInit);
		}
		//console.log('parsed depMap', this.mrrDepMap);
	}
	setStateFromEvent(key, e){
		var val;
		switch(e.target.type){
			case 'checkbox':
				val = e.target.checked;
			break;
			default:
				val = e.target.value;
			break;
		}
		this.setState({[key]: val});
	}
	toStateAs(key, val){
		this.setState({[key]: val});
	}
	mrrConnect(as){
		const self = this;
		if(!as){
			as = '__rand_child_name_' + (++this.childrenCounter);
		}
		return {
			subscribe: (child) => {
				this.__mrrChildren[as] = child;
				child.__mrrParent = self;
				child.__mrrLinkedAs = as;
			}
		}
	}
	toState(key, val){
		if(val === undefined && this.__mrrThunks[key]){
			//console.log('=== skip');
			return this.__mrrThunks[key];
		} else {
			//console.log('=== generate');
			const func = (a) => {
				let value;
				if(val !== undefined){
					if(val instanceof Function){
						value = val(a);
					} else {
						value = val;
					}
				} else {
					if(a && a.target && (a.target instanceof Node)){
						if(a.target.type === 'checkbox'){
							value = a.target.checked;
						} else {
							value = a.target.value;
						}
					} else {
						value = a;
					}
				}
				if(key instanceof Array){
					const ns = {};
					key.forEach(k => {
						ns[k] = value;
					})
					this.setState(ns);
				} else {
					this.setState({[key]: value});
				}
			}
			if(val === undefined){
				this.__mrrThunks[key] = func;
			}
			return func;
		}
	}
	__getCellArgs(cell){
		const res = this.__real_computed[cell].slice(this.__real_computed[cell][0] instanceof Function ? 1 : 2).map((arg_cell => {
			if(arg_cell === '^'){
				//console.log('looking for prev val of', cell, this.mrrState, this.state);
				return this.mrrState[cell];
			} else {
				if(arg_cell[0] === '-'){
					arg_cell = arg_cell.slice(1);
				}
				return (this.mrrState[arg_cell] === undefined && this.state) 
					? (	this.__rirrfpConstructing 
							? this.initialState[arg_cell] 
							: this.state[arg_cell]
						)  
					: this.mrrState[arg_cell] 
			}
		}));
		return res;
	}
	__mrrUpdateCell(cell, parent_cell, update){
		var val, func, args, types;
		const fexpr = this.__real_computed[cell];
		if(typeof fexpr[0] === 'string'){
			types = fexpr[0].split('.');
		}
		if(fexpr[0] instanceof Function){
			func = this.__real_computed[cell][0];
			args = this.__getCellArgs(cell);
			
			val = func.apply(null, args);
		} else {
			if(types.indexOf('funnel') !== -1){
				args = [parent_cell, this.mrrState[parent_cell]];
			} else {
				args = this.__getCellArgs(cell);
			}
			if(types.indexOf('nested') !== -1){
				args.unshift((subcell, val) => {
					const subcellname = cell + '.' + subcell;
					this.__mrrSetState(subcellname, val);
					const update = {};
					update[subcellname] = val;
					this.checkMrrCellUpdate(subcellname, update);
					React.Component.prototype.setState.call(this, update);
				})
			} 
			if(types.indexOf('async') !== -1){
				args.unshift((val) => {
					this.__mrrSetState(cell, val);
					const update = {};
					update[cell] = val;
					this.checkMrrCellUpdate(cell, update);
					React.Component.prototype.setState.call(this, update);
				})
			} 
			if(types.indexOf('closure') !== -1){
				if(!this.__mrrInternal.closureFuncs[cell]){
					const init_val = this.__real_computed.$init ? this.__real_computed.$init[cell] : null;
					this.__mrrInternal.closureFuncs[cell] = fexpr[1](init_val);
				}
				func = this.__mrrInternal.closureFuncs[cell];
			} else {
				func = this.__real_computed[cell][1];
			}
			if(!func || !func.apply) debugger;
			val = func.apply(null, args);
		}
		if(types && ((types.indexOf('nested') !== -1) || (types.indexOf('async') !== -1))){
			// do nothing!
			return;
		}
		if(isPromise(val)){
			val.then(val => {
				this.__mrrSetState(cell, val);
				const update = {};
				update[cell] = val;
				this.checkMrrCellUpdate(cell, update);
				React.Component.prototype.setState.call(this, update);
			})
		} else {
			update[cell] = val;
			this.__mrrSetState(cell, val);
			this.checkMrrCellUpdate(cell, update);
		}
	}
	checkMrrCellUpdate(parent_cell, update){
		if(this.mrrDepMap[parent_cell]){
			for(let cell of this.mrrDepMap[parent_cell]){
				this.__mrrUpdateCell(cell, parent_cell, update);
			}
		}
	}
	__mrrSetState(key, val){
		if(this.__real_computed.$log || 0) console.log('%c ' + key + ' ', 'background: #898cec; color: white; padding: 1px;', val);
		for(let as in this.__mrrChildren){
			if(this.__mrrChildren[as].__mrrLinksNeeded['..'] && this.__mrrChildren[as].__mrrLinksNeeded['..'][key]){
				const his_cells = this.__mrrChildren[as].__mrrLinksNeeded['..'][key];
				for(let cell of his_cells){
					this.__mrrChildren[as].setState({[cell]: val});
				}
			}
		}
		let as  = this.__mrrLinkedAs;
		if(this.__mrrParent && this.__mrrParent.__mrrLinksNeeded[as] && this.__mrrParent.__mrrLinksNeeded[as][key]){
			const his_cells = this.__mrrParent.__mrrLinksNeeded[as][key];
			for(let cell of his_cells){
				this.__mrrParent.setState({[cell]: val});
			}
		}
		this.mrrState[key] = val;
	}
	setState(ns){
		const update = Object.assign({}, ns);
		for(let cell in update){
			this.__mrrSetState(cell, update[cell]);
		}
		for(let parent_cell in update){
			this.checkMrrCellUpdate(parent_cell, update);
		}
		if(!this.__mrrConstructing){
			return React.Component.prototype.setState.call(this, update);
		} else {
			for(let cell in update){
				this.initialState[cell] = update[cell];
			}
		}
	}
		
}