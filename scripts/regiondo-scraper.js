const puppeteer = require('puppeteer');
const fs = require('fs');

const REGIONDO_EMAIL = 'info@candletours.es';
const REGIONDO_PASSWORD = 'Damionline@3113';

async function scrapeRegiondo() {
  console.log('🚀 Iniciando scraper de Regiondo...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔐 Navegando al login de Regiondo...');
    await page.goto('https://login.regiondo.net/login?login_challenge=b3d7976ed2594bc5a9f44dbad4f615ec', { waitUntil: 'networkidle2' });
    
    await page.waitForTimeout(2000);
    
    console.log('✍️  Ingresando credenciales...');
    await page.waitForSelector('input[type="email"], input[type="text"], input[name="email"], input[name="username"]');
    
    await page.type('input[type="email"], input[type="text"], input[name="email"], input[name="username"]', REGIONDO_EMAIL, { delay: 100 });
    await page.type('input[type="password"], input[name="password"]', REGIONDO_PASSWORD, { delay: 100 });
    
    console.log('🔘 Click en login...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }),
      page.click('button[type="submit"]')
    ]);
    
    console.log('✅ Login exitoso!\n');
    
    // Ir a lista de productos
    console.log('📋 Navegando a productos...');
    await page.goto('https://www.regiondo.es/product/ticket', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'debug-products-list.png', fullPage: true });
    console.log('📸 Screenshot: debug-products-list.png\n');
    
    // Extraer URLs
    console.log('🔍 Buscando productos...');
    const productUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links
        .map(link => link.href)
        .filter(url => url.includes('product') && url.includes('edit'))
        .filter((url, index, self) => self.indexOf(url) === index);
    });
    
    console.log(`✅ Encontrados ${productUrls.length} productos\n`);
    
    if (productUrls.length > 0) {
      console.log('Primeros 5:');
      productUrls.slice(0, 5).forEach((url, i) => console.log(`   ${i+1}. ${url}`));
    }
    
    // Procesar 3 productos de prueba
    const products = [];
    for (let i = 0; i < Math.min(3, productUrls.length); i++) {
      console.log(`\n[${i+1}/3] ${productUrls[i]}`);
      
      await page.goto(productUrls[i], { waitUntil: 'networkidle2' });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `debug-product-${i}.png` });
      
      const data = await page.evaluate(() => {
        const get = (sel) => {
          const el = document.querySelector(sel);
          return el ? (el.value || el.textContent || '').trim() : '';
        };
        
        return {
          url: window.location.href,
          title: get('input[name*="title"]') || get('h1'),
          description: get('textarea'),
          price: get('input[name*="price"]'),
        };
      });
      
      products.push(data);
      console.log(`   ✓ ${data.title || 'Sin título'}`);
    }
    
    fs.writeFileSync('productos-regiondo.json', JSON.stringify(products, null, 2));
    console.log('\n💾 productos-regiondo.json guardado');
    console.log('✅ Completado!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
}

scrapeRegiondo();
