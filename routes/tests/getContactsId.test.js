const { handler } = require('../getContactsId')
const mockFind = jest.fn()
const mockSend = jest.fn()
const mockRequest = {
  contactsDB: {
    find: mockFind
  },
  params: { id: 1 }
}

const mockReply = {
  send: mockSend
}
describe('routes - getContactsId handler', () => {
  test('Should send first matching contact', async () => {
    expect.assertions(2)
    mockFind.mockResolvedValue([
      { id: 1, test: 'contact1' }
    ])
    await handler(mockRequest, mockReply)

    expect(mockFind).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(mockSend).toHaveBeenNthCalledWith(1, { id: 1, test: 'contact1' })
  })
  test('Should should send 404 when id to retrieve is not found', async () => {
    mockFind.mockResolvedValue([])
    const expect404Error = new Error('Not Found')
    expect404Error.statusCode = 404
    await handler(mockRequest, mockReply)

    expect(mockFind).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(mockSend).toHaveBeenNthCalledWith(1, expect404Error)
  })
  test('Should should send errors', async () => {
    const testError = new Error('testing error')
    mockFind.mockRejectedValue(testError)
    await handler(mockRequest, mockReply)

    expect(mockFind).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(mockSend).toHaveBeenNthCalledWith(1, testError)
  })
})
