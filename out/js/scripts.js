(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],2:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":34,"./_wks":99}],3:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":82}],4:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],5:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":42}],6:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":88,"./_to-length":91,"./_to-object":92}],7:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":88,"./_to-iobject":90,"./_to-length":91}],8:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":11,"./_ctx":19,"./_iobject":39,"./_to-length":91,"./_to-object":92}],9:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":1,"./_iobject":39,"./_to-length":91,"./_to-object":92}],10:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":41,"./_is-object":42,"./_wks":99}],11:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":10}],12:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":1,"./_invoke":38,"./_is-object":42}],13:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":14,"./_wks":99}],14:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],15:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":4,"./_ctx":19,"./_descriptors":21,"./_for-of":30,"./_iter-define":46,"./_iter-step":48,"./_meta":51,"./_object-create":55,"./_object-dp":56,"./_redefine-all":71,"./_set-species":76,"./_validate-collection":96}],16:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":4,"./_export":25,"./_fails":27,"./_for-of":30,"./_global":32,"./_inherit-if-required":37,"./_is-object":42,"./_iter-detect":47,"./_meta":51,"./_redefine":72,"./_redefine-all":71,"./_set-to-string-tag":77}],17:[function(require,module,exports){
var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],18:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":56,"./_property-desc":70}],19:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":1}],20:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":27}],22:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":32,"./_is-object":42}],23:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],24:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":61,"./_object-keys":64,"./_object-pie":65}],25:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":17,"./_ctx":19,"./_global":32,"./_hide":34,"./_redefine":72}],26:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":99}],27:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],28:[function(require,module,exports){
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":20,"./_fails":27,"./_hide":34,"./_redefine":72,"./_regexp-exec":74,"./_wks":99,"./es6.regexp.exec":123}],29:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":5}],30:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":5,"./_ctx":19,"./_is-array-iter":40,"./_iter-call":44,"./_to-length":91,"./core.get-iterator-method":100}],31:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":79}],32:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],33:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],34:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":56,"./_property-desc":70}],35:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":32}],36:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":27}],37:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":42,"./_set-proto":75}],38:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],39:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":14}],40:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":49,"./_wks":99}],41:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":14}],42:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],43:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":14,"./_is-object":42,"./_wks":99}],44:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":5}],45:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":34,"./_object-create":55,"./_property-desc":70,"./_set-to-string-tag":77,"./_wks":99}],46:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":25,"./_hide":34,"./_iter-create":45,"./_iterators":49,"./_library":50,"./_object-gpo":62,"./_redefine":72,"./_set-to-string-tag":77,"./_wks":99}],47:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":99}],48:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],49:[function(require,module,exports){
module.exports = {};

},{}],50:[function(require,module,exports){
module.exports = false;

},{}],51:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":27,"./_has":33,"./_is-object":42,"./_object-dp":56,"./_uid":94}],52:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":14,"./_global":32,"./_task":87}],53:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":1}],54:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":27,"./_iobject":39,"./_object-gops":61,"./_object-keys":64,"./_object-pie":65,"./_to-object":92}],55:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":5,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":35,"./_object-dps":57,"./_shared-key":78}],56:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":5,"./_descriptors":21,"./_ie8-dom-define":36,"./_to-primitive":93}],57:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":5,"./_descriptors":21,"./_object-dp":56,"./_object-keys":64}],58:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":21,"./_has":33,"./_ie8-dom-define":36,"./_object-pie":65,"./_property-desc":70,"./_to-iobject":90,"./_to-primitive":93}],59:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":60,"./_to-iobject":90}],60:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":63}],61:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],62:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":33,"./_shared-key":78,"./_to-object":92}],63:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":7,"./_has":33,"./_shared-key":78,"./_to-iobject":90}],64:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":63}],65:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],66:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":17,"./_export":25,"./_fails":27}],67:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":64,"./_object-pie":65,"./_to-iobject":90}],68:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],69:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":5,"./_is-object":42,"./_new-promise-capability":53}],70:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],71:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":72}],72:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":17,"./_function-to-string":31,"./_global":32,"./_has":33,"./_hide":34,"./_uid":94}],73:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

},{"./_classof":13}],74:[function(require,module,exports){
'use strict';

var regexpFlags = require('./_flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./_flags":29}],75:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":5,"./_ctx":19,"./_is-object":42,"./_object-gopd":58}],76:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":21,"./_global":32,"./_object-dp":56,"./_wks":99}],77:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":33,"./_object-dp":56,"./_wks":99}],78:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":79,"./_uid":94}],79:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":17,"./_global":32,"./_library":50}],80:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":1,"./_an-object":5,"./_wks":99}],81:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":27}],82:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":20,"./_to-integer":89}],83:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":20,"./_is-regexp":43}],84:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":20,"./_export":25,"./_fails":27}],85:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":20,"./_export":25,"./_fails":27,"./_string-ws":86}],86:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],87:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":14,"./_ctx":19,"./_dom-create":22,"./_global":32,"./_html":35,"./_invoke":38}],88:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":89}],89:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],90:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":39}],91:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":89}],92:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],93:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":42}],94:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],95:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":32}],96:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":42}],97:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":17,"./_global":32,"./_library":50,"./_object-dp":56,"./_wks-ext":98}],98:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":99}],99:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":32,"./_shared":79,"./_uid":94}],100:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":13,"./_core":17,"./_iterators":49,"./_wks":99}],101:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":25}],102:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":25,"./_strict-method":81}],103:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":25,"./_strict-method":81}],104:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":18,"./_ctx":19,"./_export":25,"./_is-array-iter":40,"./_iter-call":44,"./_iter-detect":47,"./_to-length":91,"./_to-object":92,"./core.get-iterator-method":100}],105:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":7,"./_export":25,"./_strict-method":81}],106:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":25,"./_is-array":41}],107:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":2,"./_iter-define":46,"./_iter-step":48,"./_iterators":49,"./_to-iobject":90}],108:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":25,"./_strict-method":81}],109:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":9,"./_export":25,"./_strict-method":81}],110:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":72}],111:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":12,"./_export":25}],112:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":21,"./_object-dp":56}],113:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":16,"./_collection-strong":15,"./_validate-collection":96}],114:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":14,"./_descriptors":21,"./_fails":27,"./_global":32,"./_has":33,"./_inherit-if-required":37,"./_object-create":55,"./_object-dp":56,"./_object-gopd":58,"./_object-gopn":60,"./_redefine":72,"./_string-trim":85,"./_to-primitive":93}],115:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":25,"./_object-assign":54}],116:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":25,"./_object-create":55}],117:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":21,"./_export":25,"./_object-dp":56}],118:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":64,"./_object-sap":66,"./_to-object":92}],119:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":25,"./_set-proto":75}],120:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":13,"./_redefine":72,"./_wks":99}],121:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":1,"./_an-instance":4,"./_classof":13,"./_core":17,"./_ctx":19,"./_export":25,"./_for-of":30,"./_global":32,"./_is-object":42,"./_iter-detect":47,"./_library":50,"./_microtask":52,"./_new-promise-capability":53,"./_perform":68,"./_promise-resolve":69,"./_redefine-all":71,"./_set-species":76,"./_set-to-string-tag":77,"./_species-constructor":80,"./_task":87,"./_user-agent":95,"./_wks":99}],122:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":5,"./_export":25,"./_fails":27,"./_object-dp":56,"./_to-primitive":93}],123:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":25,"./_regexp-exec":74}],124:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":21,"./_flags":29,"./_object-dp":56}],125:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toLength = require('./_to-length');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":28,"./_regexp-exec-abstract":73,"./_to-length":91}],126:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":28,"./_regexp-exec-abstract":73,"./_to-integer":89,"./_to-length":91,"./_to-object":92}],127:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":5,"./_descriptors":21,"./_fails":27,"./_flags":29,"./_redefine":72,"./es6.regexp.flags":124}],128:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":16,"./_collection-strong":15,"./_validate-collection":96}],129:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":46,"./_string-at":82}],130:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":84}],131:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":83,"./_to-length":91}],132:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":5,"./_descriptors":21,"./_enum-keys":24,"./_export":25,"./_fails":27,"./_global":32,"./_has":33,"./_hide":34,"./_is-array":41,"./_is-object":42,"./_library":50,"./_meta":51,"./_object-create":55,"./_object-dp":56,"./_object-gopd":58,"./_object-gopn":60,"./_object-gopn-ext":59,"./_object-gops":61,"./_object-keys":64,"./_object-pie":65,"./_property-desc":70,"./_redefine":72,"./_set-to-string-tag":77,"./_shared":79,"./_to-iobject":90,"./_to-primitive":93,"./_uid":94,"./_wks":99,"./_wks-define":97,"./_wks-ext":98}],133:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":25,"./_object-to-array":67}],134:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":25,"./_object-to-array":67}],135:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":97}],136:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":32,"./_hide":34,"./_iterators":49,"./_object-keys":64,"./_redefine":72,"./_wks":99,"./es6.array.iterator":107}],137:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Particles_1 = require("../Particles/Particles");

var Stars_1 = require("./Stars");

var WebPage_1 = require("../Modules/WebPage");

var canvas = new Particles_1["default"]('#particles', '2d');
canvas.setParticleSettings(Stars_1.Stars.Particles);
canvas.setInteractiveSettings(Stars_1.Stars.Interactive);
canvas.start();
var paused = false;
WebPage_1.ScrollHook.addEventListener('scroll', function () {
  if (WebPage_1.Sections.get('canvas').inView()) {
    if (paused) {
      paused = false;
      canvas.resume();
    }
  } else {
    if (!paused) {
      paused = true;
      canvas.pause();
    }
  }
}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":174,"../Particles/Particles":182,"./Stars":138,"core-js/modules/es6.object.define-property":117}],138:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stars = void 0;
exports.Stars = {
  Particles: {
    number: 300,
    density: 200,
    color: '#FFFFFF',
    opacity: 'random',
    radius: [2, 2.5, 3, 3.5, 4, 4.5],
    shape: 'circle',
    stroke: {
      width: 0,
      color: '#000000'
    },
    move: {
      speed: 0.2,
      direction: 'random',
      straight: false,
      random: true,
      edgeBounce: false,
      attract: false
    },
    events: {
      resize: true,
      hover: 'bubble',
      click: false
    },
    animate: {
      opacity: {
        speed: 0.2,
        min: 0,
        sync: false
      },
      radius: {
        speed: 3,
        min: 0,
        sync: false
      }
    }
  },
  Interactive: {
    hover: {
      bubble: {
        distance: 75,
        radius: 8,
        opacity: 1
      }
    }
  }
};

},{"core-js/modules/es6.object.define-property":117}],139:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.reflect.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var Components;

(function (Components) {
  var Helpers;

  (function (Helpers) {
    function runIfDefined(_this, method, data) {
      if (_this[method] && _this[method] instanceof Function) {
        _this[method](data);
      }
    }

    Helpers.runIfDefined = runIfDefined;

    function attachInterface(_this, name) {
      Reflect.defineProperty(_this, name, {
        value: Interface[name],
        configurable: false,
        writable: false
      });
    }

    Helpers.attachInterface = attachInterface;
  })(Helpers || (Helpers = {}));

  var Interface;

  (function (Interface) {
    function appendTo(parent) {
      var _this_1 = this;

      parent.appendChild(this.element);
      setTimeout(function () {
        if (!_this_1._mounted) {
          Events.dispatch(_this_1, 'mounted', {
            parent: parent
          });
          _this_1._mounted = true;
        }
      }, 0);
    }

    Interface.appendTo = appendTo;
  })(Interface || (Interface = {}));

  var Events;

  (function (Events) {
    function dispatch(_this, event, data) {
      Helpers.runIfDefined(_this, event, data);
    }

    Events.dispatch = dispatch;
  })(Events || (Events = {}));

  var __Base = function () {
    function __Base() {
      this.element = null;
    }

    return __Base;
  }();

  var Component = function (_super) {
    __extends(Component, _super);

    function Component() {
      var _this_1 = _super.call(this) || this;

      _this_1.element = null;
      _this_1._mounted = false;

      _this_1._setupInterface();

      return _this_1;
    }

    Component.prototype._setupInterface = function () {
      Helpers.attachInterface(this, 'appendTo');
    };

    Component.prototype.appendTo = function (parent) {};

    Component.prototype.getReference = function (ref) {
      return this.element.querySelector("[ref=\"" + ref + "\"]") || null;
    };

    return Component;
  }(__Base);

  var Initialize;

  (function (Initialize) {
    function __Initialize() {
      this.element = this.createElement();
      Events.dispatch(this, 'created');
    }

    function Main(_this) {
      __Initialize.bind(_this)();
    }

    Initialize.Main = Main;
  })(Initialize || (Initialize = {}));

  var HTMLComponent = function (_super) {
    __extends(HTMLComponent, _super);

    function HTMLComponent() {
      var _this_1 = _super.call(this) || this;

      Initialize.Main(_this_1);
      return _this_1;
    }

    return HTMLComponent;
  }(Component);

  Components.HTMLComponent = HTMLComponent;

  var DataComponent = function (_super) {
    __extends(DataComponent, _super);

    function DataComponent(data) {
      var _this_1 = _super.call(this) || this;

      _this_1.data = data;
      Initialize.Main(_this_1);
      return _this_1;
    }

    return DataComponent;
  }(Component);

  Components.DataComponent = DataComponent;
})(Components || (Components = {}));

module.exports = Components;

},{"core-js/modules/es6.function.bind":111,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.reflect.define-property":122}],140:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Certificates = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var DOM_1 = require("../../Modules/DOM");

var Certificates = function (_super) {
  __extends(Certificates, _super);

  function Certificates() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.infoDisplayed = false;
    _this.tooltipLeft = true;
    return _this;
  }

  Certificates.prototype.created = function () {
    var _this = this;

    if (this.data.award) {
      window.addEventListener('resize', function () {
        return _this.checkTooltipSide();
      }, {
        passive: true
      });
    }
  };

  Certificates.prototype.mounted = function () {
    if (this.data.award) {
      this.checkTooltipSide();
    }
  };

  Certificates.prototype.checkTooltipSide = function () {
    var tooltip = this.getReference('tooltip');
    var tooltipPos = tooltip.getBoundingClientRect().left;
    var screenWidth = DOM_1.DOM.getViewport().width;

    if (this.tooltipLeft !== tooltipPos >= screenWidth / 2) {
      this.tooltipLeft = !this.tooltipLeft;
      var add = this.tooltipLeft ? 'left' : 'top';
      var remove = this.tooltipLeft ? 'top' : 'left';
      tooltip.classList.remove(remove);
      tooltip.classList.add(add);
    }
  };

  Certificates.prototype.lessInfo = function () {
    this.infoDisplayed = false;
    this.update();
  };

  Certificates.prototype.toggleInfo = function () {
    this.infoDisplayed = !this.infoDisplayed;
    this.update();
  };

  Certificates.prototype.update = function () {
    if (this.infoDisplayed) {
      this.getReference('slider').setAttribute('opened', '');
    } else {
      this.getReference('slider').removeAttribute('opened');
    }

    this.getReference('infoText').innerHTML = (this.infoDisplayed ? 'Less' : 'More') + " Info";
  };

  Certificates.prototype.createElement = function () {
    var inlineStyle = {
      '--button-background-color': this.data.color
    };
    var imageStyle = {
      backgroundImage: "url(" + ("./out/images/Certificates/" + this.data.image) + ")"
    };
    return JSX_1.ElementFactory.createElement("div", {
      className: "xs-12 sm-6 md-4"
    }, this.data.award ? JSX_1.ElementFactory.createElement("div", {
      className: "award"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "tooltip-container"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "out/images/Projects/award.png",
      style: {
        transform: 'scale(1.5)'
      }
    }), JSX_1.ElementFactory.createElement("span", {
      ref: "tooltip",
      className: "tooltip left is-size-8"
    }, this.data.award))) : null, JSX_1.ElementFactory.createElement("div", {
      className: "project card is-theme-secondary elevation-1 is-in-grid hide-overflow",
      style: inlineStyle
    }, JSX_1.ElementFactory.createElement("div", {
      className: "image",
      style: imageStyle
    }), JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "title"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-6 is-bold-weight",
      style: {
        color: this.data.color
      }
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "type is-size-8"
    }, this.data.type), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-8 is-color-light"
    }, this.data.date)), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "flavor is-size-7"
    }, this.data.flavor)), JSX_1.ElementFactory.createElement("div", {
      className: "slider is-theme-secondary",
      ref: "slider"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-4"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "title flex row xs-x-begin xs-y-center"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-6 is-bold-weight"
    }, "Info"), JSX_1.ElementFactory.createElement("div", {
      className: "close-btn-wrapper xs-x-self-end"
    }, JSX_1.ElementFactory.createElement("button", {
      className: "btn close is-svg is-primary",
      tabindex: "-1",
      onClick: this.lessInfo.bind(this)
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-times"
    })))), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("ul", {
      className: "details xs-y-padding-between-1 is-size-9"
    }, this.data.details.map(function (detail) {
      return JSX_1.ElementFactory.createElement("li", null, detail);
    }))))), JSX_1.ElementFactory.createElement("div", {
      className: "options is-theme-secondary xs-x-margin-between-1"
    }, this.data.repo ? JSX_1.ElementFactory.createElement("a", {
      className: "code btn is-primary is-text is-custom",
      href: this.data.repo,
      target: "_blank",
      tabindex: "0"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-code"
    }), JSX_1.ElementFactory.createElement("span", null, "See Code")) : null, this.data.external ? JSX_1.ElementFactory.createElement("a", {
      className: "external btn is-primary is-text is-custom",
      href: this.data.external,
      target: "_blank",
      tabindex: "0"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-external-link-alt"
    }), JSX_1.ElementFactory.createElement("span", null, "View Credentials")) : null))));
  };

  return Certificates;
}(Component_1.DataComponent);

exports.Certificates = Certificates;

},{"../../Definitions/JSX":159,"../../Modules/DOM":171,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.function.bind":111,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],141:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.string.link");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Education = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var DOM_1 = require("../../Modules/DOM");

var Education = function (_super) {
  __extends(Education, _super);

  function Education() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Education.prototype.update = function () {};

  Education.prototype.created = function () {
    var _this = this;

    DOM_1.DOM.onFirstAppearance(this.element, function () {
      _this.setProgress();
    }, {
      timeout: 500,
      offset: 0.3
    });
  };

  Education.prototype.setProgress = function () {
    var completed = this.data.credits.completed / this.data.credits.total * 100 + "%";
    var taking = (this.data.credits.completed + this.data.credits.taking) / this.data.credits.total * 100 + "%";
    this.getReference('completedTrack').style.width = completed;
    this.getReference('takingTrack').style.width = taking;
    var completedMarker = this.getReference('completedMarker');
    var takingMarker = this.getReference('takingMarker');
    completedMarker.style.opacity = '1';
    completedMarker.style.left = completed;
    takingMarker.style.opacity = '1';
    takingMarker.style.left = taking;
  };

  Education.prototype.createElement = function () {
    var inlineStyle = {
      '--progress-bar-color': this.data.color
    };
    return JSX_1.ElementFactory.createElement("div", {
      className: "card is-theme-secondary elevation-1 education",
      style: __assign(__assign({}, inlineStyle), {
        marginTop: '30px'
      })
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "header flex row sm-wrap md-nowrap xs-x-center"
    }, JSX_1.ElementFactory.createElement("a", {
      className: "icon xs-auto",
      href: this.data.link,
      target: "_blank"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "out/images/Education/" + this.data.image
    })), JSX_1.ElementFactory.createElement("div", {
      className: "about xs-full"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "institution flex row xs-x-center xs-y-center md-x-begin"
    }, JSX_1.ElementFactory.createElement("a", {
      className: "name xs-full md-auto is-center-aligned is-bold-weight is-size-6 is-colored-link",
      href: this.data.link,
      target: "_blank"
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "location md-x-self-end is-italic is-size-8 is-color-light"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "degree flex row xs-x-center xs-y-center md-x-begin"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name xs-full md-auto is-center-aligned is-bold-weight is-size-7 is-color-light"
    }, this.data.degree), JSX_1.ElementFactory.createElement("p", {
      className: "date md-x-self-end is-italic is-size-8 is-color-light"
    }, "(", this.data.start, " \u2014 ", this.data.end, ")")))), JSX_1.ElementFactory.createElement("div", {
      className: "progress flex row xs-nowrap xs-y-center progress-bar-hover-container"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "progress-bar"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "completed marker",
      style: {
        opacity: 0
      },
      ref: "completedMarker"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-8"
    }, this.data.credits.completed)), JSX_1.ElementFactory.createElement("div", {
      className: "taking marker",
      style: {
        opacity: 0
      },
      ref: "takingMarker"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-8"
    }, this.data.credits.completed + this.data.credits.taking)), JSX_1.ElementFactory.createElement("div", {
      className: "track"
    }), JSX_1.ElementFactory.createElement("div", {
      className: "buffer",
      ref: "takingTrack"
    }), JSX_1.ElementFactory.createElement("div", {
      className: "fill",
      ref: "completedTrack"
    })), JSX_1.ElementFactory.createElement("p", {
      className: "credits is-size-8 xs-auto"
    }, this.data.credits.completed, " %")), JSX_1.ElementFactory.createElement("div", {
      className: "info content padding-x-4 padding-y-2"
    }, this.data.notes.map(function (note) {
      return JSX_1.ElementFactory.createElement("p", {
        className: "is-light-color is-size-8 is-italic"
      }, note);
    }), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
      className: "courses"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-bold-weight is-size-6"
    }, "Coursework"), JSX_1.ElementFactory.createElement("ul", {
      className: "flex row is-size-7"
    }, this.data.courses.map(function (course) {
      return JSX_1.ElementFactory.createElement("li", {
        className: "xs-12 md-6"
      }, course);
    })))))));
  };

  return Education;
}(Component_1.DataComponent);

exports.Education = Education;

},{"../../Definitions/JSX":159,"../../Modules/DOM":171,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.assign":115,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.string.link":130}],142:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.string.link");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Experience = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Experience = function (_super) {
  __extends(Experience, _super);

  function Experience() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Experience.prototype.update = function () {};

  Experience.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "card is-theme-secondary elevation-1 experience"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "header"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "icon"
    }, JSX_1.ElementFactory.createElement("a", {
      href: this.data.link,
      target: "_blank"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "./out/images/Experience/" + this.data.svg,
      alt: 'alt'
    }))), JSX_1.ElementFactory.createElement("div", {
      className: "company"
    }, JSX_1.ElementFactory.createElement("a", {
      href: this.data.link,
      target: "_blank",
      className: "name is-size-6 is-bold-weight is-colored-link"
    }, this.data.company), JSX_1.ElementFactory.createElement("p", {
      className: "location is-size-8 is-italic is-color-light"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "role"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-7 is-bold-weight"
    }, this.data.position), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-8 is-italic is-color-light"
    }, "(" + this.data.begin + " \u2014 " + this.data.end + ")"))), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
      className: "content info"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "description is-size-8 is-color-light is-italic is-justified is-quote"
    }, this.data.flavor), JSX_1.ElementFactory.createElement("ul", {
      className: "job is-left-aligned is-size-7 xs-y-padding-between-1"
    }, this.data.roles.map(function (role) {
      return JSX_1.ElementFactory.createElement("li", null, role);
    })))));
  };

  return Experience;
}(Component_1.DataComponent);

exports.Experience = Experience;

},{"../../Definitions/JSX":159,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.string.link":130}],143:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

var DOM_1 = require("../../../Modules/DOM");

var Helpers;

(function (Helpers) {
  function loadOnFirstAppearance(hook, className) {
    if (className === void 0) {
      className = 'preload';
    }

    return new Promise(function (resolve, reject) {
      hook.classList.add(className);
      DOM_1.DOM.onFirstAppearance(hook, function () {
        hook.classList.remove(className);
        resolve();
      }, {
        offset: 0.5
      });
    });
  }

  Helpers.loadOnFirstAppearance = loadOnFirstAppearance;
})(Helpers || (Helpers = {}));

module.exports = Helpers;

},{"../../../Modules/DOM":171,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121}],144:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Menu = void 0;

var DOM_1 = require("../../Modules/DOM");

var EventDispatcher_1 = require("../../Modules/EventDispatcher");

var Menu = function (_super) {
  __extends(Menu, _super);

  function Menu() {
    var _this = _super.call(this) || this;

    _this.open = false;
    _this.RGBRegExp = /(rgb\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3})\))|(rgba\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3}), (0(?:\.[0-9]{1,2})?)\))/g;
    _this.Container = DOM_1.DOM.getFirstElement('header.menu');
    _this.Hamburger = DOM_1.DOM.getFirstElement('header.menu .hamburger');

    _this.register('toggle');

    return _this;
  }

  Menu.prototype.toggle = function () {
    this.open = !this.open;
    this.open ? this.openMenu() : this.closeMenu();
    this.dispatch('toggle', {
      open: this.open
    });
  };

  Menu.prototype.openMenu = function () {
    this.Container.setAttribute('open', '');
    this.darken();
  };

  Menu.prototype.closeMenu = function () {
    var _this = this;

    this.Container.removeAttribute('open');
    setTimeout(function () {
      return _this.updateContrast();
    }, 750);
  };

  Menu.prototype.darken = function () {
    this.Hamburger.classList.remove('light');
  };

  Menu.prototype.lighten = function () {
    this.Hamburger.classList.add('light');
  };

  Menu.prototype.updateContrast = function () {
    if (!this.open) {
      var backgroundColor = this.getBackgroundColor();
      this.changeContrast(backgroundColor);
    }
  };

  Menu.prototype.getBackgroundColor = function () {
    var elementsFromPoint = document.elementsFromPoint ? 'elementsFromPoint' : 'msElementsFromPoint';

    var _a = this.Hamburger.getBoundingClientRect(),
        top = _a.top,
        left = _a.left;

    var elements = document[elementsFromPoint](left, top);
    var length = elements.length;
    var RGB = [];
    var background, regExResult;
    var styles;

    for (var i = 1; i < length; ++i, this.RGBRegExp.lastIndex = 0) {
      styles = window.getComputedStyle(elements[i]);
      background = styles.background || styles.backgroundColor + styles.backgroundImage;

      while (regExResult = this.RGBRegExp.exec(background)) {
        if (regExResult[1]) {
          RGB = regExResult.slice(2, 5).map(function (val) {
            return parseInt(val);
          });
          return RGB;
        } else if (regExResult[5]) {
          RGB = regExResult.slice(6, 10).map(function (val) {
            return parseInt(val);
          });

          if (!RGB.every(function (val) {
            return val === 0;
          })) {
            return RGB;
          }
        }
      }
    }

    return RGB;
  };

  Menu.prototype.changeContrast = function (RGB) {
    var contrast, luminance;

    if (RGB.length === 3) {
      contrast = RGB.map(function (val) {
        return val / 255;
      }).map(function (val) {
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      luminance = 0.2126 * contrast[0] + 0.7152 * contrast[1] + 0.0722 * contrast[2];

      if (luminance > 0.179) {
        this.darken();
      } else {
        this.lighten();
      }
    } else {
      this.darken();
    }
  };

  return Menu;
}(EventDispatcher_1.Events.EventDispatcher);

exports.Menu = Menu;

},{"../../Modules/DOM":171,"../../Modules/EventDispatcher":172,"core-js/modules/es6.array.is-array":106,"core-js/modules/es6.array.map":108,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],145:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Project = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var DOM_1 = require("../../Modules/DOM");

var Project = function (_super) {
  __extends(Project, _super);

  function Project() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.infoDisplayed = false;
    _this.tooltipLeft = true;
    return _this;
  }

  Project.prototype.created = function () {
    var _this = this;

    if (this.data.award) {
      window.addEventListener('resize', function () {
        return _this.checkTooltipSide();
      }, {
        passive: true
      });
    }
  };

  Project.prototype.mounted = function () {
    if (this.data.award) {
      this.checkTooltipSide();
    }
  };

  Project.prototype.checkTooltipSide = function () {
    var tooltip = this.getReference('tooltip');
    var tooltipPos = tooltip.getBoundingClientRect().left;
    var screenWidth = DOM_1.DOM.getViewport().width;

    if (this.tooltipLeft !== tooltipPos >= screenWidth / 2) {
      this.tooltipLeft = !this.tooltipLeft;
      var add = this.tooltipLeft ? 'left' : 'top';
      var remove = this.tooltipLeft ? 'top' : 'left';
      tooltip.classList.remove(remove);
      tooltip.classList.add(add);
    }
  };

  Project.prototype.lessInfo = function () {
    this.infoDisplayed = false;
    this.update();
  };

  Project.prototype.toggleInfo = function () {
    this.infoDisplayed = !this.infoDisplayed;
    this.update();
  };

  Project.prototype.update = function () {
    if (this.infoDisplayed) {
      this.getReference('slider').setAttribute('opened', '');
    } else {
      this.getReference('slider').removeAttribute('opened');
    }

    this.getReference('infoText').innerHTML = (this.infoDisplayed ? 'Less' : 'More') + " Info";
  };

  Project.prototype.createElement = function () {
    var inlineStyle = {
      '--button-background-color': this.data.color
    };
    var imageStyle = {
      backgroundImage: "url(" + ("./out/images/Projects/" + this.data.image) + ")"
    };
    return JSX_1.ElementFactory.createElement("div", {
      className: "xs-12 sm-6 md-4"
    }, this.data.award ? JSX_1.ElementFactory.createElement("div", {
      className: "award"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "tooltip-container"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "out/images/Projects/award.png",
      style: {
        transform: 'scale(1.5)'
      }
    }), JSX_1.ElementFactory.createElement("span", {
      ref: "tooltip",
      className: "tooltip left is-size-8"
    }, this.data.award))) : null, JSX_1.ElementFactory.createElement("div", {
      className: "project card is-theme-secondary elevation-1 is-in-grid hide-overflow",
      style: inlineStyle
    }, JSX_1.ElementFactory.createElement("div", {
      className: "image",
      style: imageStyle
    }), JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "title"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-6 is-bold-weight",
      style: {
        color: this.data.color
      }
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "type is-size-8"
    }, this.data.type), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-8 is-color-light"
    }, this.data.date)), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "flavor is-size-7"
    }, this.data.flavor)), JSX_1.ElementFactory.createElement("div", {
      className: "slider is-theme-secondary",
      ref: "slider"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-4"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "title flex row xs-x-begin xs-y-center"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-6 is-bold-weight"
    }, "Tasks"), JSX_1.ElementFactory.createElement("div", {
      className: "close-btn-wrapper xs-x-self-end"
    }, JSX_1.ElementFactory.createElement("button", {
      className: "btn close is-svg is-primary",
      tabindex: "-1",
      onClick: this.lessInfo.bind(this)
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-times"
    })))), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("ul", {
      className: "details xs-y-padding-between-1 is-size-9"
    }, this.data.details.map(function (detail) {
      return JSX_1.ElementFactory.createElement("li", null, detail);
    }))))), JSX_1.ElementFactory.createElement("div", {
      className: "options is-theme-secondary xs-x-margin-between-1"
    }, JSX_1.ElementFactory.createElement("button", {
      className: "info btn is-primary is-text is-custom",
      onClick: this.toggleInfo.bind(this)
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-info"
    }), JSX_1.ElementFactory.createElement("span", {
      ref: "infoText"
    }, "More Info")), this.data.repo ? JSX_1.ElementFactory.createElement("a", {
      className: "code btn is-primary is-text is-custom",
      href: this.data.repo,
      target: "_blank",
      tabindex: "0"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-code"
    }), JSX_1.ElementFactory.createElement("span", null, "See Code")) : null, this.data.external ? JSX_1.ElementFactory.createElement("a", {
      className: "external btn is-primary is-text is-custom",
      href: this.data.external,
      target: "_blank",
      tabindex: "0"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-external-link-alt"
    }), JSX_1.ElementFactory.createElement("span", null, "View Online")) : null))));
  };

  return Project;
}(Component_1.DataComponent);

exports.Project = Project;

},{"../../Definitions/JSX":159,"../../Modules/DOM":171,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.function.bind":111,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],146:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Quality = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Quality = function (_super) {
  __extends(Quality, _super);

  function Quality(data) {
    return _super.call(this, data) || this;
  }

  Quality.prototype.update = function () {};

  Quality.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "xs-12 sm-4"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "icon " + this.data.faClass
    }), JSX_1.ElementFactory.createElement("p", {
      className: "quality is-size-5 is-uppercase"
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "desc is-light-weight is-size-6"
    }, this.data.description));
  };

  return Quality;
}(Component_1.DataComponent);

exports.Quality = Quality;

},{"../../Definitions/JSX":159,"../Component":139,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],147:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../../Modules/DOM");

var Section = function () {
  function Section(element) {
    this.element = element;
  }

  Section.prototype.inView = function () {
    return DOM_1.DOM.inVerticalWindowView(this.element);
  };

  Section.prototype.getID = function () {
    return this.element.id;
  };

  Section.prototype.inMenu = function () {
    return !this.element.classList.contains('no-menu');
  };

  return Section;
}();

exports["default"] = Section;

},{"../../Modules/DOM":171,"core-js/modules/es6.object.define-property":117}],148:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skill = exports.SkillCategory = void 0;

var SVG_1 = require("../../Modules/SVG");

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var SkillCategory;

(function (SkillCategory) {
  SkillCategory[SkillCategory["Programming"] = 1] = "Programming";
  SkillCategory[SkillCategory["Scripting"] = 2] = "Scripting";
  SkillCategory[SkillCategory["Web"] = 4] = "Web";
  SkillCategory[SkillCategory["Server"] = 8] = "Server";
  SkillCategory[SkillCategory["Database"] = 16] = "Database";
  SkillCategory[SkillCategory["DevOps"] = 32] = "DevOps";
  SkillCategory[SkillCategory["Framework"] = 64] = "Framework";
  SkillCategory[SkillCategory["DataScience"] = 128] = "DataScience";
  SkillCategory[SkillCategory["Other"] = 256] = "Other";
})(SkillCategory = exports.SkillCategory || (exports.SkillCategory = {}));

var Skill = function (_super) {
  __extends(Skill, _super);

  function Skill() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Skill.prototype.getCategory = function () {
    return this.data.category;
  };

  Skill.prototype.update = function () {};

  Skill.prototype.created = function () {
    var _this = this;

    SVG_1.SVG.loadSVG("./out/images/Skills/" + this.data.svg).then(function (svg) {
      svg.setAttribute('class', 'icon');

      var hexagon = _this.getReference('hexagon');

      hexagon.parentNode.insertBefore(svg, hexagon);
    });
  };

  Skill.prototype.createElement = function () {
    if (!Skill.HexagonSVG) {
      throw 'Cannot create Skill element without being initialized.';
    }

    return JSX_1.ElementFactory.createElement("li", {
      className: 'skill tooltip-container'
    }, JSX_1.ElementFactory.createElement("div", {
      className: 'hexagon-container',
      style: {
        color: this.data.color
      }
    }, JSX_1.ElementFactory.createElement("span", {
      className: 'tooltip top is-size-7'
    }, this.data.name), Skill.HexagonSVG.cloneNode(true)));
  };

  Skill.initialize = function () {
    return new Promise(function (resolve, reject) {
      if (Skill.HexagonSVG) {
        resolve(true);
      } else {
        SVG_1.SVG.loadSVG('./out/images/Content/Hexagon').then(function (element) {
          element.setAttribute('class', 'hexagon');
          element.setAttribute('ref', 'hexagon');
          Skill.HexagonSVG = element;
          resolve(true);
        })["catch"](function (err) {
          resolve(false);
        });
      }
    });
  };

  return Skill;
}(Component_1.DataComponent);

exports.Skill = Skill;
Skill.initialize();

},{"../../Definitions/JSX":159,"../../Modules/SVG":173,"../Component":139,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121}],149:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es7.object.entries");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.map");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.assign");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkillsFilter = void 0;

var JSX_1 = require("../../Definitions/JSX");

var DOM_1 = require("../../Modules/DOM");

var Skill_1 = require("./Skill");

var WebPage_1 = require("../../Modules/WebPage");

var Skills_1 = require("../../Data/Skills");

var SkillsFilter = function () {
  function SkillsFilter() {
    var _this = this;

    this.filter = 0;
    this.active = false;
    this.top = false;
    this.maxHeight = 224;
    this.optionElements = new Map();
    this.skillElements = [];
    this.usingArrowKeys = false;
    this.lastSelected = null;
    this.Container = DOM_1.DOM.getFirstElement('section#skills .skills-filter');
    this.Dropdown = this.Container.querySelector('.dropdown');
    this.SelectedOptionsDisplay = this.Dropdown.querySelector('.selected-options .display');
    this.Menu = this.Dropdown.querySelector('.menu');
    this.MenuOptions = this.Menu.querySelector('.options');
    this.CategoryMap = Object.entries(Skill_1.SkillCategory).filter(function (_a) {
      var key = _a[0],
          val = _a[1];
      return !isNaN(Number(key));
    }).reduce(function (obj, _a) {
      var _b;

      var key = _a[0],
          val = _a[1];
      return __assign(__assign({}, obj), (_b = {}, _b[key] = val, _b));
    }, {});
    DOM_1.DOM.load().then(function (document) {
      Skill_1.Skill.initialize().then(function () {
        _this.initialize();

        _this.createSkillElements();

        _this.createOptions();

        _this.update();

        _this.createEventListeners();
      });
    });
  }

  SkillsFilter.prototype.initialize = function () {
    this.Menu.style.maxHeight = this.maxHeight + "px";
    this.checkPosition();
  };

  SkillsFilter.prototype.createOptions = function () {
    var _this = this;

    Object.entries(this.CategoryMap).forEach(function (_a) {
      var key = _a[0],
          val = _a[1];
      var element = JSX_1.ElementFactory.createElement("li", {
        className: "is-size-7"
      }, val);

      _this.optionElements.set(element, Number(key));

      _this.MenuOptions.appendChild(element);
    });
  };

  SkillsFilter.prototype.createSkillElements = function () {
    for (var _i = 0, Skills_2 = Skills_1.Skills; _i < Skills_2.length; _i++) {
      var skill = Skills_2[_i];
      this.skillElements.push(new Skill_1.Skill(skill));
    }
  };

  SkillsFilter.prototype.update = function () {
    var _this = this;

    for (var i = WebPage_1.SkillsGrid.children.length - 1; i >= 0; --i) {
      WebPage_1.SkillsGrid.removeChild(WebPage_1.SkillsGrid.children.item(i));
    }

    if (this.filter === 0) {
      this.skillElements.forEach(function (skill) {
        return skill.appendTo(WebPage_1.SkillsGrid);
      });
      this.SelectedOptionsDisplay.innerText = 'None';
    } else {
      this.skillElements.filter(function (skill) {
        return (skill.getCategory() & _this.filter) !== 0;
      }).forEach(function (skill) {
        return skill.appendTo(WebPage_1.SkillsGrid);
      });
      var text = Object.entries(this.CategoryMap).filter(function (_a) {
        var key = _a[0],
            val = _a[1];
        return (_this.filter & Number(key)) !== 0;
      }).map(function (_a) {
        var key = _a[0],
            val = _a[1];
        return val;
      }).join(', ');
      this.SelectedOptionsDisplay.innerText = text;
    }
  };

  SkillsFilter.prototype.createEventListeners = function () {
    var _this = this;

    document.addEventListener('click', function (event) {
      if (_this.optionElements.has(event.target)) {
        _this.toggleOption(event.target);
      } else {
        var path = DOM_1.DOM.getPathToRoot(event.target);

        if (path.indexOf(_this.Dropdown) === -1) {
          _this.close();
        } else {
          _this.active ? _this.close() : _this.open();
        }
      }
    }, {
      passive: true
    });
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 32) {
        var path = DOM_1.DOM.getPathToRoot(document.activeElement);

        if (path.indexOf(_this.Dropdown) !== -1) {
          if (_this.active && _this.usingArrowKeys) {
            _this.toggleOption(_this.lastSelected);
          }

          _this.toggle();

          event.preventDefault();
          event.stopPropagation();
        }
      } else if (_this.active) {
        if (event.keyCode === 37 || event.keyCode === 38) {
          _this.moveArrowSelection(-1);

          event.preventDefault();
          event.stopPropagation();
        } else if (event.keyCode === 39 || event.keyCode === 40) {
          _this.moveArrowSelection(1);

          event.preventDefault();
          event.stopPropagation();
        }
      }
    });
    this.MenuOptions.addEventListener('mouseover', function (event) {
      if (_this.lastSelected) {
        _this.usingArrowKeys = false;

        _this.lastSelected.classList.remove('hover');
      }
    });
    this.Dropdown.addEventListener('blur', function (event) {
      if (_this.active) {
        _this.close();
      }
    });
    WebPage_1.ScrollHook.addEventListener('scroll', function (event) {
      _this.checkPosition();
    }, {
      passive: true
    });
  };

  SkillsFilter.prototype.close = function () {
    this.active = false;
    this.Dropdown.classList.remove('active');
  };

  SkillsFilter.prototype.open = function () {
    this.active = true;
    this.Dropdown.classList.add('active');

    if (this.lastSelected) {
      this.lastSelected.classList.add('hover');
    }
  };

  SkillsFilter.prototype.toggle = function () {
    this.active ? this.close() : this.open();
  };

  SkillsFilter.prototype.toggleOption = function (option) {
    var bit = this.optionElements.get(option);

    if ((this.filter & bit) !== 0) {
      option.classList.remove('selected');
    } else {
      option.classList.add('selected');
    }

    this.filter ^= bit;
    this.lastSelected = option;
    this.update();
  };

  SkillsFilter.prototype.moveArrowSelection = function (dir) {
    if (!this.lastSelected) {
      this.lastSelected = this.MenuOptions.firstElementChild;
      this.lastSelected.classList.add('hover');
    } else {
      if (this.usingArrowKeys) {
        this.lastSelected.classList.remove('hover');

        if (dir < 0) {
          this.lastSelected = this.lastSelected.previousElementSibling || this.MenuOptions.lastElementChild;
        } else {
          this.lastSelected = this.lastSelected.nextElementSibling || this.MenuOptions.firstElementChild;
        }
      } else {
        this.usingArrowKeys = true;
      }

      this.lastSelected.classList.add('hover');

      if (!DOM_1.DOM.inOffsetView(this.lastSelected, {
        ignoreX: true,
        whole: true
      })) {
        DOM_1.DOM.scrollContainerToViewWholeChild(this.Menu, this.lastSelected, {
          ignoreX: true,
          smooth: true
        });
      }
    }

    this.usingArrowKeys = true;
  };

  SkillsFilter.prototype.checkPosition = function () {
    if (DOM_1.DOM.pixelsAboveScreenBottom(this.Dropdown) <= this.maxHeight) {
      if (!this.top) {
        this.top = true;
        this.Dropdown.classList.add('top');
      }
    } else {
      if (this.top) {
        this.top = false;
        this.Dropdown.classList.remove('top');
      }
    }
  };

  return SkillsFilter;
}();

exports.SkillsFilter = SkillsFilter;

},{"../../Data/Skills":157,"../../Definitions/JSX":159,"../../Modules/DOM":171,"../../Modules/WebPage":174,"./Skill":148,"core-js/modules/es6.array.filter":102,"core-js/modules/es6.array.for-each":103,"core-js/modules/es6.array.index-of":105,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.array.map":108,"core-js/modules/es6.array.reduce":109,"core-js/modules/es6.map":113,"core-js/modules/es6.number.constructor":114,"core-js/modules/es6.object.assign":115,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.string.iterator":129,"core-js/modules/es7.object.entries":133,"core-js/modules/web.dom.iterable":136}],150:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.string.link");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Social = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Social = function (_super) {
  __extends(Social, _super);

  function Social() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Social.prototype.update = function () {};

  Social.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "social"
    }, JSX_1.ElementFactory.createElement("a", {
      className: "btn is-svg is-primary",
      href: this.data.link,
      target: "_blank"
    }, JSX_1.ElementFactory.createElement("i", {
      className: this.data.faClass
    })));
  };

  return Social;
}(Component_1.DataComponent);

exports.Social = Social;

},{"../../Definitions/JSX":159,"../Component":139,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.string.link":130}],151:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboutMe = void 0;
exports.AboutMe = "\nAs software engineer, my passion lies in software development and Artificial Intelligence. With hands-on experience in web development and machine learning, I thrive on continuous learning and growth. I'm excited to apply my skills as a software engineer, contributing to innovative projects and embracing new opportunities for professional development.\n";

},{"core-js/modules/es6.object.define-property":117}],152:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Certificates = void 0;
exports.Certificates = [{
  name: 'Microsoft ImagineCup world finalist',
  color: '#1C1C67',
  image: 'imagineCup.png',
  type: '',
  date: 'March 2021',
  award: null,
  flavor: 'Imagine Cup is an annual competition sponsored and hosted by Microsoft Corp. which brings together student developers worldwide to help resolve some of the world\'s toughest challenges.',
  repo: null,
  external: 'https://imaginecup.microsoft.com/en-us/Member/WinnerCertificate?userid=YJEPYcvR9N6OBs6ja0BL%252bA%253d%253d&compId=EyEixFIOmpY5uzits6pX2w%253d%253d&teamId=qAf%252btkAujXAgrHlznfL4Tg%253d%253d',
  details: []
}, {
  name: 'Deep Learning Specialization',
  color: '#bf2600',
  image: 'deepLearning.png',
  type: '',
  date: 'April 2020',
  award: null,
  flavor: 'In this specialization i have learned how to design and optimize machine learning models.',
  repo: null,
  external: 'https://www.coursera.org/account/accomplishments/specialization/certificate/YH8ZBQHPJBM2',
  details: []
}, {
  name: 'Tensorflow in Practice Specialization',
  color: '#127900',
  image: 'tf.png',
  type: '',
  date: 'March 2020',
  award: null,
  flavor: 'I have learned how to implement machine learning models for computer vision, natural language processing and sequences using TensorFlow.',
  repo: null,
  external: 'https://www.coursera.org/account/accomplishments/specialization/certificate/76RV4VFTNF3W',
  details: []
}, {
  name: 'Galactic problem solver by NASA',
  color: '#2448b8',
  image: 'nasa.png',
  type: '',
  date: 'October 2021',
  award: null,
  flavor: 'My team Andromeda is qualified to World Finals in the NASA Space Apps Challenge.',
  repo: null,
  external: null,
  details: []
}];

},{"core-js/modules/es6.object.define-property":117}],153:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Education = void 0;
exports.Education = [{
  name: "National Institute of Applied Science and Technology",
  color: "#c75b12",
  image: "insat.svg",
  link: "http://www.insat.rnu.tn",
  location: "Tunis, Tunisia, TN",
  degree: "Software Engineering",
  start: "September 2019",
  end: "May 2022",
  credits: {
    total: 100,
    completed: 100,
    taking: 0
  },
  gpa: {
    overall: "4.0",
    major: "4.0"
  },
  notes: ["Data science"],
  courses: ["Data Structures and Algorithm Analysis", "Mathematics for engineers", "Fundamental computing", "Data mining", "Database development", "Artificial intelligence"]
}, {
  name: "National Institute of Applied Science and Technology",
  color: "#c75b12",
  image: "insat.svg",
  link: "http://www.insat.rnu.tn",
  location: "Tunis, Tunisia, TN",
  degree: "Integrated preparatory cycle / Field of study: Math - Physics - Computer science",
  start: "September 2017",
  end: "June 2019",
  credits: {
    total: 100,
    completed: 100,
    taking: 0
  },
  gpa: {
    overall: "4.0",
    major: "4.0"
  },
  notes: [""],
  courses: ["Data Structures and Algorithm Analysis", "Operating Systems", "UNIX", "Mathematics"]
}];

},{"core-js/modules/es6.object.define-property":117}],154:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Experience = void 0;
exports.Experience = [{
  svg: "pabolo.svg",
  link: "https://de.linkedin.com/company/pabolo",
  company: "Pabolo GmbH",
  location: "Karlsruhe, Germany",
  position: "Software Engineer",
  begin: "March 2023",
  end: "Present",
  flavor: "I contributed to build an innovative platform that empowers users to unleash their creativity as movie directors with the assistance of AI technology.",
  roles: ["Collaborated closely with cross-functional teams to integrate AI technology into the platform.", "Actively participated in code reviews, testing, and debugging processes to maintain high-quality standards and deliver a reliable product to users.", "Build movie creation pipeline."]
}, {
  svg: "aws.svg",
  link: "https://aws.amazon.com",
  company: "Amazon AWS",
  location: "Berlin, Germany",
  position: "Software Engineer",
  begin: "November 2022",
  end: "March 2023",
  flavor: "Worked on AWS DevOps Guru which a fully managed operations service that makes it easy for\n         developers and operators to improve the performance and availability of their applications. ",
  roles: ["Build a system to improve DevOps Guru's availability with DevOps Guru service.", "Build a system to generate tickets for on-call engineers when a problem is detected in production."]
}, {
  svg: "tucan.svg",
  link: "https://www.tucan.ai",
  company: "Tucan.ai",
  location: "Berlin, Germany",
  position: "Software Engineer",
  begin: "February 2022",
  end: "October 2022",
  flavor: "Tucan.ai is a Berlin-based tech startup developing AI software aimed at improving our professional communication.\n         Tucan offers productivity tools based on automatic speech recognition,\n          transcription and summarisation to help B2B customers organise, carry out and post-process meetings \n          and other structured communication more efficiently. ",
  roles: ["Build machine learning models.", "Models deployment.", "Fix bugs in production"]
}, {
  svg: "expensya.svg",
  link: "https://www.expensya.com",
  company: "Expensya",
  location: "Tunis, Tunisia",
  position: "Software Engineer",
  begin: "January 2021",
  end: "February 2022",
  flavor: "Expensya is a Web and Mobile solution that automates expense reports management for professionals.",
  roles: ["Frontend development with Angular.", "Backend development with .NET framework."]
}, {
  svg: "tplus.svg",
  link: "https://www.apps4you.org",
  company: "T+",
  location: "Freelance - France - Remote",
  position: "Software Engineer",
  begin: "May 2021",
  end: "September 2022",
  flavor: "I am working with T+ company on a white board web application.",
  roles: ["Backend development with Express.js framework, Web Sockets and MongoDB.", "Frontend development with Angular."]
}, {
  svg: "apps4you.svg",
  link: "https://www.apps4you.org",
  company: "Apps4You ",
  location: "Part-time job - Germany - Remote",
  position: "Software Engineer",
  begin: "October 2020",
  end: "May 2021",
  flavor: "I am working part-time with the startup Apps4You on cars rental project.",
  roles: ["Backend development with Spring Boot framework and MongoDB.", "Frontend development with Angular."]
}, {
  svg: "orange.svg",
  link: "https://www.orange.tn",
  company: "Orange in collaboration with Google",
  location: "Internship - Tunisia",
  position: "Web Developer Intern",
  begin: "July 2020",
  end: "September 2020",
  flavor: "For my summer internship, I have participated in Orange Summer Challenge program (OSC) in partnership with Google. \n" + "I was the full-stack web developer for Ubo project, a console dedicated to autism treatment.",
  roles: ["Backend development with Express.js and MongoDB.", "Dashboard development with React.", "Landing page development."]
}, {
  svg: "arsela.svg",
  link: "https://www.arsela.co/en/",
  company: "Arsela Technologies",
  location: "Internship - Tunisia",
  position: "OCR Developer",
  begin: "July 2020",
  end: "Auguest 2020",
  flavor: "Optical Document Character Recognition Project Development and their conversion into appropriate formats.",
  roles: ["Backend development with Express.js and MongoDB.", "OCR microservice development with Tesseract python.", "Dashboard development with React."]
}];

},{"core-js/modules/es6.object.define-property":117}],155:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Projects = void 0;
exports.Projects = [{
  name: "LeetCode Clone",
  color: "#fa8211",
  image: "code-runner.png",
  type: "Personal Project",
  date: "January 2024",
  award: null,
  flavor: "A platform for developers to solve algorithmic problems and practice programming.",
  repo: null,
  external: "https://code-runner-gules.vercel.app",
  details: ["Build the platform with NextJS.", "Implement code checker.", "Deploy the project on Vercel."]
}, {
  name: "Facebook sentiment analysis",
  color: "blue",
  image: "fb.png",
  type: "Personal Project",
  date: "February 2022",
  award: null,
  flavor: "A chrome extension that apply sentiment analysis on Facebook comments.",
  repo: null,
  external: "https://www.linkedin.com/posts/mohamed-aymen-ben-slimen_a-chrome-extension-that-analyzes-the-comments-activity-6867008834750218241-MUVw?utm_source=share&utm_medium=member_desktop",
  details: ["Develop a Chrome extension with JavaScript.", "Build a sentiment analysis model with Python and PyTorch."]
}, {
  name: "Andromeda",
  color: "#020202",
  image: "andromeda.png",
  type: "Hackathon Project",
  date: "October 2021",
  award: "NASA Space Apps Challenge World Finalist.",
  flavor: "Web application to track and map space debris and satellites in real time and predict their locations in the future.",
  repo: null,
  external: "https://mohamed-aymen-ben-slimen.github.io/Andromeda/",
  details: ["3D globe and animation with Secium.js.", "Predict space debris ans satellites locations with Satellite.js."]
}, {
  name: "AR Copy Paste",
  color: "#1b9b00",
  image: "ar.png",
  type: "Personal Project",
  date: "Spring 2021",
  award: null,
  flavor: "Mobile application that copy objects from the real wolrd and paste it to the virtual world.",
  repo: null,
  external: "https://www.linkedin.com/feed/update/urn:li:activity:6793486112175243264/",
  details: ["Developing the mobile application using React Native.", "Developing the desktop application using Python and Tkinter.", "Implementing background removal feature using U^2 algorithm."]
}, {
  name: "Ubo",
  color: "#3f6bff",
  image: "ubo.png",
  type: "Project",
  date: "Summer 2020",
  award: "Imagine Cup 2021 world finals and 9th prize of EU: Africa post crisis journey hackathon",
  flavor: "A smart console with educational games to help children with autism maintain their treatements at home.",
  repo: null,
  external: "https://mohamed-aymen-ben-slimen.github.io/UBO-Site-Vitrine/",
  details: ["Developing a dashboard with React.", "Developing an API using Express.js and MongoDB.", "Developing a landing page website."]
}, {
  name: "Optical Document Character Recognition",
  color: "#1C1C67",
  image: "ocr.png",
  type: "Internship",
  date: "Summer 2020",
  award: null,
  flavor: "Optical Document Character Recognition Project Development and their conversion into appropriate formats.",
  repo: null,
  external: null,
  details: ["Developing an API using Express.js and MongoDB.", "Developing an OCR microservice using Tesseract.", "Developing a dashboard using react."]
}, {
  name: "I-Remember",
  color: "#DB4F54",
  image: "alz.jpg",
  type: "Project",
  date: "Winter 2020",
  award: "Imagine Cup 2020 world finals",
  flavor: "I-Remember is mobile application that helps Alzheimer's patients and their caregivers.",
  external: "https://news.microsoft.com/europe/features/i-remember-an-app-that-helps-people-with-alzheimers-recognize-faces-using-ai/?fbclid=IwAR2kbnJH3Q-ah_goiZhzsIMRK_qU2YSaPzXfUlMXauKBRapZq3qlLA6HOy4",
  repo: null,
  details: ["Developing an API using Express.js and MongoDB.", "Developing face recognition service using Microsoft Azure services."]
}, {
  name: "Art Style Transfer",
  color: "#FFA500",
  image: "nst.png",
  type: "Personal Project",
  date: "Spring 2020",
  award: null,
  flavor: "Art Style Transfer is a solution for online fast neural style transfer to apply a style to an image.",
  repo: null,
  external: "https://mohamed-aymen-ben-slimen.github.io/nst/build/",
  details: ["Developing neural style transfer model using python.", "Developing front-end using React."]
}, {
  name: "CafeTop",
  color: "#7A69AD",
  image: "restau.png",
  type: "Freelance Project",
  date: "Autumn 2019",
  award: null,
  flavor: "Restaurant website to make reservations.",
  repo: null,
  external: "https://mohamed-aymen-ben-slimen.github.io/reastau/docs/",
  details: ["Developing front-end using Angular.", "Developing API for reservations using Node.js and Express.js."]
}, {
  name: "Internships management system",
  color: "#29AB87",
  image: "pfe.png",
  type: "School Project",
  date: "Winter 2021",
  award: null,
  flavor: "We made an internships management system for our institute.",
  repo: null,
  external: null,
  details: ["Developing an API using Nest.js and MongoDB.", "Developing front-end using Angular.", "Developing OAuth authentication."]
}];

},{"core-js/modules/es6.object.define-property":117}],156:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Qualities = void 0;
exports.Qualities = [{
  faClass: 'fas fa-history',
  name: 'Efficient',
  description: 'I consistently bring energy, productivity, organization, and agility to the table as an effective worker and a quick learner.'
}, {
  faClass: 'far fa-snowflake',
  name: 'Attentive',
  description: 'To me, every detail matters. I love formulating the big picture just as much as measuring out the tiny details and edge cases.'
}, {
  faClass: 'fas fa-feather-alt',
  name: 'Flexible',
  description: 'I work best when I am challenged. While I thrive in organization, I can always adapt and pick up new things in a swift manner.'
}];

},{"core-js/modules/es6.object.define-property":117}],157:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skills = void 0;

var Skill_1 = require("../Classes/Elements/Skill");

exports.Skills = [{
  name: 'JavaScript',
  svg: 'javascript',
  color: '#F0DB4F',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Programming
}, {
  name: 'TypeScript',
  svg: 'typescript',
  color: '#007ACC',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Programming
}, {
  name: 'Node.js',
  svg: 'nodejs',
  color: '#8CC84B',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'Angular',
  svg: 'angular',
  color: '#DD0031',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Framework
}, {
  name: 'React',
  svg: 'react',
  color: '#00D8FF',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Framework
}, {
  name: 'Nest.js',
  svg: 'nestjs',
  color: '#F0DB4F',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Framework
}, {
  name: 'C++',
  svg: 'cplusplus',
  color: '#9B023A',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'HTML',
  svg: 'html',
  color: '#EF652A',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'CSS',
  svg: 'css',
  color: '#3C9CD7',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'SASS/SCSS',
  svg: 'sass',
  color: '#CD669A',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'Express JS',
  svg: 'express',
  color: '#3D3D3D',
  category: Skill_1.SkillCategory.Server | Skill_1.SkillCategory.Framework
}, {
  name: 'MongoDB',
  svg: 'mongodb',
  color: '#d44000',
  category: Skill_1.SkillCategory.Database
}, {
  name: 'Firebase',
  svg: 'firebase',
  color: '#FFCA28',
  category: Skill_1.SkillCategory.Database
}, {
  name: 'TensorFlow',
  svg: 'tensorflow',
  color: '#5557ff',
  category: Skill_1.SkillCategory.DataScience
}, {
  name: 'PyTorch',
  svg: 'pytorch',
  color: '#2B3539',
  category: Skill_1.SkillCategory.DataScience
}, {
  name: 'Git',
  svg: 'git',
  color: '#F05032',
  category: Skill_1.SkillCategory.Programming
}, {
  name: 'GNU Bash',
  svg: 'bash',
  color: '#2B3539',
  category: Skill_1.SkillCategory.Scripting
}, {
  name: 'Java',
  svg: 'java',
  color: '#007699',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'Python',
  svg: 'python',
  color: '#3776AB',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Scripting | Skill_1.SkillCategory.Server
}, {
  name: 'Spring',
  svg: 'spring',
  color: '#6DB33F',
  category: Skill_1.SkillCategory.Framework | Skill_1.SkillCategory.Server
}, {
  name: 'SQL',
  svg: 'sql',
  color: '#F89700',
  category: Skill_1.SkillCategory.Database
}, {
  name: 'AWS',
  svg: 'aws',
  color: '#3D3D3D',
  category: Skill_1.SkillCategory.DevOps | Skill_1.SkillCategory.Programming
}];

},{"../Classes/Elements/Skill":148,"core-js/modules/es6.object.define-property":117}],158:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Social = void 0;
exports.Social = [{
  name: 'GitHub',
  faClass: 'fab fa-github',
  link: 'https://github.com/Mohamed-Aymen-Ben-Slimen'
}, {
  name: 'LinkedIn',
  faClass: 'fab fa-linkedin',
  link: 'https://www.linkedin.com/in/mohamed-aymen-ben-slimen-758610190/'
}, {
  name: 'Email',
  faClass: 'fas fa-envelope',
  link: 'mailto:mohamed.aymen.ben.slimen@gmail.com'
}];

},{"core-js/modules/es6.object.define-property":117}],159:[function(require,module,exports){
"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.define-property");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementFactory = void 0;
var ElementFactory;

(function (ElementFactory) {
  var Fragment = '<></>';

  function createElement(tagName, attributes) {
    var children = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      children[_i - 2] = arguments[_i];
    }

    if (tagName === Fragment) {
      return document.createDocumentFragment();
    }

    var element = document.createElement(tagName);

    if (attributes) {
      for (var _a = 0, _b = Object.keys(attributes); _a < _b.length; _a++) {
        var key = _b[_a];
        var attributeValue = attributes[key];

        if (key === 'className') {
          element.setAttribute('class', attributeValue);
        } else if (key === 'style') {
          if (_typeof(attributeValue) === 'object') {
            element.setAttribute('style', JStoCSS(attributeValue));
          } else {
            element.setAttribute('style', attributeValue);
          }
        } else if (key.startsWith('on') && typeof attributeValue === 'function') {
          element.addEventListener(key.substring(2).toLowerCase(), attributeValue);
        } else {
          if (typeof attributeValue === 'boolean' && attributeValue) {
            element.setAttribute(key, '');
          } else {
            element.setAttribute(key, attributeValue);
          }
        }
      }
    }

    for (var _c = 0, children_1 = children; _c < children_1.length; _c++) {
      var child = children_1[_c];
      appendChild(element, child);
    }

    return element;
  }

  ElementFactory.createElement = createElement;

  function appendChild(parent, child) {
    if (typeof child === 'undefined' || child === null) {
      return;
    }

    if (Array.isArray(child)) {
      for (var _i = 0, child_1 = child; _i < child_1.length; _i++) {
        var value = child_1[_i];
        appendChild(parent, value);
      }
    } else if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      parent.appendChild(child);
    } else if (typeof child === 'boolean') {} else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }

  ElementFactory.appendChild = appendChild;

  function JStoCSS(cssObject) {
    var cssString = "";
    var rule;
    var rules = Object.keys(cssObject);

    for (var i = 0; i < rules.length; i++, cssString += ' ') {
      rule = rules[i];
      cssString += rule.replace(/([A-Z])/g, function (upper) {
        return "-" + upper[0].toLowerCase();
      }) + ": " + cssObject[rule] + ";";
    }

    return cssString;
  }
})(ElementFactory = exports.ElementFactory || (exports.ElementFactory = {}));

},{"core-js/modules/es6.array.is-array":106,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.keys":118,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.replace":126,"core-js/modules/es6.string.starts-with":131,"core-js/modules/es6.symbol":132,"core-js/modules/es7.symbol.async-iterator":135,"core-js/modules/web.dom.iterable":136}],160:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var About_1 = require("../Data/About");

var Qualities_1 = require("../Data/Qualities");

var Quality_1 = require("../Classes/Elements/Quality");

DOM_1.DOM.load().then(function (document) {
  WebPage_1.FlavorText.innerText = About_1.AboutMe;
});
DOM_1.DOM.load().then(function (document) {
  var object;

  for (var _i = 0, Qualities_2 = Qualities_1.Qualities; _i < Qualities_2.length; _i++) {
    var quality = Qualities_2[_i];
    object = new Quality_1.Quality(quality);
    object.appendTo(WebPage_1.QualitiesContainer);
  }
});

},{"../Classes/Elements/Quality":146,"../Data/About":151,"../Data/Qualities":156,"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],161:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.Body.addEventListener('touchstart', function () {}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],162:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Certificates_1 = require("../Classes/Elements/Certificates");

var Certificates_2 = require("../Data/Certificates");

DOM_1.DOM.load().then(function () {
  var CertificatesContainer = WebPage_1.Sections.get('certificates').element.querySelector('.certificates-container');
  var card;

  for (var _i = 0, Data_1 = Certificates_2.Certificates; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Certificates_1.Certificates(data);
    card.appendTo(CertificatesContainer);
  }
});

},{"../Classes/Elements/Certificates":140,"../Data/Certificates":152,"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],163:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Social_1 = require("../Classes/Elements/Social");

var Social_2 = require("../Data/Social");

DOM_1.DOM.load().then(function (document) {
  var card;

  for (var _i = 0, Data_1 = Social_2.Social; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Social_1.Social(data);
    card.appendTo(WebPage_1.SocialGrid);
  }
});

},{"../Classes/Elements/Social":150,"../Data/Social":158,"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],164:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

DOM_1.DOM.load().then(function (document) {
  DOM_1.DOM.getFirstElement('#connect .footer .copyright .year').innerText = new Date().getFullYear().toString();
});

},{"../Modules/DOM":171,"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],165:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Education_1 = require("../Classes/Elements/Education");

var Education_2 = require("../Data/Education");

DOM_1.DOM.load().then(function (document) {
  var EducationSection = WebPage_1.Sections.get('education').element;
  var card;

  for (var _i = 0, Data_1 = Education_2.Education; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Education_1.Education(data);
    card.appendTo(EducationSection);
  }
});

},{"../Classes/Elements/Education":141,"../Data/Education":153,"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],166:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Experience_1 = require("../Classes/Elements/Experience");

var Experience_2 = require("../Data/Experience");

DOM_1.DOM.load().then(function (document) {
  var ExperienceSection = WebPage_1.Sections.get('experience').element;
  var card;

  for (var _i = 0, Data_1 = Experience_2.Experience; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Experience_1.Experience(data);
    card.appendTo(ExperienceSection);
  }
});

},{"../Classes/Elements/Experience":142,"../Data/Experience":154,"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],167:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

var DOM_1 = require("../Modules/DOM");

DOM_1.DOM.load().then(function (document) {
  if (!DOM_1.DOM.isIE()) {
    WebPage_1.Logo.Outer.classList.remove('preload');
    setTimeout(function () {}, 400);
  } else {
    WebPage_1.Logo.Outer.className = 'outer';
    setTimeout(function () {
      WebPage_1.Logo.Inner.className = 'inner';
    }, 400);
  }
});

},{"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],168:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.MenuButton.subscribe(WebPage_1.Main, function (event) {
  if (event.name === 'toggle') {
    if (event.detail.open) {
      WebPage_1.Main.setAttribute('shifted', '');
    } else {
      WebPage_1.Main.removeAttribute('shifted');
    }
  }
});
WebPage_1.ScrollHook.addEventListener('scroll', function (event) {
  var _a;

  var section;
  var anchor;
  var iter = WebPage_1.SectionToMenu.values();
  var current = iter.next();

  for (var done = false; !done; current = iter.next(), done = current.done) {
    _a = current.value, section = _a[0], anchor = _a[1];

    if (section.inView()) {
      anchor.setAttribute('selected', '');
    } else {
      anchor.removeAttribute('selected');
    }
  }
}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":174,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/web.dom.iterable":136}],169:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

document.addEventListener('scroll', function (event) {
  WebPage_1.MenuButton.updateContrast();
}, {
  capture: true,
  passive: true
});
WebPage_1.MenuButton.Hamburger.addEventListener('click', function () {
  WebPage_1.MenuButton.toggle();
});
var iter = WebPage_1.SectionToMenu.values();
var current = iter.next();

var _loop_1 = function _loop_1(done) {
  var _a;

  var section;
  var anchor = void 0;
  _a = current.value, section = _a[0], anchor = _a[1];
  anchor.addEventListener('click', function (event) {
    event.preventDefault();
    section.element.scrollIntoView({
      behavior: 'smooth'
    });
  });
};

for (var done = false; !done; current = iter.next(), done = current.done) {
  _loop_1(done);
}

},{"../Modules/WebPage":174,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/web.dom.iterable":136}],170:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Project_1 = require("../Classes/Elements/Project");

var Projects_1 = require("../Data/Projects");

DOM_1.DOM.load().then(function () {
  var ProjectsContainer = WebPage_1.Sections.get('projects').element.querySelector('.projects-container');
  var card;

  for (var _i = 0, Data_1 = Projects_1.Projects; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Project_1.Project(data);
    card.appendTo(ProjectsContainer);
  }
});

},{"../Classes/Elements/Project":145,"../Data/Projects":155,"../Modules/DOM":171,"../Modules/WebPage":174,"core-js/modules/es6.object.define-property":117}],171:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es7.object.values");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOM = void 0;
var DOM;

(function (DOM) {
  function getElements(query) {
    return document.querySelectorAll(query);
  }

  DOM.getElements = getElements;

  function getFirstElement(query) {
    return this.getElements(query)[0];
  }

  DOM.getFirstElement = getFirstElement;

  function getViewport() {
    return {
      height: Math.max(window.innerHeight, document.documentElement.clientHeight),
      width: Math.max(window.innerWidth, document.documentElement.clientWidth)
    };
  }

  DOM.getViewport = getViewport;

  function getCenterOfViewport() {
    var _a = getViewport(),
        height = _a.height,
        width = _a.width;

    return {
      x: width / 2,
      y: height / 2
    };
  }

  DOM.getCenterOfViewport = getCenterOfViewport;

  function isIE() {
    return window.navigator.userAgent.match(/(MSIE|Trident)/) !== null;
  }

  DOM.isIE = isIE;

  function load() {
    return new Promise(function (resolve, reject) {
      if (document.readyState === 'complete') {
        resolve(document);
      } else {
        var callback_1 = function callback_1() {
          document.removeEventListener('DOMContentLoaded', callback_1);
          resolve(document);
        };

        document.addEventListener('DOMContentLoaded', callback_1);
      }
    });
  }

  DOM.load = load;

  function boundingClientRectToObject(rect) {
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      x: rect.x ? rect.x : 0,
      y: rect.y ? rect.y : 0
    };
  }

  function onPage(element) {
    var rect = element.getBoundingClientRect();
    return !Object.values(boundingClientRectToObject(rect)).every(function (val) {
      return val === 0;
    });
  }

  DOM.onPage = onPage;

  function getDOMName(element) {
    var str = element.tagName.toLowerCase();

    if (element.id) {
      str += '#' + element.id;
    }

    if (element.className) {
      str += '.' + element.className.replace(/ /g, '.');
    }

    return str;
  }

  DOM.getDOMName = getDOMName;

  function getDOMPath(element) {
    if (!element) {
      return [];
    }

    var path = [element];

    while (element = element.parentElement) {
      if (element.tagName.toLowerCase() === 'html') {
        break;
      }

      path.unshift(element);
    }

    return path;
  }

  DOM.getDOMPath = getDOMPath;

  function getDOMPathNames(element) {
    var path = getDOMPath(element);

    if (path.length === 0) {
      return [];
    }

    return path.map(function (element) {
      return getDOMName(element);
    });
  }

  DOM.getDOMPathNames = getDOMPathNames;

  function getCSSSelector(element, condense) {
    if (condense === void 0) {
      condense = true;
    }

    var names = getDOMPathNames(element);

    if (!condense || names.length <= 6) {
      return names.join(' > ');
    }

    var length = names.length;
    var begin = names.slice(0, 3);
    var end = names.slice(length - 3, length);
    return begin.join(' > ') + " > ... > " + end.join(' > ');
  }

  DOM.getCSSSelector = getCSSSelector;

  function getChildOffsetPosForContainer(container, child, caller) {
    if (caller === void 0) {
      caller = '';
    }

    var offsetTop = 0;
    var offsetLeft = 0;
    var curr = child;

    while (curr && curr !== container) {
      offsetTop += curr.offsetTop;
      offsetLeft += curr.offsetLeft;
      curr = curr.offsetParent;
    }

    if (!curr) {
      throw new Error((caller ? caller + " => " : '') + "\"" + getCSSSelector(child) + "\" does not contain \"" + getCSSSelector(container) + "\" as an offset parent. Check that the container has \"position: relative\" set or that it is in the DOM path.");
    }

    return {
      offsetTop: offsetTop,
      offsetLeft: offsetLeft
    };
  }

  DOM.getChildOffsetPosForContainer = getChildOffsetPosForContainer;

  function lines(top1, size1, top2, size2, offset) {
    return [top1 - offset, top1 - offset + size1, top2, top2 + size2];
  }

  function xyOffset(xOffset, yOffset, width, height) {
    if (xOffset && xOffset <= 1) {
      xOffset = width * xOffset;
    } else {
      xOffset = 0;
    }

    if (yOffset && yOffset <= 1) {
      yOffset = height * yOffset;
    } else {
      yOffset = 0;
    }

    return {
      xOffset: xOffset,
      yOffset: yOffset
    };
  }

  function inOffsetView(child, settings) {
    if (settings === void 0) {
      settings = {};
    }

    var container;
    var offsetTop;
    var offsetLeft;

    if (!settings.container) {
      container = child.offsetParent;

      if (!container) {
        throw new Error('inOffsetView(child, ...) => child.offsetParent cannot be null. Check that it is in a container with "position: relative" set.');
      }

      offsetTop = child.offsetTop;
      offsetLeft = child.offsetLeft;
    } else {
      var result = getChildOffsetPosForContainer(settings.container, child, 'inOffsetView(child, ...)');
      offsetTop = result.offsetTop;
      offsetLeft = result.offsetLeft;
    }

    var childRect = child.getBoundingClientRect();

    if (Object.values(boundingClientRectToObject(childRect)).every(function (val) {
      return val === 0;
    })) {
      return false;
    }

    var containerRect = container.getBoundingClientRect();

    var _a = xyOffset(settings.xOffset, settings.yOffset, containerRect.width, containerRect.height),
        xOffset = _a.xOffset,
        yOffset = _a.yOffset;

    var x = true;
    var y = true;

    if (!settings.ignoreY) {
      var _b = lines(container.scrollTop, containerRect.height, offsetTop, childRect.height, yOffset),
          containerTopLine = _b[0],
          containerBottomLine = _b[1],
          childTopLine = _b[2],
          childBottomLine = _b[3];

      y = settings.whole ? childBottomLine < containerBottomLine && childTopLine > containerTopLine : childBottomLine > containerTopLine && childTopLine < containerBottomLine;
    }

    if (!settings.ignoreX) {
      var _c = lines(container.scrollLeft, containerRect.width, offsetLeft, childRect.width, xOffset),
          containerLeftLine = _c[0],
          containerRightLine = _c[1],
          childLeftLine = _c[2],
          childRightLine = _c[3];

      x = settings.whole ? childRightLine < containerRightLine && childLeftLine > containerLeftLine : childRightLine > containerLeftLine && childLeftLine < containerRightLine;
    }

    return x && y;
  }

  DOM.inOffsetView = inOffsetView;

  function scrollTo(container, left, top, settings) {
    if (settings === void 0) {
      settings = {};
    }

    if (isIE()) {
      container.scrollLeft = left;
      container.scrollTop = top;
    } else {
      container.scrollTo({
        left: left,
        top: top,
        behavior: settings.smooth ? 'smooth' : 'auto'
      });
    }
  }

  function scrollContainerToViewWholeChild(container, child, settings) {
    if (settings === void 0) {
      settings = {};
    }

    var result = getChildOffsetPosForContainer(container, child, 'scrollContainerToViewChildWhole(...)');
    var offsetTop = result.offsetTop;
    var offsetLeft = result.offsetLeft;
    var containerRect = container.getBoundingClientRect();
    var childRect = child.getBoundingClientRect();

    var _a = xyOffset(settings.xOffset, settings.yOffset, containerRect.width, containerRect.height),
        xOffset = _a.xOffset,
        yOffset = _a.yOffset;

    var _b = lines(container.scrollTop, containerRect.height, offsetTop, childRect.height, yOffset),
        containerTopLine = _b[0],
        containerBottomLine = _b[1],
        childTopLine = _b[2],
        childBottomLine = _b[3];

    var _c = lines(container.scrollLeft, containerRect.width, offsetLeft, childRect.width, xOffset),
        containerLeftLine = _c[0],
        containerRightLine = _c[1],
        childLeftLine = _c[2],
        childRightLine = _c[3];

    var x = container.scrollLeft;
    var y = container.scrollTop;

    if (!settings.ignoreY) {
      var above = childTopLine < containerTopLine;
      var below = childBottomLine > containerBottomLine;

      if (above && !below) {
        y = childTopLine;
      } else if (!above && below) {
        y += childBottomLine - containerBottomLine;
      }
    }

    if (!settings.ignoreX) {
      var left = childLeftLine < containerLeftLine;
      var right = childRightLine > containerRightLine;

      if (left && !right) {
        x = childLeftLine;
      } else if (!left && right) {
        x += childRightLine - containerRightLine;
      }
    }

    scrollTo(container, x, y, settings);
  }

  DOM.scrollContainerToViewWholeChild = scrollContainerToViewWholeChild;

  function inVerticalWindowView(element, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var rect = element.getBoundingClientRect();

    if (Object.values(boundingClientRectToObject(rect)).every(function (val) {
      return val === 0;
    })) {
      return false;
    }

    var viewHeight = getViewport().height;

    if (offset <= 1) {
      offset = viewHeight * offset;
    }

    return rect.bottom + offset >= 0 && rect.top + offset - viewHeight < 0;
  }

  DOM.inVerticalWindowView = inVerticalWindowView;

  function pixelsBelowScreenTop(element) {
    return element.getBoundingClientRect().top;
  }

  DOM.pixelsBelowScreenTop = pixelsBelowScreenTop;

  function pixelsAboveScreenBottom(element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = getViewport().height;
    return viewHeight - rect.bottom;
  }

  DOM.pixelsAboveScreenBottom = pixelsAboveScreenBottom;

  function onFirstAppearance(element, callback, setting) {
    var timeout = setting ? setting.timeout : 0;
    var offset = setting ? setting.offset : 0;

    if (inVerticalWindowView(element, offset)) {
      setTimeout(callback, timeout);
    } else {
      var eventCallback_1 = function eventCallback_1(event) {
        if (inVerticalWindowView(element, offset)) {
          setTimeout(callback, timeout);
          document.removeEventListener('scroll', eventCallback_1, {
            capture: true
          });
        }
      };

      document.addEventListener('scroll', eventCallback_1, {
        capture: true,
        passive: true
      });
    }
  }

  DOM.onFirstAppearance = onFirstAppearance;

  function getPathToRoot(element) {
    var path = [];
    var curr = element;

    while (curr) {
      path.push(curr);
      curr = curr.parentElement;
    }

    if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
      path.push(document);
    }

    if (path.indexOf(window) === -1) {
      path.push(window);
    }

    return path;
  }

  DOM.getPathToRoot = getPathToRoot;
})(DOM = exports.DOM || (exports.DOM = {}));

},{"core-js/modules/es6.array.index-of":105,"core-js/modules/es6.array.is-array":106,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.array.map":108,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121,"core-js/modules/es6.regexp.match":125,"core-js/modules/es6.regexp.replace":126,"core-js/modules/es7.object.values":134,"core-js/modules/web.dom.iterable":136}],172:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.map");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.set");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Events = void 0;
var Events;

(function (Events) {
  var NewEvent = function () {
    function NewEvent(name, detail) {
      if (detail === void 0) {
        detail = null;
      }

      this.name = name;
      this.detail = detail;
    }

    return NewEvent;
  }();

  Events.NewEvent = NewEvent;

  var EventDispatcher = function () {
    function EventDispatcher() {
      this.events = new Set();
      this.listeners = new Map();
    }

    EventDispatcher.prototype.register = function (name) {
      this.events.add(name);
    };

    EventDispatcher.prototype.unregister = function (name) {
      this.events["delete"](name);
    };

    EventDispatcher.prototype.subscribe = function (element, callback) {
      this.listeners.set(element, callback);
    };

    EventDispatcher.prototype.unsubscribe = function (element) {
      this.listeners["delete"](element);
    };

    EventDispatcher.prototype.dispatch = function (name, detail) {
      if (detail === void 0) {
        detail = null;
      }

      if (!this.events.has(name)) {
        return false;
      }

      var event = new NewEvent(name, detail);
      var it = this.listeners.values();
      var callback;

      while (callback = it.next().value) {
        callback(event);
      }

      return true;
    };

    return EventDispatcher;
  }();

  Events.EventDispatcher = EventDispatcher;
})(Events = exports.Events || (exports.Events = {}));

},{"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.function.name":112,"core-js/modules/es6.map":113,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.set":128,"core-js/modules/es6.string.iterator":129,"core-js/modules/web.dom.iterable":136}],173:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVG = void 0;
var SVG;

(function (SVG) {
  SVG.svgns = 'http://www.w3.org/2000/svg';
  SVG.xlinkns = 'http://www.w3.org/1999/xlink';

  SVG.loadSVG = function (url) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url + ".svg", true);

      request.onload = function () {
        var parser = new DOMParser();
        var parsedDocument = parser.parseFromString(request.responseText, 'image/svg+xml');
        resolve(parsedDocument.querySelector('svg'));
      };

      request.onerror = function () {
        reject("Failed to read SVG.");
      };

      request.send();
    });
  };
})(SVG = exports.SVG || (exports.SVG = {}));

},{"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121}],174:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.from");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.map");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocialGrid = exports.SkillsGrid = exports.QualitiesContainer = exports.FlavorText = exports.Background = exports.SectionToMenu = exports.Sections = exports.SkillsFilterObject = exports.MenuButton = exports.Logo = exports.ScrollHook = exports.MainScroll = exports.Main = exports.Body = void 0;

var DOM_1 = require("./DOM");

var Section_1 = require("../Classes/Elements/Section");

var Menu_1 = require("../Classes/Elements/Menu");

var SkillsFilter_1 = require("../Classes/Elements/SkillsFilter");

exports.Body = DOM_1.DOM.getFirstElement('body');
exports.Main = DOM_1.DOM.getFirstElement('main');
exports.MainScroll = DOM_1.DOM.getFirstElement('main .scroll');
exports.ScrollHook = DOM_1.DOM.isIE() ? window : exports.MainScroll;
exports.Logo = {
  Outer: DOM_1.DOM.getFirstElement('header.logo .image img.outer'),
  Inner: DOM_1.DOM.getFirstElement('header.logo .image img.inner')
};
exports.MenuButton = new Menu_1.Menu();
exports.SkillsFilterObject = new SkillsFilter_1.SkillsFilter();
exports.Sections = new Map();

for (var _i = 0, _a = Array.from(DOM_1.DOM.getElements('section')); _i < _a.length; _i++) {
  var element = _a[_i];
  exports.Sections.set(element.id, new Section_1["default"](element));
}

exports.SectionToMenu = new Map();

for (var _b = 0, _c = Array.from(DOM_1.DOM.getElements('header.navigation .sections a')); _b < _c.length; _b++) {
  var anchor = _c[_b];
  var id = anchor.getAttribute('href').substr(1);

  if (exports.Sections.get(id) && exports.Sections.get(id).inMenu()) {
    exports.SectionToMenu.set(id, [exports.Sections.get(id), anchor]);
  }
}

exports.Background = DOM_1.DOM.getFirstElement('bg');
exports.FlavorText = DOM_1.DOM.getFirstElement('section#about .flavor');
exports.QualitiesContainer = DOM_1.DOM.getFirstElement('section#about .qualities');
exports.SkillsGrid = DOM_1.DOM.getFirstElement('section#skills .hex-grid');
exports.SocialGrid = DOM_1.DOM.getFirstElement('section#connect .social-icons');

},{"../Classes/Elements/Menu":144,"../Classes/Elements/Section":147,"../Classes/Elements/SkillsFilter":149,"./DOM":171,"core-js/modules/es6.array.from":104,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.map":113,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.string.iterator":129,"core-js/modules/web.dom.iterable":136}],175:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Animation = function () {
  function Animation(speed, max, min, increasing) {
    if (increasing === void 0) {
      increasing = false;
    }

    this.speed = speed;
    this.max = max;
    this.min = min;
    this.increasing = increasing;
  }

  return Animation;
}();

exports["default"] = Animation;

},{"core-js/modules/es6.object.define-property":117}],176:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationFrameFunctions = void 0;
var AnimationFrameFunctions;

(function (AnimationFrameFunctions) {
  function requestAnimationFrame() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }

  AnimationFrameFunctions.requestAnimationFrame = requestAnimationFrame;

  function cancelAnimationFrame() {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout;
  }

  AnimationFrameFunctions.cancelAnimationFrame = cancelAnimationFrame;
})(AnimationFrameFunctions = exports.AnimationFrameFunctions || (exports.AnimationFrameFunctions = {}));

},{"core-js/modules/es6.object.define-property":117}],177:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Color = function () {
  function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  Color.fromRGB = function (r, g, b) {
    if (r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256) {
      return new Color(r, g, b);
    } else {
      return null;
    }
  };

  Color.fromObject = function (obj) {
    return Color.fromRGB(obj.r, obj.g, obj.b);
  };

  Color.fromHex = function (hex) {
    return Color.fromObject(Color.hexToRGB(hex));
  };

  Color.hexToRGB = function (hex) {
    var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  Color.prototype.toString = function (opacity) {
    if (opacity === void 0) {
      opacity = 1;
    }

    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + opacity + ")";
  };

  return Color;
}();

exports["default"] = Color;

},{"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],178:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coordinate = function () {
  function Coordinate(x, y) {
    this.x = x;
    this.y = y;
  }

  Coordinate.prototype.distance = function (coord) {
    var dx = coord.x - this.x;
    var dy = coord.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Coordinate.prototype.toString = function () {
    return this.x + "x" + this.y;
  };

  return Coordinate;
}();

exports["default"] = Coordinate;

},{"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],179:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":117}],180:[function(require,module,exports){
"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.object.define-property");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Animation_1 = require("./Animation");

var Color_1 = require("./Color");

var Coordinate_1 = require("./Coordinate");

var Stroke_1 = require("./Stroke");

var Vector_1 = require("./Vector");

var Particle = function () {
  function Particle(settings) {
    this.opacityAnimation = null;
    this.radiusAnimation = null;
    this.color = this.createColor(settings.color);
    this.opacity = this.createOpacity(settings.opacity);
    this.velocity = this.createVelocity(settings.move);
    this.shape = this.createShape(settings.shape);
    this.stroke = this.createStroke(settings.stroke);
    this.radius = this.createRadius(settings.radius);

    if (settings.animate) {
      if (settings.animate.opacity) {
        this.opacityAnimation = this.animateOpacity(settings.animate.opacity);
      }

      if (settings.animate.radius) {
        this.radiusAnimation = this.animateRadius(settings.animate.radius);
      }
    }

    this.bubbled = {
      opacity: 0,
      radius: 0
    };
  }

  Particle.prototype.createColor = function (color) {
    if (typeof color === 'string') {
      if (color === 'random') {
        return Color_1["default"].fromRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
      } else {
        return Color_1["default"].fromHex(color);
      }
    } else if (_typeof(color) === 'object') {
      if (color instanceof Color_1["default"]) {
        return color;
      } else if (color instanceof Array) {
        return this.createColor(color[Math.floor(Math.random() * color.length)]);
      } else {
        return Color_1["default"].fromObject(color);
      }
    }

    return Color_1["default"].fromRGB(0, 0, 0);
  };

  Particle.prototype.createOpacity = function (opacity) {
    if (_typeof(opacity) === 'object') {
      if (opacity instanceof Array) {
        return this.createOpacity(opacity[Math.floor(Math.random() * opacity.length)]);
      }
    } else if (typeof opacity === 'string') {
      if (opacity === 'random') {
        return Math.random();
      }
    } else if (typeof opacity === 'number') {
      if (opacity >= 0) {
        return opacity;
      }
    }

    return 1;
  };

  Particle.prototype.createVelocity = function (move) {
    if (typeof move === 'boolean') {
      if (!move) {
        return new Vector_1["default"](0, 0);
      }
    } else if (_typeof(move) === 'object') {
      var velocity = void 0;

      switch (move.direction) {
        case 'top':
          velocity = new Vector_1["default"](0, -1);
          break;

        case 'top-right':
          velocity = new Vector_1["default"](0.7, -0.7);
          break;

        case 'right':
          velocity = new Vector_1["default"](1, 0);
          break;

        case 'bottom-right':
          velocity = new Vector_1["default"](0.7, 0.7);
          break;

        case 'bottom':
          velocity = new Vector_1["default"](0, 1);
          break;

        case 'bottom-left':
          velocity = new Vector_1["default"](-0.7, 0.7);
          break;

        case 'left':
          velocity = new Vector_1["default"](-1, 0);
          break;

        case 'top-left':
          velocity = new Vector_1["default"](-0.7, -0.7);
          break;

        default:
          velocity = new Vector_1["default"](0, 0);
          break;
      }

      if (move.straight) {
        if (move.random) {
          velocity.x *= Math.random();
          velocity.y *= Math.random();
        }
      } else {
        velocity.x += Math.random() - 0.5;
        velocity.y += Math.random() - 0.5;
      }

      return velocity;
    }

    return new Vector_1["default"](0, 0);
  };

  Particle.prototype.createShape = function (shape) {
    if (_typeof(shape) === 'object') {
      if (shape instanceof Array) {
        return this.createShape(shape[Math.floor(Math.random() * shape.length)]);
      }
    } else if (typeof shape === 'string') {
      var sides = parseInt(shape.substring(0, shape.indexOf('-')));

      if (!isNaN(sides)) {
        return this.createShape(sides);
      }

      return shape;
    } else if (typeof shape === 'number') {
      if (shape >= 3) {
        return shape;
      }
    }

    return 'circle';
  };

  Particle.prototype.createStroke = function (stroke) {
    if (_typeof(stroke) === 'object') {
      if (typeof stroke.width === 'number') {
        if (stroke.width > 0) {
          return new Stroke_1["default"](stroke.width, this.createColor(stroke.color));
        }
      }
    }

    return new Stroke_1["default"](0, Color_1["default"].fromRGB(0, 0, 0));
  };

  Particle.prototype.createRadius = function (radius) {
    if (_typeof(radius) === 'object') {
      if (radius instanceof Array) {
        return this.createRadius(radius[Math.floor(Math.random() * radius.length)]);
      }
    } else if (typeof radius === 'string') {
      if (radius === 'random') {
        return Math.random();
      }
    } else if (typeof radius === 'number') {
      if (radius >= 0) {
        return radius;
      }
    }

    return 5;
  };

  Particle.prototype.parseSpeed = function (speed) {
    if (speed > 0) {
      return speed;
    }

    return 0.5;
  };

  Particle.prototype.animateOpacity = function (animation) {
    if (animation) {
      var max = this.opacity;
      var min = this.createOpacity(animation.min);
      var speed = this.parseSpeed(animation.speed) / 100;

      if (!animation.sync) {
        speed *= Math.random();
      }

      this.opacity *= Math.random();
      return new Animation_1["default"](speed, max, min);
    }

    return null;
  };

  Particle.prototype.animateRadius = function (animation) {
    if (animation) {
      var max = this.radius;
      var min = this.createRadius(animation.min);
      var speed = this.parseSpeed(animation.speed) / 100;

      if (!animation.sync) {
        speed *= Math.random();
      }

      this.opacity *= Math.random();
      return new Animation_1["default"](speed, max, min);
    }

    return null;
  };

  Particle.prototype.setPosition = function (position) {
    this.position = position;
  };

  Particle.prototype.move = function (speed) {
    this.position.x += this.velocity.x * speed;
    this.position.y += this.velocity.y * speed;
  };

  Particle.prototype.getRadius = function () {
    return this.radius + this.bubbled.radius;
  };

  Particle.prototype.getOpacity = function () {
    return this.opacity + this.bubbled.opacity;
  };

  Particle.prototype.edge = function (dir) {
    switch (dir) {
      case 'top':
        return new Coordinate_1["default"](this.position.x, this.position.y - this.getRadius());

      case 'right':
        return new Coordinate_1["default"](this.position.x + this.getRadius(), this.position.y);

      case 'bottom':
        return new Coordinate_1["default"](this.position.x, this.position.y + this.getRadius());

      case 'left':
        return new Coordinate_1["default"](this.position.x - this.getRadius(), this.position.y);

      default:
        return this.position;
    }
  };

  Particle.prototype.intersecting = function (particle) {
    return this.position.distance(particle.position) < this.getRadius() + particle.getRadius();
  };

  Particle.prototype.bubble = function (mouse, settings) {
    var distance = this.position.distance(mouse.position);
    var ratio = 1 - distance / settings.distance;

    if (ratio >= 0 && mouse.over) {
      this.bubbled.opacity = ratio * (settings.opacity - this.opacity);
      this.bubbled.radius = ratio * (settings.radius - this.radius);
    } else {
      this.bubbled.opacity = 0;
      this.bubbled.radius = 0;
    }
  };

  return Particle;
}();

exports["default"] = Particle;

},{"./Animation":175,"./Color":177,"./Coordinate":178,"./Stroke":183,"./Vector":184,"core-js/modules/es6.array.index-of":105,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.symbol":132,"core-js/modules/es7.symbol.async-iterator":135}],181:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":117}],182:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.fill");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AnimationFrameFunctions_1 = require("./AnimationFrameFunctions");

var DOM_1 = require("../Modules/DOM");

var Coordinate_1 = require("./Coordinate");

var Particle_1 = require("./Particle");

var Particles = function () {
  function Particles(cssQuery, context) {
    this.state = 'stopped';
    this.pixelRatioLimit = 8;
    this.pixelRatio = 1;
    this.particles = new Array();
    this.mouse = {
      position: new Coordinate_1["default"](0, 0),
      over: false
    };
    this.handleResize = null;
    this.animationFrame = null;
    this.mouseEventsAttached = false;
    this.canvas = DOM_1.DOM.getFirstElement(cssQuery);

    if (this.canvas === null) {
      throw "Canvas ID " + cssQuery + " not found.";
    }

    this.ctx = this.canvas.getContext(context);
    window.requestAnimationFrame = AnimationFrameFunctions_1.AnimationFrameFunctions.requestAnimationFrame();
    window.cancelAnimationFrame = AnimationFrameFunctions_1.AnimationFrameFunctions.cancelAnimationFrame();
    this.particleSettings = {
      number: 350,
      density: 1000,
      color: '#FFFFFF',
      opacity: 1,
      radius: 5,
      shape: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      move: {
        speed: 0.4,
        direction: 'bottom',
        straight: true,
        random: true,
        edgeBounce: false,
        attract: false
      },
      events: {
        resize: true,
        hover: false,
        click: false
      },
      animate: {
        opacity: false,
        radius: false
      }
    };
    this.interactiveSettings = {
      hover: {
        bubble: {
          distance: 75,
          radius: 7,
          opacity: 1
        },
        repulse: {
          distance: 100
        }
      },
      click: {
        add: {
          number: 4
        },
        remove: {
          number: 2
        }
      }
    };
  }

  Particles.prototype.initialize = function () {
    this.trackMouse();
    this.initializePixelRatio(window.devicePixelRatio >= this.pixelRatioLimit ? this.pixelRatioLimit - 2 : window.devicePixelRatio);
    this.setCanvasSize();
    this.clear();
    this.removeParticles();
    this.createParticles();
    this.distributeParticles();
  };

  Particles.prototype.trackMouse = function () {
    var _this = this;

    if (this.mouseEventsAttached) {
      return;
    }

    if (this.particleSettings.events) {
      if (this.particleSettings.events.hover) {
        this.canvas.addEventListener('mousemove', function (event) {
          _this.mouse.position.x = event.offsetX * _this.pixelRatio;
          _this.mouse.position.y = event.offsetY * _this.pixelRatio;
          _this.mouse.over = true;
        });
        this.canvas.addEventListener('mouseleave', function () {
          _this.mouse.position.x = null;
          _this.mouse.position.y = null;
          _this.mouse.over = false;
        });
      }

      if (this.particleSettings.events.click) {}
    }

    this.mouseEventsAttached = true;
  };

  Particles.prototype.initializePixelRatio = function (newRatio) {
    if (newRatio === void 0) {
      newRatio = window.devicePixelRatio;
    }

    var multiplier = newRatio / this.pixelRatio;
    this.width = this.canvas.offsetWidth * multiplier;
    this.height = this.canvas.offsetHeight * multiplier;

    if (this.particleSettings.radius instanceof Array) {
      this.particleSettings.radius = this.particleSettings.radius.map(function (r) {
        return r * multiplier;
      });
    } else {
      if (typeof this.particleSettings.radius === 'number') {
        this.particleSettings.radius *= multiplier;
      }
    }

    if (this.particleSettings.move) {
      this.particleSettings.move.speed *= multiplier;
    }

    if (this.particleSettings.animate && this.particleSettings.animate.radius) {
      this.particleSettings.animate.radius.speed *= multiplier;
    }

    if (this.interactiveSettings.hover) {
      if (this.interactiveSettings.hover.bubble) {
        this.interactiveSettings.hover.bubble.radius *= multiplier;
        this.interactiveSettings.hover.bubble.distance *= multiplier;
      }

      if (this.interactiveSettings.hover.repulse) {
        this.interactiveSettings.hover.repulse.distance *= multiplier;
      }
    }

    this.pixelRatio = newRatio;
  };

  Particles.prototype.checkZoom = function () {
    if (window.devicePixelRatio !== this.pixelRatio && window.devicePixelRatio < this.pixelRatioLimit) {
      this.stopDrawing();
      this.initialize();
      this.draw();
    }
  };

  Particles.prototype.setCanvasSize = function () {
    var _this = this;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.particleSettings.events && this.particleSettings.events.resize) {
      this.handleResize = function () {
        _this.checkZoom();

        _this.width = _this.canvas.offsetWidth * _this.pixelRatio;
        _this.height = _this.canvas.offsetHeight * _this.pixelRatio;
        _this.canvas.width = _this.width;
        _this.canvas.height = _this.height;

        if (!_this.particleSettings.move) {
          _this.removeParticles();

          _this.createParticles();

          _this.drawParticles();
        }

        _this.distributeParticles();
      };

      window.addEventListener('resize', this.handleResize);
    }
  };

  Particles.prototype.getFill = function () {
    return this.ctx.fillStyle;
  };

  Particles.prototype.setFill = function (color) {
    this.ctx.fillStyle = color;
  };

  Particles.prototype.setStroke = function (stroke) {
    this.ctx.strokeStyle = stroke.color.toString();
    this.ctx.lineWidth = stroke.width;
  };

  Particles.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Particles.prototype.draw = function () {
    this.drawParticles();
    if (this.particleSettings.move) this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
  };

  Particles.prototype.stopDrawing = function () {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
      this.handleResize = null;
    }

    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  };

  Particles.prototype.drawPolygon = function (center, radius, sides) {
    var diagonalAngle = 360 / sides;
    diagonalAngle *= Math.PI / 180;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(center.x, center.y);
    this.ctx.rotate(diagonalAngle / (sides % 2 ? 4 : 2));
    this.ctx.moveTo(radius, 0);
    var angle;

    for (var s = 0; s < sides; s++) {
      angle = s * diagonalAngle;
      this.ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    this.ctx.fill();
    this.ctx.restore();
  };

  Particles.prototype.drawParticle = function (particle) {
    var opacity = particle.getOpacity();
    var radius = particle.getRadius();
    this.setFill(particle.color.toString(opacity));
    this.ctx.beginPath();

    if (typeof particle.shape === 'number') {
      this.drawPolygon(particle.position, radius, particle.shape);
    } else {
      switch (particle.shape) {
        default:
        case 'circle':
          this.ctx.arc(particle.position.x, particle.position.y, radius, 0, Math.PI * 2, false);
          break;
      }
    }

    this.ctx.closePath();

    if (particle.stroke.width > 0) {
      this.setStroke(particle.stroke);
      this.ctx.stroke();
    }

    this.ctx.fill();
  };

  Particles.prototype.getNewPosition = function () {
    return new Coordinate_1["default"](Math.random() * this.canvas.width, Math.random() * this.canvas.height);
  };

  Particles.prototype.checkPosition = function (particle) {
    if (this.particleSettings.move) {
      if (this.particleSettings.move.edgeBounce) {
        if (particle.edge('left').x < 0) particle.position.x += particle.getRadius();else if (particle.edge('right').x > this.width) particle.position.x -= particle.getRadius();
        if (particle.edge('top').y < 0) particle.position.y += particle.getRadius();else if (particle.edge('bottom').y > this.height) particle.position.y -= particle.getRadius();
      }
    }

    return true;
  };

  Particles.prototype.distributeParticles = function () {
    if (this.particleSettings.density && typeof this.particleSettings.density === 'number') {
      var area = this.canvas.width * this.canvas.height / 1000;
      area /= this.pixelRatio * 2;
      var particlesPerArea = area * this.particleSettings.number / this.particleSettings.density;
      var missing = particlesPerArea - this.particles.length;

      if (missing > 0) {
        this.createParticles(missing);
      } else {
        this.removeParticles(Math.abs(missing));
      }
    }
  };

  Particles.prototype.createParticles = function (number, position) {
    if (number === void 0) {
      number = this.particleSettings.number;
    }

    if (position === void 0) {
      position = null;
    }

    if (!this.particleSettings) throw 'Particle settings must be initalized before a particle is created.';
    var particle;

    for (var p = 0; p < number; p++) {
      particle = new Particle_1["default"](this.particleSettings);

      if (position) {
        particle.setPosition(position);
      } else {
        do {
          particle.setPosition(this.getNewPosition());
        } while (!this.checkPosition(particle));
      }

      this.particles.push(particle);
    }
  };

  Particles.prototype.removeParticles = function (number) {
    if (number === void 0) {
      number = null;
    }

    if (!number) {
      this.particles = new Array();
    } else {
      this.particles.splice(0, number);
    }
  };

  Particles.prototype.updateParticles = function () {
    for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
      var particle = _a[_i];

      if (this.particleSettings.move) {
        particle.move(this.particleSettings.move.speed);

        if (!this.particleSettings.move.edgeBounce) {
          if (particle.edge('right').x < 0) {
            particle.setPosition(new Coordinate_1["default"](this.width + particle.getRadius(), Math.random() * this.height));
          } else if (particle.edge('left').x > this.width) {
            particle.setPosition(new Coordinate_1["default"](-1 * particle.getRadius(), Math.random() * this.height));
          }

          if (particle.edge('bottom').y < 0) {
            particle.setPosition(new Coordinate_1["default"](Math.random() * this.width, this.height + particle.getRadius()));
          } else if (particle.edge('top').y > this.height) {
            particle.setPosition(new Coordinate_1["default"](Math.random() * this.width, -1 * particle.getRadius()));
          }
        }

        if (this.particleSettings.move.edgeBounce) {
          if (particle.edge('left').x < 0 || particle.edge('right').x > this.width) {
            particle.velocity.flip(true, false);
          }

          if (particle.edge('top').y < 0 || particle.edge('bottom').y > this.height) {
            particle.velocity.flip(false, true);
          }
        }
      }

      if (this.particleSettings.animate) {
        if (this.particleSettings.animate.opacity) {
          if (particle.opacity >= particle.opacityAnimation.max) {
            particle.opacityAnimation.increasing = false;
          } else if (particle.opacity <= particle.opacityAnimation.min) {
            particle.opacityAnimation.increasing = true;
          }

          particle.opacity += particle.opacityAnimation.speed * (particle.opacityAnimation.increasing ? 1 : -1);

          if (particle.opacity < 0) {
            particle.opacity = 0;
          }
        }

        if (this.particleSettings.animate.radius) {
          if (particle.radius >= particle.radiusAnimation.max) {
            particle.radiusAnimation.increasing = false;
          } else if (particle.radius <= particle.radiusAnimation.min) {
            particle.radiusAnimation.increasing = true;
          }

          particle.radius += particle.radiusAnimation.speed * (particle.radiusAnimation.increasing ? 1 : -1);

          if (particle.radius < 0) {
            particle.radius = 0;
          }
        }
      }

      if (this.particleSettings.events) {
        if (this.particleSettings.events.hover === 'bubble' && this.interactiveSettings.hover && this.interactiveSettings.hover.bubble) {
          particle.bubble(this.mouse, this.interactiveSettings.hover.bubble);
        }
      }
    }
  };

  Particles.prototype.drawParticles = function () {
    this.clear();
    this.updateParticles();

    for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
      var particle = _a[_i];
      this.drawParticle(particle);
    }
  };

  Particles.prototype.setParticleSettings = function (settings) {
    if (this.state !== 'stopped') {
      throw 'Cannot change settings while Canvas is running.';
    } else {
      this.particleSettings = settings;
    }
  };

  Particles.prototype.setInteractiveSettings = function (settings) {
    if (this.state !== 'stopped') {
      throw 'Cannot change settings while Canvas is running.';
    } else {
      this.interactiveSettings = settings;
    }
  };

  Particles.prototype.start = function () {
    if (this.particleSettings === null) throw 'Particle settings must be initalized before Canvas can start.';
    if (this.state !== 'stopped') throw 'Canvas is already running.';
    this.state = 'running';
    this.initialize();
    this.draw();
  };

  Particles.prototype.pause = function () {
    if (this.state === 'stopped') {
      throw 'No Particles to pause.';
    }

    this.state = 'paused';
    this.moveSettings = this.particleSettings.move;
    this.particleSettings.move = false;
  };

  Particles.prototype.resume = function () {
    if (this.state === 'stopped') {
      throw 'No Particles to resume.';
    }

    this.state = 'running';
    this.particleSettings.move = this.moveSettings;
    this.draw();
  };

  Particles.prototype.stop = function () {
    this.state = 'stopped';
    this.stopDrawing();
  };

  return Particles;
}();

exports["default"] = Particles;

},{"../Modules/DOM":171,"./AnimationFrameFunctions":176,"./Coordinate":178,"./Particle":180,"core-js/modules/es6.array.fill":101,"core-js/modules/es6.array.map":108,"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.function.bind":111,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],183:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Stroke = function () {
  function Stroke(width, color) {
    this.width = width;
    this.color = color;
  }

  return Stroke;
}();

exports["default"] = Stroke;

},{"core-js/modules/es6.object.define-property":117}],184:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector = function () {
  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype.flip = function (x, y) {
    if (x === void 0) {
      x = true;
    }

    if (y === void 0) {
      y = true;
    }

    if (x) {
      this.x *= -1;
    }

    if (y) {
      this.y *= -1;
    }
  };

  Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.angle = function () {
    return Math.tan(this.y / this.x);
  };

  return Vector;
}();

exports["default"] = Vector;

},{"core-js/modules/es6.object.define-property":117}]},{},[137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,182,181,183,184])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1yZWR1Y2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZnVuY3Rpb24tdG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wbi1leHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC10by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BlcmZvcm0uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9taXNlLXJlc29sdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWdleHAtZXhlYy1hYnN0cmFjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZ2V4cC1leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaWN0LW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1jb250ZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWh0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctdHJpbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy13cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZvci1lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmluZGV4LW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LnJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmRhdGUudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24uYmluZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLm1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmxpbmsuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QuZW50cmllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC52YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJvdXQvdHMvQ2FudmFzL0NhbnZhcy5qcyIsIm91dC90cy9DYW52YXMvU3RhcnMuanMiLCJvdXQvdHMvQ2xhc3Nlcy9Db21wb25lbnQvaW5kZXguanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9DZXJ0aWZpY2F0ZXMuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9FeHBlcmllbmNlLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvSGVscGVycy9pbmRleC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL01lbnUuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Qcm9qZWN0LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvUXVhbGl0eS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NraWxsc0ZpbHRlci5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NvY2lhbC5qcyIsIm91dC90cy9EYXRhL0Fib3V0LmpzIiwib3V0L3RzL0RhdGEvQ2VydGlmaWNhdGVzLmpzIiwib3V0L3RzL0RhdGEvRWR1Y2F0aW9uLmpzIiwib3V0L3RzL0RhdGEvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9EYXRhL1Byb2plY3RzLmpzIiwib3V0L3RzL0RhdGEvUXVhbGl0aWVzLmpzIiwib3V0L3RzL0RhdGEvU2tpbGxzLmpzIiwib3V0L3RzL0RhdGEvU29jaWFsLmpzIiwib3V0L3RzL0RlZmluaXRpb25zL0pTWC5qcyIsIm91dC90cy9FdmVudHMvQWJvdXQuanMiLCJvdXQvdHMvRXZlbnRzL0JvZHkuanMiLCJvdXQvdHMvRXZlbnRzL0NlcnRpZmljYXRlcy5qcyIsIm91dC90cy9FdmVudHMvQ29ubmVjdC5qcyIsIm91dC90cy9FdmVudHMvQ29weXJpZ2h0WWVhci5qcyIsIm91dC90cy9FdmVudHMvRWR1Y2F0aW9uLmpzIiwib3V0L3RzL0V2ZW50cy9FeHBlcmllbmNlLmpzIiwib3V0L3RzL0V2ZW50cy9Mb2dvLmpzIiwib3V0L3RzL0V2ZW50cy9NYWluLmpzIiwib3V0L3RzL0V2ZW50cy9NZW51LmpzIiwib3V0L3RzL0V2ZW50cy9Qcm9qZWN0cy5qcyIsIm91dC90cy9Nb2R1bGVzL0RPTS5qcyIsIm91dC90cy9Nb2R1bGVzL0V2ZW50RGlzcGF0Y2hlci5qcyIsIm91dC90cy9Nb2R1bGVzL1NWRy5qcyIsIm91dC90cy9Nb2R1bGVzL1dlYlBhZ2UuanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbi5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuanMiLCJvdXQvdHMvUGFydGljbGVzL0NvbG9yLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db29yZGluYXRlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Nb3VzZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGUuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlU2V0dGluZ3MuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlcy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvU3Ryb2tlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9WZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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RUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFqQixHQUE2QixZQUFZO0FBQ3JDLFdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVyxLQUFLLENBQUwsR0FBUyxLQUFLLENBQWYsR0FBcUIsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUE3QyxDQUFQO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEtBQWpCLEdBQXlCLFlBQVk7QUFDakMsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBdkIsQ0FBUDtBQUNILEdBRkQ7O0FBR0EsU0FBTyxNQUFQO0FBQ0gsQ0F0QmEsRUFBZDs7QUF1QkEsT0FBTyxXQUFQLEdBQWtCLE1BQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcbmlmIChBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHJlcXVpcmUoJy4vX2hpZGUnKShBcnJheVByb3RvLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4gLy8gYEFkdmFuY2VTdHJpbmdJbmRleGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hZHZhbmNlc3RyaW5naW5kZXhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFMsIGluZGV4LCB1bmljb2RlKSB7XG4gIHJldHVybiBpbmRleCArICh1bmljb2RlID8gYXQoUywgaW5kZXgpLmxlbmd0aCA6IDEpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyogLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pIHtcbiAgdmFyIE8gPSB0b09iamVjdCh0aGlzKTtcbiAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIGxlbmd0aCk7XG4gIHZhciBlbmQgPSBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgdmFyIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9BYnNvbHV0ZUluZGV4KGVuZCwgbGVuZ3RoKTtcbiAgd2hpbGUgKGVuZFBvcyA+IGluZGV4KSBPW2luZGV4KytdID0gdmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFzYyA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUWVBFLCAkY3JlYXRlKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgdmFyIGNyZWF0ZSA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJT2JqZWN0KE8pO1xuICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsLCByZXM7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSByZXN1bHRbaW5kZXhdID0gcmVzOyAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXMpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07XG4iLCJ2YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCBjYWxsYmFja2ZuLCBhTGVuLCBtZW1vLCBpc1JpZ2h0KSB7XG4gIGFGdW5jdGlvbihjYWxsYmFja2ZuKTtcbiAgdmFyIE8gPSB0b09iamVjdCh0aGF0KTtcbiAgdmFyIHNlbGYgPSBJT2JqZWN0KE8pO1xuICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICB2YXIgaW5kZXggPSBpc1JpZ2h0ID8gbGVuZ3RoIC0gMSA6IDA7XG4gIHZhciBpID0gaXNSaWdodCA/IC0xIDogMTtcbiAgaWYgKGFMZW4gPCAyKSBmb3IgKDs7KSB7XG4gICAgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgIG1lbW8gPSBzZWxmW2luZGV4XTtcbiAgICAgIGluZGV4ICs9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaW5kZXggKz0gaTtcbiAgICBpZiAoaXNSaWdodCA/IGluZGV4IDwgMCA6IGxlbmd0aCA8PSBpbmRleCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgfVxuICB9XG4gIGZvciAoO2lzUmlnaHQgPyBpbmRleCA+PSAwIDogbGVuZ3RoID4gaW5kZXg7IGluZGV4ICs9IGkpIGlmIChpbmRleCBpbiBzZWxmKSB7XG4gICAgbWVtbyA9IGNhbGxiYWNrZm4obWVtbywgc2VsZltpbmRleF0sIGluZGV4LCBPKTtcbiAgfVxuICByZXR1cm4gbWVtbztcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsKSkge1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTtcbiIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgYXJyYXlTbGljZSA9IFtdLnNsaWNlO1xudmFyIGZhY3RvcmllcyA9IHt9O1xuXG52YXIgY29uc3RydWN0ID0gZnVuY3Rpb24gKEYsIGxlbiwgYXJncykge1xuICBpZiAoIShsZW4gaW4gZmFjdG9yaWVzKSkge1xuICAgIGZvciAodmFyIG4gPSBbXSwgaSA9IDA7IGkgPCBsZW47IGkrKykgbltpXSA9ICdhWycgKyBpICsgJ10nO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgIGZhY3Rvcmllc1tsZW5dID0gRnVuY3Rpb24oJ0YsYScsICdyZXR1cm4gbmV3IEYoJyArIG4uam9pbignLCcpICsgJyknKTtcbiAgfSByZXR1cm4gZmFjdG9yaWVzW2xlbl0oRiwgYXJncyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmJpbmQgfHwgZnVuY3Rpb24gYmluZCh0aGF0IC8qICwgLi4uYXJncyAqLykge1xuICB2YXIgZm4gPSBhRnVuY3Rpb24odGhpcyk7XG4gIHZhciBwYXJ0QXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgYm91bmQgPSBmdW5jdGlvbiAoLyogYXJncy4uLiAqLykge1xuICAgIHZhciBhcmdzID0gcGFydEFyZ3MuY29uY2F0KGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gY29uc3RydWN0KGZuLCBhcmdzLmxlbmd0aCwgYXJncykgOiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xuICBpZiAoaXNPYmplY3QoZm4ucHJvdG90eXBlKSkgYm91bmQucHJvdG90eXBlID0gZm4ucHJvdG90eXBlO1xuICByZXR1cm4gYm91bmQ7XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGZhc3RLZXkgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTSVpFID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbiAodGhhdCwga2V5KSB7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSk7XG4gIHZhciBlbnRyeTtcbiAgaWYgKGluZGV4ICE9PSAnRicpIHJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvciAoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgaWYgKGVudHJ5LmsgPT0ga2V5KSByZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpIHtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5fdCA9IE5BTUU7ICAgICAgICAgLy8gY29sbGVjdGlvbiB0eXBlXG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgZm9yICh2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKGVudHJ5LnApIGVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uO1xuICAgICAgICAgIHZhciBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAocHJldikgcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZiAobmV4dCkgbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZiAodGhhdC5fZiA9PSBlbnRyeSkgdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYgKHRoYXQuX2wgPT0gZW50cnkpIHRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgICAgICB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpO1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIHdoaWxlIChlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2YpIHtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSwga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoREVTQ1JJUFRPUlMpIGRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUodGhpcywgTkFNRSlbU0laRV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgIHZhciBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmICghdGhhdC5fZikgdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYgKHByZXYpIHByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZiAoaW5kZXggIT09ICdGJykgdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24gKEMsIE5BTUUsIElTX01BUCkge1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgICAgIHRoaXMuX3QgPSB2YWxpZGF0ZShpdGVyYXRlZCwgTkFNRSk7IC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgICAgICAgICAgICAgICAgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIga2luZCA9IHRoYXQuX2s7XG4gICAgICB2YXIgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmICghdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKSB7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgJGl0ZXJEZXRlY3QgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspIHtcbiAgdmFyIEJhc2UgPSBnbG9iYWxbTkFNRV07XG4gIHZhciBDID0gQmFzZTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZTtcbiAgdmFyIE8gPSB7fTtcbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2hhcycgPyBmdW5jdGlvbiBoYXMoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyB1bmRlZmluZWQgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyByZXR1cm4gdGhpczsgfVxuICAgICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZiAodHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgIHZhciBIQVNOVF9DSEFJTklORyA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2U7XG4gICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgdmFyIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBpbnN0YW5jZS5oYXMoMSk7IH0pO1xuICAgIC8vIG1vc3QgZWFybHkgaW1wbGVtZW50YXRpb25zIGRvZXNuJ3Qgc3VwcG9ydHMgaXRlcmFibGVzLCBtb3N0IG1vZGVybiAtIG5vdCBjbG9zZSBpdCBjb3JyZWN0bHlcbiAgICB2YXIgQUNDRVBUX0lURVJBQkxFUyA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uIChpdGVyKSB7IG5ldyBDKGl0ZXIpOyB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgICB2YXIgaW5kZXggPSA1O1xuICAgICAgd2hpbGUgKGluZGV4LS0pICRpbnN0YW5jZVtBRERFUl0oaW5kZXgsIGluZGV4KTtcbiAgICAgIHJldHVybiAhJGluc3RhbmNlLmhhcygtMCk7XG4gICAgfSk7XG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbiAodGFyZ2V0LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UoKSwgdGFyZ2V0LCBDKTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmIChCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKSBmaXhNZXRob2QoQURERVIpO1xuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYgKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpIGRlbGV0ZSBwcm90by5jbGVhcjtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChDICE9IEJhc2UpLCBPKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi42LjUnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHJlc3VsdCA9IGdldEtleXMoaXQpO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYgKGdldFN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpO1xuICAgIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAoc3ltYm9scy5sZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJ2YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgcmUgPSAvLi87XG4gIHRyeSB7XG4gICAgJy8uLydbS0VZXShyZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgcmVbTUFUQ0hdID0gZmFsc2U7XG4gICAgICByZXR1cm4gIScvLi8nW0tFWV0ocmUpO1xuICAgIH0gY2F0Y2ggKGYpIHsgLyogZW1wdHkgKi8gfVxuICB9IHJldHVybiB0cnVlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnJlcXVpcmUoJy4vZXM2LnJlZ2V4cC5leGVjJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgcmVnZXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjJyk7XG5cbnZhciBTUEVDSUVTID0gd2tzKCdzcGVjaWVzJyk7XG5cbnZhciBSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vICNyZXBsYWNlIG5lZWRzIGJ1aWx0LWluIHN1cHBvcnQgZm9yIG5hbWVkIGdyb3Vwcy5cbiAgLy8gI21hdGNoIHdvcmtzIGZpbmUgYmVjYXVzZSBpdCBqdXN0IHJldHVybiB0aGUgZXhlYyByZXN1bHRzLCBldmVuIGlmIGl0IGhhc1xuICAvLyBhIFwiZ3JvcHNcIiBwcm9wZXJ0eS5cbiAgdmFyIHJlID0gLy4vO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICByZXN1bHQuZ3JvdXBzID0geyBhOiAnNycgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gJycucmVwbGFjZShyZSwgJyQ8YT4nKSAhPT0gJzcnO1xufSk7XG5cbnZhciBTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBDaHJvbWUgNTEgaGFzIGEgYnVnZ3kgXCJzcGxpdFwiIGltcGxlbWVudGF0aW9uIHdoZW4gUmVnRXhwI2V4ZWMgIT09IG5hdGl2ZUV4ZWNcbiAgdmFyIHJlID0gLyg/OikvO1xuICB2YXIgb3JpZ2luYWxFeGVjID0gcmUuZXhlYztcbiAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9yaWdpbmFsRXhlYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICB2YXIgcmVzdWx0ID0gJ2FiJy5zcGxpdChyZSk7XG4gIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAyICYmIHJlc3VsdFswXSA9PT0gJ2EnICYmIHJlc3VsdFsxXSA9PT0gJ2InO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBsZW5ndGgsIGV4ZWMpIHtcbiAgdmFyIFNZTUJPTCA9IHdrcyhLRVkpO1xuXG4gIHZhciBERUxFR0FURVNfVE9fU1lNQk9MID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTdHJpbmcgbWV0aG9kcyBjYWxsIHN5bWJvbC1uYW1lZCBSZWdFcCBtZXRob2RzXG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9O1xuICAgIHJldHVybiAnJ1tLRVldKE8pICE9IDc7XG4gIH0pO1xuXG4gIHZhciBERUxFR0FURVNfVE9fRVhFQyA9IERFTEVHQVRFU19UT19TWU1CT0wgPyAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIFN5bWJvbC1uYW1lZCBSZWdFeHAgbWV0aG9kcyBjYWxsIC5leGVjXG4gICAgdmFyIGV4ZWNDYWxsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmUgPSAvYS87XG4gICAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHsgZXhlY0NhbGxlZCA9IHRydWU7IHJldHVybiBudWxsOyB9O1xuICAgIGlmIChLRVkgPT09ICdzcGxpdCcpIHtcbiAgICAgIC8vIFJlZ0V4cFtAQHNwbGl0XSBkb2Vzbid0IGNhbGwgdGhlIHJlZ2V4J3MgZXhlYyBtZXRob2QsIGJ1dCBmaXJzdCBjcmVhdGVzXG4gICAgICAvLyBhIG5ldyBvbmUuIFdlIG5lZWQgdG8gcmV0dXJuIHRoZSBwYXRjaGVkIHJlZ2V4IHdoZW4gY3JlYXRpbmcgdGhlIG5ldyBvbmUuXG4gICAgICByZS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgICAgcmUuY29uc3RydWN0b3JbU1BFQ0lFU10gPSBmdW5jdGlvbiAoKSB7IHJldHVybiByZTsgfTtcbiAgICB9XG4gICAgcmVbU1lNQk9MXSgnJyk7XG4gICAgcmV0dXJuICFleGVjQ2FsbGVkO1xuICB9KSA6IHVuZGVmaW5lZDtcblxuICBpZiAoXG4gICAgIURFTEVHQVRFU19UT19TWU1CT0wgfHxcbiAgICAhREVMRUdBVEVTX1RPX0VYRUMgfHxcbiAgICAoS0VZID09PSAncmVwbGFjZScgJiYgIVJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTKSB8fFxuICAgIChLRVkgPT09ICdzcGxpdCcgJiYgIVNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQylcbiAgKSB7XG4gICAgdmFyIG5hdGl2ZVJlZ0V4cE1ldGhvZCA9IC8uL1tTWU1CT0xdO1xuICAgIHZhciBmbnMgPSBleGVjKFxuICAgICAgZGVmaW5lZCxcbiAgICAgIFNZTUJPTCxcbiAgICAgICcnW0tFWV0sXG4gICAgICBmdW5jdGlvbiBtYXliZUNhbGxOYXRpdmUobmF0aXZlTWV0aG9kLCByZWdleHAsIHN0ciwgYXJnMiwgZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgICAgaWYgKHJlZ2V4cC5leGVjID09PSByZWdleHBFeGVjKSB7XG4gICAgICAgICAgaWYgKERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgICAgICAvLyBUaGUgbmF0aXZlIFN0cmluZyBtZXRob2QgYWxyZWFkeSBkZWxlZ2F0ZXMgdG8gQEBtZXRob2QgKHRoaXNcbiAgICAgICAgICAgIC8vIHBvbHlmaWxsZWQgZnVuY3Rpb24pLCBsZWFzaW5nIHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgIC8vIFdlIGF2b2lkIGl0IGJ5IGRpcmVjdGx5IGNhbGxpbmcgdGhlIG5hdGl2ZSBAQG1ldGhvZCBtZXRob2QuXG4gICAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlUmVnRXhwTWV0aG9kLmNhbGwocmVnZXhwLCBzdHIsIGFyZzIpIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVNZXRob2QuY2FsbChzdHIsIHJlZ2V4cCwgYXJnMikgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSB9O1xuICAgICAgfVxuICAgICk7XG4gICAgdmFyIHN0cmZuID0gZm5zWzBdO1xuICAgIHZhciByeGZuID0gZm5zWzFdO1xuXG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBzdHJmbik7XG4gICAgaGlkZShSZWdFeHAucHJvdG90eXBlLCBTWU1CT0wsIGxlbmd0aCA9PSAyXG4gICAgICAvLyAyMS4yLjUuOCBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV0oc3RyaW5nLCByZXBsYWNlVmFsdWUpXG4gICAgICAvLyAyMS4yLjUuMTEgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XShzdHJpbmcsIGxpbWl0KVxuICAgICAgPyBmdW5jdGlvbiAoc3RyaW5nLCBhcmcpIHsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMsIGFyZyk7IH1cbiAgICAgIC8vIDIxLjIuNS42IFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF0oc3RyaW5nKVxuICAgICAgLy8gMjEuMi41LjkgUmVnRXhwLnByb3RvdHlwZVtAQHNlYXJjaF0oc3RyaW5nKVxuICAgICAgOiBmdW5jdGlvbiAoc3RyaW5nKSB7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzKTsgfVxuICAgICk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFnc1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoYXQgPSBhbk9iamVjdCh0aGlzKTtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBpZiAodGhhdC5nbG9iYWwpIHJlc3VsdCArPSAnZyc7XG4gIGlmICh0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmICh0aGF0Lm11bHRpbGluZSkgcmVzdWx0ICs9ICdtJztcbiAgaWYgKHRoYXQudW5pY29kZSkgcmVzdWx0ICs9ICd1JztcbiAgaWYgKHRoYXQuc3RpY2t5KSByZXN1bHQgKz0gJ3knO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG52YXIgQlJFQUsgPSB7fTtcbnZhciBSRVRVUk4gPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUikge1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSk7XG4gIHZhciBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmIChpc0FycmF5SXRlcihpdGVyRm4pKSBmb3IgKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOykge1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCduYXRpdmUtZnVuY3Rpb24tdG8tc3RyaW5nJywgRnVuY3Rpb24udG9TdHJpbmcpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQ7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCB0YXJnZXQsIEMpIHtcbiAgdmFyIFMgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIHZhciBQO1xuICBpZiAoUyAhPT0gQyAmJiB0eXBlb2YgUyA9PSAnZnVuY3Rpb24nICYmIChQID0gUy5wcm90b3R5cGUpICE9PSBDLnByb3RvdHlwZSAmJiBpc09iamVjdChQKSAmJiBzZXRQcm90b3R5cGVPZikge1xuICAgIHNldFByb3RvdHlwZU9mKHRoYXQsIFApO1xuICB9IHJldHVybiB0aGF0O1xufTtcbiIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIGFyZ3MsIHRoYXQpIHtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyA3LjIuOCBJc1JlZ0V4cChhcmd1bWVudClcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIE1BVENIID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjb2YoaXQpID09ICdSZWdFeHAnKTtcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwidmFyIE1FVEEgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgc2V0RGVzYyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaWQgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uIChpdCkge1xuICBzZXREZXNjKGl0LCBNRVRBLCB7IHZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSB9KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpIHNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiBNRVRBLFxuICBORUVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2VhazogZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgU2FmYXJpIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMzOVxuICB9IGVsc2UgaWYgKE9ic2VydmVyICYmICEoZ2xvYmFsLm5hdmlnYXRvciAmJiBnbG9iYWwubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSB7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZiAoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpIHtcbiAgICAvLyBQcm9taXNlLnJlc29sdmUgd2l0aG91dCBhbiBhcmd1bWVudCB0aHJvd3MgYW4gZXJyb3IgaW4gTEcgV2ViT1MgMlxuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBleGVjKSB7XG4gIHZhciBmbiA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXTtcbiAgdmFyIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07XG4iLCJ2YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGlzRW51bSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXNFbnRyaWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdChpdCk7XG4gICAgdmFyIGtleXMgPSBnZXRLZXlzKE8pO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGkpIGlmIChpc0VudW0uY2FsbChPLCBrZXkgPSBrZXlzW2krK10pKSB7XG4gICAgICByZXN1bHQucHVzaChpc0VudHJpZXMgPyBba2V5LCBPW2tleV1dIDogT1trZXldKTtcbiAgICB9IHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiB7IGU6IGZhbHNlLCB2OiBleGVjKCkgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IGU6IHRydWUsIHY6IGUgfTtcbiAgfVxufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEMsIHgpIHtcbiAgYW5PYmplY3QoQyk7XG4gIGlmIChpc09iamVjdCh4KSAmJiB4LmNvbnN0cnVjdG9yID09PSBDKSByZXR1cm4geDtcbiAgdmFyIHByb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkuZihDKTtcbiAgdmFyIHJlc29sdmUgPSBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlO1xuICByZXNvbHZlKHgpO1xuICByZXR1cm4gcHJvbWlzZUNhcGFiaWxpdHkucHJvbWlzZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgc2FmZSk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgYnVpbHRpbkV4ZWMgPSBSZWdFeHAucHJvdG90eXBlLmV4ZWM7XG5cbiAvLyBgUmVnRXhwRXhlY2AgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHBleGVjXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChSLCBTKSB7XG4gIHZhciBleGVjID0gUi5leGVjO1xuICBpZiAodHlwZW9mIGV4ZWMgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgcmVzdWx0ID0gZXhlYy5jYWxsKFIsIFMpO1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVnRXhwIGV4ZWMgbWV0aG9kIHJldHVybmVkIHNvbWV0aGluZyBvdGhlciB0aGFuIGFuIE9iamVjdCBvciBudWxsJyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKGNsYXNzb2YoUikgIT09ICdSZWdFeHAnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVnRXhwI2V4ZWMgY2FsbGVkIG9uIGluY29tcGF0aWJsZSByZWNlaXZlcicpO1xuICB9XG4gIHJldHVybiBidWlsdGluRXhlYy5jYWxsKFIsIFMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlZ2V4cEZsYWdzID0gcmVxdWlyZSgnLi9fZmxhZ3MnKTtcblxudmFyIG5hdGl2ZUV4ZWMgPSBSZWdFeHAucHJvdG90eXBlLmV4ZWM7XG4vLyBUaGlzIGFsd2F5cyByZWZlcnMgdG8gdGhlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiwgYmVjYXVzZSB0aGVcbi8vIFN0cmluZyNyZXBsYWNlIHBvbHlmaWxsIHVzZXMgLi9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljLmpzLFxuLy8gd2hpY2ggbG9hZHMgdGhpcyBmaWxlIGJlZm9yZSBwYXRjaGluZyB0aGUgbWV0aG9kLlxudmFyIG5hdGl2ZVJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG5cbnZhciBwYXRjaGVkRXhlYyA9IG5hdGl2ZUV4ZWM7XG5cbnZhciBMQVNUX0lOREVYID0gJ2xhc3RJbmRleCc7XG5cbnZhciBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUxID0gL2EvLFxuICAgICAgcmUyID0gL2IqL2c7XG4gIG5hdGl2ZUV4ZWMuY2FsbChyZTEsICdhJyk7XG4gIG5hdGl2ZUV4ZWMuY2FsbChyZTIsICdhJyk7XG4gIHJldHVybiByZTFbTEFTVF9JTkRFWF0gIT09IDAgfHwgcmUyW0xBU1RfSU5ERVhdICE9PSAwO1xufSkoKTtcblxuLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXAsIGNvcGllZCBmcm9tIGVzNS1zaGltJ3MgU3RyaW5nI3NwbGl0IHBhdGNoLlxudmFyIE5QQ0dfSU5DTFVERUQgPSAvKCk/Py8uZXhlYygnJylbMV0gIT09IHVuZGVmaW5lZDtcblxudmFyIFBBVENIID0gVVBEQVRFU19MQVNUX0lOREVYX1dST05HIHx8IE5QQ0dfSU5DTFVERUQ7XG5cbmlmIChQQVRDSCkge1xuICBwYXRjaGVkRXhlYyA9IGZ1bmN0aW9uIGV4ZWMoc3RyKSB7XG4gICAgdmFyIHJlID0gdGhpcztcbiAgICB2YXIgbGFzdEluZGV4LCByZUNvcHksIG1hdGNoLCBpO1xuXG4gICAgaWYgKE5QQ0dfSU5DTFVERUQpIHtcbiAgICAgIHJlQ29weSA9IG5ldyBSZWdFeHAoJ14nICsgcmUuc291cmNlICsgJyQoPyFcXFxccyknLCByZWdleHBGbGFncy5jYWxsKHJlKSk7XG4gICAgfVxuICAgIGlmIChVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcpIGxhc3RJbmRleCA9IHJlW0xBU1RfSU5ERVhdO1xuXG4gICAgbWF0Y2ggPSBuYXRpdmVFeGVjLmNhbGwocmUsIHN0cik7XG5cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HICYmIG1hdGNoKSB7XG4gICAgICByZVtMQVNUX0lOREVYXSA9IHJlLmdsb2JhbCA/IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoIDogbGFzdEluZGV4O1xuICAgIH1cbiAgICBpZiAoTlBDR19JTkNMVURFRCAmJiBtYXRjaCAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYFxuICAgICAgLy8gZm9yIE5QQ0csIGxpa2UgSUU4LiBOT1RFOiBUaGlzIGRvZXNuJyB3b3JrIGZvciAvKC4/KT8vXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcC1mdW5jXG4gICAgICBuYXRpdmVSZXBsYWNlLmNhbGwobWF0Y2hbMF0sIHJlQ29weSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgIGlmIChhcmd1bWVudHNbaV0gPT09IHVuZGVmaW5lZCkgbWF0Y2hbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaGVkRXhlYztcbiIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbiAoTywgcHJvdG8pIHtcbiAgYW5PYmplY3QoTyk7XG4gIGlmICghaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKSB0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbiAodGVzdCwgYnVnZ3ksIHNldCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pIHtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZiAoYnVnZ3kpIE8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZKSB7XG4gIHZhciBDID0gZ2xvYmFsW0tFWV07XG4gIGlmIChERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKSBkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTkgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgRCkge1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yO1xuICB2YXIgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1ldGhvZCwgYXJnKSB7XG4gIHJldHVybiAhIW1ldGhvZCAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZWxlc3MtY2FsbFxuICAgIGFyZyA/IG1ldGhvZC5jYWxsKG51bGwsIGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSwgMSkgOiBtZXRob2QuY2FsbChudWxsKTtcbiAgfSk7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsIi8vIGhlbHBlciBmb3IgU3RyaW5nI3tzdGFydHNXaXRoLCBlbmRzV2l0aCwgaW5jbHVkZXN9XG52YXIgaXNSZWdFeHAgPSByZXF1aXJlKCcuL19pcy1yZWdleHAnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCBzZWFyY2hTdHJpbmcsIE5BTUUpIHtcbiAgaWYgKGlzUmVnRXhwKHNlYXJjaFN0cmluZykpIHRocm93IFR5cGVFcnJvcignU3RyaW5nIycgKyBOQU1FICsgXCIgZG9lc24ndCBhY2NlcHQgcmVnZXghXCIpO1xuICByZXR1cm4gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xufTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG52YXIgcXVvdCA9IC9cIi9nO1xuLy8gQi4yLjMuMi4xIENyZWF0ZUhUTUwoc3RyaW5nLCB0YWcsIGF0dHJpYnV0ZSwgdmFsdWUpXG52YXIgY3JlYXRlSFRNTCA9IGZ1bmN0aW9uIChzdHJpbmcsIHRhZywgYXR0cmlidXRlLCB2YWx1ZSkge1xuICB2YXIgUyA9IFN0cmluZyhkZWZpbmVkKHN0cmluZykpO1xuICB2YXIgcDEgPSAnPCcgKyB0YWc7XG4gIGlmIChhdHRyaWJ1dGUgIT09ICcnKSBwMSArPSAnICcgKyBhdHRyaWJ1dGUgKyAnPVwiJyArIFN0cmluZyh2YWx1ZSkucmVwbGFjZShxdW90LCAnJnF1b3Q7JykgKyAnXCInO1xuICByZXR1cm4gcDEgKyAnPicgKyBTICsgJzwvJyArIHRhZyArICc+Jztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FLCBleGVjKSB7XG4gIHZhciBPID0ge307XG4gIE9bTkFNRV0gPSBleGVjKGNyZWF0ZUhUTUwpO1xuICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGVzdCA9ICcnW05BTUVdKCdcIicpO1xuICAgIHJldHVybiB0ZXN0ICE9PSB0ZXN0LnRvTG93ZXJDYXNlKCkgfHwgdGVzdC5zcGxpdCgnXCInKS5sZW5ndGggPiAzO1xuICB9KSwgJ1N0cmluZycsIE8pO1xufTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgc3BhY2VzID0gcmVxdWlyZSgnLi9fc3RyaW5nLXdzJyk7XG52YXIgc3BhY2UgPSAnWycgKyBzcGFjZXMgKyAnXSc7XG52YXIgbm9uID0gJ1xcdTIwMGJcXHUwMDg1JztcbnZhciBsdHJpbSA9IFJlZ0V4cCgnXicgKyBzcGFjZSArIHNwYWNlICsgJyonKTtcbnZhciBydHJpbSA9IFJlZ0V4cChzcGFjZSArIHNwYWNlICsgJyokJyk7XG5cbnZhciBleHBvcnRlciA9IGZ1bmN0aW9uIChLRVksIGV4ZWMsIEFMSUFTKSB7XG4gIHZhciBleHAgPSB7fTtcbiAgdmFyIEZPUkNFID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXNwYWNlc1tLRVldKCkgfHwgbm9uW0tFWV0oKSAhPSBub247XG4gIH0pO1xuICB2YXIgZm4gPSBleHBbS0VZXSA9IEZPUkNFID8gZXhlYyh0cmltKSA6IHNwYWNlc1tLRVldO1xuICBpZiAoQUxJQVMpIGV4cFtBTElBU10gPSBmbjtcbiAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBGT1JDRSwgJ1N0cmluZycsIGV4cCk7XG59O1xuXG4vLyAxIC0+IFN0cmluZyN0cmltTGVmdFxuLy8gMiAtPiBTdHJpbmcjdHJpbVJpZ2h0XG4vLyAzIC0+IFN0cmluZyN0cmltXG52YXIgdHJpbSA9IGV4cG9ydGVyLnRyaW0gPSBmdW5jdGlvbiAoc3RyaW5nLCBUWVBFKSB7XG4gIHN0cmluZyA9IFN0cmluZyhkZWZpbmVkKHN0cmluZykpO1xuICBpZiAoVFlQRSAmIDEpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKGx0cmltLCAnJyk7XG4gIGlmIChUWVBFICYgMikgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocnRyaW0sICcnKTtcbiAgcmV0dXJuIHN0cmluZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0ZXI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICdcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwMycgK1xuICAnXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcXHUyMDI5XFx1RkVGRic7XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vX2h0bWwnKTtcbnZhciBjZWwgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHNldFRhc2sgPSBnbG9iYWwuc2V0SW1tZWRpYXRlO1xudmFyIGNsZWFyVGFzayA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcbnZhciBNZXNzYWdlQ2hhbm5lbCA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbDtcbnZhciBEaXNwYXRjaCA9IGdsb2JhbC5EaXNwYXRjaDtcbnZhciBjb3VudGVyID0gMDtcbnZhciBxdWV1ZSA9IHt9O1xudmFyIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xudmFyIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgaWYgKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYgKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spIHtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGkgPSAxO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYgKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gU3BoZXJlIChKUyBnYW1lIGVuZ2luZSkgRGlzcGF0Y2ggQVBJXG4gIH0gZWxzZSBpZiAoRGlzcGF0Y2ggJiYgRGlzcGF0Y2gubm93KSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIERpc3BhdGNoLm5vdyhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmIChNZXNzYWdlQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmIChPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSkge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBuYXZpZ2F0b3IgPSBnbG9iYWwubmF2aWdhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyICRTeW1ib2wgPSBjb3JlLlN5bWJvbCB8fCAoY29yZS5TeW1ib2wgPSBMSUJSQVJZID8ge30gOiBnbG9iYWwuU3ltYm9sIHx8IHt9KTtcbiAgaWYgKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpIGRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHsgdmFsdWU6IHdrc0V4dC5mKG5hbWUpIH0pO1xufTtcbiIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7IGZpbGw6IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKSB9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2ZpbGwnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgyKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fc3RyaWN0LW1ldGhvZCcpKFtdLmZpbHRlciwgdHJ1ZSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjcgLyAxNS40LjQuMjAgQXJyYXkucHJvdG90eXBlLmZpbHRlcihjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkZmlsdGVyKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKTtcbnZhciBTVFJJQ1QgPSByZXF1aXJlKCcuL19zdHJpY3QtbWV0aG9kJykoW10uZm9yRWFjaCwgdHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIVNUUklDVCwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTAgLyAxNS40LjQuMTggQXJyYXkucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkZm9yRWFjaCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRpbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgJG5hdGl2ZSA9IFtdLmluZGV4T2Y7XG52YXIgTkVHQVRJVkVfWkVSTyA9ICEhJG5hdGl2ZSAmJiAxIC8gWzFdLmluZGV4T2YoMSwgLTApIDwgMDtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoTkVHQVRJVkVfWkVSTyB8fCAhcmVxdWlyZSgnLi9fc3RyaWN0LW1ldGhvZCcpKCRuYXRpdmUpKSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQgLyogLCBmcm9tSW5kZXggPSAwICovKSB7XG4gICAgcmV0dXJuIE5FR0FUSVZFX1pFUk9cbiAgICAgIC8vIGNvbnZlcnQgLTAgdG8gKzBcbiAgICAgID8gJG5hdGl2ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IDBcbiAgICAgIDogJGluZGV4T2YodGhpcywgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCIvLyAyMi4xLjIuMiAvIDE1LjQuMy4yIEFycmF5LmlzQXJyYXkoYXJnKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdBcnJheScsIHsgaXNBcnJheTogcmVxdWlyZSgnLi9faXMtYXJyYXknKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRtYXAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKShbXS5tYXAsIHRydWUpLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xNSAvIDE1LjQuNC4xOSBBcnJheS5wcm90b3R5cGUubWFwKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIG1hcDogZnVuY3Rpb24gbWFwKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRtYXAodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRyZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheS1yZWR1Y2UnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fc3RyaWN0LW1ldGhvZCcpKFtdLnJlZHVjZSwgdHJ1ZSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjE4IC8gMTUuNC40LjIxIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UoY2FsbGJhY2tmbiBbLCBpbml0aWFsVmFsdWVdKVxuICByZWR1Y2U6IGZ1bmN0aW9uIHJlZHVjZShjYWxsYmFja2ZuIC8qICwgaW5pdGlhbFZhbHVlICovKSB7XG4gICAgcmV0dXJuICRyZWR1Y2UodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCwgYXJndW1lbnRzWzFdLCBmYWxzZSk7XG4gIH1cbn0pO1xuIiwidmFyIERhdGVQcm90byA9IERhdGUucHJvdG90eXBlO1xudmFyIElOVkFMSURfREFURSA9ICdJbnZhbGlkIERhdGUnO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgJHRvU3RyaW5nID0gRGF0ZVByb3RvW1RPX1NUUklOR107XG52YXIgZ2V0VGltZSA9IERhdGVQcm90by5nZXRUaW1lO1xuaWYgKG5ldyBEYXRlKE5hTikgKyAnJyAhPSBJTlZBTElEX0RBVEUpIHtcbiAgcmVxdWlyZSgnLi9fcmVkZWZpbmUnKShEYXRlUHJvdG8sIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgdmFyIHZhbHVlID0gZ2V0VGltZS5jYWxsKHRoaXMpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gJHRvU3RyaW5nLmNhbGwodGhpcykgOiBJTlZBTElEX0RBVEU7XG4gIH0pO1xufVxuIiwiLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdGdW5jdGlvbicsIHsgYmluZDogcmVxdWlyZSgnLi9fYmluZCcpIH0pO1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBGUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgbmFtZVJFID0gL15cXHMqZnVuY3Rpb24gKFteIChdKikvO1xudmFyIE5BTUUgPSAnbmFtZSc7XG5cbi8vIDE5LjIuNC4yIG5hbWVcbk5BTUUgaW4gRlByb3RvIHx8IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgZFAoRlByb3RvLCBOQU1FLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoJycgKyB0aGlzKS5tYXRjaChuYW1lUkUpWzFdO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgTUFQID0gJ01hcCc7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKE1BUCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTUFQKSwga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHZhbGlkYXRlKHRoaXMsIE1BUCksIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIGdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmY7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyICR0cmltID0gcmVxdWlyZSgnLi9fc3RyaW5nLXRyaW0nKS50cmltO1xudmFyIE5VTUJFUiA9ICdOdW1iZXInO1xudmFyICROdW1iZXIgPSBnbG9iYWxbTlVNQkVSXTtcbnZhciBCYXNlID0gJE51bWJlcjtcbnZhciBwcm90byA9ICROdW1iZXIucHJvdG90eXBlO1xuLy8gT3BlcmEgfjEyIGhhcyBicm9rZW4gT2JqZWN0I3RvU3RyaW5nXG52YXIgQlJPS0VOX0NPRiA9IGNvZihyZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJykocHJvdG8pKSA9PSBOVU1CRVI7XG52YXIgVFJJTSA9ICd0cmltJyBpbiBTdHJpbmcucHJvdG90eXBlO1xuXG4vLyA3LjEuMyBUb051bWJlcihhcmd1bWVudClcbnZhciB0b051bWJlciA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIgaXQgPSB0b1ByaW1pdGl2ZShhcmd1bWVudCwgZmFsc2UpO1xuICBpZiAodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIpIHtcbiAgICBpdCA9IFRSSU0gPyBpdC50cmltKCkgOiAkdHJpbShpdCwgMyk7XG4gICAgdmFyIGZpcnN0ID0gaXQuY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgdGhpcmQsIHJhZGl4LCBtYXhDb2RlO1xuICAgIGlmIChmaXJzdCA9PT0gNDMgfHwgZmlyc3QgPT09IDQ1KSB7XG4gICAgICB0aGlyZCA9IGl0LmNoYXJDb2RlQXQoMik7XG4gICAgICBpZiAodGhpcmQgPT09IDg4IHx8IHRoaXJkID09PSAxMjApIHJldHVybiBOYU47IC8vIE51bWJlcignKzB4MScpIHNob3VsZCBiZSBOYU4sIG9sZCBWOCBmaXhcbiAgICB9IGVsc2UgaWYgKGZpcnN0ID09PSA0OCkge1xuICAgICAgc3dpdGNoIChpdC5jaGFyQ29kZUF0KDEpKSB7XG4gICAgICAgIGNhc2UgNjY6IGNhc2UgOTg6IHJhZGl4ID0gMjsgbWF4Q29kZSA9IDQ5OyBicmVhazsgLy8gZmFzdCBlcXVhbCAvXjBiWzAxXSskL2lcbiAgICAgICAgY2FzZSA3OTogY2FzZSAxMTE6IHJhZGl4ID0gODsgbWF4Q29kZSA9IDU1OyBicmVhazsgLy8gZmFzdCBlcXVhbCAvXjBvWzAtN10rJC9pXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiAraXQ7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBkaWdpdHMgPSBpdC5zbGljZSgyKSwgaSA9IDAsIGwgPSBkaWdpdHMubGVuZ3RoLCBjb2RlOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvZGUgPSBkaWdpdHMuY2hhckNvZGVBdChpKTtcbiAgICAgICAgLy8gcGFyc2VJbnQgcGFyc2VzIGEgc3RyaW5nIHRvIGEgZmlyc3QgdW5hdmFpbGFibGUgc3ltYm9sXG4gICAgICAgIC8vIGJ1dCBUb051bWJlciBzaG91bGQgcmV0dXJuIE5hTiBpZiBhIHN0cmluZyBjb250YWlucyB1bmF2YWlsYWJsZSBzeW1ib2xzXG4gICAgICAgIGlmIChjb2RlIDwgNDggfHwgY29kZSA+IG1heENvZGUpIHJldHVybiBOYU47XG4gICAgICB9IHJldHVybiBwYXJzZUludChkaWdpdHMsIHJhZGl4KTtcbiAgICB9XG4gIH0gcmV0dXJuICtpdDtcbn07XG5cbmlmICghJE51bWJlcignIDBvMScpIHx8ICEkTnVtYmVyKCcwYjEnKSB8fCAkTnVtYmVyKCcrMHgxJykpIHtcbiAgJE51bWJlciA9IGZ1bmN0aW9uIE51bWJlcih2YWx1ZSkge1xuICAgIHZhciBpdCA9IGFyZ3VtZW50cy5sZW5ndGggPCAxID8gMCA6IHZhbHVlO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gdGhhdCBpbnN0YW5jZW9mICROdW1iZXJcbiAgICAgIC8vIGNoZWNrIG9uIDEuLmNvbnN0cnVjdG9yKGZvbykgY2FzZVxuICAgICAgJiYgKEJST0tFTl9DT0YgPyBmYWlscyhmdW5jdGlvbiAoKSB7IHByb3RvLnZhbHVlT2YuY2FsbCh0aGF0KTsgfSkgOiBjb2YodGhhdCkgIT0gTlVNQkVSKVxuICAgICAgICA/IGluaGVyaXRJZlJlcXVpcmVkKG5ldyBCYXNlKHRvTnVtYmVyKGl0KSksIHRoYXQsICROdW1iZXIpIDogdG9OdW1iZXIoaXQpO1xuICB9O1xuICBmb3IgKHZhciBrZXlzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGdPUE4oQmFzZSkgOiAoXG4gICAgLy8gRVMzOlxuICAgICdNQVhfVkFMVUUsTUlOX1ZBTFVFLE5hTixORUdBVElWRV9JTkZJTklUWSxQT1NJVElWRV9JTkZJTklUWSwnICtcbiAgICAvLyBFUzYgKGluIGNhc2UsIGlmIG1vZHVsZXMgd2l0aCBFUzYgTnVtYmVyIHN0YXRpY3MgcmVxdWlyZWQgYmVmb3JlKTpcbiAgICAnRVBTSUxPTixpc0Zpbml0ZSxpc0ludGVnZXIsaXNOYU4saXNTYWZlSW50ZWdlcixNQVhfU0FGRV9JTlRFR0VSLCcgK1xuICAgICdNSU5fU0FGRV9JTlRFR0VSLHBhcnNlRmxvYXQscGFyc2VJbnQsaXNJbnRlZ2VyJ1xuICApLnNwbGl0KCcsJyksIGogPSAwLCBrZXk7IGtleXMubGVuZ3RoID4gajsgaisrKSB7XG4gICAgaWYgKGhhcyhCYXNlLCBrZXkgPSBrZXlzW2pdKSAmJiAhaGFzKCROdW1iZXIsIGtleSkpIHtcbiAgICAgIGRQKCROdW1iZXIsIGtleSwgZ09QRChCYXNlLCBrZXkpKTtcbiAgICB9XG4gIH1cbiAgJE51bWJlci5wcm90b3R5cGUgPSBwcm90bztcbiAgcHJvdG8uY29uc3RydWN0b3IgPSAkTnVtYmVyO1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKGdsb2JhbCwgTlVNQkVSLCAkTnVtYmVyKTtcbn1cbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgY3JlYXRlOiByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJykgfSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7IGRlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mIH0pO1xuIiwiLy8gMTkuMS4yLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgna2V5cycsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGtleXMoaXQpIHtcbiAgICByZXR1cm4gJGtleXModG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgc2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldCB9KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgdGVzdCA9IHt9O1xudGVzdFtyZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKV0gPSAneic7XG5pZiAodGVzdCArICcnICE9ICdbb2JqZWN0IHpdJykge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnW29iamVjdCAnICsgY2xhc3NvZih0aGlzKSArICddJztcbiAgfSwgdHJ1ZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciB0YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBtaWNyb3Rhc2sgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi9fdXNlci1hZ2VudCcpO1xudmFyIHByb21pc2VSZXNvbHZlID0gcmVxdWlyZSgnLi9fcHJvbWlzZS1yZXNvbHZlJyk7XG52YXIgUFJPTUlTRSA9ICdQcm9taXNlJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucztcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4IHx8ICcnO1xudmFyICRQcm9taXNlID0gZ2xvYmFsW1BST01JU0VdO1xudmFyIGlzTm9kZSA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xudmFyIGVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIEludGVybmFsLCBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIE93blByb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSA9ICRQcm9taXNlLnJlc29sdmUoMSk7XG4gICAgdmFyIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbiAoZXhlYykge1xuICAgICAgZXhlYyhlbXB0eSwgZW1wdHkpO1xuICAgIH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZVxuICAgICAgLy8gdjggNi42IChOb2RlIDEwIGFuZCBDaHJvbWUgNjYpIGhhdmUgYSBidWcgd2l0aCByZXNvbHZpbmcgY3VzdG9tIHRoZW5hYmxlc1xuICAgICAgLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9ODMwNTY1XG4gICAgICAvLyB3ZSBjYW4ndCBkZXRlY3QgaXQgc3luY2hyb25vdXNseSwgc28ganVzdCBjaGVjayB2ZXJzaW9uc1xuICAgICAgJiYgdjguaW5kZXhPZignNi42JykgIT09IDBcbiAgICAgICYmIHVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUvNjYnKSA9PT0gLTE7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbiAocHJvbWlzZSwgaXNSZWplY3QpIHtcbiAgaWYgKHByb21pc2UuX24pIHJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgb2sgPSBwcm9taXNlLl9zID09IDE7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWw7XG4gICAgICB2YXIgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmU7XG4gICAgICB2YXIgcmVqZWN0ID0gcmVhY3Rpb24ucmVqZWN0O1xuICAgICAgdmFyIGRvbWFpbiA9IHJlYWN0aW9uLmRvbWFpbjtcbiAgICAgIHZhciByZXN1bHQsIHRoZW4sIGV4aXRlZDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgaWYgKHByb21pc2UuX2ggPT0gMikgb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhbmRsZXIgPT09IHRydWUpIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTsgLy8gbWF5IHRocm93XG4gICAgICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICAgIGRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgICAgIGV4aXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2UpIHtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZG9tYWluICYmICFleGl0ZWQpIGRvbWFpbi5leGl0KCk7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpKSBydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZiAoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpIG9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgdW5oYW5kbGVkID0gaXNVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgdmFyIHJlc3VsdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZiAodW5oYW5kbGVkKSB7XG4gICAgICByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pIHtcbiAgICAgICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmICh1bmhhbmRsZWQgJiYgcmVzdWx0LmUpIHRocm93IHJlc3VsdC52O1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICByZXR1cm4gcHJvbWlzZS5faCAhPT0gMSAmJiAocHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jKS5sZW5ndGggPT09IDA7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmIChpc05vZGUpIHtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpIHtcbiAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3YgfSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmIChwcm9taXNlLl9kKSByZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYgKCFwcm9taXNlLl9hKSBwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgdmFyIHRoZW47XG4gIGlmIChwcm9taXNlLl9kKSByZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmICh0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0geyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgJHJlamVjdC5jYWxsKHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgdmFyIHJlYWN0aW9uID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9hKSB0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX3MpIG5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBPd25Qcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBJbnRlcm5hbCgpO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbiAgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKEMpIHtcbiAgICByZXR1cm4gQyA9PT0gJFByb21pc2UgfHwgQyA9PT0gV3JhcHBlclxuICAgICAgPyBuZXcgT3duUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgIDogbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFByb21pc2U6ICRQcm9taXNlIH0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKSB7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKTtcbiAgICB2YXIgJCRyZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmUoTElCUkFSWSAmJiB0aGlzID09PSBXcmFwcGVyID8gJFByb21pc2UgOiB0aGlzLCB4KTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlc29sdmUgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgdmFyICRpbmRleCA9IGluZGV4Kys7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiIsIi8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xuXG4vLyBNUyBFZGdlIGhhcyBicm9rZW4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSAtIHRocm93aW5nIGluc3RlYWQgb2YgcmV0dXJuaW5nIGZhbHNlXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShkUC5mKHt9LCAxLCB7IHZhbHVlOiAxIH0pLCAxLCB7IHZhbHVlOiAyIH0pO1xufSksICdSZWZsZWN0Jywge1xuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcykge1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgcHJvcGVydHlLZXkgPSB0b1ByaW1pdGl2ZShwcm9wZXJ0eUtleSwgdHJ1ZSk7XG4gICAgYW5PYmplY3QoYXR0cmlidXRlcyk7XG4gICAgdHJ5IHtcbiAgICAgIGRQLmYodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWdleHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMnKTtcbnJlcXVpcmUoJy4vX2V4cG9ydCcpKHtcbiAgdGFyZ2V0OiAnUmVnRXhwJyxcbiAgcHJvdG86IHRydWUsXG4gIGZvcmNlZDogcmVnZXhwRXhlYyAhPT0gLy4vLmV4ZWNcbn0sIHtcbiAgZXhlYzogcmVnZXhwRXhlY1xufSk7XG4iLCIvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXG5pZiAocmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAvLi9nLmZsYWdzICE9ICdnJykgcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZihSZWdFeHAucHJvdG90eXBlLCAnZmxhZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiByZXF1aXJlKCcuL19mbGFncycpXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuL19hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xuXG4vLyBAQG1hdGNoIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ21hdGNoJywgMSwgZnVuY3Rpb24gKGRlZmluZWQsIE1BVENILCAkbWF0Y2gsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLm1hdGNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLm1hdGNoXG4gICAgZnVuY3Rpb24gbWF0Y2gocmVnZXhwKSB7XG4gICAgICB2YXIgTyA9IGRlZmluZWQodGhpcyk7XG4gICAgICB2YXIgZm4gPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW01BVENIXTtcbiAgICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW01BVENIXShTdHJpbmcoTykpO1xuICAgIH0sXG4gICAgLy8gYFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEBtYXRjaFxuICAgIGZ1bmN0aW9uIChyZWdleHApIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUoJG1hdGNoLCByZWdleHAsIHRoaXMpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgaWYgKCFyeC5nbG9iYWwpIHJldHVybiByZWdFeHBFeGVjKHJ4LCBTKTtcbiAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIEEgPSBbXTtcbiAgICAgIHZhciBuID0gMDtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICB3aGlsZSAoKHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgQVtuXSA9IG1hdGNoU3RyO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgICBuKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gbiA9PT0gMCA/IG51bGwgOiBBO1xuICAgIH1cbiAgXTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4vX2FkdmFuY2Utc3RyaW5nLWluZGV4Jyk7XG52YXIgcmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjLWFic3RyYWN0Jyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xudmFyIFNVQlNUSVRVVElPTl9TWU1CT0xTID0gL1xcJChbJCZgJ118XFxkXFxkP3w8W14+XSo+KS9nO1xudmFyIFNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEID0gL1xcJChbJCZgJ118XFxkXFxkPykvZztcblxudmFyIG1heWJlVG9TdHJpbmcgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyBpdCA6IFN0cmluZyhpdCk7XG59O1xuXG4vLyBAQHJlcGxhY2UgbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgncmVwbGFjZScsIDIsIGZ1bmN0aW9uIChkZWZpbmVkLCBSRVBMQUNFLCAkcmVwbGFjZSwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUucmVwbGFjZWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlXG4gICAgZnVuY3Rpb24gcmVwbGFjZShzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKSB7XG4gICAgICB2YXIgTyA9IGRlZmluZWQodGhpcyk7XG4gICAgICB2YXIgZm4gPSBzZWFyY2hWYWx1ZSA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZWFyY2hWYWx1ZVtSRVBMQUNFXTtcbiAgICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gZm4uY2FsbChzZWFyY2hWYWx1ZSwgTywgcmVwbGFjZVZhbHVlKVxuICAgICAgICA6ICRyZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEByZXBsYWNlXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCwgcmVwbGFjZVZhbHVlKSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKCRyZXBsYWNlLCByZWdleHAsIHRoaXMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICBpZiAocmVzLmRvbmUpIHJldHVybiByZXMudmFsdWU7XG5cbiAgICAgIHZhciByeCA9IGFuT2JqZWN0KHJlZ2V4cCk7XG4gICAgICB2YXIgUyA9IFN0cmluZyh0aGlzKTtcbiAgICAgIHZhciBmdW5jdGlvbmFsUmVwbGFjZSA9IHR5cGVvZiByZXBsYWNlVmFsdWUgPT09ICdmdW5jdGlvbic7XG4gICAgICBpZiAoIWZ1bmN0aW9uYWxSZXBsYWNlKSByZXBsYWNlVmFsdWUgPSBTdHJpbmcocmVwbGFjZVZhbHVlKTtcbiAgICAgIHZhciBnbG9iYWwgPSByeC5nbG9iYWw7XG4gICAgICBpZiAoZ2xvYmFsKSB7XG4gICAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSBicmVhaztcbiAgICAgICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgICAgIGlmICghZ2xvYmFsKSBicmVhaztcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIGlmIChtYXRjaFN0ciA9PT0gJycpIHJ4Lmxhc3RJbmRleCA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCB0b0xlbmd0aChyeC5sYXN0SW5kZXgpLCBmdWxsVW5pY29kZSk7XG4gICAgICB9XG4gICAgICB2YXIgYWNjdW11bGF0ZWRSZXN1bHQgPSAnJztcbiAgICAgIHZhciBuZXh0U291cmNlUG9zaXRpb24gPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgIHZhciBtYXRjaGVkID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IG1heChtaW4odG9JbnRlZ2VyKHJlc3VsdC5pbmRleCksIFMubGVuZ3RoKSwgMCk7XG4gICAgICAgIHZhciBjYXB0dXJlcyA9IFtdO1xuICAgICAgICAvLyBOT1RFOiBUaGlzIGlzIGVxdWl2YWxlbnQgdG9cbiAgICAgICAgLy8gICBjYXB0dXJlcyA9IHJlc3VsdC5zbGljZSgxKS5tYXAobWF5YmVUb1N0cmluZylcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiBgbmF0aXZlU2xpY2UuY2FsbChyZXN1bHQsIDEsIHJlc3VsdC5sZW5ndGgpYCAoY2FsbGVkIGluXG4gICAgICAgIC8vIHRoZSBzbGljZSBwb2x5ZmlsbCB3aGVuIHNsaWNpbmcgbmF0aXZlIGFycmF5cykgXCJkb2Vzbid0IHdvcmtcIiBpbiBzYWZhcmkgOSBhbmRcbiAgICAgICAgLy8gY2F1c2VzIGEgY3Jhc2ggKGh0dHBzOi8vcGFzdGViaW4uY29tL04yMVF6ZVFBKSB3aGVuIHRyeWluZyB0byBkZWJ1ZyBpdC5cbiAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCByZXN1bHQubGVuZ3RoOyBqKyspIGNhcHR1cmVzLnB1c2gobWF5YmVUb1N0cmluZyhyZXN1bHRbal0pKTtcbiAgICAgICAgdmFyIG5hbWVkQ2FwdHVyZXMgPSByZXN1bHQuZ3JvdXBzO1xuICAgICAgICBpZiAoZnVuY3Rpb25hbFJlcGxhY2UpIHtcbiAgICAgICAgICB2YXIgcmVwbGFjZXJBcmdzID0gW21hdGNoZWRdLmNvbmNhdChjYXB0dXJlcywgcG9zaXRpb24sIFMpO1xuICAgICAgICAgIGlmIChuYW1lZENhcHR1cmVzICE9PSB1bmRlZmluZWQpIHJlcGxhY2VyQXJncy5wdXNoKG5hbWVkQ2FwdHVyZXMpO1xuICAgICAgICAgIHZhciByZXBsYWNlbWVudCA9IFN0cmluZyhyZXBsYWNlVmFsdWUuYXBwbHkodW5kZWZpbmVkLCByZXBsYWNlckFyZ3MpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXBsYWNlbWVudCA9IGdldFN1YnN0aXR1dGlvbihtYXRjaGVkLCBTLCBwb3NpdGlvbiwgY2FwdHVyZXMsIG5hbWVkQ2FwdHVyZXMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID49IG5leHRTb3VyY2VQb3NpdGlvbikge1xuICAgICAgICAgIGFjY3VtdWxhdGVkUmVzdWx0ICs9IFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uLCBwb3NpdGlvbikgKyByZXBsYWNlbWVudDtcbiAgICAgICAgICBuZXh0U291cmNlUG9zaXRpb24gPSBwb3NpdGlvbiArIG1hdGNoZWQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0ZWRSZXN1bHQgKyBTLnNsaWNlKG5leHRTb3VyY2VQb3NpdGlvbik7XG4gICAgfVxuICBdO1xuXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0c3Vic3RpdHV0aW9uXG4gIGZ1bmN0aW9uIGdldFN1YnN0aXR1dGlvbihtYXRjaGVkLCBzdHIsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZW1lbnQpIHtcbiAgICB2YXIgdGFpbFBvcyA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgdmFyIG0gPSBjYXB0dXJlcy5sZW5ndGg7XG4gICAgdmFyIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRDtcbiAgICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuYW1lZENhcHR1cmVzID0gdG9PYmplY3QobmFtZWRDYXB0dXJlcyk7XG4gICAgICBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFM7XG4gICAgfVxuICAgIHJldHVybiAkcmVwbGFjZS5jYWxsKHJlcGxhY2VtZW50LCBzeW1ib2xzLCBmdW5jdGlvbiAobWF0Y2gsIGNoKSB7XG4gICAgICB2YXIgY2FwdHVyZTtcbiAgICAgIHN3aXRjaCAoY2guY2hhckF0KDApKSB7XG4gICAgICAgIGNhc2UgJyQnOiByZXR1cm4gJyQnO1xuICAgICAgICBjYXNlICcmJzogcmV0dXJuIG1hdGNoZWQ7XG4gICAgICAgIGNhc2UgJ2AnOiByZXR1cm4gc3RyLnNsaWNlKDAsIHBvc2l0aW9uKTtcbiAgICAgICAgY2FzZSBcIidcIjogcmV0dXJuIHN0ci5zbGljZSh0YWlsUG9zKTtcbiAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgY2FwdHVyZSA9IG5hbWVkQ2FwdHVyZXNbY2guc2xpY2UoMSwgLTEpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDogLy8gXFxkXFxkP1xuICAgICAgICAgIHZhciBuID0gK2NoO1xuICAgICAgICAgIGlmIChuID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgaWYgKG4gPiBtKSB7XG4gICAgICAgICAgICB2YXIgZiA9IGZsb29yKG4gLyAxMCk7XG4gICAgICAgICAgICBpZiAoZiA9PT0gMCkgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgICAgaWYgKGYgPD0gbSkgcmV0dXJuIGNhcHR1cmVzW2YgLSAxXSA9PT0gdW5kZWZpbmVkID8gY2guY2hhckF0KDEpIDogY2FwdHVyZXNbZiAtIDFdICsgY2guY2hhckF0KDEpO1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXB0dXJlID0gY2FwdHVyZXNbbiAtIDFdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhcHR1cmUgPT09IHVuZGVmaW5lZCA/ICcnIDogY2FwdHVyZTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5yZXF1aXJlKCcuL2VzNi5yZWdleHAuZmxhZ3MnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyICRmbGFncyA9IHJlcXVpcmUoJy4vX2ZsYWdzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgJHRvU3RyaW5nID0gLy4vW1RPX1NUUklOR107XG5cbnZhciBkZWZpbmUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmVxdWlyZSgnLi9fcmVkZWZpbmUnKShSZWdFeHAucHJvdG90eXBlLCBUT19TVFJJTkcsIGZuLCB0cnVlKTtcbn07XG5cbi8vIDIxLjIuNS4xNCBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nKClcbmlmIChyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHsgcmV0dXJuICR0b1N0cmluZy5jYWxsKHsgc291cmNlOiAnYScsIGZsYWdzOiAnYicgfSkgIT0gJy9hL2InOyB9KSkge1xuICBkZWZpbmUoZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgdmFyIFIgPSBhbk9iamVjdCh0aGlzKTtcbiAgICByZXR1cm4gJy8nLmNvbmNhdChSLnNvdXJjZSwgJy8nLFxuICAgICAgJ2ZsYWdzJyBpbiBSID8gUi5mbGFncyA6ICFERVNDUklQVE9SUyAmJiBSIGluc3RhbmNlb2YgUmVnRXhwID8gJGZsYWdzLmNhbGwoUikgOiB1bmRlZmluZWQpO1xuICB9KTtcbi8vIEZGNDQtIFJlZ0V4cCN0b1N0cmluZyBoYXMgYSB3cm9uZyBuYW1lXG59IGVsc2UgaWYgKCR0b1N0cmluZy5uYW1lICE9IFRPX1NUUklORykge1xuICBkZWZpbmUoZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICR0b1N0cmluZy5jYWxsKHRoaXMpO1xuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNFVCA9ICdTZXQnO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKShTRVQsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSkge1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHZhbGlkYXRlKHRoaXMsIFNFVCksIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gQi4yLjMuMTAgU3RyaW5nLnByb3RvdHlwZS5saW5rKHVybClcbnJlcXVpcmUoJy4vX3N0cmluZy1odG1sJykoJ2xpbmsnLCBmdW5jdGlvbiAoY3JlYXRlSFRNTCkge1xuICByZXR1cm4gZnVuY3Rpb24gbGluayh1cmwpIHtcbiAgICByZXR1cm4gY3JlYXRlSFRNTCh0aGlzLCAnYScsICdocmVmJywgdXJsKTtcbiAgfTtcbn0pO1xuIiwiLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjb250ZXh0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWNvbnRleHQnKTtcbnZhciBTVEFSVFNfV0lUSCA9ICdzdGFydHNXaXRoJztcbnZhciAkc3RhcnRzV2l0aCA9ICcnW1NUQVJUU19XSVRIXTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscy1pcy1yZWdleHAnKShTVEFSVFNfV0lUSCksICdTdHJpbmcnLCB7XG4gIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIC8qICwgcG9zaXRpb24gPSAwICovKSB7XG4gICAgdmFyIHRoYXQgPSBjb250ZXh0KHRoaXMsIHNlYXJjaFN0cmluZywgU1RBUlRTX1dJVEgpO1xuICAgIHZhciBpbmRleCA9IHRvTGVuZ3RoKE1hdGgubWluKGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCB0aGF0Lmxlbmd0aCkpO1xuICAgIHZhciBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoU3RyaW5nKTtcbiAgICByZXR1cm4gJHN0YXJ0c1dpdGhcbiAgICAgID8gJHN0YXJ0c1dpdGguY2FsbCh0aGF0LCBzZWFyY2gsIGluZGV4KVxuICAgICAgOiB0aGF0LnNsaWNlKGluZGV4LCBpbmRleCArIHNlYXJjaC5sZW5ndGgpID09PSBzZWFyY2g7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIE1FVEEgPSByZXF1aXJlKCcuL19tZXRhJykuS0VZO1xudmFyICRmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xudmFyIHdrc0V4dCA9IHJlcXVpcmUoJy4vX3drcy1leHQnKTtcbnZhciB3a3NEZWZpbmUgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJyk7XG52YXIgZW51bUtleXMgPSByZXF1aXJlKCcuL19lbnVtLWtleXMnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBfY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdPUE5FeHQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKTtcbnZhciAkR09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgJERQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUEQgPSAkR09QRC5mO1xudmFyIGRQID0gJERQLmY7XG52YXIgZ09QTiA9IGdPUE5FeHQuZjtcbnZhciAkU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciAkSlNPTiA9IGdsb2JhbC5KU09OO1xudmFyIF9zdHJpbmdpZnkgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgSElEREVOID0gd2tzKCdfaGlkZGVuJyk7XG52YXIgVE9fUFJJTUlUSVZFID0gd2tzKCd0b1ByaW1pdGl2ZScpO1xudmFyIGlzRW51bSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKTtcbnZhciBBbGxTeW1ib2xzID0gc2hhcmVkKCdzeW1ib2xzJyk7XG52YXIgT1BTeW1ib2xzID0gc2hhcmVkKCdvcC1zeW1ib2xzJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3RbUFJPVE9UWVBFXTtcbnZhciBVU0VfTkFUSVZFID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcbnZhciBRT2JqZWN0ID0gZ2xvYmFsLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBzZXR0ZXIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEVdIHx8ICFRT2JqZWN0W1BST1RPVFlQRV0uZmluZENoaWxkO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZFAodGhpcywgJ2EnLCB7IHZhbHVlOiA3IH0pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24gKGl0LCBrZXksIEQpIHtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmIChwcm90b0Rlc2MpIGRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBkUChpdCwga2V5LCBEKTtcbiAgaWYgKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pIGRQKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogZFA7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24gKHRhZykge1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCkge1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvKSAkZGVmaW5lUHJvcGVydHkoT1BTeW1ib2xzLCBrZXksIEQpO1xuICBhbk9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEQpO1xuICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSkpIHtcbiAgICBpZiAoIUQuZW51bWVyYWJsZSkge1xuICAgICAgaWYgKCFoYXMoaXQsIEhJRERFTikpIGRQKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSBpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHsgZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSkgfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gZFAoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCkge1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSk7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGwgPiBpKSAkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKSB7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KSB7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSk7XG4gIGlmICh0aGlzID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSkge1xuICBpdCA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybjtcbiAgdmFyIEQgPSBnT1BEKGl0LCBrZXkpO1xuICBpZiAoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKSBELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHZhciBuYW1lcyA9IGdPUE4odG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmICghaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4gJiYga2V5ICE9IE1FVEEpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCkge1xuICB2YXIgSVNfT1AgPSBpdCA9PT0gT2JqZWN0UHJvdG87XG4gIHZhciBuYW1lcyA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiAoSVNfT1AgPyBoYXMoT2JqZWN0UHJvdG8sIGtleSkgOiB0cnVlKSkgcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpIHRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIScpO1xuICAgIHZhciB0YWcgPSB1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICAgIHZhciAkc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8pICRzZXQuY2FsbChPUFN5bWJvbHMsIHZhbHVlKTtcbiAgICAgIGlmIChoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKSB0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmIChERVNDUklQVE9SUyAmJiBzZXR0ZXIpIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywgeyBjb25maWd1cmFibGU6IHRydWUsIHNldDogJHNldCB9KTtcbiAgICByZXR1cm4gd3JhcCh0YWcpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sW1BST1RPVFlQRV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgPSAkZGVmaW5lUHJvcGVydHk7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZiA9IGdPUE5FeHQuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZiA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSkge1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgU3ltYm9sOiAkU3ltYm9sIH0pO1xuXG5mb3IgKHZhciBlczZTeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGogPSAwOyBlczZTeW1ib2xzLmxlbmd0aCA+IGo7KXdrcyhlczZTeW1ib2xzW2orK10pO1xuXG5mb3IgKHZhciB3ZWxsS25vd25TeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgayA9IDA7IHdlbGxLbm93blN5bWJvbHMubGVuZ3RoID4gazspIHdrc0RlZmluZSh3ZWxsS25vd25TeW1ib2xzW2srK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICAgIGlmICghaXNTeW1ib2woc3ltKSkgdGhyb3cgVHlwZUVycm9yKHN5bSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICAgIGZvciAodmFyIGtleSBpbiBTeW1ib2xSZWdpc3RyeSkgaWYgKFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkgcmV0dXJuIGtleTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHsgYTogUyB9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSkpLCAnSlNPTicsIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpIHtcbiAgICB2YXIgYXJncyA9IFtpdF07XG4gICAgdmFyIGkgPSAxO1xuICAgIHZhciByZXBsYWNlciwgJHJlcGxhY2VyO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICAkcmVwbGFjZXIgPSByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYgKCFpc09iamVjdChyZXBsYWNlcikgJiYgaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpIHJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIGlmICghaXNBcnJheShyZXBsYWNlcikpIHJlcGxhY2VyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgJHJlcGxhY2VyID09ICdmdW5jdGlvbicpIHZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZiAoIWlzU3ltYm9sKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICAgIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbiAgfVxufSk7XG5cbi8vIDE5LjQuMy40IFN5bWJvbC5wcm90b3R5cGVbQEB0b1ByaW1pdGl2ZV0oaGludClcbiRTeW1ib2xbUFJPVE9UWVBFXVtUT19QUklNSVRJVkVdIHx8IHJlcXVpcmUoJy4vX2hpZGUnKSgkU3ltYm9sW1BST1RPVFlQRV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEVdLnZhbHVlT2YpO1xuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9iamVjdC12YWx1ZXMtZW50cmllc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkZW50cmllcyA9IHJlcXVpcmUoJy4vX29iamVjdC10by1hcnJheScpKHRydWUpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgZW50cmllczogZnVuY3Rpb24gZW50cmllcyhpdCkge1xuICAgIHJldHVybiAkZW50cmllcyhpdCk7XG4gIH1cbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICR2YWx1ZXMgPSByZXF1aXJlKCcuL19vYmplY3QtdG8tYXJyYXknKShmYWxzZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICB2YWx1ZXM6IGZ1bmN0aW9uIHZhbHVlcyhpdCkge1xuICAgIHJldHVybiAkdmFsdWVzKGl0KTtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTtcbiIsInZhciAkaXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciBJVEVSQVRPUiA9IHdrcygnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5O1xuXG52YXIgRE9NSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IGZhbHNlLFxuICBDU1NWYWx1ZUxpc3Q6IGZhbHNlLFxuICBDbGllbnRSZWN0TGlzdDogZmFsc2UsXG4gIERPTVJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NU3RyaW5nTGlzdDogZmFsc2UsXG4gIERPTVRva2VuTGlzdDogdHJ1ZSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IGZhbHNlLFxuICBGaWxlTGlzdDogZmFsc2UsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MRm9ybUVsZW1lbnQ6IGZhbHNlLFxuICBIVE1MU2VsZWN0RWxlbWVudDogZmFsc2UsXG4gIE1lZGlhTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIE1pbWVUeXBlQXJyYXk6IGZhbHNlLFxuICBOYW1lZE5vZGVNYXA6IGZhbHNlLFxuICBOb2RlTGlzdDogdHJ1ZSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogZmFsc2UsXG4gIFBsdWdpbjogZmFsc2UsXG4gIFBsdWdpbkFycmF5OiBmYWxzZSxcbiAgU1ZHTGVuZ3RoTGlzdDogZmFsc2UsXG4gIFNWR051bWJlckxpc3Q6IGZhbHNlLFxuICBTVkdQYXRoU2VnTGlzdDogZmFsc2UsXG4gIFNWR1BvaW50TGlzdDogZmFsc2UsXG4gIFNWR1N0cmluZ0xpc3Q6IGZhbHNlLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiBmYWxzZSxcbiAgU291cmNlQnVmZmVyTGlzdDogZmFsc2UsXG4gIFN0eWxlU2hlZXRMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgVGV4dFRyYWNrQ3VlTGlzdDogZmFsc2UsXG4gIFRleHRUcmFja0xpc3Q6IGZhbHNlLFxuICBUb3VjaExpc3Q6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBjb2xsZWN0aW9ucyA9IGdldEtleXMoRE9NSXRlcmFibGVzKSwgaSA9IDA7IGkgPCBjb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IGNvbGxlY3Rpb25zW2ldO1xuICB2YXIgZXhwbGljaXQgPSBET01JdGVyYWJsZXNbTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICB2YXIga2V5O1xuICBpZiAocHJvdG8pIHtcbiAgICBpZiAoIXByb3RvW0lURVJBVE9SXSkgaGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZiAoIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBpZiAoZXhwbGljaXQpIGZvciAoa2V5IGluICRpdGVyYXRvcnMpIGlmICghcHJvdG9ba2V5XSkgcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgUGFydGljbGVzXzEgPSByZXF1aXJlKFwiLi4vUGFydGljbGVzL1BhcnRpY2xlc1wiKTtcbnZhciBTdGFyc18xID0gcmVxdWlyZShcIi4vU3RhcnNcIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBjYW52YXMgPSBuZXcgUGFydGljbGVzXzEuZGVmYXVsdCgnI3BhcnRpY2xlcycsICcyZCcpO1xuY2FudmFzLnNldFBhcnRpY2xlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5QYXJ0aWNsZXMpO1xuY2FudmFzLnNldEludGVyYWN0aXZlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5JbnRlcmFjdGl2ZSk7XG5jYW52YXMuc3RhcnQoKTtcbnZhciBwYXVzZWQgPSBmYWxzZTtcbldlYlBhZ2VfMS5TY3JvbGxIb29rLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoV2ViUGFnZV8xLlNlY3Rpb25zLmdldCgnY2FudmFzJykuaW5WaWV3KCkpIHtcbiAgICAgICAgaWYgKHBhdXNlZCkge1xuICAgICAgICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICBjYW52YXMucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICghcGF1c2VkKSB7XG4gICAgICAgICAgICBwYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2FudmFzLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG59LCB7XG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBwYXNzaXZlOiB0cnVlXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdGFycyA9IHZvaWQgMDtcbmV4cG9ydHMuU3RhcnMgPSB7XG4gICAgUGFydGljbGVzOiB7XG4gICAgICAgIG51bWJlcjogMzAwLFxuICAgICAgICBkZW5zaXR5OiAyMDAsXG4gICAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgICAgIG9wYWNpdHk6ICdyYW5kb20nLFxuICAgICAgICByYWRpdXM6IFsyLCAyLjUsIDMsIDMuNSwgNCwgNC41XSxcbiAgICAgICAgc2hhcGU6ICdjaXJjbGUnLFxuICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgICAgICB9LFxuICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICBzcGVlZDogMC4yLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAncmFuZG9tJyxcbiAgICAgICAgICAgIHN0cmFpZ2h0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgIGVkZ2VCb3VuY2U6IGZhbHNlLFxuICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICBob3ZlcjogJ2J1YmJsZScsXG4gICAgICAgICAgICBjbGljazogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIHN5bmM6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIHN5bmM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIEludGVyYWN0aXZlOiB7XG4gICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogNzUsXG4gICAgICAgICAgICAgICAgcmFkaXVzOiA4LFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIENvbXBvbmVudHM7XG4oZnVuY3Rpb24gKENvbXBvbmVudHMpIHtcbiAgICB2YXIgSGVscGVycztcbiAgICAoZnVuY3Rpb24gKEhlbHBlcnMpIHtcbiAgICAgICAgZnVuY3Rpb24gcnVuSWZEZWZpbmVkKF90aGlzLCBtZXRob2QsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChfdGhpc1ttZXRob2RdICYmIF90aGlzW21ldGhvZF0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIF90aGlzW21ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSGVscGVycy5ydW5JZkRlZmluZWQgPSBydW5JZkRlZmluZWQ7XG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaEludGVyZmFjZShfdGhpcywgbmFtZSkge1xuICAgICAgICAgICAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShfdGhpcywgbmFtZSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBJbnRlcmZhY2VbbmFtZV0sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMuYXR0YWNoSW50ZXJmYWNlID0gYXR0YWNoSW50ZXJmYWNlO1xuICAgIH0pKEhlbHBlcnMgfHwgKEhlbHBlcnMgPSB7fSkpO1xuICAgIHZhciBJbnRlcmZhY2U7XG4gICAgKGZ1bmN0aW9uIChJbnRlcmZhY2UpIHtcbiAgICAgICAgZnVuY3Rpb24gYXBwZW5kVG8ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IHRoaXM7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXNfMS5fbW91bnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBFdmVudHMuZGlzcGF0Y2goX3RoaXNfMSwgJ21vdW50ZWQnLCB7IHBhcmVudDogcGFyZW50IH0pO1xuICAgICAgICAgICAgICAgICAgICBfdGhpc18xLl9tb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgICBJbnRlcmZhY2UuYXBwZW5kVG8gPSBhcHBlbmRUbztcbiAgICB9KShJbnRlcmZhY2UgfHwgKEludGVyZmFjZSA9IHt9KSk7XG4gICAgdmFyIEV2ZW50cztcbiAgICAoZnVuY3Rpb24gKEV2ZW50cykge1xuICAgICAgICBmdW5jdGlvbiBkaXNwYXRjaChfdGhpcywgZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgIEhlbHBlcnMucnVuSWZEZWZpbmVkKF90aGlzLCBldmVudCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnRzLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG4gICAgfSkoRXZlbnRzIHx8IChFdmVudHMgPSB7fSkpO1xuICAgIHZhciBfX0Jhc2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBfX0Jhc2UoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfX0Jhc2U7XG4gICAgfSgpKTtcbiAgICB2YXIgQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKENvbXBvbmVudCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQ29tcG9uZW50KCkge1xuICAgICAgICAgICAgdmFyIF90aGlzXzEgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICAgICAgX3RoaXNfMS5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIF90aGlzXzEuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF90aGlzXzEuX3NldHVwSW50ZXJmYWNlKCk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNfMTtcbiAgICAgICAgfVxuICAgICAgICBDb21wb25lbnQucHJvdG90eXBlLl9zZXR1cEludGVyZmFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuYXR0YWNoSW50ZXJmYWNlKHRoaXMsICdhcHBlbmRUbycpO1xuICAgICAgICB9O1xuICAgICAgICBDb21wb25lbnQucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkgeyB9O1xuICAgICAgICBDb21wb25lbnQucHJvdG90eXBlLmdldFJlZmVyZW5jZSA9IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltyZWY9XFxcIlwiICsgcmVmICsgXCJcXFwiXVwiKSB8fCBudWxsO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ29tcG9uZW50O1xuICAgIH0oX19CYXNlKSk7XG4gICAgdmFyIEluaXRpYWxpemU7XG4gICAgKGZ1bmN0aW9uIChJbml0aWFsaXplKSB7XG4gICAgICAgIGZ1bmN0aW9uIF9fSW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgRXZlbnRzLmRpc3BhdGNoKHRoaXMsICdjcmVhdGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gTWFpbihfdGhpcykge1xuICAgICAgICAgICAgKF9fSW5pdGlhbGl6ZS5iaW5kKF90aGlzKSkoKTtcbiAgICAgICAgfVxuICAgICAgICBJbml0aWFsaXplLk1haW4gPSBNYWluO1xuICAgIH0pKEluaXRpYWxpemUgfHwgKEluaXRpYWxpemUgPSB7fSkpO1xuICAgIHZhciBIVE1MQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEhUTUxDb21wb25lbnQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEhUTUxDb21wb25lbnQoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgICAgICBJbml0aWFsaXplLk1haW4oX3RoaXNfMSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNfMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSFRNTENvbXBvbmVudDtcbiAgICB9KENvbXBvbmVudCkpO1xuICAgIENvbXBvbmVudHMuSFRNTENvbXBvbmVudCA9IEhUTUxDb21wb25lbnQ7XG4gICAgdmFyIERhdGFDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGF0YUNvbXBvbmVudCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRGF0YUNvbXBvbmVudChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgICAgICBfdGhpc18xLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgSW5pdGlhbGl6ZS5NYWluKF90aGlzXzEpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzXzE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERhdGFDb21wb25lbnQ7XG4gICAgfShDb21wb25lbnQpKTtcbiAgICBDb21wb25lbnRzLkRhdGFDb21wb25lbnQgPSBEYXRhQ29tcG9uZW50O1xufSkoQ29tcG9uZW50cyB8fCAoQ29tcG9uZW50cyA9IHt9KSk7XG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DZXJ0aWZpY2F0ZXMgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBDZXJ0aWZpY2F0ZXMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDZXJ0aWZpY2F0ZXMsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2VydGlmaWNhdGVzKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaW5mb0Rpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy50b29sdGlwTGVmdCA9IHRydWU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQ2VydGlmaWNhdGVzLnByb3RvdHlwZS5jcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5kYXRhLmF3YXJkKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuY2hlY2tUb29sdGlwU2lkZSgpOyB9LCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENlcnRpZmljYXRlcy5wcm90b3R5cGUubW91bnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5hd2FyZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja1Rvb2x0aXBTaWRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENlcnRpZmljYXRlcy5wcm90b3R5cGUuY2hlY2tUb29sdGlwU2lkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldFJlZmVyZW5jZSgndG9vbHRpcCcpO1xuICAgICAgICB2YXIgdG9vbHRpcFBvcyA9IHRvb2x0aXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCkud2lkdGg7XG4gICAgICAgIGlmICh0aGlzLnRvb2x0aXBMZWZ0ICE9PSAodG9vbHRpcFBvcyA+PSBzY3JlZW5XaWR0aCAvIDIpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBMZWZ0ID0gIXRoaXMudG9vbHRpcExlZnQ7XG4gICAgICAgICAgICB2YXIgYWRkID0gdGhpcy50b29sdGlwTGVmdCA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAgICAgdmFyIHJlbW92ZSA9IHRoaXMudG9vbHRpcExlZnQgPyAndG9wJyA6ICdsZWZ0JztcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZShyZW1vdmUpO1xuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKGFkZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENlcnRpZmljYXRlcy5wcm90b3R5cGUubGVzc0luZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5mb0Rpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgQ2VydGlmaWNhdGVzLnByb3RvdHlwZS50b2dnbGVJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZm9EaXNwbGF5ZWQgPSAhdGhpcy5pbmZvRGlzcGxheWVkO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgQ2VydGlmaWNhdGVzLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZm9EaXNwbGF5ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5zZXRBdHRyaWJ1dGUoJ29wZW5lZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5yZW1vdmVBdHRyaWJ1dGUoJ29wZW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdpbmZvVGV4dCcpLmlubmVySFRNTCA9ICh0aGlzLmluZm9EaXNwbGF5ZWQgPyAnTGVzcycgOiAnTW9yZScpICsgXCIgSW5mb1wiO1xuICAgIH07XG4gICAgQ2VydGlmaWNhdGVzLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5saW5lU3R5bGUgPSB7XG4gICAgICAgICAgICAnLS1idXR0b24tYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuZGF0YS5jb2xvclxuICAgICAgICB9O1xuICAgICAgICB2YXIgaW1hZ2VTdHlsZSA9IHtcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogXCJ1cmwoXCIgKyAoXCIuL291dC9pbWFnZXMvQ2VydGlmaWNhdGVzL1wiICsgdGhpcy5kYXRhLmltYWdlKSArIFwiKVwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS02IG1kLTRcIiB9LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmF3YXJkID9cbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImF3YXJkXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0b29sdGlwLWNvbnRhaW5lclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIm91dC9pbWFnZXMvUHJvamVjdHMvYXdhcmQucG5nXCIsIHN0eWxlOiB7IHRyYW5zZm9ybTogJ3NjYWxlKDEuNSknIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHJlZjogXCJ0b29sdGlwXCIsIGNsYXNzTmFtZTogXCJ0b29sdGlwIGxlZnQgaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmF3YXJkKSkpXG4gICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9qZWN0IGNhcmQgaXMtdGhlbWUtc2Vjb25kYXJ5IGVsZXZhdGlvbi0xIGlzLWluLWdyaWQgaGlkZS1vdmVyZmxvd1wiLCBzdHlsZTogaW5saW5lU3R5bGUgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImltYWdlXCIsIHN0eWxlOiBpbWFnZVN0eWxlIH0pLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRpdGxlXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS02IGlzLWJvbGQtd2VpZ2h0XCIsIHN0eWxlOiB7IGNvbG9yOiB0aGlzLmRhdGEuY29sb3IgfSB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0eXBlIGlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS50eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmRhdGUpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJib2R5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImZsYXZvciBpcy1zaXplLTdcIiB9LCB0aGlzLmRhdGEuZmxhdm9yKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2xpZGVyIGlzLXRoZW1lLXNlY29uZGFyeVwiLCByZWY6IFwic2xpZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGl0bGUgZmxleCByb3cgeHMteC1iZWdpbiB4cy15LWNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtNiBpcy1ib2xkLXdlaWdodFwiIH0sIFwiSW5mb1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjbG9zZS1idG4td3JhcHBlciB4cy14LXNlbGYtZW5kXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGNsb3NlIGlzLXN2ZyBpcy1wcmltYXJ5XCIsIHRhYmluZGV4OiBcIi0xXCIsIG9uQ2xpY2s6IHRoaXMubGVzc0luZm8uYmluZCh0aGlzKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS10aW1lc1wiIH0pKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJkZXRhaWxzIHhzLXktcGFkZGluZy1iZXR3ZWVuLTEgaXMtc2l6ZS05XCIgfSwgdGhpcy5kYXRhLmRldGFpbHMubWFwKGZ1bmN0aW9uIChkZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKSkpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcIm9wdGlvbnMgaXMtdGhlbWUtc2Vjb25kYXJ5IHhzLXgtbWFyZ2luLWJldHdlZW4tMVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucmVwbyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImFcIiwgeyBjbGFzc05hbWU6IFwiY29kZSBidG4gaXMtcHJpbWFyeSBpcy10ZXh0IGlzLWN1c3RvbVwiLCBocmVmOiB0aGlzLmRhdGEucmVwbywgdGFyZ2V0OiBcIl9ibGFua1wiLCB0YWJpbmRleDogXCIwXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiZmFzIGZhLWNvZGVcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJTZWUgQ29kZVwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZXh0ZXJuYWwgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImV4dGVybmFsIGJ0biBpcy1wcmltYXJ5IGlzLXRleHQgaXMtY3VzdG9tXCIsIGhyZWY6IHRoaXMuZGF0YS5leHRlcm5hbCwgdGFyZ2V0OiBcIl9ibGFua1wiLCB0YWJpbmRleDogXCIwXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiZmFzIGZhLWV4dGVybmFsLWxpbmstYWx0XCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiVmlldyBDcmVkZW50aWFsc1wiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwpKSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBDZXJ0aWZpY2F0ZXM7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuQ2VydGlmaWNhdGVzID0gQ2VydGlmaWNhdGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVkdWNhdGlvbiA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIEVkdWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVkdWNhdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFZHVjYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS5jcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBET01fMS5ET00ub25GaXJzdEFwcGVhcmFuY2UodGhpcy5lbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5zZXRQcm9ncmVzcygpO1xuICAgICAgICB9LCB7IHRpbWVvdXQ6IDUwMCwgb2Zmc2V0OiAwLjMgfSk7XG4gICAgfTtcbiAgICBFZHVjYXRpb24ucHJvdG90eXBlLnNldFByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29tcGxldGVkID0gdGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkIC8gdGhpcy5kYXRhLmNyZWRpdHMudG90YWwgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgdmFyIHRha2luZyA9ICh0aGlzLmRhdGEuY3JlZGl0cy5jb21wbGV0ZWQgKyB0aGlzLmRhdGEuY3JlZGl0cy50YWtpbmcpIC8gdGhpcy5kYXRhLmNyZWRpdHMudG90YWwgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgdGhpcy5nZXRSZWZlcmVuY2UoJ2NvbXBsZXRlZFRyYWNrJykuc3R5bGUud2lkdGggPSBjb21wbGV0ZWQ7XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCd0YWtpbmdUcmFjaycpLnN0eWxlLndpZHRoID0gdGFraW5nO1xuICAgICAgICB2YXIgY29tcGxldGVkTWFya2VyID0gdGhpcy5nZXRSZWZlcmVuY2UoJ2NvbXBsZXRlZE1hcmtlcicpO1xuICAgICAgICB2YXIgdGFraW5nTWFya2VyID0gdGhpcy5nZXRSZWZlcmVuY2UoJ3Rha2luZ01hcmtlcicpO1xuICAgICAgICBjb21wbGV0ZWRNYXJrZXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgY29tcGxldGVkTWFya2VyLnN0eWxlLmxlZnQgPSBjb21wbGV0ZWQ7XG4gICAgICAgIHRha2luZ01hcmtlci5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICB0YWtpbmdNYXJrZXIuc3R5bGUubGVmdCA9IHRha2luZztcbiAgICB9O1xuICAgIEVkdWNhdGlvbi5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlubGluZVN0eWxlID0ge1xuICAgICAgICAgICAgJy0tcHJvZ3Jlc3MtYmFyLWNvbG9yJzogdGhpcy5kYXRhLmNvbG9yXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjYXJkIGlzLXRoZW1lLXNlY29uZGFyeSBlbGV2YXRpb24tMSBlZHVjYXRpb25cIiwgc3R5bGU6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBpbmxpbmVTdHlsZSksIHsgbWFyZ2luVG9wOiAnMzBweCcgfSkgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaGVhZGVyIGZsZXggcm93IHNtLXdyYXAgbWQtbm93cmFwIHhzLXgtY2VudGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImljb24geHMtYXV0b1wiLCBocmVmOiB0aGlzLmRhdGEubGluaywgdGFyZ2V0OiBcIl9ibGFua1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogXCJvdXQvaW1hZ2VzL0VkdWNhdGlvbi9cIiArIHRoaXMuZGF0YS5pbWFnZSB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImFib3V0IHhzLWZ1bGxcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW5zdGl0dXRpb24gZmxleCByb3cgeHMteC1jZW50ZXIgeHMteS1jZW50ZXIgbWQteC1iZWdpblwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgeHMtZnVsbCBtZC1hdXRvIGlzLWNlbnRlci1hbGlnbmVkIGlzLWJvbGQtd2VpZ2h0IGlzLXNpemUtNiBpcy1jb2xvcmVkLWxpbmtcIiwgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImxvY2F0aW9uIG1kLXgtc2VsZi1lbmQgaXMtaXRhbGljIGlzLXNpemUtOCBpcy1jb2xvci1saWdodFwiIH0sIHRoaXMuZGF0YS5sb2NhdGlvbikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiZGVncmVlIGZsZXggcm93IHhzLXgtY2VudGVyIHhzLXktY2VudGVyIG1kLXgtYmVnaW5cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJuYW1lIHhzLWZ1bGwgbWQtYXV0byBpcy1jZW50ZXItYWxpZ25lZCBpcy1ib2xkLXdlaWdodCBpcy1zaXplLTcgaXMtY29sb3ItbGlnaHRcIiB9LCB0aGlzLmRhdGEuZGVncmVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGF0ZSBtZC14LXNlbGYtZW5kIGlzLWl0YWxpYyBpcy1zaXplLTggaXMtY29sb3ItbGlnaHRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcXHUyMDE0IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmVuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKVwiKSkpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9ncmVzcyBmbGV4IHJvdyB4cy1ub3dyYXAgeHMteS1jZW50ZXIgcHJvZ3Jlc3MtYmFyLWhvdmVyLWNvbnRhaW5lclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInByb2dyZXNzLWJhclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb21wbGV0ZWQgbWFya2VyXCIsIHN0eWxlOiB7IG9wYWNpdHk6IDAgfSwgcmVmOiBcImNvbXBsZXRlZE1hcmtlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS5jcmVkaXRzLmNvbXBsZXRlZCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGFraW5nIG1hcmtlclwiLCBzdHlsZTogeyBvcGFjaXR5OiAwIH0sIHJlZjogXCJ0YWtpbmdNYXJrZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1zaXplLThcIiB9LCB0aGlzLmRhdGEuY3JlZGl0cy5jb21wbGV0ZWQgKyB0aGlzLmRhdGEuY3JlZGl0cy50YWtpbmcpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRyYWNrXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJidWZmZXJcIiwgcmVmOiBcInRha2luZ1RyYWNrXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJmaWxsXCIsIHJlZjogXCJjb21wbGV0ZWRUcmFja1wiIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImNyZWRpdHMgaXMtc2l6ZS04IHhzLWF1dG9cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5jcmVkaXRzLmNvbXBsZXRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAlXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbmZvIGNvbnRlbnQgcGFkZGluZy14LTQgcGFkZGluZy15LTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm5vdGVzLm1hcChmdW5jdGlvbiAobm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1saWdodC1jb2xvciBpcy1zaXplLTggaXMtaXRhbGljXCIgfSwgbm90ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY291cnNlc1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS02XCIgfSwgXCJDb3Vyc2V3b3JrXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJmbGV4IHJvdyBpcy1zaXplLTdcIiB9LCB0aGlzLmRhdGEuY291cnNlcy5tYXAoZnVuY3Rpb24gKGNvdXJzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiBcInhzLTEyIG1kLTZcIiB9LCBjb3Vyc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSkpKSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBFZHVjYXRpb247XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuRWR1Y2F0aW9uID0gRWR1Y2F0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIEV4cGVyaWVuY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFeHBlcmllbmNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEV4cGVyaWVuY2UoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgRXhwZXJpZW5jZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIEV4cGVyaWVuY2UucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjYXJkIGlzLXRoZW1lLXNlY29uZGFyeSBlbGV2YXRpb24tMSBleHBlcmllbmNlXCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaGVhZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpY29uXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IFwiLi9vdXQvaW1hZ2VzL0V4cGVyaWVuY2UvXCIgKyB0aGlzLmRhdGEuc3ZnLCBhbHQ6ICdhbHQnIH0pKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29tcGFueVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtNiBpcy1ib2xkLXdlaWdodCBpcy1jb2xvcmVkLWxpbmtcIiB9LCB0aGlzLmRhdGEuY29tcGFueSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJsb2NhdGlvbiBpcy1zaXplLTggaXMtaXRhbGljIGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmxvY2F0aW9uKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicm9sZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtNyBpcy1ib2xkLXdlaWdodFwiIH0sIHRoaXMuZGF0YS5wb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkYXRlIGlzLXNpemUtOCBpcy1pdGFsaWMgaXMtY29sb3ItbGlnaHRcIiB9LCBcIihcIiArIHRoaXMuZGF0YS5iZWdpbiArIFwiIFxcdTIwMTQgXCIgKyB0aGlzLmRhdGEuZW5kICsgXCIpXCIpKSksXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBpbmZvXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGVzY3JpcHRpb24gaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0IGlzLWl0YWxpYyBpcy1qdXN0aWZpZWQgaXMtcXVvdGVcIiB9LCB0aGlzLmRhdGEuZmxhdm9yKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInVsXCIsIHsgY2xhc3NOYW1lOiBcImpvYiBpcy1sZWZ0LWFsaWduZWQgaXMtc2l6ZS03IHhzLXktcGFkZGluZy1iZXR3ZWVuLTFcIiB9LCB0aGlzLmRhdGEucm9sZXMubWFwKGZ1bmN0aW9uIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIHJvbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KSkpKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIEV4cGVyaWVuY2U7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IEV4cGVyaWVuY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBIZWxwZXJzO1xuKGZ1bmN0aW9uIChIZWxwZXJzKSB7XG4gICAgZnVuY3Rpb24gbG9hZE9uRmlyc3RBcHBlYXJhbmNlKGhvb2ssIGNsYXNzTmFtZSkge1xuICAgICAgICBpZiAoY2xhc3NOYW1lID09PSB2b2lkIDApIHsgY2xhc3NOYW1lID0gJ3ByZWxvYWQnOyB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBob29rLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIERPTV8xLkRPTS5vbkZpcnN0QXBwZWFyYW5jZShob29rLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaG9vay5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSwgeyBvZmZzZXQ6IDAuNSB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEhlbHBlcnMubG9hZE9uRmlyc3RBcHBlYXJhbmNlID0gbG9hZE9uRmlyc3RBcHBlYXJhbmNlO1xufSkoSGVscGVycyB8fCAoSGVscGVycyA9IHt9KSk7XG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBlcnM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5NZW51ID0gdm9pZCAwO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlcl8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIE1lbnUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNZW51LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuUkdCUmVnRXhwID0gLyhyZ2JcXCgoWzAtOV17MSwzfSksIChbMC05XXsxLDN9KSwgKFswLTldezEsM30pXFwpKXwocmdiYVxcKChbMC05XXsxLDN9KSwgKFswLTldezEsM30pLCAoWzAtOV17MSwzfSksICgwKD86XFwuWzAtOV17MSwyfSk/KVxcKSkvZztcbiAgICAgICAgX3RoaXMuQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLm1lbnUnKTtcbiAgICAgICAgX3RoaXMuSGFtYnVyZ2VyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLm1lbnUgLmhhbWJ1cmdlcicpO1xuICAgICAgICBfdGhpcy5yZWdpc3RlcigndG9nZ2xlJyk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgTWVudS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9wZW4gPSAhdGhpcy5vcGVuO1xuICAgICAgICB0aGlzLm9wZW4gPyB0aGlzLm9wZW5NZW51KCkgOiB0aGlzLmNsb3NlTWVudSgpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCd0b2dnbGUnLCB7IG9wZW46IHRoaXMub3BlbiB9KTtcbiAgICB9O1xuICAgIE1lbnUucHJvdG90eXBlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnJyk7XG4gICAgICAgIHRoaXMuZGFya2VuKCk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5jbG9zZU1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnb3BlbicpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVwZGF0ZUNvbnRyYXN0KCk7IH0sIDc1MCk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5kYXJrZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuSGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpZ2h0Jyk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5saWdodGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKCdsaWdodCcpO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUudXBkYXRlQ29udHJhc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5vcGVuKSB7XG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZENvbG9yID0gdGhpcy5nZXRCYWNrZ3JvdW5kQ29sb3IoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQ29udHJhc3QoYmFja2dyb3VuZENvbG9yKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuZ2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWxlbWVudHNGcm9tUG9pbnQgPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludCA/ICdlbGVtZW50c0Zyb21Qb2ludCcgOiAnbXNFbGVtZW50c0Zyb21Qb2ludCc7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuSGFtYnVyZ2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCB0b3AgPSBfYS50b3AsIGxlZnQgPSBfYS5sZWZ0O1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudFtlbGVtZW50c0Zyb21Qb2ludF0obGVmdCwgdG9wKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgdmFyIFJHQiA9IFtdO1xuICAgICAgICB2YXIgYmFja2dyb3VuZCwgcmVnRXhSZXN1bHQ7XG4gICAgICAgIHZhciBzdHlsZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuZ3RoOyArK2ksIHRoaXMuUkdCUmVnRXhwLmxhc3RJbmRleCA9IDApIHtcbiAgICAgICAgICAgIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSBzdHlsZXMuYmFja2dyb3VuZCB8fCBzdHlsZXMuYmFja2dyb3VuZENvbG9yICsgc3R5bGVzLmJhY2tncm91bmRJbWFnZTtcbiAgICAgICAgICAgIHdoaWxlIChyZWdFeFJlc3VsdCA9IHRoaXMuUkdCUmVnRXhwLmV4ZWMoYmFja2dyb3VuZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVnRXhSZXN1bHRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgUkdCID0gcmVnRXhSZXN1bHQuc2xpY2UoMiwgNSkubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHBhcnNlSW50KHZhbCk7IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZWdFeFJlc3VsdFs1XSkge1xuICAgICAgICAgICAgICAgICAgICBSR0IgPSByZWdFeFJlc3VsdC5zbGljZSg2LCAxMCkubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHBhcnNlSW50KHZhbCk7IH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVJHQi5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSR0I7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5jaGFuZ2VDb250cmFzdCA9IGZ1bmN0aW9uIChSR0IpIHtcbiAgICAgICAgdmFyIGNvbnRyYXN0LCBsdW1pbmFuY2U7XG4gICAgICAgIGlmIChSR0IubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBjb250cmFzdCA9IFJHQi5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsIC8gMjU1OyB9KS5tYXAoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPD0gMC4wMzkyOCA/IHZhbCAvIDEyLjkyIDogTWF0aC5wb3coKHZhbCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsdW1pbmFuY2UgPSAwLjIxMjYgKiBjb250cmFzdFswXSArIDAuNzE1MiAqIGNvbnRyYXN0WzFdICsgMC4wNzIyICogY29udHJhc3RbMl07XG4gICAgICAgICAgICBpZiAobHVtaW5hbmNlID4gMC4xNzkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhcmtlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saWdodGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhcmtlbigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTWVudTtcbn0oRXZlbnREaXNwYXRjaGVyXzEuRXZlbnRzLkV2ZW50RGlzcGF0Y2hlcikpO1xuZXhwb3J0cy5NZW51ID0gTWVudTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlByb2plY3QgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBQcm9qZWN0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUHJvamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBQcm9qZWN0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaW5mb0Rpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy50b29sdGlwTGVmdCA9IHRydWU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5hd2FyZCkge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmNoZWNrVG9vbHRpcFNpZGUoKTsgfSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS5tb3VudGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmF3YXJkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrVG9vbHRpcFNpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY2hlY2tUb29sdGlwU2lkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldFJlZmVyZW5jZSgndG9vbHRpcCcpO1xuICAgICAgICB2YXIgdG9vbHRpcFBvcyA9IHRvb2x0aXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCkud2lkdGg7XG4gICAgICAgIGlmICh0aGlzLnRvb2x0aXBMZWZ0ICE9PSAodG9vbHRpcFBvcyA+PSBzY3JlZW5XaWR0aCAvIDIpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBMZWZ0ID0gIXRoaXMudG9vbHRpcExlZnQ7XG4gICAgICAgICAgICB2YXIgYWRkID0gdGhpcy50b29sdGlwTGVmdCA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAgICAgdmFyIHJlbW92ZSA9IHRoaXMudG9vbHRpcExlZnQgPyAndG9wJyA6ICdsZWZ0JztcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZShyZW1vdmUpO1xuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKGFkZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLmxlc3NJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZm9EaXNwbGF5ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLnRvZ2dsZUluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5mb0Rpc3BsYXllZCA9ICF0aGlzLmluZm9EaXNwbGF5ZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZm9EaXNwbGF5ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5zZXRBdHRyaWJ1dGUoJ29wZW5lZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5yZW1vdmVBdHRyaWJ1dGUoJ29wZW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdpbmZvVGV4dCcpLmlubmVySFRNTCA9ICh0aGlzLmluZm9EaXNwbGF5ZWQgPyAnTGVzcycgOiAnTW9yZScpICsgXCIgSW5mb1wiO1xuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlubGluZVN0eWxlID0ge1xuICAgICAgICAgICAgJy0tYnV0dG9uLWJhY2tncm91bmQtY29sb3InOiB0aGlzLmRhdGEuY29sb3JcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGltYWdlU3R5bGUgPSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IFwidXJsKFwiICsgKFwiLi9vdXQvaW1hZ2VzL1Byb2plY3RzL1wiICsgdGhpcy5kYXRhLmltYWdlKSArIFwiKVwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS02IG1kLTRcIiB9LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmF3YXJkID9cbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImF3YXJkXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0b29sdGlwLWNvbnRhaW5lclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIm91dC9pbWFnZXMvUHJvamVjdHMvYXdhcmQucG5nXCIsIHN0eWxlOiB7IHRyYW5zZm9ybTogJ3NjYWxlKDEuNSknIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHJlZjogXCJ0b29sdGlwXCIsIGNsYXNzTmFtZTogXCJ0b29sdGlwIGxlZnQgaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmF3YXJkKSkpXG4gICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9qZWN0IGNhcmQgaXMtdGhlbWUtc2Vjb25kYXJ5IGVsZXZhdGlvbi0xIGlzLWluLWdyaWQgaGlkZS1vdmVyZmxvd1wiLCBzdHlsZTogaW5saW5lU3R5bGUgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImltYWdlXCIsIHN0eWxlOiBpbWFnZVN0eWxlIH0pLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRpdGxlXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS02IGlzLWJvbGQtd2VpZ2h0XCIsIHN0eWxlOiB7IGNvbG9yOiB0aGlzLmRhdGEuY29sb3IgfSB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0eXBlIGlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS50eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmRhdGUpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJib2R5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImZsYXZvciBpcy1zaXplLTdcIiB9LCB0aGlzLmRhdGEuZmxhdm9yKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2xpZGVyIGlzLXRoZW1lLXNlY29uZGFyeVwiLCByZWY6IFwic2xpZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGl0bGUgZmxleCByb3cgeHMteC1iZWdpbiB4cy15LWNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtNiBpcy1ib2xkLXdlaWdodFwiIH0sIFwiVGFza3NcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY2xvc2UtYnRuLXdyYXBwZXIgeHMteC1zZWxmLWVuZFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBjbG9zZSBpcy1zdmcgaXMtcHJpbWFyeVwiLCB0YWJpbmRleDogXCItMVwiLCBvbkNsaWNrOiB0aGlzLmxlc3NJbmZvLmJpbmQodGhpcykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtdGltZXNcIiB9KSkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJvZHlcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiZGV0YWlscyB4cy15LXBhZGRpbmctYmV0d2Vlbi0xIGlzLXNpemUtOVwiIH0sIHRoaXMuZGF0YS5kZXRhaWxzLm1hcChmdW5jdGlvbiAoZGV0YWlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIGRldGFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSkpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJvcHRpb25zIGlzLXRoZW1lLXNlY29uZGFyeSB4cy14LW1hcmdpbi1iZXR3ZWVuLTFcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJpbmZvIGJ0biBpcy1wcmltYXJ5IGlzLXRleHQgaXMtY3VzdG9tXCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlSW5mby5iaW5kKHRoaXMpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiZmFzIGZhLWluZm9cIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHJlZjogXCJpbmZvVGV4dFwiIH0sIFwiTW9yZSBJbmZvXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5yZXBvID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJjb2RlIGJ0biBpcy1wcmltYXJ5IGlzLXRleHQgaXMtY3VzdG9tXCIsIGhyZWY6IHRoaXMuZGF0YS5yZXBvLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHRhYmluZGV4OiBcIjBcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtY29kZVwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIlNlZSBDb2RlXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5leHRlcm5hbCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImFcIiwgeyBjbGFzc05hbWU6IFwiZXh0ZXJuYWwgYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgaHJlZjogdGhpcy5kYXRhLmV4dGVybmFsLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHRhYmluZGV4OiBcIjBcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtZXh0ZXJuYWwtbGluay1hbHRcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJWaWV3IE9ubGluZVwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwpKSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBQcm9qZWN0O1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLlByb2plY3QgPSBQcm9qZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUXVhbGl0eSA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIFF1YWxpdHkgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhRdWFsaXR5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFF1YWxpdHkoZGF0YSkge1xuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgZGF0YSkgfHwgdGhpcztcbiAgICB9XG4gICAgUXVhbGl0eS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIFF1YWxpdHkucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS00XCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImljb24gXCIgKyB0aGlzLmRhdGEuZmFDbGFzcyB9KSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInF1YWxpdHkgaXMtc2l6ZS01IGlzLXVwcGVyY2FzZVwiIH0sIHRoaXMuZGF0YS5uYW1lKSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRlc2MgaXMtbGlnaHQtd2VpZ2h0IGlzLXNpemUtNlwiIH0sIHRoaXMuZGF0YS5kZXNjcmlwdGlvbikpKTtcbiAgICB9O1xuICAgIHJldHVybiBRdWFsaXR5O1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLlF1YWxpdHkgPSBRdWFsaXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9ET01cIik7XG52YXIgU2VjdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2VjdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIFNlY3Rpb24ucHJvdG90eXBlLmluVmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERPTV8xLkRPTS5pblZlcnRpY2FsV2luZG93Vmlldyh0aGlzLmVsZW1lbnQpO1xuICAgIH07XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuZ2V0SUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaWQ7XG4gICAgfTtcbiAgICBTZWN0aW9uLnByb3RvdHlwZS5pbk1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm8tbWVudScpO1xuICAgIH07XG4gICAgcmV0dXJuIFNlY3Rpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2VjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNraWxsID0gZXhwb3J0cy5Ta2lsbENhdGVnb3J5ID0gdm9pZCAwO1xudmFyIFNWR18xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvU1ZHXCIpO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIik7XG52YXIgU2tpbGxDYXRlZ29yeTtcbihmdW5jdGlvbiAoU2tpbGxDYXRlZ29yeSkge1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIlByb2dyYW1taW5nXCJdID0gMV0gPSBcIlByb2dyYW1taW5nXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiU2NyaXB0aW5nXCJdID0gMl0gPSBcIlNjcmlwdGluZ1wiO1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIldlYlwiXSA9IDRdID0gXCJXZWJcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJTZXJ2ZXJcIl0gPSA4XSA9IFwiU2VydmVyXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiRGF0YWJhc2VcIl0gPSAxNl0gPSBcIkRhdGFiYXNlXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiRGV2T3BzXCJdID0gMzJdID0gXCJEZXZPcHNcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJGcmFtZXdvcmtcIl0gPSA2NF0gPSBcIkZyYW1ld29ya1wiO1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIkRhdGFTY2llbmNlXCJdID0gMTI4XSA9IFwiRGF0YVNjaWVuY2VcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJPdGhlclwiXSA9IDI1Nl0gPSBcIk90aGVyXCI7XG59KShTa2lsbENhdGVnb3J5ID0gZXhwb3J0cy5Ta2lsbENhdGVnb3J5IHx8IChleHBvcnRzLlNraWxsQ2F0ZWdvcnkgPSB7fSkpO1xudmFyIFNraWxsID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2tpbGwsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2tpbGwoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgU2tpbGwucHJvdG90eXBlLmdldENhdGVnb3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmNhdGVnb3J5O1xuICAgIH07XG4gICAgU2tpbGwucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICBTa2lsbC5wcm90b3R5cGUuY3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgU1ZHXzEuU1ZHLmxvYWRTVkcoXCIuL291dC9pbWFnZXMvU2tpbGxzL1wiICsgdGhpcy5kYXRhLnN2ZykudGhlbihmdW5jdGlvbiAoc3ZnKSB7XG4gICAgICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdpY29uJyk7XG4gICAgICAgICAgICB2YXIgaGV4YWdvbiA9IF90aGlzLmdldFJlZmVyZW5jZSgnaGV4YWdvbicpO1xuICAgICAgICAgICAgaGV4YWdvbi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdmcsIGhleGFnb24pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNraWxsLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIVNraWxsLkhleGFnb25TVkcpIHtcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY3JlYXRlIFNraWxsIGVsZW1lbnQgd2l0aG91dCBiZWluZyBpbml0aWFsaXplZC4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiAnc2tpbGwgdG9vbHRpcC1jb250YWluZXInIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiAnaGV4YWdvbi1jb250YWluZXInLCBzdHlsZTogeyBjb2xvcjogdGhpcy5kYXRhLmNvbG9yIH0gfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogJ3Rvb2x0aXAgdG9wIGlzLXNpemUtNycgfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgICAgIFNraWxsLkhleGFnb25TVkcuY2xvbmVOb2RlKHRydWUpKSkpO1xuICAgIH07XG4gICAgU2tpbGwuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmIChTa2lsbC5IZXhhZ29uU1ZHKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIFNWR18xLlNWRy5sb2FkU1ZHKCcuL291dC9pbWFnZXMvQ29udGVudC9IZXhhZ29uJykudGhlbihmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaGV4YWdvbicpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncmVmJywgJ2hleGFnb24nKTtcbiAgICAgICAgICAgICAgICAgICAgU2tpbGwuSGV4YWdvblNWRyA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIFNraWxsO1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLlNraWxsID0gU2tpbGw7XG5Ta2lsbC5pbml0aWFsaXplKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNraWxsc0ZpbHRlciA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9ET01cIik7XG52YXIgU2tpbGxfMSA9IHJlcXVpcmUoXCIuL1NraWxsXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgU2tpbGxzXzEgPSByZXF1aXJlKFwiLi4vLi4vRGF0YS9Ta2lsbHNcIik7XG52YXIgU2tpbGxzRmlsdGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTa2lsbHNGaWx0ZXIoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZmlsdGVyID0gMDtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b3AgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXhIZWlnaHQgPSAyMjQ7XG4gICAgICAgIHRoaXMub3B0aW9uRWxlbWVudHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc2tpbGxFbGVtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLnVzaW5nQXJyb3dLZXlzID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgdGhpcy5Db250YWluZXIgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI3NraWxscyAuc2tpbGxzLWZpbHRlcicpO1xuICAgICAgICB0aGlzLkRyb3Bkb3duID0gdGhpcy5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duJyk7XG4gICAgICAgIHRoaXMuU2VsZWN0ZWRPcHRpb25zRGlzcGxheSA9IHRoaXMuRHJvcGRvd24ucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkLW9wdGlvbnMgLmRpc3BsYXknKTtcbiAgICAgICAgdGhpcy5NZW51ID0gdGhpcy5Ecm9wZG93bi5xdWVyeVNlbGVjdG9yKCcubWVudScpO1xuICAgICAgICB0aGlzLk1lbnVPcHRpb25zID0gdGhpcy5NZW51LnF1ZXJ5U2VsZWN0b3IoJy5vcHRpb25zJyk7XG4gICAgICAgIHRoaXMuQ2F0ZWdvcnlNYXAgPSBPYmplY3QuZW50cmllcyhTa2lsbF8xLlNraWxsQ2F0ZWdvcnkpXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IF9hWzBdLCB2YWwgPSBfYVsxXTtcbiAgICAgICAgICAgIHJldHVybiAhaXNOYU4oTnVtYmVyKGtleSkpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAob2JqLCBfYSkge1xuICAgICAgICAgICAgdmFyIF9iO1xuICAgICAgICAgICAgdmFyIGtleSA9IF9hWzBdLCB2YWwgPSBfYVsxXTtcbiAgICAgICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb2JqKSwgKF9iID0ge30sIF9iW2tleV0gPSB2YWwsIF9iKSk7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgICAgICAgICAgU2tpbGxfMS5Ta2lsbC5pbml0aWFsaXplKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNyZWF0ZVNraWxsRWxlbWVudHMoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVPcHRpb25zKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLk1lbnUuc3R5bGUubWF4SGVpZ2h0ID0gdGhpcy5tYXhIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5jcmVhdGVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLkNhdGVnb3J5TWFwKS5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IF9hWzBdLCB2YWwgPSBfYVsxXTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtN1wiIH0sIHZhbCk7XG4gICAgICAgICAgICBfdGhpcy5vcHRpb25FbGVtZW50cy5zZXQoZWxlbWVudCwgTnVtYmVyKGtleSkpO1xuICAgICAgICAgICAgX3RoaXMuTWVudU9wdGlvbnMuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5jcmVhdGVTa2lsbEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIFNraWxsc18yID0gU2tpbGxzXzEuU2tpbGxzOyBfaSA8IFNraWxsc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHNraWxsID0gU2tpbGxzXzJbX2ldO1xuICAgICAgICAgICAgdGhpcy5za2lsbEVsZW1lbnRzLnB1c2gobmV3IFNraWxsXzEuU2tpbGwoc2tpbGwpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGZvciAodmFyIGkgPSBXZWJQYWdlXzEuU2tpbGxzR3JpZC5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLlNraWxsc0dyaWQucmVtb3ZlQ2hpbGQoV2ViUGFnZV8xLlNraWxsc0dyaWQuY2hpbGRyZW4uaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNraWxsRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2tpbGwpIHsgcmV0dXJuIHNraWxsLmFwcGVuZFRvKFdlYlBhZ2VfMS5Ta2lsbHNHcmlkKTsgfSk7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkT3B0aW9uc0Rpc3BsYXkuaW5uZXJUZXh0ID0gJ05vbmUnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5za2lsbEVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAoc2tpbGwpIHsgcmV0dXJuIChza2lsbC5nZXRDYXRlZ29yeSgpICYgX3RoaXMuZmlsdGVyKSAhPT0gMDsgfSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoc2tpbGwpIHsgcmV0dXJuIHNraWxsLmFwcGVuZFRvKFdlYlBhZ2VfMS5Ta2lsbHNHcmlkKTsgfSk7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IE9iamVjdC5lbnRyaWVzKHRoaXMuQ2F0ZWdvcnlNYXApLmZpbHRlcihmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbCA9IF9hWzFdO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX3RoaXMuZmlsdGVyICYgTnVtYmVyKGtleSkpICE9PSAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsID0gX2FbMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH0pLmpvaW4oJywgJyk7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkT3B0aW9uc0Rpc3BsYXkuaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5jcmVhdGVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25FbGVtZW50cy5oYXMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZU9wdGlvbihldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBET01fMS5ET00uZ2V0UGF0aFRvUm9vdChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmIChwYXRoLmluZGV4T2YoX3RoaXMuRHJvcGRvd24pID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWN0aXZlID8gX3RoaXMuY2xvc2UoKSA6IF90aGlzLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHBhc3NpdmU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IERPTV8xLkRPTS5nZXRQYXRoVG9Sb290KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChwYXRoLmluZGV4T2YoX3RoaXMuRHJvcGRvd24pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuYWN0aXZlICYmIF90aGlzLnVzaW5nQXJyb3dLZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy50b2dnbGVPcHRpb24oX3RoaXMubGFzdFNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3IHx8IGV2ZW50LmtleUNvZGUgPT09IDM4KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdmVBcnJvd1NlbGVjdGlvbigtMSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAzOSB8fCBldmVudC5rZXlDb2RlID09PSA0MCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3ZlQXJyb3dTZWxlY3Rpb24oMSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuTWVudU9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMubGFzdFNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXNpbmdBcnJvd0tleXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sYXN0U2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuRHJvcGRvd24uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBXZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLmNoZWNrUG9zaXRpb24oKTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLkRyb3Bkb3duLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuRHJvcGRvd24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIGlmICh0aGlzLmxhc3RTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlID8gdGhpcy5jbG9zZSgpIDogdGhpcy5vcGVuKCk7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLnRvZ2dsZU9wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgdmFyIGJpdCA9IHRoaXMub3B0aW9uRWxlbWVudHMuZ2V0KG9wdGlvbik7XG4gICAgICAgIGlmICgodGhpcy5maWx0ZXIgJiBiaXQpICE9PSAwKSB7XG4gICAgICAgICAgICBvcHRpb24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsdGVyIF49IGJpdDtcbiAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQgPSBvcHRpb247XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLm1vdmVBcnJvd1NlbGVjdGlvbiA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQgPSB0aGlzLk1lbnVPcHRpb25zLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnVzaW5nQXJyb3dLZXlzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlyIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9ICh0aGlzLmxhc3RTZWxlY3RlZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIHx8IHRoaXMuTWVudU9wdGlvbnMubGFzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9ICh0aGlzLmxhc3RTZWxlY3RlZC5uZXh0RWxlbWVudFNpYmxpbmcgfHwgdGhpcy5NZW51T3B0aW9ucy5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2luZ0Fycm93S2V5cyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgICAgICAgICAgaWYgKCFET01fMS5ET00uaW5PZmZzZXRWaWV3KHRoaXMubGFzdFNlbGVjdGVkLCB7IGlnbm9yZVg6IHRydWUsIHdob2xlOiB0cnVlIH0pKSB7XG4gICAgICAgICAgICAgICAgRE9NXzEuRE9NLnNjcm9sbENvbnRhaW5lclRvVmlld1dob2xlQ2hpbGQodGhpcy5NZW51LCB0aGlzLmxhc3RTZWxlY3RlZCwgeyBpZ25vcmVYOiB0cnVlLCBzbW9vdGg6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2luZ0Fycm93S2V5cyA9IHRydWU7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChET01fMS5ET00ucGl4ZWxzQWJvdmVTY3JlZW5Cb3R0b20odGhpcy5Ecm9wZG93bikgPD0gdGhpcy5tYXhIZWlnaHQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy50b3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5Ecm9wZG93bi5jbGFzc0xpc3QuYWRkKCd0b3AnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Ecm9wZG93bi5jbGFzc0xpc3QucmVtb3ZlKCd0b3AnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFNraWxsc0ZpbHRlcjtcbn0oKSk7XG5leHBvcnRzLlNraWxsc0ZpbHRlciA9IFNraWxsc0ZpbHRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNvY2lhbCA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIFNvY2lhbCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNvY2lhbCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTb2NpYWwoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgU29jaWFsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgU29jaWFsLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic29jaWFsXCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBpcy1zdmcgaXMtcHJpbWFyeVwiLCBocmVmOiB0aGlzLmRhdGEubGluaywgdGFyZ2V0OiBcIl9ibGFua1wiIH0sXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IHRoaXMuZGF0YS5mYUNsYXNzIH0pKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFNvY2lhbDtcbn0oQ29tcG9uZW50XzEuRGF0YUNvbXBvbmVudCkpO1xuZXhwb3J0cy5Tb2NpYWwgPSBTb2NpYWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWJvdXRNZSA9IHZvaWQgMDtcbmV4cG9ydHMuQWJvdXRNZSA9IFwiXFxuQXMgc29mdHdhcmUgZW5naW5lZXIsIG15IHBhc3Npb24gbGllcyBpbiBzb2Z0d2FyZSBkZXZlbG9wbWVudCBhbmQgQXJ0aWZpY2lhbCBJbnRlbGxpZ2VuY2UuIFdpdGggaGFuZHMtb24gZXhwZXJpZW5jZSBpbiB3ZWIgZGV2ZWxvcG1lbnQgYW5kIG1hY2hpbmUgbGVhcm5pbmcsIEkgdGhyaXZlIG9uIGNvbnRpbnVvdXMgbGVhcm5pbmcgYW5kIGdyb3d0aC4gSSdtIGV4Y2l0ZWQgdG8gYXBwbHkgbXkgc2tpbGxzIGFzIGEgc29mdHdhcmUgZW5naW5lZXIsIGNvbnRyaWJ1dGluZyB0byBpbm5vdmF0aXZlIHByb2plY3RzIGFuZCBlbWJyYWNpbmcgbmV3IG9wcG9ydHVuaXRpZXMgZm9yIHByb2Zlc3Npb25hbCBkZXZlbG9wbWVudC5cXG5cIjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DZXJ0aWZpY2F0ZXMgPSB2b2lkIDA7XG5leHBvcnRzLkNlcnRpZmljYXRlcyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdNaWNyb3NvZnQgSW1hZ2luZUN1cCB3b3JsZCBmaW5hbGlzdCcsXG4gICAgICAgIGNvbG9yOiAnIzFDMUM2NycsXG4gICAgICAgIGltYWdlOiAnaW1hZ2luZUN1cC5wbmcnLFxuICAgICAgICB0eXBlOiAnJyxcbiAgICAgICAgZGF0ZTogJ01hcmNoIDIwMjEnLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnSW1hZ2luZSBDdXAgaXMgYW4gYW5udWFsIGNvbXBldGl0aW9uIHNwb25zb3JlZCBhbmQgaG9zdGVkIGJ5IE1pY3Jvc29mdCBDb3JwLiB3aGljaCBicmluZ3MgdG9nZXRoZXIgc3R1ZGVudCBkZXZlbG9wZXJzIHdvcmxkd2lkZSB0byBoZWxwIHJlc29sdmUgc29tZSBvZiB0aGUgd29ybGRcXCdzIHRvdWdoZXN0IGNoYWxsZW5nZXMuJyxcbiAgICAgICAgcmVwbzogbnVsbCxcbiAgICAgICAgZXh0ZXJuYWw6ICdodHRwczovL2ltYWdpbmVjdXAubWljcm9zb2Z0LmNvbS9lbi11cy9NZW1iZXIvV2lubmVyQ2VydGlmaWNhdGU/dXNlcmlkPVlKRVBZY3ZSOU42T0JzNmphMEJMJTI1MmJBJTI1M2QlMjUzZCZjb21wSWQ9RXlFaXhGSU9tcFk1dXppdHM2cFgydyUyNTNkJTI1M2QmdGVhbUlkPXFBZiUyNTJidGtBdWpYQWdySGx6bmZMNFRnJTI1M2QlMjUzZCcsXG4gICAgICAgIGRldGFpbHM6IFtdXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdEZWVwIExlYXJuaW5nIFNwZWNpYWxpemF0aW9uJyxcbiAgICAgICAgY29sb3I6ICcjYmYyNjAwJyxcbiAgICAgICAgaW1hZ2U6ICdkZWVwTGVhcm5pbmcucG5nJyxcbiAgICAgICAgdHlwZTogJycsXG4gICAgICAgIGRhdGU6ICdBcHJpbCAyMDIwJyxcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogJ0luIHRoaXMgc3BlY2lhbGl6YXRpb24gaSBoYXZlIGxlYXJuZWQgaG93IHRvIGRlc2lnbiBhbmQgb3B0aW1pemUgbWFjaGluZSBsZWFybmluZyBtb2RlbHMuJyxcbiAgICAgICAgcmVwbzogbnVsbCxcbiAgICAgICAgZXh0ZXJuYWw6ICdodHRwczovL3d3dy5jb3Vyc2VyYS5vcmcvYWNjb3VudC9hY2NvbXBsaXNobWVudHMvc3BlY2lhbGl6YXRpb24vY2VydGlmaWNhdGUvWUg4WkJRSFBKQk0yJyxcbiAgICAgICAgZGV0YWlsczogW11cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1RlbnNvcmZsb3cgaW4gUHJhY3RpY2UgU3BlY2lhbGl6YXRpb24nLFxuICAgICAgICBjb2xvcjogJyMxMjc5MDAnLFxuICAgICAgICBpbWFnZTogJ3RmLnBuZycsXG4gICAgICAgIHR5cGU6ICcnLFxuICAgICAgICBkYXRlOiAnTWFyY2ggMjAyMCcsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6ICdJIGhhdmUgbGVhcm5lZCBob3cgdG8gaW1wbGVtZW50IG1hY2hpbmUgbGVhcm5pbmcgbW9kZWxzIGZvciBjb21wdXRlciB2aXNpb24sIG5hdHVyYWwgbGFuZ3VhZ2UgcHJvY2Vzc2luZyBhbmQgc2VxdWVuY2VzIHVzaW5nIFRlbnNvckZsb3cuJyxcbiAgICAgICAgcmVwbzogbnVsbCxcbiAgICAgICAgZXh0ZXJuYWw6ICdodHRwczovL3d3dy5jb3Vyc2VyYS5vcmcvYWNjb3VudC9hY2NvbXBsaXNobWVudHMvc3BlY2lhbGl6YXRpb24vY2VydGlmaWNhdGUvNzZSVjRWRlRORjNXJyxcbiAgICAgICAgZGV0YWlsczogW11cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0dhbGFjdGljIHByb2JsZW0gc29sdmVyIGJ5IE5BU0EnLFxuICAgICAgICBjb2xvcjogJyMyNDQ4YjgnLFxuICAgICAgICBpbWFnZTogJ25hc2EucG5nJyxcbiAgICAgICAgdHlwZTogJycsXG4gICAgICAgIGRhdGU6ICdPY3RvYmVyIDIwMjEnLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnTXkgdGVhbSBBbmRyb21lZGEgaXMgcXVhbGlmaWVkIHRvIFdvcmxkIEZpbmFscyBpbiB0aGUgTkFTQSBTcGFjZSBBcHBzIENoYWxsZW5nZS4nLFxuICAgICAgICByZXBvOiBudWxsLFxuICAgICAgICBleHRlcm5hbDogbnVsbCxcbiAgICAgICAgZGV0YWlsczogW11cbiAgICB9LFxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FZHVjYXRpb24gPSB2b2lkIDA7XG5leHBvcnRzLkVkdWNhdGlvbiA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiTmF0aW9uYWwgSW5zdGl0dXRlIG9mIEFwcGxpZWQgU2NpZW5jZSBhbmQgVGVjaG5vbG9neVwiLFxuICAgICAgICBjb2xvcjogXCIjYzc1YjEyXCIsXG4gICAgICAgIGltYWdlOiBcImluc2F0LnN2Z1wiLFxuICAgICAgICBsaW5rOiBcImh0dHA6Ly93d3cuaW5zYXQucm51LnRuXCIsXG4gICAgICAgIGxvY2F0aW9uOiBcIlR1bmlzLCBUdW5pc2lhLCBUTlwiLFxuICAgICAgICBkZWdyZWU6IFwiU29mdHdhcmUgRW5naW5lZXJpbmdcIixcbiAgICAgICAgc3RhcnQ6IFwiU2VwdGVtYmVyIDIwMTlcIixcbiAgICAgICAgZW5kOiBcIk1heSAyMDIyXCIsXG4gICAgICAgIGNyZWRpdHM6IHtcbiAgICAgICAgICAgIHRvdGFsOiAxMDAsXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDEwMCxcbiAgICAgICAgICAgIHRha2luZzogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BhOiB7XG4gICAgICAgICAgICBvdmVyYWxsOiBcIjQuMFwiLFxuICAgICAgICAgICAgbWFqb3I6IFwiNC4wXCIsXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGVzOiBbXCJEYXRhIHNjaWVuY2VcIl0sXG4gICAgICAgIGNvdXJzZXM6IFtcbiAgICAgICAgICAgIFwiRGF0YSBTdHJ1Y3R1cmVzIGFuZCBBbGdvcml0aG0gQW5hbHlzaXNcIixcbiAgICAgICAgICAgIFwiTWF0aGVtYXRpY3MgZm9yIGVuZ2luZWVyc1wiLFxuICAgICAgICAgICAgXCJGdW5kYW1lbnRhbCBjb21wdXRpbmdcIixcbiAgICAgICAgICAgIFwiRGF0YSBtaW5pbmdcIixcbiAgICAgICAgICAgIFwiRGF0YWJhc2UgZGV2ZWxvcG1lbnRcIixcbiAgICAgICAgICAgIFwiQXJ0aWZpY2lhbCBpbnRlbGxpZ2VuY2VcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogXCJOYXRpb25hbCBJbnN0aXR1dGUgb2YgQXBwbGllZCBTY2llbmNlIGFuZCBUZWNobm9sb2d5XCIsXG4gICAgICAgIGNvbG9yOiBcIiNjNzViMTJcIixcbiAgICAgICAgaW1hZ2U6IFwiaW5zYXQuc3ZnXCIsXG4gICAgICAgIGxpbms6IFwiaHR0cDovL3d3dy5pbnNhdC5ybnUudG5cIixcbiAgICAgICAgbG9jYXRpb246IFwiVHVuaXMsIFR1bmlzaWEsIFROXCIsXG4gICAgICAgIGRlZ3JlZTogXCJJbnRlZ3JhdGVkIHByZXBhcmF0b3J5IGN5Y2xlIC8gRmllbGQgb2Ygc3R1ZHk6IE1hdGggLSBQaHlzaWNzIC0gQ29tcHV0ZXIgc2NpZW5jZVwiLFxuICAgICAgICBzdGFydDogXCJTZXB0ZW1iZXIgMjAxN1wiLFxuICAgICAgICBlbmQ6IFwiSnVuZSAyMDE5XCIsXG4gICAgICAgIGNyZWRpdHM6IHtcbiAgICAgICAgICAgIHRvdGFsOiAxMDAsXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDEwMCxcbiAgICAgICAgICAgIHRha2luZzogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BhOiB7XG4gICAgICAgICAgICBvdmVyYWxsOiBcIjQuMFwiLFxuICAgICAgICAgICAgbWFqb3I6IFwiNC4wXCIsXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGVzOiBbXCJcIl0sXG4gICAgICAgIGNvdXJzZXM6IFtcbiAgICAgICAgICAgIFwiRGF0YSBTdHJ1Y3R1cmVzIGFuZCBBbGdvcml0aG0gQW5hbHlzaXNcIixcbiAgICAgICAgICAgIFwiT3BlcmF0aW5nIFN5c3RlbXNcIixcbiAgICAgICAgICAgIFwiVU5JWFwiLFxuICAgICAgICAgICAgXCJNYXRoZW1hdGljc1wiLFxuICAgICAgICBdLFxuICAgIH0sXG5dO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSB2b2lkIDA7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSBbXG4gICAge1xuICAgICAgICBzdmc6IFwicGFib2xvLnN2Z1wiLFxuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZGUubGlua2VkaW4uY29tL2NvbXBhbnkvcGFib2xvXCIsXG4gICAgICAgIGNvbXBhbnk6IFwiUGFib2xvIEdtYkhcIixcbiAgICAgICAgbG9jYXRpb246IFwiS2FybHNydWhlLCBHZXJtYW55XCIsXG4gICAgICAgIHBvc2l0aW9uOiBcIlNvZnR3YXJlIEVuZ2luZWVyXCIsXG4gICAgICAgIGJlZ2luOiBcIk1hcmNoIDIwMjNcIixcbiAgICAgICAgZW5kOiBcIlByZXNlbnRcIixcbiAgICAgICAgZmxhdm9yOiBcIkkgY29udHJpYnV0ZWQgdG8gYnVpbGQgYW4gaW5ub3ZhdGl2ZSBwbGF0Zm9ybSB0aGF0IGVtcG93ZXJzIHVzZXJzIHRvIHVubGVhc2ggdGhlaXIgY3JlYXRpdml0eSBhcyBtb3ZpZSBkaXJlY3RvcnMgd2l0aCB0aGUgYXNzaXN0YW5jZSBvZiBBSSB0ZWNobm9sb2d5LlwiLFxuICAgICAgICByb2xlczogW1xuICAgICAgICAgICAgXCJDb2xsYWJvcmF0ZWQgY2xvc2VseSB3aXRoIGNyb3NzLWZ1bmN0aW9uYWwgdGVhbXMgdG8gaW50ZWdyYXRlIEFJIHRlY2hub2xvZ3kgaW50byB0aGUgcGxhdGZvcm0uXCIsXG4gICAgICAgICAgICBcIkFjdGl2ZWx5IHBhcnRpY2lwYXRlZCBpbiBjb2RlIHJldmlld3MsIHRlc3RpbmcsIGFuZCBkZWJ1Z2dpbmcgcHJvY2Vzc2VzIHRvIG1haW50YWluIGhpZ2gtcXVhbGl0eSBzdGFuZGFyZHMgYW5kIGRlbGl2ZXIgYSByZWxpYWJsZSBwcm9kdWN0IHRvIHVzZXJzLlwiLFxuICAgICAgICAgICAgXCJCdWlsZCBtb3ZpZSBjcmVhdGlvbiBwaXBlbGluZS5cIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiBcImF3cy5zdmdcIixcbiAgICAgICAgbGluazogXCJodHRwczovL2F3cy5hbWF6b24uY29tXCIsXG4gICAgICAgIGNvbXBhbnk6IFwiQW1hem9uIEFXU1wiLFxuICAgICAgICBsb2NhdGlvbjogXCJCZXJsaW4sIEdlcm1hbnlcIixcbiAgICAgICAgcG9zaXRpb246IFwiU29mdHdhcmUgRW5naW5lZXJcIixcbiAgICAgICAgYmVnaW46IFwiTm92ZW1iZXIgMjAyMlwiLFxuICAgICAgICBlbmQ6IFwiTWFyY2ggMjAyM1wiLFxuICAgICAgICBmbGF2b3I6IFwiV29ya2VkIG9uIEFXUyBEZXZPcHMgR3VydSB3aGljaCBhIGZ1bGx5IG1hbmFnZWQgb3BlcmF0aW9ucyBzZXJ2aWNlIHRoYXQgbWFrZXMgaXQgZWFzeSBmb3JcXG4gICAgICAgICBkZXZlbG9wZXJzIGFuZCBvcGVyYXRvcnMgdG8gaW1wcm92ZSB0aGUgcGVyZm9ybWFuY2UgYW5kIGF2YWlsYWJpbGl0eSBvZiB0aGVpciBhcHBsaWNhdGlvbnMuIFwiLFxuICAgICAgICByb2xlczogW1xuICAgICAgICAgICAgXCJCdWlsZCBhIHN5c3RlbSB0byBpbXByb3ZlIERldk9wcyBHdXJ1J3MgYXZhaWxhYmlsaXR5IHdpdGggRGV2T3BzIEd1cnUgc2VydmljZS5cIixcbiAgICAgICAgICAgIFwiQnVpbGQgYSBzeXN0ZW0gdG8gZ2VuZXJhdGUgdGlja2V0cyBmb3Igb24tY2FsbCBlbmdpbmVlcnMgd2hlbiBhIHByb2JsZW0gaXMgZGV0ZWN0ZWQgaW4gcHJvZHVjdGlvbi5cIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiBcInR1Y2FuLnN2Z1wiLFxuICAgICAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnR1Y2FuLmFpXCIsXG4gICAgICAgIGNvbXBhbnk6IFwiVHVjYW4uYWlcIixcbiAgICAgICAgbG9jYXRpb246IFwiQmVybGluLCBHZXJtYW55XCIsXG4gICAgICAgIHBvc2l0aW9uOiBcIlNvZnR3YXJlIEVuZ2luZWVyXCIsXG4gICAgICAgIGJlZ2luOiBcIkZlYnJ1YXJ5IDIwMjJcIixcbiAgICAgICAgZW5kOiBcIk9jdG9iZXIgMjAyMlwiLFxuICAgICAgICBmbGF2b3I6IFwiVHVjYW4uYWkgaXMgYSBCZXJsaW4tYmFzZWQgdGVjaCBzdGFydHVwIGRldmVsb3BpbmcgQUkgc29mdHdhcmUgYWltZWQgYXQgaW1wcm92aW5nIG91ciBwcm9mZXNzaW9uYWwgY29tbXVuaWNhdGlvbi5cXG4gICAgICAgICBUdWNhbiBvZmZlcnMgcHJvZHVjdGl2aXR5IHRvb2xzIGJhc2VkIG9uIGF1dG9tYXRpYyBzcGVlY2ggcmVjb2duaXRpb24sXFxuICAgICAgICAgIHRyYW5zY3JpcHRpb24gYW5kIHN1bW1hcmlzYXRpb24gdG8gaGVscCBCMkIgY3VzdG9tZXJzIG9yZ2FuaXNlLCBjYXJyeSBvdXQgYW5kIHBvc3QtcHJvY2VzcyBtZWV0aW5ncyBcXG4gICAgICAgICAgYW5kIG90aGVyIHN0cnVjdHVyZWQgY29tbXVuaWNhdGlvbiBtb3JlIGVmZmljaWVudGx5LiBcIixcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgIFwiQnVpbGQgbWFjaGluZSBsZWFybmluZyBtb2RlbHMuXCIsXG4gICAgICAgICAgICBcIk1vZGVscyBkZXBsb3ltZW50LlwiLFxuICAgICAgICAgICAgXCJGaXggYnVncyBpbiBwcm9kdWN0aW9uXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHN2ZzogXCJleHBlbnN5YS5zdmdcIixcbiAgICAgICAgbGluazogXCJodHRwczovL3d3dy5leHBlbnN5YS5jb21cIixcbiAgICAgICAgY29tcGFueTogXCJFeHBlbnN5YVwiLFxuICAgICAgICBsb2NhdGlvbjogXCJUdW5pcywgVHVuaXNpYVwiLFxuICAgICAgICBwb3NpdGlvbjogXCJTb2Z0d2FyZSBFbmdpbmVlclwiLFxuICAgICAgICBiZWdpbjogXCJKYW51YXJ5IDIwMjFcIixcbiAgICAgICAgZW5kOiBcIkZlYnJ1YXJ5IDIwMjJcIixcbiAgICAgICAgZmxhdm9yOiBcIkV4cGVuc3lhIGlzIGEgV2ViIGFuZCBNb2JpbGUgc29sdXRpb24gdGhhdCBhdXRvbWF0ZXMgZXhwZW5zZSByZXBvcnRzIG1hbmFnZW1lbnQgZm9yIHByb2Zlc3Npb25hbHMuXCIsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICBcIkZyb250ZW5kIGRldmVsb3BtZW50IHdpdGggQW5ndWxhci5cIixcbiAgICAgICAgICAgIFwiQmFja2VuZCBkZXZlbG9wbWVudCB3aXRoIC5ORVQgZnJhbWV3b3JrLlwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBzdmc6IFwidHBsdXMuc3ZnXCIsXG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYXBwczR5b3Uub3JnXCIsXG4gICAgICAgIGNvbXBhbnk6IFwiVCtcIixcbiAgICAgICAgbG9jYXRpb246IFwiRnJlZWxhbmNlIC0gRnJhbmNlIC0gUmVtb3RlXCIsXG4gICAgICAgIHBvc2l0aW9uOiBcIlNvZnR3YXJlIEVuZ2luZWVyXCIsXG4gICAgICAgIGJlZ2luOiBcIk1heSAyMDIxXCIsXG4gICAgICAgIGVuZDogXCJTZXB0ZW1iZXIgMjAyMlwiLFxuICAgICAgICBmbGF2b3I6IFwiSSBhbSB3b3JraW5nIHdpdGggVCsgY29tcGFueSBvbiBhIHdoaXRlIGJvYXJkIHdlYiBhcHBsaWNhdGlvbi5cIixcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgIFwiQmFja2VuZCBkZXZlbG9wbWVudCB3aXRoIEV4cHJlc3MuanMgZnJhbWV3b3JrLCBXZWIgU29ja2V0cyBhbmQgTW9uZ29EQi5cIixcbiAgICAgICAgICAgIFwiRnJvbnRlbmQgZGV2ZWxvcG1lbnQgd2l0aCBBbmd1bGFyLlwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBzdmc6IFwiYXBwczR5b3Uuc3ZnXCIsXG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYXBwczR5b3Uub3JnXCIsXG4gICAgICAgIGNvbXBhbnk6IFwiQXBwczRZb3UgXCIsXG4gICAgICAgIGxvY2F0aW9uOiBcIlBhcnQtdGltZSBqb2IgLSBHZXJtYW55IC0gUmVtb3RlXCIsXG4gICAgICAgIHBvc2l0aW9uOiBcIlNvZnR3YXJlIEVuZ2luZWVyXCIsXG4gICAgICAgIGJlZ2luOiBcIk9jdG9iZXIgMjAyMFwiLFxuICAgICAgICBlbmQ6IFwiTWF5IDIwMjFcIixcbiAgICAgICAgZmxhdm9yOiBcIkkgYW0gd29ya2luZyBwYXJ0LXRpbWUgd2l0aCB0aGUgc3RhcnR1cCBBcHBzNFlvdSBvbiBjYXJzIHJlbnRhbCBwcm9qZWN0LlwiLFxuICAgICAgICByb2xlczogW1xuICAgICAgICAgICAgXCJCYWNrZW5kIGRldmVsb3BtZW50IHdpdGggU3ByaW5nIEJvb3QgZnJhbWV3b3JrIGFuZCBNb25nb0RCLlwiLFxuICAgICAgICAgICAgXCJGcm9udGVuZCBkZXZlbG9wbWVudCB3aXRoIEFuZ3VsYXIuXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHN2ZzogXCJvcmFuZ2Uuc3ZnXCIsXG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cub3JhbmdlLnRuXCIsXG4gICAgICAgIGNvbXBhbnk6IFwiT3JhbmdlIGluIGNvbGxhYm9yYXRpb24gd2l0aCBHb29nbGVcIixcbiAgICAgICAgbG9jYXRpb246IFwiSW50ZXJuc2hpcCAtIFR1bmlzaWFcIixcbiAgICAgICAgcG9zaXRpb246IFwiV2ViIERldmVsb3BlciBJbnRlcm5cIixcbiAgICAgICAgYmVnaW46IFwiSnVseSAyMDIwXCIsXG4gICAgICAgIGVuZDogXCJTZXB0ZW1iZXIgMjAyMFwiLFxuICAgICAgICBmbGF2b3I6IFwiRm9yIG15IHN1bW1lciBpbnRlcm5zaGlwLCBJIGhhdmUgcGFydGljaXBhdGVkIGluIE9yYW5nZSBTdW1tZXIgQ2hhbGxlbmdlIHByb2dyYW0gKE9TQykgaW4gcGFydG5lcnNoaXAgd2l0aCBHb29nbGUuIFxcblwiICtcbiAgICAgICAgICAgIFwiSSB3YXMgdGhlIGZ1bGwtc3RhY2sgd2ViIGRldmVsb3BlciBmb3IgVWJvIHByb2plY3QsIGEgY29uc29sZSBkZWRpY2F0ZWQgdG8gYXV0aXNtIHRyZWF0bWVudC5cIixcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgIFwiQmFja2VuZCBkZXZlbG9wbWVudCB3aXRoIEV4cHJlc3MuanMgYW5kIE1vbmdvREIuXCIsXG4gICAgICAgICAgICBcIkRhc2hib2FyZCBkZXZlbG9wbWVudCB3aXRoIFJlYWN0LlwiLFxuICAgICAgICAgICAgXCJMYW5kaW5nIHBhZ2UgZGV2ZWxvcG1lbnQuXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHN2ZzogXCJhcnNlbGEuc3ZnXCIsXG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYXJzZWxhLmNvL2VuL1wiLFxuICAgICAgICBjb21wYW55OiBcIkFyc2VsYSBUZWNobm9sb2dpZXNcIixcbiAgICAgICAgbG9jYXRpb246IFwiSW50ZXJuc2hpcCAtIFR1bmlzaWFcIixcbiAgICAgICAgcG9zaXRpb246IFwiT0NSIERldmVsb3BlclwiLFxuICAgICAgICBiZWdpbjogXCJKdWx5IDIwMjBcIixcbiAgICAgICAgZW5kOiBcIkF1Z3Vlc3QgMjAyMFwiLFxuICAgICAgICBmbGF2b3I6IFwiT3B0aWNhbCBEb2N1bWVudCBDaGFyYWN0ZXIgUmVjb2duaXRpb24gUHJvamVjdCBEZXZlbG9wbWVudCBhbmQgdGhlaXIgY29udmVyc2lvbiBpbnRvIGFwcHJvcHJpYXRlIGZvcm1hdHMuXCIsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICBcIkJhY2tlbmQgZGV2ZWxvcG1lbnQgd2l0aCBFeHByZXNzLmpzIGFuZCBNb25nb0RCLlwiLFxuICAgICAgICAgICAgXCJPQ1IgbWljcm9zZXJ2aWNlIGRldmVsb3BtZW50IHdpdGggVGVzc2VyYWN0IHB5dGhvbi5cIixcbiAgICAgICAgICAgIFwiRGFzaGJvYXJkIGRldmVsb3BtZW50IHdpdGggUmVhY3QuXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUHJvamVjdHMgPSB2b2lkIDA7XG5leHBvcnRzLlByb2plY3RzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogXCJMZWV0Q29kZSBDbG9uZVwiLFxuICAgICAgICBjb2xvcjogXCIjZmE4MjExXCIsXG4gICAgICAgIGltYWdlOiBcImNvZGUtcnVubmVyLnBuZ1wiLFxuICAgICAgICB0eXBlOiBcIlBlcnNvbmFsIFByb2plY3RcIixcbiAgICAgICAgZGF0ZTogXCJKYW51YXJ5IDIwMjRcIixcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogXCJBIHBsYXRmb3JtIGZvciBkZXZlbG9wZXJzIHRvIHNvbHZlIGFsZ29yaXRobWljIHByb2JsZW1zIGFuZCBwcmFjdGljZSBwcm9ncmFtbWluZy5cIixcbiAgICAgICAgcmVwbzogbnVsbCxcbiAgICAgICAgZXh0ZXJuYWw6IFwiaHR0cHM6Ly9jb2RlLXJ1bm5lci1ndWxlcy52ZXJjZWwuYXBwXCIsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIFwiQnVpbGQgdGhlIHBsYXRmb3JtIHdpdGggTmV4dEpTLlwiLFxuICAgICAgICAgICAgXCJJbXBsZW1lbnQgY29kZSBjaGVja2VyLlwiLFxuICAgICAgICAgICAgXCJEZXBsb3kgdGhlIHByb2plY3Qgb24gVmVyY2VsLlwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiBcIkZhY2Vib29rIHNlbnRpbWVudCBhbmFseXNpc1wiLFxuICAgICAgICBjb2xvcjogXCJibHVlXCIsXG4gICAgICAgIGltYWdlOiBcImZiLnBuZ1wiLFxuICAgICAgICB0eXBlOiBcIlBlcnNvbmFsIFByb2plY3RcIixcbiAgICAgICAgZGF0ZTogXCJGZWJydWFyeSAyMDIyXCIsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6IFwiQSBjaHJvbWUgZXh0ZW5zaW9uIHRoYXQgYXBwbHkgc2VudGltZW50IGFuYWx5c2lzIG9uIEZhY2Vib29rIGNvbW1lbnRzLlwiLFxuICAgICAgICByZXBvOiBudWxsLFxuICAgICAgICBleHRlcm5hbDogXCJodHRwczovL3d3dy5saW5rZWRpbi5jb20vcG9zdHMvbW9oYW1lZC1heW1lbi1iZW4tc2xpbWVuX2EtY2hyb21lLWV4dGVuc2lvbi10aGF0LWFuYWx5emVzLXRoZS1jb21tZW50cy1hY3Rpdml0eS02ODY3MDA4ODM0NzUwMjE4MjQxLU1VVnc/dXRtX3NvdXJjZT1zaGFyZSZ1dG1fbWVkaXVtPW1lbWJlcl9kZXNrdG9wXCIsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIFwiRGV2ZWxvcCBhIENocm9tZSBleHRlbnNpb24gd2l0aCBKYXZhU2NyaXB0LlwiLFxuICAgICAgICAgICAgXCJCdWlsZCBhIHNlbnRpbWVudCBhbmFseXNpcyBtb2RlbCB3aXRoIFB5dGhvbiBhbmQgUHlUb3JjaC5cIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogXCJBbmRyb21lZGFcIixcbiAgICAgICAgY29sb3I6IFwiIzAyMDIwMlwiLFxuICAgICAgICBpbWFnZTogXCJhbmRyb21lZGEucG5nXCIsXG4gICAgICAgIHR5cGU6IFwiSGFja2F0aG9uIFByb2plY3RcIixcbiAgICAgICAgZGF0ZTogXCJPY3RvYmVyIDIwMjFcIixcbiAgICAgICAgYXdhcmQ6IFwiTkFTQSBTcGFjZSBBcHBzIENoYWxsZW5nZSBXb3JsZCBGaW5hbGlzdC5cIixcbiAgICAgICAgZmxhdm9yOiBcIldlYiBhcHBsaWNhdGlvbiB0byB0cmFjayBhbmQgbWFwIHNwYWNlIGRlYnJpcyBhbmQgc2F0ZWxsaXRlcyBpbiByZWFsIHRpbWUgYW5kIHByZWRpY3QgdGhlaXIgbG9jYXRpb25zIGluIHRoZSBmdXR1cmUuXCIsXG4gICAgICAgIHJlcG86IG51bGwsXG4gICAgICAgIGV4dGVybmFsOiBcImh0dHBzOi8vbW9oYW1lZC1heW1lbi1iZW4tc2xpbWVuLmdpdGh1Yi5pby9BbmRyb21lZGEvXCIsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIFwiM0QgZ2xvYmUgYW5kIGFuaW1hdGlvbiB3aXRoIFNlY2l1bS5qcy5cIixcbiAgICAgICAgICAgIFwiUHJlZGljdCBzcGFjZSBkZWJyaXMgYW5zIHNhdGVsbGl0ZXMgbG9jYXRpb25zIHdpdGggU2F0ZWxsaXRlLmpzLlwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiBcIkFSIENvcHkgUGFzdGVcIixcbiAgICAgICAgY29sb3I6IFwiIzFiOWIwMFwiLFxuICAgICAgICBpbWFnZTogXCJhci5wbmdcIixcbiAgICAgICAgdHlwZTogXCJQZXJzb25hbCBQcm9qZWN0XCIsXG4gICAgICAgIGRhdGU6IFwiU3ByaW5nIDIwMjFcIixcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogXCJNb2JpbGUgYXBwbGljYXRpb24gdGhhdCBjb3B5IG9iamVjdHMgZnJvbSB0aGUgcmVhbCB3b2xyZCBhbmQgcGFzdGUgaXQgdG8gdGhlIHZpcnR1YWwgd29ybGQuXCIsXG4gICAgICAgIHJlcG86IG51bGwsXG4gICAgICAgIGV4dGVybmFsOiBcImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9mZWVkL3VwZGF0ZS91cm46bGk6YWN0aXZpdHk6Njc5MzQ4NjExMjE3NTI0MzI2NC9cIixcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgXCJEZXZlbG9waW5nIHRoZSBtb2JpbGUgYXBwbGljYXRpb24gdXNpbmcgUmVhY3QgTmF0aXZlLlwiLFxuICAgICAgICAgICAgXCJEZXZlbG9waW5nIHRoZSBkZXNrdG9wIGFwcGxpY2F0aW9uIHVzaW5nIFB5dGhvbiBhbmQgVGtpbnRlci5cIixcbiAgICAgICAgICAgIFwiSW1wbGVtZW50aW5nIGJhY2tncm91bmQgcmVtb3ZhbCBmZWF0dXJlIHVzaW5nIFVeMiBhbGdvcml0aG0uXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiVWJvXCIsXG4gICAgICAgIGNvbG9yOiBcIiMzZjZiZmZcIixcbiAgICAgICAgaW1hZ2U6IFwidWJvLnBuZ1wiLFxuICAgICAgICB0eXBlOiBcIlByb2plY3RcIixcbiAgICAgICAgZGF0ZTogXCJTdW1tZXIgMjAyMFwiLFxuICAgICAgICBhd2FyZDogXCJJbWFnaW5lIEN1cCAyMDIxIHdvcmxkIGZpbmFscyBhbmQgOXRoIHByaXplIG9mIEVVOiBBZnJpY2EgcG9zdCBjcmlzaXMgam91cm5leSBoYWNrYXRob25cIixcbiAgICAgICAgZmxhdm9yOiBcIkEgc21hcnQgY29uc29sZSB3aXRoIGVkdWNhdGlvbmFsIGdhbWVzIHRvIGhlbHAgY2hpbGRyZW4gd2l0aCBhdXRpc20gbWFpbnRhaW4gdGhlaXIgdHJlYXRlbWVudHMgYXQgaG9tZS5cIixcbiAgICAgICAgcmVwbzogbnVsbCxcbiAgICAgICAgZXh0ZXJuYWw6IFwiaHR0cHM6Ly9tb2hhbWVkLWF5bWVuLWJlbi1zbGltZW4uZ2l0aHViLmlvL1VCTy1TaXRlLVZpdHJpbmUvXCIsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIFwiRGV2ZWxvcGluZyBhIGRhc2hib2FyZCB3aXRoIFJlYWN0LlwiLFxuICAgICAgICAgICAgXCJEZXZlbG9waW5nIGFuIEFQSSB1c2luZyBFeHByZXNzLmpzIGFuZCBNb25nb0RCLlwiLFxuICAgICAgICAgICAgXCJEZXZlbG9waW5nIGEgbGFuZGluZyBwYWdlIHdlYnNpdGUuXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiT3B0aWNhbCBEb2N1bWVudCBDaGFyYWN0ZXIgUmVjb2duaXRpb25cIixcbiAgICAgICAgY29sb3I6IFwiIzFDMUM2N1wiLFxuICAgICAgICBpbWFnZTogXCJvY3IucG5nXCIsXG4gICAgICAgIHR5cGU6IFwiSW50ZXJuc2hpcFwiLFxuICAgICAgICBkYXRlOiBcIlN1bW1lciAyMDIwXCIsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6IFwiT3B0aWNhbCBEb2N1bWVudCBDaGFyYWN0ZXIgUmVjb2duaXRpb24gUHJvamVjdCBEZXZlbG9wbWVudCBhbmQgdGhlaXIgY29udmVyc2lvbiBpbnRvIGFwcHJvcHJpYXRlIGZvcm1hdHMuXCIsXG4gICAgICAgIHJlcG86IG51bGwsXG4gICAgICAgIGV4dGVybmFsOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgYW4gQVBJIHVzaW5nIEV4cHJlc3MuanMgYW5kIE1vbmdvREIuXCIsXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgYW4gT0NSIG1pY3Jvc2VydmljZSB1c2luZyBUZXNzZXJhY3QuXCIsXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgYSBkYXNoYm9hcmQgdXNpbmcgcmVhY3QuXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiSS1SZW1lbWJlclwiLFxuICAgICAgICBjb2xvcjogXCIjREI0RjU0XCIsXG4gICAgICAgIGltYWdlOiBcImFsei5qcGdcIixcbiAgICAgICAgdHlwZTogXCJQcm9qZWN0XCIsXG4gICAgICAgIGRhdGU6IFwiV2ludGVyIDIwMjBcIixcbiAgICAgICAgYXdhcmQ6IFwiSW1hZ2luZSBDdXAgMjAyMCB3b3JsZCBmaW5hbHNcIixcbiAgICAgICAgZmxhdm9yOiBcIkktUmVtZW1iZXIgaXMgbW9iaWxlIGFwcGxpY2F0aW9uIHRoYXQgaGVscHMgQWx6aGVpbWVyJ3MgcGF0aWVudHMgYW5kIHRoZWlyIGNhcmVnaXZlcnMuXCIsXG4gICAgICAgIGV4dGVybmFsOiBcImh0dHBzOi8vbmV3cy5taWNyb3NvZnQuY29tL2V1cm9wZS9mZWF0dXJlcy9pLXJlbWVtYmVyLWFuLWFwcC10aGF0LWhlbHBzLXBlb3BsZS13aXRoLWFsemhlaW1lcnMtcmVjb2duaXplLWZhY2VzLXVzaW5nLWFpLz9mYmNsaWQ9SXdBUjJrYm5KSDNRLWFoX2dvaVpoenNJTVJLX3FVMllTYVB6WGZVbE1YYXVLQlJhcFpxM3FsTEE2SE95NFwiLFxuICAgICAgICByZXBvOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgYW4gQVBJIHVzaW5nIEV4cHJlc3MuanMgYW5kIE1vbmdvREIuXCIsXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgZmFjZSByZWNvZ25pdGlvbiBzZXJ2aWNlIHVzaW5nIE1pY3Jvc29mdCBBenVyZSBzZXJ2aWNlcy5cIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogXCJBcnQgU3R5bGUgVHJhbnNmZXJcIixcbiAgICAgICAgY29sb3I6IFwiI0ZGQTUwMFwiLFxuICAgICAgICBpbWFnZTogXCJuc3QucG5nXCIsXG4gICAgICAgIHR5cGU6IFwiUGVyc29uYWwgUHJvamVjdFwiLFxuICAgICAgICBkYXRlOiBcIlNwcmluZyAyMDIwXCIsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6IFwiQXJ0IFN0eWxlIFRyYW5zZmVyIGlzIGEgc29sdXRpb24gZm9yIG9ubGluZSBmYXN0IG5ldXJhbCBzdHlsZSB0cmFuc2ZlciB0byBhcHBseSBhIHN0eWxlIHRvIGFuIGltYWdlLlwiLFxuICAgICAgICByZXBvOiBudWxsLFxuICAgICAgICBleHRlcm5hbDogXCJodHRwczovL21vaGFtZWQtYXltZW4tYmVuLXNsaW1lbi5naXRodWIuaW8vbnN0L2J1aWxkL1wiLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgbmV1cmFsIHN0eWxlIHRyYW5zZmVyIG1vZGVsIHVzaW5nIHB5dGhvbi5cIixcbiAgICAgICAgICAgIFwiRGV2ZWxvcGluZyBmcm9udC1lbmQgdXNpbmcgUmVhY3QuXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2FmZVRvcFwiLFxuICAgICAgICBjb2xvcjogXCIjN0E2OUFEXCIsXG4gICAgICAgIGltYWdlOiBcInJlc3RhdS5wbmdcIixcbiAgICAgICAgdHlwZTogXCJGcmVlbGFuY2UgUHJvamVjdFwiLFxuICAgICAgICBkYXRlOiBcIkF1dHVtbiAyMDE5XCIsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6IFwiUmVzdGF1cmFudCB3ZWJzaXRlIHRvIG1ha2UgcmVzZXJ2YXRpb25zLlwiLFxuICAgICAgICByZXBvOiBudWxsLFxuICAgICAgICBleHRlcm5hbDogXCJodHRwczovL21vaGFtZWQtYXltZW4tYmVuLXNsaW1lbi5naXRodWIuaW8vcmVhc3RhdS9kb2NzL1wiLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgZnJvbnQtZW5kIHVzaW5nIEFuZ3VsYXIuXCIsXG4gICAgICAgICAgICBcIkRldmVsb3BpbmcgQVBJIGZvciByZXNlcnZhdGlvbnMgdXNpbmcgTm9kZS5qcyBhbmQgRXhwcmVzcy5qcy5cIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogXCJJbnRlcm5zaGlwcyBtYW5hZ2VtZW50IHN5c3RlbVwiLFxuICAgICAgICBjb2xvcjogXCIjMjlBQjg3XCIsXG4gICAgICAgIGltYWdlOiBcInBmZS5wbmdcIixcbiAgICAgICAgdHlwZTogXCJTY2hvb2wgUHJvamVjdFwiLFxuICAgICAgICBkYXRlOiBcIldpbnRlciAyMDIxXCIsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6IFwiV2UgbWFkZSBhbiBpbnRlcm5zaGlwcyBtYW5hZ2VtZW50IHN5c3RlbSBmb3Igb3VyIGluc3RpdHV0ZS5cIixcbiAgICAgICAgcmVwbzogbnVsbCxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgIFwiRGV2ZWxvcGluZyBhbiBBUEkgdXNpbmcgTmVzdC5qcyBhbmQgTW9uZ29EQi5cIixcbiAgICAgICAgICAgIFwiRGV2ZWxvcGluZyBmcm9udC1lbmQgdXNpbmcgQW5ndWxhci5cIixcbiAgICAgICAgICAgIFwiRGV2ZWxvcGluZyBPQXV0aCBhdXRoZW50aWNhdGlvbi5cIixcbiAgICAgICAgXSxcbiAgICB9LFxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RdWFsaXRpZXMgPSB2b2lkIDA7XG5leHBvcnRzLlF1YWxpdGllcyA9IFtcbiAgICB7XG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtaGlzdG9yeScsXG4gICAgICAgIG5hbWU6ICdFZmZpY2llbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgY29uc2lzdGVudGx5IGJyaW5nIGVuZXJneSwgcHJvZHVjdGl2aXR5LCBvcmdhbml6YXRpb24sIGFuZCBhZ2lsaXR5IHRvIHRoZSB0YWJsZSBhcyBhbiBlZmZlY3RpdmUgd29ya2VyIGFuZCBhIHF1aWNrIGxlYXJuZXIuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBmYUNsYXNzOiAnZmFyIGZhLXNub3dmbGFrZScsXG4gICAgICAgIG5hbWU6ICdBdHRlbnRpdmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RvIG1lLCBldmVyeSBkZXRhaWwgbWF0dGVycy4gSSBsb3ZlIGZvcm11bGF0aW5nIHRoZSBiaWcgcGljdHVyZSBqdXN0IGFzIG11Y2ggYXMgbWVhc3VyaW5nIG91dCB0aGUgdGlueSBkZXRhaWxzIGFuZCBlZGdlIGNhc2VzLidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgZmFDbGFzczogJ2ZhcyBmYS1mZWF0aGVyLWFsdCcsXG4gICAgICAgIG5hbWU6ICdGbGV4aWJsZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSB3b3JrIGJlc3Qgd2hlbiBJIGFtIGNoYWxsZW5nZWQuIFdoaWxlIEkgdGhyaXZlIGluIG9yZ2FuaXphdGlvbiwgSSBjYW4gYWx3YXlzIGFkYXB0IGFuZCBwaWNrIHVwIG5ldyB0aGluZ3MgaW4gYSBzd2lmdCBtYW5uZXIuJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGxzID0gdm9pZCAwO1xudmFyIFNraWxsXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbFwiKTtcbmV4cG9ydHMuU2tpbGxzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0phdmFTY3JpcHQnLFxuICAgICAgICBzdmc6ICdqYXZhc2NyaXB0JyxcbiAgICAgICAgY29sb3I6ICcjRjBEQjRGJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdUeXBlU2NyaXB0JyxcbiAgICAgICAgc3ZnOiAndHlwZXNjcmlwdCcsXG4gICAgICAgIGNvbG9yOiAnIzAwN0FDQycsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuV2ViIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTm9kZS5qcycsXG4gICAgICAgIHN2ZzogJ25vZGVqcycsXG4gICAgICAgIGNvbG9yOiAnIzhDQzg0QicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQW5ndWxhcicsXG4gICAgICAgIHN2ZzogJ2FuZ3VsYXInLFxuICAgICAgICBjb2xvcjogJyNERDAwMzEnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSZWFjdCcsXG4gICAgICAgIHN2ZzogJ3JlYWN0JyxcbiAgICAgICAgY29sb3I6ICcjMDBEOEZGJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRnJhbWV3b3JrLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTmVzdC5qcycsXG4gICAgICAgIHN2ZzogJ25lc3RqcycsXG4gICAgICAgIGNvbG9yOiAnI0YwREI0RicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuV2ViIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkZyYW1ld29yayxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0MrKycsXG4gICAgICAgIHN2ZzogJ2NwbHVzcGx1cycsXG4gICAgICAgIGNvbG9yOiAnIzlCMDIzQScsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSFRNTCcsXG4gICAgICAgIHN2ZzogJ2h0bWwnLFxuICAgICAgICBjb2xvcjogJyNFRjY1MkEnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NTUycsXG4gICAgICAgIHN2ZzogJ2NzcycsXG4gICAgICAgIGNvbG9yOiAnIzNDOUNENycsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuV2ViLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU0FTUy9TQ1NTJyxcbiAgICAgICAgc3ZnOiAnc2FzcycsXG4gICAgICAgIGNvbG9yOiAnI0NENjY5QScsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuV2ViLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRXhwcmVzcyBKUycsXG4gICAgICAgIHN2ZzogJ2V4cHJlc3MnLFxuICAgICAgICBjb2xvcjogJyMzRDNEM0QnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlciB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdNb25nb0RCJyxcbiAgICAgICAgc3ZnOiAnbW9uZ29kYicsXG4gICAgICAgIGNvbG9yOiAnI2Q0NDAwMCcsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRGF0YWJhc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdGaXJlYmFzZScsXG4gICAgICAgIHN2ZzogJ2ZpcmViYXNlJyxcbiAgICAgICAgY29sb3I6ICcjRkZDQTI4JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhYmFzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1RlbnNvckZsb3cnLFxuICAgICAgICBzdmc6ICd0ZW5zb3JmbG93JyxcbiAgICAgICAgY29sb3I6ICcjNTU1N2ZmJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhU2NpZW5jZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1B5VG9yY2gnLFxuICAgICAgICBzdmc6ICdweXRvcmNoJyxcbiAgICAgICAgY29sb3I6ICcjMkIzNTM5JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhU2NpZW5jZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0dpdCcsXG4gICAgICAgIHN2ZzogJ2dpdCcsXG4gICAgICAgIGNvbG9yOiAnI0YwNTAzMicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHTlUgQmFzaCcsXG4gICAgICAgIHN2ZzogJ2Jhc2gnLFxuICAgICAgICBjb2xvcjogJyMyQjM1MzknLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNjcmlwdGluZyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0phdmEnLFxuICAgICAgICBzdmc6ICdqYXZhJyxcbiAgICAgICAgY29sb3I6ICcjMDA3Njk5JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5Qcm9ncmFtbWluZyB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TZXJ2ZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdQeXRob24nLFxuICAgICAgICBzdmc6ICdweXRob24nLFxuICAgICAgICBjb2xvcjogJyMzNzc2QUInLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNjcmlwdGluZyB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TZXJ2ZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdTcHJpbmcnLFxuICAgICAgICBzdmc6ICdzcHJpbmcnLFxuICAgICAgICBjb2xvcjogJyM2REIzM0YnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkZyYW1ld29yayB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TZXJ2ZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdTUUwnLFxuICAgICAgICBzdmc6ICdzcWwnLFxuICAgICAgICBjb2xvcjogJyNGODk3MDAnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRhdGFiYXNlLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQVdTJyxcbiAgICAgICAgc3ZnOiAnYXdzJyxcbiAgICAgICAgY29sb3I6ICcjM0QzRDNEJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EZXZPcHMgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcsXG4gICAgfSxcbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU29jaWFsID0gdm9pZCAwO1xuZXhwb3J0cy5Tb2NpYWwgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnR2l0SHViJyxcbiAgICAgICAgZmFDbGFzczogJ2ZhYiBmYS1naXRodWInLFxuICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL01vaGFtZWQtQXltZW4tQmVuLVNsaW1lbidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0xpbmtlZEluJyxcbiAgICAgICAgZmFDbGFzczogJ2ZhYiBmYS1saW5rZWRpbicsXG4gICAgICAgIGxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vbW9oYW1lZC1heW1lbi1iZW4tc2xpbWVuLTc1ODYxMDE5MC8nXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdFbWFpbCcsXG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtZW52ZWxvcGUnLFxuICAgICAgICBsaW5rOiAnbWFpbHRvOm1vaGFtZWQuYXltZW4uYmVuLnNsaW1lbkBnbWFpbC5jb20nXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbGVtZW50RmFjdG9yeSA9IHZvaWQgMDtcbnZhciBFbGVtZW50RmFjdG9yeTtcbihmdW5jdGlvbiAoRWxlbWVudEZhY3RvcnkpIHtcbiAgICB2YXIgRnJhZ21lbnQgPSAnPD48Lz4nO1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnTmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGNoaWxkcmVuW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWdOYW1lID09PSBGcmFnbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIF9iID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7IF9hIDwgX2IubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IF9iW19hXTtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzTmFtZScpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIEpTdG9DU1MoYXR0cmlidXRlVmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChrZXkuc3RhcnRzV2l0aCgnb24nKSAmJiB0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGtleS5zdWJzdHJpbmcoMikudG9Mb3dlckNhc2UoKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ2Jvb2xlYW4nICYmIGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9jID0gMCwgY2hpbGRyZW5fMSA9IGNoaWxkcmVuOyBfYyA8IGNoaWxkcmVuXzEubGVuZ3RoOyBfYysrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbl8xW19jXTtcbiAgICAgICAgICAgIGFwcGVuZENoaWxkKGVsZW1lbnQsIGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gICAgRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQ7XG4gICAgZnVuY3Rpb24gYXBwZW5kQ2hpbGQocGFyZW50LCBjaGlsZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNoaWxkID09PSAndW5kZWZpbmVkJyB8fCBjaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBjaGlsZF8xID0gY2hpbGQ7IF9pIDwgY2hpbGRfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBjaGlsZF8xW19pXTtcbiAgICAgICAgICAgICAgICBhcHBlbmRDaGlsZChwYXJlbnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShTdHJpbmcoY2hpbGQpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRWxlbWVudEZhY3RvcnkuYXBwZW5kQ2hpbGQgPSBhcHBlbmRDaGlsZDtcbiAgICBmdW5jdGlvbiBKU3RvQ1NTKGNzc09iamVjdCkge1xuICAgICAgICB2YXIgY3NzU3RyaW5nID0gXCJcIjtcbiAgICAgICAgdmFyIHJ1bGU7XG4gICAgICAgIHZhciBydWxlcyA9IE9iamVjdC5rZXlzKGNzc09iamVjdCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyssIGNzc1N0cmluZyArPSAnICcpIHtcbiAgICAgICAgICAgIHJ1bGUgPSBydWxlc1tpXTtcbiAgICAgICAgICAgIGNzc1N0cmluZyArPSBydWxlLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKHVwcGVyKSB7IHJldHVybiBcIi1cIiArIHVwcGVyWzBdLnRvTG93ZXJDYXNlKCk7IH0pICsgXCI6IFwiICsgY3NzT2JqZWN0W3J1bGVdICsgXCI7XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNzc1N0cmluZztcbiAgICB9XG59KShFbGVtZW50RmFjdG9yeSA9IGV4cG9ydHMuRWxlbWVudEZhY3RvcnkgfHwgKGV4cG9ydHMuRWxlbWVudEZhY3RvcnkgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBBYm91dF8xID0gcmVxdWlyZShcIi4uL0RhdGEvQWJvdXRcIik7XG52YXIgUXVhbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vRGF0YS9RdWFsaXRpZXNcIik7XG52YXIgUXVhbGl0eV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvUXVhbGl0eVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBXZWJQYWdlXzEuRmxhdm9yVGV4dC5pbm5lclRleHQgPSBBYm91dF8xLkFib3V0TWU7XG59KTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICB2YXIgb2JqZWN0O1xuICAgIGZvciAodmFyIF9pID0gMCwgUXVhbGl0aWVzXzIgPSBRdWFsaXRpZXNfMS5RdWFsaXRpZXM7IF9pIDwgUXVhbGl0aWVzXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBxdWFsaXR5ID0gUXVhbGl0aWVzXzJbX2ldO1xuICAgICAgICBvYmplY3QgPSBuZXcgUXVhbGl0eV8xLlF1YWxpdHkocXVhbGl0eSk7XG4gICAgICAgIG9iamVjdC5hcHBlbmRUbyhXZWJQYWdlXzEuUXVhbGl0aWVzQ29udGFpbmVyKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuQm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKCkge1xufSwge1xuICAgIGNhcHR1cmU6IHRydWUsXG4gICAgcGFzc2l2ZTogdHJ1ZVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIENlcnRpZmljYXRlc18xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvQ2VydGlmaWNhdGVzXCIpO1xudmFyIENlcnRpZmljYXRlc18yID0gcmVxdWlyZShcIi4uL0RhdGEvQ2VydGlmaWNhdGVzXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgQ2VydGlmaWNhdGVzQ29udGFpbmVyID0gV2ViUGFnZV8xLlNlY3Rpb25zLmdldCgnY2VydGlmaWNhdGVzJykuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2VydGlmaWNhdGVzLWNvbnRhaW5lcicpO1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gQ2VydGlmaWNhdGVzXzIuQ2VydGlmaWNhdGVzOyBfaSA8IERhdGFfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGRhdGEgPSBEYXRhXzFbX2ldO1xuICAgICAgICBjYXJkID0gbmV3IENlcnRpZmljYXRlc18xLkNlcnRpZmljYXRlcyhkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhDZXJ0aWZpY2F0ZXNDb250YWluZXIpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBTb2NpYWxfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1NvY2lhbFwiKTtcbnZhciBTb2NpYWxfMiA9IHJlcXVpcmUoXCIuLi9EYXRhL1NvY2lhbFwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICB2YXIgY2FyZDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIERhdGFfMSA9IFNvY2lhbF8yLlNvY2lhbDsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBTb2NpYWxfMS5Tb2NpYWwoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oV2ViUGFnZV8xLlNvY2lhbEdyaWQpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnI2Nvbm5lY3QgLmZvb3RlciAuY29weXJpZ2h0IC55ZWFyJykuaW5uZXJUZXh0ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRWR1Y2F0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb25cIik7XG52YXIgRWR1Y2F0aW9uXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FZHVjYXRpb25cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIEVkdWNhdGlvblNlY3Rpb24gPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdlZHVjYXRpb24nKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRWR1Y2F0aW9uXzIuRWR1Y2F0aW9uOyBfaSA8IERhdGFfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGRhdGEgPSBEYXRhXzFbX2ldO1xuICAgICAgICBjYXJkID0gbmV3IEVkdWNhdGlvbl8xLkVkdWNhdGlvbihkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhFZHVjYXRpb25TZWN0aW9uKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRXhwZXJpZW5jZV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZVwiKTtcbnZhciBFeHBlcmllbmNlXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FeHBlcmllbmNlXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIHZhciBFeHBlcmllbmNlU2VjdGlvbiA9IFdlYlBhZ2VfMS5TZWN0aW9ucy5nZXQoJ2V4cGVyaWVuY2UnKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRXhwZXJpZW5jZV8yLkV4cGVyaWVuY2U7IF9pIDwgRGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgZGF0YSA9IERhdGFfMVtfaV07XG4gICAgICAgIGNhcmQgPSBuZXcgRXhwZXJpZW5jZV8xLkV4cGVyaWVuY2UoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oRXhwZXJpZW5jZVNlY3Rpb24pO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBpZiAoIURPTV8xLkRPTS5pc0lFKCkpIHtcbiAgICAgICAgV2ViUGFnZV8xLkxvZ28uT3V0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFdlYlBhZ2VfMS5Mb2dvLk91dGVyLmNsYXNzTmFtZSA9ICdvdXRlcic7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkxvZ28uSW5uZXIuY2xhc3NOYW1lID0gJ2lubmVyJztcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuTWVudUJ1dHRvbi5zdWJzY3JpYmUoV2ViUGFnZV8xLk1haW4sIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5uYW1lID09PSAndG9nZ2xlJykge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLm9wZW4pIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnNldEF0dHJpYnV0ZSgnc2hpZnRlZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnJlbW92ZUF0dHJpYnV0ZSgnc2hpZnRlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5XZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHNlY3Rpb247XG4gICAgdmFyIGFuY2hvcjtcbiAgICB2YXIgaXRlciA9IFdlYlBhZ2VfMS5TZWN0aW9uVG9NZW51LnZhbHVlcygpO1xuICAgIHZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG4gICAgZm9yICh2YXIgZG9uZSA9IGZhbHNlOyAhZG9uZTsgY3VycmVudCA9IGl0ZXIubmV4dCgpLCBkb25lID0gY3VycmVudC5kb25lKSB7XG4gICAgICAgIF9hID0gY3VycmVudC52YWx1ZSwgc2VjdGlvbiA9IF9hWzBdLCBhbmNob3IgPSBfYVsxXTtcbiAgICAgICAgaWYgKHNlY3Rpb24uaW5WaWV3KCkpIHtcbiAgICAgICAgICAgIGFuY2hvci5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIFdlYlBhZ2VfMS5NZW51QnV0dG9uLnVwZGF0ZUNvbnRyYXN0KCk7XG59LCB7XG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBwYXNzaXZlOiB0cnVlXG59KTtcbldlYlBhZ2VfMS5NZW51QnV0dG9uLkhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBXZWJQYWdlXzEuTWVudUJ1dHRvbi50b2dnbGUoKTtcbn0pO1xudmFyIGl0ZXIgPSBXZWJQYWdlXzEuU2VjdGlvblRvTWVudS52YWx1ZXMoKTtcbnZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG52YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBzZWN0aW9uO1xuICAgIHZhciBhbmNob3IgPSB2b2lkIDA7XG4gICAgX2EgPSBjdXJyZW50LnZhbHVlLCBzZWN0aW9uID0gX2FbMF0sIGFuY2hvciA9IF9hWzFdO1xuICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWN0aW9uLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmZvciAodmFyIGRvbmUgPSBmYWxzZTsgIWRvbmU7IGN1cnJlbnQgPSBpdGVyLm5leHQoKSwgZG9uZSA9IGN1cnJlbnQuZG9uZSkge1xuICAgIF9sb29wXzEoZG9uZSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFByb2plY3RfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1Byb2plY3RcIik7XG52YXIgUHJvamVjdHNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1Byb2plY3RzXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgUHJvamVjdHNDb250YWluZXIgPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdwcm9qZWN0cycpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzLWNvbnRhaW5lcicpO1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gUHJvamVjdHNfMS5Qcm9qZWN0czsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBQcm9qZWN0XzEuUHJvamVjdChkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhQcm9qZWN0c0NvbnRhaW5lcik7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRE9NID0gdm9pZCAwO1xudmFyIERPTTtcbihmdW5jdGlvbiAoRE9NKSB7XG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudHMocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpO1xuICAgIH1cbiAgICBET00uZ2V0RWxlbWVudHMgPSBnZXRFbGVtZW50cztcbiAgICBmdW5jdGlvbiBnZXRGaXJzdEVsZW1lbnQocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHMocXVlcnkpWzBdO1xuICAgIH1cbiAgICBET00uZ2V0Rmlyc3RFbGVtZW50ID0gZ2V0Rmlyc3RFbGVtZW50O1xuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLm1heCh3aW5kb3cuaW5uZXJIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpLFxuICAgICAgICAgICAgd2lkdGg6IE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpXG4gICAgICAgIH07XG4gICAgfVxuICAgIERPTS5nZXRWaWV3cG9ydCA9IGdldFZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIGdldENlbnRlck9mVmlld3BvcnQoKSB7XG4gICAgICAgIHZhciBfYSA9IGdldFZpZXdwb3J0KCksIGhlaWdodCA9IF9hLmhlaWdodCwgd2lkdGggPSBfYS53aWR0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHdpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IGhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgRE9NLmdldENlbnRlck9mVmlld3BvcnQgPSBnZXRDZW50ZXJPZlZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKE1TSUV8VHJpZGVudCkvKSAhPT0gbnVsbDtcbiAgICB9XG4gICAgRE9NLmlzSUUgPSBpc0lFO1xuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrXzEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFja18xKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2tfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBET00ubG9hZCA9IGxvYWQ7XG4gICAgZnVuY3Rpb24gYm91bmRpbmdDbGllbnRSZWN0VG9PYmplY3QocmVjdCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiByZWN0LnJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tOiByZWN0LmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHg6IHJlY3QueCA/IHJlY3QueCA6IDAsXG4gICAgICAgICAgICB5OiByZWN0LnkgPyByZWN0LnkgOiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUGFnZShlbGVtZW50KSB7XG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuICFPYmplY3QudmFsdWVzKGJvdW5kaW5nQ2xpZW50UmVjdFRvT2JqZWN0KHJlY3QpKS5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pO1xuICAgIH1cbiAgICBET00ub25QYWdlID0gb25QYWdlO1xuICAgIGZ1bmN0aW9uIGdldERPTU5hbWUoZWxlbWVudCkge1xuICAgICAgICB2YXIgc3RyID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChlbGVtZW50LmlkKSB7XG4gICAgICAgICAgICBzdHIgKz0gJyMnICsgZWxlbWVudC5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHN0ciArPSAnLicgKyBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgRE9NLmdldERPTU5hbWUgPSBnZXRET01OYW1lO1xuICAgIGZ1bmN0aW9uIGdldERPTVBhdGgoZWxlbWVudCkge1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IFtlbGVtZW50XTtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXRoLnVuc2hpZnQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuICAgIERPTS5nZXRET01QYXRoID0gZ2V0RE9NUGF0aDtcbiAgICBmdW5jdGlvbiBnZXRET01QYXRoTmFtZXMoZWxlbWVudCkge1xuICAgICAgICB2YXIgcGF0aCA9IGdldERPTVBhdGgoZWxlbWVudCk7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoLm1hcChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZ2V0RE9NTmFtZShlbGVtZW50KTsgfSk7XG4gICAgfVxuICAgIERPTS5nZXRET01QYXRoTmFtZXMgPSBnZXRET01QYXRoTmFtZXM7XG4gICAgZnVuY3Rpb24gZ2V0Q1NTU2VsZWN0b3IoZWxlbWVudCwgY29uZGVuc2UpIHtcbiAgICAgICAgaWYgKGNvbmRlbnNlID09PSB2b2lkIDApIHsgY29uZGVuc2UgPSB0cnVlOyB9XG4gICAgICAgIHZhciBuYW1lcyA9IGdldERPTVBhdGhOYW1lcyhlbGVtZW50KTtcbiAgICAgICAgaWYgKCFjb25kZW5zZSB8fCBuYW1lcy5sZW5ndGggPD0gNikge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWVzLmpvaW4oJyA+ICcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW5ndGggPSBuYW1lcy5sZW5ndGg7XG4gICAgICAgIHZhciBiZWdpbiA9IG5hbWVzLnNsaWNlKDAsIDMpO1xuICAgICAgICB2YXIgZW5kID0gbmFtZXMuc2xpY2UobGVuZ3RoIC0gMywgbGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGJlZ2luLmpvaW4oJyA+ICcpICsgXCIgPiAuLi4gPiBcIiArIGVuZC5qb2luKCcgPiAnKTtcbiAgICB9XG4gICAgRE9NLmdldENTU1NlbGVjdG9yID0gZ2V0Q1NTU2VsZWN0b3I7XG4gICAgZnVuY3Rpb24gZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIoY29udGFpbmVyLCBjaGlsZCwgY2FsbGVyKSB7XG4gICAgICAgIGlmIChjYWxsZXIgPT09IHZvaWQgMCkgeyBjYWxsZXIgPSAnJzsgfVxuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gMDtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSAwO1xuICAgICAgICB2YXIgY3VyciA9IGNoaWxkO1xuICAgICAgICB3aGlsZSAoY3VyciAmJiBjdXJyICE9PSBjb250YWluZXIpIHtcbiAgICAgICAgICAgIG9mZnNldFRvcCArPSBjdXJyLm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgKz0gY3Vyci5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgY3VyciA9IChjdXJyLm9mZnNldFBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjdXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKGNhbGxlciA/IGNhbGxlciArIFwiID0+IFwiIDogJycpICsgXCJcXFwiXCIgKyBnZXRDU1NTZWxlY3RvcihjaGlsZCkgKyBcIlxcXCIgZG9lcyBub3QgY29udGFpbiBcXFwiXCIgKyBnZXRDU1NTZWxlY3Rvcihjb250YWluZXIpICsgXCJcXFwiIGFzIGFuIG9mZnNldCBwYXJlbnQuIENoZWNrIHRoYXQgdGhlIGNvbnRhaW5lciBoYXMgXFxcInBvc2l0aW9uOiByZWxhdGl2ZVxcXCIgc2V0IG9yIHRoYXQgaXQgaXMgaW4gdGhlIERPTSBwYXRoLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBvZmZzZXRUb3A6IG9mZnNldFRvcCwgb2Zmc2V0TGVmdDogb2Zmc2V0TGVmdCB9O1xuICAgIH1cbiAgICBET00uZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIgPSBnZXRDaGlsZE9mZnNldFBvc0ZvckNvbnRhaW5lcjtcbiAgICBmdW5jdGlvbiBsaW5lcyh0b3AxLCBzaXplMSwgdG9wMiwgc2l6ZTIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdG9wMSAtIG9mZnNldCxcbiAgICAgICAgICAgIHRvcDEgLSBvZmZzZXQgKyBzaXplMSxcbiAgICAgICAgICAgIHRvcDIsXG4gICAgICAgICAgICB0b3AyICsgc2l6ZTIsXG4gICAgICAgIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHh5T2Zmc2V0KHhPZmZzZXQsIHlPZmZzZXQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYgKHhPZmZzZXQgJiYgeE9mZnNldCA8PSAxKSB7XG4gICAgICAgICAgICB4T2Zmc2V0ID0gd2lkdGggKiB4T2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeE9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHlPZmZzZXQgJiYgeU9mZnNldCA8PSAxKSB7XG4gICAgICAgICAgICB5T2Zmc2V0ID0gaGVpZ2h0ICogeU9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlPZmZzZXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHhPZmZzZXQ6IHhPZmZzZXQsIHlPZmZzZXQ6IHlPZmZzZXQgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5PZmZzZXRWaWV3KGNoaWxkLCBzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHZvaWQgMCkgeyBzZXR0aW5ncyA9IHt9OyB9XG4gICAgICAgIHZhciBjb250YWluZXI7XG4gICAgICAgIHZhciBvZmZzZXRUb3A7XG4gICAgICAgIHZhciBvZmZzZXRMZWZ0O1xuICAgICAgICBpZiAoIXNldHRpbmdzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyID0gY2hpbGQub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luT2Zmc2V0VmlldyhjaGlsZCwgLi4uKSA9PiBjaGlsZC5vZmZzZXRQYXJlbnQgY2Fubm90IGJlIG51bGwuIENoZWNrIHRoYXQgaXQgaXMgaW4gYSBjb250YWluZXIgd2l0aCBcInBvc2l0aW9uOiByZWxhdGl2ZVwiIHNldC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldFRvcCA9IGNoaWxkLm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgPSBjaGlsZC5vZmZzZXRMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldENoaWxkT2Zmc2V0UG9zRm9yQ29udGFpbmVyKHNldHRpbmdzLmNvbnRhaW5lciwgY2hpbGQsICdpbk9mZnNldFZpZXcoY2hpbGQsIC4uLiknKTtcbiAgICAgICAgICAgIG9mZnNldFRvcCA9IHJlc3VsdC5vZmZzZXRUb3A7XG4gICAgICAgICAgICBvZmZzZXRMZWZ0ID0gcmVzdWx0Lm9mZnNldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaWxkUmVjdCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChjaGlsZFJlY3QpKS5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBfYSA9IHh5T2Zmc2V0KHNldHRpbmdzLnhPZmZzZXQsIHNldHRpbmdzLnlPZmZzZXQsIGNvbnRhaW5lclJlY3Qud2lkdGgsIGNvbnRhaW5lclJlY3QuaGVpZ2h0KSwgeE9mZnNldCA9IF9hLnhPZmZzZXQsIHlPZmZzZXQgPSBfYS55T2Zmc2V0O1xuICAgICAgICB2YXIgeCA9IHRydWU7XG4gICAgICAgIHZhciB5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVZKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsVG9wLCBjb250YWluZXJSZWN0LmhlaWdodCwgb2Zmc2V0VG9wLCBjaGlsZFJlY3QuaGVpZ2h0LCB5T2Zmc2V0KSwgY29udGFpbmVyVG9wTGluZSA9IF9iWzBdLCBjb250YWluZXJCb3R0b21MaW5lID0gX2JbMV0sIGNoaWxkVG9wTGluZSA9IF9iWzJdLCBjaGlsZEJvdHRvbUxpbmUgPSBfYlszXTtcbiAgICAgICAgICAgIHkgPSBzZXR0aW5ncy53aG9sZSA/XG4gICAgICAgICAgICAgICAgY2hpbGRCb3R0b21MaW5lIDwgY29udGFpbmVyQm90dG9tTGluZVxuICAgICAgICAgICAgICAgICAgICAmJiBjaGlsZFRvcExpbmUgPiBjb250YWluZXJUb3BMaW5lXG4gICAgICAgICAgICAgICAgOiBjaGlsZEJvdHRvbUxpbmUgPiBjb250YWluZXJUb3BMaW5lXG4gICAgICAgICAgICAgICAgICAgICYmIGNoaWxkVG9wTGluZSA8IGNvbnRhaW5lckJvdHRvbUxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVYKSB7XG4gICAgICAgICAgICB2YXIgX2MgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsTGVmdCwgY29udGFpbmVyUmVjdC53aWR0aCwgb2Zmc2V0TGVmdCwgY2hpbGRSZWN0LndpZHRoLCB4T2Zmc2V0KSwgY29udGFpbmVyTGVmdExpbmUgPSBfY1swXSwgY29udGFpbmVyUmlnaHRMaW5lID0gX2NbMV0sIGNoaWxkTGVmdExpbmUgPSBfY1syXSwgY2hpbGRSaWdodExpbmUgPSBfY1szXTtcbiAgICAgICAgICAgIHggPSBzZXR0aW5ncy53aG9sZSA/XG4gICAgICAgICAgICAgICAgY2hpbGRSaWdodExpbmUgPCBjb250YWluZXJSaWdodExpbmVcbiAgICAgICAgICAgICAgICAgICAgJiYgY2hpbGRMZWZ0TGluZSA+IGNvbnRhaW5lckxlZnRMaW5lXG4gICAgICAgICAgICAgICAgOiBjaGlsZFJpZ2h0TGluZSA+IGNvbnRhaW5lckxlZnRMaW5lXG4gICAgICAgICAgICAgICAgICAgICYmIGNoaWxkTGVmdExpbmUgPCBjb250YWluZXJSaWdodExpbmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggJiYgeTtcbiAgICB9XG4gICAgRE9NLmluT2Zmc2V0VmlldyA9IGluT2Zmc2V0VmlldztcbiAgICBmdW5jdGlvbiBzY3JvbGxUbyhjb250YWluZXIsIGxlZnQsIHRvcCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSB7fTsgfVxuICAgICAgICBpZiAoaXNJRSgpKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgICAgIGJlaGF2aW9yOiBzZXR0aW5ncy5zbW9vdGggPyAnc21vb3RoJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNjcm9sbENvbnRhaW5lclRvVmlld1dob2xlQ2hpbGQoY29udGFpbmVyLCBjaGlsZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSB7fTsgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIoY29udGFpbmVyLCBjaGlsZCwgJ3Njcm9sbENvbnRhaW5lclRvVmlld0NoaWxkV2hvbGUoLi4uKScpO1xuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gcmVzdWx0Lm9mZnNldFRvcDtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSByZXN1bHQub2Zmc2V0TGVmdDtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBjaGlsZFJlY3QgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIF9hID0geHlPZmZzZXQoc2V0dGluZ3MueE9mZnNldCwgc2V0dGluZ3MueU9mZnNldCwgY29udGFpbmVyUmVjdC53aWR0aCwgY29udGFpbmVyUmVjdC5oZWlnaHQpLCB4T2Zmc2V0ID0gX2EueE9mZnNldCwgeU9mZnNldCA9IF9hLnlPZmZzZXQ7XG4gICAgICAgIHZhciBfYiA9IGxpbmVzKGNvbnRhaW5lci5zY3JvbGxUb3AsIGNvbnRhaW5lclJlY3QuaGVpZ2h0LCBvZmZzZXRUb3AsIGNoaWxkUmVjdC5oZWlnaHQsIHlPZmZzZXQpLCBjb250YWluZXJUb3BMaW5lID0gX2JbMF0sIGNvbnRhaW5lckJvdHRvbUxpbmUgPSBfYlsxXSwgY2hpbGRUb3BMaW5lID0gX2JbMl0sIGNoaWxkQm90dG9tTGluZSA9IF9iWzNdO1xuICAgICAgICB2YXIgX2MgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsTGVmdCwgY29udGFpbmVyUmVjdC53aWR0aCwgb2Zmc2V0TGVmdCwgY2hpbGRSZWN0LndpZHRoLCB4T2Zmc2V0KSwgY29udGFpbmVyTGVmdExpbmUgPSBfY1swXSwgY29udGFpbmVyUmlnaHRMaW5lID0gX2NbMV0sIGNoaWxkTGVmdExpbmUgPSBfY1syXSwgY2hpbGRSaWdodExpbmUgPSBfY1szXTtcbiAgICAgICAgdmFyIHggPSBjb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgdmFyIHkgPSBjb250YWluZXIuc2Nyb2xsVG9wO1xuICAgICAgICBpZiAoIXNldHRpbmdzLmlnbm9yZVkpIHtcbiAgICAgICAgICAgIHZhciBhYm92ZSA9IGNoaWxkVG9wTGluZSA8IGNvbnRhaW5lclRvcExpbmU7XG4gICAgICAgICAgICB2YXIgYmVsb3cgPSBjaGlsZEJvdHRvbUxpbmUgPiBjb250YWluZXJCb3R0b21MaW5lO1xuICAgICAgICAgICAgaWYgKGFib3ZlICYmICFiZWxvdykge1xuICAgICAgICAgICAgICAgIHkgPSBjaGlsZFRvcExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghYWJvdmUgJiYgYmVsb3cpIHtcbiAgICAgICAgICAgICAgICB5ICs9IGNoaWxkQm90dG9tTGluZSAtIGNvbnRhaW5lckJvdHRvbUxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVYKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IGNoaWxkTGVmdExpbmUgPCBjb250YWluZXJMZWZ0TGluZTtcbiAgICAgICAgICAgIHZhciByaWdodCA9IGNoaWxkUmlnaHRMaW5lID4gY29udGFpbmVyUmlnaHRMaW5lO1xuICAgICAgICAgICAgaWYgKGxlZnQgJiYgIXJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgeCA9IGNoaWxkTGVmdExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghbGVmdCAmJiByaWdodCkge1xuICAgICAgICAgICAgICAgIHggKz0gY2hpbGRSaWdodExpbmUgLSBjb250YWluZXJSaWdodExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2Nyb2xsVG8oY29udGFpbmVyLCB4LCB5LCBzZXR0aW5ncyk7XG4gICAgfVxuICAgIERPTS5zY3JvbGxDb250YWluZXJUb1ZpZXdXaG9sZUNoaWxkID0gc2Nyb2xsQ29udGFpbmVyVG9WaWV3V2hvbGVDaGlsZDtcbiAgICBmdW5jdGlvbiBpblZlcnRpY2FsV2luZG93VmlldyhlbGVtZW50LCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKG9mZnNldCA9PT0gdm9pZCAwKSB7IG9mZnNldCA9IDA7IH1cbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChyZWN0KSkuZXZlcnkoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsID09PSAwOyB9KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2aWV3SGVpZ2h0ID0gZ2V0Vmlld3BvcnQoKS5oZWlnaHQ7XG4gICAgICAgIGlmIChvZmZzZXQgPD0gMSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gdmlld0hlaWdodCAqIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHJlY3QuYm90dG9tICsgb2Zmc2V0KSA+PSAwICYmIChyZWN0LnRvcCArIG9mZnNldCAtIHZpZXdIZWlnaHQpIDwgMDtcbiAgICB9XG4gICAgRE9NLmluVmVydGljYWxXaW5kb3dWaWV3ID0gaW5WZXJ0aWNhbFdpbmRvd1ZpZXc7XG4gICAgZnVuY3Rpb24gcGl4ZWxzQmVsb3dTY3JlZW5Ub3AoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgfVxuICAgIERPTS5waXhlbHNCZWxvd1NjcmVlblRvcCA9IHBpeGVsc0JlbG93U2NyZWVuVG9wO1xuICAgIGZ1bmN0aW9uIHBpeGVsc0Fib3ZlU2NyZWVuQm90dG9tKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgdmlld0hlaWdodCA9IGdldFZpZXdwb3J0KCkuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gdmlld0hlaWdodCAtIHJlY3QuYm90dG9tO1xuICAgIH1cbiAgICBET00ucGl4ZWxzQWJvdmVTY3JlZW5Cb3R0b20gPSBwaXhlbHNBYm92ZVNjcmVlbkJvdHRvbTtcbiAgICBmdW5jdGlvbiBvbkZpcnN0QXBwZWFyYW5jZShlbGVtZW50LCBjYWxsYmFjaywgc2V0dGluZykge1xuICAgICAgICB2YXIgdGltZW91dCA9IHNldHRpbmcgPyBzZXR0aW5nLnRpbWVvdXQgOiAwO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gc2V0dGluZyA/IHNldHRpbmcub2Zmc2V0IDogMDtcbiAgICAgICAgaWYgKGluVmVydGljYWxXaW5kb3dWaWV3KGVsZW1lbnQsIG9mZnNldCkpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tfMSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChpblZlcnRpY2FsV2luZG93VmlldyhlbGVtZW50LCBvZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBldmVudENhbGxiYWNrXzEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGV2ZW50Q2FsbGJhY2tfMSwge1xuICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWUsXG4gICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRE9NLm9uRmlyc3RBcHBlYXJhbmNlID0gb25GaXJzdEFwcGVhcmFuY2U7XG4gICAgZnVuY3Rpb24gZ2V0UGF0aFRvUm9vdChlbGVtZW50KSB7XG4gICAgICAgIHZhciBwYXRoID0gW107XG4gICAgICAgIHZhciBjdXJyID0gZWxlbWVudDtcbiAgICAgICAgd2hpbGUgKGN1cnIpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChjdXJyKTtcbiAgICAgICAgICAgIGN1cnIgPSBjdXJyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGguaW5kZXhPZih3aW5kb3cpID09PSAtMSAmJiBwYXRoLmluZGV4T2YoZG9jdW1lbnQpID09PSAtMSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aC5pbmRleE9mKHdpbmRvdykgPT09IC0xKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2god2luZG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG4gICAgRE9NLmdldFBhdGhUb1Jvb3QgPSBnZXRQYXRoVG9Sb290O1xufSkoRE9NID0gZXhwb3J0cy5ET00gfHwgKGV4cG9ydHMuRE9NID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FdmVudHMgPSB2b2lkIDA7XG52YXIgRXZlbnRzO1xuKGZ1bmN0aW9uIChFdmVudHMpIHtcbiAgICB2YXIgTmV3RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOZXdFdmVudChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5ld0V2ZW50O1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLk5ld0V2ZW50ID0gTmV3RXZlbnQ7XG4gICAgdmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hZGQobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGUobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBOZXdFdmVudChuYW1lLCBkZXRhaWwpO1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcy5saXN0ZW5lcnMudmFsdWVzKCk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICB3aGlsZSAoY2FsbGJhY2sgPSBpdC5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIEV2ZW50cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG59KShFdmVudHMgPSBleHBvcnRzLkV2ZW50cyB8fCAoZXhwb3J0cy5FdmVudHMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNWRyA9IHZvaWQgMDtcbnZhciBTVkc7XG4oZnVuY3Rpb24gKFNWRykge1xuICAgIFNWRy5zdmducyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4gICAgU1ZHLnhsaW5rbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG4gICAgU1ZHLmxvYWRTVkcgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwgKyBcIi5zdmdcIiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZWREb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVxdWVzdC5yZXNwb25zZVRleHQsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwYXJzZWREb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIkZhaWxlZCB0byByZWFkIFNWRy5cIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59KShTVkcgPSBleHBvcnRzLlNWRyB8fCAoZXhwb3J0cy5TVkcgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNvY2lhbEdyaWQgPSBleHBvcnRzLlNraWxsc0dyaWQgPSBleHBvcnRzLlF1YWxpdGllc0NvbnRhaW5lciA9IGV4cG9ydHMuRmxhdm9yVGV4dCA9IGV4cG9ydHMuQmFja2dyb3VuZCA9IGV4cG9ydHMuU2VjdGlvblRvTWVudSA9IGV4cG9ydHMuU2VjdGlvbnMgPSBleHBvcnRzLlNraWxsc0ZpbHRlck9iamVjdCA9IGV4cG9ydHMuTWVudUJ1dHRvbiA9IGV4cG9ydHMuTG9nbyA9IGV4cG9ydHMuU2Nyb2xsSG9vayA9IGV4cG9ydHMuTWFpblNjcm9sbCA9IGV4cG9ydHMuTWFpbiA9IGV4cG9ydHMuQm9keSA9IHZvaWQgMDtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuL0RPTVwiKTtcbnZhciBTZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9TZWN0aW9uXCIpO1xudmFyIE1lbnVfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL01lbnVcIik7XG52YXIgU2tpbGxzRmlsdGVyXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbHNGaWx0ZXJcIik7XG5leHBvcnRzLkJvZHkgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdib2R5Jyk7XG5leHBvcnRzLk1haW4gPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdtYWluJyk7XG5leHBvcnRzLk1haW5TY3JvbGwgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdtYWluIC5zY3JvbGwnKTtcbmV4cG9ydHMuU2Nyb2xsSG9vayA9IERPTV8xLkRPTS5pc0lFKCkgPyB3aW5kb3cgOiBleHBvcnRzLk1haW5TY3JvbGw7XG5leHBvcnRzLkxvZ28gPSB7XG4gICAgT3V0ZXI6IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5sb2dvIC5pbWFnZSBpbWcub3V0ZXInKSxcbiAgICBJbm5lcjogRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLmxvZ28gLmltYWdlIGltZy5pbm5lcicpXG59O1xuZXhwb3J0cy5NZW51QnV0dG9uID0gbmV3IE1lbnVfMS5NZW51KCk7XG5leHBvcnRzLlNraWxsc0ZpbHRlck9iamVjdCA9IG5ldyBTa2lsbHNGaWx0ZXJfMS5Ta2lsbHNGaWx0ZXIoKTtcbmV4cG9ydHMuU2VjdGlvbnMgPSBuZXcgTWFwKCk7XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9ucy5zZXQoZWxlbWVudC5pZCwgbmV3IFNlY3Rpb25fMS5kZWZhdWx0KGVsZW1lbnQpKTtcbn1cbmV4cG9ydHMuU2VjdGlvblRvTWVudSA9IG5ldyBNYXAoKTtcbmZvciAodmFyIF9iID0gMCwgX2MgPSBBcnJheS5mcm9tKERPTV8xLkRPTS5nZXRFbGVtZW50cygnaGVhZGVyLm5hdmlnYXRpb24gLnNlY3Rpb25zIGEnKSk7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgdmFyIGFuY2hvciA9IF9jW19iXTtcbiAgICB2YXIgaWQgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpO1xuICAgIGlmIChleHBvcnRzLlNlY3Rpb25zLmdldChpZCkgJiYgZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpLmluTWVudSgpKSB7XG4gICAgICAgIGV4cG9ydHMuU2VjdGlvblRvTWVudS5zZXQoaWQsIFtleHBvcnRzLlNlY3Rpb25zLmdldChpZCksIGFuY2hvcl0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQmFja2dyb3VuZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2JnJyk7XG5leHBvcnRzLkZsYXZvclRleHQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2Fib3V0IC5mbGF2b3InKTtcbmV4cG9ydHMuUXVhbGl0aWVzQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnc2VjdGlvbiNhYm91dCAucXVhbGl0aWVzJyk7XG5leHBvcnRzLlNraWxsc0dyaWQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI3NraWxscyAuaGV4LWdyaWQnKTtcbmV4cG9ydHMuU29jaWFsR3JpZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jY29ubmVjdCAuc29jaWFsLWljb25zJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbihzcGVlZCwgbWF4LCBtaW4sIGluY3JlYXNpbmcpIHtcbiAgICAgICAgaWYgKGluY3JlYXNpbmcgPT09IHZvaWQgMCkgeyBpbmNyZWFzaW5nID0gZmFsc2U7IH1cbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgICAgIHRoaXMuaW5jcmVhc2luZyA9IGluY3JlYXNpbmc7XG4gICAgfVxuICAgIHJldHVybiBBbmltYXRpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zID0gdm9pZCAwO1xudmFyIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zO1xuKGZ1bmN0aW9uIChBbmltYXRpb25GcmFtZUZ1bmN0aW9ucykge1xuICAgIGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICBmdW5jdGlvbiBjYW5jZWxBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KShBbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgfHwgKGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG4gICAgQ29sb3IuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIGlmIChyID49IDAgJiYgciA8IDI1NiAmJiBnID49IDAgJiYgZyA8IDI1NiAmJiBiID49IDAgJiYgYiA8IDI1Nikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbVJHQihvYmouciwgb2JqLmcsIG9iai5iKTtcbiAgICB9O1xuICAgIENvbG9yLmZyb21IZXggPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tT2JqZWN0KENvbG9yLmhleFRvUkdCKGhleCkpO1xuICAgIH07XG4gICAgQ29sb3IuaGV4VG9SR0IgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSAvXiMoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH07XG4gICAgQ29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IHZvaWQgMCkgeyBvcGFjaXR5ID0gMTsgfVxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiLFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29vcmRpbmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRpbmF0ZSh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIHZhciBkeCA9IGNvb3JkLnggLSB0aGlzLng7XG4gICAgICAgIHZhciBkeSA9IGNvb3JkLnkgLSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH07XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcInhcIiArIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBDb29yZGluYXRlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvb3JkaW5hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbl8xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uXCIpO1xudmFyIENvbG9yXzEgPSByZXF1aXJlKFwiLi9Db2xvclwiKTtcbnZhciBDb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9Db29yZGluYXRlXCIpO1xudmFyIFN0cm9rZV8xID0gcmVxdWlyZShcIi4vU3Ryb2tlXCIpO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShzZXR0aW5ncykge1xuICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmNyZWF0ZUNvbG9yKHNldHRpbmdzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gdGhpcy5jcmVhdGVPcGFjaXR5KHNldHRpbmdzLm9wYWNpdHkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5jcmVhdGVWZWxvY2l0eShzZXR0aW5ncy5tb3ZlKTtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHRoaXMuY3JlYXRlU2hhcGUoc2V0dGluZ3Muc2hhcGUpO1xuICAgICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY3JlYXRlU3Ryb2tlKHNldHRpbmdzLnN0cm9rZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5jcmVhdGVSYWRpdXMoc2V0dGluZ3MucmFkaXVzKTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVPcGFjaXR5KHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZVJhZGl1cyhzZXR0aW5ncy5hbmltYXRlLnJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWJibGVkID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIHJhZGl1czogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21IZXgoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb2xvcihjb2xvcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvci5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21PYmplY3QoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9wYWNpdHkob3BhY2l0eVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGFjaXR5Lmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHN3aXRjaCAobW92ZS5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuc3RyYWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5yYW5kb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueCArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2ZWxvY2l0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2hhcGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGUubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBzaWRlcyA9IHBhcnNlSW50KHNoYXBlLnN1YnN0cmluZygwLCBzaGFwZS5pbmRleE9mKCctJykpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4oc2lkZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2lkZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJva2Uud2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KHN0cm9rZS53aWR0aCwgdGhpcy5jcmVhdGVDb2xvcihzdHJva2UuY29sb3IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KDAsIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVSYWRpdXMgPSBmdW5jdGlvbiAocmFkaXVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmFkaXVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaXVzKHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiA1O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnBhcnNlU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVPcGFjaXR5KGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMucmFkaXVzO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlUmFkaXVzKGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIHNwZWVkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogc3BlZWQ7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXMgKyB0aGlzLmJ1YmJsZWQucmFkaXVzO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHkgKyB0aGlzLmJ1YmJsZWQub3BhY2l0eTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCAtIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuaW50ZXJzZWN0aW5nID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKHBhcnRpY2xlLnBvc2l0aW9uKSA8IHRoaXMuZ2V0UmFkaXVzKCkgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5idWJibGUgPSBmdW5jdGlvbiAobW91c2UsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMucG9zaXRpb24uZGlzdGFuY2UobW91c2UucG9zaXRpb24pO1xuICAgICAgICB2YXIgcmF0aW8gPSAxIC0gZGlzdGFuY2UgLyBzZXR0aW5ncy5kaXN0YW5jZTtcbiAgICAgICAgaWYgKHJhdGlvID49IDAgJiYgbW91c2Uub3Zlcikge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSByYXRpbyAqIChzZXR0aW5ncy5vcGFjaXR5IC0gdGhpcy5vcGFjaXR5KTtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSByYXRpbyAqIChzZXR0aW5ncy5yYWRpdXMgLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XG52YXIgUGFydGljbGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZXMoY3NzUXVlcnksIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdzdG9wcGVkJztcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvTGltaXQgPSA4O1xuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSAxO1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB0aGlzLm1vdXNlID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCgwLCAwKSxcbiAgICAgICAgICAgIG92ZXI6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoY3NzUXVlcnkpO1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2FudmFzIElEIFwiICsgY3NzUXVlcnkgKyBcIiBub3QgZm91bmQuXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KGNvbnRleHQpO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5jYW5jZWxBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBudW1iZXI6IDM1MCxcbiAgICAgICAgICAgIGRlbnNpdHk6IDEwMDAsXG4gICAgICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHJhZGl1czogNSxcbiAgICAgICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuNCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIHN0cmFpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlZGdlQm91bmNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBob3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJhZGl1czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDc1LFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlcHVsc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDEwMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xpY2s6IHtcbiAgICAgICAgICAgICAgICBhZGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiA0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW1vdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudHJhY2tNb3VzZSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID49IHRoaXMucGl4ZWxSYXRpb0xpbWl0ID8gdGhpcy5waXhlbFJhdGlvTGltaXQgLSAyIDogd2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICB0aGlzLnNldENhbnZhc1NpemUoKTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVQYXJ0aWNsZXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudHJhY2tNb3VzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5ob3Zlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5vdmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5jbGljaykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IHRydWU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemVQaXhlbFJhdGlvID0gZnVuY3Rpb24gKG5ld1JhdGlvKSB7XG4gICAgICAgIGlmIChuZXdSYXRpbyA9PT0gdm9pZCAwKSB7IG5ld1JhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87IH1cbiAgICAgICAgdmFyIG11bHRpcGxpZXIgPSBuZXdSYXRpbyAvIHRoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoICogbXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQgKiBtdWx0aXBsaWVyO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIgKiBtdWx0aXBsaWVyOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZSAmJiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cy5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5yYWRpdXMgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlLmRpc3RhbmNlICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIucmVwdWxzZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpbyA9IG5ld1JhdGlvO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1pvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAhPT0gdGhpcy5waXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDwgdGhpcy5waXhlbFJhdGlvTGltaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0Q2FudmFzU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5yZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNoZWNrWm9vbSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLndpZHRoID0gX3RoaXMuY2FudmFzLm9mZnNldFdpZHRoICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5oZWlnaHQgPSBfdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMud2lkdGggPSBfdGhpcy53aWR0aDtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMuaGVpZ2h0ID0gX3RoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXRGaWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHguZmlsbFN0eWxlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlLmNvbG9yLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHN0cm9rZS53aWR0aDtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kcmF3UGFydGljbGVzKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSlcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RvcERyYXdpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BvbHlnb24gPSBmdW5jdGlvbiAoY2VudGVyLCByYWRpdXMsIHNpZGVzKSB7XG4gICAgICAgIHZhciBkaWFnb25hbEFuZ2xlID0gMzYwIC8gc2lkZXM7XG4gICAgICAgIGRpYWdvbmFsQW5nbGUgKj0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZShkaWFnb25hbEFuZ2xlIC8gKHNpZGVzICUgMiA/IDQgOiAyKSk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhyYWRpdXMsIDApO1xuICAgICAgICB2YXIgYW5nbGU7XG4gICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgc2lkZXM7IHMrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBzICogZGlhZ29uYWxBbmdsZTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSksIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZSA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICB2YXIgb3BhY2l0eSA9IHBhcnRpY2xlLmdldE9wYWNpdHkoKTtcbiAgICAgICAgdmFyIHJhZGl1cyA9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICB0aGlzLnNldEZpbGwocGFydGljbGUuY29sb3IudG9TdHJpbmcob3BhY2l0eSkpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKHR5cGVvZiAocGFydGljbGUuc2hhcGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5kcmF3UG9seWdvbihwYXJ0aWNsZS5wb3NpdGlvbiwgcmFkaXVzLCBwYXJ0aWNsZS5zaGFwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcnRpY2xlLnNoYXBlKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5hcmMocGFydGljbGUucG9zaXRpb24ueCwgcGFydGljbGUucG9zaXRpb24ueSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgaWYgKHBhcnRpY2xlLnN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3Ryb2tlKHBhcnRpY2xlLnN0cm9rZSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmdldE5ld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnYm90dG9tJykueSA+IHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55IC09IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kaXN0cmlidXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkgJiYgdHlwZW9mICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0IC8gMTAwMDtcbiAgICAgICAgICAgIGFyZWEgLz0gdGhpcy5waXhlbFJhdGlvICogMjtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXNQZXJBcmVhID0gYXJlYSAqIHRoaXMucGFydGljbGVTZXR0aW5ncy5udW1iZXIgLyB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eTtcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gcGFydGljbGVzUGVyQXJlYSAtIHRoaXMucGFydGljbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChtaXNzaW5nID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFydGljbGVzKG1pc3NpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoTWF0aC5hYnMobWlzc2luZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNyZWF0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIsIHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyOyB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gbnVsbDsgfVxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncylcbiAgICAgICAgICAgIHRocm93ICdQYXJ0aWNsZSBzZXR0aW5ncyBtdXN0IGJlIGluaXRhbGl6ZWQgYmVmb3JlIGEgcGFydGljbGUgaXMgY3JlYXRlZC4nO1xuICAgICAgICB2YXIgcGFydGljbGU7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtYmVyOyBwKyspIHtcbiAgICAgICAgICAgIHBhcnRpY2xlID0gbmV3IFBhcnRpY2xlXzEuZGVmYXVsdCh0aGlzLnBhcnRpY2xlU2V0dGluZ3MpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1Bvc2l0aW9uKCkpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKCF0aGlzLmNoZWNrUG9zaXRpb24ocGFydGljbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnJlbW92ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA9PT0gdm9pZCAwKSB7IG51bWJlciA9IG51bGw7IH1cbiAgICAgICAgaWYgKCFudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoMCwgbnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBhcnRpY2xlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLm1vdmUodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMud2lkdGggKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0ICsgcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy53aWR0aCwgLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5lZGdlQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDAgfHwgcGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcCh0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcChmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUub3BhY2l0eSA+PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUub3BhY2l0eSA8PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ICs9IHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5yYWRpdXMgPj0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5yYWRpdXMgPD0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyArPSBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPyAxIDogLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIgPT09ICdidWJibGUnICYmIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3ZlciAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLmJ1YmJsZSh0aGlzLm1vdXNlLCB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlcygpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLmRyYXdQYXJ0aWNsZShwYXJ0aWNsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0UGFydGljbGVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0SW50ZXJhY3RpdmVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBDYW52YXMgY2FuIHN0YXJ0Lic7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSAnc3RvcHBlZCcpXG4gICAgICAgICAgICB0aHJvdyAnQ2FudmFzIGlzIGFscmVhZHkgcnVubmluZy4nO1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3J1bm5pbmcnO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gUGFydGljbGVzIHRvIHBhdXNlLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuICAgICAgICB0aGlzLm1vdmVTZXR0aW5ncyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSAnc3RvcHBlZCcpIHtcbiAgICAgICAgICAgIHRocm93ICdObyBQYXJ0aWNsZXMgdG8gcmVzdW1lLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdydW5uaW5nJztcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUgPSB0aGlzLm1vdmVTZXR0aW5ncztcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZXM7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGFydGljbGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3Ryb2tlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHJva2Uod2lkdGgsIGNvbG9yKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU3Ryb2tlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cm9rZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFZlY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHZvaWQgMCkgeyB4ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeSA9PT0gdm9pZCAwKSB7IHkgPSB0cnVlOyB9XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICB0aGlzLnggKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgIHRoaXMueSAqPSAtMTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHRoaXMueCAqIHRoaXMueCkgKyAodGhpcy55ICogdGhpcy55KSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC50YW4odGhpcy55IC8gdGhpcy54KTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yO1xuIl19
