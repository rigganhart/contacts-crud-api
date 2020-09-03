const { handler } = require('../deleteContactsId')
const mockRemove = jest.fn()
const mockSend = jest.fn()
const mockCode = jest.fn()
const mockRequest = {
  contactsDB: {
    remove: mockRemove
  },
  params: { id: 1 }
}

const mockReply = {
  send: mockSend,
  code: mockCode
}
describe('routes - deleteContactsId handler', () => {
  test('Should call contactsDB remove with id from params reply with code 204 on success', async () => {
    expect.assertions(2)
    mockRemove.mockResolvedValue(1)
    await handler(mockRequest, mockReply)

    expect(mockRemove).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(mockCode).toHaveBeenNthCalledWith(1, 204)
  })
  test('Should should send 404 when id to delete is not found', async () => {
    mockRemove.mockResolvedValue(0)
    const expect404Error = new Error('Not Found')
    expect404Error.statusCode = 404
    await handler(mockRequest, mockReply)

    expect(mockRemove).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(mockSend).toHaveBeenNthCalledWith(1, expect404Error)
  })
  test('Should should send unknown errors', async () => {
    const testError = new Error('testing error')
    mockRemove.mockRejectedValue(testError)
    await handler(mockRequest, mockReply)

    expect(mockRemove).toHaveBeenNthCalledWith(1, { id: 1 })
    expect(mockSend).toHaveBeenNthCalledWith(1, testError)
  })
})
