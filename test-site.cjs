const {chromium}=require('C:/Users/56348/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787');await page.waitForSelector('.days-grid');
 fs.mkdirSync('qa',{recursive:true});await page.screenshot({path:'qa/desktop-overview.png',fullPage:true});
 assert.equal(await page.locator('.day-card').count(),6);
 const integrity=await page.evaluate(()=>DAYS.map(d=>({date:d.date,events:d.events.length,problems:d.events.flatMap((e,i)=>{const a=stamp(d,e),b=stamp(d,e,true);return [...(b<a?[e.title+': negative duration']:[]),...(i&&a<stamp(d,d.events[i-1],true)?[e.title+': overlap']:[])];})})));
 assert.deepEqual(integrity.flatMap(d=>d.problems),[]);
 for(let i=0;i<6;i++){await page.goto('http://127.0.0.1:8787/#daily/'+i);await page.waitForSelector('.timeline');assert.ok(await page.locator('.event').count()>5);}
 await page.locator('[data-filter="food"]').click();assert.equal(await page.locator('.event').count(),2);
 await page.locator('[data-filter="all"]').click();await page.locator('.check').first().check();await page.reload();assert.equal(await page.locator('.check').first().isChecked(),true);
 await page.goto('http://127.0.0.1:8787/#kit');await page.locator('#private-address').fill('Test Private Address Hatch UT');await page.locator('#private-note').fill('<img src=x onerror=alert(1)>');await page.locator('[data-action="save-private"]').click();
 await page.locator('#rail-start').fill('2026-10-02T20:50');await page.locator('[data-action="save-private"]').click();assert.match(await page.locator('#rail-result').innerText(),/10\/03.*20:50/);
 await page.locator('#sim-day').selectOption('2');await page.locator('#sim-zone').selectOption('America/Denver');await page.locator('#sim-time').fill('14:40');await page.locator('[data-action="simulate"]').click();await page.waitForSelector('.event.current');assert.match(await page.locator('.event.current h3').innerText(),/Canyon Overlook/);
 await page.goto('http://127.0.0.1:8787/#stays');assert.equal(await page.locator('.hotel').count(),4);assert.ok((await page.locator('a[href*="maps/dir"]').all().then(async a=>Promise.all(a.map(n=>n.getAttribute('href'))))).some(u=>u.includes('Test%20Private')));
 await page.goto('http://127.0.0.1:8787/#kit');const downloadWait=page.waitForEvent('download');await page.locator('[data-action="offline"]').click();const dl=await downloadWait;await dl.saveAs('qa/offline.html');
 const off=await browser.newPage();off.on('pageerror',e=>errors.push('offline: '+e.message));await off.goto('file:///'+process.cwd().replace(/\\/g,'/')+'/qa/offline.html');await off.waitForSelector('.days-grid');assert.equal(await off.locator('.day-card').count(),6);
 await page.evaluate(()=>{localStorage.clear()});await page.reload();
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:8787/#overview');await page.screenshot({path:'qa/mobile-overview.png',fullPage:true});
 for(const hash of ['daily/2','daily/4','stays','kit']){await page.goto('http://127.0.0.1:8787/#'+hash);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'overflow on '+hash);}
 await page.goto('http://127.0.0.1:8787/#daily/2');await page.screenshot({path:'qa/mobile-daily.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8787/#daily/4');await page.screenshot({path:'qa/desktop-daily.png',fullPage:true});
 await page.evaluate(()=>{window.print=()=>{};printAll()});assert.equal(await page.locator('#print-root .print-day').count(),6);await page.emulateMedia({media:'print'});await page.pdf({path:'qa/itinerary-print.pdf',format:'A4',printBackground:true});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,days:integrity,errors,screenshots:'qa/',offline:'passed',print:'6 days'},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
