import {describe, expect, test, vi} from 'vitest';
import {PubSubService} from '../pubsub';

describe('PubSubService', () => {
  test('publishes events to subscribers with provided arguments', async () => {
    const service = new PubSubService();
    const handler = vi.fn();
    service.subscribe('user:created', handler);

    await service.publish('user:created', 1, {name: 'Nora'});

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1, {name: 'Nora'});
  });

  test('unsubscribes automatically after once listeners fire', async () => {
    const service = new PubSubService();
    const handler = vi.fn();

    service.once('job:done', handler);
    await service.publish('job:done', 'first');
    await service.publish('job:done', 'second');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(service.getActiveEvents()).toEqual([]);
  });

  test('unsubscribe function prevents future deliveries', async () => {
    const service = new PubSubService();
    const handler = vi.fn();
    const unsubscribe = service.subscribe('notifications', handler);

    unsubscribe();
    await service.publish('notifications', {message: 'hello'});

    expect(handler).not.toHaveBeenCalled();
  });

  test('clear removes targeted events while keeping others', async () => {
    const service = new PubSubService();
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    service.subscribe('a', handlerA);
    service.subscribe('b', handlerB);
    service.subscribe('b', handlerB);

    service.clear('b');
    expect(service.getActiveEvents()).toEqual(['a']);

    await service.publish('b');
    expect(handlerB).not.toHaveBeenCalled();

    service.clear();
    expect(service.getActiveEvents()).toEqual([]);
  });

  test('publish awaits asynchronous callbacks and respects once semantics', async () => {
    const service = new PubSubService();
    const order: string[] = [];
    service.once('async', async (payload: string) => {
      order.push('start-' + payload);
      await Promise.resolve();
      order.push('end-' + payload);
    });

    await service.publish('async', 'a');

    expect(order).toEqual(['start-a', 'end-a']);
    expect(service.getActiveEvents()).toEqual([]);
  });
});
