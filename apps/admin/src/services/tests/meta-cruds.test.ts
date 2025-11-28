import {describe, expect, test, vi} from 'vitest';

const services = vi.hoisted(() => ({
  blocks: {name: 'blocks-service'},
  blueprints: {name: 'blueprints-service'},
  configurations: {name: 'configurations-service'},
  invites: {name: 'invites-service'},
  plugins: {name: 'plugins-service'},
  storages: {name: 'storages-service'},
  users: {name: 'users-service'},
  workspaces: {name: 'workspaces-service'},
  integrationSources: {name: 'integration-sources-service'},
  events: {name: 'events-service'},
  threads: {name: 'threads-service'},
}));

const getCrudMock = vi.hoisted(() => vi.fn((path: string) => ({path})));

vi.mock('@/services/apis/crud', () => ({
  getCrud: getCrudMock,
}));

vi.mock('@/services/apis/blocks-service', () => ({default: services.blocks}));
vi.mock('@/services/apis/blueprints-service', () => ({default: services.blueprints}));
vi.mock('@/services/apis/configurations-service', () => ({default: services.configurations}));
vi.mock('@/services/apis/invites-service', () => ({default: services.invites}));
vi.mock('@/services/apis/plugins-service', () => ({default: services.plugins}));
vi.mock('@/services/apis/storages-service', () => ({default: services.storages}));
vi.mock('@/services/apis/users-service', () => ({default: services.users}));
vi.mock('@/services/apis/workspaces-service', () => ({default: services.workspaces}));
vi.mock('@/services/apis/integration-sources-service', () => ({default: services.integrationSources}));
vi.mock('@/services/apis/events-service', () => ({default: services.events}));
vi.mock('@/services/apis/threads-service', () => ({default: services.threads}));

import {getAllStandardMetaCruds} from '../meta-cruds';

describe('getAllStandardMetaCruds', () => {
  test('builds navigation-aware meta crud entries for edit flows', () => {
    const metaCruds = getAllStandardMetaCruds();
    const blocksMeta = metaCruds.blocks;

    expect(blocksMeta.api).toEqual({name: 'blocks-service'});
    expect(blocksMeta.identifierKey).toBe('_id');
    expect(blocksMeta.clearAfterSubmit).toBe(true);
    expect(blocksMeta.navigateAfterSubmit).toEqual({
      name: 'editBlock',
      params: {blockId: '{IDENTIFIER}'},
      query: {},
    });
  });

  test('omits navigation instructions when edit routes are not provided', () => {
    const metaCruds = getAllStandardMetaCruds();

    expect(metaCruds.events.navigateAfterSubmit).toBeUndefined();
    expect(metaCruds.threads.navigateAfterSubmit).toBeUndefined();
  });
});
