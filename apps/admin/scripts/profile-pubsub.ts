import {writeFileSync} from 'fs';
import {performance} from 'perf_hooks';
import {PubSubService} from '../src/services/pubsub.ts';

function runScenario(iterations = 20000, eventsCount = 50, listenersPerEvent = 20) {
  const service = new PubSubService();
  const events = Array.from({length: eventsCount}, (_, i) => `event-${i}`);

  for (const event of events) {
    for (let i = 0; i < listenersPerEvent; i++) {
      service.subscribe(event, () => {});
    }
  }

  const start = performance.now();

  return service.publish('warmup').then(async () => {
    for (let i = 0; i < iterations; i++) {
      const event = events[i % events.length];
      // alternate between sync and async callbacks by toggling once subscriptions
      if (i % 500 === 0) {
        service.once(event, async () => Promise.resolve());
      }
      // eslint-disable-next-line no-await-in-loop
      await service.publish(event, i);
    }

    const end = performance.now();
    return {
      iterations,
      eventsCount,
      listenersPerEvent,
      total_wall_time_ms: end - start,
      avg_us_per_publish: ((end - start) / iterations) * 1000,
    };
  });
}

async function main() {
  const outIndex = process.argv.indexOf('--out');
  const outPath = outIndex !== -1 ? process.argv[outIndex + 1] : null;

  const metrics = await runScenario();

  if (outPath) {
    writeFileSync(outPath, JSON.stringify(metrics, null, 2));
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(metrics, null, 2));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
