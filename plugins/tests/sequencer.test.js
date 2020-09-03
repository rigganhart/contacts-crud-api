const { plugin, getContactsSequence } = require('../sequencer')
const Datastore = require('nedb-promises')
const path = require('path')

jest.mock('path')
jest.mock('nedb-promises')

const mockCreatedDatastore = {
  insert: jest.fn(),
  update: jest.fn()
}

const mockFastify = {
  log: { info: jest.fn() },
  decorateRequest: jest.fn()
}

const mockDone = jest.fn()
describe('plugins sequencer', () => {
  test('should create the sequence db and decorate the request with the sequencer function', async () => {
    expect.assertions(6)
    Datastore.create.mockResolvedValue(mockCreatedDatastore)
    path.resolve.mockReturnValue('/path/to/sequenceDatasource/')

    await plugin(mockFastify, {}, mockDone)

    expect(path.resolve).toHaveBeenNthCalledWith(1, 'datasources/sequencer.db')
    expect(Datastore.create).toHaveBeenNthCalledWith(1, '/path/to/sequenceDatasource/')
    expect(mockCreatedDatastore.insert).toHaveBeenNthCalledWith(1, {
      _id: 'contactsSequence',
      sequence_value: 0
    })
    expect(mockFastify.log.info).toHaveBeenNthCalledWith(1, 'CONTACTS SEQUENCE INITIALIZED')
    expect(mockFastify.decorateRequest).toHaveBeenNthCalledWith(1, 'getContactsSequence', expect.any(Function))
    expect(mockDone).toHaveBeenNthCalledWith(1)
  })
  test('should log and not throw an error if sequence db is already initalized', async () => {
    Datastore.create.mockResolvedValue(mockCreatedDatastore)
    path.resolve.mockReturnValue('/path/to/sequenceDatasource/')
    mockCreatedDatastore.insert.mockRejectedValue(new Error('Conflict Error'))

    await plugin(mockFastify, {}, mockDone)

    expect(path.resolve).toHaveBeenNthCalledWith(1, 'datasources/sequencer.db')
    expect(Datastore.create).toHaveBeenNthCalledWith(1, '/path/to/sequenceDatasource/')
    expect(mockCreatedDatastore.insert).toHaveBeenNthCalledWith(1, {
      _id: 'contactsSequence',
      sequence_value: 0
    })
    expect(mockFastify.log.info).toHaveBeenNthCalledWith(1, 'CONTACTS SEQUENCE PREVIOUSLY INITIALIZED')
    expect(mockFastify.decorateRequest).toHaveBeenNthCalledWith(1, 'getContactsSequence', expect.any(Function))
    expect(mockDone).toHaveBeenNthCalledWith(1)
  })
})
describe('getContactsSequence function', () => {
  test('should call the update funciton for sequence db with correct params and return the new sequence value', async () => {
    mockCreatedDatastore.update.mockResolvedValue({ sequence_value: 44 })
    const sequence = await getContactsSequence(mockCreatedDatastore)()
    expect(mockCreatedDatastore.update).toHaveBeenNthCalledWith(1,
      { _id: 'contactsSequence' },
      { $inc: { sequence_value: 1 } },
      { returnUpdatedDocs: true }
    )
    expect(sequence).toBe(44)
  })
  test('should handle errors', async () => {
    const unexpectedError = new Error('Some Unexpected Error')
    mockCreatedDatastore.update.mockRejectedValue(unexpectedError)
    try {
      await getContactsSequence(mockCreatedDatastore)()
    } catch (error) {
      expect(mockCreatedDatastore.update).toHaveBeenNthCalledWith(1,
        { _id: 'contactsSequence' },
        { $inc: { sequence_value: 1 } },
        { returnUpdatedDocs: true }
      )
      expect(error).toBe(unexpectedError)
    }
  })
})
