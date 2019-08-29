!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).WorkerTimer=e()}}(function(){return function o(i,s,l){function u(r,e){if(!s[r]){if(!i[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(f)return f(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var a=s[r]={exports:{}};i[r][0].call(a.exports,function(e){var t=i[r][1][e];return u(t||e)},a,a.exports,o,i,s,l)}return s[r].exports}for(var f="function"==typeof require&&require,e=0;e<l.length;e++)u(l[e]);return u}({1:[function(e,r,t){(function(e){"use strict";var t,n,a,o;e===e.window&&e.URL&&e.Blob&&e.Worker?r.exports=(t=["var timerIds = {}, _ = {};","_.setInterval = function(args) {","  timerIds[args.timerId] = setInterval(function() { postMessage(args.timerId); }, args.delay);","};","_.clearInterval = function(args) {","  clearInterval(timerIds[args.timerId]);","};","_.setTimeout = function(args) {","  timerIds[args.timerId] = setTimeout(function() { postMessage(args.timerId); }, args.delay);","};","_.clearTimeout = function(args) {","  clearTimeout(timerIds[args.timerId]);","};","onmessage = function(e) { _[e.data.type](e.data) };"].join(""),n=0,a={},(o=new e.Worker(e.URL.createObjectURL(new e.Blob([t],{type:"text/javascript"})))).onmessage=function(e){a[e.data]&&a[e.data].callback.apply(null,a[e.data].params)},{setInterval:function(e,t){var r=Array.prototype.slice.call(arguments,2);return n+=1,o.postMessage({type:"setInterval",timerId:n,delay:t}),a[n]={callback:e,params:r},n},setTimeout:function(e,t){var r=Array.prototype.slice.call(arguments,2);return n+=1,o.postMessage({type:"setTimeout",timerId:n,delay:t}),a[n]={callback:e,params:r},n},clearInterval:function(e){o.postMessage({type:"clearInterval",timerId:e}),a[e]=null},clearTimeout:function(e){o.postMessage({type:"clearTimeout",timerId:e}),a[e]=null}}):r.exports=e}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});
//worker-timer
var data2 = {};
var CryptoJS = CryptoJS || function(u, p) {
  var d = {},
    l = d.lib = {},
    s = function() {},
    t = l.Base = {
      extend: function(a) {
        s.prototype = this;
        var c = new s;
        a && c.mixIn(a);
        c.hasOwnProperty("init") || (c.init = function() {
          c.$super.init.apply(this, arguments)
        });
        c.init.prototype = c;
        c.$super = this;
        return c
      },
      create: function() {
        var a = this.extend();
        a.init.apply(a, arguments);
        return a
      },
      mixIn: function(a) {
        for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
        a.hasOwnProperty("toString") && (this.toString = a.toString)
      }
    },
    r = l.WordArray = t.extend({
      init: function(a, c) {
        a = this.words = a || [];
        this.sigBytes = c != p ? c : 4 * a.length
      },
      toString: function(a) {
        return (a || v).stringify(this)
      },
      concat: function(a) {
        var c = this.words,
          e = a.words,
          j = this.sigBytes;
        a = a.sigBytes;
        this.clamp();
        if (j % 4)
          for (var k = 0; k < a; k++) c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4);
        else if (65535 < e.length)
          for (k = 0; k < a; k += 4) c[j + k >>> 2] = e[k >>> 2];
        else c.push.apply(c, e);
        this.sigBytes += a;
        return this
      },
      clamp: function() {
        var a = this.words,
          c = this.sigBytes;
        a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);
        a.length = u.ceil(c / 4)
      }
    }),
    w = d.enc = {}
    b = w.Latin1 = {
      stringify: function(a) {
        var c = a.words;
        a = a.sigBytes;
        for (var e = [], j = 0; j < a; j++) e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
        return e.join("")
      },
      parse: function(a) {
        for (var c = a.length, e = [], j = 0; j < c; j++) e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
        return new r.init(e, c)
      }
    },
    x = w.Utf8 = {
      stringify: function(a) {
        try {
          return decodeURIComponent(escape(b.stringify(a)))
        } catch (c) {
          throw Error("Malformed UTF-8 data");
        }
      },
      parse: function(a) {
        return b.parse(unescape(encodeURIComponent(a)))
      }
    },
    q = l.BufferedBlockAlgorithm = t.extend({
      reset: function() {
        this._data = new r.init;
        this._nDataBytes = 0
      },
      _append: function(a) {
        "string" == typeof a && (a = x.parse(a));
        this._data.concat(a);
        this._nDataBytes += a.sigBytes
      },
      _process: function(a) {
        var c = this._data,
          e = c.words,
          j = c.sigBytes,
          k = this.blockSize,
          b = j / (4 * k),
          b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0);
        a = b * k;
        j = u.min(4 * a, j);
        if (a) {
          for (var q = 0; q < a; q += k) this._doProcessBlock(e, q);
          q = e.splice(0, a);
          c.sigBytes -= j
        }
        return new r.init(q, j)
      }
    });
  var n = d.algo = {};
  return d
}(Math);
(function() {
  var u = CryptoJS,
    p = u.lib.WordArray;
  u.enc.Base64 = {
    stringify: function(d) {
      var l = d.words,
        p = d.sigBytes,
        t = this._map;
      d.clamp();
      d = [];
      for (var r = 0; r < p; r += 3)
        for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++) d.push(t.charAt(w >>> 6 * (3 - v) & 63));
      if (l = t.charAt(64))
        for (; d.length % 4;) d.push(l);
      return d.join("")
    },
    parse: function(d) {
      var l = d.length,
        s = this._map,
        t = s.charAt(64);
      t && (t = d.indexOf(t), -1 != t && (l = t));
      for (var t = [], r = 0, w = 0; w < l; w++)
        if (w % 4) {
          var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4),
            b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4);
          t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4);
          r++
        }
      return p.create(t, r)
    },
    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  }
})();


CryptoJS.lib.Cipher || function(u) {
  var p = CryptoJS,
    d = p.lib,
    l = d.Base,
    s = d.WordArray,
    t = d.BufferedBlockAlgorithm,
    r = p.enc.Base64,
    v = d.Cipher = t.extend({
      cfg: l.extend(),
      createEncryptor: function(e, a) {
        return this.create(this._ENC_XFORM_MODE, e, a)
      },
      createDecryptor: function(e, a) {
        return this.create(this._DEC_XFORM_MODE, e, a)
      },
      init: function(e, a, b) {
        this.cfg = this.cfg.extend(b);
        this._xformMode = e;
        this._key = a;
        this.reset()
      },
      reset: function() {
        t.reset.call(this);
        this._doReset()
      },
      finalize: function(e) {
        e && this._append(e);
        return this._doFinalize()
      },
      _DEC_XFORM_MODE: 2,
      _createHelper: function(e) {
        return {
          encrypt: function(b, k, d) {
            return ("string" == typeof k ? c : a).encrypt(e, b, k, d)
          },
          decrypt: function(b, k, d) {
            return ("string" == typeof k ? c : a).decrypt(e, b, k, d)
          }
        }
      }
    });
  var b = p.mode = {},
    q = (d.BlockCipherMode = l.extend({
      createEncryptor: function(e, a) {
        return this.Encryptor.create(e, a)
      },
      createDecryptor: function(e, a) {
        return this.Decryptor.create(e, a)
      },
      init: function(e, a) {
        this._cipher = e;
        this._iv = a
      }
    })).extend();
  b = b.CBC = q;
  q = (p.pad = {}).Pkcs7 = {
    pad: function(a, b) {
      for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4) l.push(d);
      c = s.create(l, c);
      a.concat(c)
    },
    unpad: function(a) {
      a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
    }
  };
  d.BlockCipher = v.extend({
    reset: function() {
      v.reset.call(this);
      var a = this.cfg,
        b = a.iv,
        a = a.mode;
      if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
      else c = a.createDecryptor, this._minBufferSize = 1;
      this._mode = c.call(a, this, b && b.words)
    },
    _doProcessBlock: function(a, b) {
      this._mode.processBlock(a, b)
    },
    _doFinalize: function() {
      var a = this.cfg.padding;
      if (this._xformMode == this._ENC_XFORM_MODE) {
        a.pad(this._data, this.blockSize);
        var b = this._process(!0)
      } else b = this._process(!0), a.unpad(b);
      return b
    },
    blockSize: 4
  });
  var n = d.CipherParams = l.extend({
      init: function(a) {
        this.mixIn(a)
      },
      toString: function(a) {
        return (a || this.formatter).stringify(this)
      }
    }),
    b = (p.format = {}).OpenSSL = {
      stringify: function(a) {
        var b = a.ciphertext;
        a = a.salt;
        return (a ? s.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(r)
      },
      parse: function(a) {
        a = r.parse(a);
        var b = a.words;
        if (1398893684 == b[0] && 1701076831 == b[1]) {
          var c = s.create(b.slice(2, 4));
          b.splice(0, 4);
          a.sigBytes -= 16
        }
        return n.create({
          ciphertext: a,
          salt: c
        })
      }
    },
    a = d.SerializableCipher = l.extend({
      cfg: l.extend({ format: b }),
      encrypt: function(a, b, c, d) {
        d = this.cfg.extend(d);
        var l = a.createEncryptor(c, d);
        b = l.finalize(b);
        l = l.cfg;
        return n.create({
          ciphertext: b,
          key: c,
          iv: l.iv,
          algorithm: a,
          mode: l.mode,
          padding: l.padding,
          blockSize: a.blockSize,
          formatter: d.format
        })
      },
      decrypt: function(a, b, c, d) {
        d = this.cfg.extend(d);
        b = this._parse(b, d.format);
        return a.createDecryptor(c, d).finalize(b.ciphertext)
      },
      _parse: function(a, b) {
        return "string" == typeof a ? b.parse(a, this) : a
      }
    })
}();
(function() {
  for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++) a[c] = 128 > c ? c << 1 : c << 1 ^ 283;
  for (var e = 0, j = 0, c = 0; 256 > c; c++) {
    var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4,
      k = k >>> 8 ^ k & 255 ^ 99;
    l[e] = k;
    s[k] = e;
    var z = a[e],
      F = a[z],
      G = a[F],
      y = 257 * a[k] ^ 16843008 * k;
    t[e] = y << 24 | y >>> 8;
    r[e] = y << 16 | y >>> 16;
    w[e] = y << 8 | y >>> 24;
    v[e] = y;
    y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e;
    b[k] = y << 24 | y >>> 8;
    x[k] = y << 16 | y >>> 16;
    q[k] = y << 8 | y >>> 24;
    n[k] = y;
    e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1
  }
  var H = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
    d = d.AES = p.extend({
      _doReset: function() {
        for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)
          if (j < d) e[j] = c[j];
          else {
            var k = e[j - 1];
            j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24);
            e[j] = e[j - d] ^ k
          }
        c = this._invKeySchedule = [];
        for (d = 0; d < a; d++) j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>> 8 & 255]] ^ n[l[k & 255]]
      },
      encryptBlock: function(a, b) {
        this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l)
      },
      decryptBlock: function(a, c) {
        var d = a[c + 1];
        a[c + 1] = a[c + 3];
        a[c + 3] = d;
        this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s);
        d = a[c + 1];
        a[c + 1] = a[c + 3];
        a[c + 3] = d
      },
      _doCryptBlock: function(a, b, c, d, e, j, l, f) {
        for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++) var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++],
          s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++],
          t = d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++],
          n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++],
          g = q,
          h = s,
          k = t;
        q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++];
        s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++];
        t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++];
        n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++];
        a[b] = q;
        a[b + 1] = s;
        a[b + 2] = t;
        a[b + 3] = n
      }
    });
  u.AES = p._createHelper(d)
})();
CryptoJS.mode.ECB = function() {
  var a = CryptoJS.lib.BlockCipherMode.extend();
  a.Encryptor = a.extend({
    processBlock: function(a, b) {
      this._cipher.encryptBlock(a, b)
    }
  });
  a.Decryptor = a.extend({
    processBlock: function(a, b) {
      this._cipher.decryptBlock(a, b)
    }
  });
  return a
}();

String.prototype.escape = function() {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\n': '<br>'
  };
  return this.replace(/[&<>\n]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
};
String.prototype.hexEncode = function() {
  var hex = '';
  for (var i = 0; i < this.length; i++) {
    var c = this.charCodeAt(i);
    if (c > 0xFF) c -= 0x350;
    hex += c.toString(16) + ' ';
  }
  return hex;
};

String.prototype.hexDecode = function() {
  var hex = this.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

data2.COFFEE = {
  key: (_ = ([][
    []
  ] + [] + ![] + !![] + {}), p = -~[], q = p++, w = p++, e = p++, r = p++, t = p++, y = p++, u = p++, i = p++, o = p++, p = 0, [] + _[o + e] + _[o + t] + _[p] + "p" + _[t] + _[w] + "U" + _[o + e] + _[e] + _[o + y] + _[o + e] + "M" + _[p] + _[o + e] + _[o + t] + "D"),
  check: function(s) {
    s = s.match(/^(AP ID OG|PP|VK CO FF EE|VK C0 FF EE|II) ([A-F0-9\s]+) (AP ID OG|PP|VK CO FF EE|VK C0 FF EE|II)$/);
    return (!s || s.length !== 4) ? 0 : [(s[1] == "VK C0 FF EE" ? 1 : 0), s[2]];
  },
  decrypt: function(encrypted, key) {
    try {
      var c = data2.COFFEE.check(encrypted);
      if (!c) return null;//"NOT COㅋㅋEE ENCRYPTED"
      if (key) {
        key = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(key + "mailRuMustDie"), CryptoJS.enc.Utf8.parse(data2.COFFEE.key), {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
          keySize: 4
        }).toString().substr(0, 16)
      } else {
        key = data2.COFFEE.key;
      }
      return CryptoJS.AES.decrypt((c[1].split(" ").join("").hexDecode()), CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        keySize: 128 / 32
      }).toString(CryptoJS.enc.Utf8).escape();
    } catch (err) {
      return false;
    }
  },
  encrypt: function(decrypted, key) {
    let vkcoffee;
    if (key) {
      vkcoffee = 'VK C0 FF EE ';
      key = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(key + "mailRuMustDie"), CryptoJS.enc.Utf8.parse(data2.COFFEE.key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        keySize: 4
      }).toString().substr(0, 16)
    } else {
      vkcoffee = 'VK CO FF EE ';
      key = data2.COFFEE.key;
    }
    return vkcoffee + CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(decrypted), CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      keySize: 128 / 32
    }).toString().hexEncode().toUpperCase() + vkcoffee.trim();
  }
};//vkcoffee decryptor
var dec=function(msg,key){
	if(typeof(key)!=typeof(''))key='';
	let msg2=data2.COFFEE.decrypt(msg,key);
	let check=data2.COFFEE.encrypt(msg2,key);
	if(msg===check)return msg2;
	return null;
};
var enc=function(msg,key){
    if(typeof(key)!=typeof('')){return data2.COFFEE.encrypt(msg,'');}
    return data2.COFFEE.encrypt(msg,key);
};
var canBF=false,BFin=false;
function TTD(msg){
    let msg2=dec(msg);
    if(msg2!=null)return msg2;
	if(!BFin)init_BF(msg);
	if(BFin){canBF=true;for(let i=0;i<30;i++)BF(msg);}
}
document.getElementById('key').onmouseover=function(){document.getElementById('key').style.color='';}
document.getElementById('resDec').onmouseover=function(){document.getElementById('resDec').style.color='';}
document.getElementById('resEnc').onmouseover=function(){document.getElementById('resEnc').style.color='';}
function BF(msg){
    if(canBF){
        let k=gi;
        gi++;
		document.getElementById('key').value=keyss[k];
    	if(gi<keyss.length){
    		let msg2=dec(msg,keyss[k]);
    		if(!msg2!=null){
				gi=0;
				document.getElementById('key').style.color='#0F0';
				document.getElementById('key').value=keyss[k];
				document.getElementById('resDec').value=msg2;
				canBF=false;
				return;
			}
    	}else{
    		gi=0;
			document.getElementById('key').style.color='#F00';
			document.getElementById('key').value='Ключ не найден';
    		canBF=false;
    		return;
    	}
    	WorkerTimer.setTimeout(function(){BF(msg);},0);
    }
}
var stageBF=1;
function init_BF(msg){
	let was=true;
    switch(stageBF){
        case 1:
			document.getElementById('key').style.color='#0F0';
			document.getElementById('key').value='Инициализация 1/2';
            for(let i=0;i<=1e4;i++){
        		if(!(keyss.indexOf(i+'')+1))keyss.push(i+'');
            }
        break;
        case 2:
			document.getElementById('key').style.color='#0F0';
			document.getElementById('key').value='Инициализация 2/2';
            for(let i='0'.charCodeAt(0);i<='9'.charCodeAt(0);i++){
        		let key2=String.fromCharCode(i);
        		if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        		for(let i2='0'.charCodeAt(0);i2<='9'.charCodeAt(0);i2++){
        			let key2=String.fromCharCode(i)+String.fromCharCode(i2);
        			if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			for(let i3='0'.charCodeAt(0);i3<='9'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        			for(let i3='a'.charCodeAt(0);i3<='z'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        			for(let i3='A'.charCodeAt(0);i3<='Z'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        		}
        		
        		for(let i2='a'.charCodeAt(0);i2<='z'.charCodeAt(0);i2++){
        			let key2=String.fromCharCode(i)+String.fromCharCode(i2);
        			if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			for(let i3='0'.charCodeAt(0);i3<='9'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        			for(let i3='a'.charCodeAt(0);i3<='z'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        			for(let i3='A'.charCodeAt(0);i3<='Z'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        		}
        		
        		for(let i2='A'.charCodeAt(0);i2<='Z'.charCodeAt(0);i2++){
        			let key2=String.fromCharCode(i)+String.fromCharCode(i2);
        			if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			for(let i3='0'.charCodeAt(0);i3<='9'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        			for(let i3='a'.charCodeAt(0);i3<='z'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        			for(let i3='A'.charCodeAt(0);i3<='Z'.charCodeAt(0);i3++){
        				let key2=String.fromCharCode(i)+String.fromCharCode(i2)+String.fromCharCode(i3);
        				if(!(keyss.indexOf(key2)+1))keyss.push(key2);
        			}
        		}
            }
        break;
		default:
			was=false;
		break;
	}
	if(was){
		WorkerTimer.setTimeout(function(){init_BF(msg);},0);
	}else{
		BFin=true;
		TTD(msg);
	}
}
document.getElementById('actDec').onclick=function(){
	let key=document.getElementById('key').value;
	document.getElementById('resDec').value='';
	
	let msg=document.getElementById('dec').value.toUpperCase().match(/^.{0,}(AP ID OG|PP|VK CO FF EE|VK C0 FF EE|II) ([A-F0-9\s]+) (AP ID OG|PP|VK CO FF EE|VK C0 FF EE|II).{0,}$/);
	let tempDec=123;
	if(msg!=null){
		document.getElementById('dec').value=msg[1]+' '+msg[2]+' '+msg[3];
		tempDec=dec(msg[1]+' '+msg[2]+' '+msg[3],key);
	}
	if(tempDec===null){
		document.getElementById('resDec').style.color='#F00';
		document.getElementById('resDec').value="<Нужен ключ>";
		WorkerTimer.setTimeout(function(){document.getElementById('resDec').style.color='';},2e3);
	}else if(tempDec==123){
		document.getElementById('resDec').style.color='#F00';
		document.getElementById('resDec').value='<Ошибка в шифре>';
		WorkerTimer.setTimeout(function(){document.getElementById('resDec').style.color='';},2e3);
	}else{
		document.getElementById('resDec').style.color='#0F0';
		document.getElementById('resDec').value=tempDec;
		WorkerTimer.setTimeout(function(){document.getElementById('resDec').style.color='';},5e2);
	}
};
document.getElementById('actEnc').onclick=function(){
	let key=document.getElementById('key').value;
	
	document.getElementById('resEnc').style.color='#0F0';
	document.getElementById('resEnc').value=enc(document.getElementById('enc').value,key);
	WorkerTimer.setTimeout(function(){document.getElementById('resEnc').style.color='';},5e2);
};
var gi=0;
var keyss=[];
document.getElementById('act2').onclick=function(){
	document.getElementById('resDec').value='';
	let msg=document.getElementById('dec').value.toUpperCase().match(/^.{0,}(AP ID OG|PP|VK CO FF EE|VK C0 FF EE|II) ([A-F0-9\s]+) (AP ID OG|PP|VK CO FF EE|VK C0 FF EE|II).{0,}$/);
	if(msg!=null)TTD(msg[1]+' '+msg[2]+' '+msg[3]);
}
