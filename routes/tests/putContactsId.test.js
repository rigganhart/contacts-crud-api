const { handler } = require('../putContactsId')
const mockUpdate = jest.fn()
const mockInfo = jest.fn()
const mockRequest = {
  contactsDB: {
    update: mockUpdate
  },
  log: { info: mockInfo },
  body: {
    data: 'test update data'
  },
  params: { id: 20 }
}

describe('routes - postContacts handler', () => {
  let chainableReply
  beforeEach(() => {
    chainableReply = {
      send: jest.fn(() => chainableReply),
      code: jest.fn(() => chainableReply)
    }
  })
  test('Should call contactsDB insert with correct params and send response with code 202', async () => {
    expect.assertions(4)
    mockUpdate.mockResolvedValue({
      _id: 'ABC123',
      id: 20,
      data: 'test update data'
    })
    await handler(mockRequest, chainableReply)

    expect(mockUpdate).toHaveBeenNthCalledWith(1,
      { id: 20 },
      { id: 20, data: 'test update data' },
      { returnUpdatedDocs: true }
    )
    expect(mockInfo).toHaveBeenNthCalledWith(1,
      { contact_id: 20, _id: 'ABC123' },
      'Successfully Updated Contact'
    )
    expect(chainableReply.code).toHaveBeenNthCalledWith(1, 202)
    expect(chainableReply.send).toHaveBeenNthCalledWith(1, {
      id: 20,
      data: 'test update data'
    })
  })
  test('Should should send 404 when response from update is undefined', async () => {
    mockUpdate.mockResolvedValue(undefined)

    const expect404 = new Error('contact id: 20 Not Found')
    expect404.statusCode = 404
    await handler(mockRequest, chainableReply)

    expect(mockUpdate).toHaveBeenNthCalledWith(1,
      { id: 20 },
      { id: 20, data: 'test update data' },
      { returnUpdatedDocs: true }
    )
    expect(chainableReply.send).toHaveBeenNthCalledWith(1, expect404)
  })
  test('Should should send unknown errors', async () => {
    const testError = new Error('testing error')
    mockUpdate.mockRejectedValue(testError)

    await handler(mockRequest, chainableReply)

    expect(mockUpdate).toHaveBeenNthCalledWith(1,
      { id: 20 },
      { id: 20, data: 'test update data' },
      { returnUpdatedDocs: true }
    )
    expect(chainableReply.send).toHaveBeenNthCalledWith(1, testError)
  })
})
