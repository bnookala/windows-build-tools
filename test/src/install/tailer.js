'use strict'

const path = require('path')
const mockery = require('mockery')

const ChildProcessMock = require('../../fixtures/child_process')

describe('Install - Tailer', () => {
  let passedFile

  const fsMock = {
    lstat(_file, _cb) {
      passedFile = _file
      _cb(null, 'hi')
    },

    ensureDirSync() {
      return true
    }
  }

  afterEach(() => {
    passedFile = undefined
  })

  before(() => mockery.registerMock('fs-extra', fsMock))
  after(() => mockery.deregisterAll())

  it('should register the location of the logfile', () => {
    const Tailer = require('../../../lib/install/tailer')
    const tailer = new Tailer()

    tailer.logFile.should.be.ok
    tailer.logFile.should.equal(path.join(process.env.USERPROFILE, '.windows-build-tools', 'log.txt'))
  })

  it('waitForLogFile() should resolve when the logfile exists', (done) => {
    const Tailer = require('../../../lib/install/tailer')
    const tailer = new Tailer()

    tailer.waitForLogFile().should.be.fulfilled
      .then((stat) => {
        passedFile.should.be.ok
        passedFile.should.equal(path.join(process.env.USERPROFILE, '.windows-build-tools', 'log.txt'))
      })
      .should.notify(done)
  })
})
