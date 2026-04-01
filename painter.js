// Painter.js 1.0.0
(function(w, d) {
 const dpr = w.devicePixelRatio || 1;
 const deg_to_rad = Math.PI / 180;
 
 class Painter {
  constructor(selector, w, h) {
   this._initialized = false;
   this._mode = "fill";
   this._templates = {};
   this._temp = null;
   this.selector = selector;
   this.width = w;
   this.height = h;
   this.init();
  }
  
  // init
  init() {
   if (this._initialized) return this;
   
   try {
    this.canvas = typeof this.selector === "string" ? d.querySelector(this.selector) : this.selector;
   } catch {
    throw new Error("Painter.js: init() fail. Your selector is invalid.")
   }
   
   const canvas = this.canvas;
   if (canvas.nodeName !== "CANVAS") {
    throw new Error("Painter.js: init() fail. Your selector is valid, but is not a canvas element.");
   };
   
   const width = this.width;
   const height = this.height;
   
   this.ctx = canvas.getContext('2d');
   
   canvas.width = width * dpr;
   canvas.height = height * dpr;
   canvas.style.width = `${width}px`;
   canvas.style.height = `${height}px`;
   this.ctx.scale(dpr, dpr);
   
   this._initialized = true;
   
   return this;
  }
  
  // save
  save() {
   const ctx = this.ctx;
   ctx.save();
   
   return this;
  }
  
  // restore
  restore() {
   const ctx = this.ctx;
   ctx.restore();
   
   return this;
  }
  
  // scale
  scale(x, y) {
   const ctx = this.ctx;
   ctx.scale(x, y ?? x);
   
   return this;
  }
  
  // rotate
  rotate(angle) {
   const ctx = this.ctx;
   angle = angle * deg_to_rad;
   ctx.rotate(angle);
   
   return this;
  }
  
  // translate
  translate(x, y) {
   const ctx = this.ctx;
   ctx.translate(x, y);
   
   return this;
  }
  
  // fill
  fill() {
   this._mode = "fill";
   
   return this;
  }
  
  // stroke
  stroke() {
   this._mode = "stroke";
   
   return this;
  }
  
  // color
  color(color) {
   const ctx = this.ctx;
   ctx.fillStyle = color;
   ctx.strokeStyle = color;

   return this;
  }
  
  // fillcolor
  fillcolor(color) {
   const ctx = this.ctx;
   ctx.fillStyle = color;

   return this;
  }
  
  // strokecolor
  strokecolor(color) {
   const ctx = this.ctx;
   ctx.strokeStyle = color;
 
   return this;
  }
  
  // alpha
  alpha(a) {
   const ctx = this.ctx;
   ctx.globalAlpha = a;
   
   return this;
  }
  
  // linewidth
  linewidth(w) {
   const ctx = this.ctx;
   ctx.lineWidth = w;
   
   return this;
  }
  
  // linecap
  linecap(cap) {
   const ctx = this.ctx;
   ctx.lineCap = cap;
   
   return this;
  }
  
  // linejoin
  linejoin(join) {
   const ctx = this.ctx;
   ctx.lineJoin = join;
   
   return this;
  }
  
  // font
  font(font) {
   const ctx = this.ctx;
   ctx.font = font;
   
   return this;
  }
  
  // addtemp
  addtemp(name, temp) {
   this._templates[name] = temp;
   
   return this;
  }
  
  // usetemp
  usetemp(name) {
   this._temp = this._templates[name];
   
   return this;
  }
  
  // removetemp
  removetemp(name) {
   let temp = this._templates[name];
   if (this._temp === temp) {
    this._temp = null;
   }
   temp = null;
   
   return this;
  }
  
  // changetemp
  changetemp(name, key, val) {
   const temp = this._templates[name];
   if (!temp) return;
   temp[key] = val;
   
   return this;
  }
  
  // cleartemp
  cleartemp() {
   this._temp = null;
   
   return this;
  }
  
  // rect
  rect(x, y, w, h) {
   const temp = this._temp;
   
   return { 
    type: "rect",
    x: (x ?? temp?.x ?? 0),
    y: (y ?? temp?.y ?? 0),
    w: (w ?? temp?.w ?? 0),
    h: (h ?? temp?.h ?? 0)
   };
  }
  
   // line
  line(x1, y1, x2, y2) {
   const temp = this._temp;
   
   return {
    type: "line",
    x1: (x1 ?? temp?.x1 ?? 0),
    y1: (y1 ?? temp?.y1 ?? 0),
    x2: (x2 ?? temp?.x2 ?? 0),
    y2: (y2 ?? temp?.y2 ?? 0)
   };
  }
  
  // circle
  circle(x, y, r) {
   const temp = this._temp;
   
   return {
    type: "circle",
    x: (x ?? temp?.x ?? 0),
    y: (y ?? temp?.y ?? 0),
    r: (r ?? temp?.r ?? 0)
   };
  }
  
  // text
  text(content, x, y) {
   const temp = this._temp;
   
   return {
    type: "text",
    content: (content || temp?.content || "Hello World"),
    x: (x ?? temp?.x ?? 0),
    y: (y ?? temp?.y ?? 0)
   };
  }
  
  // image
  image(img, x, y, w, h) {
   const temp = this._temp;
   
   return {
    type: "image",
    img: (img || temp?.img || new Image()),
    x: (x ?? temp?.x ?? 0),
    y: (y ?? temp?.y ?? 0),
    w: (w ?? temp?.w ?? 0),
    h: (h ?? temp?.h ?? 0)
   };
  }
  
  // draw
  draw(obj) {
   const ctx = this.ctx;
   const mode = this._mode;
   
   if (obj.type === "rect") {
    mode === "fill" ? ctx.fillRect(obj.x, obj.y, obj.w, obj.h) : ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
    return this;
   } else if (obj.type === "text") {
    mode === "fill" ? ctx.fillText(obj.content, obj.x, obj.y) : ctx.strokeText(obj.content, obj.x, obj.y);
    return this;
   } else if (obj.type === "image") {
    ctx.drawImage(obj.img, obj.x, obj.y, obj.w, obj.h);
    return this;
   }
   
   ctx.beginPath();
   
   switch (obj.type) {
    case "circle":
     ctx.moveTo(obj.x + obj.r, obj.y);
     ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
     break;
    
    case "line":
     ctx.moveTo(obj.x1, obj.y1);
     ctx.lineTo(obj.x2, obj.y2);
     break;
   }
   
   (mode === "stroke" || obj.type === "line") ? ctx.stroke() : ctx.fill();
   
   return this;
  }
  
  // clear
  clear() {
   const ctx = this.ctx;
   ctx.clearRect(0, 0, this.width, this.height);
   
   return this;
  }
 }
 
 w.Painter = Painter;
})(window, document);