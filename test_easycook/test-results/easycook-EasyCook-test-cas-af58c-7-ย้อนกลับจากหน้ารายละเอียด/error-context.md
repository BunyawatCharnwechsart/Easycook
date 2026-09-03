# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: easycook.spec.js >> EasyCook test cases from Google Sheets >> TC-F07-007 ย้อนกลับจากหน้ารายละเอียด
- Location: tests\easycook.spec.js:280:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/app\/main/
Received string:  "about:blank"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html>…</html>
       - unexpected value "about:blank"

```

# Page snapshot

```yaml
- generic [ref=f26e2]:
  - alert [ref=f26e3]
  - generic [ref=f26e4]:
    - navigation [ref=f26e5]:
      - generic [ref=f26e6]:
        - link [ref=f26e8] [cursor=pointer]:
          - /url: /app/main
          - img "logoeasycook" [ref=f26e9]
        - list [ref=f26e10]:
          - link [ref=f26e11] [cursor=pointer]:
            - /url: /app/recipe
            - listitem [ref=f26e12]: เพิ่มสูตร
          - link [ref=f26e13] [cursor=pointer]:
            - /url: /app/category-pagination
            - listitem [ref=f26e14]: หมวดหมู่
          - link [ref=f26e15] [cursor=pointer]:
            - /url: /app/about
            - listitem [ref=f26e16]: เกี่ยวกับ
        - list [ref=f26e17]:
          - listitem [ref=f26e18]:
            - button [ref=f26e19]:
              - img "profile" [ref=f26e20] [cursor=pointer]
    - paragraph [ref=f26e22]: ไม่พบเมนูนี้
    - contentinfo [ref=f26e23]:
      - generic [ref=f26e24]:
        - img "logoFooter" [ref=f26e26]
        - generic [ref=f26e27]:
          - generic [ref=f26e28]:
            - heading "เกี่ยวกับเรา" [level=1] [ref=f26e29]
            - text: Easy cook เว็ปไซต์ที่ไกล้กว่าหน้าปากซอย เว็บไซต์ของเราเกิดขึ้นจากความตั้งใจที่จะรวบรวมสูตรอาหารหลากหลายรูปแบบไว้ในที่เดียว เพื่อให้ทุกคนสามารถเข้าถึงสูตรอาหารได้ง่าย ไม่ว่าจะเป็นเมนูอาหารไทย อาหารนานาชาติ ของหวาน หรือเมนูสุขภาพ ทุกสูตรถูกคัดสรรและเขียนขั้นตอนอย่างละเอียด เพื่อให้ผู้ใช้งานสามารถทำตามได้จริง
          - generic [ref=f26e30]:
            - heading "เงื่อนไขการให้บริการ" [level=1] [ref=f26e31]
            - heading "นโยบายความเป็นส่วนตัว" [level=1] [ref=f26e32]
            - heading "คำถามที่พบบ่อย" [level=1] [ref=f26e33]
        - generic [ref=f26e35]:
          - heading "ช่องทางติดต่อ" [level=2] [ref=f26e36]
          - generic [ref=f26e37]:
            - link [ref=f26e38] [cursor=pointer]:
              - /url: "#"
            - link [ref=f26e39] [cursor=pointer]:
              - /url: "#"
            - link [ref=f26e40] [cursor=pointer]:
              - /url: "#"
```

# Test source

```ts
  188 |   });
  189 | 
  190 |   test('TC-F04-003 ค้นหาเมนูที่ไม่มี', async () => {
  191 |     await page.goto('/app/main');
  192 |     await page.getByPlaceholder('ค้นหาเมนูอาหาร...').fill(`dtfgdfg-${runId}`);
  193 |     await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  194 |     await expect(page.getByText('ไม่พบเมนูที่ตรงกับการค้นหา')).toBeVisible({ timeout: 15_000 });
  195 |   });
  196 | 
  197 |   test('TC-F04-004 ค้นหาด้วยช่องว่าง', async () => {
  198 |     await page.goto('/app/main');
  199 |     await page.getByPlaceholder('ค้นหาเมนูอาหาร...').fill('   ');
  200 |     await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  201 |     await expect(page).toHaveURL(/\/app\/main$/);
  202 |   });
  203 | 
  204 |   test('TC-F05-001 แสดงหมวดหมู่แนะนำ', async () => {
  205 |     await page.goto('/app/main');
  206 |     await expect(page.getByRole('heading', { name: 'หมวดหมู่แนะนำ' })).toBeVisible();
  207 |     await expect(page.locator('section').filter({ has: page.getByRole('heading', { name: 'หมวดหมู่แนะนำ' }) }).locator('img')).not.toHaveCount(0);
  208 |   });
  209 | 
  210 |   test('TC-F05-002 เลือกหมวดหมู่', async () => {
  211 |     const category = page.locator('h1:text-is("หมวดหมู่แนะนำ") + section').locator('p').first();
  212 |     const name = await category.textContent();
  213 |     await category.click();
  214 |     await expect(page).toHaveURL(/categoryId=/);
  215 |     await expect(page.getByRole('heading', { name: name.trim() })).toBeVisible();
  216 |   });
  217 | 
  218 |   test('TC-F05-003 หมวดหมู่ไม่มีสูตรแสดง empty state เมื่อ API คืนค่าว่าง', async () => {
  219 |     await page.route('**/category/*/menu', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  220 |     await page.goto('/app/category-pagination?categoryId=999999&categoryName=หมวดหมู่ว่าง');
  221 |     await expect(page.getByText('ไม่พบเมนูในหมวดหมู่นี้')).toBeVisible();
  222 |     await page.unroute('**/category/*/menu');
  223 |   });
  224 | 
  225 |   test('TC-F06-001 แสดงเมนูแนะนำ', async () => {
  226 |     await page.goto('/app/main');
  227 |     await expect(page.getByRole('heading', { name: 'เมนูอาหารที่แนะนำ' })).toBeVisible();
  228 |     await expect(page.locator('a[href^="/app/"]').filter({ has: page.locator('h1') }).first()).toBeVisible();
  229 |   });
  230 | 
  231 |   test('TC-F06-002 เลือกเมนูแนะนำ', async () => {
  232 |     const link = await firstRecipeLink();
  233 |     const href = await link.getAttribute('href');
  234 |     await link.click();
  235 |     await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  236 |   });
  237 | 
  238 |   test('TC-F06-003 เมนูแนะนำที่ถูกลบไม่ทำให้หน้า crash', async () => {
  239 |     await page.goto('/app/999999');
  240 |     await expect(page.getByText('ไม่พบเมนูนี้')).toBeVisible({ timeout: 15_000 });
  241 |   });
  242 | 
  243 |   test('TC-F07-001 แสดงชื่อและรูปภาพสูตร', async () => {
  244 |     const link = await firstRecipeLink();
  245 |     await link.click();
  246 |     await expect(page.locator('main h1')).toBeVisible();
  247 |     await expect(page.locator('main img').first()).toBeVisible();
  248 |   });
  249 | 
  250 |   test('TC-F07-002 แสดงรายการวัตถุดิบ', async () => {
  251 |     await expect(page.getByRole('heading', { name: 'วัตถุดิบ' })).toBeVisible();
  252 |     await expect(page.getByRole('heading', { name: 'วัตถุดิบ' }).locator('..').locator('div.grid > div').first()).toBeVisible();
  253 |   });
  254 | 
  255 |   test('TC-F07-003 แสดงขั้นตอนตามลำดับ', async () => {
  256 |     const steps = page.getByRole('heading', { name: /ขั้นตอนที่ \d+/ });
  257 |     await expect(steps.first()).toBeVisible();
  258 |     const labels = await steps.allTextContents();
  259 |     expect(labels).toEqual(labels.map((_, i) => `ขั้นตอนที่ ${i + 1}`));
  260 |   });
  261 | 
  262 |   test('TC-F07-004 แสดงข้อมูลเจ้าของสูตร', async () => {
  263 |     await expect(page.locator('main img').nth(1)).toBeVisible();
  264 |     await expect(page.locator('main span').filter({ hasText: /^#/ })).toBeVisible();
  265 |   });
  266 | 
  267 |   test('TC-F07-005 สูตรไม่มีรูปใช้ภาพสำรอง', async () => {
  268 |     recipeId = await ownRecipeId();
  269 |     await page.goto(`/app/${recipeId}`);
  270 |     const image = page.locator('main img').first();
  271 |     await expect(image).toBeVisible();
  272 |     await expect(image).toHaveAttribute('src', /placeholder-food\.jpg|https?:\/\//);
  273 |   });
  274 | 
  275 |   test('TC-F07-006 Recipe ID ไม่ถูกต้อง', async () => {
  276 |     await page.goto('/app/999999');
  277 |     await expect(page.getByText('ไม่พบเมนูนี้')).toBeVisible({ timeout: 15_000 });
  278 |   });
  279 | 
  280 |   test('TC-F07-007 ย้อนกลับจากหน้ารายละเอียด', async ({ browser }) => {
  281 |     const context = await browser.newContext();
  282 |     const isolated = await context.newPage();
  283 |     await isolated.goto('/app/main');
  284 |     const link = isolated.locator('a[href^="/app/"]').filter({ has: isolated.locator('h1') }).first();
  285 |     await expect(link).toBeVisible();
  286 |     await link.click();
  287 |     await isolated.goBack();
> 288 |     await expect(isolated).toHaveURL(/\/app\/main/);
      |                            ^ Error: expect(page).toHaveURL(expected) failed
  289 |     await context.close();
  290 |   });
  291 | 
  292 |   test('TC-F08-001 บันทึกสูตรอาหาร', async () => {
  293 |     await ensureLoggedIn();
  294 |     const link = await firstRecipeLink();
  295 |     await link.click();
  296 |     const bookmark = page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') });
  297 |     const wasSaved = (await bookmark.getAttribute('class')).includes('border-orange-400');
  298 |     if (wasSaved) await bookmark.click();
  299 |     await bookmark.click();
  300 |     await expect(bookmark).toHaveClass(/border-orange-400/);
  301 |   });
  302 | 
  303 |   test('TC-F08-002 ดูสูตรที่บันทึก', async () => {
  304 |     await ensureLoggedIn();
  305 |     const link = await firstRecipeLink();
  306 |     const savedName = (await link.locator('h1').textContent()).trim();
  307 |     await link.click();
  308 |     const bookmark = page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') });
  309 |     if (!(await bookmark.getAttribute('class')).includes('border-orange-400')) {
  310 |       await bookmark.click();
  311 |       await expect(bookmark).toHaveClass(/border-orange-400/);
  312 |     }
  313 |     await page.goto('/app/profile');
  314 |     await page.getByRole('button', { name: 'บันทึกแล้ว' }).click();
  315 |     await expect(page.getByText(savedName)).toBeVisible({ timeout: 15_000 });
  316 |   });
  317 | 
  318 |   test('TC-F08-003 ยกเลิกบันทึกสูตร', async () => {
  319 |     await ensureLoggedIn();
  320 |     const link = await firstRecipeLink();
  321 |     await link.click();
  322 |     const bookmark = page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') });
  323 |     if (!(await bookmark.getAttribute('class')).includes('border-orange-400')) await bookmark.click();
  324 |     await page.goto('/app/profile');
  325 |     await page.getByRole('button', { name: 'บันทึกแล้ว' }).click();
  326 |     const card = page.locator('a').filter({ has: page.locator('button svg.text-orange-500') }).first();
  327 |     const name = (await card.locator('p.font-semibold').textContent()).trim();
  328 |     await card.locator('button').click();
  329 |     await expect(page.getByText(name)).toHaveCount(0);
  330 |   });
  331 | 
  332 |   test('TC-F08-004 Guest ต้องเข้าสู่ระบบก่อนบันทึก', async () => {
  333 |     await page.goto('/app/main');
  334 |     await page.evaluate(() => localStorage.clear());
  335 |     const link = await firstRecipeLink();
  336 |     await link.click();
  337 |     await page.locator('main button').filter({ has: page.locator('svg path[d^="M19 21"]') }).click();
  338 |     await expect(page).toHaveURL(/\/auth\/login/);
  339 |   });
  340 | });
  341 | 
```