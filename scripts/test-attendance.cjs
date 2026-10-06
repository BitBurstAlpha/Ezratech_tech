/* eslint-disable @typescript-eslint/no-require-imports -- Reuse the isolated TypeScript test loader. */
require('./test-outcomes.cjs');
const assert = require('node:assert/strict');
const { loadDemoScenario } = require('../lib/demo-state.ts');
const { progressReducer } = require('../components/student/progress/progress-state.ts');
const { attendanceSummary } = require('../components/student/workspace/attendance-data.ts');
let state = loadDemoScenario('active-project').progress;
assert.equal(attendanceSummary(state.workspace).percent, null);
assert.equal(attendanceSummary(state.workspace).eligible, false);
state = progressReducer(state, { type: 'setMeetingAttendance', index: 1, status: 'Present' });
assert.equal(attendanceSummary(state.workspace).percent, 100);
assert.equal(attendanceSummary(state.workspace).eligible, false, 'pending meetings prevent eligibility even at 100% recorded attendance');
state = progressReducer(state, { type: 'setMeetingAttendance', index: 0, status: 'Absent' });
assert.equal(attendanceSummary(state.workspace).percent, 50);
assert.equal(attendanceSummary(state.workspace).eligible, false);
state = progressReducer(state, { type: 'setMeetingAttendance', index: 0, status: 'Present' });
assert.equal(attendanceSummary(state.workspace).eligible, true);
assert.equal(attendanceSummary(JSON.parse(JSON.stringify(state)).workspace).eligible, true);
assert.equal(progressReducer(state, { type: 'setMeetingAttendance', index: -1, status: 'Present' }), state);
assert.equal(progressReducer(state, { type: 'setMeetingAttendance', index: 0, status: 'invalid' }), state);
for (const patch of [{ activeProject: false }, { monitoring: { ...state.monitoring, paused: true } }, { projectCompletion: { ...state.projectCompletion, smeApproved: true } }]) {
 const blocked = { ...state, ...patch };
 assert.equal(progressReducer(blocked, { type: 'setMeetingAttendance', index: 0, status: 'Absent' }), blocked);
}
const cancelled = loadDemoScenario('cancelled-project').progress;
assert.equal(progressReducer(cancelled, { type: 'setMeetingAttendance', index: 0, status: 'Present' }), cancelled);
assert.equal(attendanceSummary({ ...state.workspace, attendance: undefined }).pending, 2, 'old stored state remains compatible');
assert.equal(attendanceSummary({ ...state.workspace, meetings: [] }).eligible, false);
assert.equal(attendanceSummary({ ...state.workspace, meetings: state.workspace.meetings.map(meeting => ({ ...meeting, status: 'Cancelled' })) }).eligible, false);
console.log('Attendance checks passed: pending, present, absent, 100% eligibility, persisted and legacy records, invalid updates and read-only guards.');
