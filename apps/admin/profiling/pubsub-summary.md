PubSub profiling summary

Scenario
- Script: `scripts/profile-pubsub.ts` (20,000 publishes across 50 events with 20 listeners each, occasional `once` subscribers).
- Metrics written to JSON for repeatability: `profiling/pubsub-baseline.json` (before), `profiling/pubsub-after.json` (after).

Baseline
- total_wall_time_ms: 209.052
- avg_us_per_publish: 10.4526
- Bottleneck: `publish` filtered the entire subscriptions array on every emit, making work proportional to total subscriptions instead of per-event listeners.

Optimization implemented
- Switched `PubSubService` to store subscriptions in a per-event map, pruning empty buckets. `publish` now iterates only the listeners for the emitted event while keeping `once` semantics and unsubscribe behavior intact. `getActiveEvents` now reflects map keys.

After
- total_wall_time_ms: 62.1688
- avg_us_per_publish: 3.1084

Delta
- ~70% faster total runtime for the scenario (209.05ms → 62.17ms).
- `publish` no longer performs global scans; work is scoped to the active event’s listeners.
