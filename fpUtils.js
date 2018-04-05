const _ = require('partial-js');

/*
* promise wrapping
*/
const promiseWrapAll = a => Promise.all(a);

/*
* 커링 (단, 인자가 2개인 것만)
 */
const curry = exports.curry = f => function (a, b) { 
    return arguments.length === 2 ? f(a, b) : b => f(a, b);
};
const curryr = exports.curryr = f => function (a, b) {
    return arguments.length === 2 ? f(a, b) : b => f(b, a);
};

const isPromise = a => a instanceof Promise;

/*
* 콘솔 후 리턴
 */
exports.log = (target) => {
    console.trace('\n\n:: LOG ::\n\n', target);
    return target;
};

/*
 * data 의 타입체크
 */
const typeCheck = exports.typeCheck = (data, type) => {
    if (data === null || data === undefined) return false;
    switch (type) {
        case 'number':
            return typeof data === 'number' ? true : typeof data === 'string' ? /^\d+(\.\d+)?$/.test(data.replace(',', '')) : false;
        case 'coordinates':
            return /^(-|\+)?([0-9]+(\.[0-9]+)?)$/.test(data);
        case 'string':
            return typeof data === 'string';
        case 'phone':
            return /[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(data);
        case 'boolean':
            return data === 1 || data === '1';
        case 'array':
            return data instanceof Array;
        case 'object':
            return (typeof data === 'object') && !(data instanceof Array);
        case 'floor':
            return typeof data === 'number' && data <= 6 && data > -10;
        default:
            console.log(data, type);
            throw new Error();
    }
};

/*
* if else 함수
 */
const ifElse = exports.ifElse = (predi, func, alter) => function () {
    const params = arguments;
    const fn = flag => (flag ?
        (_.isFunction(func) ? func.apply(null, params) : func)
        :
        (_.isFunction(alter) ? alter.apply(null, params) : alter)
    );

    const flag = _.isFunction(predi) ? predi.apply(null, params) : predi;
    if (flag && flag.constructor === Promise) {
        return flag.then(fn);
    }
    return fn(flag);
};

exports.elseIf = (predi, alter, func) => ifElse(predi, func, alter);


/*
* 객체에서 값 가져오는 함수
 */

const getFromObj = (obj, key) => obj[key];
exports.getValueFromObj = curry(getFromObj);

/*
* 함수 체이닝에서 조건에 따른 진행 여부 판별
 */
exports.stopIf = (predi, returnFn) => function () { return ifElse(predi, returnFn ? _.pipe(returnFn, _.stop) : _.stop, _.identity).apply(null, arguments); }

exports.goIf = (predi, returnFn) => function () { return ifElse(predi, _.identity, returnFn ? _.pipe(returnFn, _.stop) : _.stop).apply(null, arguments); }

exports.strJoin = seperator => (arr) => (_.isArray(arr) ? arr.join(seperator) : []);

/*
* 로직형 함수
*/

exports.anyPass = fns => d =>
    _.go(fns,
        L.filter(_.partial(call, _, d)),
        L.some
    );

exports.allPass = fns => d =>
    _.go(fns,
        _.map(_.partial(call, _, d)),
        _.every
    );

/*
* json 파싱
*/

exports.parseJson = json => (json ? JSON.parse(json) : null);

exports.arrIncludes = curryr(_.contains);

exports.changeObjKey = function f(obj, prevKey, newKey) {
    return arguments.length === 2 ? _.partial(f, _, obj, prevKey) : (() => {
        const tmp = obj[prevKey];
        return _.go(obj,
            _.omit(prevKey),
            assignValue(newKey, tmp)
        );
    })();
};

/*
* try catch 랩핑
*/

exports.tryCatch = (fn, errorHandler) => (p) => {
    try {
        const result = fn(p);
        return !isPromise(result) ? result :
            Promise.resolve(
                result.then(_.identity)
                    .catch(err => (errorHandler ? errorHandler(err) : err))
            );
    } catch (err) {
        return errorHandler ? errorHandler(err) : err;
    }
};

/*
* 숫자 관련 함수
*/

exports.isPositive = _.pipe(
    Math.sign,
    _.isEqual(1)
);

exports.uniqObjectArray = curryr((arr, predi) => {
    return _.reduce(arr, (acc, cur) => {
        const exists = _.find(acc, a => predi(a, cur));
        return exists ? acc : [].concat(acc, cur);
    }, []);
});

exports.difference = (objArr, removalObjArr, predi) =>
    _.reduce(objArr, (acc, cur) => {
        const exists = _.find(removalObjArr, _.pipe(
            _.map(r => predi(cur, r)),
            _.some
        ));

        return exists ? acc : [].concat(acc, cur);
    }, []);