
const dbPlugin = require('../db')
const Datastore = require('nedb-promises')
const path = require('path')

jest.mock('path')
jest.mock('nedb-promises')

const mockFastify = {
  log: { info: jest.fn() },
  decorateRequest: jest.fn()
}
const mockDone = jest.fn()
describe.only('plugins contactsDB ', () => {
  test('should call decorateRequest with created datastore', async () => {
    expect.assertions(5)
    Datastore.create.mockResolvedValue({ test: 'datastore' })
    path.resolve.mockReturnValue('/path/to/datasource/')
    await dbPlugin(mockFastify, {}, mockDone)

    expect(path.resolve).toHaveBeenNthCalledWith(1, 'datasources/contacts.db')
    expect(Datastore.create).toHaveBeenNthCalledWith(1, '/path/to/datasource/')
    expect(mockFastify.log.info).toHaveBeenNthCalledWith(1, 'Successfully created contacts datastore')
    expect(mockFastify.decorateRequest).toHaveBeenNthCalledWith(1, 'contactsDB', { test: 'datastore' })
    expect(mockDone).toHaveBeenNthCalledWith(1)
  })
  test('should throw errors and not call done', async () => {
    expect.assertions(6)
    Datastore.create.mockRejectedValue(new Error('DB error'))
    path.resolve.mockReturnValue('/path/to/datasource/')
    try {
      await dbPlugin(mockFastify, {}, mockDone)
    } catch (error) {
      expect(path.resolve).toHaveBeenNthCalledWith(1, 'datasources/contacts.db')
      expect(Datastore.create).toHaveBeenNthCalledWith(1, '/path/to/datasource/')
      expect(mockFastify.log.info).not.toHaveBeenCalled()
      expect(mockFastify.decorateRequest).not.toHaveBeenCalled()
      expect(mockDone).not.toHaveBeenCalled()
      expect(error.message).toBe('DB error')
    }
  })
})
