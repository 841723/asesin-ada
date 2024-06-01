const { leaveGame } = require('../controller'); 
const pool = require('../connectionManager'); 
const constants = require('../constants'); 


describe('leaveGame function', () => {
    afterAll(() => {
        pool.end();
      });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns success when update is successful', async () => {
    const username = 'testUser';
    const updateValues = [null, username, constants.CERO, null];
    const mockUpdateResult = { rows: [{ id: 1 }] };

    const mockClient = {
        query: jest.fn().mockResolvedValue(mockUpdateResult),
        release: jest.fn(),
      };
      pool.connect = jest.fn().mockResolvedValue(mockClient);
      let result;
      try{
        result = await leaveGame(username);
      }finally{
        mockClient.release();
      }
    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ exito: true, msg: constants.CORRECT_UPDATE });
  });

  test('returns error when update fails', async () => {
    const username = 'testUser';
    const updateValues = [null, username, constants.CERO, null];
    const mockUpdateResult = { rows: [] };
    const mockClient = {
        query: jest.fn().mockResolvedValue(mockUpdateResult),
        release: jest.fn(),
      };
      pool.connect = jest.fn().mockResolvedValue(mockClient);
      let result;
      try{
        result = await leaveGame(username);
      }finally{
        mockClient.release();
      }
    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ exito: false, msg: constants.ERROR_UPDATING });
  });
});