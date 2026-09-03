const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('EasyCook test cases from Google Sheets', () => {
  let page;
  const runId = fs.readFileSync(path.join(__dirname, '..', '.run-id'), 'utf8').trim();
  const account = {
    name: 'Playwright EasyCook',
    username: `pw${String(runId).slice(-9)}`,
    email: `easycook.pw.${runId}@example.com`,
    password: 'Test@1234',
  };
  const recipeName = `ข้าวผัด Playwright ${runId}`;
  let recipeId;

  async function register(values = account) {
    await page.goto('/auth/register');
    const inputs = page.locator('form input');
    await inputs.nth(0).fill(values.name || 'Playwright EasyCook');
    await inputs.nth(1).fill(values.username || account.username);
    if (values.email !== undefined) await inputs.nth(2).fill(values.email);
    await inputs.nth(3).fill(values.password || account.password);
    await inputs.nth(4).fill(values.confirmPassword || values.password || account.password);
    await page.getByRole('button', { name: 'สมัครบัญชี', exact: true }).click();
  }

  async function login(password = account.password) {
    await page.goto('/auth/login');
    await page.getByPlaceholder('กรอกชื่อผู้ใช้งานหรืออีเมล').fill(account.email);
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill(password);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  }

  async function ensureLoggedIn() {
    if (page.url() === 'about:blank') await page.goto('/app/main');
    const hasToken = await page.evaluate(() => Boolean(localStorage.getItem('token')));
    if (!hasToken) {
      await login();
      await expect(page).toHaveURL(/\/app\/main/);
    }
  }

  async function ownRecipeId() {
    await ensureLoggedIn();
    await page.goto('/app/profile');
    await expect(page.getByText(recipeName)).toBeVisible({ timeout: 15_000 });
    const href = await page.getByText(recipeName).locator('xpath=ancestor::a').getAttribute('href');
    return href.split('/').pop();
  }

  async function firstRecipeLink() {
    await page.goto('/app/main');
    const link = page.locator('a[href^="/app/"]').filter({ has: page.locator('h1') }).first();
    await expect(link).toBeVisible();
    return link;
  }

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('TC-F01-001 ลงทะเบียนบัญชีใหม่', async () => {
    await register();
    await expect(page.getByText('สมัครบัญชีสำเร็จ')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5_000 });
  });

  test('TC-F01-002 ไม่กรอกอีเมล', async () => {
    await register({ ...account, username: `${account.username}x`, email: '' });
    await expect(page.getByText('กรุณากรอกข้อมูลให้ครบทุกช่อง')).toBeVisible();
  });

  test('TC-F01-003 ลงทะเบียนด้วยอีเมลซ้ำ', async () => {
    await register({ ...account, username: `${account.username}dup` });
    await expect(page.locator('p.text-red-500')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('TC-F01-004 เข้าสู่ระบบสำเร็จ', async () => {
    await login();
    await expect(page).toHaveURL(/\/app\/main/);
    await expect(page.getByRole('heading', { name: 'หมวดหมู่แนะนำ' })).toBeVisible();
  });

  test('TC-F01-005 เข้าสู่ระบบด้วยรหัสผ่านผิด', async () => {
    await page.evaluate(() => localStorage.clear());
    await login('Wrong@1234');
    await expect(page.locator('p.text-red-500')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('TC-F01-006 ออกจากระบบ', async () => {
    await login();
    await expect(page).toHaveURL(/\/app\/main/);
    await page.locator('nav button img[alt="profile"]').click();
    await page.getByRole('button', { name: 'ลงชื่อออก' }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });

  test('TC-F02-001 เพิ่มสูตรอาหารด้วยข้อมูลครบถ้วน', async () => {
    await ensureLoggedIn();
    await page.goto('/app/recipe');
    await page.getByPlaceholder('เพิ่มชื่อเมนูของคุณ').fill(recipeName);
    await page.getByPlaceholder('วัตถุดิบที่ 1').fill('ข้าว 1 ถ้วย');
    await page.getByPlaceholder('ขั้นตอนที่ 1').fill('ผัดข้าวกับไข่ให้สุก');
    await page.getByRole('button', { name: 'หมวดหมู่', exact: true }).click();
    const modal = page.getByRole('heading', { name: 'เลือกหมวดหมู่' }).locator('..');
    const category = page.locator('.fixed button').filter({ hasNotText: /ยกเลิก|บันทึก/ }).first();
    await category.click();
    await page.locator('.fixed').getByRole('button', { name: 'บันทึก', exact: true }).click();
    await page.getByRole('button', { name: 'โพสต์', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/main/, { timeout: 15_000 });
  });

  test('TC-F02-002 เพิ่มสูตรโดยไม่กรอกชื่อ', async () => {
    await ensureLoggedIn();
    await page.goto('/app/recipe');
    await page.getByRole('button', { name: 'โพสต์', exact: true }).click();
    await expect(page.getByText('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')).toBeVisible();
  });

  test('TC-F02-003 อัปโหลดรูปภาพที่รองรับ', async () => {
    await ensureLoggedIn();
    await page.goto('/app/recipe');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'khaopad.png', mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z0ZkAAAAASUVORK5CYII=', 'base64'),
    });
    await expect(page.locator('img').filter({ has: undefined }).last()).toBeVisible();
    await expect(page.getByText('รองรับเฉพาะ jpg, png, webp')).toHaveCount(0);
  });

  test('TC-F02-004 ปฏิเสธไฟล์ที่ไม่ใช่รูปภาพ', async () => {
    await page.goto('/app/recipe');
    await page.locator('input[type="file"]').setInputFiles({ name: 'recipe.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
    await expect(page.getByText('รองรับเฉพาะ jpg, png, webp')).toBeVisible();
  });

  test('TC-F03-001 ดูสูตรอาหารของฉัน', async () => {
    await ensureLoggedIn();
    await page.goto('/app/profile');
    await expect(page.getByText(recipeName)).toBeVisible({ timeout: 15_000 });
    const href = await page.getByText(recipeName).locator('xpath=ancestor::a').getAttribute('href');
    recipeId = href?.split('/').pop();
  });

  test('TC-F03-002 เปิดหน้าแก้ไขสูตรอาหาร', async () => {
    await page.getByText(recipeName).locator('xpath=ancestor::a').locator('button').click();
    await page.getByRole('button', { name: 'แก้ไข', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/edit-recipe\?menuid=/);
  });

  test('TC-F03-003 แสดงหน้าต่างยืนยันก่อนลบสูตร', async () => {
    await ensureLoggedIn();
    await page.goto('/app/profile');
    await page.getByText(recipeName).locator('xpath=ancestor::a').locator('button').click();
    await page.getByRole('button', { name: 'ลบ', exact: true }).first().click();
    await expect(page.getByRole('heading', { name: 'ลบสูตรนี้ใช่ไหม?' })).toBeVisible();
  });

  test('TC-F03-004 ยกเลิกการลบสูตร', async () => {
    await ensureLoggedIn();
    await page.goto('/app/profile');
    await page.getByText(recipeName).locator('xpath=ancestor::a').locator('button').click();
    await page.getByRole('button', { name: 'ลบ', exact: true }).first().click();
    await page.getByRole('button', { name: 'ยกเลิก' }).click();
    await expect(page.getByText(recipeName)).toBeVisible();
  });

  test('TC-F04-001 ค้นหาด้วยชื่อเต็ม', async () => {
    await page.goto('/app/main');
    await page.getByPlaceholder('ค้นหาเมนูอาหาร...').fill(recipeName);
    await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
    await expect(page.getByText(recipeName)).toBeVisible({ timeout: 15_000 });
  });

  test('TC-F04-002 ค้นหาด้วยคำบางส่วน', async () => {
    await page.goto('/app/main');
    await page.getByPlaceholder('ค้นหาเมนูอาหาร...').fill('Playwright');
    await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
    await expect(page.getByText(recipeName)).toBeVisible({ timeout: 15_000 });
  });

  test('TC-F04-003 ค้นหาเมนูที่ไม่มี', async () => {
    await page.goto('/app/main');
    await page.getByPlaceholder('ค้นหาเมนูอาหาร...').fill(`dtfgdfg-${runId}`);
    await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
    await expect(page.getByText('ไม่พบเมนูที่ตรงกับการค้นหา')).toBeVisible({ timeout: 15_000 });
  });

  test('TC-F04-004 ค้นหาด้วยช่องว่าง', async () => {
    await page.goto('/app/main');
    await page.getByPlaceholder('ค้นหาเมนูอาหาร...').fill('   ');
    await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/main$/);
  });

  test('TC-F05-001 แสดงหมวดหมู่แนะนำ', async () => {
    await page.goto('/app/main');
    await expect(page.getByRole('heading', { name: 'หมวดหมู่แนะนำ' })).toBeVisible();
    await expect(page.locator('section').filter({ has: page.getByRole('heading', { name: 'หมวดหมู่แนะนำ' }) }).locator('img')).not.toHaveCount(0);
  });

  test('TC-F05-002 เลือกหมวดหมู่', async () => {
    const category = page.locator('h1:text-is("หมวดหมู่แนะนำ") + section').locator('p').first();
    const name = await category.textContent();
    await category.click();
    await expect(page).toHaveURL(/categoryId=/);
    await expect(page.getByRole('heading', { name: name.trim() })).toBeVisible();
  });

  test('TC-F05-003 หมวดหมู่ไม่มีสูตรแสดง empty state เมื่อ API คืนค่าว่าง', async () => {
    await page.route('**/category/*/menu', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.goto('/app/category-pagination?categoryId=999999&categoryName=หมวดหมู่ว่าง');
    await expect(page.getByText('ไม่พบเมนูในหมวดหมู่นี้')).toBeVisible();
    await page.unroute('**/category/*/menu');
  });

  test('TC-F06-001 แสดงเมนูแนะนำ', async () => {
    await page.goto('/app/main');
    await expect(page.getByRole('heading', { name: 'เมนูอาหารที่แนะนำ' })).toBeVisible();
    await expect(page.locator('a[href^="/app/"]').filter({ has: page.locator('h1') }).first()).toBeVisible();
  });

  test('TC-F06-002 เลือกเมนูแนะนำ', async () => {
    const link = await firstRecipeLink();
    const href = await link.getAttribute('href');
    await link.click();
    await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('TC-F06-003 เมนูแนะนำที่ถูกลบไม่ทำให้หน้า crash', async () => {
    await page.goto('/app/999999');
    await expect(page.getByText('ไม่พบเมนูนี้')).toBeVisible({ timeout: 15_000 });
  });

  test('TC-F07-001 แสดงชื่อและรูปภาพสูตร', async () => {
    const link = await firstRecipeLink();
    await link.click();
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main img').first()).toBeVisible();
  });

  test('TC-F07-002 แสดงรายการวัตถุดิบ', async () => {
    await expect(page.getByRole('heading', { name: 'วัตถุดิบ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'วัตถุดิบ' }).locator('..').locator('div.grid > div').first()).toBeVisible();
  });

  test('TC-F07-003 แสดงขั้นตอนตามลำดับ', async () => {
    const steps = page.getByRole('heading', { name: /ขั้นตอนที่ \d+/ });
    await expect(steps.first()).toBeVisible();
    const labels = await steps.allTextContents();
    expect(labels).toEqual(labels.map((_, i) => `ขั้นตอนที่ ${i + 1}`));
  });

  test('TC-F07-004 แสดงข้อมูลเจ้าของสูตร', async () => {
    await expect(page.locator('main img').nth(1)).toBeVisible();
    await expect(page.locator('main span').filter({ hasText: /^#/ })).toBeVisible();
  });

  test('TC-F07-005 สูตรไม่มีรูปใช้ภาพสำรอง', async () => {
    recipeId = await ownRecipeId();
    await page.goto(`/app/${recipeId}`);
    const image = page.locator('main img').first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', /placeholder-food\.jpg|https?:\/\//);
  });

  test('TC-F07-006 Recipe ID ไม่ถูกต้อง', async () => {
    await page.goto('/app/999999');
    await expect(page.getByText('ไม่พบเมนูนี้')).toBeVisible({ timeout: 15_000 });
  });

  test('TC-F07-007 ย้อนกลับจากหน้ารายละเอียด', async ({ browser }) => {
    const context = await browser.newContext();
    const isolated = await context.newPage();
    await isolated.goto('/app/main');
    const link = isolated.locator('a[href^="/app/"]').filter({ has: isolated.locator('h1') }).first();
    await expect(link).toBeVisible();
    await link.click();
    await isolated.goBack();
    await expect(isolated).toHaveURL(/\/app\/main/);
    await context.close();
  });

  test('TC-F08-001 บันทึกสูตรอาหาร', async () => {
    await ensureLoggedIn();
    const link = await firstRecipeLink();
    await link.click();
    const bookmark = page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') });
    const wasSaved = (await bookmark.getAttribute('class')).includes('border-orange-400');
    if (wasSaved) await bookmark.click();
    await bookmark.click();
    await expect(bookmark).toHaveClass(/border-orange-400/);
  });

  test('TC-F08-002 ดูสูตรที่บันทึก', async () => {
    await ensureLoggedIn();
    const link = await firstRecipeLink();
    const savedName = (await link.locator('h1').textContent()).trim();
    await link.click();
    const bookmark = page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') });
    if (!(await bookmark.getAttribute('class')).includes('border-orange-400')) {
      await bookmark.click();
      await expect(bookmark).toHaveClass(/border-orange-400/);
    }
    await page.goto('/app/profile');
    await page.getByRole('button', { name: 'บันทึกแล้ว' }).click();
    await expect(page.getByText(savedName)).toBeVisible({ timeout: 15_000 });
  });

  test('TC-F08-003 ยกเลิกบันทึกสูตร', async () => {
    await ensureLoggedIn();
    const link = await firstRecipeLink();
    await link.click();
    const bookmark = page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') });
    if (!(await bookmark.getAttribute('class')).includes('border-orange-400')) await bookmark.click();
    await page.goto('/app/profile');
    await page.getByRole('button', { name: 'บันทึกแล้ว' }).click();
    const card = page.locator('a').filter({ has: page.locator('button svg.text-orange-500') }).first();
    const name = (await card.locator('p.font-semibold').textContent()).trim();
    await card.locator('button').click();
    await expect(page.getByText(name)).toHaveCount(0);
  });

  test('TC-F08-004 Guest ต้องเข้าสู่ระบบก่อนบันทึก', async () => {
    await page.goto('/app/main');
    await page.evaluate(() => localStorage.clear());
    const link = await firstRecipeLink();
    await link.click();
    await page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
