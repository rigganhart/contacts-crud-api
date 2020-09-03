const { handler } = require('../getContacts')
const mockFind = jest.fn()
const mockSend = jest.fn()
const mockRequest = {
  contactsDB: {
    find: mockFind
  }
}

const mockReply = {
  send: mockSend
}
describe('routes - getContacts handler', () => {
  test('Should send all contacts in the colleciton', async () => {
    expect.assertions(2)
    mockFind.mockResolvedValue([
      { test: 'contact1' },
      { test: 'contact2' },
      { test: 'contact3' }
    ])
    await handler(mockRequest, mockReply)

    expect(mockFind).toHaveBeenNthCalledWith(1)
    expect(mockSend).toHaveBeenNthCalledWith(1, [
      { test: 'contact1' },
      { test: 'contact2' },
      { test: 'contact3' }
    ])
  })
  test('Should should send errors', async () => {
    const testError = new Error('testing error')
    mockFind.mockRejectedValue(testError)
    await handler(mockRequest, mockReply)

    expect(mockFind).toHaveBeenNthCalledWith(1)
    expect(mockSend).toHaveBeenNthCalledWith(1, testError)
  })
})
