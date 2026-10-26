import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import sharp from 'sharp';
import request from 'supertest';
import { createUser, setupTestApp } from './setup.js';

let ctx;
let app;

before(async () => {
  ctx = await setupTestApp();
  app = ctx.app;
  await createUser({ email: 'owner@example.com', role: 'admin' });
  await createUser({ email: 'editor@example.com', role: 'editor' });
});
after(() => ctx.teardown());

const XHR = { 'X-Requested-With': 'XMLHttpRequest' };

async function signIn(email = 'owner@example.com', password = 'CorrectHorse42') {
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/login').set(XHR).send({ email, password });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  return agent;
}

const extImage = (n = 1) => ({ url: `https://images.unsplash.com/photo-${n}?w=1600`, alt: 'Sample' });

describe('public endpoints', () => {
  test('health and settings', async () => {
    assert.equal((await request(app).get('/api/health')).body.status, 'ok');
    const res = await request(app).get('/api/settings');
    assert.equal(res.status, 200);
    assert.match(res.body.settings.whatsappNumber, /^\d+$/);
    assert.equal(res.body.settings.googleReviewUrl, '');
    assert.equal(res.body.settings._id, undefined);
  });

  test('unknown API route returns JSON 404', async () => {
    const res = await request(app).get('/api/nope');
    assert.equal(res.status, 404);
    assert.ok(res.body.error.message);
  });

  test('google reviews report disabled when not configured', async () => {
    const res = await request(app).get('/api/reviews/google');
    assert.deepEqual(res.body, { enabled: false });
  });

  test('mutations without the X-Requested-With header are rejected', async () => {
    const res = await request(app).post('/api/enquiries').send({});
    assert.equal(res.status, 403);
  });
});

describe('enquiries', () => {
  const valid = { name: 'Jane Doe', phone: '+1 555 123 4567', service: 'Interior House Painting', location: 'Downtown', message: 'Two bedrooms' };

  test('valid contact enquiry is stored as New', async () => {
    const res = await request(app).post('/api/enquiries').set(XHR).send(valid);
    assert.equal(res.status, 201);
    const admin = await signIn();
    const list = await admin.get('/api/admin/enquiries');
    assert.equal(list.body.items[0].status, 'New');
    assert.equal(list.body.items[0].type, 'contact');
    assert.equal(list.body.counts.New, 1);
  });

  test('quote request keeps quote fields', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .set(XHR)
      .send({ ...valid, type: 'quote', propertyType: 'Villa', preferredStart: 'Next month', email: 'JANE@Example.com' });
    assert.equal(res.status, 201);
    const admin = await signIn();
    const list = await admin.get('/api/admin/enquiries?type=quote');
    assert.equal(list.body.items.length, 1);
    assert.equal(list.body.items[0].propertyType, 'Villa');
    assert.equal(list.body.items[0].email, 'jane@example.com');
  });

  test('invalid input returns field errors', async () => {
    const res = await request(app).post('/api/enquiries').set(XHR).send({ name: 'J', phone: 'abc', email: 'nope', service: '', location: '' });
    assert.equal(res.status, 400);
    for (const field of ['name', 'phone', 'email', 'service', 'location']) assert.ok(res.body.error.details[field], field);
  });

  test('honeypot submissions are accepted but not stored', async () => {
    const admin = await signIn();
    const before = (await admin.get('/api/admin/enquiries')).body.pagination.total;
    const res = await request(app).post('/api/enquiries').set(XHR).send({ ...valid, website: 'http://spam.example' });
    assert.equal(res.status, 201);
    assert.equal((await admin.get('/api/admin/enquiries')).body.pagination.total, before);
  });

  test('status workflow and role-restricted delete', async () => {
    const admin = await signIn();
    const editor = await signIn('editor@example.com');
    const [first] = (await admin.get('/api/admin/enquiries')).body.items;

    const upd = await editor.patch(`/api/admin/enquiries/${first._id}`).set(XHR).send({ status: 'In Progress', notes: 'Site visit Tue' });
    assert.equal(upd.status, 200);
    assert.equal(upd.body.enquiry.status, 'In Progress');

    const bad = await editor.patch(`/api/admin/enquiries/${first._id}`).set(XHR).send({ status: 'Lost' });
    assert.equal(bad.status, 400);

    assert.equal((await editor.delete(`/api/admin/enquiries/${first._id}`).set(XHR)).status, 403);
    assert.equal((await admin.delete(`/api/admin/enquiries/${first._id}`).set(XHR)).status, 204);
    assert.equal((await admin.get(`/api/admin/enquiries/${first._id}`)).status, 404);
  });
});

describe('authentication', () => {
  test('admin routes require a session', async () => {
    assert.equal((await request(app).get('/api/admin/stats')).status, 401);
    assert.equal((await request(app).get('/api/auth/me')).status, 401);
  });

  test('login sets an httpOnly SameSite=Strict cookie; logout clears it', async () => {
    const res = await request(app).post('/api/auth/login').set(XHR).send({ email: 'OWNER@example.com', password: 'CorrectHorse42' });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.passwordHash, undefined);
    const cookie = res.headers['set-cookie'][0];
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Strict/);

    const agent = await signIn();
    assert.equal((await agent.get('/api/auth/me')).body.user.email, 'owner@example.com');
    assert.equal((await agent.post('/api/auth/logout').set(XHR)).status, 204);
    assert.equal((await agent.get('/api/auth/me')).status, 401);
  });

  test('wrong password and unknown email give the same error', async () => {
    const a = await request(app).post('/api/auth/login').set(XHR).send({ email: 'owner@example.com', password: 'wrong' });
    const b = await request(app).post('/api/auth/login').set(XHR).send({ email: 'ghost@example.com', password: 'wrong' });
    assert.equal(a.status, 401);
    assert.equal(b.status, 401);
    assert.equal(a.body.error.message, b.body.error.message);
  });

  test('NoSQL operator injection in login is rejected', async () => {
    const res = await request(app).post('/api/auth/login').set(XHR).send({ email: { $gt: '' }, password: { $gt: '' } });
    assert.equal(res.status, 400);
  });

  test('forged / tampered tokens are rejected', async () => {
    const res = await request(app).get('/api/admin/stats').set('Cookie', 'ps_session=eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIn0.');
    assert.equal(res.status, 401);
  });

  test('account locks after repeated failures', async () => {
    await createUser({ email: 'lockme@example.com' });
    for (let i = 0; i < 5; i += 1) {
      await request(app).post('/api/auth/login').set(XHR).send({ email: 'lockme@example.com', password: 'nope' });
    }
    const res = await request(app).post('/api/auth/login').set(XHR).send({ email: 'lockme@example.com', password: 'CorrectHorse42' });
    assert.equal(res.status, 423);
  });

  test('changing password invalidates old sessions', async () => {
    await createUser({ email: 'rotate@example.com' });
    const a = await signIn('rotate@example.com');
    const b = await signIn('rotate@example.com');
    const weak = await a.post('/api/auth/password').set(XHR).send({ currentPassword: 'CorrectHorse42', newPassword: 'short' });
    assert.equal(weak.status, 400);
    const ok = await a.post('/api/auth/password').set(XHR).send({ currentPassword: 'CorrectHorse42', newPassword: 'EvenBetterHorse99' });
    assert.equal(ok.status, 200);
    assert.equal((await a.get('/api/auth/me')).status, 200, 'session that changed the password stays valid');
    assert.equal((await b.get('/api/auth/me')).status, 401, 'other sessions are signed out');
  });

  test('only admins manage users', async () => {
    const editor = await signIn('editor@example.com');
    assert.equal((await editor.get('/api/admin/users')).status, 403);
    const admin = await signIn();
    const created = await admin.post('/api/admin/users').set(XHR).send({ name: 'New Editor', email: 'new@example.com', password: 'Password1234' });
    assert.equal(created.status, 201);
    assert.equal(created.body.user.role, 'editor');
  });
});

describe('reviews & moderation', () => {
  test('submitted reviews stay hidden until approved', async () => {
    const res = await request(app).post('/api/reviews').set(XHR).send({ name: 'Sam', rating: 5, text: 'Very tidy and professional work.' });
    assert.equal(res.status, 201);

    let pub = await request(app).get('/api/reviews');
    assert.equal(pub.body.items.length, 0);
    assert.deepEqual(pub.body.summary, { count: 0, average: null });

    const editor = await signIn('editor@example.com');
    const pending = await editor.get('/api/admin/reviews?status=pending');
    assert.equal(pending.body.items.length, 1);
    assert.equal(pending.body.counts.pending, 1);

    const approved = await editor.patch(`/api/admin/reviews/${pending.body.items[0]._id}`).set(XHR).send({ status: 'approved' });
    assert.equal(approved.body.review.status, 'approved');

    pub = await request(app).get('/api/reviews');
    assert.equal(pub.body.items.length, 1);
    assert.equal(pub.body.items[0].status, undefined, 'moderation fields are not public');
    assert.deepEqual(pub.body.summary, { count: 1, average: 5 });
  });

  test('rating must be 1–5 and text required', async () => {
    const res = await request(app).post('/api/reviews').set(XHR).send({ name: 'Sam', rating: 7, text: 'short' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details.rating);
    assert.ok(res.body.error.details.text);
  });
});

describe('projects', () => {
  let projectId;

  test('draft projects are not public until published', async () => {
    const admin = await signIn('editor@example.com');
    const res = await admin.post('/api/admin/projects').set(XHR).send({
      title: 'Blue Kitchen',
      category: 'Interior',
      location: 'Downtown',
      completedAt: '2026-05-01',
      coverImage: extImage(1),
      beforeImage: extImage(2),
      afterImage: extImage(3),
      gallery: [extImage(4)],
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(res.body.project.slug, 'blue-kitchen');
    assert.equal(res.body.project.published, false);
    projectId = res.body.project._id;

    assert.equal((await request(app).get('/api/projects')).body.items.length, 0);
    assert.equal((await request(app).get('/api/projects/blue-kitchen')).status, 404);

    await admin.patch(`/api/admin/projects/${projectId}`).set(XHR).send({ published: true });
    const pub = await request(app).get('/api/projects');
    assert.equal(pub.body.items.length, 1);
    assert.equal(pub.body.pagination.total, 1);
    assert.equal((await request(app).get('/api/projects/blue-kitchen')).body.project.title, 'Blue Kitchen');
  });

  test('slugs stay unique and category filter works', async () => {
    const admin = await signIn();
    const dup = await admin.post('/api/admin/projects').set(XHR).send({ title: 'Blue Kitchen', category: 'Exterior', coverImage: extImage(5), published: true });
    assert.equal(dup.body.project.slug, 'blue-kitchen-2');
    assert.equal((await request(app).get('/api/projects?category=Exterior')).body.items.length, 1);
    assert.equal((await request(app).get('/api/projects?category=Bogus')).status, 400);
    const page = await request(app).get('/api/projects?limit=1&page=2');
    assert.equal(page.body.items.length, 1);
    assert.equal(page.body.pagination.totalPages, 2);
  });

  test('rejects unsafe image URLs', async () => {
    const admin = await signIn();
    const res = await admin.post('/api/admin/projects').set(XHR).send({ title: 'XSS', category: 'Interior', coverImage: { url: 'javascript:alert(1)' } });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.details['coverImage.url']);
  });

  test('sitemap lists published projects; robots points at sitemap', async () => {
    const sitemap = await request(app).get('/sitemap.xml');
    assert.match(sitemap.headers['content-type'], /xml/);
    assert.match(sitemap.text, /https:\/\/painter\.example\/portfolio\/blue-kitchen</);
    const robots = await request(app).get('/robots.txt');
    assert.match(robots.text, /Sitemap: https:\/\/painter\.example\/sitemap\.xml/);
    assert.match(robots.text, /Disallow: \/admin/);
  });
});

describe('image uploads', () => {
  test('valid images are re-encoded to WebP variants and cleaned up on delete', async () => {
    const admin = await signIn();
    const png = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#e8772e' } }).png().toBuffer();
    const up = await admin.post('/api/admin/uploads').set(XHR).attach('images', png, { filename: 'wall.png', contentType: 'image/png' });
    assert.equal(up.status, 201, JSON.stringify(up.body));
    const [img] = up.body.images;
    assert.match(img.url, /^\/uploads\/projects\/[\w-]+-1200\.webp$/);
    assert.deepEqual(img.variants.map((v) => v.width), [480, 960, 1200]);

    const served = await request(app).get(img.url);
    assert.equal(served.status, 200);
    assert.equal(served.headers['content-type'], 'image/webp');

    const created = await admin.post('/api/admin/projects').set(XHR).send({ title: 'Upload Test', category: 'Decorative', coverImage: img });
    const file = path.join(ctx.uploadDir, img.url.replace('/uploads/', ''));
    assert.ok(fs.existsSync(file));
    await admin.delete(`/api/admin/projects/${created.body.project._id}`).set(XHR);
    assert.ok(!fs.existsSync(file), 'uploaded files are removed with the project');
  });

  test('files that only pretend to be images are rejected', async () => {
    const admin = await signIn();
    const res = await admin
      .post('/api/admin/uploads')
      .set(XHR)
      .attach('images', Buffer.from('<?php echo "hi"; ?>'), { filename: 'shell.png', contentType: 'image/png' });
    assert.equal(res.status, 415);
    const svg = await admin.post('/api/admin/uploads').set(XHR).attach('images', Buffer.from('<svg/>'), { filename: 'x.svg', contentType: 'image/svg+xml' });
    assert.equal(svg.status, 415);
  });

  test('missing upload files return 404, not 500', async () => {
    assert.equal((await request(app).get('/uploads/projects/nope.webp')).status, 404);
  });
});

describe('settings', () => {
  const base = async () => (await request(app).get('/api/settings')).body.settings;

  test('editors cannot change settings', async () => {
    const editor = await signIn('editor@example.com');
    assert.equal((await editor.put('/api/admin/settings').set(XHR).send(await base())).status, 403);
  });

  test('admin updates are validated and published', async () => {
    const admin = await signIn();
    const current = await base();
    const bad = await admin.put('/api/admin/settings').set(XHR).send({ ...current, whatsappNumber: '+1 555 000', googleReviewUrl: 'http://insecure' });
    assert.equal(bad.status, 400);
    assert.ok(bad.body.error.details.whatsappNumber);
    assert.ok(bad.body.error.details.googleReviewUrl);

    const ok = await admin
      .put('/api/admin/settings')
      .set(XHR)
      .send({ ...current, whatsappNumber: '447700900123', googleReviewUrl: 'https://g.page/r/example/review' });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    const after = await base();
    assert.equal(after.whatsappNumber, '447700900123');
    assert.equal(after.googleReviewUrl, 'https://g.page/r/example/review');
  });
});

describe('services', () => {
  test('CRUD with inactive services hidden publicly', async () => {
    const admin = await signIn();
    const res = await admin
      .post('/api/admin/services')
      .set(XHR)
      .send({ title: 'Epoxy Floors', summary: 'Hard-wearing floor coatings for garages.', features: ['Garages'], active: false });
    assert.equal(res.status, 201);
    assert.equal((await request(app).get('/api/services')).body.items.length, 0);
    const upd = await admin.put(`/api/admin/services/${res.body.service._id}`).set(XHR).send({ ...res.body.service, active: true });
    assert.equal(upd.status, 200, JSON.stringify(upd.body));
    assert.equal((await request(app).get('/api/services')).body.items.length, 1);
    assert.equal((await request(app).get('/api/services/epoxy-floors')).status, 200);
  });
});
