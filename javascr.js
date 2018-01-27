var example = document.getElementById("Game"),
    ctx = example.getContext('2d');

var message = "";

function clickIE() {
    if (document.all) {
        (message);
        return false;
    }
}

function clickNS(e) {
    if (document.layers || (document.getElementById && !document.all)) {
        if (e.which == 2) {
            (message);
            return false;
        }
    }
}
if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown = clickNS;
} else {
    document.onmouseup = clickNS;
    document.oncontextmenu = clickIE;
}
document.oncontextmenu = new Function("return false");

var pic = [];
pic[0] = new Image();
pic[0].src = "Blocks.png";
pic[1] = new Image();
pic[1].src = "Skins.png";
var x=[0], y=[0], currentObj = 0, startx = 0, starty = 0;
var oldKey;
var mX, mY, block = 0,
    blockId = [],
    x2 = [],
    y2 = [],
    areax = [],
    areay = [];
var changex = [],
    changey = [],
    changeAllow = [],
    changeAllow2 = [];
var timer, timer2;
var testing = false;
var xx, yy;
var changePos = [];
var tel1 = [],
    tel2 = [];
var step = 1;
var caption = 0;

var changed = [];
var changed2 = [];
var tok = [false, false, false, false, false, false, false, false, false];
var tt = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var bok = [false, false, false, false, false, false, false, false, false];
var trans = [];
var over = false;

var texts = [],
    xtext = [],
    ytext = [],
    ctext = {
        R: [],
        G: [],
        B: [],
        A: []
    },
    ftext = [],
    ptext = []; //text,xcoord,ycoord,color,font,px.

window.onload = function() {
    game();
    doors();
    window.onkeydown = processKey;
    window.onmouseup = creating;
    window.onmousedown = changingone;
    window.onmousemove = changingtwo;
    example.onmouseover = prc;
    example.onmouseout = prc2;
    document.getElementById("selecter").getContext('2d').drawImage(pic[0], block * 25, 0, 25, 25, 0, 0, 50, 50);
    document.getElementById("value").innerHTML = "Off";
    document.getElementById("value").style.color = "#f00";
}

function prc(e) {
    over = true;
}

function prc2(e) {
    over = false;
}

document.getElementById("ok").onclick = function() {
    if (texts[document.getElementById("txid").value] != "" && texts[document.getElementById("txid").value] != " " && (document.getElementById("txid").value <= 99 && document.getElementById("txid").value >= 0)) {
        texts[document.getElementById("txid").value] = document.getElementById("txname").value;
        xtext[document.getElementById("txid").value] = document.getElementById("Xtext").value;
        ytext[document.getElementById("txid").value] = document.getElementById("Ytext").value;
        ctext.R[document.getElementById("txid").value] = document.getElementById("Rcolor").value;
        ctext.G[document.getElementById("txid").value] = document.getElementById("Gcolor").value;
        ctext.B[document.getElementById("txid").value] = document.getElementById("Bcolor").value;
        ctext.A[document.getElementById("txid").value] = document.getElementById("Acolor").value;
        ftext[document.getElementById("txid").value] = document.getElementById("Font").value;
        ptext[document.getElementById("txid").value] = document.getElementById("Sizet").value;
    } else {
        texts[document.getElementById("txid").value] = undefined;
        xtext[document.getElementById("txid").value] = undefined;
        ytext[document.getElementById("txid").value] = undefined;
        ctext.R[document.getElementById("txid").value] = undefined;
        ctext.G[document.getElementById("txid").value] = undefined;
        ctext.B[document.getElementById("txid").value] = undefined;
        ctext.A[document.getElementById("txid").value] = undefined;
        ftext[document.getElementById("txid").value] = undefined;
        ptext[document.getElementById("txid").value] = undefined;
    }
}

function doors() {
    for (var i = 0; i < bok.length; i++) {
        if (bok[i] == true && tt[i] < 10000) {
            tt[i] += 1;
        } else if (bok[i] == false && tt[i] > 0) {
            tt[i] -= 1;
        }
    }
    timer2 = setTimeout("doors()", 1);
}

function processKey(e){
    if (testing == true) {
		if(e.keyCode == 13 && oldKey != 16){
		  for (var i = 0; i < x.length; i++) {
			if(x[i]==xx && y[i]==yy){currentObj=i;}
		  }
		}
	    e = e || window.event;
        if (e.shiftKey && e.keyCode == 13) {
		  x[x.length]=startx;
		  y[y.length]=starty;
		  currentObj=x.length-1;
        }
        goxl = false;
        goyu = false;
        goxr = false;
        goyd = false;
        teleported = false;
        i3 = -1;
        for (var i = 0; i < blockId.length; i++) {
            if (e.keyCode == 37 && x[currentObj] - 25 >= x2[i] && x[currentObj] - 25 < x2[i] + areax[i] && y[currentObj] >= y2[i] && y[currentObj] < y2[i] + areay[i] && blockId[i] > 0 && blockId[i] < 8) {
                kkk = false;
                for (var i2 = 0; i2 < changed2.length; i2++) {
                    if (i == changed[i2] && (tt[changed2[i2]] > 0 || tok[changed2[i2]] == true) && blockId[i] == 7) {
                        kkk = true;
                    }
                }
                if (kkk == false && trans[i] == 0) {
                    goxl = true;
                }
                if (blockId[i] == 3) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                if (blockId[i] == 2) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                for (var i2 = 0; i2 < tel1.length; i2++) {
                    if (i == tel1[i2] && tel1.length == tel2.length) {
                        x[currentObj] = x2[tel2[i2]];
                        y[currentObj] = y2[tel2[i2]];
                        teleported = true;
                        break;
                    }
                }
                i3 = i;
            }
            if (e.keyCode == 38 && y[currentObj] - 25 >= y2[i] && y[currentObj] - 25 < y2[i] + areay[i] && x[currentObj] >= x2[i] && x[currentObj] < x2[i] + areax[i] && blockId[i] > 0 && blockId[i] < 8) {
                kkk = false;
                for (var i2 = 0; i2 < changed2.length; i2++) {
                    if (i == changed[i2] && (tt[changed2[i2]] > 0 || tok[changed2[i2]] == true) && blockId[i] == 7) {
                        kkk = true;
                    }
                }
                if (kkk == false && trans[i] == 0) {
                    goyu = true;
                }
                if (blockId[i] == 3) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                if (blockId[i] == 2) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                for (var i2 = 0; i2 < tel1.length; i2++) {
                    if (i == tel1[i2] && tel1.length == tel2.length) {
                        x[currentObj] = x2[tel2[i2]];
                        y[currentObj] = y2[tel2[i2]];
                        teleported = true;
                        break;
                    }
                }
                i3 = i;
            }
            if (e.keyCode == 39 && x[currentObj] + 25 >= x2[i] && x[currentObj] + 25 < x2[i] + areax[i] && y[currentObj] >= y2[i] && y[currentObj] < y2[i] + areay[i] && blockId[i] > 0 && blockId[i] < 8) {
                kkk = false;
                for (var i2 = 0; i2 < changed2.length; i2++) {
                    if (i == changed[i2] && (tt[changed2[i2]] > 0 || tok[changed2[i2]] == true) && blockId[i] == 7) {
                        kkk = true;
                    }
                }
                if (kkk == false && trans[i] == 0) {
                    goxr = true;
                }
                if (blockId[i] == 3) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                if (blockId[i] == 2) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                for (var i2 = 0; i2 < tel1.length; i2++) {
                    if (i == tel1[i2] && tel1.length == tel2.length) {
                        x[currentObj] = x2[tel2[i2]];
                        y[currentObj] = y2[tel2[i2]];
                        teleported = true;
                        break;
                    }
                }
                i3 = i;
            }
            if (e.keyCode == 40 && y[currentObj] + 25 >= y2[i] && y[currentObj] + 25 < y2[i] + areay[i] && x[currentObj] >= x2[i] && x[currentObj] < x2[i] + areax[i] && blockId[i] > 0 && blockId[i] < 8) {
                kkk = false;
                for (var i2 = 0; i2 < changed2.length; i2++) {
                    if (i == changed[i2] && (tt[changed2[i2]] > 0 || tok[changed2[i2]] == true) && blockId[i] == 7) {
                        kkk = true;
                    }
                }
                if (kkk == false && trans[i] == 0) {
                    goyd = true;
                }
                if (blockId[i] == 3) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                if (blockId[i] == 2) {
                    x[currentObj] = startx;
                    y[currentObj] = starty;
                }
                for (var i2 = 0; i2 < tel1.length; i2++) {
                    if (i == tel1[i2] && tel1.length == tel2.length) {
                        x[currentObj] = x2[tel2[i2]];
                        y[currentObj] = y2[tel2[i2]];
                        teleported = true;
                        break;
                    }
                }
                i3 = i;
            }
        }
        if (goxl == false || (goxl == true && teleported == false && blockId[i3] == 1)) {
            x[currentObj] += e.keyCode == 37 ? -25 : 0;
        }
        if (goyu == false || (goyu == true && teleported == false && blockId[i3] == 1)) {
            y[currentObj] += e.keyCode == 38 ? -25 : 0;
        }
        if (goxr == false || (goxr == true && teleported == false && blockId[i3] == 1)) {
            x[currentObj] += e.keyCode == 39 ? 25 : 0;
        }
        if (goyd == false || (goyd == true && teleported == false && blockId[i3] == 1)) {
            y[currentObj] += e.keyCode == 40 ? 25 : 0;
        }
    }
    if (over == true) {
        for (var i = 0; i < changed.length; i++) {
            if (xx >= x2[changed[i]] && xx < x2[changed[i]] + areax[changed[i]] && yy >= y2[changed[i]] && yy < y2[changed[i]] + areay[changed[i]]) {
                if (e.keyCode == 82) {
                    changed2[i] = 1;
                } else if (e.keyCode == 71) {
                    changed2[i] = 2;
                } else if (e.keyCode == 66 && changed2[i] != 3) {
                    changed2[i] = 3;
                } else if (e.keyCode == 66) {
                    changed2[i] = 4;
                } else if (e.keyCode == 87) {
                    changed2[i] = 5;
                } else if (e.keyCode == 89) {
                    changed2[i] = 6;
                } else if (e.keyCode == 65) {
                    changed2[i] = 7;
                } else if (e.keyCode == 80) {
                    changed2[i] = 8;
                }
                break;
            }
        }
        if (e.keyCode == 72) {
            for (var i = 0; i < blockId.length; i++) {
                if (blockId[i] < 7 && blockId[i] > 3 && trans[i] == 0 && xx >= x2[i] && xx < x2[i] + areax[i] && yy >= y2[i] && yy < y2[i] + areay[i]) {
                    trans[i] = 1;
                } else if (blockId[i] < 7 && blockId[i] > 3 && trans[i] == 1 && xx >= x2[i] && xx < x2[i] + areax[i] && yy >= y2[i] && yy < y2[i] + areay[i]) {
                    trans[i] = 0;
                }
            }
        }
        if (e.keyCode == 46) {
            kkk = 0;
            k = 0;
            k1 = 0;
            for (var i = 0; i < blockId.length; i++) {
                kk = false;
                if (xx >= x2[i] && xx < x2[i] + areax[i] && yy >= y2[i] && yy < y2[i] + areay[i]) {
                    if (i < changed[0]) {
                        for (var i2 = 0; i2 < changed.length; i2++) {
                            changed[i2] -= 1;
                        }
                    } else if (i > changed[changed.length - 1]) {} else {
                        for (var i2 = 0; i2 < changed.length; i2++) {
                            if (i == changed[i2]) {
                                k += 1;
                                for (var i3 = i2; i3 < changed.length; i3++) {
                                    changed2[i3] = changed2[i3 + 1];
                                    changed[i3] = changed[i3 + 1] - 1;
                                }
                                break;
                            }
                            if (i > changed[i2]) {
                                if (i < changed[i2 + 1]) {
                                    for (var i3 = i2 + 1; i3 < changed.length; i3++) {
                                        changed[i3] -= 1;
                                    }
                                    break;
                                }
                            }
                        }
                    }
					var mg = false;
					for(var i2 = 0; i2 < tel2.length; i2++){
					  if(mg <= tel2[i2]){mg=true;}
					  if(mg <= tel1[i2]){mg=true;}
					}
					if(mg==true){
					  for(var i2 = 0; i2 < tel2.length; i2++){
						  if(tel2[i2] == i){
							  var ks = true;
							  while(ks!=false){
								ks=false;
								if(tel2[i2] == i){
								ks=true;
								k1+=1;
							    for(var i3 = i2; i3 < tel2.length; i3++){
								    tel2[i3]=tel2[i3+1];
								    tel1[i3]=tel1[i3+1];
							    }
								}
							  }
						  }
						  else if(tel1[i2] == i){
							k1+=1;
							for(var i3 = i2; i3 < tel2.length; i3++){
								tel2[i3]=tel2[i3+1];
								tel1[i3]=tel1[i3+1];
							}
						  }
						  if(tel2[i2] > i){tel2[i2]-=1;}
						  if(tel1[i2] > i){tel1[i2]-=1;}
					  }
					}
                    for (var i2 = i; i2 < blockId.length; i2++) {
                        blockId[i2] = blockId[i2 + 1];
                        trans[i2] = trans[i2 + 1];
                        x2[i2] = x2[i2 + 1];
                        y2[i2] = y2[i2 + 1];
                        areax[i2] = areax[i2 + 1];
                        areay[i2] = areay[i2 + 1];
                    }
                    kk = true;
                }
                if (kk == true) {
                    kkk += 1;
                }
            }
            blockId.length -= kkk;
            x2.length -= kkk;
            y2.length -= kkk;
            areax.length -= kkk;
            areay.length -= kkk;
            changed2.length -= k;
            changed.length -= k;
            tel1.length -= k1;
            tel2.length -= k1;
            trans.length -= kkk;
        }
        if (e.keyCode - 48 >= 0 && e.keyCode < 58) {
            block = e.keyCode - 48;
            document.getElementById("selecter").getContext('2d').clearRect(0, 0, document.getElementById("selecter").width, document.getElementById("selecter").height);
            document.getElementById("selecter").getContext('2d').drawImage(pic[0], block * 25, 0, 25, 25, 0, 0, 50, 50);
        }
        if (e.keyCode == 84) {
			x.length=1;
			y.length=1;
			currentObj=0;
            testing = testing == true ? false : true;
            if (testing == true) {
                document.getElementById("value").innerHTML = "On";
                document.getElementById("value").style.color = "#0f0";
            } else {
                document.getElementById("value").innerHTML = "Off";
                document.getElementById("value").style.color = "#f00";
            }
            starting();
        }
    }
}

document.getElementById("export").onclick = function exp(e) {
    var b = "";
    var g = true;
    if (blockId.length > 0) {
        b += blockId[0];
        for (var i = 1; i < blockId.length; i++) {
            b += ",";
            b += blockId[i];
        }
    }
    b += ";";
    if (x2.length > 0) {
        b += x2[0];
        for (var i = 1; i < x2.length; i++) {
            b += ",";
            b += x2[i];
        }
    }
    b += ";";
    if (y2.length > 0) {
        b += y2[0];
        for (var i = 1; i < y2.length; i++) {
            b += ",";
            b += y2[i];
        }
    }
    b += ";";
    if (areax.length > 0) {
        b += areax[0];
        for (var i = 1; i < areax.length; i++) {
            b += ",";
            b += areax[i];
        }
    }
    b += ";";
    if (areay.length > 0) {
        b += areay[0];
        for (var i = 1; i < areay.length; i++) {
            b += ",";
            b += areay[i];
        }
    }
    b += ";";
    if (changed.length > 0) {
        b += changed[0];
        for (var i = 1; i < changed.length; i++) {
            b += ",";
            b += changed[i];
        }
    }
    b += ";";
    if (changed2.length > 0) {
        b += changed2[0];
        for (var i = 1; i < changed2.length; i++) {
            b += ",";
            b += changed2[i];
        }
    }
    b += ";";
    if (trans.length > 0) {
        b += trans[0];
        for (var i = 1; i < trans.length; i++) {
            b += ",";
            b += trans[i];
        }
    }
    b += ";";
    if (tel1.length > 0) {
        b += tel1[0];
        for (var i = 1; i < tel1.length; i++) {
            b += ",";
            b += tel1[i];
        }
    }
    b += ";";
    if (tel2.length > 0) {
        b += tel2[0];
        for (var i = 1; i < tel2.length; i++) {
            b += ",";
            b += tel2[i];
        }
    }

    b += ";";
    g = true;
    if (texts.length > 0) {
        for (var i = 0; i < texts.length; i++) {
            if (i != texts.length && g != true && texts[i] != undefined) {
                b += ",";
            }
            if (texts[i] != undefined) {
                b += texts[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (xtext.length > 0) {
        for (var i = 0; i < xtext.length; i++) {
            if (i != xtext.length && g != true && xtext[i] != undefined) {
                b += ",";
            }
            if (xtext[i] != undefined) {
                b += xtext[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ytext.length > 0) {
        for (var i = 0; i < ytext.length; i++) {
            if (i != ytext.length && g != true && ytext[i] != undefined) {
                b += ",";
            }
            if (ytext[i] != undefined) {
                b += ytext[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ctext.R.length > 0) {
        for (var i = 0; i < ctext.R.length; i++) {
            if (i != ctext.R.length && g != true && ctext.R[i] != undefined) {
                b += ",";
            }
            if (ctext.R[i] != undefined) {
                b += ctext.R[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ctext.G.length > 0) {
        for (var i = 0; i < ctext.G.length; i++) {
            if (i != ctext.G.length && g != true && ctext.G[i] != undefined) {
                b += ",";
            }
            if (ctext.G[i] != undefined) {
                b += ctext.G[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ctext.B.length > 0) {
        for (var i = 0; i < ctext.B.length; i++) {
            if (i != ctext.B.length && g != true && ctext.B[i] != undefined) {
                b += ",";
            }
            if (ctext.B[i] != undefined) {
                b += ctext.B[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ctext.A.length > 0) {
        for (var i = 0; i < ctext.A.length; i++) {
            if (i != ctext.A.length && g != true && ctext.A[i] != undefined) {
                b += ",";
            }
            if (ctext.A[i] != undefined) {
                b += ctext.A[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ftext.length > 0) {
        for (var i = 0; i < ftext.length; i++) {
            if (i != ftext.length && g != true && ftext[i] != undefined) {
                b += ",";
            }
            if (ftext[i] != undefined) {
                b += ftext[i];
                g = false;
            }
        }
    }
    b += ";";
    g = true;
    if (ptext.length > 0) {
        for (var i = 0; i < ptext.length; i++) {
            if (i != ptext.length && g != true && ptext[i] != undefined) {
                b += ",";
            }
            if (ptext[i] != undefined) {
                b += ptext[i];
                g = false;
            }
        }
    }

    b += ";";
    b += startx + "," + starty + ".";
    document.getElementById("Level").value = b;
};

document.getElementById("import").onclick = function imp(e) {
    var num = 0;
    var num2 = "";
    var k = 1;
    var b = 0;

    var s = document.getElementById("Level").value;
    texts.length = 0;
    xtext.length = 0;
    ytext.length = 0;
    ctext.R.length = 0;
    ctext.G.length = 0;
    ctext.B.length = 0;
    ctext.A.length = 0;
    ftext.length = 0;
    ptext.length = 0;

    blockId.length = 0;
    x2.length = 0;
    y2.length = 0;
    areax.length = 0;
    areay.length = 0;
    changed.length = 0;
    changed2.length = 0;
    trans.length = 0;
    tel1.length = 0;
    tel2.length = 0;

    startx = -1;
    starty = -1;

    for (var i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) > 47 && s.charCodeAt(i) < 58 && b != 10 && b != 17 && b != 16) {
            num *= k;
            num += s.charCodeAt(i) - 48;
            k = 10;
            continue;
        }
        if (((s.charCodeAt(i) > 64 && s.charCodeAt(i) < 91) || (s.charCodeAt(i) > 47 && s.charCodeAt(i) < 58) || (s.charCodeAt(i) > 96 && s.charCodeAt(i) < 123) || s.charCodeAt(i) == 32 || s.charCodeAt(i) == 33 || s.charCodeAt(i) == 63 || s.charCodeAt(i) == 43 || s.charCodeAt(i) == 45 || s.charCodeAt(i) == 46 || s.charCodeAt(i) == 61 || s.charCodeAt(i) == 65) && (b == 10 || b == 17 || b == 16)) {
            num2 += s.charAt(i);
            continue;
        } else if (s.charCodeAt(i) == 44) {
            if (b == 0) {
                blockId[blockId.length] = num;
            }
            if (b == 1) {
                x2[x2.length] = num;
            }
            if (b == 2) {
                y2[y2.length] = num;
            }
            if (b == 3) {
                areax[areax.length] = num;
            }
            if (b == 4) {
                areay[areay.length] = num;
            }
            if (b == 5) {
                changed[changed.length] = num;
            }
            if (b == 6) {
                changed2[changed2.length] = num;
            }
            if (b == 7) {
                trans[trans.length] = num;
            }
            if (b == 8) {
                tel1[tel1.length] = num;
            }
            if (b == 9) {
                tel2[tel2.length] = num;
            }
            if (b == 10) {
                texts[texts.length] = num2;
            }
            if (b == 11) {
                xtext[xtext.length] = num;
            }
            if (b == 12) {
                ytext[ytext.length] = num;
            }
            if (b == 13) {
                ctext.R[ctext.R.length] = num;
            }
            if (b == 14) {
                ctext.G[ctext.G.length] = num;
            }
            if (b == 15) {
                ctext.B[ctext.B.length] = num;
            }
            if (b == 16) {
                ctext.A[ctext.A.length] = parseFloat(num2);
            }
            if (b == 17) {
                ftext[ftext.length] = num2;
            }
            if (b == 18) {
                ptext[ptext.length] = num;
            }
            if (b == 19) {
                if (startx != -1) {
                    starty = num;
                }
                if (startx == -1) {
                    startx = num;
                }
            }
            k = 1;
            num = 0;
            num2 = "";
            continue;
        } else if (s.charCodeAt(i) == 59 && s.charCodeAt(i - 1) != 59) {
            if (b == 0) {
                blockId[blockId.length] = num;
            }
            if (b == 1) {
                x2[x2.length] = num;
            }
            if (b == 2) {
                y2[y2.length] = num;
            }
            if (b == 3) {
                areax[areax.length] = num;
            }
            if (b == 4) {
                areay[areay.length] = num;
            }
            if (b == 5) {
                changed[changed.length] = num;
            }
            if (b == 6) {
                changed2[changed2.length] = num;
            }
            if (b == 7) {
                trans[trans.length] = num;
            }
            if (b == 8) {
                tel1[tel1.length] = num;
            }
            if (b == 9) {
                tel2[tel2.length] = num;
            }
            if (b == 10) {
                texts[texts.length] = num2;
            }
            if (b == 11) {
                xtext[xtext.length] = num;
            }
            if (b == 12) {
                ytext[ytext.length] = num;
            }
            if (b == 13) {
                ctext.R[ctext.R.length] = num;
            }
            if (b == 14) {
                ctext.G[ctext.G.length] = num;
            }
            if (b == 15) {
                ctext.B[ctext.B.length] = num;
            }
            if (b == 16) {
                ctext.A[ctext.A.length] = parseFloat(num2);
            }
            if (b == 17) {
                ftext[ftext.length] = num2;
            }
            if (b == 18) {
                ptext[ptext.length] = num;
            }
            if (b == 19) {
                if (startx != -1) {
                    starty = num;
                }
                if (startx == -1) {
                    startx = num;
                }
            }
            k = 1;
            b += 1;
            num = 0;
            num2 = "";
            continue;
        } else if (s.charCodeAt(i) == 59 && s.charCodeAt(i - 1) == 59) {
            k = 1;
            b += 1;
            num = 0;
            num2 = "";
            continue;
        } else if (s.charCodeAt(i) == 46 && b >= 19) {
            if (b == 0) {
                blockId[blockId.length] = num;
            }
            if (b == 1) {
                x2[x2.length] = num;
            }
            if (b == 2) {
                y2[y2.length] = num;
            }
            if (b == 3) {
                areax[areax.length] = num;
            }
            if (b == 4) {
                areay[areay.length] = num;
            }
            if (b == 5) {
                changed[changed.length] = num;
            }
            if (b == 6) {
                changed2[changed2.length] = num;
            }
            if (b == 7) {
                trans[trans.length] = num;
            }
            if (b == 8) {
                tel1[tel1.length] = num;
            }
            if (b == 9) {
                tel2[tel2.length] = num;
            }
            if (b == 10) {
                texts[texts.length] = num2;
            }
            if (b == 11) {
                xtext[xtext.length] = num;
            }
            if (b == 12) {
                ytext[ytext.length] = num;
            }
            if (b == 13) {
                ctext.R[ctext.R.length] = num;
            }
            if (b == 14) {
                ctext.G[ctext.G.length] = num;
            }
            if (b == 15) {
                ctext.B[ctext.B.length] = num;
            }
            if (b == 16) {
                ctext.A[ctext.A.length] = parseFloat(num2);
            }
            if (b == 17) {
                ftext[ftext.length] = num2;
            }
            if (b == 18) {
                ptext[ptext.length] = num;
            }
            if (b == 19) {
                if (startx != -1) {
                    starty = num;
                }
                if (startx == -1) {
                    startx = num;
                }
            }
            num2 = "";
            num = 0;
            k = 1;
            break;
        }
    }
};

function changingone(e) {
    mX = e.offsetX == undefined ? Math.floor(e.layerX / 25) * 25 : Math.floor(e.offsetX / 25) * 25;
    mY = e.offsetX == undefined ? Math.floor(e.layerY / 25) * 25 : Math.floor(e.offsetY / 25) * 25;
    if (over == true) {
        if (e.which == 3) {
            i3 = 0;
            for (var i = 0; i < blockId.length; i++) {
                if (mX == x2[i] && mY == y2[i] && blockId[i] == 1) {
                    if (step == 1) {
                        kkk = false;
                        for (var i2 = 0; i2 < tel1.length; i2++) {
                            if (tel1[i2] == i) {
                                kkk = true;
                            }
                        }
                        if (kkk == true) {
                            caption = 0;
                            break;
                        }
                        tel1[tel1.length] = i;
                        step = 2;
                        caption = i;
                        break;
                    }
                    if (step == 2) {
                        tel2[tel2.length] = i;
                        step = 1;
                        caption = 0;
                        break;
                    }
                }
                i3 += 1;
                if (i3 == blockId.length) {
                    step = 1;
                    tel1.length -= 1;
                    caption = 0;
                }
            }
        }
        if (e.which == 1) {
            if (step == 2) {
                tel1.length -= 1;
                step = 1;
                caption = 0;
            }
            document.getElementById("Game").style.cursor = "default";
            for (var i = 0; i < blockId.length; i++) {
                if (x2[i] + areax[i] - 25 == mX && y2[i] + areay[i] - 25 == mY && blockId[i] != 0 && blockId[i] != 1) {
                    changeAllow[i] = true;
                    document.getElementById("Game").style.cursor = "pointer";
                } else if (x2[i] == mX && y2[i] == mY) {
                    changePos[i] = true;
                    document.getElementById("Game").style.cursor = "move";
                }
            }
        }
    }
}

function changingtwo(e) {
    mX = e.offsetX == undefined ? Math.floor(e.layerX / 25) * 25 : Math.floor(e.offsetX / 25) * 25;
    mY = e.offsetX == undefined ? Math.floor(e.layerY / 25) * 25 : Math.floor(e.offsetY / 25) * 25;
    if (over == true) {
        xx = mX;
        yy = mY;
    }
    if (e.which == 1 && over == true) {
        for (var i = 0; i < blockId.length; i++) {
            if (changeAllow[i] == true && blockId[i] != 0 && blockId[i] != 1) {
                changex[i] = mX - x2[i] + 25;
                changey[i] = mY - y2[i] + 25;
                changeAllow2[i] = true;
            } else if (changePos[i] == true) {
                x2[i] = mX;
                y2[i] = mY;
                if (blockId[i] == 0) {
                    startx = x2[i];
                    starty = y2[i];
                }
            }
        }
    }
}

function creating(e) {
    mX = e.offsetX == undefined ? Math.floor(e.layerX / 25) * 25 : Math.floor(e.offsetX / 25) * 25;
    mY = e.offsetX == undefined ? Math.floor(e.layerY / 25) * 25 : Math.floor(e.offsetY / 25) * 25;
    document.getElementById("Game").style.cursor = "default";
    if (e.which == 1 && over == true) {
        gg = true;
        kk = true;
        don = true;
        for (var i = 0; i < blockId.length; i++) {
            if (changeAllow[i] == true && blockId[i] != 0 && blockId[i] != 1) {
                gg = false;
                if (changex[i] > 0 && changey[i] > 0 && changeAllow2[i] == true) {
                    areax[i] = changex[i];
                    areay[i] = changey[i];
                }
                changex[i] = 0;
                changey[i] = 0;
                changeAllow[i] = false;
                changeAllow2[i] = false;
            }
            if (blockId[i] == 0) {
                kk = false;
            }
            if (mX >= x2[i] && mY >= y2[i] && mX <= x2[i] + areax[i] - 25 && mY <= y2[i] + areay[i] - 25) {
                don = false;
            }
            changePos[i] = false;
        }
        if (gg == true && block != 0 && don == true) {
            n = blockId.length;
            trans[n] = 0;
            blockId[n] = block;
            areax[n] = 25;
            areay[n] = 25;
            x2[n] = mX;
            y2[n] = mY;
            if (blockId[n] > 6) {
                changed[changed.length] = n;
                changed2[changed2.length] = 0;
            }
        } else if (gg == true && kk == true && block == 0 && don == true) {
            n = blockId.length;
            trans[n] = 0;
            blockId[n] = block;
            areax[n] = 25;
            areay[n] = 25;
            x2[n] = mX;
            y2[n] = mY;
            startx = x2[n];
            starty = y2[n];
        }
    }
}

function starting() {
    x[currentObj] = startx;
    y[currentObj] = starty;
}

function resizing(a, b, c, d, e, f, g, h, j) {
    for (var i = 0; i < h / 25; i++) {
        for (var i2 = 0; i2 < j / 25; i2++) {
            ctx.drawImage(a, b, c, d, e, f + i * 25, g + i2 * 25, 25, 25);
        }
    }
}

function game() {
    ctx.clearRect(0, 0, example.width, example.height);
    kkk = true;
    for (var i = 0; i < 9; i++) {
        bok[i] = false;
        tok[i] = false;
    }
	for (var i2 = 0; i2 < x.length; i2++) {
    for (var i = 0; i < changed2.length; i++) {
        if (x[i2] >= x2[changed[i]] && x[i2] < x2[changed[i]] + areax[changed[i]] && y[i2] >= y2[changed[i]] && y[i2] < y2[changed[i]] + areay[changed[i]] && blockId[changed[i]] == 8) {
            tok[changed2[i]] = true;
        }
        if (x[i2] >= x2[changed[i]] && x[i2] < x2[changed[i]] + areax[changed[i]] && y[i2] >= y2[changed[i]] && y[i2] < y2[changed[i]] + areay[changed[i]] && blockId[changed[i]] == 9) {
            bok[changed2[i]] = true;
        }
    }
	}
    for (var i = 0; i < blockId.length; i++) {
        if (blockId[i] != 7) {
            pic[0].onload = function() {
                    if (areax[i] == 25 && areay[i] == 25) {
                        ctx.drawImage(pic[0], blockId[i] * 25, 0, 25, 25, x2[i], y2[i], areax[i], areay[i]);
                    } else {
                        resizing(pic[0], blockId[i] * 25, 0, 25, 25, x2[i], y2[i], areax[i], areay[i]);
                    }
                }
                (pic[0].onload);
        } else {
            for (var i2 = 0; i2 < changed2.length; i2++) {
                if (blockId[i] == 7 && i == changed[i2] && tok[changed2[i2]] == false && tt[changed2[i2]] <= 0) {
                    pic[0].onload = function() {
                            if (areax[i] == 25 && areay[i] == 25) {
                                ctx.drawImage(pic[0], blockId[i] * 25, 0, 25, 25, x2[i], y2[i], areax[i], areay[i]);
                            } else {
                                resizing(pic[0], blockId[i] * 25, 0, 25, 25, x2[i], y2[i], areax[i], areay[i]);
                            }
                        }
                        (pic[0].onload);
                    break;
                }
            }
        }
        if (changeAllow[i] == true) {
            kkk = false;
        }
    }

    for (var i = 0; i < blockId.length; i++) {
        for (var i2 = 0; i2 < changed.length; i2++) {
            if (blockId[i] > 6 && changed2[i2] != 0 && i == changed[i2]) {
                if (blockId[i] != 7 || blockId[i] == 7 && tt[changed2[i2]] <= 0 && tok[changed2[i2]] == false) {
                    var imgData = ctx.getImageData(x2[changed[i2]], y2[changed[i2]], areax[changed[i2]], areay[changed[i2]]);
                    if (changed2[i2] == 1) {
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) { //px width * px height * 4 <(R+G+B+A)>
                            imgData.data[j] = 255; //R
                        }
                    } else if (changed2[i2] == 2) {
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            imgData.data[j + 1] = 255; //G
                        }
                    } else if (changed2[i2] == 3) {
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            imgData.data[j + 2] = 255; //B
                        }
                    } else if (changed2[i2] == 4) { //black
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            if (imgData.data[j] != 255 && imgData.data[j + 1] != 255 && imgData.data[j + 2] != 255) {
                                imgData.data[j] -= 60;
                                imgData.data[j + 1] -= 60;
                                imgData.data[j + 2] -= 60;
                            }
                        }
                    } else if (changed2[i2] == 5) { //white
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            if (imgData.data[j] != 255 && imgData.data[j + 1] != 255 && imgData.data[j + 2] != 255) {
                                imgData.data[j] += 60;
                                imgData.data[j + 1] += 60;
                                imgData.data[j + 2] += 60;
                            }
                        }
                    } else if (changed2[i2] == 6) { //yellow
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            imgData.data[j] = 255;
                            imgData.data[j + 1] = 255;
                        }
                    } else if (changed2[i2] == 7) { //aqua
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            imgData.data[j + 1] = 255;
                            imgData.data[j + 2] = 255;
                        }
                    } else if (changed2[i2] == 8) { //pinc
                        for (var j = 0; j <= areax[changed[i2]] * areay[changed[i2]] * 4; j += 4) {
                            imgData.data[j] = 255;
                            imgData.data[j + 2] = 255;
                        }
                    }
                    ctx.putImageData(imgData, x2[changed[i2]], y2[changed[i2]]);
                }
            }
        }

        if (trans[i] == true) {
            ctx.fillStyle = "RGBA(128,128,128,0.5)";
            ctx.fillRect(x2[i], y2[i], areax[i], areay[i]);
        }
    }

    if (testing == true) {
      for (var i2 = 0; i2 < x.length; i2++) {
        pic[1].onload = function() {
                ctx.drawImage(pic[1], 0, 0, 25, 25, x[i2], y[i2], 25, 25)
            }
            (pic[1].onload);
	  }
	  ctx.beginPath();
	  ctx.fillStyle = "#f00";
	  ctx.fillRect(x[currentObj], y[currentObj], 3, 1);
	  ctx.fillRect(x[currentObj], y[currentObj], 1, 3);
	  ctx.fillRect(x[currentObj]+25, y[currentObj]+25, -3, -1);
	  ctx.fillRect(x[currentObj]+25, y[currentObj]+25, -1, -3);
	  
	  ctx.fillRect(x[currentObj]+25, y[currentObj], -3, 1);
	  ctx.fillRect(x[currentObj]+25, y[currentObj], -1, 3);
	  ctx.fillRect(x[currentObj], y[currentObj]+25, 3, -1);
	  ctx.fillRect(x[currentObj], y[currentObj]+25, 1, -3);
	  ctx.closePath();
    }
    if (caption != 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#f00";
        ctx.strokeRect(x2[caption], y2[caption], areax[caption], areay[caption]);
        ctx.closePath();
    }
    for (var i = 0; i < blockId.length; i++) {
        kk = false;
        i3 = 0;
        for (var i2 = 0; i2 < tel1.length; i2++) {
            if (i == tel1[i2] && xx == x2[tel1[i2]] && yy == y2[tel1[i2]]) {
                kk = true;
                i3 = i2;
                break;
            }
        }
        if (kk == true) {
            if (tel2.length == tel1.length) {
                ctx.beginPath();
                ctx.strokeStyle = "#000";
                ctx.strokeRect(x2[tel1[i3]], y2[tel1[i3]], areax[tel1[i3]], areay[tel1[i3]]);
                ctx.closePath();
                ctx.beginPath();
                ctx.strokeStyle = "#000";
                ctx.strokeRect(x2[tel2[i3]], y2[tel2[i3]], areax[tel2[i3]], areay[tel2[i3]]);
                ctx.closePath();
            }
            break;
        }
        if (xx < x2[i] + areax[i] && xx >= x2[i] && yy >= y2[i] && yy < y2[i] + areay[i] && kkk == true) {
            ctx.beginPath();
            ctx.strokeStyle = "#000";
            ctx.strokeRect(x2[i], y2[i], areax[i], areay[i]);
            ctx.closePath();
        } else {
            ctx.beginPath();
            if (changex[i] <= 0 || changey[i] <= 0) {
                ctx.strokeStyle = "#f00";
            } else {
                ctx.strokeStyle = "#000";
            }
            ctx.strokeRect(x2[i], y2[i], changex[i], changey[i]);
            ctx.closePath();
        }
    }
    ctx.beginPath();
    for (var i = 0; i < texts.length; i++) {
        if (texts[i] != undefined && texts[i] != "" && texts[i] != " ") {
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillStyle = "RGBA(" + ctext.R[i] + "," + ctext.G[i] + "," + ctext.B[i] + "," + ctext.A[i] + ")";
            ctx.font = ptext[i] + "px " + ftext[i];
            ctx.fillText(texts[i], xtext[i], ytext[i]);
        }
    }
    ctx.closePath();

    document.getElementById("selecter").getContext('2d').clearRect(0, 0, document.getElementById("selecter").width, document.getElementById("selecter").height);
    document.getElementById("selecter").getContext('2d').drawImage(pic[0], block * 25, 0, 25, 25, 0, 0, 50, 50);

    timer = setTimeout("game()", 17); //60 fps 1000/60=100/6=50/3; 3*17 = 51
}