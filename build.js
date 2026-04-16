// build.js — The Friendly Spot
// Run: node build.js
// Reads _data/*.json + index.template.html → writes index.html

'use strict';

const fs = require('fs');

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Escape for HTML but allow pre-escaped &amp; &lt; etc. to pass through
function safe(str) {
  return String(str ?? '');
}

// ── Load data ─────────────────────────────────────────────────────────────────

const contact = JSON.parse(fs.readFileSync('_data/contact.json', 'utf8'));
const hours   = JSON.parse(fs.readFileSync('_data/hours.json', 'utf8'));
const social  = JSON.parse(fs.readFileSync('_data/social.json', 'utf8'));
const hero    = JSON.parse(fs.readFileSync('_data/hero.json', 'utf8'));
const about   = JSON.parse(fs.readFileSync('_data/about.json', 'utf8'));
const promo   = JSON.parse(fs.readFileSync('_data/promo.json', 'utf8'));
const food    = JSON.parse(fs.readFileSync('_data/menu-food.json', 'utf8'));
const sports  = JSON.parse(fs.readFileSync('_data/sports.json', 'utf8'));

// ── Build menu HTML ───────────────────────────────────────────────────────────

function buildMenuCategories(categories) {
  const revealClasses = ['reveal', 'reveal reveal-delay'];
  return categories.map((cat, i) => {
    const revClass = revealClasses[i % 2];
    const itemsHtml = cat.items.map(item => {
      const vegMark = item.veg ? ' <sup>V</sup>' : '';
      const descHtml = item.desc ? `<em>${safe(item.desc)}</em>` : '';
      return `        <div class="mi"><div class="mi-text"><b>${safe(item.name)}</b>${vegMark}${descHtml}</div><span>${esc(item.price)}</span></div>`;
    }).join('\n');

    const noteTop = cat.note ? `\n      <p class="cat-note-top">${safe(cat.note)}</p>` : '';
    const addons  = cat.addons ? `\n      <div class="add-ons">\n        <p>${safe(cat.addons)}</p>\n      </div>` : '';

    return `    <div class="menu-cat ${revClass}">
      <h3><span>${safe(cat.heading)}</span></h3>${noteTop}
      <div class="cat-items">
${itemsHtml}
      </div>${addons}
    </div>`;
  }).join('\n\n');
}

// ── Build about pills ─────────────────────────────────────────────────────────

function buildPills(pills) {
  return pills.map(p => `        <span class="pill">${safe(p)}</span>`).join('\n');
}

// ── Build sports items ────────────────────────────────────────────────────────

function buildSportsList(items) {
  return items.map(item => `      <li>${safe(item)}</li>`).join('\n');
}

// ── Read template and replace placeholders ────────────────────────────────────

let html = fs.readFileSync('index.template.html', 'utf8');

html = html
  // Contact
  .replace(/{{PHONE}}/g,        safe(contact.phone))
  .replace(/{{PHONE_RAW}}/g,    esc(contact.phone_raw))
  .replace(/{{EMAIL}}/g,        esc(contact.email))
  .replace(/{{ADDRESS_STREET}}/g, safe(contact.address_street))
  .replace(/{{ADDRESS_CITY}}/g,   safe(contact.address_city))

  // Hours
  .replace(/{{HOURS_MAIN}}/g,    safe(hours.main))
  .replace(/{{HOURS_KITCHEN}}/g, safe(hours.kitchen))
  .replace(/{{HOURS_BADGE}}/g,   safe(hours.badge))

  // Social
  .replace(/{{INSTAGRAM_URL}}/g,    esc(social.instagram))
  .replace(/{{INSTAGRAM_HANDLE}}/g, esc(social.instagram_handle))
  .replace(/{{FACEBOOK_URL}}/g,     esc(social.facebook))
  .replace(/{{MERCH_URL}}/g,        esc(social.merch))
  .replace(/{{ORDER_ONLINE_URL}}/g, esc(social.order_online))

  // Promo banner
  .replace(/{{PROMO_TEXT}}/g,      safe(promo.text))
  .replace(/{{PROMO_LINK_HREF}}/g, esc(promo.link_href))
  .replace(/{{PROMO_LINK_TEXT}}/g, safe(promo.link_text))

  // Hero
  .replace(/{{HERO_EYEBROW}}/g,         safe(hero.eyebrow))
  .replace(/{{HERO_LINE1}}/g,           safe(hero.headline_line1))
  .replace(/{{HERO_LINE2}}/g,           safe(hero.headline_line2))
  .replace(/{{HERO_LINE3}}/g,           safe(hero.headline_line3))
  .replace(/{{HERO_SUB}}/g,             safe(hero.sub))
  .replace(/{{STAT1_NUM}}/g,            safe(hero.stat1_num))
  .replace(/{{STAT1_LABEL}}/g,          safe(hero.stat1_label))
  .replace(/{{STAT2_NUM}}/g,            safe(hero.stat2_num))
  .replace(/{{STAT2_LABEL}}/g,          safe(hero.stat2_label))
  .replace(/{{STAT3_NUM}}/g,            safe(hero.stat3_num))
  .replace(/{{STAT3_LABEL}}/g,          safe(hero.stat3_label))
  .replace(/{{HERO_CTA_PRIMARY_TEXT}}/g, safe(hero.cta_primary_text))
  .replace(/{{HERO_CTA_PRIMARY_HREF}}/g, esc(hero.cta_primary_href))
  .replace(/{{HERO_CTA_GHOST_TEXT}}/g,   safe(hero.cta_ghost_text))
  .replace(/{{HERO_CTA_GHOST_HREF}}/g,   esc(hero.cta_ghost_href))

  // About
  .replace(/{{ABOUT_EYEBROW}}/g,  safe(about.eyebrow))
  .replace(/{{ABOUT_HEADING}}/g,  safe(about.heading))
  .replace(/{{ABOUT_BODY1}}/g,    safe(about.body1))
  .replace(/{{ABOUT_TAGLINE}}/g,  safe(about.tagline))
  .replace(/{{ABOUT_PILLS}}/g,    buildPills(about.pills))

  // Sports
  .replace(/{{SPORTS_EYEBROW}}/g, safe(sports.eyebrow))
  .replace(/{{SPORTS_HEADING}}/g, safe(sports.heading))
  .replace(/{{SPORTS_SUB}}/g,     safe(sports.sub))
  .replace(/{{SPORTS_ITEMS}}/g,   buildSportsList(sports.items))

  // Menu
  .replace(/{{MENU_CATEGORIES}}/g, buildMenuCategories(food.categories));

fs.writeFileSync('index.html', html);
console.log('✓ index.html built successfully');
