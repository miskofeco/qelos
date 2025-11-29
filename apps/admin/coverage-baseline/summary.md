Pre-change coverage snapshot (legacy tests only)

- covered_lines_absolute: 20
- covered_lines_relative: 0.0363%
- branch_coverage_relative: 7.79%
- function_coverage_relative: 6.49%
- total_lines: 55,165

Findings
- Coverage extremely low; only legacy utility/i18n/element tests exercised.
- Numerous unused-import warnings from Vue components surfaced by existing lint-style test (`unused-imports.test.ts`); no code paths executed in app code.

Advice
- Add targeted unit tests around services (CRUD wrappers, pub/sub, markdown), utilities (storage, text helpers), and compositions to raise coverage.
- Address unused imports flagged in: modules/assets/components/StorageGcsAuth.vue, modules/core/components/forms/FormInput.vue, modules/integrations/Integrations.vue, modules/integrations/components/WorkflowsView.vue, modules/no-code/components/blueprint-form/BlueprintEventsTab.vue, modules/plugins/components/PluginForm.vue, modules/plugins/components/plugin-form/BasicInfoTab.vue, modules/pre-designed/components/EditableContent.vue, modules/pre-designed/components/VChart.vue.
