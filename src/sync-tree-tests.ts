///<reference path="../typings/main.d.ts"/>
///<reference path="../node_modules/testcheck/dist/testcheck.d.ts"/>

import test = require('./test')
import assert = require('assert')

const describe = test.describe
const it = test.it
const gen = test.gen
const check = test.check

describe('sync tree', () => {
  it('accepts an int', check([gen.int], (x: number) => {
    assert(typeof x === 'number')
  }))
})
