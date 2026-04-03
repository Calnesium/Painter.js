// Painter.js 1.1.0
(function(w, d) {
 const dpr = w.devicePixelRatio || 1;
 const deg_to_rad = Math.PI / 180;
 
 class Painter {
  constructor(selector, w, h) {
   this._initialized = false;
   this._mode = "fill";
   this._templates = {};
   this._temp = null;
   this._prevcolor = "#000000";
   this._prevfillcolor = "#000000";
   this._prevstrokecolor = "#000000";
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
  
  // rotatefrom
  rotatefrom(x, y, angle) {
   const ctx = this.ctx;
   angle = angle * deg_to_rad;
   ctx.translate(x, y);
   ctx.rotate(angle);
   ctx.translate(-x, -y);
   
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
   if (color === this._prevcolor) return this;
   const ctx = this.ctx;
   ctx.fillStyle = color;
   ctx.strokeStyle = color;
   this._prevcolor = this._prevfillcolor = this._prevstrokecolor = color;

   return this;
  }
  
  // fillcolor
  fillcolor(color) {
   if (color === this._prevfillcolor) return this;
   const ctx = this.ctx;
   ctx.fillStyle = color;
   this._prevfillcolor = color;

   return this;
  }
  
  // strokecolor
  strokecolor(color) {
   if (color === this._prevstrokecolor) return this;
   const ctx = this.ctx;
   ctx.strokeStyle = color;
   this._prevstrokecolor = color;
 
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
  
  // ellipse
  ellipse(x, y, w, h, angle) {
   const temp = this._temp;
   
   if (angle !== undefined) angle *= deg_to_rad;
   else if (temp?.angle !== undefined) angle = temp.angle;
   else angle = 0;
   
   return {
    type: "ellipse",
    x: (x ?? temp?.x ?? 0),
    y: (y ?? temp?.y ?? 0),
    w: (w ?? temp?.w ?? 0),
    h: (h ?? temp?.h ?? 0),
    angle: (angle ?? temp?.angle ?? 0)
   };
  }
  
  // polygon
  polygon(x, y, vertices) {
   const temp = this._temp;
   
   vertices = Array.isArray(vertices) ? vertices : temp.vertices ? temp.vertices : [];
   
   if (!Array.isArray(vertices) || vertices.length < 6) throw new Error("Painter.js: polygon() fail. vertices must be equal or greater than 3.");
   
   return {
    type: "polygon",
    x: (x ?? temp.x ?? 0),
    y: (y ?? temp.y ?? 0),
    vertices: [...vertices]
   }
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
     
    case "ellipse":
     ctx.moveTo(obj.x + obj.w, obj.y);
     ctx.ellipse(obj.x, obj.y, obj.w, obj.h, obj.angle, 0, Math.PI * 2);
     break;
    
    case "line":
     ctx.moveTo(obj.x1, obj.y1);
     ctx.lineTo(obj.x2, obj.y2);
     
     ctx.stroke();
     
     return this;
   }
   
   mode === "stroke" ? ctx.stroke() : ctx.fill();
   
   return this;
  }
  
  // drawrect
  drawrect(rect) {
   const ctx = this.ctx;
   
   this._mode === "fill" ? ctx.fillRect(rect.x, rect.y, rect.w, rect.h) : ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
   
   return this;
  }
  
  // drawtext
  drawtext(text) {
   const ctx = this.ctx;
   
   this._mode === "fill" ? ctx.fillText(text.content, text.x, text.y) : ctx.strokeText(text.content, text.x, text.y);
   
   return this;
  }
  
  // drawimage
  drawimage(image) {
   const ctx = this.ctx;
   
   ctx.drawImage(image.img, image.x, image.y, image.w, image.h);
   
   return this;
  }
  
  // drawcircle
  drawcircle(circle) {
   const ctx = this.ctx;
   
   ctx.beginPath();
   ctx.moveTo(circle.x + circle.r, circle.y);
   ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
   
   this._mode === "fill" ? ctx.fill() : ctx.stroke();
   
   return this;
  }
  
  // drawellipse
  drawellipse(ellipse) {
   const ctx = this.ctx;
   
   ctx.beginPath();
   ctx.moveTo(ellipse.x + ellipse.w, ellipse.y);
   ctx.ellipse(ellipse.x, ellipse.y, ellipse.w, ellipse.h, ellipse.angle, 0, Math.PI * 2);
   
   this._mode === "fill" ? ctx.fill() : ctx.stroke();
   
   return this;
  }
  
  drawpolygon(polygon) {
   const ctx = this.ctx;
   const vertices = polygon.vertices;
   const x1 = polygon.x;
   const y1 = polygon.y;
   const len = vertices.length;
   
   ctx.beginPath();
   
   ctx.moveTo(x1 + vertices[0], y1 + vertices[1]);
   
   for (let i = 2; i < len; i+= 2) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    ctx.lineTo(x1 + x, y1 + y);
   }
   
   ctx.closePath();
   
   this._mode === "fill" ? ctx.fill() : ctx.stroke();
   
   return this;
  }
  
  // drawline
  drawline(line) {
   const ctx = this.ctx;
   
   ctx.beginPath();
   ctx.moveTo(line.x1, line.y1);
   ctx.lineTo(line.x2, line.y2);
   
   ctx.stroke();
   
   return this;
  }
  
  // drawmany
  drawmany(objs) {
   if (!Array.isArray(objs)) {
    throw new Error("Painter.js: drawmany() fail. objs must be an array.");
   }
   
   const ctx = this.ctx;
   const mode = this._mode;
   
   for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    if (obj.type === "rect") {
     mode === "fill" ? ctx.fillRect(obj.x, obj.y, obj.w, obj.h) : ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
     continue;
    } else if (obj.type === "text") {
     mode === "fill" ? ctx.fillText(obj.content, obj.x, obj.y) : ctx.strokeText(obj.content, obj.x, obj.y);
     continue;
    } else if (obj.type === "image") {
     ctx.drawImage(obj.img, obj.x, obj.y, obj.w, obj.h);
     continue;
    }
    
    ctx.beginPath();
    
    switch (obj.type) {
     case "circle":
      ctx.moveTo(obj.x + obj.r, obj.y);
      ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
      break;

     case "ellipse":
      ctx.moveTo(obj.x + obj.w, obj.y);
      ctx.ellipse(obj.x, obj.y, obj.w, obj.h, obj.angle, 0, Math.PI * 2);
      break;
      
     case "line":
      ctx.moveTo(obj.x1, obj.y1);
      ctx.lineTo(obj.x2, obj.y2);
      
      ctx.stroke();
      
      continue;
    }
    
    mode === "stroke" ? ctx.stroke() : ctx.fill();
   }
   
   return this;
  }
  
  // batch
  batch(objs) {
   if (!Array.isArray(objs)) {
    throw new Error("Painter.js: batch() fail. objs must be an array.");
   }
   
   const ctx = this.ctx;
   const mode = this._mode;
   
   ctx.beginPath();
   for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    
    if (obj.type === "line") {
     ctx.moveTo(obj.x1, obj.y1);
     ctx.lineTo(obj.x2, obj.y2);
     
     continue;
    }
   }
   ctx.stroke();
   
   ctx.beginPath();
   for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    
    if (obj.type === "line") continue;
    
    switch (obj.type) {
     case "rect":
      ctx.rect(obj.x, obj.y, obj.w, obj.h);
      
      continue;
     
     case "circle":
      ctx.moveTo(obj.x + obj.r, obj.y);
      ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
      
      continue;
     
     case "ellipse":
      ctx.moveTo(obj.x + obj.w, obj.y);
      ctx.ellipse(obj.x, obj.y, obj.w, obj.h, obj.angle, 0, Math.PI * 2);
      
      continue;
      
     case "text":
      mode === "fill" ? ctx.fillText(obj.content, obj.x, obj.y) : ctx.strokeText(obj.content, obj.x, obj.y);
      
      continue;
      
     case "image":
      ctx.drawImage(obj.img, obj.x, obj.y);
      
      continue;
    }
   }
   mode === "fill" ? ctx.fill() : ctx.stroke();
   
   return this;
  }
  
  // batchrect
  batchrect(rects) {
   if (!Array.isArray(rects)) throw new Error("Painter.js: batchrect() fail. rects must be an array.");
   
   const ctx = this.ctx;
   
   ctx.beginPath();
   
   for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
   }
   
   this._mode === "fill" ? ctx.fill() : ctx.stroke();
  }
  
  // clear
  clear() {
   const ctx = this.ctx;
   const canvas = this.canvas;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   
   return this;
  }
  
  // clearrect
  clearrect(rect) {
   const ctx = this.ctx;
   ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
   
   return this;
  }
 }
 
 w.Painter = Painter;
})(window, document);