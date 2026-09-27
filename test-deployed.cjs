const {chromium}=require('C:/Users/56348/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  // Use an SSH tunnel to the site's actual Nginx/TLS listener. This does not
  // This does not prove public access while the host's ICP filing is blocked.
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage({viewport:{width:390,height:844},ignoreHTTPSErrors:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='https://127.0.0.1:9443/travel/us-west-lasvegas/';
  await page.goto(base+'#map');await page.waitForSelector('#route-svg');
  assert.equal(await page.locator('#route-svg .map-road').count(),8);
  await page.locator('.map-day-picker [data-map-day="6"]').click();
  assert.equal(await page.locator('.overview-route-day').count(),4);
  assert.ok(await page.locator('#route-svg .overview-road').count()>15);
  await page.locator('[data-map-variant="core"]').first().click();
  assert.equal(await page.locator('#route-svg .overview-road.backtrack').count(),1);
  await page.goto(base+'#daily/4');
  assert.match(await page.locator('.timeline').innerText(),/折返 Desert View/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.goto(base+'#kit');assert.ok(await page.locator('.kit-grid').count());
  assert.deepEqual(errors,[]);console.log('deployed Nginx tunnel smoke passed: HTTPS, map, day-6 branch, mobile, kit');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
