
const { handler } = require('../postContacts')
const mockInsert = jest.fn()
const mockInfo = jest.fn()
const mockSequencer = jest.fn()
const mockRequest = {
  contactsDB: {
    insert: mockInsert
  },
  getContactsSequence: mockSequencer,
  log: { info: mockInfo },
  body: {
    data: 'test contact data'
  }
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
    expect.assertions(5)
    mockSequencer.mockResolvedValue(4)
    mockInsert.mockResolvedValue({
      _id: 'ABC123',
      id: 4,
      data: 'test contact data'
    })
    await handler(mockRequest, chainableReply)

    expect(mockSequencer).toHaveBeenNthCalledWith(1)
    expect(mockInsert).toHaveBeenNthCalledWith(1,
      { id: 4, data: 'test contact data' }
    )
    expect(mockInfo).toHaveBeenNthCalledWith(1,
      { contact_id: 4, _id: 'ABC123' },
      'Successfully Inserted Contact'
    )
    expect(chainableReply.code).toHaveBeenNthCalledWith(1, 202)
    expect(chainableReply.send).toHaveBeenNthCalledWith(1, {
      id: 4,
      data: 'test contact data'
    })
  })
  test('Should should send unable to insert error when response from insert is undefined', async () => {
    expect.assertions(3)

    mockInsert.mockResolvedValue(undefined)
    mockSequencer.mockResolvedValue(5)

    const expectUnableToInsert = new Error('Unable to Insert Contact')
    await handler(mockRequest, chainableReply)

    expect(mockSequencer).toHaveBeenNthCalledWith(1)
    expect(mockInsert).toHaveBeenNthCalledWith(1, { id: 5, data: 'test contact data' })
    expect(chainableReply.send).toHaveBeenNthCalledWith(1, expectUnableToInsert)
  })
  test('Should should send unknown errors', async () => {
    expect.assertions(3)

    const testError = new Error('testing error')
    mockInsert.mockRejectedValue(testError)
    mockSequencer.mockResolvedValue(6)

    await handler(mockRequest, chainableReply)

    expect(mockSequencer).toHaveBeenNthCalledWith(1)
    expect(mockInsert).toHaveBeenNthCalledWith(1, { id: 6, data: 'test contact data' })
    expect(chainableReply.send).toHaveBeenNthCalledWith(1, testError)
  })
})
