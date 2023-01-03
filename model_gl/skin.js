/////////////////////////////////////////////////
//infinityrt_skin
infinityrt_skin = function (uijson, enableui, fnComplete, opt) {
    var jsonhttp = new XMLHttpRequest();
    jsonhttp.skin = this;
    jsonhttp.enableui = (enableui != undefined) ? enableui : true;
    jsonhttp.open("GET", uijson, true);
    jsonhttp.onload = function (e) {
        if (jsonhttp.status >= 200 && jsonhttp.status <= 299) {
            var s = jsonhttp.skin;
            if (scene)
                scene.skin = s;
            else
                console.warn("***Warning: States not associated with a scene");
            s.ui = JSON.parse(jsonhttp.response);
            if (jsonhttp.enableui)
                s.createUI(opt);
            if (fnComplete)
                fnComplete();
        }
    };
    jsonhttp.send("");
};

infinityrt_skin.prototype.createDD = function (typename, vertical) {
    var div = document.createElement("div");
    div.className = "divRTSkinDD container btn-group-vertical";
	div.style="max-width: 30%;bottom:auto;top:40px";
    this.DDs.push(div);
    this.divUI.appendChild(div);

	if (vertical){
		div.style="bottom:auto;top:40px;overflow-y: auto; height: 80vh; width: 50mm;";
		var divVertical = document.createElement("div");
		divVertical.className = "col-sm-1";
		divVertical.style="padding-left: 5px; padding-right: 5px;";
		div.appendChild(divVertical);
		divVertical.parentDiv = div;
	}
    btn = div.btn = document.createElement("button");
    btn.innerHTML = typename;
    btn.id = "btnDD" + typename;
	btn.className = "btnDD btn btn-primary";
    btn.parentDiv = div;
    btn.skin = this;
	btn.vertical = vertical;
    btn.addEventListener("click", function () {
        var ts = this.parentDiv.style;
        var ts_status = (ts.display === "");
        ts.display = ts_status ? "block" : "";
		if(typename == "GlobalCam"){
			this.skin.updateAppearanceUI();
		}
        for (var i = 0; i < this.skin.DDs.length; i++) {
            var div = this.skin.DDs[i];
            if (div == this.parentDiv){
				if (this.vertical){
					var maximumWidth = 0;
					for (var j = 0; j < div.childNodes[0].children.length; j++) {
						maximumWidth = (div.childNodes[0].children[j].offsetWidth > maximumWidth) ? div.childNodes[0].children[j].offsetWidth : maximumWidth;
					}
					maximumWidth += 40;
					ts.width = maximumWidth.toString()+"px";
				}
                continue;
			}
            div.style.display = "";
            div.btn.style.display = ts_status ? "none" : "";
        }
		//setTimeout(() => {
          //console.log(this.getBoundingClientRect()) // good
          //console.log(this.offsetWidth) // good
          //console.log(this.offsetHeight) // good
		  //console.log("NEW width:", document.getElementById("btn_Render_Cam_F14_Touchpad_Closeup").offsetWidth);
        //}, 1)
    });
    this.divUI.appendChild(btn);

	if (vertical){
		return divVertical; 
	}
	return div;
};

infinityrt_skin.prototype.createSkinButtonLoad = function (btnID, className, btnData, div) {
    var divupload = document.createElement("div");
	divupload.className="upload-btn-wrapper";
	
	var btn = document.createElement("button");
    btn.id = "btn_" + btnID;
    btn.innerHTML = btnID;
    btn.className = className;
	//btn.className += " btn btnLoad btn-outline-secondary btn-sm";
	btn.className += " btn btn-secondary btn-sm";
    btn.dataID = btnID;
    btn.data = btnData;
    btn.parentDiv = divupload;
    btn.skin = this;
	
	var fileinput = document.createElement("input");
	fileinput.type = "file";
	fileinput.id = className;
	fileinput.name = className;
	fileinput.data = btnData;
	fileinput.accept="application/JSON";
	fileinput.parentDiv = divupload;
	
	divupload.appendChild(btn);
	divupload.appendChild(fileinput);
	
	divupload.parentDiv = div;
    div.appendChild(divupload);
	
    return btn;
};

infinityrt_skin.prototype.createSkinButton = function (btnID, className, btnData, div) {
    var btn = document.createElement("button");
    btn.id = "btn_" + btnID;
    btn.innerHTML = btnID;
    btn.className = className;
	btn.className += " btn btn-secondary btn-sm";//	btn.className += " btn btn-outline-secondary btn-sm";
    btn.dataID = btnID;
    btn.data = btnData;
    btn.parentDiv = div;
    btn.skin = this;
    div.appendChild(btn);
    return btn;
};

infinityrt_skin.prototype.createSkinSlider = function (sldID, sceneObject, element, sldMin, sldMax, sldStep, div) {
	var label = document.createElement("span");
	label.id = "label" + element;
	label.innerHTML = sldID + ": ";
	
	var slider = document.createElement("input");
	slider.type = "range";
	slider.min = sldMin;
	slider.max = sldMax;
	slider.step= sldStep;
	slider.value = sceneObject[element];
	//slider.className = "slider";
	slider.sceneObject = sceneObject;
	slider.id = "sld" + element;
	slider.style.width = "100%";
	slider.oninput = function() {
	  //text.innerHTML = " " + this.value;
	  text.value = this.value;
	  this.sceneObject[element] = parseFloat(this.value);
	  scene.clearRefine();
	}
	
	//var text = document.createElement("span");
	//text.id = element;
	//text.innerHTML = " " + slider.value;
	var text = document.createElement("input");
	text.type = "number";
	text.className = "transparent-input";
	text.style="width: 66px;";
	text.id = element;
	text.name = element;
	text.min = slider.min;
	text.max = slider.max;
	text.step = slider.step;
	text.value = slider.value;
	text.sceneObject = sceneObject;
	text.oninput = function() {
	  slider.value = this.value;
	  this.sceneObject[element] = parseFloat(this.value);
	  scene.clearRefine();
	}
	
	
	var btnReset = document.createElement("button");
    btnReset.id = "btn_reset" + element;
	btnReset.className += " btn btn-secondary btn-sm fa fa-undo";
    btnReset.parentDiv = div;
	btnReset.resetValue = slider.value;
	btnReset.slider = slider;
	btnReset.text = text;
    btnReset.skin = this;
    btnReset.addEventListener("click", function () {
		var resetValue = this.resetValue;
		this.slider.value = resetValue;
		this.text.value = resetValue;
		this.slider.sceneObject[element] = parseFloat(resetValue);
		scene.clearRefine();
	});	
	
	var divlabel = document.createElement("div");
	divlabel.className="col-sm-4";
	divlabel.style["padding-left"]="5px";
	divlabel.style["padding-right"]="5px";
	
	var divslider = document.createElement("div");
	divslider.className="col-sm-5";
	divslider.style["padding-left"]="5px";
	divslider.style["padding-right"]="5px";
	
	var divtext = document.createElement("div");
	divtext.className="col-sm-2";
	divtext.style["padding-left"]="5px";
	divtext.style["padding-right"]="5px";
	
	var divbtn = document.createElement("div");
	divbtn.className="col-sm-1";
	divbtn.style["padding-left"]="5px";
	divbtn.style["padding-right"]="5px";
	
    var divslidercontainer = document.createElement("div");
	//divslidercontainer.class = "slidercontainer";
	divslidercontainer.className="text-primary row justify-content-start";
	divslidercontainer.style["padding-top"]="5px";
	
	label.parentDiv = divlabel;
    divlabel.appendChild(label);
	slider.parentDiv = divslider;
    divslider.appendChild(slider);
	text.parentDiv = divtext;
    divtext.appendChild(text);
	
	btnReset.parentDiv = divbtn;
    divbtn.appendChild(btnReset);
	
	divlabel.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divlabel);
	divslider.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divslider);
	divtext.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divtext);
	divbtn.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divbtn);
	
    divslidercontainer.parentDiv = div;
    divslidercontainer.skin = this;
    div.appendChild(divslidercontainer);
    return divslidercontainer;
};

infinityrt_skin.prototype.createSkinMultiSlider = function (sldID, sceneObject, element, elemindex, sldMin, sldMax, sldStep, div) {
	var label = document.createElement("span");
	label.id = "label" + element;
	label.innerHTML = sldID + ": ";
	
	var slider = document.createElement("input");
	slider.type = "range";
	//slider.setAttribute('multiple', '');
	slider.min = sldMin;
	slider.max = sldMax;
	slider.step= sldStep;
	slider.value = sceneObject[element][elemindex];//TODO: get the elements 0 and 1. E.g.: scene._nav._panMin[0], scene._nav._panMin[1]
	//slider.valueLow = sceneObject[element][0];
	//slider.valueHigh = sceneObject[element][1];
	//slider.className = "slider";
	slider.sceneObject = sceneObject;
	slider.id = "sld" + element;
	slider.style.width = "100%";
	slider.oninput = function() {
	  //text.innerHTML = " " + this.value;
	  text.value = this.value;
	  this.sceneObject[element] = parseFloat(this.value);
	  scene.clearRefine();
	}
	
	var text = document.createElement("input");
	text.type = "number";
	text.className = "transparent-input";
	text.style="width: 66px;";
	text.id = element;
	text.name = element;
	text.min = slider.min;
	text.max = slider.max;
	text.step = slider.step;
	text.value = slider.value;
	text.sceneObject = sceneObject;
	text.oninput = function() {
	  slider.value = this.value;
	  this.sceneObject[element] = parseFloat(this.value);
	  scene.clearRefine();
	}
	
	var btnReset = document.createElement("button");
    btnReset.id = "btn_reset" + element;
	btnReset.className += " btn btn-secondary btn-sm fa fa-undo";
    btnReset.parentDiv = div;
	btnReset.resetValue = slider.value;
	btnReset.slider = slider;
	btnReset.text = text;
    btnReset.skin = this;
    btnReset.addEventListener("click", function () {
		var resetValue = this.resetValue;
		this.slider.value = resetValue;
		this.text.value = resetValue;
		this.slider.sceneObject[element] = parseFloat(resetValue);
		scene.clearRefine();
	});	
	
	var divlabel = document.createElement("div");
	divlabel.className="col-sm-4";
	divlabel.style["padding-left"]="5px";
	divlabel.style["padding-right"]="5px";
	
	var divslider = document.createElement("div");
	divslider.className="col-sm-5";
	divslider.style["padding-left"]="5px";
	divslider.style["padding-right"]="5px";
	
	var divtext = document.createElement("div");
	divtext.className="col-sm-2";
	divtext.style["padding-left"]="5px";
	divtext.style["padding-right"]="5px";
	
	var divbtn = document.createElement("div");
	divbtn.className="col-sm-1";
	divbtn.style["padding-left"]="5px";
	divbtn.style["padding-right"]="5px";
	
	
    var divslidercontainer = document.createElement("div");
	//divslidercontainer.class = "slidercontainer";
	divslidercontainer.className="text-primary row justify-content-start";
	divslidercontainer.style["padding-top"]="5px";
	
	label.parentDiv = divlabel;
    divlabel.appendChild(label);
	slider.parentDiv = divslider;
    divslider.appendChild(slider);
	text.parentDiv = divtext;
    divtext.appendChild(text);
	btnReset.parentDiv = divbtn;
    divbtn.appendChild(btnReset);
	
	divlabel.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divlabel);
	divslider.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divslider);
	divtext.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divtext);
	divbtn.parentDiv = divslidercontainer;
    divslidercontainer.appendChild(divbtn);
	
    divslidercontainer.parentDiv = div;
    divslidercontainer.skin = this;
    div.appendChild(divslidercontainer);
    return divslidercontainer;
};

infinityrt_skin.prototype.downloadAppearanceSettings = function (filename) {
    var element = document.createElement('a');

	var navapp = document.getElementById("divAppearance");
	if (!navapp)
		return;
	var app = {};
	for (var i=0; i < navapp.childNodes.length; i++){
		if (navapp.childNodes[i].children.length > 2){
			if (navapp.childNodes[i].children[2].children.length){
				var obj = navapp.childNodes[i].children[2].children[0];
				var name = obj.id;
				app[name] = parseFloat(obj.value);
			}
		}
	}
	
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(app)));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

infinityrt_skin.prototype.downloadNavigationSettings = function (filename) {
    var element = document.createElement('a');

	var navdiv = document.getElementById("divNavigation");
	if (!navdiv)
		return;
	var nav = {};
	for (var i=0; i < navdiv.childNodes.length; i++){
		if (navdiv.childNodes[i].children.length > 2){
			if (navdiv.childNodes[i].children[2].children.length){
				var obj = navdiv.childNodes[i].children[2].children[0];
				var name = obj.id;
				nav[name] = parseFloat(obj.value);
			}
		}
	}
	
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(nav)));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

infinityrt_skin.prototype.updateNavUI = function () {
	var navdiv = document.getElementById("divNavigation");
	if (!navdiv)
		return;

	for (var i=0; i < navdiv.childNodes.length; i++){
		if (navdiv.childNodes[i].children.length > 2){
			if (navdiv.childNodes[i].children[1].children.length){
				var navProperty = navdiv.childNodes[i].children[2].children[0].id;
				navdiv.childNodes[i].children[1].children[0].value = scene._nav[navProperty];
				navdiv.childNodes[i].children[1].children[0].oninput();
			}
		}
	}
}

infinityrt_skin.prototype.updateAppearanceUI = function () {
	var appdiv = document.getElementById("divAppearance");
	if (!appdiv)
		return;

	for (var i=0; i < appdiv.childNodes.length; i++){
		if (appdiv.childNodes[i].children.length > 2){
			if (appdiv.childNodes[i].children[1].children.length){
				var appProperty = appdiv.childNodes[i].children[2].children[0].id;
				appdiv.childNodes[i].children[1].children[0].value = scene[appProperty];
				appdiv.childNodes[i].children[1].children[0].oninput();
			}
		}
	}
}

infinityrt_skin.prototype.createUI = function (opt) {
    var div, btn;
    this.opt = opt;
    this.DDs = [];
    this.divUI = document.createElement("div");
    this.divUI.id = "divRTSkinMain";
    if (this.opt && this.opt.ref)
        this.divUI.id = this.opt.ref + ":" + this.divUI.id;
    this.divUI.className = "divRTSkinMain";
    if (opt && opt.top)
        this.divUI.style.top = opt.top;
    document.body.appendChild(this.divUI);

    if (this.ui.states.length > 0) {
        this.divStates = [];
        for (var i = 0; i < this.ui.states.length; i++) {
            var cat, displayname, name = this.ui.states[i];
            var nameelems = name.split(':');
            if (nameelems.length > 1) {
                cat = nameelems[0];
                displayname = nameelems[1];
            } else {
                cat = "States";
                displayname = name;
            }
            div = this.divStates[cat];
            if (div == undefined) {
                div = this.divStates[cat] = this.createDD(cat, true);
            }
            btn = this.createSkinButton(displayname, "btnRTState", name, div);
            btn.addEventListener("click", function () {
                var data = this.data;
                if (this.skin.opt && this.skin.opt.ref)
                    data = this.skin.opt.ref + ":" + data;
                scene.groupApplyState(data);
            });
        }
    }

    if (this.ui.positions) {
        div = this.createDD("GotoPos", true);
        for (var spname in this.ui.positions) {
            var sp = this.ui.positions[spname];
            btn = this.createSkinButton(spname, "btnRTGotoPos", sp, div);
            btn.addEventListener("click", function () {
                scene.gotoUINamedPosInTime(this.dataID);
            });
        }
    }

    if (this.ui.anims) {
        div = this.createDD("Anims", true);
        for (var animname in this.ui.anims) {
            var anim = this.ui.anims[animname];
            anim.name = animname;
            anim.curr = false;
            btn = this.createSkinButton(animname, "btnRTAnim", anim, div);
            btn.addEventListener("click", function () {
                var an = this.data;
                an.curr = !an.curr;
                scene.animPlayAllChildrenInTime(an.name, an.curr ? an.end : an.start, an.time);
                scene.clearRefine();
            });
        }
    }

    if (this.ui.displaylayers.length > 0) {
        div = this.createDD("DisplayLayers", true);
        for (var i = 0; i < this.ui.displaylayers.length; i++) {
            var dl = { name: this.ui.displaylayers[i], curr: true };
            btn = this.createSkinButton(dl.name, "btnRTDisplayLayer", dl, div);
            btn.addEventListener("click", function () {
                var dl = this.data;
                if (dl.name.indexOf('#') != -1) {
                    scene.groupSet(dl.name, 'visible', 1);
                } else {
                    dl.curr = !dl.curr;
                    scene.groupSet(dl.name, 'visible', dl.curr ? 1 : 0);
                }
                scene.clearRefine();
            });
        }
    }
	//New Appearance controls
	if (scene){
		div = this.createDD("GlobalCam");
		div.id = "divAppearance";
		//TODO: The controls should load after completely loading the scene.
		//CAMERA
		
		//FOV
		this.createSkinSlider("FOV", scene, "fovy", "0.5", "179.5", "0.1", div);
		//DoF
		this.createSkinSlider("Near distance", scene, "_fDoFNearDist", "1", "1000", "1", div);
		this.createSkinSlider("Near aperture", scene, "_fDoFNearAperture", "0", "100", "0.1", div);
		this.createSkinSlider("Far aperture", scene, "_fDoFFarAperture", "0", "100", "0.1", div);
		this.createSkinSlider("Far distance", scene, "_fDoFFarDist", "1", "1000", "1", div);
		//Z near
		this.createSkinSlider("Z near (clipping)", scene, "_zNearMin", "0.5", "100", "0.1", div);
		
		//Save & download button
		var divbtn = document.createElement("div");
		divbtn.className="row justify-content-start";
		divbtn.style["padding-top"]="5px";
	
		var divbtncol = document.createElement("div");
		divbtncol.className="col-sm-2";
		divbtncol.style["padding-left"]="5px";
		divbtncol.style["padding-right"]="5px";
		
 		divbtncol.parentDiv = divbtn;
 		divbtn.appendChild(divbtncol);
		divbtn.parentDiv = div;
		div.appendChild(divbtn);
	
		btn = this.createSkinButton("Save", "btnExportApp", this, divbtncol);
		btn.addEventListener("click", function () {
			this.data.downloadAppearanceSettings("appsettings.json");
		});
		
		//Load button
		divfile = document.createElement("div");
		divfile.className="row justify-content-start";
		divfile.style["padding-top"]="5px";
		
		divfile.parentDiv = div;
		div.appendChild(divfile);
		
		divbtncol = document.createElement("div");
		divbtncol.className="col-sm-2";
		divbtncol.style["padding-left"]="5px";
		divbtncol.style["padding-right"]="5px";
		
		divbtncol.parentDiv = divfile;
		divfile.appendChild(divbtncol);
		
		btn = this.createSkinButtonLoad("Load", "btnLoadApp", this, divbtncol);
		document.getElementsByName('btnLoadApp')[0].addEventListener('change', function(){
			if(document.querySelector("#btnLoadApp").files.length == 0) {
				alert('Error : No file selected');
				return;
			}

			// file selected by user
			let file = document.querySelector("#btnLoadApp").files[0];

			// new FileReader object
			let reader = new FileReader();
			reader.skin = this.data;
			// event fired when file reading finished
			reader.addEventListener('load', function(e) {
				let text = e.target.result;
				let newApp = JSON.parse(text);
				for (const property in newApp) {
				  scene[property] = newApp[property];
				}
				this.skin.updateAppearanceUI();
			});

			// event fired when file reading failed
			reader.addEventListener('error', function() {
				alert('Error : Failed to read file');
			});

			// read file as text file
			reader.readAsText(file);
		});
	}
	
	//New Navigation controls
	if (scene && scene._nav){
		div = this.createDD("Navigation");
		div.id = "divNavigation";
		//Rotation
		this.createSkinSlider("Rotation Speed", scene._nav, "_navRotationSpeed", "0.0005", "0.05", "0.0005", div);
		//Zoom
		this.createSkinSlider("Zoom Min", scene._nav, "_navMinDolly", "1", "999", "1", div);	
		this.createSkinSlider("Zoom Max", scene._nav, "_navMaxDolly", "2", "1000", "1", div);
		this.createSkinSlider("Dolly Value", scene._nav, "_navDolly", "1", "1000", "1", div);
		this.createSkinSlider("Zoom Speed", scene._nav, "_navDollySpeed", "0.0004", "0.02", "0.0002", div);
		//Decay
		this.createSkinSlider("Decay", scene._nav, "_navDecay", "0.01", "0.99", "0.01", div);
		this.createSkinSlider("Decay Life", scene._nav, "_navMode2DecayHalflife", "0", "300", "5", div);
		//Pan
		this.createSkinSlider("Pan Speed", scene._nav, "_navPanSpeed", "0.005", "0.5", "0.005", div);
		//TODO: Implement createSkinMultiSlider
		//this.createSkinMultiSlider("Pan Min", scene._nav, "_panMin", "-50", "50", "0.5", div);
		//this.createSkinMultiSlider("Pan Max", scene._nav, "_panMax", "-50", "50", "0.5", div);
		//this._panMax = [16,10];    //[left, bottom];
		//this._panMin = [-16,-10];  //[right, top];
		this.createSkinMultiSlider("Pan Min (Right)", scene._nav, "_panMin", 0, "-50", "50", "0.5", div);
		this.createSkinMultiSlider("Pan Min (Top)", scene._nav, "_panMin", 1, "-50", "50", "0.5", div);
		this.createSkinMultiSlider("Pan Max (Left)", scene._nav, "_panMax", 0, "-50", "50", "0.5", div);
		this.createSkinMultiSlider("Pan Max (Bottom)", scene._nav, "_panMax", 1, "-50", "50", "0.5", div);
		
		this.createSkinSlider("Desired Target Speed", scene._nav, "_navDesiredTargetSpeed", "0.01", "0.99", "0.01", div);
		
		/*
		"Touch Sensitivity" window.touchSensitivity
		"Touch Pan Zoom"	window.touchZoomPan 
		*/
		
		//Save & download button
		var divbtn = document.createElement("div");
		divbtn.className="row justify-content-start";
		divbtn.style["padding-top"]="5px";
	
		var divbtncol = document.createElement("div");
		divbtncol.className="col-sm-2";
		divbtncol.style["padding-left"]="5px";
		divbtncol.style["padding-right"]="5px";
		
 		divbtncol.parentDiv = divbtn;
 		divbtn.appendChild(divbtncol);
		divbtn.parentDiv = div;
		div.appendChild(divbtn);
	
		btn = this.createSkinButton("Save", "btnExportNav", this, divbtncol);
		btn.addEventListener("click", function () {
			this.data.downloadNavigationSettings("navsettings.json");
		});
		
		//Load button
		divfile = document.createElement("div");
		divfile.className="row justify-content-start";
		divfile.style["padding-top"]="5px";
		
		divfile.parentDiv = div;
		div.appendChild(divfile);
		
		divbtncol = document.createElement("div");
		divbtncol.className="col-sm-2";
		divbtncol.style["padding-left"]="5px";
		divbtncol.style["padding-right"]="5px";
		
		divbtncol.parentDiv = divfile;
		divfile.appendChild(divbtncol);
	
		btn = this.createSkinButtonLoad("Load", "btnLoadNav", this, divbtncol);
		
		
		document.getElementsByName('btnLoadNav')[0].addEventListener('change', function(){
			if(document.querySelector("#btnLoadNav").files.length == 0) {
				alert('Error : No file selected');
				return;
			}

			// file selected by user
			let file = document.querySelector("#btnLoadNav").files[0];

			// new FileReader object
			let reader = new FileReader();
			reader.skin = this.data;
			// event fired when file reading finished
			reader.addEventListener('load', function(e) {
				let text = e.target.result;
				let newNav = JSON.parse(text);
				for (const property in newNav) {
				  scene._nav[property] = newNav[property];
				}
				this.skin.updateNavUI();
			});

			// event fired when file reading failed
			reader.addEventListener('error', function() {
				alert('Error : Failed to read file');
			});

			// read file as text file
			reader.readAsText(file);
		});
		
	}
	
};
//TODO: Add function to update navigation controls with the current scene._nav variables.

window.addEventListener('DOMContentLoaded', function () {
	setTimeout(function () { skin = new infinityrt_skin("config.json"); }, 500);
});
