import { useState, useEffect, useRef } from 'react'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CATEGORIES
//  To add a new category: add an entry here. That's it.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CATEGORIES = [
  { id: 'rice',       label: 'Rice, Spaghetti & Grains',      description: 'Rice, spaghetti, noodles & grains' },
  { id: 'oil',        label: 'Cooking Oil',                   description: 'Vegetable oil, palm oil & blended oils' },
  { id: 'canned',     label: 'Canned Fish & Tin Tomatoes',    description: 'Mackerel, sardines, baked beans, corned beef & more' },
  { id: 'provisions', label: 'Provisions',                    description: 'Milk, Milo, cereals, sugar, biscuits, water & everyday essentials' },
  { id: 'frozen',     label: 'Frozen Foods',                  description: 'Frozen chicken, fish & meats' },
  { id: 'cleaning',   label: 'Detergents',                    description: 'Washing powder, soaps, disinfectants & cleaning products' },
  { id: 'fresh',      label: 'Vegetables',                    description: 'Fresh vegetables, fruits & produce' },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PRODUCTS
//  To add a product: add one object to this array.
//  Fields: id (unique number), name, cat (must match a CATEGORIES id above),
//          price, oldPrice, unit, emoji (fallback), img (optional — put file
//          in public/images/ and set img: '/images/filename.png')
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PRODUCTS = [
  // ── BREAKFAST ESSENTIALS ──────────────────────────────────────────────────
  { id: 801, name: 'Milo 400g Tin',                cat: 'provisions',  price: 55,  oldPrice: 70,  unit: 'tin',     img: '/images/Milo-Antigen-E-400g-405x330.jpg' },
  { id: 813, name: 'Milo 200g Sachet',             cat: 'provisions',  price: 28,  oldPrice: 36,  unit: 'sachet',  img: '/images/Milo-200g-1-405x330.jpg' },
  { id: 802, name: 'Peak Full Cream Milk 1L',      cat: 'provisions',  price: 32,  oldPrice: 42,  unit: 'pack',    img: '/images/PEAK-405x330.jpg' },
  { id: 803, name: 'Ideal Evaporated Milk 160g',   cat: 'provisions',  price: 14,  oldPrice: 18,  unit: 'tin',     img: '/images/IDEAL-ORIGINAL-EVAPORATED-MILK-160G-405x330.jpg' },
  { id: 804, name: 'Carnation Tea Creamer 160g',   cat: 'provisions',  price: 16,  oldPrice: 22,  unit: 'tin',     img: '/images/CARNATION-TEA-CREAMER-160G-405x330.jpg' },
  { id: 807, name: 'Good Morning White Oats 500g', cat: 'provisions',  price: 28,  oldPrice: 36,  unit: 'pack',    img: '/images/Good-Morning-Oats-500g-405x330.jpg' },
  { id: 814, name: 'Kellogg\'s Corn Flakes',       cat: 'provisions',  price: 65,  oldPrice: 82,  unit: 'box',     img: '/images/cornflakes.jpg' },
  { id: 815, name: 'Weetabix Family Pack ×48',     cat: 'provisions',  price: 85,  oldPrice: 105, unit: 'box',     img: '/images/1-350x330.jpeg', tag: 'Value' },
  { id: 816, name: 'Givite Tombrown Porridge',     cat: 'provisions',  price: 35,  oldPrice: 45,  unit: 'jar',     img: '/images/Givite-Tombrown-Big-Size-405x330.jpeg', tag: 'Local' },

  // ── CANNED PRODUCTS ───────────────────────────────────────────────────────
  { id: 401, name: 'Titus Sardines 125g ×12',      cat: 'canned',     price: 80,  oldPrice: 100, unit: 'carton',  img: '/images/titus-sardines.png' },
  { id: 402, name: 'Titus Sardines 125g',          cat: 'canned',     price: 8,   oldPrice: 11,  unit: 'tin',     img: '/images/titus-sardines.png' },
  { id: 403, name: 'Geisha Mackerel 155g ×12',     cat: 'canned',     price: 85,  oldPrice: 108, unit: 'carton',  emoji: '🐟', tag: 'Bulk' },
  { id: 404, name: 'Geisha Mackerel 155g',         cat: 'canned',     price: 9,   oldPrice: 12,  unit: 'tin',     emoji: '🐟' },
  { id: 405, name: 'Lucky Star Pilchards 400g ×12',cat: 'canned',     price: 120, oldPrice: 148, unit: 'carton',  emoji: '🐟' },
  { id: 406, name: 'Heinz Baked Beans 415g ×6',    cat: 'canned',     price: 95,  oldPrice: 118, unit: 'carton',  emoji: '🫘', tag: 'Value' },
  { id: 407, name: 'Heinz Baked Beans 415g',       cat: 'canned',     price: 18,  oldPrice: 24,  unit: 'tin',     emoji: '🫘' },
  { id: 408, name: 'Black-Eyed Beans 400g',        cat: 'canned',     price: 15,  oldPrice: 20,  unit: 'pack',    img: '/images/black-eyed-beans-405x330.jpg', tag: 'Local' },
  { id: 410, name: 'Devon Corned Beef 340g ×6',    cat: 'canned',     price: 95,  oldPrice: 118, unit: 'carton',  emoji: '🥩' },

  // ── COOKING OILS & SPREADS ────────────────────────────────────────────────
  { id: 201, name: 'Frytol Vegetable Oil 5L',      cat: 'oil',        price: 110, oldPrice: 138, unit: 'bottle',  img: '/images/frytol-oil.png', tag: 'Popular' },
  { id: 202, name: 'Frytol Vegetable Oil 2L',      cat: 'oil',        price: 52,  oldPrice: 65,  unit: 'bottle',  img: '/images/frytol-oil.png' },
  { id: 203, name: 'Frytol Vegetable Oil 1L',      cat: 'oil',        price: 30,  oldPrice: 38,  unit: 'bottle',  img: '/images/frytol-oil.png' },
  { id: 205, name: 'Palm Oil 1L',                  cat: 'oil',        price: 22,  oldPrice: 30,  unit: 'bottle',  img: '/images/palm-oil.jpeg' },
  { id: 206, name: 'Palm Oil 3 × 1L',             cat: 'oil',        price: 62,  oldPrice: 82,  unit: 'set',     img: '/images/palm-oil.jpeg', tag: 'Value' },

  // ── GHANA FOOD (local staples) ────────────────────────────────────────────
  { id: 901, name: 'Corn Dough 2kg',               cat: 'foodstuffs', price: 20,  oldPrice: 26,  unit: 'pack',    img: '/images/Corn-dough.jpg', tag: 'Local' },
  { id: 902, name: 'Corn Dough 5kg',               cat: 'foodstuffs', price: 45,  oldPrice: 58,  unit: 'pack',    img: '/images/Corn-dough.jpg', tag: 'Local' },
  { id: 903, name: 'Cassava Powder (Fufu) 5kg',    cat: 'foodstuffs', price: 42,  oldPrice: 54,  unit: 'bag',     emoji: '🫙', tag: 'Local' },
  { id: 904, name: 'Cassava Powder (Fufu) 2kg',    cat: 'foodstuffs', price: 20,  oldPrice: 26,  unit: 'bag',     emoji: '🫙', tag: 'Local' },
  { id: 905, name: 'Onions (Bag) 10kg',            cat: 'foodstuffs', price: 55,  oldPrice: 70,  unit: 'bag',     emoji: '🧅' },
  { id: 906, name: 'Onions (Bag) 5kg',             cat: 'foodstuffs', price: 30,  oldPrice: 38,  unit: 'bag',     emoji: '🧅' },
  { id: 907, name: 'Gari (Fine) 5kg',              cat: 'foodstuffs', price: 35,  oldPrice: 45,  unit: 'bag',     img: '/images/gari.jpg', tag: 'Local' },
  { id: 908, name: 'Koose Mix 120g',               cat: 'foodstuffs', price: 12,  oldPrice: 16,  unit: 'pack',    img: '/images/WhatsApp-Image-2020-08-25-at-1_37_45-PM-405x330.jpeg', tag: 'Local' },
  { id: 909, name: 'Groundnut (Peanuts) 2kg',      cat: 'foodstuffs', price: 25,  oldPrice: 32,  unit: 'bag',     emoji: '🥜' },
  { id: 910, name: 'Brown Rice 5kg',               cat: 'foodstuffs', price: 55,  oldPrice: 70,  unit: 'bag',     img: '/images/brown-rice-1.jpg', tag: 'Local' },

  // ── HOUSEHOLD & CLEANING ──────────────────────────────────────────────────
  { id: 701, name: 'Madar Washing Powder 180g',    cat: 'cleaning',   price: 8,   oldPrice: 12,  unit: 'pack',    img: '/images/Madar-Washing-Powder-180g-405x330.jpg' },
  { id: 702, name: 'Madar Washing Powder ×10',     cat: 'cleaning',   price: 72,  oldPrice: 95,  unit: 'carton',  img: '/images/Madar-Washing-Powder-180g-405x330.jpg', tag: 'Bulk' },
  { id: 703, name: 'Madar Multipurpose Soap',      cat: 'cleaning',   price: 12,  oldPrice: 16,  unit: 'bar',     img: '/images/Madar-Soap-Large-Size-405x330.png' },
  { id: 704, name: 'Camel Antiseptic 500ml',       cat: 'cleaning',   price: 38,  oldPrice: 50,  unit: 'bottle',  img: '/images/Camel-Antiseptic-Liquid-Zesty-Lime-Fresh-405x330.png' },
  { id: 705, name: 'Morning Fresh Dishwash 750ml', cat: 'cleaning',   price: 32,  oldPrice: 42,  unit: 'bottle',  img: '/images/Morning-Fresh-Dishwash-750ml-405x330.jpg' },
  { id: 706, name: 'Sunlight Dishwash 750ml',      cat: 'cleaning',   price: 28,  oldPrice: 36,  unit: 'bottle',  img: '/images/sunlight-750ml-dishwashing-liquid-soap-with-real-lemon-juice.jpg' },
  { id: 707, name: 'Power Zone Bleach',            cat: 'cleaning',   price: 22,  oldPrice: 30,  unit: 'bottle',  img: '/images/power-zone-405x330.jpg' },
  { id: 708, name: 'Glade Air Freshener',          cat: 'cleaning',   price: 35,  oldPrice: 45,  unit: 'can',     img: '/images/glade.jpg' },
  { id: 709, name: 'Pride Toilet Tissue ×10',      cat: 'cleaning',   price: 38,  oldPrice: 50,  unit: 'pack',    img: '/images/WhatsApp-Image-2021-05-14-at-14_38_21-405x330.jpeg' },
  { id: 710, name: 'Jumbo Multi-Purpose Towel',    cat: 'cleaning',   price: 18,  oldPrice: 24,  unit: 'roll',    img: '/images/jumbo-405x330.jpg' },

  // ── FROZEN ────────────────────────────────────────────────────────────────
  { id: 601, name: 'Frozen Chicken Thighs 2kg',    cat: 'frozen',     price: 95,  oldPrice: 118, unit: 'pack',    img: '/images/Chicken-thigh.jpeg', tag: 'Frozen' },
  { id: 602, name: 'Frozen Chicken Wings 2kg',     cat: 'frozen',     price: 88,  oldPrice: 108, unit: 'pack',    img: '/images/chicken-wings.jpeg', tag: 'Frozen' },
  { id: 603, name: 'Frozen Drumsticks 3kg',        cat: 'frozen',     price: 120, oldPrice: 148, unit: 'pack',    img: '/images/drumstick.jpeg', tag: 'Frozen' },
  { id: 604, name: 'Chicken Gizzards 1kg',         cat: 'frozen',     price: 45,  oldPrice: 58,  unit: 'pack',    img: '/images/gizzard.jpeg', tag: 'Frozen' },
  { id: 605, name: 'Sadia Chicken Sausages ×3',    cat: 'frozen',     price: 55,  oldPrice: 70,  unit: 'pack',    img: '/images/sausage.jpg', tag: 'Frozen' },
  { id: 606, name: 'Frozen Tilapia 2kg',           cat: 'frozen',     price: 75,  oldPrice: 95,  unit: 'pack',    emoji: '🐟', tag: 'Frozen' },
  { id: 607, name: 'Frozen Beef Pieces 2kg',       cat: 'frozen',     price: 110, oldPrice: 138, unit: 'pack',    emoji: '🥩', tag: 'Frozen' },

  // ── FRESH FOOD ────────────────────────────────────────────────────────────
  { id: 1001, name: 'Fresh Tomatoes 1kg',          cat: 'fresh',      price: 12,  oldPrice: 16,  unit: 'kg',      img: '/images/0003285_maxmart-tomatoes.jpeg' },
  { id: 1007, name: 'Lettuce',                     cat: 'fresh',      price: 12,  oldPrice: 16,  unit: 'kg',      img: '/images/0004522_maxmart-lettuce_360.jpeg' },
  { id: 1002, name: 'Fresh Onions 1kg',            cat: 'fresh',      price: 10,  oldPrice: 14,  unit: 'kg',      img: '/images/007398_eden-tree-onion-local-kg-00087_510.jpeg' },
  { id: 1003, name: 'Fresh Pepper Assorted 500g',  cat: 'fresh',      price: 15,  oldPrice: 20,  unit: 'pack',    img: '/images/0014075_maxmart-redyellow-bell-pepper-kg_360.jpeg' },
  { id: 1004, name: 'Fresh Garden Eggs 500g',      cat: 'fresh',      price: 12,  oldPrice: 16,  unit: 'pack',    emoji: '🍆', tag: 'Local' },
  { id: 1005, name: 'Plantains (bunch)',            cat: 'fresh',      price: 25,  oldPrice: 32,  unit: 'bunch',   img: '/images/0018390_stella-plantain-kg.jpeg', tag: 'Local' },
  { id: 1006, name: 'Yam Tuber (medium)',           cat: 'fresh',      price: 30,  oldPrice: 38,  unit: 'tuber',   emoji: '🍠', tag: 'Local' },

  // ── RICE, PASTA & GRAINS ──────────────────────────────────────────────────
  // ── RICE, SPAGHETTI & GRAINS ──────────────────────────────────────────────
  // ↓ Prices from stock list. Quantity = 1 BAG per item.
  { id: 101, name: 'Royal Aroma Rice 25kg (5*5)',            cat: 'rice', price: 400, oldPrice: 440, unit: 'bag',    img: '/images/royal.jpg',                tag: 'In Stock' },
  { id: 109, name: 'Millicent Fragrant Rice 25kg (5*5)',     cat: 'rice', price: 405, oldPrice: 445, unit: 'bag',    img: '/images/Millicent-Rice-25kg_R.jpg', tag: 'In Stock' },
  { id: 112, name: 'Everest Viet Rice (Yellow) 5×5',        cat: 'rice', price: 400, oldPrice: 440, unit: 'bag',    emoji: '🌾',                              tag: 'In Stock' },
  { id: 113, name: 'Ginny Viet Rice 5×5',                   cat: 'rice', price: 330, oldPrice: 370, unit: 'bag',    emoji: '🌾',                              tag: 'In Stock' },
  { id: 114, name: 'Ginny Gold Thai Rice 5×5',              cat: 'rice', price: 595, oldPrice: 650, unit: 'bag',    emoji: '🌾',                              tag: 'Premium' },
  { id: 115, name: 'Everest Thai Holm Rice 25kg (5*5) Red', cat: 'rice', price: 720, oldPrice: 780, unit: 'bag',    emoji: '🌾',                              tag: 'Premium' },
  { id: 301, name: 'Spaghetti Big Size 400g ×20',     cat: 'rice', price: 150, oldPrice: 175, unit: 'half box', img: '/images/Oba-Spagetti-405x330.jpg', tag: 'In Stock' },

  // ── COOKING OIL ───────────────────────────────────────────────────────────
  { id: 201, name: 'Frytol/Sunflower Oil 1L',          cat: 'oil', price: 40,  oldPrice: 50,  unit: 'bottle', img: '/images/frytol-oil.png',  tag: 'In Stock' },
  { id: 202, name: 'Sunflower Oil 5L',                 cat: 'oil', price: 180, oldPrice: 210, unit: 'gallon', img: '/images/frytol-oil.png',  tag: 'In Stock' },

  // ── CANNED FISH & TIN TOMATOES ────────────────────────────────────────────
  { id: 401, name: 'Tasty Tom Tomato 210g ×24',       cat: 'canned', price: 230, oldPrice: 265, unit: 'half box (12pc)', img: '/images/0005393_tasty-tom-tomato-paste-400g_510.jpeg', tag: 'In Stock' },
  { id: 402, name: 'Rosa/Hondi Tomato 2.2kg ×6',      cat: 'canned', price: 45,  oldPrice: 55,  unit: '2 pcs',          img: '/images/gino-tomato-paste.png', tag: 'In Stock' },
  { id: 403, name: 'Mackerel 420g ×24',               cat: 'canned', price: 420, oldPrice: 470, unit: 'quarter box (6pcs)',  img: '/images/titus-sardines.png', tag: 'In Stock' },
  { id: 404, name: 'Mackerel 155g ×50',               cat: 'canned', price: 430, oldPrice: 480, unit: 'quarter box (12pcs)', img: '/images/titus-sardines.png', tag: 'In Stock' },
  { id: 405, name: 'Sardine ×50',                     cat: 'canned', price: 430, oldPrice: 480, unit: 'quarter box (12pcs)', img: '/images/titus-sardines.png', tag: 'In Stock' },

  // ── FROZEN FOODS ──────────────────────────────────────────────────────────
  { id: 601, name: 'Frozen Chicken Thigh 10kg (Hard)', cat: 'frozen', price: 435, oldPrice: 480, unit: 'full box', img: '/images/Chicken-thigh.jpeg', tag: 'Frozen' },
  { id: 602, name: 'Frozen Chicken Thigh 10kg (Soft)', cat: 'frozen', price: 370, oldPrice: 415, unit: 'full box', img: '/images/Chicken-thigh.jpeg', tag: 'Frozen' },
  { id: 603, name: 'Frozen Drumsticks 3kg',            cat: 'frozen', price: 120, oldPrice: 148, unit: 'pack',     img: '/images/drumstick.jpeg',     tag: 'Frozen' },
  { id: 604, name: 'Frozen Chicken Wings 2kg',         cat: 'frozen', price: 88,  oldPrice: 108, unit: 'pack',     img: '/images/chicken-wings.jpeg', tag: 'Frozen' },
]

const MIN_ORDER = 549

const PACKAGE_OPTIONS = [
  'ABUSUA ASOMDWEE (GHC549–GHC579)',
  'MEDAASE ME DƆ (GHC769–GHC858)',
  'YOU DO ALL (GHC1,099–GHC1,129)',
  'SUPER LOVE (GHC1,299–GHC1,350)',
  'SUPER LOVE GYE WO TWO (GHC1,890)',
  'CUSTOMIZED REQUEST (Call/WhatsApp 0244854206)',
]

const FIXED_PACKAGES = [
  {
    id: 'abusua',
    name: 'Abusua Asomdwee',
    tagline: 'Perfect for individuals & small families',
    price: 'GH₵549–579',
    monthly: 'GH₵193/mo',
    tag: 'Starter',
    popular: false,
    items: [
      { productId: 102, qty: 1,  label: 'Royal Feast Rice 10kg',        emoji: '🌾', img: '/images/royal-feast-rice.png' },
      { productId: 202, qty: 1,  label: 'Frytol Vegetable Oil 2L',      emoji: '🫙', img: '/images/frytol-oil.png' },
      { productId: 502, qty: 6,  label: 'Gino Tomato Paste 70g',        emoji: '🍅', img: '/images/gino-tomato-paste.png' },
      { productId: 401, qty: 1,  label: 'Titus Sardines 125g ×12',      emoji: '🐟', img: '/images/titus-sardines.png' },
      { productId: 901, qty: 1,  label: 'Maize Flour 5kg',              emoji: '🌽' },
    ],
  },
  {
    id: 'medaase',
    name: 'Medaase Me Dɔ',
    tagline: 'Great value for medium households',
    price: 'GH₵769–858',
    monthly: 'GH₵286/mo',
    tag: 'Popular',
    popular: true,
    items: [
      { productId: 101, qty: 1,  label: 'Royal Feast Rice 25kg',        emoji: '🌾', img: '/images/royal-feast-rice.png' },
      { productId: 201, qty: 1,  label: 'Frytol Vegetable Oil 5L',      emoji: '🫙', img: '/images/frytol-oil.png' },
      { productId: 501, qty: 1,  label: 'Gino Tomato Paste 400g ×6',   emoji: '🍅', img: '/images/gino-tomato-paste.png' },
      { productId: 403, qty: 1,  label: 'Geisha Mackerel 155g ×12',    emoji: '🐟' },
      { productId: 601, qty: 1,  label: 'Frozen Chicken Legs 2kg',      emoji: '🍗' },
      { productId: 302, qty: 2,  label: 'OBA Spaghetti 500g',           emoji: '🍝' },
    ],
  },
  {
    id: 'youdo',
    name: 'You Do All',
    tagline: 'Complete grocery bundle for the whole family',
    price: 'GH₵1,099–1,129',
    monthly: 'GH₵376/mo',
    tag: 'Family',
    popular: false,
    items: [
      { productId: 101, qty: 1,  label: 'Royal Feast Rice 25kg',        emoji: '🌾', img: '/images/royal-feast-rice.png' },
      { productId: 201, qty: 1,  label: 'Frytol Vegetable Oil 5L',      emoji: '🫙', img: '/images/frytol-oil.png' },
      { productId: 501, qty: 1,  label: 'Gino Tomato Paste 400g ×6',   emoji: '🍅', img: '/images/gino-tomato-paste.png' },
      { productId: 403, qty: 1,  label: 'Geisha Mackerel 155g ×12',    emoji: '🐟' },
      { productId: 401, qty: 1,  label: 'Titus Sardines 125g ×12',      emoji: '🐟', img: '/images/titus-sardines.png' },
      { productId: 601, qty: 1,  label: 'Frozen Chicken Legs 2kg',      emoji: '🍗' },
      { productId: 701, qty: 1,  label: "Mama's Choice Detergent 5kg",  emoji: '🧺' },
      { productId: 406, qty: 1,  label: 'Heinz Baked Beans 415g ×6',   emoji: '🫘' },
    ],
  },
  {
    id: 'superlove',
    name: 'Super Love',
    tagline: 'For families that want the very best',
    price: 'GH₵1,299–1,350',
    monthly: 'GH₵450/mo',
    tag: 'Premium',
    popular: false,
    items: [
      { productId: 101, qty: 1,  label: 'Royal Feast Rice 25kg',        emoji: '🌾', img: '/images/royal-feast-rice.png' },
      { productId: 201, qty: 1,  label: 'Frytol Vegetable Oil 5L',      emoji: '🫙', img: '/images/frytol-oil.png' },
      { productId: 501, qty: 1,  label: 'Gino Tomato Paste 400g ×6',   emoji: '🍅', img: '/images/gino-tomato-paste.png' },
      { productId: 403, qty: 1,  label: 'Geisha Mackerel 155g ×12',    emoji: '🐟' },
      { productId: 401, qty: 1,  label: 'Titus Sardines 125g ×12',      emoji: '🐟', img: '/images/titus-sardines.png' },
      { productId: 603, qty: 1,  label: 'Frozen Drumsticks 3kg',        emoji: '🍗' },
      { productId: 701, qty: 1,  label: "Mama's Choice Detergent 5kg",  emoji: '🧺' },
      { productId: 703, qty: 1,  label: 'Omo Washing Powder 2kg',       emoji: '🫧' },
      { productId: 801, qty: 1,  label: 'Milo 400g',                    emoji: '🍫' },
      { productId: 903, qty: 1,  label: 'Cassava Powder (Fufu) 5kg',    emoji: '🫙' },
    ],
  },
  {
    id: 'superlovegye',
    name: 'Super Love Gye Wo Two',
    tagline: 'The full abundance package — nothing left out',
    price: 'GH₵1,890',
    monthly: 'GH₵630/mo',
    tag: 'Ultimate',
    popular: false,
    items: [
      { productId: 101, qty: 1,  label: 'Royal Feast Rice 25kg',        emoji: '🌾', img: '/images/royal-feast-rice.png' },
      { productId: 201, qty: 2,  label: 'Frytol Vegetable Oil 5L',      emoji: '🫙', img: '/images/frytol-oil.png' },
      { productId: 501, qty: 2,  label: 'Gino Tomato Paste 400g ×6',   emoji: '🍅', img: '/images/gino-tomato-paste.png' },
      { productId: 403, qty: 1,  label: 'Geisha Mackerel 155g ×12',    emoji: '🐟' },
      { productId: 401, qty: 1,  label: 'Titus Sardines 125g ×12',      emoji: '🐟', img: '/images/titus-sardines.png' },
      { productId: 406, qty: 1,  label: 'Heinz Baked Beans 415g ×6',   emoji: '🫘' },
      { productId: 603, qty: 1,  label: 'Frozen Drumsticks 3kg',        emoji: '🍗' },
      { productId: 604, qty: 1,  label: 'Frozen Whole Chicken 2kg',     emoji: '🐔' },
      { productId: 701, qty: 1,  label: "Mama's Choice Detergent 5kg",  emoji: '🧺' },
      { productId: 703, qty: 1,  label: 'Omo Washing Powder 2kg',       emoji: '🫧' },
      { productId: 705, qty: 1,  label: 'Dettol Antiseptic 500ml',      emoji: '🧴' },
      { productId: 801, qty: 1,  label: 'Milo 400g',                    emoji: '🍫' },
      { productId: 802, qty: 1,  label: 'Dano Full Cream Milk 400g',    emoji: '🥛' },
      { productId: 903, qty: 1,  label: 'Cassava Powder (Fufu) 5kg',    emoji: '🫙' },
      { productId: 905, qty: 1,  label: 'Onions (Bag) 10kg',            emoji: '🧅' },
    ],
  },
  {
    id: 'custom',
    name: 'Customized Request',
    tagline: 'Build your own — call or WhatsApp us',
    price: 'Call us',
    monthly: 'Flexible',
    tag: 'Custom',
    popular: false,
    items: [],
  },
]

const HERO_IMAGES = [
  { src: '/images/cover-1.png', alt: 'Grocery package with rice and essentials' },
  { src: '/images/cover-2.png', alt: 'Ginny Gold rice and grocery bundle' },
  { src: '/images/cover-3.png', alt: 'Royal Aroma and Millicent rice packages' },
  { src: '/images/slider-2.jpg', alt: 'Fresh vegetables' },
]

const TRUST = [
  { icon: '📅', title: '1–3 Month Plans', sub: 'Pay in easy instalments' },
  { icon: '🏛️', title: 'Govt Workers Only', sub: 'All Ghana public sector' },
  { icon: '🚚', title: 'Bulk Delivery', sub: 'Nationwide across Ghana' },
  { icon: '📱', title: 'Pay with MoMo', sub: 'MTN · Vodafone · AirtelTigo' },
]

const fmt = (n) => `GH₵${Number(n).toLocaleString()}`
const disc = (p, op) => Math.round(((op - p) / op) * 100)

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const LogoMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="gld" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f5c842" /><stop offset="60%" stopColor="#d4a017" /><stop offset="100%" stopColor="#a07010" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="46" stroke="url(#gld)" strokeWidth="6" />
    <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="Georgia,serif" fill="url(#gld)">J</text>
  </svg>
)

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ cartCount, onCartOpen, onApply, onDeptClick }) => {
  const [search, setSearch] = useState('')
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-amber-400 py-2.5 text-center tracking-widest font-black text-sm uppercase">
        🛒 Buy Groceries in Bulk and Pay Within 3 Months
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <LogoMark size={38} />
          <div className="hidden sm:block leading-tight">
            <p className="font-black text-gray-900 text-base leading-none">List <span className="text-amber-500">"J"</span></p>
            <p className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase">Grocery Shop</p>
          </div>
        </div>

        <div className="flex-1 relative max-w-xl">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search rice, oil, sardines, chicken..."
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all" />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="hidden sm:flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span className="text-[10px]">Account</span>
          </button>
          <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span className="text-[10px]">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>
          <button onClick={onApply}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm uppercase tracking-wider">
            Apply Now
          </button>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-gray-100 overflow-x-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center min-w-max">
          <button
            onClick={() => onDeptClick && onDeptClick('all')}
            className="flex items-center gap-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 text-xs font-bold transition-colors flex-shrink-0 border-r border-gray-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            All Departments
          </button>
          {/* Packages tab — scrolls to #packages */}
          <button
            onClick={() => onDeptClick && onDeptClick('packages')}
            className="text-amber-700 bg-amber-50 hover:bg-amber-100 border-r border-amber-100 px-4 py-2.5 text-xs font-bold whitespace-nowrap flex-shrink-0 transition-colors">
            📦 Our Packages
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              onClick={() => onDeptClick && onDeptClick(cat.id)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2.5 text-xs font-medium whitespace-nowrap flex-shrink-0 border-r border-gray-100 transition-colors">
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onShop, onApply }) => {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [prevIdx, setPrevIdx] = useState(null)

  useEffect(() => {
    const id = setInterval(() => {
      const next = (active + 1) % HERO_IMAGES.length
      setPrevIdx(active); setFading(true)
      setTimeout(() => { setActive(next); setPrevIdx(null); setFading(false) }, 500)
    }, 4500)
    return () => clearInterval(id)
  }, [active])

  const goTo = (i) => {
    if (i === active) return
    setPrevIdx(active); setFading(true)
    setTimeout(() => { setActive(i); setPrevIdx(null); setFading(false) }, 500)
  }

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row gap-4">

        {/* LEFT — static message panel */}
        <div className="w-full md:w-[44%] flex-shrink-0 bg-white border border-gray-200 rounded-2xl px-8 py-10 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-6 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              🇬🇭 Open to Govt Workers in Ghana
            </div>

            <div className="flex items-center gap-3 mb-5">
              <LogoMark size={52} />
              <div>
                <p className="text-gray-800 font-black text-xl leading-none">List <span className="text-amber-500">"J"</span></p>
                <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Grocery Shop</p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2" style={{ fontFamily: 'Georgia,serif' }}>
              Feast in <span className="text-amber-500">Comfort.</span>
            </h1>
            <p className="text-gray-500 text-base italic mb-4" style={{ fontFamily: 'Georgia,serif' }}>Super 3 Months Plan</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-sm">
              Buy your groceries in bulk and pay over <span className="text-gray-800 font-semibold">1–3 months</span>.
              No interest, no stress. Pick from our packages or build your own.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mb-7">
              {['📅 Pay in 3 months', '🚚 Bulk delivery', '📱 MoMo accepted', '🏛️ Govt workers'].map(t => (
                <span key={t} className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">{t}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onShop}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-7 py-3.5 rounded-xl active:scale-95 transition-all shadow-sm">
                🛒 Build Your Package
              </button>
              <a href="#packages"
                className="border border-gray-300 text-gray-700 font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-all text-center">
                View Fixed Plans
              </a>
            </div>

            <p className="mt-5 text-gray-400 text-xs">
              Questions? <a href="https://wa.me/233244854206" className="text-amber-600 hover:underline font-semibold">WhatsApp 0244854206</a>
            </p>
          </div>
        </div>

        {/* RIGHT — image slider */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-200" style={{ minHeight: '360px' }}>
          {prevIdx !== null && (
            <img key={`p${prevIdx}`} src={HERO_IMAGES[prevIdx].src} alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.5s', zIndex: 1 }} />
          )}
          <img key={`a${active}`} src={HERO_IMAGES[active].src} alt={HERO_IMAGES[active].alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.5s', zIndex: 2 }} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === active ? '24px' : '8px', height: '8px', background: i === active ? '#fbbf24' : 'rgba(255,255,255,0.6)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
const TrustBar = () => (
  <section className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {TRUST.map(t => (
        <div key={t.title} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{t.icon}</div>
          <div>
            <p className="text-gray-800 font-bold text-sm">{t.title}</p>
            <p className="text-gray-400 text-xs">{t.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)

// ─── CATEGORY BANNER DATA ────────────────────────────────────────────────────
// Each category gets a background colour + up to 3 product images to display.
// As you add real images to public/images/, slot them in here.
const CAT_BANNERS = {
  rice:       { bg: 'bg-amber-50',   border: 'border-amber-100',  title: 'text-amber-800',  imgs: ['/images/royal25.webp', '/images/Oba-Spagetti-405x330.jpg'] },
  oil:        { bg: 'bg-yellow-50',  border: 'border-yellow-100', title: 'text-yellow-800', imgs: ['/images/frytol-oil.png', '/images/palm-oil.jpeg'] },
  canned:     { bg: 'bg-red-50',     border: 'border-red-100',    title: 'text-red-800',    imgs: ['/images/titus-sardines.png', '/images/gino-tomato-paste.png'] },
  provisions: { bg: 'bg-purple-50',  border: 'border-purple-100', title: 'text-purple-800', imgs: ['/images/Milo-Antigen-E-400g-405x330.jpg', '/images/cornflakes.jpg'] },
  frozen:     { bg: 'bg-sky-50',     border: 'border-sky-100',    title: 'text-sky-800',    imgs: ['/images/Chicken-thigh.jpeg', '/images/drumstick.jpeg'] },
  cleaning:   { bg: 'bg-blue-50',    border: 'border-blue-100',   title: 'text-blue-800',   imgs: ['/images/power-zone-405x330.jpg', '/images/Madar-Soap-Large-Size-405x330.png'] },
  fresh:      { bg: 'bg-lime-50',    border: 'border-lime-100',   title: 'text-lime-800',   imgs: ['/images/slider-2.jpg'] },
}

// ─── CATEGORY TILES ───────────────────────────────────────────────────────────
const CategoryTiles = ({ onCatClick }) => (
  <section className="bg-white py-6 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto">
      <SectionTitle label="Shop by Department" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const banner = CAT_BANNERS[cat.id] || { bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-800', imgs: [] }
          const imgs = banner.imgs
          return (
            <button
              key={cat.id}
              onClick={() => onCatClick(cat.id)}
              className={`group relative overflow-hidden rounded-xl border ${banner.border} ${banner.bg} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left`}
              style={{ height: '130px' }}
            >
              {/* Product image collage */}
              {imgs.length === 1 && (
                <img
                  src={imgs[0]} alt={cat.label}
                  className="absolute right-0 bottom-0 h-full w-2/3 object-cover object-left opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)' }}
                />
              )}
              {imgs.length >= 2 && (
                <div className="absolute right-0 bottom-0 h-full w-3/5 flex gap-1 p-1">
                  {imgs.slice(0, 2).map((src, i) => (
                    <img key={i} src={src} alt=""
                      className="flex-1 h-full object-contain object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                  ))}
                </div>
              )}

              {/* Text label — always on top left */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                <p className={`text-xs font-black leading-snug ${banner.title} max-w-[55%]`}>{cat.label}</p>
                <p className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Shop now →</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  </section>
)

// ─── SECTION TITLE helper ─────────────────────────────────────────────────────
const SectionTitle = ({ label, onSeeAll }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
      <h2 className="text-base font-black text-gray-800">{label}</h2>
    </div>
    {onSeeAll && (
      <button onClick={onSeeAll} className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 hover:underline">
        See all
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    )}
  </div>
)

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
const ProductDetail = ({ product, qty, onAdd, onRemove, onBack, onViewProduct, cartCount, onCartOpen, onDeptClick }) => {
  const [localQty, setLocalQty] = useState(1)
  const [added, setAdded] = useState(false)
  const cat = CATEGORIES.find(c => c.id === product.cat)
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 6)

  const handleAddToCart = () => {
    for (let i = 0; i < localQty; i++) onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Full Navbar — so cart count stays visible */}
      <Navbar
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onApply={onBack}
        onDeptClick={(catId) => { onBack(); setTimeout(() => onDeptClick(catId), 100) }}
      />

      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <span className="text-gray-300">|</span>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">Home</button>
            <span>/</span>
            <span className="text-gray-500">{cat?.label}</span>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main product section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">

            {/* LEFT — product image */}
            <div className="w-full md:w-[420px] flex-shrink-0 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex items-center justify-center p-10" style={{ minHeight: '380px' }}>
              {product.img
                ? <img src={product.img} alt={product.name} className="max-h-72 w-full object-contain drop-shadow-sm" />
                : <span className="text-[120px] select-none leading-none">{product.emoji}</span>
              }
            </div>

            {/* RIGHT — product info */}
            <div className="flex-1 p-8 flex flex-col">
              {/* Category badge */}
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full mb-3 w-fit">
                {cat?.label}
              </span>

              {/* Name */}
              <h1 className="text-2xl font-black text-gray-900 leading-tight mb-3">{product.name}</h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-xs">(Available in stock)</span>
              </div>

              {/* Price block */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-gray-900">{fmt(product.price)}</span>
              </div>
              <p className="text-gray-400 text-xs mb-6">Per <span className="font-semibold text-gray-600">{product.unit}</span></p>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3 mb-4">
                {!added ? (
                  <>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setLocalQty(q => Math.max(1, q - 1))}
                        className="w-10 h-11 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black text-lg flex items-center justify-center transition-colors">
                        −
                      </button>
                      <span className="w-12 text-center font-black text-base text-gray-800 border-x border-gray-200 h-11 flex items-center justify-center">
                        {localQty}
                      </span>
                      <button
                        onClick={() => setLocalQty(q => q + 1)}
                        className="w-10 h-11 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black text-lg flex items-center justify-center transition-colors">
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-11 rounded-xl font-black text-sm bg-amber-400 hover:bg-amber-500 text-gray-900 transition-all active:scale-95">
                      Add {localQty > 1 ? `(${localQty}) ` : ''}to Cart
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onCartOpen}
                    className="w-full h-11 rounded-xl font-black text-sm bg-gray-800 hover:bg-gray-900 text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    View Cart
                  </button>
                )}
              </div>

              {/* Current cart qty */}
              {qty > 0 && (
                <p className="text-gray-400 text-xs mb-4">
                  Already in cart: <span className="font-bold text-gray-700">{qty} × {product.unit}</span>
                  <button onClick={onRemove} className="ml-2 text-red-400 hover:text-red-600 hover:underline">remove one</button>
                </p>
              )}

              {/* Product meta */}
              <div className="border-t border-gray-100 pt-5 space-y-2.5">
                {[
                  { label: 'Category',    value: cat?.label },
                  { label: 'Unit',        value: product.unit },
                  { label: 'SKU',         value: `LJ-${String(product.id).padStart(4,'0')}` },
                  { label: 'Availability',value: 'In Stock' },
                  { label: 'Payment',     value: '3-Month Plan · MoMo on purchase' },
                ].map(row => (
                  <div key={row.label} className="flex gap-3 text-sm">
                    <span className="text-gray-400 w-24 flex-shrink-0">{row.label}:</span>
                    <span className="text-gray-700 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
              <h2 className="text-base font-black text-gray-800">More from {cat?.label}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {related.map(p => (
                <ProductCard key={p.id} product={p}
                  qty={0}
                  onAdd={() => {}}
                  onRemove={() => {}}
                  onView={() => onViewProduct(p)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, qty, onAdd, onRemove, onView }) => {
  const [added, setAdded] = useState(false)
  const pct = disc(product.price, product.oldPrice)

  const handleAdd = (e) => {
    e.stopPropagation()
    onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div
      onClick={() => onView && onView(product)}
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image / Emoji */}
      <div className="relative bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden" style={{ height: '130px' }}>
        {product.img
          ? <img src={product.img} alt={product.name} className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300" />
          : <span className="text-5xl group-hover:scale-110 transition-transform duration-200 select-none">{product.emoji}</span>
        }
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">-{pct}%</span>
        {product.tag && (
          <span className="absolute bottom-2 right-2 bg-white border border-gray-200 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">{product.tag}</span>
        )}
        {qty > 0 && (
          <span className="absolute top-2 right-2 bg-amber-400 text-gray-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">{qty}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-gray-800 text-xs font-semibold line-clamp-2 leading-snug mb-1">{product.name}</p>
        <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide mb-auto">{product.unit}</p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-gray-900 font-black text-sm">{fmt(product.price)}</span>
          <span className="text-gray-300 text-[10px] line-through">{fmt(product.oldPrice)}</span>
        </div>

        {qty === 0 ? (
          <button onClick={handleAdd}
            className={`mt-2 w-full py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${added ? 'bg-gray-800 text-white' : 'bg-amber-400 hover:bg-amber-500 text-gray-900'}`}>
            {added ? '✓ Added' : '+ Add'}
          </button>
        ) : (
          <div className="mt-2 flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={handleRemove} className="flex-1 h-7 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-black text-base active:scale-90 transition-all">−</button>
            <span className="w-8 text-center font-black text-sm text-gray-800 border-x border-gray-200">{qty}</span>
            <button onClick={handleAdd} className="flex-1 h-7 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 font-black text-base active:scale-90 transition-all">+</button>
          </div>
        )}
      </div>
    </div>
  )
}


// ─── PRODUCT ROW (one per category on homepage) ───────────────────────────────
const ProductRow = ({ catId, cart, onAdd, onRemove, onSeeAll, onView }) => {
  const cat = CATEGORIES.find(c => c.id === catId)
  const items = PRODUCTS.filter(p => p.cat === catId).slice(0, 6)
  if (!cat || items.length === 0) return null

  return (
    <section className="bg-white py-7 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <SectionTitle label={cat.label} onSeeAll={() => onSeeAll(catId)} />
        <p className="text-gray-400 text-xs mb-4 -mt-3">{cat.description}</p>

        {/* Rice custom request notice */}
        {catId === 'rice' && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <span className="text-xl flex-shrink-0 mt-0.5">🌾</span>
            <p className="text-amber-800 text-xs leading-relaxed">
              <span className="font-black">Don't see your preferred rice brand?</span> We can source and deliver any rice brand on request.{' '}
              <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20request%20a%20specific%20rice%20brand."
                className="underline font-bold hover:text-amber-900 transition-colors" target="_blank" rel="noopener noreferrer">
                WhatsApp us to request →
              </a>
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {items.map(p => (
            <ProductCard key={p.id} product={p}
              qty={cart[p.id] || 0}
              onAdd={() => onAdd(p.id)}
              onRemove={() => onRemove(p.id)}
              onView={onView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURED GRID (3 rows of mixed products — GH Basket style) ───────────────
// Pick 2 products from each category, shuffle them into a single flat grid.
// 3 rows × 6 columns = 18 cards on desktop, 3 rows × 2 cols = 18 on mobile.
const FEATURED_IDS = [
  // Row 1 — Rice, Oil, Canned
  101, 201, 401, 403, 501, 303,
  // Row 2 — Frozen, Cleaning, Breakfast
  601, 602, 603, 701, 801, 814,
  // Row 3 — Foodstuffs, Provisions, More
  907, 901, 104, 402, 605, 806,
]

const FeaturedGrid = ({ cart, onAdd, onRemove, onShop, onView }) => {
  const featured = FEATURED_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)
  return (
    <section className="bg-white py-7 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
            <h2 className="text-base font-black text-gray-800">Featured Products</h2>
          </div>
          <button onClick={onShop}
            className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 hover:underline">
            View all products
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <p className="text-gray-400 text-xs mb-5">A mix of our most popular items across all departments</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {featured.map(p => (
            <ProductCard key={p.id} product={p}
              qty={cart[p.id] || 0}
              onAdd={() => onAdd(p.id)}
              onRemove={() => onRemove(p.id)}
              onView={onView} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROMO STRIP ──────────────────────────────────────────────────────────────
const PromoStrip = ({ onApply, onShop }) => (
  <section className="bg-gray-50 py-6 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { bg: 'bg-gray-800', textColor: 'text-white', sub: 'text-gray-400', icon: '🛒', title: 'Build Your Own Package', sub2: 'Choose exactly what you need', action: onShop },
        { bg: 'bg-amber-400', textColor: 'text-gray-900', sub: 'text-gray-700', icon: '📋', title: 'Apply in Minutes', sub2: 'Quick form — fast approval', action: onApply },
        { bg: 'bg-gray-100', textColor: 'text-gray-800', sub: 'text-gray-500', icon: '📅', title: 'Pay Over 3 Months', sub2: 'No interest · No stress', action: null },
      ].map(b => (
        <div key={b.title} onClick={b.action}
          className={`${b.bg} rounded-2xl px-5 py-4 flex items-center gap-4 ${b.action ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : ''} transition-all border border-transparent hover:border-gray-200`}>
          <span className="text-3xl">{b.icon}</span>
          <div>
            <p className={`font-black text-sm ${b.textColor}`}>{b.title}</p>
            <p className={`text-xs ${b.sub}`}>{b.sub2}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)

// ─── PACKAGE DETAIL PAGE ──────────────────────────────────────────────────────
const PackageDetail = ({ pkg, onBack, onApply, idx }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const totalItems = pkg.items.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <span className="text-gray-300">|</span>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">Home</button>
            <span>/</span>
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">Packages</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">{pkg.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${pkg.popular ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {pkg.tag}
              </span>
              {pkg.popular && (
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-400 text-gray-900">
                  Most Popular
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">{pkg.name}</h1>
            <p className="text-gray-500 text-sm">{pkg.tagline}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-black text-gray-900">{pkg.price}</p>
            <p className="text-gray-400 text-sm mt-0.5">≈ {pkg.monthly} over 3 months</p>
            <p className="text-gray-400 text-xs mt-0.5">{totalItems} items included</p>
          </div>
        </div>

        {/* 3-month callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-4">
          <span className="text-2xl flex-shrink-0">📅</span>
          <div>
            <p className="text-amber-800 font-black text-sm">Pay comfortably over 3 months</p>
            <p className="text-amber-700 text-xs mt-0.5">
              No interest · Open to all Ghana govt workers · Pay via MoMo, Visa or Cash
            </p>
          </div>
        </div>

        {/* Items list */}
        {pkg.id === 'custom' ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center mb-6">
            <p className="text-4xl mb-4">📞</p>
            <h2 className="text-gray-800 font-black text-lg mb-2">Customized Request</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-5">
              Tell us exactly what you need and we'll build a custom package tailored to your household.
            </p>
            <a href="https://wa.me/233244854206"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              💬 WhatsApp 0244854206
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Image</div>
              <div className="col-span-6">Item</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit</div>
            </div>

            {/* Items rows */}
            {pkg.items.map((item, i) => (
              <div key={i}
                className={`grid grid-cols-12 gap-3 items-center px-5 py-4 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                {/* Row number */}
                <div className="col-span-1 text-gray-300 text-sm font-bold">{String(i + 1).padStart(2, '0')}</div>

                {/* Product image / emoji */}
                <div className="col-span-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                    {item.img
                      ? <img src={item.img} alt={item.label} className="w-full h-full object-contain p-1.5" />
                      : <span className="text-2xl">{item.emoji}</span>
                    }
                  </div>
                </div>

                {/* Item name */}
                <div className="col-span-6">
                  <p className="text-gray-800 text-sm font-semibold">{item.label}</p>
                  {item.qty > 1 && (
                    <p className="text-amber-600 text-xs font-bold mt-0.5">× {item.qty} units</p>
                  )}
                </div>

                {/* Qty badge */}
                <div className="col-span-1 flex justify-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${item.qty > 1 ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 text-gray-600'}`}>
                    {item.qty}
                  </span>
                </div>

                {/* Unit type from PRODUCTS */}
                <div className="col-span-2 text-right">
                  {(() => {
                    const p = PRODUCTS.find(pr => pr.id === item.productId)
                    return <span className="text-gray-400 text-xs uppercase tracking-wider">{p?.unit || '—'}</span>
                  })()}
                </div>
              </div>
            ))}

            {/* Total row */}
            <div className="grid grid-cols-12 gap-3 items-center px-5 py-4 bg-gray-800 text-white">
              <div className="col-span-9 font-black text-sm">Total Items in Package</div>
              <div className="col-span-1 flex justify-center">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-black">{totalItems}</span>
              </div>
              <div className="col-span-2 text-right font-black text-sm">{pkg.price}</div>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { onApply(pkg.id === 'custom' ? PACKAGE_OPTIONS[5] : PACKAGE_OPTIONS[idx]); onBack() }}
            className={`flex-1 py-4 rounded-2xl font-black text-base transition-all active:scale-95 shadow-sm ${pkg.popular ? 'bg-amber-400 hover:bg-amber-500 text-gray-900' : 'bg-gray-800 hover:bg-gray-900 text-white'}`}>
            {pkg.id === 'custom' ? '💬 WhatsApp Us to Customise' : 'Select This Package & Apply →'}
          </button>
          <button onClick={onBack}
            className="sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
            View Other Packages
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── FIXED PACKAGES ───────────────────────────────────────────────────────────
const FixedPackages = ({ onApplyWithPackage, onViewPackage }) => (
  <section id="packages" className="bg-white py-10 px-4 border-b border-gray-100">
    <div className="max-w-7xl mx-auto">
      <SectionTitle label="Ready-Made Packages" />
      <p className="text-gray-400 text-xs mb-6 -mt-3">Choose a plan that fits your household — click to see full item list.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIXED_PACKAGES.map((pkg, idx) => (
          <div key={pkg.id}
            className={`relative rounded-2xl border overflow-hidden hover:-translate-y-0.5 transition-all duration-200 ${pkg.popular ? 'border-amber-400 shadow-lg shadow-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
            {pkg.popular && <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider z-10">Most Popular</div>}
            <div className={`h-1 w-full ${pkg.popular ? 'bg-amber-400' : 'bg-gray-200'}`} />
            <div className="p-5 bg-white">
              <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 ${pkg.popular ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {pkg.tag}
              </span>
              <h3 className="text-gray-900 font-black text-base mb-1">{pkg.name}</h3>
              <p className="text-gray-400 text-xs mb-2">{pkg.tagline}</p>
              <p className="text-gray-900 font-black text-xl mb-0.5">{pkg.price}</p>
              <p className="text-gray-400 text-xs mb-4">≈ {pkg.monthly} over 3 months</p>

              {/* Item previews — show first 4 with images/emoji */}
              {pkg.items.length > 0 && (
                <div className="flex items-center gap-1.5 mb-4">
                  {pkg.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" title={item.label}>
                      {item.img
                        ? <img src={item.img} alt={item.label} className="w-full h-full object-contain p-0.5" />
                        : <span className="text-lg">{item.emoji}</span>
                      }
                    </div>
                  ))}
                  {pkg.items.length > 4 && (
                    <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-[10px] font-black">+{pkg.items.length - 4}</span>
                    </div>
                  )}
                  <span className="text-gray-400 text-xs ml-1">{pkg.items.length} items</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                {pkg.id !== 'custom' && (
                  <button
                    onClick={() => onViewPackage(pkg, idx)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                    View Items
                  </button>
                )}
                <button
                  onClick={() => onApplyWithPackage(pkg.id === 'custom' ? PACKAGE_OPTIONS[5] : PACKAGE_OPTIONS[idx])}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${pkg.popular ? 'bg-amber-400 hover:bg-amber-500 text-gray-900' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {pkg.id === 'custom' ? 'Call 0244854206' : 'Apply →'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── ROTATING PRODUCT SHOWCASE ────────────────────────────────────────────────
// Picks 3 products from each category, rotates through them every 4s.
// Clicking "Browse all" or a category pill opens the full cart drawer flow.
const SHOWCASE_SIZE = 9   // 3 columns × 3 rows visible at once
const ROTATE_MS    = 4000 // ms between rotations

// Build a pool: 3 products per category, shuffled so rotation feels varied
const buildPool = () => {
  const pool = []
  CATEGORIES.forEach(cat => {
    const catProducts = PRODUCTS.filter(p => p.cat === cat.id)
    // Take up to 3 from each category
    for (let i = 0; i < Math.min(3, catProducts.length); i++) {
      pool.push(catProducts[i])
    }
  })
  return pool
}
const SHOWCASE_POOL = buildPool()

const ShopSection = ({ cart, onAdd, onRemove, onCartOpen, cartTotal, cartCount, onView, defaultCat }) => {
  const [offset, setOffset]       = useState(0)
  const [visible, setVisible]     = useState(true)
  const [activeCat, setActiveCat] = useState(defaultCat || 'all')
  const pct = Math.min(100, Math.round((cartTotal / MIN_ORDER) * 100))

  // Sync when parent changes department via navbar
  useEffect(() => {
    if (defaultCat) { setActiveCat(defaultCat); setOffset(0); setVisible(true) }
  }, [defaultCat])

  // Filter pool by active category
  const pool = activeCat === 'all'
    ? SHOWCASE_POOL
    : PRODUCTS.filter(p => p.cat === activeCat)

  const total = pool.length
  // Clamp offset when pool shrinks
  const safeOffset = total <= SHOWCASE_SIZE ? 0 : offset % total

  // Auto-rotate — ONLY when showing "All" categories
  useEffect(() => {
    if (activeCat !== 'all') return      // ← static when a department is selected
    if (total <= SHOWCASE_SIZE) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setOffset(o => (o + SHOWCASE_SIZE) % total)
        setVisible(true)
      }, 350)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [total, activeCat])

  // Reset offset when category changes
  useEffect(() => { setOffset(0); setVisible(true) }, [activeCat])

  // Slice window of products to show
  const shown = total === 0 ? [] : Array.from({ length: Math.min(SHOWCASE_SIZE, total) }, (_, i) =>
    pool[(safeOffset + i) % total]
  )

  // Dot indicators — one per page
  const pages = total <= SHOWCASE_SIZE ? 1 : Math.ceil(total / SHOWCASE_SIZE)
  const currentPage = Math.floor(safeOffset / SHOWCASE_SIZE)

  return (
    <section id="shop" className="bg-white py-10 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-1 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-1 h-5 bg-amber-400 rounded-full inline-block" />
              <h2 className="text-base font-black text-gray-800">Build Your Own Package</h2>
            </div>
            <p className="text-gray-400 text-xs ml-3.5">
              Add items to your cart — pay over 3 months. Items rotate automatically.
            </p>
          </div>

          {/* Cart pill */}
          {cartCount > 0 && (
            <button onClick={onCartOpen}
              className="flex-shrink-0 flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {cartCount} items · {fmt(cartTotal)}
              {pct < 100 && <span className="text-amber-300 font-medium">· {fmt(MIN_ORDER - cartTotal)} to min</span>}
              {pct >= 100 && <span className="text-green-400 font-medium">· ✓ Ready</span>}
            </button>
          )}
        </div>

        {/* Progress bar — only when cart has items */}
        {cartCount > 0 && (
          <div className="ml-3.5 mb-5 mt-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gray-800' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-xs font-bold ${pct >= 100 ? 'text-gray-800' : 'text-amber-600'}`}>
                {pct}% of min order
              </span>
            </div>
          </div>
        )}

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 mt-4">
          <button onClick={() => setActiveCat('all')}
            className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all flex-shrink-0 ${activeCat === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all flex-shrink-0 ${activeCat === cat.id ? 'bg-gray-800 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rice custom request notice — shown when rice dept is selected */}
        {activeCat === 'rice' && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <span className="text-xl flex-shrink-0 mt-0.5">🌾</span>
            <p className="text-amber-800 text-xs leading-relaxed">
              <span className="font-black">Don't see your preferred rice brand?</span> We can source and deliver any rice brand on request.{' '}
              <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'd%20like%20to%20request%20a%20specific%20rice%20brand."
                className="underline font-bold hover:text-amber-900 transition-colors" target="_blank" rel="noopener noreferrer">
                WhatsApp us to request →
              </a>
            </p>
          </div>
        )}

        {/* Rotating 3-column grid */}
        {shown.length === 0 ? (
          <div className="text-center py-12 text-gray-300 text-sm">No products in this category yet.</div>
        ) : (
          <>
            <div
              className={`grid grid-cols-3 gap-3 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              {shown.map((p, i) => (
                <ProductCard key={`${p.id}-${i}`} product={p}
                  qty={cart[p.id] || 0}
                  onAdd={() => onAdd(p.id)}
                  onRemove={() => onRemove(p.id)}
                  onView={onView} />
              ))}
            </div>

            {/* Dots + nav */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {/* Prev */}
                <button
                  onClick={() => {
                    setVisible(false)
                    setTimeout(() => {
                      setOffset(o => (o - SHOWCASE_SIZE + total) % total)
                      setVisible(true)
                    }, 300)
                  }}
                  className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button key={i}
                      onClick={() => { setOffset(i * SHOWCASE_SIZE); setVisible(true) }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === currentPage ? '20px' : '6px',
                        height: '6px',
                        background: i === currentPage ? '#1f2937' : '#d1d5db',
                      }} />
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={() => {
                    setVisible(false)
                    setTimeout(() => {
                      setOffset(o => (o + SHOWCASE_SIZE) % total)
                      setVisible(true)
                    }, 300)
                  }}
                  className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Auto-rotate indicator — only for All */}
            {pages > 1 && activeCat === 'all' && (
              <p className="text-center text-gray-300 text-[11px] mt-2">
                Rotating every {ROTATE_MS / 1000}s · {total} products available
              </p>
            )}
            {pages > 1 && activeCat !== 'all' && (
              <p className="text-center text-gray-300 text-[11px] mt-2">
                {total} products · use arrows to browse
              </p>
            )}
          </>
        )}

        {/* View full catalogue CTA */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            Showing {shown.length} of {total} products
            {activeCat !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCat)?.label}`}
          </p>
          <button onClick={onCartOpen}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-6 py-2.5 rounded-xl transition-colors active:scale-95">
            View Cart & Apply →
          </button>
        </div>

      </div>
    </section>
  )
}

// ─── FULL CART PAGE (GH Basket style) ────────────────────────────────────────
const CartPage = ({ cart, onAdd, onRemove, onClear, onBack, onCheckout, cartCount, onCartOpen, onDeptClick, onShop }) => {
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0)
  const subtotal  = cartItems.reduce((s, [id, q]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id)); return s + (p ? p.price * q : 0)
  }, 0)
  const pct       = Math.min(100, Math.round((subtotal / MIN_ORDER) * 100))
  const remaining = Math.max(0, MIN_ORDER - subtotal)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} onApply={onBack}
        onDeptClick={(catId) => { onBack(); setTimeout(() => onDeptClick(catId), 100) }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <button onClick={onShop} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Continue Shopping
          </button>
          <span className="text-gray-300">|</span>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button onClick={onBack} className="hover:text-gray-700">Home</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">Your Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">
          Your Cart
          {cartCount > 0 && <span className="ml-2 text-base font-normal text-gray-400">({cartCount} items)</span>}
        </h1>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 className="text-gray-700 font-black text-lg mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Add some products to get started on your 3-month package.</p>
            <button onClick={onShop} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm px-8 py-3 rounded-xl transition-colors active:scale-95">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* LEFT — cart table */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Cart rows */}
                {cartItems.map(([id, qty], rowIdx) => {
                  const p = PRODUCTS.find(pr => pr.id === parseInt(id))
                  if (!p) return null
                  return (
                    <div key={id}
                      className={`flex flex-col md:grid md:grid-cols-12 gap-4 items-center px-6 py-5 border-b border-gray-50 last:border-0 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>

                      {/* Product col */}
                      <div className="col-span-5 flex items-center gap-4 w-full">
                        {/* Remove button */}
                        <button onClick={() => {
                          // Remove all qty of this item
                          const n = { ...cart }; delete n[parseInt(id)]
                          onClear(parseInt(id))
                        }}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                          title="Remove item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                        {/* Image */}
                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.img
                            ? <img src={p.img} alt={p.name} className="w-full h-full object-contain p-1.5"/>
                            : <span className="text-2xl">{p.emoji}</span>}
                        </div>
                        {/* Name + unit */}
                        <div>
                          <p className="text-gray-800 text-sm font-semibold leading-snug">{p.name}</p>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">{p.unit}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="text-gray-700 font-semibold text-sm">{fmt(p.price)}</span>
                      </div>

                      {/* Qty stepper */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => onRemove(p.id)}
                            className="w-8 h-8 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-black text-base flex items-center justify-center transition-colors">
                            −
                          </button>
                          <span className="w-10 text-center font-black text-sm text-gray-800 border-x border-gray-200 h-8 flex items-center justify-center">
                            {qty}
                          </span>
                          <button onClick={() => onAdd(p.id)}
                            className="w-8 h-8 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 font-black text-base flex items-center justify-center transition-colors">
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-right">
                        <span className="text-gray-900 font-black text-sm">{fmt(p.price * qty)}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Table footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => onClear('all')}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
                    Clear cart
                  </button>
                  <button onClick={onShop}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                    ← Continue shopping
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — order summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-[140px]">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-black text-gray-800 text-base">Order Summary</h2>
                </div>

                <div className="px-5 py-4 space-y-3">
                  {/* Min order progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-gray-600">Minimum Order</span>
                      <span className="font-black text-gray-800">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gray-800' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[11px] text-gray-400">
                      <span>{fmt(subtotal)} added</span>
                      {pct < 100
                        ? <span className="text-amber-600 font-semibold">Add {fmt(remaining)} more</span>
                        : <span className="text-gray-800 font-bold">✓ Minimum reached!</span>}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal ({cartCount} items)</span>
                      <span className="font-semibold text-gray-700">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Payment plan</span>
                      <span className="font-semibold text-gray-700">3 months</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Monthly instalment</span>
                      <span className="font-semibold text-gray-700">{fmt(Math.ceil(subtotal / 3))}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-black text-gray-800 text-base">Total</span>
                      <span className="font-black text-gray-900 text-2xl">{fmt(subtotal)}</span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">Pay over 3 months — no interest</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 pt-1 space-y-2">
                  <button
                    onClick={onCheckout}
                    disabled={pct < 100}
                    className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${pct >= 100 ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                    {pct >= 100 ? 'Proceed to Apply →' : `Add ${fmt(remaining)} more to continue`}
                  </button>
                  <button onClick={onShop}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Continue Shopping
                  </button>
                </div>

                {/* Trust badges */}
                <div className="px-5 pb-5 space-y-2 border-t border-gray-100 pt-4">
                  {[
                    { icon: '🏛️', text: 'Open to all Ghana govt workers' },
                    { icon: '📅', text: 'Pay over 1–3 months, no interest' },
                    { icon: '🚚', text: 'Nationwide delivery' },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{b.icon}</span><span>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

// ─── CART DRAWER (quick slide-in) ─────────────────────────────────────────────
const CartDrawer = ({ open, onClose, cart, onAdd, onRemove, onClear, onCheckout, total }) => {
  const pct = Math.min(100, Math.round((total / MIN_ORDER) * 100))
  const remaining = Math.max(0, MIN_ORDER - total)
  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0)

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl border-l border-gray-200 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 className="font-black text-gray-800 text-base">Your Package</h2>
            <span className="text-gray-400 text-xs">({cartItems.length} items)</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-bold text-gray-700">Minimum Order</span>
            <span className="font-black text-gray-800">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-gray-800' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[11px] mt-1.5 text-gray-400">
            <span>Cart: <span className="text-gray-700 font-bold">{fmt(total)}</span></span>
            {pct < 100
              ? <span>Add <span className="text-amber-600 font-bold">{fmt(remaining)}</span> more</span>
              : <span className="text-gray-800 font-bold">✓ Minimum reached!</span>}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🛒</span>
              <p className="text-gray-400 text-sm mt-4">Your cart is empty</p>
            </div>
          ) : cartItems.map(([id, qty]) => {
            const p = PRODUCTS.find(pr => pr.id === parseInt(id))
            if (!p) return null
            return (
              <div key={id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-contain p-1" />
                         : <span className="text-xl">{p.emoji}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-gray-500 text-xs">{fmt(p.price)} × {qty} = <span className="font-bold text-gray-800">{fmt(p.price * qty)}</span></p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <button onClick={() => onRemove(p.id)} className="w-6 h-6 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-black text-sm flex items-center justify-center active:scale-90 transition-all">−</button>
                  <span className="w-6 text-center font-black text-xs text-gray-800 border-x border-gray-200">{qty}</span>
                  <button onClick={() => onAdd(p.id)} className="w-6 h-6 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 font-black text-sm flex items-center justify-center active:scale-90 transition-all">+</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-gray-900 font-black text-xl">{fmt(total)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Monthly (÷3)</span>
            <span className="font-semibold text-gray-600">{fmt(Math.ceil(total / 3))}/mo</span>
          </div>
          <button onClick={onCheckout} disabled={pct < 100}
            className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${pct >= 100 ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
            {pct >= 100 ? 'Proceed to Apply →' : `Add ${fmt(remaining)} more to continue`}
          </button>
          {cartItems.length > 0 && (
            <button onClick={onClear} className="w-full py-2 text-gray-300 hover:text-red-400 text-xs transition-colors">Clear cart</button>
          )}
        </div>
      </div>
    </>
  )
}

// ─── APPLY FORM ───────────────────────────────────────────────────────────────
const Field = ({ label, name, type = 'text', placeholder, value, onChange, required, note }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="bg-white border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-gray-800 placeholder-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
    {note && <p className="text-gray-400 text-[11px]">{note}</p>}
  </div>
)

const ApplySection = ({ prefilledPackage, cartTotal, cartItems }) => {
  const hasCustomCart = cartItems.length > 0 && cartTotal >= MIN_ORDER
  const [form, setForm] = useState({ fullName:'', institution:'', phone:'', email:'', staffNumber:'', mandateNumber:'', otpPin:'', ghanaCardNumber:'', package: prefilledPackage || '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (prefilledPackage) setForm(f => ({ ...f, package: prefilledPackage })) }, [prefilledPackage])

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const cartSummary = cartItems.map(([id, qty]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id))
    return p ? `${p.name} ×${qty}` : ''
  }).filter(Boolean).join(', ')

  const onSubmit = async e => {
    e.preventDefault(); setSubmitting(true)
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdnxE_Diy4XQSVR5T52pQKc6FkzNwurabT2qo_cturDZO-WMg/viewform', '_blank')
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 800)
  }

  if (submitted) {
    return (
      <section id="apply" className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 className="text-gray-900 font-black text-xl mb-2">Application Submitted!</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Complete the form that opened, then WhatsApp us to confirm.</p>
          <a href="https://wa.me/233244854206"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Follow up on WhatsApp
          </a>
          <button onClick={() => setSubmitted(false)} className="block mx-auto mt-4 text-gray-300 text-xs hover:text-gray-500">Submit another</button>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="bg-white py-12 px-4 border-b border-gray-100">
      <div className="max-w-3xl mx-auto">
        <SectionTitle label="Apply Now" />
        <p className="text-gray-400 text-xs mb-6 -mt-3">Fill in your details — our team will process your application.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          {hasCustomCart && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 font-black text-sm mb-1">🛒 Your Custom Package</p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{cartSummary}</p>
                <p className="text-gray-900 font-black text-lg mt-2">{fmt(cartTotal)} <span className="text-gray-400 text-xs font-normal">≈ {fmt(Math.ceil(cartTotal/3))}/mo</span></p>
              </div>
              <span className="text-gray-600 text-xs font-bold bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg flex-shrink-0">✓ Ready</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name (as on Ghana Card)" name="fullName" value={form.fullName} onChange={onChange} placeholder="e.g. Kwame Asante" required />
            <Field label="Institution / Profession" name="institution" value={form.institution} onChange={onChange} placeholder="e.g. Ghana Health Service" required />
            <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="0244000000" required />
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={onChange} placeholder="kwame@email.com" required />
            <Field label="Staff Number / ID" name="staffNumber" value={form.staffNumber} onChange={onChange} placeholder="Your staff ID" required />
            <Field label="Mandate Number" name="mandateNumber" value={form.mandateNumber} onChange={onChange} placeholder="Your mandate number" required />
            <Field label="OTP PIN (for Mandate)" name="otpPin" value={form.otpPin} onChange={onChange} placeholder="OTP received" required />
            <Field label="Ghana Card Number" name="ghanaCardNumber" value={form.ghanaCardNumber} onChange={onChange} placeholder="GHA-000000000-0" required note="Send Ghana Card photo via WhatsApp to 0244854206" />

            {!hasCustomCart && (
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">Package <span className="text-red-400">*</span></label>
                <select name="package" value={form.package} onChange={onChange} required
                  className="bg-white border border-gray-200 focus:border-amber-400 text-gray-800 rounded-xl px-4 py-3 text-sm outline-none transition-all">
                  <option value="" disabled>— Select a package —</option>
                  {PACKAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}

            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-400 text-xs leading-relaxed">By submitting you confirm all details are accurate. LIST "J" Grocery Shop verifies your employment and mandate number before processing your request.</p>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={submitting}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black text-sm py-4 rounded-2xl active:scale-95 transition-all shadow-sm disabled:opacity-50">
                {submitting ? 'Opening Form...' : 'Submit Application →'}
              </button>
              <p className="text-center text-gray-300 text-xs mt-3">
                Complete the Google Form that opens, then WhatsApp <a href="https://wa.me/233244854206" className="text-amber-500 hover:underline">0244854206</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── WHATSAPP BUTTON ──────────────────────────────────────────────────────────
const WhatsAppFloat = () => {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShow(false), 4000); return () => clearTimeout(t) }, [])
  return (
    <a href="https://wa.me/233244854206?text=Hello%20List%20J!%20I'm%20interested%20in%20the%203-month%20grocery%20plan."
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group" aria-label="WhatsApp">
      <div className={`bg-white text-gray-700 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} group-hover:opacity-100`}>
        Chat with us 💬
      </div>
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1eb85a] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.001 2C8.268 2 2 8.268 2 16.001c0 2.49.653 4.83 1.794 6.85L2 30l7.335-1.763A13.942 13.942 0 0 0 16.001 30C23.732 30 30 23.732 30 16.001 30 8.268 23.732 2 16.001 2zm0 25.471a11.433 11.433 0 0 1-5.833-1.597l-.418-.248-4.332 1.042 1.075-4.217-.273-.433A11.432 11.432 0 0 1 4.53 16c0-6.33 5.142-11.471 11.471-11.471S27.471 9.67 27.471 16c0 6.33-5.142 11.471-11.47 11.471zm6.29-8.583c-.344-.172-2.036-1.004-2.352-1.118-.317-.115-.547-.172-.778.172-.23.344-.892 1.118-1.094 1.349-.201.23-.402.258-.747.086-.344-.172-1.452-.535-2.766-1.706-1.022-.912-1.713-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.603-.086-.172-.778-1.878-1.066-2.571-.281-.675-.566-.584-.778-.595l-.663-.011c-.23 0-.603.086-.919.43-.316.344-1.208 1.18-1.208 2.878s1.237 3.337 1.409 3.567c.172.23 2.435 3.717 5.9 5.213.824.356 1.468.568 1.97.728.827.263 1.58.226 2.175.137.663-.099 2.036-.832 2.323-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.23-.66-.402z"/>
        </svg>
      </div>
    </a>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-gray-900 text-gray-400">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4"><LogoMark size={34} />
          <div>
            <p className="font-black text-white text-sm">List "J" Grocery</p>
            <p className="text-gray-600 text-[11px]">Hire Purchase · Crediting</p>
          </div>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">Ghana's trusted grocery hire-purchase service for all government workers.</p>
        <div className="flex gap-2">{['📘','🐦','📸'].map((s,i) => (
          <button key={i} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors text-sm">{s}</button>
        ))}</div>
      </div>
      {[
        { title: 'Quick Links', links: ['Home','Fixed Packages','Build Your Own','Apply Now','Track Order'] },
        { title: 'Categories',  links: ['Rice & Grains','Cooking Oils','Canned & Tins','Frozen Foods','Detergents','Foodstuffs'] },
        { title: 'Support',     links: ['Contact Us','FAQs','Return Policy','Privacy Policy','Terms of Service'] },
      ].map(col => (
        <div key={col.title}>
          <h4 className="font-bold text-white mb-4 text-sm">{col.title}</h4>
          <ul className="space-y-2">{col.links.map(l => (
            <li key={l}><a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">{l}</a></li>
          ))}</ul>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-800 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
      <p className="text-gray-600 text-xs">© 2025 List J Grocery Shop · All rights reserved.</p>
      <div className="flex items-center gap-2 text-xs">
        {['MoMo 📱','Visa 💳','Cash 💵'].map(m => (
          <span key={m} className="bg-gray-800 text-gray-400 px-2 py-1 rounded font-medium">{m}</span>
        ))}
      </div>
    </div>
  </footer>
)

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart]                       = useState({})
  const [cartOpen, setCartOpen]               = useState(false)
  const [cartPageOpen, setCartPageOpen]       = useState(false)
  const [prefilled, setPrefilled]             = useState('')
  const [shopCat, setShopCat]                 = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0)

  const addToCart = id => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }))
  const removeFromCart = id => setCart(p => {
    const q = (p[id] || 0) - 1
    if (q <= 0) { const n = { ...p }; delete n[id]; return n }
    return { ...p, [id]: q }
  })
  const removeAllFromCart = (id) => {
    if (id === 'all') { setCart({}); return }
    setCart(p => { const n = { ...p }; delete n[id]; return n })
  }
  const clearCart = () => setCart({})

  const cartTotal = Object.entries(cart).reduce((s, [id, q]) => {
    const p = PRODUCTS.find(pr => pr.id === parseInt(id))
    return s + (p ? p.price * q : 0)
  }, 0)
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0)

  const toApply = () => { setCartOpen(false); setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 150) }
  const toShop  = (cat = 'all') => { setShopCat(cat); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 50) }
  const applyWithPkg = pkg => { setPrefilled(pkg); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }) }
  const viewProduct = (product) => { setSelectedProduct(product); window.scrollTo(0, 0) }
  const closeProduct = () => setSelectedProduct(null)
  const viewPackage = (pkg, idx) => { setSelectedPackage(pkg); setSelectedPackageIdx(idx); window.scrollTo(0, 0) }
  const closePackage = () => setSelectedPackage(null)

  // Show product detail page
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        qty={cart[selectedProduct.id] || 0}
        onAdd={() => addToCart(selectedProduct.id)}
        onRemove={() => removeFromCart(selectedProduct.id)}
        onBack={closeProduct}
        onViewProduct={viewProduct}
        cartCount={cartCount}
        onCartOpen={() => setCartPageOpen(true)}
        onDeptClick={(catId) => { setShopCat(catId); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 150) }}
      />
    )
  }

  // Show full cart page
  if (cartPageOpen) {
    return (
      <CartPage
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={removeAllFromCart}
        onBack={() => setCartPageOpen(false)}
        onShop={() => { setCartPageOpen(false); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
        onCheckout={() => { setCartPageOpen(false); setTimeout(toApply, 100) }}
        cartCount={cartCount}
        onCartOpen={() => setCartPageOpen(true)}
        onDeptClick={(catId) => { setCartPageOpen(false); setShopCat(catId); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 150) }}
      />
    )
  }

  // Show package detail page
  if (selectedPackage) {
    return (
      <PackageDetail
        pkg={selectedPackage}
        idx={selectedPackageIdx}
        onBack={closePackage}
        onApply={(pkgOption) => {
          setPrefilled(pkgOption)
          closePackage()
          setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 150)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartPageOpen(true)} onApply={toApply}
        onDeptClick={(catId) => {
          if (catId === 'packages') {
            document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })
          } else {
            setShopCat(catId)
            setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 80)
          }
        }} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}
        cart={cart} onAdd={addToCart} onRemove={removeFromCart}
        onClear={clearCart} onCheckout={toApply} total={cartTotal} />

      <Hero onShop={() => toShop()} onApply={toApply} />
      <TrustBar />
      <CategoryTiles onCatClick={cat => toShop(cat)} />

      {/* Packages shown first after homepage */}
      <FixedPackages onApplyWithPackage={applyWithPkg} onViewPackage={viewPackage} />

      {/* 3 rows of mixed featured products — GH Basket style */}
      <FeaturedGrid cart={cart} onAdd={addToCart} onRemove={removeFromCart} onShop={() => toShop()} onView={viewProduct} />

      <PromoStrip onApply={toApply} onShop={() => toShop()} />
      <ShopSection cart={cart} onAdd={addToCart} onRemove={removeFromCart}
        onCartOpen={() => setCartPageOpen(true)}
        cartTotal={cartTotal} cartCount={cartCount}
        onView={viewProduct} defaultCat={shopCat} />
      <ApplySection prefilledPackage={prefilled} cartTotal={cartTotal} cartItems={cartItems} />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
