import {beforeEach, describe, expect, test, vi} from 'vitest';
import {getCrud} from '../apis/crud';

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
  put: vi.fn(),
  getCallData: vi.fn((res) => res?.data ?? res),
}));

vi.mock('../apis/api', () => ({
  api: {
    get: apiMocks.get,
    post: apiMocks.post,
    delete: apiMocks.delete,
    put: apiMocks.put,
  },
  getCallData: apiMocks.getCallData,
}));

describe('crud service factory', () => {
  const crud = getCrud('/api/items');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getAll forwards query params and unwraps data', async () => {
    apiMocks.get.mockResolvedValue({data: ['a', 'b']});

    const result = await crud.getAll({limit: 2});

    expect(result).toEqual(['a', 'b']);
    expect(apiMocks.get).toHaveBeenCalledWith('/api/items', {params: {limit: 2}});
  });

  test('create uses post and returns parsed response', async () => {
    apiMocks.post.mockResolvedValue({data: {id: '123', name: 'demo'}});

    const result = await crud.create({name: 'demo'});

    expect(result).toEqual({id: '123', name: 'demo'});
    expect(apiMocks.post).toHaveBeenCalledWith('/api/items', {name: 'demo'});
    expect(apiMocks.getCallData).toHaveBeenCalled();
  });

  test('update sends partial payloads to the correct URL', async () => {
    apiMocks.put.mockResolvedValue({data: {id: '1', name: 'updated'}});

    const result = await crud.update('1', {name: 'updated'});

    expect(result).toEqual({id: '1', name: 'updated'});
    expect(apiMocks.put).toHaveBeenCalledWith('/api/items/1', {name: 'updated'});
  });

  test('remove rejects responses with error status codes', async () => {
    const badResponse = {status: 409};
    apiMocks.delete.mockResolvedValue(badResponse);

    await expect(crud.remove('17')).rejects.toEqual(badResponse);
    expect(apiMocks.delete).toHaveBeenCalledWith('/api/items/17');
  });
});
