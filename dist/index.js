'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createMrrApp = exports.withMrr = exports.isOfType = exports.shallow_equal = exports.registerMacros = exports.skip = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _defMacros = require('./defMacros');

var _defMacros2 = _interopRequireDefault(_defMacros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// if polyfill used
var isPromise = function isPromise(a) {
    return a instanceof Object && a.toString && a.toString().indexOf('Promise') !== -1;
};

var cell_types = ['funnel', 'closure', 'nested', 'async'];
var global_macros = {};

var log_styles_cell = 'background: #898cec; color: white; padding: 1px;';
var log_styles_mount = 'background: green; color: white; padding: 1px;';

var skip = exports.skip = new function MrrSkip() {}();

var registerMacros = exports.registerMacros = function registerMacros(name, func) {
    global_macros[name] = func;
};

var isUndef = function isUndef(a) {
    return a === null || a === undefined;
};

var shallow_equal = exports.shallow_equal = function shallow_equal(a, b) {
    if (a instanceof Object) {
        if (!b) return false;
        if (a instanceof Function) {
            return a.toString() === b.toString();
        }
        for (var k in a) {
            if (!a.hasOwnProperty(k)) {
                continue;
            }
            if (a[k] !== b[k]) {
                return false;
            }
        }
        for (var _k in b) {
            if (!b.hasOwnProperty(_k)) {
                continue;
            }
            if (a[_k] !== b[_k]) {
                return false;
            }
        }
        return true;
    }
    return a == b;
};

var updateOtherGrid = function updateOtherGrid(grid, as, key, val, level) {
    var his_cells = grid.__mrr.linksNeeded[as][key];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = his_cells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cell = _step.value;

            grid.setState(_defineProperty({}, cell, val), null, null, level);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

var swapObj = function swapObj(a) {
    var b = {};
    for (var k in a) {
        b[a[k]] = k;
    }
    return b;
};

var joinAsObject = function joinAsObject(target_struct, parent, child, key) {
    if (parent && child && parent[key] && child[key]) {
        target_struct[key] = Object.assign({}, parent[key], child[key]);
    }
};
var joinAsArray = function joinAsArray(target_struct, parent, child, key) {
    if (parent && child && parent[key] && child[key]) {
        target_struct[key] = [].concat(_toConsumableArray(parent[key]), _toConsumableArray(child[key]));
    }
};

var mrrJoin = function mrrJoin() {
    var child_struct = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var parent_struct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var struct = Object.assign({}, parent_struct, child_struct);
    joinAsObject(struct, parent_struct, child_struct, '$init');
    joinAsArray(struct, parent_struct, child_struct, '$readFromDOM');
    joinAsArray(struct, parent_struct, child_struct, '$expose');
    for (var k in struct) {
        if (k[0] === '+') {
            var real_k = k.substr(1);
            if (!struct[real_k]) {
                struct[real_k] = struct[k];
            } else {
                struct[real_k] = ['join', struct[k], struct[real_k]];
            }
            delete struct[k];
        }
    }
    return struct;
};

var objMap = function objMap(obj, func) {
    var res = {};
    for (var i in obj) {
        var _func = func(obj[i], i),
            _func2 = _slicedToArray(_func, 2),
            val = _func2[0],
            key = _func2[1];

        res[key] = val;
    }
    return res;
};

var isOfType = exports.isOfType = function isOfType(val, type, dataTypes) {
    return dataTypes[type] ? dataTypes[type](val) : false;
};

var defDataTypes = {
    'array': {
        check: function check(a) {
            return a instanceof Array;
        }
    },
    'object': {
        check: function check(a) {
            return a instanceof Object;
        }
    },
    'func': {
        check: function check(a) {
            return a instanceof Function;
        }
    },
    'int': {
        check: function check(a) {
            return typeof a === 'number';
        }
    },
    'string': {
        check: function check(a) {
            return typeof a === 'string';
        }
    },
    'pair': {
        check: function check(a) {
            return a instanceof Array && a.length === 2;
        },
        extends: ['array']
    },
    'coll_update': {
        check: function check(a, types) {
            return a instanceof Array && a.length === 2 && isOfType(a[0], 'object', types) && isOfType(a[1], 'object_or_int', types);
        }
    },
    'array_or_object': {
        check: function check(a) {
            return a instanceof Object;
        },
        extends: ['array', 'object']
    },
    'object_or_int': {
        check: function check(a) {
            return a instanceof Object || typeof a === 'number';
        },
        extends: ['int', 'object']
    }
};

var isMatchingType = function isMatchingType(master_type, slave_type, types, actions) {
    if (master_type === slave_type) {
        actions.matches ? actions.matches() : null;
        return;
    }
    if (!types[slave_type]) {
        debugger;
    }
    var _matches = false;
    if (types[master_type].extends) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = types[master_type].extends[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var parent_type = _step2.value;

                isMatchingType(parent_type, slave_type, types, {
                    matches: function matches() {
                        actions.matches();
                        _matches = true;
                    }
                });
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
    if (_matches) return;
    var _maybe = false;
    if (types[slave_type].extends) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = types[slave_type].extends[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _parent_type = _step3.value;

                isMatchingType(master_type, _parent_type, types, {
                    matches: function matches() {
                        if (types[slave_type].extends.length > 1) {
                            actions.matches ? actions.matches() : null;
                        } else {
                            actions.maybe ? actions.maybe() : null;
                        }
                        _maybe = true;
                    },
                    maybe: function maybe() {
                        actions.maybe ? actions.maybe() : null;
                        _maybe = true;
                    }
                });
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }
    if (_maybe) return;
    actions.not ? actions.not() : null;
};

var type_delimiter = ': ';

var ids = 0;

var html_aspects = {
    val: function val() {
        return ['Change', function (e) {
            return e.target.value;
        }];
    },
    click: function click() {
        return ['Click', function (e) {
            return e;
        }];
    }
};

var currentChange = void 0;

var getWithMrr = function getWithMrr(GG, macros, dataTypes) {
    return function (mrrStructure) {
        var _render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var parentClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var isGlobal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var mrrParentClass = mrrStructure;
        var parent = parentClass || _react2.default.Component;
        _render = _render || parent.prototype.render || function () {
            return null;
        };
        mrrParentClass = function (_parent) {
            _inherits(MyMrrComponent, _parent);

            function MyMrrComponent() {
                _classCallCheck(this, MyMrrComponent);

                return _possibleConstructorReturn(this, (MyMrrComponent.__proto__ || Object.getPrototypeOf(MyMrrComponent)).apply(this, arguments));
            }

            _createClass(MyMrrComponent, [{
                key: '__mrrGetComputed',
                value: function __mrrGetComputed() {
                    var parent_struct = parent.prototype.__mrrGetComputed ? parent.prototype.__mrrGetComputed.apply(this) : {};
                    return mrrJoin(this.props.__mrr, mrrJoin(mrrStructure instanceof Function ? mrrStructure(this.props || {}) : mrrStructure, parent_struct));
                }
            }, {
                key: 'render',
                value: function render() {
                    var _this2 = this;

                    var self = this;
                    var jsx = _render.call(this, this.state, this.props, this.toState.bind(this), function (as) {
                        return { mrrConnect: _this2.mrrConnect(as) };
                    }, function () {
                        self.__mrr.getRootHandlersCalled = true;
                        var props = {
                            id: '__mrr_root_node_n' + self.__mrr.id
                        };

                        var _loop = function _loop(event_type) {
                            props['on' + event_type] = function (e) {
                                var _iteratorNormalCompletion4 = true;
                                var _didIteratorError4 = false;
                                var _iteratorError4 = undefined;

                                try {
                                    for (var _iterator4 = self.__mrr.root_el_handlers[event_type][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                        var _step4$value = _slicedToArray(_step4.value, 3),
                                            selector = _step4$value[0],
                                            handler = _step4$value[1],
                                            cell = _step4$value[2];

                                        if (e.target.matches('#__mrr_root_node_n' + self.__mrr.id + ' ' + selector)) {
                                            var value = handler(e);
                                            self.setState(_defineProperty({}, cell, value), null, null, true);
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError4 = true;
                                    _iteratorError4 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                            _iterator4.return();
                                        }
                                    } finally {
                                        if (_didIteratorError4) {
                                            throw _iteratorError4;
                                        }
                                    }
                                }
                            };
                        };

                        for (var event_type in self.__mrr.root_el_handlers) {
                            _loop(event_type);
                        }
                        return props;
                    });
                    if (this.__mrr.usesEventDelegation && !this.__mrr.getRootHandlersCalled) {
                        console.warn('Looks like you forget to call getRootHandlers when using event delegation');
                    }
                    return jsx;
                }
            }]);

            return MyMrrComponent;
        }(parent);
        var cls = function (_mrrParentClass) {
            _inherits(Mrr, _mrrParentClass);

            function Mrr(props, context, already_inited, isGG) {
                _classCallCheck(this, Mrr);

                var _this3 = _possibleConstructorReturn(this, (Mrr.__proto__ || Object.getPrototypeOf(Mrr)).call(this, props, context, true));

                if (already_inited) {
                    //return;
                }
                if (isGG) {
                    _this3.isGG = true;
                }
                _this3.props = props || {};
                _this3.__mrr = {
                    id: ++ids,
                    closureFuncs: {},
                    children: {},
                    childrenCounter: 0,
                    anonCellsCounter: 0,
                    linksNeeded: {},
                    constructing: true,
                    thunks: {},
                    skip: skip,
                    expose: {},
                    signalCells: {},
                    dataTypes: {},
                    dom_based_cells: {},
                    root_el_handlers: {},
                    alreadyInitedLinkedCells: {}
                };
                if (props && props.extractDebugMethodsTo) {
                    props.extractDebugMethodsTo.getState = function () {
                        return _this3.mrrState;
                    };
                    props.extractDebugMethodsTo.self = _this3;
                }
                if (!_this3.__mrr.valueCells) {
                    _this3.__mrr.valueCells = {};
                }
                _this3.__mrr.realComputed = Object.assign({}, objMap(_this3.__mrrGetComputed(), function (val, key) {
                    if (key[0] === '~') {
                        key = key.substr(1);
                        _this3.__mrr.signalCells[key] = true;
                    }
                    if (key[0] === '=') {
                        key = key.substr(1);
                        _this3.__mrr.valueCells[key] = true;
                    }
                    if (key.indexOf(type_delimiter) !== -1) {
                        var type = void 0;

                        var _key$split = key.split(type_delimiter);

                        var _key$split2 = _slicedToArray(_key$split, 2);

                        key = _key$split2[0];
                        type = _key$split2[1];

                        _this3.setCellDataType(key, type);
                    }
                    return [val, key];
                }));
                _this3.parseMrr();
                if (GG) {
                    if (_this3.__mrr.linksNeeded['^']) {
                        GG.__mrr.subscribers.push(_this3);
                        _this3.checkLinkedCellsTypes(_this3, GG, '^');
                        for (var a in _this3.__mrr.linksNeeded['^']) {
                            var child_cells = _this3.__mrr.linksNeeded['^'][a];
                            var val = GG.mrrState[a];
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = child_cells[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var cell = _step5.value;

                                    _this3.mrrState[cell] = val;
                                }
                            } catch (err) {
                                _didIteratorError5 = true;
                                _iteratorError5 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                        _iterator5.return();
                                    }
                                } finally {
                                    if (_didIteratorError5) {
                                        throw _iteratorError5;
                                    }
                                }
                            }
                        }
                    }
                    _this3.checkLinkedCellsTypes(GG, _this3, '*');
                }
                _this3.state = _this3.initialState;
                if (_this3.props.mrrConnect) {
                    _this3.props.mrrConnect.subscribe(_this3);
                }
                _this3.__mrr.constructing = false;
                return _this3;
            }

            _createClass(Mrr, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    this.setState({
                        $start: true
                    });
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.setState({ $end: true });
                    if (this.__mrrParent) {
                        delete this.__mrrParent.__mrr.children[this.__mrrLinkedAs];
                    }
                    if (GG && this.__mrr.linksNeeded['^']) {
                        var i = GG.__mrr.subscribers.indexOf(this);
                        delete GG.__mrr.subscribers[i];
                    }
                }
            }, {
                key: 'setCellDataType',
                value: function setCellDataType(cell, type) {
                    if (!dataTypes[type]) {
                        throw new Error('Undeclared type: ' + type);
                    }
                    cell = cell[0] === '-' ? cell.slice(1) : cell;
                    if (!this.__mrr.dataTypes[cell]) {
                        this.__mrr.dataTypes[cell] = type;
                    } else {
                        if (this.__mrr.dataTypes[cell] !== type) {
                            throw new Error("Different type annotation for the same cell found: " + this.__mrr.dataTypes[cell] + ', ' + type + ' for cell "' + cell + '"');
                        }
                    }
                }
            }, {
                key: 'parseRow',
                value: function parseRow(row, key, depMap) {
                    if (key === "$log") return;
                    for (var k in row) {
                        var cell = row[k];
                        if (cell === '^' || cell === skip) {
                            // prev val of cell or "no cell"
                            continue;
                        }
                        if (k === '0') {
                            if (!(cell instanceof Function) && (!cell.indexOf || cell.indexOf('.') === -1 && cell_types.indexOf(cell) === -1)) {
                                // it's macro
                                if (!this.__mrrMacros[cell]) {
                                    throw new Error('Macros ' + cell + ' not found!');
                                }
                                var new_row = this.__mrrMacros[cell](row.slice(1));
                                this.__mrr.realComputed[key] = new_row;
                                this.parseRow(new_row, key, depMap);
                                return;
                            }
                            continue;
                        }
                        if (cell instanceof Function) continue;
                        if (cell instanceof Array) {
                            // anon cell
                            var anonName = '@@anon' + ++this.__mrr.anonCellsCounter;
                            this.__mrr.realComputed[anonName] = cell;
                            var rowCopy = this.__mrr.realComputed[key].slice();
                            rowCopy[k] = anonName;
                            this.__mrr.realComputed[key] = rowCopy;
                            this.parseRow(cell, anonName, depMap);
                            cell = anonName;
                        }

                        if (cell.indexOf(type_delimiter) !== -1) {
                            var type = void 0;

                            var _cell$split = cell.split(type_delimiter);

                            var _cell$split2 = _slicedToArray(_cell$split, 2);

                            cell = _cell$split2[0];
                            type = _cell$split2[1];

                            row[k] = cell;
                            this.setCellDataType(cell, type);
                        }

                        if (cell.indexOf('|') !== -1) {
                            this.__mrr.usesEventDelegation = true;
                            var real_cell = cell[0] === '-' ? cell.slice(1) : cell;
                            if (!this.__mrr.dom_based_cells[real_cell]) {
                                var _real_cell$split$map = real_cell.split('|').map(function (a) {
                                    return a.trim();
                                }),
                                    _real_cell$split$map2 = _slicedToArray(_real_cell$split$map, 2),
                                    selector = _real_cell$split$map2[0],
                                    aspect = _real_cell$split$map2[1];

                                var _html_aspects$aspect = html_aspects[aspect](),
                                    _html_aspects$aspect2 = _slicedToArray(_html_aspects$aspect, 2),
                                    event_type = _html_aspects$aspect2[0],
                                    handler = _html_aspects$aspect2[1];

                                if (!this.__mrr.root_el_handlers[event_type]) {
                                    this.__mrr.root_el_handlers[event_type] = [];
                                }
                                this.__mrr.root_el_handlers[event_type].push([selector, handler, real_cell]);

                                this.__mrr.dom_based_cells[real_cell] = true;
                            }
                        }

                        if (cell.indexOf('/') !== -1) {
                            var _cell$split3 = cell.split('/'),
                                _cell$split4 = _slicedToArray(_cell$split3, 2),
                                from = _cell$split4[0],
                                parent_cell = _cell$split4[1];

                            if (from[0] === '~') {
                                from = from.slice(1);
                            }
                            if (!this.__mrr.linksNeeded[from]) {
                                this.__mrr.linksNeeded[from] = {};
                            }
                            if (!this.__mrr.linksNeeded[from][parent_cell]) {
                                this.__mrr.linksNeeded[from][parent_cell] = [];
                            }
                            if (this.__mrr.linksNeeded[from][parent_cell].indexOf(cell) === -1) {
                                this.__mrr.linksNeeded[from][parent_cell].push(cell);
                            }
                        } else {
                            this.mentionedCells[cell[0] === '-' ? cell.slice(1) : cell] = true;
                        }
                        if (cell[0] === '-') {
                            // passive listening
                            continue;
                        }
                        if (!depMap[cell]) {
                            depMap[cell] = [];
                        }
                        depMap[cell].push(key);
                    }
                }
            }, {
                key: 'logChange',
                value: function logChange() {
                    var currentLevel = -1;
                    for (var k in currentChange) {
                        var _currentChange$k = _slicedToArray(currentChange[k], 4),
                            str = _currentChange$k[0],
                            style = _currentChange$k[1],
                            val = _currentChange$k[2],
                            level = _currentChange$k[3];

                        if (level > currentLevel + 1) {
                            var diff = level - (currentLevel + 1);
                            for (var j = k; currentChange[j] && currentChange[j][3] >= currentLevel; j++) {
                                currentChange[j][3] -= diff;
                            }
                        }
                        currentLevel = level;
                    }
                    currentLevel = -1;
                    console.group('');
                    for (var _k2 in currentChange) {
                        var _currentChange$_k = _slicedToArray(currentChange[_k2], 4),
                            str = _currentChange$_k[0],
                            style = _currentChange$_k[1],
                            val = _currentChange$_k[2],
                            level = _currentChange$_k[3];

                        if (level !== currentLevel) {
                            if (level > currentLevel) {
                                //console.group(level);
                            } else {
                                var riz = currentLevel - level;
                                for (var s = currentLevel; s > level; s--) {
                                    //console.groupEnd();
                                }
                            }
                        }
                        //if(level <= currentLevel){
                        console.log.apply(console, [new Array(level + 1).fill('').join('___') + ' ' + str, style, val]);
                        //}
                        currentLevel = level;
                    }
                    for (var _s = currentLevel; _s >= 0; _s--) {
                        //console.groupEnd();
                    }
                    console.groupEnd();
                }
            }, {
                key: 'parseMrr',
                value: function parseMrr() {
                    var depMap = {};
                    this.mentionedCells = {};
                    var mrr = this.__mrr.realComputed;
                    this.mrrState = Object.assign({}, this.state);
                    var updateOnInit = {};
                    for (var key in mrr) {
                        var fexpr = mrr[key];
                        if (key === '$log') continue;
                        if (fexpr === skip) continue;
                        if (key === '$meta') continue;
                        if (key === '$init') {
                            if (mrr.$log && mrr.$log.showTree) {
                                currentChange = [];
                            }
                            var init_vals = mrr[key] instanceof Function ? mrr[key](this.props) : mrr[key];
                            for (var cell in init_vals) {
                                this.__mrrSetState(cell, init_vals[cell], null, [], 0);
                                updateOnInit[cell] = init_vals[cell];
                            }
                            if (mrr.$log && mrr.$log.showTree) {
                                this.logChange();
                            }
                            continue;
                        }
                        if (key === "$expose") {
                            if (fexpr instanceof Array) {
                                var obj = {};
                                for (var k in fexpr) {
                                    obj[fexpr[k]] = fexpr[k];
                                }
                                this.__mrr.expose = obj;
                            } else {
                                this.__mrr.expose = swapObj(fexpr);
                            }
                            continue;
                        };
                        if (key === "$readFromDOM") {
                            this.__mrr.readFromDOM = {};
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = fexpr[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var item = _step6.value;

                                    this.__mrr.readFromDOM[item] = true;
                                }
                            } catch (err) {
                                _didIteratorError6 = true;
                                _iteratorError6 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                        _iterator6.return();
                                    }
                                } finally {
                                    if (_didIteratorError6) {
                                        throw _iteratorError6;
                                    }
                                }
                            }

                            continue;
                        };
                        if (!(fexpr instanceof Array)) {
                            if (typeof fexpr === 'string') {
                                // another cell
                                fexpr = [function (a) {
                                    return a;
                                }, fexpr];
                                this.__mrr.realComputed[key] = fexpr;
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
                    if (this.__mrr.readFromDOM) {
                        for (var cn in this.mentionedCells) {
                            if (!this.__mrr.realComputed[cn] && !this.__mrr.readFromDOM[cn] && cn.indexOf('.') === -1 && cn !== '$start' && cn !== '$end') {
                                throw new Error('Linking to undescribed cell: ' + cn);
                            }
                        }
                    }
                }
            }, {
                key: 'setStateFromEvent',
                value: function setStateFromEvent(key, e) {
                    var val;
                    switch (e.target.type) {
                        case 'checkbox':
                            val = e.target.checked;
                            break;
                        default:
                            val = e.target.value;
                            break;
                    }
                    this.setState(_defineProperty({}, key, val));
                }
            }, {
                key: 'toStateAs',
                value: function toStateAs(key, val) {
                    this.setState(_defineProperty({}, key, val), null, null, true);
                }
            }, {
                key: 'checkLinkedCellsTypes',
                value: function checkLinkedCellsTypes(a, b, linked_as) {
                    var _loop2 = function _loop2(v) {
                        var needed_cells = a.__mrr.linksNeeded[linked_as][v];
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            var _loop3 = function _loop3() {
                                var cell = _step7.value;

                                if (a.__mrr.dataTypes[cell] && b.__mrr.dataTypes[v] && isMatchingType(b.__mrr.dataTypes[v], a.__mrr.dataTypes[cell], dataTypes, {
                                    not: function not() {
                                        throw new Error('Types mismatch! ' + a.__mrr.dataTypes[cell] + ' vs. ' + b.__mrr.dataTypes[v] + ' in ' + cell);
                                    },
                                    maybe: function maybe() {
                                        console.warn('Not fully compliant types: expecting ' + a.__mrr.dataTypes[cell] + ', got ' + b.__mrr.dataTypes[v]);
                                    }
                                })) {}
                            };

                            for (var _iterator7 = needed_cells[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                _loop3();
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }
                    };

                    for (var v in a.__mrr.linksNeeded[linked_as]) {
                        _loop2(v);
                    }
                }
            }, {
                key: 'mrrConnect',
                value: function mrrConnect(as) {
                    var _this4 = this;

                    var self = this;
                    if (isUndef(as)) {
                        as = '__rand_child_name_' + ++this.__mrr.childrenCounter;
                    }
                    return {
                        subscribe: function subscribe(child) {
                            child.$name = as;
                            child.state.$name = as;
                            _this4.__mrr.children[as] = child;
                            child.__mrrParent = self;
                            child.__mrrLinkedAs = as;
                            for (var a in child.__mrr.linksNeeded['..']) {
                                var child_cells = child.__mrr.linksNeeded['..'][a];
                                var val = self.mrrState[a];
                                var _iteratorNormalCompletion8 = true;
                                var _didIteratorError8 = false;
                                var _iteratorError8 = undefined;

                                try {
                                    for (var _iterator8 = child_cells[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                        var _cell = _step8.value;

                                        child.mrrState[_cell] = val;
                                    }
                                } catch (err) {
                                    _didIteratorError8 = true;
                                    _iteratorError8 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                            _iterator8.return();
                                        }
                                    } finally {
                                        if (_didIteratorError8) {
                                            throw _iteratorError8;
                                        }
                                    }
                                }
                            }
                            _this4.checkLinkedCellsTypes(child, _this4, '..');
                            _this4.checkLinkedCellsTypes(_this4, child, as);
                            _this4.checkLinkedCellsTypes(_this4, child, '*');
                            if (_this4.__mrr.realComputed.$log && (_this4.__mrr.realComputed.$log === true || _this4.__mrr.realComputed.$log.showMount)) {
                                if (_this4.__mrr.realComputed.$log === 'no-colour') {
                                    console.log('CONNECTED: ' + (_this4.$name || '/') + as);
                                } else {
                                    console.log('%c CONNECTED: ' + (_this4.$name || '/') + as, log_styles_mount);
                                }
                            }
                        }
                    };
                }
            }, {
                key: 'toState',
                value: function toState(key, val, notHandleFunctions) {
                    var _this5 = this;

                    if (this.__mrr.readFromDOM && !this.__mrr.readFromDOM[key]) {
                        throw new Error('MRERR_101: trying to create undescribed stream: ' + key, this.__mrr.readFromDOM);
                    }
                    if (val === undefined && this.__mrr.thunks[key]) {
                        //console.log('=== skip');
                        return this.__mrr.thunks[key];
                    } else {
                        //console.log('=== generate');
                        var func = function func(a) {
                            var value = void 0;
                            if (val !== undefined) {
                                if (val instanceof Function && !notHandleFunctions) {
                                    value = val(a);
                                } else {
                                    value = val;
                                }
                            } else {
                                if (a && a.target && a.target.type) {
                                    if (a.target.type === 'checkbox') {
                                        value = a.target.checked;
                                    } else {
                                        a.preventDefault();
                                        if (a.target.type === 'submit') {
                                            value = true;
                                        } else {
                                            value = a.target.value;
                                        }
                                    }
                                } else {
                                    value = a;
                                }
                            }
                            if (value === skip) {
                                return;
                            }
                            if (key instanceof Array) {
                                var ns = {};
                                key.forEach(function (k) {
                                    ns[k] = value;
                                });
                                _this5.setState(ns, null, null, 0);
                            } else {
                                _this5.setState(_defineProperty({}, key, value), null, null, 0);
                            }
                        };
                        if (val === undefined) {
                            this.__mrr.thunks[key] = func;
                        }
                        return func;
                    }
                }
            }, {
                key: '__getCellArgs',
                value: function __getCellArgs(cell) {
                    var _this6 = this;

                    var arg_cells = this.__mrr.realComputed[cell].slice(this.__mrr.realComputed[cell][0] instanceof Function ? 1 : 2).filter(function (a) {
                        return a !== skip;
                    });
                    var res = arg_cells.map(function (arg_cell) {
                        if (arg_cell === '^') {
                            //console.log('looking for prev val of', cell, this.mrrState, this.state);
                            return _this6.mrrState[cell];
                        } else {
                            if (arg_cell[0] === '-') {
                                arg_cell = arg_cell.slice(1);
                            }
                            if (arg_cell === '$name') {
                                return _this6.$name;
                            }
                            if (arg_cell === '$props') {
                                return _this6.props;
                            }
                            return _this6.mrrState[arg_cell] === undefined && _this6.state && _this6.__mrr.constructing ? _this6.initialState[arg_cell] : _this6.mrrState[arg_cell];
                        }
                    });
                    return res;
                }
            }, {
                key: '__mrrSetError',
                value: function __mrrSetError(cell, e) {
                    if (this.mrrDepMap['$err.' + cell]) {
                        this.setState(_defineProperty({}, '$err.' + cell, e));
                    } else {
                        if (this.mrrDepMap.$err) {
                            this.setState({ $err: e });
                        } else {
                            throw e;
                        }
                    }
                }
            }, {
                key: '__mrrUpdateCell',
                value: function __mrrUpdateCell(cell, parent_cell, update, parent_stack, level) {
                    var _this7 = this;

                    var val,
                        func,
                        args,
                        _updateNested,
                        types = [];
                    var superSetState = _get(Mrr.prototype.__proto__ || Object.getPrototypeOf(Mrr.prototype), 'setState', this);
                    var updateFunc = function updateFunc(val) {
                        if (val === skip) {
                            return;
                        }
                        if (_this7.__mrr.realComputed.$log && _this7.__mrr.realComputed.$log.showTree) {
                            currentChange = [];
                        }
                        _this7.__mrrSetState(cell, val, parent_cell, parent_stack, 0);
                        var update = {};
                        update[cell] = val;
                        _this7.checkMrrCellUpdate(cell, update, parent_stack, val, 0);
                        superSetState.call(_this7, update, null, true);
                        if (_this7.__mrr.realComputed.$log && _this7.__mrr.realComputed.$log.showTree) {
                            _this7.logChange();
                        }
                    };
                    var fexpr = this.__mrr.realComputed[cell];
                    if (typeof fexpr[0] === 'string') {
                        types = fexpr[0].split('.');
                    }

                    if (types.indexOf('nested') !== -1) {
                        _updateNested = function updateNested(subcell, val) {
                            if (subcell instanceof Object) {
                                for (var k in subcell) {
                                    _updateNested(k, subcell[k]);
                                }
                                return;
                            }
                            if (_this7.__mrr.realComputed.$log && _this7.__mrr.realComputed.$log.showTree) {
                                currentChange = [];
                            }
                            var subcellname = cell + '.' + subcell;
                            var stateSetter = mrrParentClass.prototype.setState || function () {};
                            _this7.__mrrSetState(subcellname, val, parent_cell, parent_stack, level);
                            var update = {};
                            update[subcellname] = val;
                            _this7.checkMrrCellUpdate(subcellname, update, parent_stack, val, level);
                            stateSetter.call(_this7, update, null, true);
                            var nested_update = _defineProperty({}, cell, _this7.mrrState[cell] instanceof Object ? _this7.mrrState[cell] : {});
                            nested_update[cell][subcell] = val;
                            stateSetter.call(_this7, nested_update, null, true);
                            if (_this7.__mrr.realComputed.$log && _this7.__mrr.realComputed.$log.showTree) {
                                _this7.logChange();
                            }
                        };
                    }

                    if (fexpr[0] instanceof Function) {
                        func = this.__mrr.realComputed[cell][0];
                        args = this.__getCellArgs(cell);
                        try {
                            val = func.apply(null, args);
                        } catch (e) {
                            this.__mrrSetError(cell, e);
                            return;
                        }
                    } else {
                        if (types.indexOf('funnel') !== -1) {
                            args = [parent_cell, this.mrrState[parent_cell], this.mrrState[cell]];
                        } else {
                            args = this.__getCellArgs(cell);
                        }
                        if (types.indexOf('nested') !== -1) {
                            args.unshift(_updateNested);
                        }
                        if (types.indexOf('async') !== -1) {
                            args.unshift(updateFunc);
                        }
                        if (types.indexOf('closure') !== -1) {
                            if (!this.__mrr.closureFuncs[cell]) {
                                var init_val = this.mrrState[cell];
                                this.__mrr.closureFuncs[cell] = fexpr[1](init_val);
                            }
                            func = this.__mrr.closureFuncs[cell];
                        } else {
                            func = this.__mrr.realComputed[cell][1];
                        }
                        if (!func || !func.apply) {
                            throw new Error('MRR_ERROR_101: closure type should provide function');
                        }
                        try {
                            val = func.apply(null, args);
                        } catch (e) {
                            this.__mrrSetError(cell, e);
                            return;
                        }
                    }
                    if (this.__mrr.dataTypes[cell] && val !== skip) {
                        if (!dataTypes[this.__mrr.dataTypes[cell]]) {
                            throw new Error('Undeclared type: ' + this.__mrr.dataTypes[cell] + " for cell " + cell);
                        }
                        if (!dataTypes[this.__mrr.dataTypes[cell]].check(val, dataTypes)) {
                            throw new Error('Wrong data type for cell ' + cell + ': ' + val + ', expecting ' + this.__mrr.dataTypes[cell]);
                        }
                    }
                    if (types && types.indexOf('nested') !== -1) {
                        if (val instanceof Object) {
                            for (var k in val) {
                                _updateNested(k, val[k]);
                            }
                        }
                        return;
                    }
                    if (types && types.indexOf('async') !== -1) {
                        // do nothing!
                        return;
                    }
                    var current_val = this.mrrState[cell];
                    if (this.__mrr.valueCells[cell] && shallow_equal(current_val, val)) {
                        //console.log('Duplicate', cell, val, this.__mrr.valueCells);
                        return;
                    }
                    if (isPromise(val)) {
                        val.then(updateFunc);
                    } else {
                        if (val === skip) {
                            return;
                        }
                        update[cell] = val;
                        this.__mrrSetState(cell, val, parent_cell, parent_stack, level);
                        this.checkMrrCellUpdate(cell, update, parent_stack, val, level);
                    }
                }
            }, {
                key: 'checkMrrCellUpdate',
                value: function checkMrrCellUpdate(parent_cell, update) {
                    var parent_stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
                    var val = arguments[3];
                    var level = arguments[4];

                    if (this.mrrDepMap[parent_cell]) {
                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            for (var _iterator9 = this.mrrDepMap[parent_cell][Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                var _cell2 = _step9.value;

                                var next_parent_stack = this.__mrr.realComputed.$log ? [].concat(_toConsumableArray(parent_stack), [[parent_cell, val]]) : parent_stack;
                                this.__mrrUpdateCell(_cell2, parent_cell, update, next_parent_stack, level + 1);
                            }
                        } catch (err) {
                            _didIteratorError9 = true;
                            _iteratorError9 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                    _iterator9.return();
                                }
                            } finally {
                                if (_didIteratorError9) {
                                    throw _iteratorError9;
                                }
                            }
                        }
                    }
                }
            }, {
                key: '__mrrSetState',
                value: function __mrrSetState(key, val, parent_cell, parent_stack, level) {
                    //@ todo: omit @@anon cells
                    if (this.__mrr.realComputed.$log && key[0] !== '@') {
                        if (this.__mrr.realComputed.$log === true || this.__mrr.realComputed.$log instanceof Array && this.__mrr.realComputed.$log.indexOf(key) !== -1 || this.__mrr.realComputed.$log.cells && (this.__mrr.realComputed.$log.cells === true || this.__mrr.realComputed.$log.cells.indexOf(key) !== -1)) {
                            if (this.__mrr.realComputed.$log === 'no-colour') {
                                console.log(key, val);
                            } else {
                                var logArgs = ['%c ' + this.__mrrPath + '::' + key,
                                //+ '(' + parent_cell +') ',
                                log_styles_cell, val];
                                if (this.__mrr.realComputed.$log.showStack) {
                                    logArgs.push(JSON.stringify(parent_stack));
                                }
                                if (this.__mrr.realComputed.$log.showTree) {
                                    logArgs.push(level);
                                    if (!currentChange) debugger;
                                    currentChange.push(logArgs);
                                } else {
                                    console.log.apply(console, logArgs);
                                }
                            }
                        }
                    }
                    this.mrrState[key] = val;

                    if (isGlobal) {
                        if (this.__mrr.subscribers) {
                            var _iteratorNormalCompletion10 = true;
                            var _didIteratorError10 = false;
                            var _iteratorError10 = undefined;

                            try {
                                for (var _iterator10 = this.__mrr.subscribers[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                    var sub = _step10.value;

                                    if (sub && sub.__mrr.linksNeeded['^'][key]) {
                                        updateOtherGrid(sub, '^', key, this.mrrState[key], level + 1);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError10 = true;
                                _iteratorError10 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                        _iterator10.return();
                                    }
                                } finally {
                                    if (_didIteratorError10) {
                                        throw _iteratorError10;
                                    }
                                }
                            }
                        }
                    } else {
                        for (var _as in this.__mrr.children) {
                            if (this.__mrr.children[_as].__mrr.linksNeeded['..'] && this.__mrr.children[_as].__mrr.linksNeeded['..'][key] && val === this.mrrState[key]) {
                                updateOtherGrid(this.__mrr.children[_as], '..', key, this.mrrState[key], level + 1);
                            }
                        }
                        var as = this.__mrrLinkedAs;
                        if (this.__mrrParent && this.__mrrParent.__mrr.linksNeeded[as] && this.__mrrParent.__mrr.linksNeeded[as][key] && val === this.mrrState[key]) {
                            updateOtherGrid(this.__mrrParent, as, key, this.mrrState[key], level + 1);
                        }
                        if (this.__mrrParent && this.__mrrParent.__mrr.linksNeeded['*'] && this.__mrrParent.__mrr.linksNeeded['*'][key] && val === this.mrrState[key]) {
                            updateOtherGrid(this.__mrrParent, '*', key, this.mrrState[key], level + 1);
                        }
                        if (this.__mrr.expose && this.__mrr.expose[key] && GG && GG.__mrr.linksNeeded['*'] && GG.__mrr.linksNeeded['*'][this.__mrr.expose[key]] && val === this.mrrState[key]) {
                            updateOtherGrid(GG, '*', this.__mrr.expose[key], this.mrrState[key], level + 1);
                        }
                    }
                }
            }, {
                key: 'getUpdateQueue',
                value: function getUpdateQueue(cell) {}
            }, {
                key: 'setState',
                value: function setState(ns, cb, alreadyRun) {
                    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

                    if (!(ns instanceof Object)) {
                        ns = ns.call(null, this.state, this.props);
                    }
                    var update = Object.assign({}, ns);
                    if (!level && this.__mrr.realComputed.$log && this.__mrr.realComputed.$log.showTree) {
                        currentChange = [];
                    }
                    if (!alreadyRun) {
                        for (var _cell3 in update) {
                            this.__mrrSetState(_cell3, update[_cell3], null, [], level);
                        }
                        for (var parent_cell in update) {
                            this.checkMrrCellUpdate(parent_cell, update, [], null, level);
                        }
                    }
                    if (!level && this.__mrr.realComputed.$log && this.__mrr.realComputed.$log.showTree) {
                        this.logChange();
                    }
                    if (!this.__mrr.constructing) {
                        return (mrrParentClass.prototype.setState || function () {}).call(this, update, cb, true);
                    } else {
                        for (var _cell4 in update) {
                            this.initialState[_cell4] = update[_cell4];
                        }
                    }
                }
            }, {
                key: '__mrrMacros',
                get: function get() {
                    return Object.assign({}, macros, global_macros);
                }
            }, {
                key: '__mrrPath',
                get: function get() {
                    return this.__mrrParent ? this.__mrrParent.__mrrPath + '/' + this.$name : this.isGG ? 'GG' : 'root';
                }
            }]);

            return Mrr;
        }(mrrParentClass);
        return cls;
    };
};

var withMrr = exports.withMrr = getWithMrr(null, _defMacros2.default, defDataTypes);

var def = withMrr({}, null, _react2.default.Component);
def.skip = skip;

var initGlobalGrid = function initGlobalGrid(struct, availableMacros, availableDataTypes) {
    var GlobalGrid = function () {
        function GlobalGrid() {
            _classCallCheck(this, GlobalGrid);
        }

        _createClass(GlobalGrid, [{
            key: '__mrrGetComputed',
            value: function __mrrGetComputed() {
                return struct;
            }
        }]);

        return GlobalGrid;
    }();

    var GwithMrr = getWithMrr(null, availableMacros, availableDataTypes);
    var GlobalGridClass = GwithMrr(null, null, GlobalGrid, true);
    var GG = new GlobalGridClass(null, null, null, true);
    GG.__mrr.subscribers = [];
    return GG;
};

var createMrrApp = exports.createMrrApp = function createMrrApp(conf) {
    var availableMacros = Object.assign({}, _defMacros2.default, conf.macros || {});
    var availableDataTypes = Object.assign({}, defDataTypes, conf.dataTypes || {});
    var GG = conf.globalGrid ? initGlobalGrid(conf.globalGrid, availableMacros, availableDataTypes) : null;
    var withMrr = getWithMrr(GG, availableMacros, availableDataTypes);
    return {
        withMrr: withMrr,
        skip: skip,
        GG: GG
    };
};

exports.default = def;