const { difference, uniqObjectArray } = require('./fpUtils');

// unique object array - function test

{
    const uniqArray = uniqObjectArray(
        [{ a: 10, b: 20}, { a: 10, b: 30 }, { a: 20, b: 40 }, { a: 50, b: 60 }, { a: 30, b: 100}, { a: 50, b: 100}],
        (prev, cur) => prev.a === cur.a
    );
    
    const expectedResult = [ { a: 10, b: 20 },
        { a: 20, b: 40 },
        { a: 50, b: 60 },
        { a: 30, b: 100 }];
    
    console.log('\n unique test results :: ', JSON.stringify(uniqArray) === JSON.stringify(expectedResult));
}

// difference object array - function test

{
    const objArray = [{ a: 1, b: 2}, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 2, b: 2}, { a: 1 }, { b: 2 }, null, undefined, 0];

    const removalArray = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { b: 2 }];

    const removalResult = difference(objArray, removalArray, (p, c) => p && c && p.a === c.a && p.b === c.b);
    
    const expectedResult = [{ a: 1, b: 3 }, { a: 1, b: 4 }, { a: 1 }, null, undefined, 0];

    console.log('difference test results :: ', JSON.stringify(removalResult) === JSON.stringify(expectedResult));
}