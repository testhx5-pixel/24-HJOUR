const express = require('express');
const fs = require('fs-extra');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "super_secret_key_123",
  resave: false,
  saveUninitialized: false
}));

function checkAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DB_FILE = path.join(__dirname, 'data.json');
const ORDER_FILE = path.join(__dirname, 'order.json');
const UPLOADS_FOLDER = path.join(__dirname, 'uploads');
fs.ensureDirSync(UPLOADS_FOLDER);
app.use('/uploads', express.static(UPLOADS_FOLDER));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const config = fs.readJsonSync(CONFIG_FILE);

  if (username === config.admin.username && password === config.admin.password) {
    req.session.user = username;
    return res.redirect('/admin');
  }
  res.send("Wrong login! <a href='/login'>Try again</a>");
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});
app.get('/admin', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin.html'));
});


app.post('/api/admin/change-credentials', checkAuth, (req, res) => {
  const { oldUsername, oldPassword, newUsername, newPassword } = req.body;
  const config = fs.readJsonSync(CONFIG_FILE);

  if (oldUsername !== config.admin.username || oldPassword !== config.admin.password) {
    return res.status(400).json({ error: 'Old credentials are incorrect' });
  }

  config.admin.username = newUsername || config.admin.username;
  config.admin.password = newPassword || config.admin.password;

  fs.writeJsonSync(CONFIG_FILE, config, { spaces: 2 });
  res.json({ ok: true, message: 'Credentials updated successfully' });
});
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/products.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/checkout.html'));
});
app.get('/api/products', (req, res) => {
  const db = fs.readJsonSync(DB_FILE);
  res.json(db.products);
});

app.post('/api/admin/products', checkAuth, upload.array('images', 5), (req, res) => {
  try {
    const { title, price, description, description2, type,typee, discountPrice } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'Title and price required' });

    const images = (req.files || []).map(f => '/uploads/' + f.filename);

    const db = fs.readJsonSync(DB_FILE);
    const product = {
      id: uuidv4(),
      title,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      description: description || '',
      description2: description2 || '',
      type: type || '',
      typee: typee || '',
      images,
    
       createdAt: new Date().toISOString()
    };

    db.products.unshift(product);
    fs.writeJsonSync(DB_FILE, db, { spaces: 2 });

    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.delete('/api/admin/products/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const db = fs.readJsonSync(DB_FILE);

  const product = db.products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  product.images.forEach(img => {
    const imgPath = path.join(__dirname, img.replace('/uploads/', 'uploads/'));
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  });

  db.products = db.products.filter(p => p.id !== id);
  fs.writeJsonSync(DB_FILE, db, { spaces: 2 });

  res.json({ ok: true });
});
app.post('/api/order', (req, res) => {
  const { name, phone, address, productId, quantity } = req.body;
  const db = fs.readJsonSync(ORDER_FILE);

  const order = {
    id: uuidv4(),
    name, phone, address, productId,
    quantity: Number(quantity) || 1,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  fs.writeJsonSync(ORDER_FILE, db, { spaces: 2 });
  res.json({ ok: true, order });
});









// FILES

const UI_FILE = path.join(__dirname, 'ui.json');
const LOGO_DIR = path.join(__dirname, 'logo-img');

if (!fs.existsSync(LOGO_DIR)) fs.mkdirSync(LOGO_DIR);

if (!fs.existsSync(UI_FILE)) {
  fs.writeJsonSync(UI_FILE, {
    siteName: "REDBOX",
    logo: "/logo-img/default-logo.png",
    backgroundColor: "#ffffff",
    fontColor: "#111827",
    accentColor: "#dc2626",
    headerText: "Your trusted store for the best products."
  }, { spaces: 2 });
}

app.use('/logo-img', express.static(LOGO_DIR));

// ----- Helper to get absolute path -----
// function getAbsLogoPath(publicUrl) {
//   if (!publicUrl) return null;
//   const clean = publicUrl.replace(/^\//, "");
//   return path.join(__dirname, clean);
// }

const uploade = multer({ dest: 'temp/' });

app.get('/api/settings', (req, res) => {
  try {
    const ui = fs.readJsonSync(UI_FILE);
    res.json(ui);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/admin/settings', checkAuth, (req, res) => {
  try {
    const ui = fs.readJsonSync(UI_FILE);
    res.json(ui);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/admin/settings', checkAuth, (req, res) => {
  try {
    const ui = fs.readJsonSync(UI_FILE);
    const allowed = ['siteName', 'logo', 'backgroundColor', 'fontColor', 'accentColor', 'headerText'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) ui[key] = req.body[key];
    });
    fs.writeJsonSync(UI_FILE, ui, { spaces: 2 });
    res.json({ ok: true, ui });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/admin/upload-logo', checkAuth, uploade.single('logo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ui = fs.readJsonSync(UI_FILE);


    const ext = path.extname(req.file.originalname); 
    const filename = "logo" + ".png";
    const savePath = path.join(LOGO_DIR, filename);

    if (fs.existsSync(savePath)) fs.unlinkSync(savePath);

    fs.renameSync(req.file.path, savePath);

    ui.logo = "/logo-img/" + filename;
    ui.logoVersion = Date.now();
    fs.writeJsonSync(UI_FILE, ui, { spaces: 2 });

    res.json({ ok: true, logo: ui.logo });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const BANNER_DIR = path.join(__dirname, "banner-img");
if (!fs.existsSync(BANNER_DIR)) fs.mkdirSync(BANNER_DIR);

app.use('/banner-img', express.static(BANNER_DIR));

const uploadBanner = multer({ dest: "temp/" });

app.post("/api/admin/upload-banner", checkAuth, uploadBanner.single("banner"), (req, res) => {
  try {
    const { id } = req.body;
    
    if (!req.file || !id) return res.status(400).json({ error: "Bad request" });

    const ui = fs.readJsonSync(UI_FILE);

    if (ui[id] && ui[id].startsWith("/banner-img/")) {
      const oldPath = path.join(__dirname, ui[id]);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const newFile = Date.now() + "-" + req.file.originalname;
    fs.renameSync(req.file.path, path.join(BANNER_DIR, newFile));

    ui[id] = "/banner-img/" + newFile;
    fs.writeJsonSync(UI_FILE, ui, { spaces: 2 });

    res.json({ ok: true, banner: ui[id] });

  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
app.post("/api/admin/delete-banner", checkAuth, (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Bad request" });

    const ui = fs.readJsonSync(UI_FILE);

    if (ui[id] && ui[id].startsWith("/banner-img/")) {
      const imgPath = path.join(__dirname, ui[id]);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    ui[id] = null;
    fs.writeJsonSync(UI_FILE, ui, { spaces: 2 });

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});





app.post('/api/admin/logo-set', checkAuth, (req, res) => {
  try {
    const { type, value } = req.body;
    const ui = fs.readJsonSync(UI_FILE);

    // if (type === "url") {
    //   ui.logo = value; // image URL
    //   fs.writeJsonSync(UI_FILE, ui, { spaces: 2 });
    //   return res.json({ ok: true, logo: value });
    // }

   if (type === "svg") {
    const filename = "logo" + ".svg";
    const savePath = path.join(LOGO_DIR, filename);

    fs.writeFileSync(savePath, value, "utf8");

    ui.logo = "/logo-img/" + filename; // <-- مسار فعلي
      ui.logoVersion = Date.now();
    fs.writeJsonSync(UI_FILE, ui, { spaces: 2 });

    return res.json({ ok: true, logo: ui.logo });
}

    res.status(400).json({ error: "Invalid type" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});


// ---------------------------------------------------





const CATEGORY_FILE = path.join(__dirname, "category.json");

app.get("/api/categories", (req, res) => {
  try {
    const cat = fs.readJsonSync(CATEGORY_FILE);
    res.json(cat.categories || []);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/categories", checkAuth, (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name required" });

    const cat = fs.readJsonSync(CATEGORY_FILE);
    if (!cat.categories.includes(name)) {
      cat.categories.push(name);
      fs.writeJsonSync(CATEGORY_FILE, cat, { spaces: 2 });
    }
    res.json({ ok: true, categories: cat.categories });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.delete("/api/categories", checkAuth, (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name required" });

    const cat = fs.readJsonSync(CATEGORY_FILE);
    const index = cat.categories.indexOf(name);
    if (index !== -1) {
      cat.categories.splice(index, 1);
      fs.writeJsonSync(CATEGORY_FILE, cat, { spaces: 2 });
    }
    res.json({ ok: true, categories: cat.categories });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});






// chomedia
const SOCIAL_FILE = path.join(__dirname, "chomedai.json");

if (!fs.existsSync(SOCIAL_FILE)) {
  fs.writeJsonSync(SOCIAL_FILE, {
    socials: { email:"", support:"", whatsapp:"", instagram:"", facebook:"" }
  }, { spaces: 2 });
}

app.get("/api/socials", (req, res) => {
  const data = fs.readJsonSync(SOCIAL_FILE);
  res.json(data.socials);
});

app.post("/api/admin/socials", checkAuth, (req, res) => {
  const data = fs.readJsonSync(SOCIAL_FILE);
  data.socials = { ...data.socials, ...req.body };
  fs.writeJsonSync(SOCIAL_FILE, data, { spaces: 2 });
  res.json({ ok: true });
});
//...............................................

const BANNER_TEXT_FILE = path.join(__dirname, "banner.json");

if (!fs.existsSync(BANNER_TEXT_FILE)) {
  fs.writeJsonSync(BANNER_TEXT_FILE, {
    enabled: true,
    text: "",
    background: "#000000",
    color: "#ffffff",
    speed: 15
  }, { spaces: 2 });
}

app.get("/api/top-banner", (req, res) => {
  const data = fs.readJsonSync(BANNER_TEXT_FILE);
  res.json(data);
});

app.post("/api/admin/top-banner", checkAuth, (req, res) => {
  const data = fs.readJsonSync(BANNER_TEXT_FILE);
  Object.assign(data, req.body);
  fs.writeJsonSync(BANNER_TEXT_FILE, data, { spaces: 2 });
  res.json({ ok: true });
});
  
//...............................................


app.get('/api/admin/orders', checkAuth, (req, res) => {
  const db = fs.readJsonSync(ORDER_FILE);
  res.json(db.orders);
});

app.delete('/api/admin/orders/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const db = fs.readJsonSync(ORDER_FILE);
  db.orders = db.orders.filter(o => o.id !== id);
  fs.writeJsonSync(ORDER_FILE, db, { spaces: 2 });
  res.json({ ok: true });
});
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
