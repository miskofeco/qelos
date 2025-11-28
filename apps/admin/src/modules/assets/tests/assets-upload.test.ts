import {beforeEach, describe, expect, test, vi} from 'vitest';
import {ref} from 'vue';
import {
  getAssetInStorage,
  removeAssetFromStorage,
  updateAssetFromStorage,
  uploadAssetToStorage,
  useAssetsUpload,
} from '../compositions/assets';

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
  put: vi.fn(),
  defaults: {
    headers: {common: {Authorization: 'Bearer token'}},
    baseURL: 'https://api.example.test',
    withCredentials: true,
  },
  getCallData: (res: any) => res?.data ?? res,
}));

vi.mock('@/services/apis/api', () => ({
  api: {
    get: apiMocks.get,
    post: apiMocks.post,
    delete: apiMocks.delete,
    put: apiMocks.put,
    defaults: apiMocks.defaults,
  },
  getCallData: apiMocks.getCallData,
}));

describe('assets compositions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('useAssetsUpload builds upload URL and exposes api defaults', () => {
    const {setUploadUrl, uploadUrl, headers, withCredentials} = useAssetsUpload('storage-1', ref('/docs'));
    const file = {name: 'report final.pdf'} as File;

    setUploadUrl(file);

    const parsed = new URL(uploadUrl.value);
    expect(parsed.pathname).toBe('/api/assets/storage-1');
    expect(parsed.searchParams.get('identifier')).toBe('/docs/');
    expect(parsed.searchParams.get('prefix')).toBe('reportfinal');
    expect(parsed.searchParams.get('extension')).toBe('pdf');
    expect(headers.value).toEqual(apiMocks.defaults.headers.common);
    expect(withCredentials.value).toBe(true);
  });

  test('asset API helpers proxy to the shared api client', async () => {
    apiMocks.get.mockResolvedValue({data: {file: 'info'}});
    apiMocks.post.mockResolvedValue({data: {id: 'new-file'}});
    apiMocks.delete.mockResolvedValue({data: true});
    apiMocks.put.mockResolvedValue({data: {updated: true}});

    expect(await getAssetInStorage('storage-1', 'index')).toEqual({file: 'info'});
    expect(apiMocks.get).toHaveBeenCalledWith('/api/assets/storage-1', {params: {identifier: 'index'}});

    expect(await uploadAssetToStorage('storage-1', '/docs', {} as File)).toEqual({id: 'new-file'});
    expect(apiMocks.post).toHaveBeenCalledWith('/api/assets/storage-1', {}, {params: {identifier: '/docs'}});

    expect(await removeAssetFromStorage('storage-1', '/docs/file.pdf')).toEqual(true);
    expect(apiMocks.delete).toHaveBeenCalledWith('/api/assets/storage-1', {params: {identifier: '/docs/file.pdf'}});

    expect(await updateAssetFromStorage('storage-1', '/docs', {title: 'new'})).toEqual({updated: true});
    expect(apiMocks.put).toHaveBeenCalledWith('/api/assets/storage-1', {title: 'new'}, {params: {identifier: '/docs'}});
  });
});
