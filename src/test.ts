///<reference path="../typings/main.d.ts"/>
///<reference path="../node_modules/testcheck/dist/testcheck.d.ts"/>

// This gives us automatic JS->TS line number translation on node:
declare function require(path: string): any
require('source-map-support').install()

import mocha = require('mocha')
import testcheck = require('testcheck')

const mocha_describe = describe
const mocha_it = it

namespace test {

  function printValues(values: any[]) {
    return '( ' + values.map(function (v) {
      return JSON.stringify(v);
    }).join(', ') + ' )';
  }

  export function check(argGens: testcheck.Generator<any>[],
                        propertyFn: (...args: any[]) => void,
                        options: any = {}): () => void
  {
    return () => {
      let lastError: any

      const property = testcheck.property(argGens, function() {
        try {
          propertyFn.apply(null, arguments)
        } catch (error) {
          lastError = error
          return false
        }
        return true
      })

      const checkResult = testcheck.check(property, options)

      if (checkResult.result === false) {
        lastError.check = checkResult
        lastError.message += ' ' + printValues(checkResult.shrunk.smallest)
        throw lastError
      }
    }
  }

  export const describe = mocha_describe
  export const it = mocha_it
  export const gen = testcheck.gen

}

export = test
