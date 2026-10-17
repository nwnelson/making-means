import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';
import { createError, isError } from 'h3';

const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const helper = { exports: {} };
vm.runInNewContext(compile(readFileSync('shared/utils/inquiry-telemetry.ts', 'utf8')), { exports: helper.exports, Error });
const { inquiryError } = helper.exports;
const artworkId = '11111111-1111-4111-8111-111111111111';
const requestId = '22222222-2222-4222-8222-222222222222';
const body = { name: 'Private Person', email: 'private@example.com', country: 'Zimbabwe', cityPostalCode: 'Private Location', message: 'Private message', requestId, website: '' };

function setup(options = {}) {
  const logs = [];
  const captures = [];
  let sends = 0;
  const Sentry = {
    logger: Object.fromEntries(['info', 'warn', 'error'].map(level => [level, (message, attributes) => logs.push({ level, message, attributes: { ...attributes } })])),
    captureException: (error, context) => captures.push({ error, context }),
  };
  const source = readFileSync('server/api/artworks/[id]/inquiry.post.ts', 'utf8').replace(/^import .*;\n/gm, '');
  const exports = {};
  vm.runInNewContext(compile(source), {
    exports, Sentry, inquiryError, z, createError, isError,
    defineEventHandler: handler => handler,
    getRouterParam: () => options.artworkId ?? artworkId,
    getHeader: () => requestId,
    readBody: async () => options.body ?? body,
    serverSupabaseClient: async () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({
      data: options.missing ? null : { id: artworkId, title: 'Artwork', sold: !!options.sold, artist: { name: 'Artist' } },
      error: options.databaseError ?? null,
    }) }) }) }) }),
    useRuntimeConfig: () => options.missingConfig ? { public: {} } : { resendApiKey: 'secret-key', public: { resendFromEmail: 'sender@example.com', adminEmail: 'admin@example.com' } },
    Resend: class { emails = { send: async () => { sends++; if (options.thrown) throw options.thrown; return { error: options.emailError ?? null }; } }; },
  });
  return { handler: exports.default, logs, captures, sends: () => sends, Sentry };
}

function assertPrivateDataAbsent(result) {
  const serialized = JSON.stringify({ logs: result.logs, captures: result.captures.map(c => ({ ...c, error: { message: c.error.message, cause: c.error.cause?.message, stack: c.error.stack } })) });
  for (const value of [body.name, body.email, body.cityPostalCode, body.message, 'secret-key']) assert.ok(!serialized.includes(value), value);
}

test('success logs both boundaries with correlation IDs and no form contents', async () => {
  const result = setup();
  assert.equal((await result.handler({})).success, true);
  assert.equal(result.sends(), 1);
  assert.equal(result.captures.length, 0);
  assert.ok(result.logs.some(log => log.message === 'Inquiry email accepted by provider'));
  assert.ok(result.logs.every(log => log.attributes.requestId === requestId));
  assertPrivateDataAbsent(result);
});

for (const [name, options, status] of [
  ['invalid input', { body: { ...body, email: '' } }, 400],
  ['missing artwork', { missing: true }, 404],
  ['sold artwork', { sold: true }, 409],
]) test(name + ' is a rejection, not an exception event', async () => {
  const result = setup(options);
  await assert.rejects(result.handler({}), error => error.statusCode === status);
  assert.equal(result.captures.length, 0);
  assert.equal(result.sends(), 0);
  assert.equal(result.logs.at(-1).level, 'warn');
});

test('bot submissions do not send email or create issues', async () => {
  const result = setup({ body: { ...body, website: 'bot' } });
  assert.equal((await result.handler({})).success, true);
  assert.equal(result.sends(), 0);
  assert.equal(result.captures.length, 0);
});

for (const [name, options, status, stage, providerCode] of [
  ['database failure', { databaseError: { message: body.email, code: '42501' } }, 500, 'artwork_lookup', '42501'],
  ['missing config', { missingConfig: true }, 503, 'configuration', 'unknown'],
  ['provider failure', { emailError: { name: 'validation_error', message: body.email } }, 502, 'email_send', 'validation_error'],
  ['unexpected exception', { thrown: new Error(body.message) }, 500, 'email_send', 'unknown'],
]) test(name + ' captures one safe error with the failing stage', async () => {
  const result = setup(options);
  await assert.rejects(result.handler({}), error => {
    assert.equal(error.statusCode, status);
    assert.equal(result.captures[0].error, error);
    return true;
  });
  assert.equal(result.captures.length, 1);
  assert.equal(result.captures[0].context.contexts.inquiry.stage, stage);
  assert.equal(result.captures[0].context.contexts.inquiry.providerCode, providerCode);
  assertPrivateDataAbsent(result);
});

for (const [name, failure, issues, level] of [
  ['success', null, 0, 'info'],
  ['network failure', new Error(body.email), 1, 'error'],
  ['API failure', { statusCode: 502, data: { statusMessage: 'Please try again.' } }, 0, 'error'],
  ['validation failure', { statusCode: 400 }, 0, 'warn'],
]) test('frontend ' + name, async () => {
  const result = setup();
  const source = readFileSync('app/pages/artworks/[id].vue', 'utf8');
  const submit = source.slice(source.indexOf('async function submitInquiry()'), source.indexOf('\nuseHead(', source.indexOf('async function submitInquiry()')));
  const state = { value: 'form' };
  const submitting = { value: false };
  const error = { value: '' };
  const exports = {};
  vm.runInNewContext(compile(submit + '\nexport { submitInquiry };'), {
    exports, Sentry: result.Sentry, telemetryError: inquiryError,
    artwork: { value: { id: artworkId } }, inquirySubmitting: submitting, inquiryStep: state,
    inquiryError: error, inquiryForm: body,
    $fetch: async (_url, options) => {
      assert.equal(options.headers['X-Inquiry-Request-Id'], requestId);
      if (failure) throw failure;
      return { success: true };
    },
  });
  await exports.submitInquiry();
  assert.equal(submitting.value, false);
  assert.equal(state.value, failure ? 'form' : 'success');
  assert.equal(result.captures.length, issues);
  assert.equal(result.logs.at(-1).level, level);
  assertPrivateDataAbsent(result);
});
