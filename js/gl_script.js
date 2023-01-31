// --------------------------------------------------------START----------------------------------------------------------//
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//

Vector3 = function (x,y,z) {
   this.x = x || 0;
   this.y = y || 0;
   this.z = z || 0;
};
Vector3.prototype = {
   constructor: Vector3,
   set: function (x,y,z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
   },
   setX: function (x) {
      this.x = x;
      return this;
   },
   setY: function (y) {
      this.y = y;
      return this;
   },
   setZ: function (z) {
      this.z = z;
      return this;
   },
   setComponent: function (index,value) {
      switch (index) {
         case 0:
            this.x = value;
            break;
         case 1:
            this.y = value;
            break;
         case 2:
            this.z = value;
            break;
         default:
            throw new Error('index is out of range: ' + index);
      }
   },
   getComponent: function (index) {
      switch (index) {
         case 0:
            return this.x;
         case 1:
            return this.y;
         case 2:
            return this.z;
         default:
            throw new Error('index is out of range: ' + index);
      }
   },
   copy: function (v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
   },
   add: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
         return this.addVectors(v,w);
      }
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
   },
   addScalar: function (s) {
      this.x += s;
      this.y += s;
      this.z += s;
      return this;
   },
   addVectors: function (a,b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
   },
   sub: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
         return this.subVectors(v,w);
      }
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
   },
   subVectors: function (a,b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
   },
   multiply: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
         return this.multiplyVectors(v,w);
      }
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
   },
   multiplyScalar: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
   },
   multiplyVectors: function (a,b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
   },
   applyEuler: function () {
      var quaternion;
      return function (euler) {
         if (euler instanceof Euler === false) {
            console.error('Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
         }
         if (quaternion === undefined) quaternion = new Quaternion();
         this.applyQuaternion(quaternion.setFromEuler(euler));
         return this;
      };
   }(),
   applyAxisAngle: function () {
      var quaternion;
      return function (axis,angle) {
         if (quaternion === undefined) quaternion = new Quaternion();
         this.applyQuaternion(quaternion.setFromAxisAngle(axis,angle));
         return this;
      };
   }(),
   applyMatrix3: function (m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6] * z;
      this.y = e[1] * x + e[4] * y + e[7] * z;
      this.z = e[2] * x + e[5] * y + e[8] * z;
      return this;
   },
   applyMatrix4: function (m) {
      // input: Matrix4 affine matrix
      var x = this.x,
         y = this.y,
         z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
      this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
      this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
      return this;
   },
   applyProjection: function (m) {
      // input: Matrix4 projection matrix
      var x = this.x,
         y = this.y,
         z = this.z;
      var e = m.elements;
      var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
      this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
      this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
      this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
      return this;
   },
   applyQuaternion: function (q) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var qx = q.x;
      var qy = q.y;
      var qz = q.z;
      var qw = q.w;
      // calculate quat * vector
      var ix = qw * x + qy * z - qz * y;
      var iy = qw * y + qz * x - qx * z;
      var iz = qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z;
      // calculate result * inverse quat
      this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
      return this;
   },
   transformDirection: function (m) {
      // input: Matrix4 affine matrix
      // vector interpreted as a direction
      var x = this.x,
         y = this.y,
         z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z;
      this.y = e[1] * x + e[5] * y + e[9] * z;
      this.z = e[2] * x + e[6] * y + e[10] * z;
      this.normalize();
      return this;
   },
   divide: function (v) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      return this;
   },
   divideScalar: function (scalar) {
      if (scalar !== 0) {
         var invScalar = 1 / scalar;
         this.x *= invScalar;
         this.y *= invScalar;
         this.z *= invScalar;
      } else {
         this.x = 0;
         this.y = 0;
         this.z = 0;
      }
      return this;
   },
   min: function (v) {
      if (this.x > v.x) {
         this.x = v.x;
      }
      if (this.y > v.y) {
         this.y = v.y;
      }
      if (this.z > v.z) {
         this.z = v.z;
      }
      return this;
   },
   max: function (v) {
      if (this.x < v.x) {
         this.x = v.x;
      }
      if (this.y < v.y) {
         this.y = v.y;
      }
      if (this.z < v.z) {
         this.z = v.z;
      }
      return this;
   },
   clamp: function (min,max) {
      // This function assumes min < max, if this assumption isn't true it will not operate correctly
      if (this.x < min.x) {
         this.x = min.x;
      } else if (this.x > max.x) {
         this.x = max.x;
      }
      if (this.y < min.y) {
         this.y = min.y;
      } else if (this.y > max.y) {
         this.y = max.y;
      }
      if (this.z < min.z) {
         this.z = min.z;
      } else if (this.z > max.z) {
         this.z = max.z;
      }
      return this;
   },
   clampScalar: (function () {
      var min,max;
      return function (minVal,maxVal) {
         if (min === undefined) {
            min = new Vector3();
            max = new Vector3();
         }
         min.set(minVal,minVal,minVal);
         max.set(maxVal,maxVal,maxVal);
         return this.clamp(min,max);
      };
   })(),
   floor: function () {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      return this;
   },
   ceil: function () {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      return this;
   },
   round: function () {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      return this;
   },
   roundToZero: function () {
      this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
      this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
      this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
      return this;
   },
   negate: function () {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
   },
   dot: function (v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
   },
   lengthSq: function () {
      return this.x * this.x + this.y * this.y + this.z * this.z;
   },
   length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
   },
   lengthManhattan: function () {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
   },
   normalize: function () {
      return this.divideScalar(this.length());
   },
   setLength: function (l) {
      var oldLength = this.length();
      if (oldLength !== 0 && l !== oldLength) {
         this.multiplyScalar(l / oldLength);
      }
      return this;
   },
   lerp: function (v,alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      this.z += (v.z - this.z) * alpha;
      return this;
   },
   cross: function (v,w) {
      if (w !== undefined) {
         console.warn('Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
         return this.crossVectors(v,w);
      }
      var x = this.x,
         y = this.y,
         z = this.z;
      this.x = y * v.z - z * v.y;
      this.y = z * v.x - x * v.z;
      this.z = x * v.y - y * v.x;
      return this;
   },
   crossVectors: function (a,b) {
      var ax = a.x,
         ay = a.y,
         az = a.z;
      var bx = b.x,
         by = b.y,
         bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
   },
   projectOnVector: function () {
      var v1,dot;
      return function (vector) {
         if (v1 === undefined) v1 = new Vector3();
         v1.copy(vector).normalize();
         dot = this.dot(v1);
         return this.copy(v1).multiplyScalar(dot);
      };
   }(),
   projectOnPlane: function () {
      var v1;
      return function (planeNormal) {
         if (v1 === undefined) v1 = new Vector3();
         v1.copy(this).projectOnVector(planeNormal);
         return this.sub(v1);
      }
   }(),
   reflect: function () {
      // reflect incident vector off plane orthogonal to normal
      // normal is assumed to have unit length
      var v1;
      return function (normal) {
         if (v1 === undefined) v1 = new Vector3();
         return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
      }
   }(),
   angleTo: function (v) {
      var theta = this.dot(v) / (this.length() * v.length());
      // clamp, to handle numerical problems
      return Math.acos(Math.clamp(theta,-1,1));
   },
   distanceTo: function (v) {
      return Math.sqrt(this.distanceToSquared(v));
   },
   distanceToSquared: function (v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      var dz = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
   },
   setEulerFromRotationMatrix: function (m,order) {
      console.error('Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
   },
   setEulerFromQuaternion: function (q,order) {
      console.error('Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
   },
   getPositionFromMatrix: function (m) {
      console.warn('Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
      return this.setFromMatrixPosition(m);
   },
   getScaleFromMatrix: function (m) {
      console.warn('Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
      return this.setFromMatrixScale(m);
   },
   getColumnFromMatrix: function (index,matrix) {
      console.warn('Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
      return this.setFromMatrixColumn(index,matrix);
   },
   setFromMatrixPosition: function (m) {
      this.x = m.elements[12];
      this.y = m.elements[13];
      this.z = m.elements[14];
      return this;
   },
   setFromMatrixScale: function (m) {
      var sx = this.set(m.elements[0],m.elements[1],m.elements[2]).length();
      var sy = this.set(m.elements[4],m.elements[5],m.elements[6]).length();
      var sz = this.set(m.elements[8],m.elements[9],m.elements[10]).length();
      this.x = sx;
      this.y = sy;
      this.z = sz;
      return this;
   },
   setFromMatrixColumn: function (index,matrix) {
      var offset = index * 4;
      var me = matrix.elements;
      this.x = me[offset];
      this.y = me[offset + 1];
      this.z = me[offset + 2];
      return this;
   },
   equals: function (v) {
      return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
   },
   fromArray: function (array) {
      this.x = array[0];
      this.y = array[1];
      this.z = array[2];
      return this;
   },
   toArray: function () {
      return [this.x,this.y,this.z];
   },
   clone: function () {
      return new Vector3(this.x,this.y,this.z);
   }
};
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
// --------------------------------------------------------END----------------------------------------------------------//
var first = false;
var second = false;
var third = false;
var fourth = false;
var cat4 = false;
var cat5 = false;
var fourth = false;
var onComplete = true;
var currneAnim;
var vidx;
var RackServer = false;

var preLoadImage1 = new Image();
var preLoadImage2 = new Image();
var preLoadImage3 = new Image();

var preLoadImage4 = new Image();
var preLoadImage5 = new Image();
var preLoadImage6 = new Image();
var preLoadImage7 = new Image();
var preLoadImage8 = new Image();

function load_img() {
   preLoadImage1.src = 'images_gl/loaderblock.jpg';
   preLoadImage5.onload = afterLoad;
}

function afterLoad() {
   $('#transPatch').css('display','block');
   $('.fullScreenBox,#close_btn,#logoAdidas,#logoPredator').css('visibility','visible');

}


$(document).ready(function () {
   load_img();

   $(document).on('click','.playAll',autoPlayAllAnimations)
   $(document).on('click','.pauseAll',autoPauseAllAnimations)
});

$(window).load(function () {
   // load_img(); 
});

function closeSuperblaze() {
   scene.stop();
   $(window.parent).unbind('resize');
   setTimeout(function () {
      window.top.stopAutoplay();
      autoplayCatalog = window.top.autoplayCatalog;
      window.top.superblazeClosed();
   },300);
}

$(function () {
   resizePage(window.innerWidth,window.innerHeight);
   resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
   if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
      // console.log("ie1")
      $("#close").css('display','none');
      $("#fullScreen").css('display','none');
   } else {
      $("#fullScreen").css('display','block');
   }

   //    if ((navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0)) {
   //                           console.log("onlyie")
   //                           $(".menuitems, .menuitems1").css("background-color","#4a4a4b");
   //                                       $(".menuitems, .menuitems1").addClass("iespe");
   //
   //                           }
})
function closeOption() {
   for (i = 1; i <= 17; i++) {
      $("#colors" + i).css("display","none");
      $("#forselectcolor" + i).css("display","none");
   }
   $("#colorTextforcat5").css("display","none");
}

$(window).load(function () {
   resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
   $(window).live('resize',function () {
      resizePage(window.innerWidth,window.innerHeight);
   });
   window.onresize = function (event) {
      resizePage(window.innerWidth,window.innerHeight);
   }

});


function onReset() {
   onResetCameraClickGL(); //in _ui.js
}

function onZoomSlide(event,ui) {
   var val = -20 * (ui.value / 100) + 10;
   NavSetDolly(val);
   updateZoomBar(val);
   scene.clearRefine();
}

$(function () {
   // Slider
   //range: 'min',
   $('#zoom_slider').slider({
      orientation: "vertical",
      value: 155,
      min: 0,
      max: 205,
      slide: onZoomSlide
   });
   $('nodrag').on('dragstart',function (event) {
      event.preventDefault();
   });
   $('.nodrag').mousedown(function () {
      return false
   });

});

function buttonsZoom(value) {
   var delta = value;
   var deltaScene = (delta * 0.03) * (0.3);
   deltaScene = -deltaScene;
   if (NavSetDolly(g_navDolly + deltaScene)) {
      scene.clearRefine();
      updateZoomBar(g_navDolly - 10);
   }
}
var updateEnabled = true;
var canvas = null,
   canvas2 = null;
var scene = null,
   scene2 = null;
var _scenePollInterval;
var outstandingJobs;
var totalJobs;
var firstTime = true;
var tempW = 5;
var animationLoading;
var autoplayAnim = false;


$(document).ready(function () {
   animationLoading = setInterval(function () {
      //                                 console.log("loaderbar>>")
      tempW = tempW + 1;
      if (tempW > 30) tempW = 30;
      $("#loaderbar").css("width",tempW + "px");

   },100);
})
function isSuperblazeReady() {
   //    console.log("in")
   if (scene) {
      //totalJobs = 230;
      scene.start();
      outstandingJobs = scene.getOutstandingJobs();
      //         console.log("outstandingJobs", outstandingJobs);

      // scene.gotoPosInTime(-0.199846, 0.045921, 5.380196, 5.55286, 250, 1);


      if (!(scene._projectparsed /*&& scene._started*/)) {
         if (firstTime) {

            firstTime = false;
            //                            animationLoading = setInterval(function() {  
            //                                // console.log("loaderbar>>")
            //                                tempW = tempW + 1;
            //                                if (tempW > 30) tempW = 30;
            //                                $("#loaderbar", window.parent.document).css("width", tempW + "px"); 
            //                               
            //                            }, 10);

         }
      } else if (outstandingJobs <= 0 && scene._prepared) {
         onSuperBlazeReady();
         clearInterval(_scenePollInterval);
      } else if (scene._projectparsed /*&& scene._started*/) {
         clearInterval(animationLoading);
         updateProgressBar();
      }
   }

}

function updateProgressBar() {
   totalJobs = scene.getTotalJobs();
   outstandingJobs = scene.getOutstandingJobs();
   var perc = 100 - Math.round(outstandingJobs / totalJobs * 100);
   // var newwidth = 170-(170 * (outstandingJobs / totalJobs))+20;
   var newwidth = 50 + 141 * perc / 100;
   if (newwidth < 30) newwidth = 30;
   //console.log("updateProgressBar -- loaderbar "+newwidth+"px perc "+perc+" jobs "+outstandingJobs+"/"+totalJobs);
   $("#loaderbar").css("width",newwidth + "px");
}

$(function () {
   $(".accordion").accordion({
      heightStyle: "content",
      collapsible: true,
      speed: 'slow',
      active: false
   });
   $('.accordion h3#autoPlays').addClass('ui-state-disabled').off('click');
   $('.accordion h3#menu2').addClass('ui-state-disabled').off('click');
   $('.accordion h3#menu5').addClass('ui-state-disabled').off('click');
   $(".accordion h3#menu7").addClass("ui-state-disabled").off('click');
   $('.accordion h3#menu9').addClass('ui-state-disabled').off('click');
   $(".accordion h3#menu10").addClass("ui-state-disabled").off('click');
   $(".accordion h3#menu11").addClass("ui-state-disabled").off('click');
   $(".accordion h3#menu12").addClass("ui-state-disabled").off('click');
   $(".accordion h3#menu4").addClass("ui-state-disabled").off('click');
   $(".accordion h3#menu15").addClass("ui-state-disabled").off('click');
   //$(".accordion h3#menu6").addClass("ui-state-disabled").off('click');
   $(".accordion h3#menu8").addClass("ui-state-disabled").off('click');
   $(".accordion h3#menu99").addClass("ui-state-disabled").off('click');
});

var animStoped = true;
var animCntrlBlock = true;

$(document).ready(function () {
   var fc = true;
   $(".menuitemsBase").click(function () {
      $("#panel").fadeToggle(200);
      autoPauseAllAnimations();
   });

   $(".menuitems").click(function () {
      //                          if (!animStoped || (!clickEventActive)) return;
      if (!clickEventActive && !autoRotateState) return;

      //						$( ".accordion" ).accordion( "option", "disabled", true );
      setTimeout(Autoplayfive,5000);
      Enclosurehide();
      objectsHidenew();
      divHide();
      allStatesOff();
      reverseAllCenter();
      objectHide();
      $('#playVideos').css('display','none');
      (stopVid);
      clearInterval(autoRotateInterval);
      clearTimeout(autoPlayInt);
      clearTimeout(myVar);
      clearTimeout(startAutorot);
      $("#dummy-canvas").css("pointer-events","all");
      // $("#rightAnim").css("display","block");
      $("#point10text").css("display","none");
      $('#point14text').css('display','none');
      firstAnim = true;
      animblockStopped = false;
      setTimeout(function () {
         animblockStopped = true;
      },2000)
      animStoped = false;
      for (var i = 0; i < timeouts.length; i++) {
         clearTimeout(timeouts[i]);
      }
      timeouts = [];

      $(".menuitems").removeClass('active');

      $(".menuitems").css("background-color","").css("opacity","");
      var newId = this.id;
      autoRotateStop();
      $(this).addClass('active');
      for (var j = 1; j <= 19; j++) { translateOut(j); }
      $(".noselect.pointcontent").removeClass("BlockClass");

      var a = "This is where the active feature text is shown -in a space saving place";
      $("#point2text .descriptionDemo").html(a);
      $("#point3text .descriptionDemo").html(a);
      $("#point7text .descriptionDemo").html(a);
      $("#point5text .descriptionDemo").html(a);
      $(".greyOutBox").removeClass("disabled");
      $(".animPlayBtns .greyOutBox, .greyOutBox").removeClass("redOutBox");
      $("#cpSubHeading").text("");
      // $("#point14text").removeClass('point3Active');
      if (autoplayAnim) autoPauseAllAnimations();
      currneAnim = Number(newId.slice(4));
      console.log("currneAnim",currneAnim);
      console.log("id",newId,"currentAnimation",currneAnim);
      objectHide();
      switch (newId) {
         case "menu2":
            $(".accordion").accordion("option","active",false);
            $("#accordion1").accordion("option","active",0);
            menu2Click();
            break;
         case "menu3":
            menu3Click();
            break;
         case "menu4":
            menu4Click();
            break;
         case "menu5":
            menu5Click();
            break;
         case "menu7":
            $(".accordion").accordion("option","active",false);
            $("#accordion3").accordion("option","active",0);
            menu7Click();
            break;
         case "menu8":
            menu8Click();
            break;
         case "menu6":
            $(".accordion").accordion("option","active",false);
            menu6Click();
            break;
         case "menu9":
            $(".accordion").accordion("option","active",false);
            $("#accordion1").accordion("option","active",1);
            menu9Click();
            break;
         case "menu12":
            menu12Click();
            break;
         case "menu13":
            menu13Click();
            break;
         case "menu14":
            menu14Click();
            break;
         case "menu15":
            $(".accordion").accordion("option","active",false);
            menu15Click();
            break;
         case "menu10":
            $(".accordion").accordion("option","active",false);
            menu10Click();
            break;
         case "menu11":
            $(".accordion").accordion("option","active",false);
            menu11Click();
            break;

      }
   });

   $(".point13click").click(function () {
      for (var i = 0; i < timeouts.length; i++) {
         clearTimeout(timeouts[i]);
      }
      timeouts = [];
      if (autoplayAnim) autoPauseAllAnimations();
      menu11Fadeout();
      notrepeat = false;
      /*  $("#point13text2").fadeIn(500);
       $("#point13text3").fadeIn(500);
       $("#point13text4").fadeIn(500);
       $("#point13text7").fadeIn(500); */
      var pointId = this.id;
      console.log("pointId",pointId);
      if (pointId == "point13text2") {
         point11anim1();
      } else if (pointId == "point13text3") {
         point11anim2();
      } else if (pointId == "point13text4") {
         point11anim3();
      } else if (pointId == "point13text5") {
         point11anim4();
      } else if (pointId == "point13text6") {
         point11anim5();
      } else if (pointId == "point13text7") {
         point11anim6();
      } else if (pointId == "point13text8") {
         point11anim7();
      }
   });
});




var firstAnim = true;
function fadingEffect(selector) {
   //    animStoped = false;
   firstAnim = false;
   var width = $("#" + selector).width();
   console.log("width",width);
   for (i = 100; i > 0; i--) {
      $("#" + selector).animate({ width: i + "%" },0.5);
   }
}

function reverseAllCenter() {
   // scene.fovy = 20.4079;
   rackRotation = false;
   scene._nav._navPanSpeed = 0.012;
   scene._nav._navRotationSpeed = 0.008;
   scene._nav._navDollySpeed = 0.00075;
   var center = [0,0,0];
   window.scene._nav.SetRotationCenter(center);
   scene._nav._navMode2Speed = 0.0015;
}

function imgPreLoader() {
   $.preloadImages = function () {
      for (var i = 0; i < arguments.length; i++) {
         $("<img />").attr("src",arguments[i]);
      }
   }

   $.preloadImages(
      "./images_gl/Play.svg",
      // "./images_gl/right_popup.svg",
      "./images_gl/Lenovo.svg",
      "./images_gl/lines/0.png",
      "./images_gl/lines/1.png",
      "./images_gl/lines/2.png",
      "./images_gl/lines/3.png",
   );
}

function UiLoader() {

   $("#hamb img").attr("src","./images_gl/hamburger.png");
   $("#resetBtn img").attr("src","./images_gl/reset.svg");
   $("#lenovo_logo img").attr("src","./images_gl/Lenovo.svg");
   //	$("#fullScreen img").attr("src", "../images_gl/Fullscreen_01.png");
   // $("#rightAnim img").attr("src","./images_gl/right_popup.svg");
   $("#pauseplayImg img").attr("src","./images_gl/Play.svg");

   $("#point10text .point10text2").attr("src","./images_gl/LiCOPicture1.png");
   $("#point10text .point10text3").attr("src","./images_gl/LiCOPicture2.png");
   $("#point10text .point10text4").attr("src","./images_gl/LiCOPicture3.png");
   $("#point10text .point10text5").attr("src","./images_gl/LiCOPicture4.png");
   $("#point10text .point10text6").attr("src","./images_gl/LiCOPicture5.png");

   $("#hotspot1plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot2plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot2plus1.plus").attr("src","./images_gl/anybay.png");
   $("#hotspot3plus.plus").attr("src","./images_gl/lines/4.png");
   $("#hotspot4plus.plus").attr("src","./images_gl/lines/5.png");
   $("#hotspot5plus.plus").attr("src","./images_gl/lines/90x120.png");
   $("#hotspot6plus.plus").attr("src","./images_gl/lines/5.png");
   $("#hotspot7plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot07plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot8plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot9plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot99plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot999plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot10plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot11plus.plus").attr("src","./images_gl/lines/31.png");
   $("#hotspot12plus.plus").attr("src","./images_gl/lines/0.png");
   $("#hotspot13plus.plus").attr("src","./images_gl/lines/30.png");
   $("#hotspot14plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot15plus.plus").attr("src","./images_gl/lines/29.png");
   $("#hotspot16plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot17plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot18plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot19plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot20plus.plus").attr("src","./images_gl/lines/36.png");
   $("#hotspot21plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot22plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot23plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot24plus.plus").attr("src","./images_gl/lines/21.png");
   $("#hotspot25plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot26plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot27plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot28plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot28plus1.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot29plus.plus").attr("src","./images_gl/lines/39.png");
   $("#hotspot30plus.plus").attr("src","./images_gl/lines/3.png");
   $("#hotspot50plus.plus").attr("src","./images_gl/lines/3.png");
   $("#hotspot31plus.plus").attr("src","./images_gl/lines/55.png");
   $("#hotspot32plus.plus").attr("src","./images_gl/lines/21.png");
   $("#hotspot33plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot34plus.plus").attr("src","./images_gl/lines/0.png");
   $("#hotspot35plus.plus").attr("src","./images_gl/lines/0.png");
   $("#hotspot36plus.plus").attr("src","./images_gl/lines/22.png");
   $("#hotspot40plus.plus").attr("src","./images_gl/lines/120x200.png");
   $("#hotspot41plus.plus").attr("src","./images_gl/lines/55.png");
   $("#hotspot42plus.plus").attr("src","./images_gl/lines/40.png");
   $("#hotspot43plus.plus").attr("src","./images_gl/lines/14.png");
   $("#hotspot44plus.plus").attr("src","./images_gl/lines/130x140.png");
   $("#hotspot45plus.plus").attr("src","./images_gl/lines/373X120.png");
   $("#hotspot46plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot47plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot48plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot49plus.plus").attr("src","./images_gl/lines/33.png");
   $("#hotspot51plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot52plus.plus").attr("src","./images_gl/lines/32.png");
   $("#hotspot63plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot64plus.plus").attr("src","./images_gl/lines/23_130.png");
   $("#hotspot65plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot66plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot67plus.plus").attr("src","./images_gl/lines/1.png");
   $("#hotspot68plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot69plus.plus").attr("src","./images_gl/lines/23.png");
   $("#hotspot70plus.plus").attr("src","./images_gl/lines/23_130.png");
   $("#point5text .Point5Img").attr("src","./images_gl/Picture6.png");

   $("#point10image1 img").attr("src","./images_gl/01.png");
   $("#pont10Img1 img").attr("src","./images_gl/02.png");
   $("#pont10Img2 img").attr("src","./images_gl/03.png");
   $("#home img").attr("src","./superblaze_demo_images/reset.png");

   $("#NivdiaLogo14 img").attr("src", "./images_gl/intel.svg");
   $("#NivdiaLogo15 img").attr("src", "./images_gl/MaxLogo.svg");
   $("#point4text #NivdiaLogo4").attr("src","./images_gl/intel.svg");
   $("#point4text #NivdiaLogo5").attr("src","./images_gl/MaxLogo.svg");
   $("#point7text .Point7Img").attr("src","./images_gl/intel.svg");
   $("#point7text .Point7Img_Max").attr("src","./images_gl/MaxLogo.svg");
   $("#point6text .Point6Img").attr("src","./images_gl/Picture6.png");

   $("#playVideos").append('<video id="screen-video1" width="100%" style="margin:0;" loop><source id="screen-video-src" type="video/mp4" src="./media/SD650_V3_MG_HD.mp4"></video>');

   imgPreLoader();
   var img = new Image();
   img.onload = function () {
   }
}
function playVid(vid) {
   vid.play();
   //        vid.loop();
}

function pauseVid() {
   vidx.pause();
}

function stopVid() {
   vidx.pause();
   vidx.currentTime = 0;
}



function menuFading() {
   //	$("#menu2").fadeIn(700, function(){
   //		$("#menu3").fadeIn(700, function(){
   //			$("#menu4").fadeIn(700, function(){
   //				$("#menu5").fadeIn(700, function(){
   //					$("#menu6").fadeIn(700, function(){
   //						$("#menu7").fadeIn(700, function(){
   //							$("#menu8").fadeIn(700, function(){
   //								$("#menu9").fadeIn(700, function(){
   //								    $("#menu10").fadeIn(700, function(){
   //								       $("#autoPlays").fadeIn(700);
   //							        })
   //							     })
   //							})
   //						})
   //					})
   //				})
   //			})
   //		})	
   //	})
}

function onSuperBlazeReady() {
   scene._jitRadius = 3;
   scene._zNearMin = 5.0;
   if (mob) scene._bDoF = false;
   window.addEventListener('focus',onWindowFocus,false);
   window.addEventListener('blur',onWindowBlur,false);
   $("#cpHeading").html("ThinkSystem SD650 V3 Nodes");
   $("#onloadCopy").css('display','block');
   scene.groupApplyState('SD650_ON');
      scene.groupSet("Top_Cover","visible",false);
      scene.groupApplyState('SD650_TOP_COVER_OFF');
      scene.groupApplyState('internals_on');
      scene.groupApplyState('Enclosure_OFF');
      scene.groupApplyState('Nvidia_OFF');
      scene.groupApplyState('Rack_OFF');
   //$("#point14text").css("display","block");
   //$("#point14text").fadeIn(200);
   // menu3 = false;

   // menu2Click();
   scene.gotoPosInTime(3.7049870270416103,0.4039441921469284,3.3999872004332525,0.9135648510001506,117.53675453357195,0,function () {
      menu2Click();
      $("#ui-accordion-accordion-panel-1").css('display','block');
      $(".greyOutBox").removeClass('redOutBox');
      // $("#menu2,#menu3 .greyOutBox").addClass('redOutBox');
      $("#menu3,#menu4,#menu5").removeClass('redOutBox');
      $("#accordion1").accordion("option","active",0);

   });
   end = new Date().getTime();
   var time = end - start;
   if (time < 60000) {
      //            RT_RecordTiming("Load", time, "ThinkSystem SR550");
   }
   console.log('End time: ' + time);

   if (autoplayCatalog) {
      setTimeout(function () {
         autoPlayAllAnimations();
      },8000);
   }

   setTimeout(function () {

      scene.instanceSet("Hot_spot","visible",false);
      $("#reset").css("visibility","visible");
      $("#transPatch2").css("display","none");
      $("#loader,#loader1,#loader2,#transPatch").css("display","none");
      $("#canvasContainer").css("visibility","visible");
      $("#superblazeWrapper").css('display','block');
      $("#superblaze").css('display','block');
      $("#pointtext1 div, #pointtext1 ul").css("display","none");
      $("#transPatch5").css('display','none');
      $('#reset').css('visibility','visible');
      $("#point3Div").css('display','none');
      $("#point5Div").css('display','none');
      $("#transPatchDiv").css('display','none');
      $("#point7Div").css('display','none');
      $("#HeadingDiv").css('display','none');
      showScene();
      if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
         //console.log("ie")
         $("#fullScreen").css('display','none');
         $("#loader,#loader1,#loader2,#transPatch").css("display","none");
      } else {
         $("#fullScreen").css('display','block');
      }
   },500);

   /* setTimeout(function () {
      $("#loader,#loader1,#loader2,#transPatch").css("display","none");
   },3000) */
   UiLoader();
}

var menu2 = false;

$(document).ready(function () {
   try {
      parent.document;
      // accessible
      resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);
      if (window.parent.parent.bandwidth) {
         autoplayCatalog = window.parent.autoplayCatalog;
         ////console.log("content window"+autoplayCatalog);
      } else {
         autoplayCatalog = false;
         $("#home").css("display","none");
         $("#backText").css("display","none");

      }
      $(window.parent).bind('resize',function () {
         resizePage(window.parent.innerWidth,window.parent.innerHeight);
      });
      window.onresize = function (event) {
         resizePage(window.parent.innerWidth,window.parent.innerHeight);
      }
      $(window).bind("fullscreen-toggle",function (e,state) {
         ////console.log("full toggle");
         resizePage(window.parent.document.documentElement.clientWidth,window.parent.document.documentElement.clientHeight);
      });
   } catch (e) {
      // not accessible
      resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
      autoplayCatalog = false;
      $("#home").css("display","none");
      $("#backText").css("display","none");
      $(window).bind('resize',function () {
         resizePage(window.innerWidth,window.innerHeight);
      });
      window.onresize = function (event) {
         resizePage(window.innerWidth,window.innerHeight);
      }
      $(window).bind("fullscreen-toggle",function (e,state) {
         ////console.log("full toggle");
         resizePage(window.document.documentElement.clientWidth,window.document.documentElement.clientHeight);
      });
   }
});



function SuperblazeStart(gl) {
   try {
      parent.document;
      resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);
      $(window).resize(function () {
         resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);

      });

   } catch (e) {
      resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);
      $(window).resize(function () {
         resizePage(document.documentElement.clientWidth,document.documentElement.clientHeight);

      });

   }
   canvas = document.getElementById("superblaze-canvas");
   var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

   if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1)) {

      //        scene = new infinityrt_scene(gl, "../v5/model_gl/", canvas.width, canvas.height);
      scene = new infinityrt_scene(gl,"model_gl/",canvas.width,canvas.height,undefined,undefined,undefined,InitialSceneState,AllGeometryComplete);
      //console.log("mob");
   } else {

      //        scene = new infinityrt_scene(gl, "../v5/model_gl/", canvas.width, canvas.height);
      scene = new infinityrt_scene(gl,"model_gl/",canvas.width,canvas.height,undefined,undefined,undefined,InitialSceneState,AllGeometryComplete);

      //console.log("desk");
   }
   scene.fnLoadProgress = updateProgressBar;
   scene.start();
   scene._nav = new infinityrt_navigation(scene,canvas.width,canvas.height);
   _scenePollInterval = setInterval(isSuperblazeReady,100);
   start = new Date().getTime();
   //    NavInit(canvas.width, canvas.height);
   var canvasDummy = document.getElementById("superblaze-canvas");
   addMouseListeners(canvasDummy);
   /* scene._slowinoutfac = 0.9;*/
   if (scene != null) {


      window.requestAnimationFrame(frameUpdate);
      $(this).bind("contextmenu",onRightClick); //prevents a right click     
      document.body.oncontextmenu = onRightClick;
      //window.addEventListener('oncontextmenu',onRightClick,false);
      //if (typeof(onInit()) != 'undefined') onInit();
   }
   initDragCursor();
}
var AllgeoIntl = false;
var InHotspot = false;

function InitialSceneState() {
   // InHotspot = true;
}

function AllGeometryComplete() {
   AllgeoIntl = true;
   console.log('All time: ' + (new Date().getTime() - start));
   vidx = document.getElementById("screen-video1");
}
var mob = (navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1);

var FullscreenOff = false;

function launchFullscreen(element) {
  
}

function exitFullscreen() {
   
}

window.document.onkeyup = function (e) {
   // console.log("ECS pressed IE1");
   if (e.keyCode == 27) { // escape key maps to keycode `27`
     
      var iE = 0;
      var _intervalEsc = setInterval(function () {
         if (iE < 5) {
            // console.log("func"+iE);
            //                exitFullscreen(window.parent.document.documentElement);
            iE++;
         } else {
            clearInterval(_intervalEsc);
         }
      },10);
   }
}

var FullscreenOn = false;
function resizePage1(width,height) {
    
}

function resizePage(width,height) {
       var s;

       try{
           parent.document;
           if(window.parent.parent.bandwidth=="high"){
               if (width > 1080) {
                   width=1080;
               }
               if (height> 1920) {
                   height=1920;
               }

           }else{
               if (width > 1080) {
                   width=1080;
               }
               if (height> 1920) {
                   height=1920;
               }
            
       }
            
       }catch(e){
               // not accessible
              if (width > 1080) {
                   width=1080;
               }
               if (height> 1920) {
                   height=1920;
               }
        
       }
       var w=eval(width/1080);
       var h=eval(height/1920);

       if(w<h){
         s=w;

     var div = document.getElementById ("superblaze-canvas");
           if (div.getBoundingClientRect) {        // Internet Explorer, Firefox 3+, Google Chrome, Opera 9.5+, Safari 4+
               var rect = div.getBoundingClientRect (); 
               new_w = rect.right - rect.left; 
               new_h = rect.bottom - rect.top;      
           }
           else {
               ////console.log("Your browser does not support this example!");
           }
           try{
               parent.document;
                $('#superblaze').css({
                   'margin-left':(($(window).width() - new_w)/2),
                   'margin-top':parseInt(window.parent.innerHeight - new_h)/2 
                });
           }catch(e){
                   // not accessible
              
                $('#superblaze').css({
                   'margin-left':(($(window).width() - new_w)/2),
                   'margin-top':parseInt(window.innerHeight - new_h)/2 
                });
           }

       }
       else
       {
      
         s=h;
         var div = document.getElementById ("superblaze-canvas");
           if (div.getBoundingClientRect) {        // Internet Explorer, Firefox 3+, Google Chrome, Opera 9.5+, Safari 4+
               var rect = div.getBoundingClientRect (); 
               new_w = rect.right - rect.left; 
               new_h = rect.bottom - rect.top;    
           }
           else {
               ////console.log("Your browser does not support this example!");
           }
           try{
               parent.document;
               $('#superblaze').css({
                   'margin-left':(($(window).width() - new_w)/2) ,
                   'margin-top':parseInt(window.parent.innerHeight - new_h)/2 
               });
            
           }catch(e){
                   // not accessible
               $('#superblaze').css({
                   'margin-left':(($(window).width() - new_w)/2) ,
                   'margin-top':parseInt(window.innerHeight - new_h)/2 
               });
             
           }
       }
       $("#superblaze").css({
           'transform': 'scale('+s+')',
           'transform-origin': '0% 0%',
        
           '-webkit-transform': 'scale('+s+')',
           '-webkit-transform-origin': '0% 0%',
        
            '-moz-transform': 'scale('+s+')',
           '-moz-transform-origin': '0% 0%',
        
            '-o-transform': 'scale('+s+')',
           '-o-transform-origin': '0% 0%',
        
            '-ms-transform': 'scale('+s+')',
           '-ms-transform-origin': '0% 0%',
       });
}


function addMouseListeners(canvas) {
   canvas.addEventListener('mousemove',mouseMove,false);
   canvas.addEventListener('mousedown',mouseDown,false);
   canvas.addEventListener('mouseup',mouseUp,false);
   canvas.addEventListener('mousewheel',mouseWheel,false);
   canvas.addEventListener('DOMMouseScroll',mouseWheel,false);
   canvas.addEventListener('mouseout',mouseOut,false);
   canvas.addEventListener('touchstart',touchStart,false);
   canvas.addEventListener('touchmove',touchMove,false);
   canvas.addEventListener('touchend',touchEndCan,false);
   // document.getElementById('rightAnim').addEventListener('mousedown',rightAnimClick,false);
   document.getElementById("home").addEventListener("mousedown",closeSuperblaze);
   document.getElementById("back_Button").addEventListener("mousedown",closeSuperblaze);
}


// var rightAnimToggle = true;
var animblockStopped = true;
var timeoutsnew = [];
var timeouts = [];
/*abhijitend*/

// function rightAnimClick() {
//    //	reversAll();
//    if (rightAnimToggle) {
//       $("#rightAnim").animate({ right: '0px' },"slow");
//       rightAnimToggle = false;
//    } else {
//       $("#rightAnim").animate({ right: '-235px' },"slow");
//       rightAnimToggle = true;
//    }
// }

function mouseDownHide() {
   $(".point3headingText").css("opacity","0");
   $(".point6headingText").css("opacity","0");
   $(".point7headingText").css("opacity","0");
   $(".point7text1").css("opacity","0");
   $("#point7text").css("opacity","0");
   $("#point7image1").css("opacity","0");
   $("#point5text").css('display','none');
   // $(".point8headingText").css("opacity","0");
   $(".point2text1").css("opacity","0");
   // $("#point8image1").css("opacity","0");
   $(".point7headingText").css("opacity","0");
   $("#hotspot71").css("display","block");
   $("#point7image1").css("opacity","0");

   // $(".point16headingText").css("opacity","0");
}

function hideAllObjects() {
   scene.groupApplyState('all_off');
   scene.groupApplyState('top_close');
}

function hideCallouts() {
   $("#onloadCopy").css('display','none');
   $("#point3text").css('display','none');
   $("#point6text1").css('display','none');
   $("#point14text").css('display','none');
   $("#point14text1").css('display','none');
   $("#point15text").css('display','none');
    $("#point16text").css('display','none');
   $("#point21text").css('display','none');
   $("#point22text").css('display','none');
   $("#point23text").css('display','none');
   $("#point24text").css('display','none');
   $("#point25text").css('display','none');
   $("#point26text").css('display','none');
   $("#point27text").css('display','none');
   $("#point28text").css('display','none');
   $("#point29text").css('display','none');
   $("#point30text").css('display','none');
   $("#point18text").css('display','none');
   $("#hotspot10").css('display','none');
   $("#hotspot11").css('display','none');
   $("#hotspot511").css('display','none');
   $("#hotspot19").css('display','none');
   $("#hotspot20").css('display','none');
   $("#hotspot21").css('display','none');
   $("#hotspot22").css('display','none');
   $("#hotspot23").css('display','none');
   $("#hotspot24").css('display','none');
   $("#hotspot1").css('display','none');
   $("#hotspot2").css('display','none');
   $("#hotspot3").css('display','none');
   $("#hotspot4").css('display','none');
   $("#hotspot5").css('display','none');
   $("#hotspot533").css('display','none');
	$("#point4text").css('display','none');
   $("#point16text").css('display','none');
  $("#point17text").css('display','none');
  $("#point8text").css('display','none');
  $("#point9text").css('display','none');
}

var menu3 = false;

function divHide() {
   $("#point2text").css('display','none');
   $("#point3text").css('display','none');
   $("#point4text").css('display','none');
   $("#point5text").css('display','none');
   $("#point6text").css('display','none');
   $("#point7text").css('display','none');
  
   $("#point11text").css('display','none');
   $("#point12text").css('display','none');
   $("#point13text").css('display','none');
   $("#point14text").css('display','none');
   $("#point15text").css('display','none');
   
  $("#point16text").css('display','none');
  $("#point17text").css('display','none');
  $("#point8text").css('display','none');
  $("#point9text").css('display','none');
}
function Enclosurehide() {
//    $("#point16text").css('display','none');
//   $("#point17text").css('display','none');
//   $("#point8text").css('display','none');
//   $("#point9text").css('display','none');
}

function objectHide() {
   $("#dummy-canvas,.productName").css('background-color','');
   $("#maincanvasContainer").removeAttr('style');
   $("#cpHeading").css('color','');
   $(".productName").css('background-color','');

   $('#slides .slide').removeClass('showing');
   $('#slides .slide:nth-child(1)').addClass('showing');
   $("#ui-accordion-accordion-panel-1").css('display','none');
   $("#onloadCopy").css('display','none');
   clearInterval(slideInterval);
   scene.clearRefine();
}

function objectsHidenew() {
   scene._nav._navMinDolly = 50;
   scene._nav._navMaxDolly = 200;
   scene._nav._panMax = [30,20]; //[left, bottom];
   scene._nav._panMin = [-30,0]; //[right, top];
   fRotMinLimitUpdate = -0.018;
   scene.groupApplyState('GP_ON');
   scene.groupApplyState("NEW_Cooling_Stand_OFF");
   scene.groupApplyState('SD650_TOP_COVER_ON');

}

function statesOff() {
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('SD650_TOP_COVER_OFF');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Enclosure_2_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Rear_Enclosure_Pipe_Off');
}

var imgs;

function allStatesOff() {
   
   scene.groupApplyState('GP_OFF');
   scene.groupApplyState('Reflection_OFF');
   scene.groupApplyState('GPU_LIGHT_OFF');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Enclosure_2_OFF');
   scene.groupApplyState('Enclosure_GP_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Rear_Enclosure_Pipe_Off');
   scene.groupApplyState('Enclosure_2_OFF');
   scene.groupApplyState('SD650_OFF');
   scene.groupApplyState("SD650_TOP_COVER_OFF");
   scene.groupApplyState('GP_OFF');
   scene.groupApplyState('Reflection_OFF');
   scene.groupApplyState("NEW_Cooling_Stand_OFF");
   $(".bottomBtn").css('display','none');
   $(".point10imgMain").attr("src","");
   imgs = 0;
}
function onlyEnclosure() {
   var center = [0,0,0];
   window.scene._nav.SetRotationCenter(center);
   $("#point13text").css('display','none');
   scene.groupApplyState('Rear_Port_Type_A_off');
   scene.groupApplyState('Rear_Port_Type_B_Off');
   scene.groupApplyState('Rear_Port_Type_C_off');
   scene.groupApplyState('Reflection_OFF');
   scene.groupApplyState('SD650_off');
   scene.groupApplyState('Enclosure_ON');
   scene.groupApplyState('NEW_Cooling_Stand_OFF');
   scene.clearRefine();
}

var open = false;
var close = false;
var rackView = false;
var RackServer = false;
var rackRotation = false;
var menu7clicked = false;
var menu9clicked = false;

function menu2Click() {
   console.log("menu2click");
   objectsHidenew();
   
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   rackView = false;
   RackServer = false;
   //    menu3 = true;
   scene._nav._panMax = [30,15]; //[left, bottom];
   scene._nav._panMin = [-30,0]; //[right, top];
   $("#onloadCopy").css('display','block');
   $("#cpHeading").text("ThinkSystem SD650 V3 Nodes");
   $("#transparentPatch").css("display","none");
   $("#point15text").css('display','none');
   $("#point16text").css('display','none');

   $(".menuitems").parents().prev("#menu3").addClass("active");
   $("#menu2").addClass('active');
   // $("#menu3").removeClass("disabled");
   // $("#menu3").removeClass('active');
   // $(".greyOutBox").removeClass('redOutBox');
   // $("#menu3 .greyOutBox").addClass('redOutBox');
   $("#point14text").css("display","none");
   scene.groupApplyState('SD650_ON');
      scene.groupSet("Top_Cover","visible",false);
      scene.groupApplyState('SD650_TOP_COVER_OFF');
      scene.groupApplyState('internals_on');
      scene.groupApplyState('Enclosure_OFF');
      scene.groupApplyState('Nvidia_OFF');
      scene.groupApplyState('Rack_OFF');
   // $("#point14text").addClass('point14Active');
   
   $("#hotspot11").css('display','none');
   scene.gotoPosInTime(3.7049870270416103,0.4039441921469284,3.3999872004332525,0.9135648510001506,117.53675453357195,1000,(function () {
      $("#onloadCopy").css('opacity','1');
      $(".point1text1").css('display','block');
      animComplete();
   }));

   timeouts.push(setTimeout(function () {
      // autoRotateCall();
    //  console.log("autoRotateCall");
      if (autoplayAnim) {
         animCompeteAuto();
      } else {
         animComplete();
      }
   },2000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu3Click() {
 //  console.log("menu3_click");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   rackView = false;
   RackServer = false;
   // animStoped = false;
   menu2 = true;
   scene._nav._panMax = [30,15]; //[left, bottom];
   scene._nav._panMin = [-30,0]; //[right, top];
   $("#onloadCopy").css('display','none');
   $("#cpHeading").text("ThinkSystem SD650 V3 Nodes");
   $("#transparentPatch").css("display","none");
   $("#point15text").css('display','none');
   $("#point16text").css('display','none');

   // $(".menuitems").parents().prev("#menu3").addClass("active");
   $("#menu2").addClass('active');
   $("#menu3").removeClass("disabled");
   $("#menu3").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu3 .greyOutBox").addClass('redOutBox');
   $("#point14text").css("display","none");
   scene.groupApplyState('SD650_ON');
   scene.groupSet("Top_Cover","visible",false);
   scene.groupApplyState('SD650_TOP_COVER_OFF');
   scene.groupApplyState('internals_on');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');

   $("#point14text").addClass('point14Active');
   scene.gotoPosInTime(3.7049870270416103,0.4039441921469284,3.3999872004332525,0.9135648510001506,117.53675453357195,1000,(function () {
      $("#hotspot1,#hotspot2,#hotspot10,#hotspot11").addClass('VisiBilityHotspot').css('display','block');
      $("#point14text").css("display","block");
      translateIn(14);
    
	   // autoRotateCall();
	     animComplete();
   }));
   timeouts.push(setTimeout(function () {
      
      //console.log("autoRotateCall");
      if (autoplayAnim) {
         animCompeteAuto();
      } else {
         animComplete();
      }
   },2000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();
}

function menu4Click() {
   console.log("menu4Clicked");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   scene._nav._navMinDolly = 50;
   scene._nav._navMaxDolly = 200;
   scene._nav._panMax = [30,10]; //[left, bottom];
   scene._nav._panMin = [-30,-6]; //[right, top];
   // fRotMinLimitUpdate = -0.018;
   rackView = false;
   RackServer = false;
   menu3 = false;
   $("#cpHeading").text("ThinkSystem SD650 V3 Nodes");
   $("#onloadCopy").css('display','none');
   $(".menuitems").parents().prev("#menu3").addClass("active");
   $("#menu2").addClass('active');
   $("#menu4").removeClass("disabled");
   $("#menu4").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu4 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('SD650_ON');
   scene.groupSet("Top_Cover","visible",false);
   scene.groupApplyState('SD650_TOP_COVER_OFF');
   scene.groupApplyState('internals_on');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Upper_plate_off');
   scene.groupApplyState('Rear_Port_Type_A_on');
   scene.groupApplyState('Rear_Port_Type_B_On');
   scene.groupApplyState('Rear_Port_Type_C_on');

   scene.gotoPosInTime(4.708010220143732,1.4946444737231004,2.6416262942708184,0,120.31121069136222,1000,function () {
      $("#point4text").css("display","block");
      $("#hotspot3,#hotspot4,#hotspot5,#hotspot6,#hotspot7,#hotspot07,#hotspot8,#hotspot9,#hotspot99,#hotspot999").css("display","block");
      translateIn(4);
   });

   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      } else {
         animComplete();
      }
   },2000));
   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();


}

function menu5Click() {
   console.log("menu5Clicked");
   // autoRotateStop();
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   scene._nav._navMinDolly = 70;
   scene._nav._navMaxDolly = 220;
   scene._nav._panMax = [30,15]; //[left, bottom];
   scene._nav._panMin = [-30,-3]; //[right, top];
   // fRotMinLimitUpdate = -0.010;
   // animStoped = false;
   rackView = false;
   RackServer = false;
   menu3 = false;
   $("#cpHeading").text("ThinkSystem SD650 V3 Nodes");
   // $("#point4text").css('display', 'block');
   $("#onloadCopy").css('display','none');
   $("#point14text").css('display','none');
   $("#point16text").css('display','none');
   $(".menuitems").parents().prev("#menu3").addClass("active");
   $("#menu2").addClass('active');
   $("#menu5").removeClass("disabled");
   $("#menu5").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu5 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('GP_ON');
   scene.groupApplyState('Reflection_ON');
   scene.groupApplyState('SD650_ON');
   scene.groupApplyState('SD650_INTERNAL_ON');
   scene.groupApplyState("SD650_TOP_COVER_OFF");
   scene.groupSet("Top_Cover","visible",false);

   scene.gotoPosInTime(0.0008740999999998778,0.02180035449858808,0.2372041527435811,-1.1218671251354602,87.27726641507547,1000,function () {
      
      $("#point15text").css('display','block');
      translateIn(15);
   });


   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      } else {
         animComplete();
      }
   },2000));


   menu9clicked = false;
   menu7clicked = false;
   scene.clearRefine();

}

function menu6Click() {
   console.log("menu6Clicked");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   rackView = false;
   RackServer = false;
   menu3 = false;
   autoRotateStop();
   // scene._nav._navMinDolly = 50;
   // scene._nav._navMaxDolly = 200;
   // scene._nav._navPanSpeed = 0.003;
   // scene._nav._panMax = [2,2]; //[left, bottom];
   // scene._nav._panMin = [-2,0]; //[right, top];
   fRotMinLimitUpdate = -0.065;
   $("#ui-accordion-accordion-panel-1").css('display','none');
   $("#cpHeading").html("4th Generation Intel&reg; Xeon&reg; Scalable processors");
   $("#onloadCopy").css('display','none');
   $("#point15text").css('display','none');
   $("#point16text").css('display','none');
   $("#point14text").css('display','none');
   $(".menuitems").parents().prev("#menu3").removeClass("active");
   scene.groupApplyState('SD650_ON');
   scene.groupSet("Top_Cover","visible",false);
   scene.groupApplyState('SD650_TOP_COVER_OFF');
   scene.groupApplyState('internals_on');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');
   scene.groupApplyState('Rear_Port_Type_A_on');
   scene.groupApplyState('Rear_Port_Type_B_On');
   scene.groupApplyState('Rear_Port_Type_C_on');
   scene.groupApplyState('Upper_plate_off');

   scene.gotoPosInTime(0,1.570796,-14.223309,-1.0070400000000003,76.958862,1000,function () {
      $("#point7text .Point7Img .Point7Img_Max").css("display","block");
      //$("#point7text").css("display","block");
      translateIn(7);
   });
   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      }
      else {
         animComplete();
      }
   },4500));

   scene.clearRefine();
   menu7clicked = true;
   menu9clicked = false;

}

var top_cover = false;

function menu7Click() {
   console.log("menu7click");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   rackView = false;
   RackServer = false;
   menu3 = false;
   // animStoped = false;
   menu7clicked = true;
   $("#ui-accordion-accordion-panel-1").css('display','none');

   $("#onloadCopy").css('display','none');
   $("#point15text").css('display','none');
   $("#point14text").css('display','none');
   $("#point16text").css('display','none');
   // animStoped = false;
   // menu6clicked = true;
   objectHide();
   //divHide();
   $("#cpHeading").text("Direct Water Cooling");
   // scene.gotoPosInTime(4.708010220143732,1.4946444737231004,1.4593190421341065,7.525343544572691,300.6235206688435,1000);
   timeouts.push(setTimeout(function () {
      $('#playVideos').css('display','block');
      playVid(vidx);
   },200));


   timeouts.push(setTimeout(function () {
      $("#point6text").fadeIn(400);
      translateIn(6);
      animComplete();

      if (autoplayAnim) {
         animCompeteAuto();
      }

   },2000));

   scene.clearRefine();
   // menu9clicked = false;
   // menu7clicked = false;
}

function menu8Click() {
   console.log("menu8_click");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();

   rackView = false;
   scene._nav._panMax = [30,18]; //[left, bottom];
   scene._nav._panMin = [-30,-6]; //[right, top];
   RackServer = false;
   menu3 = false;
   $("#ui-accordion-accordion-panel-1").css('display','none');

   $("#onloadCopy").css('display','none');
   $("#point15text").css('display','none');
   $("#point14text").css('display','none');
   $("#point16text").css('display','none');
   $(".point5headingText").css('opacity','1');
   $("#cpHeading").text("Component Direct Water Cooling");

   $("#menu7").addClass("active");
   $("#menu8").removeClass("disabled");
   $("#menu8").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu8 .greyOutBox").addClass('redOutBox');
   scene.groupApplyState('SD650_ON');
   scene.groupSet("Top_Cover","visible",false);
   scene.groupApplyState('SD650_TOP_COVER_OFF');
   scene.groupApplyState('internals_on');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Nvidia_OFF');
   scene.groupApplyState('Rack_OFF');

   scene.gotoPosInTime(4.708010220143732,1.4946444737231004,1.4593190421341065,7.525343544572691,115.6235206688435,1000,function () {
      // console.log("menu8_click1");
      $("#point5text").css('display','block');
      translateIn(5);
   });

   timeouts.push(setTimeout(function () {
      if (autoplayAnim) {
         animCompeteAuto();
      }
      else {
         animComplete();
      }
   },2000));

   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}

var menu9clicked = false;
var a;

function menu9Click() {
   console.log("menu9_click");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   hideAllObjects();
   onlyEnclosure();
   rackView = false;
   RackServer = false;
   menu3 = false;
   autoRotateState = false;
    scene._nav._navMinDolly = 90;
   scene._nav._navMaxDolly = 200;
   $("#ui-accordion-accordion-panel-1").css('display','none');
   $("#cpHeading").text("ThinkSystem SD650 V3 Nodes and DW612S Enclosure");
   $("#onloadCopy").css("display","none");
   $("#point15text").css('display','none');
   $("#point14text").css('display','none');
   $("#point16text").css('display','none');
   $("#dummy-canvas").css("pointer-events","all");
   // $("#rightAnim").css("display","none");
   scene.gotoPosInTime(0.4602972545035191,-0.0031415926535897933,-12.133970707422213,14.157810104662651,135.991882,1000,function () {
      // timeouts.push(setTimeout(function () {
         $("#point17text").fadeIn(400);   
          translateIn(17);
});
// },200));

   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4500));

   scene.clearRefine();
   menu9clicked = true;
}

function menu12Click() {
   console.log("menu12_click");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   Enclosurehide();
   onlyEnclosure();
   rackView = false;
   RackServer = false;
   menu3 = false;
   
   autoRotateState = false;
 scene._nav._navMinDolly = 90;
   scene._nav._navMaxDolly = 200;
   $("#cpHeading").text("ThinkSystem SD650 V3 Nodes and DW612S Enclosure");
   $("#menu9").addClass("active");
   $("#menu12").removeClass("disabled");
   $("#menu12").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu12 .greyOutBox").addClass('redOutBox');

   // $("#point9text").css("display","block");
   scene.gotoPosInTime(0.01899999999999999,0.001,-1.934460138885774,1.7020548731184666,120,1000,function () {
   $("#point9text").fadeIn(400);
   translateIn(9);
});
   timeouts.push(setTimeout(function () {
      // autoRotateCall();
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4500));

   scene.clearRefine();
   menu12Clicked = true;

}

function menu13Click() {
   console.log("menu13click");
   objectsHidenew();
   divHide();
   allStatesOff();
   objectHide();
   Enclosurehide();
   rackView = false;
   RackServer = false;
   menu3 = false;
    scene._nav._navMinDolly = 90;
   scene._nav._navMaxDolly = 200;
   $("#ui-accordion-accordion-panel-1").css('display','none');
   $("#onloadCopy").css("opacity","0").fadeOut(400);
   $("#point15text").css('display','none');
   $("#point16text").css('display','none');
   $("#cpHeading").html("ThinkSystem SD650 V3 Nodes and DW612S Enclosure");
   $("#menu9").addClass("active");
   $("#menu13").removeClass("disabled");
   $("#menu13").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu13 .greyOutBox").addClass('redOutBox');
   $("#point11text").css('display','none');
   $("#point14text").css('display','none');
   scene.animPlayInTime('Lenovo_SD650_Oceancat',0,0);
   scene.groupApplyState('Enclosure_ON');
   scene.groupApplyState('Enclosure_2_ON');
   scene.groupApplyState('Rear_Enclosure_Pipe_On');
   scene.gotoPosInTime(3.131276094155656,-0.0031415926535897933,30,3.560072685629912,182.50987468613934,1000,function () {
      var center = [-30,0,0];
      window.scene._nav.SetRotationCenter(center);
   $("#point8text").fadeIn(400);
   translateIn(8);
});
   timeouts.push(setTimeout(function () {
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4500));

   menu9clicked = true;
   menu7clicked = true;
   scene.clearRefine();




}

var storage_dfr = false;
var waterManifold = false;
function menu14Click() {
   console.log("menu14_click");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   Enclosurehide();
   onlyEnclosure();
   autoRotateState = false;
   rackView = false;
   RackServer = false;
   clearTimeout(myVar);
   menu3 = false;
   waterManifold = true;
   scene._nav._navMinDolly = 90;
   scene._nav._navMaxDolly = 200;
   scene.instanceSet("Ex_Tray_center","visible",true);
   $("#ui-accordion-accordion-panel-1").css('display','none');
   $("#cpHeading").html("ThinkSystem SD650 V3 Nodes and DW612S Enclosure");
   $("#onloadCopy").css('display','none');
   $("#menu9").addClass("active");
   $("#menu14").removeClass("disabled");
   $("#menu14").removeClass('active');
   $(".greyOutBox").removeClass('redOutBox');
   $("#menu14 .greyOutBox").addClass('redOutBox');
   scene.instanceSet("Ex_Tray_center","visible",true);
   $("#point15text").css('display','none');
   $("#point14text").css('display','none');
   scene.animPlayInTime("Trey_Handle",0,1);
   scene.animPlayInTime("Ex_Tray_Holder",0,0);
   scene.animPlayInTime("Ex_Tray_Holder",0,0);
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('Enclosure_2_ON');
   scene.groupApplyState('Enclosure_2_Pipes_ON');
   scene.groupApplyState('NEW_Cooling_Stand_ON');
   scene.gotoPosInTime(3.002768409983911,-0.01,101.56880477154285,10.73521268562991,160,1000,function () {
      var center = [-66,0,0];
      window.scene._nav.SetRotationCenter(center);
   $("#point16text").fadeIn(400);
   translateIn(16);
});
   timeouts.push(setTimeout(function () {
      // autoRotateCall();
      animComplete();
      if (autoplayAnim) {
         animCompeteAuto();
      }
   },4500));

   scene.clearRefine();
   menu7clicked = true;
   menu9clicked = false;
}



function menu15Click() {
   console.log("menu15Clicked");
   rackView = true;
   RackServer = true;
   menu3 = false;
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   scene._nav._navMinDolly = 250;
   scene._nav._navMaxDolly = 600;
   scene._nav._panMax = [0,35]; //[left, bottom];
   scene._nav._panMin = [-50,-90]; //[right, top]; 
   fRotMinLimitUpdate = -0.005;

   // animStoped = false;
   $("#onloadCopy").css('display','none');
   $("#ui-accordion-accordion-panel-1").css('display','none');
   $("#cpHeading").html("Neptune&trade; Liquid Cooling Solutions");
   $("#transparentPatch").css('display','none');
   $("#point14text").css('display','none');
   $("#point15text").css('display','none');
   $("#point16text").css('display','none');
   scene.groupApplyState('Rack_ON');
   scene.groupApplyState('Enclosure_OFF');
   scene.groupApplyState('SD650_TOP_COVER_ON');
   scene.groupApplyState('Enclosure_GP_OFF');

   scene.clearRefine();


   rackRotation = false;
   scene._nav._navPanSpeed = 0.07;
   scene._nav._navRotationSpeed = 0.0025;
   scene._nav._navDollySpeed = 0.0015;
   scene._nav._navMode2Speed = 0.011;

   scene.gotoPosInTime(0.1965745869486074,0.004957371469282046,-6.674450625336977,-15.69268879238865,460,1000,function () {
      $("#point2text").css('display','block');
      translateIn(2);
   });

   startAutorot = timeouts.push(setTimeout(function () {

     // autoRotateCall();
      rackRotation = true;
     // console.log("autoRotateCall");
      scene._nav._navRotationSpeed = 0.00095;
      scene._nav._navMode2Speed = 0.0006;
      console.log(rackRotation)
   },5000));

   timeouts.push(setTimeout(function () {
      //$("#onloadCopy").fadeIn(400);

      timeouts.push(setTimeout(function () {

         animComplete();
      },200));

      if (autoplayAnim) {
         animCompeteAuto();
      }


   },2000));

   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;
}

var menu10clicked = false;
var a;
var imgArr = ["./images_gl/slide/LiCOPicture1.png","./images_gl/slide/LiCOPicture2.png","./images_gl/slide/LiCOPicture3.png","./images_gl/slide/LiCOPicture4.png","./images_gl/slide/LiCOPicture5.png"];
//var imgs = 0;
// const urlParams =window.location.href;
document.getElementById("next").addEventListener("click", function () {
   nextClick();
});
document.getElementById("previous").addEventListener("click", function () {
   previousClick();

});
function nextClick() {
   console.log("NEXT CLICK");
   imgs += 1;
   $(".point10imgMain").attr("src",imgArr[imgs]);
   if (imgs >= 4) {
      $(".point10text7").css("opacity","1");
      $(".point10text1").css("opacity","0");
      $("#next").css("display","none");

      imgs = 4;
   } else {
      $(".point10text7").css("opacity","0");
      $(".point10text1").css("opacity","1");
      $("#previous").css("display","block");
   }
}
function previousClick() {
   imgs -= 1;
   $(".point10imgMain").attr("src",imgArr[imgs]);
   if (imgs <= 0) {
      imgs = 0;
      $("#previous").css("display","none");
   }
   if (imgs >= 4) {
      $(".point10text7").css("opacity","1");
      $(".point10text1").css("opacity","0");
   } else {
      $(".point10text7").css("opacity","0");
      $(".point10text1").css("opacity","1");

      $("#next").css("display","block");
   }
}
function menu10Click() {
   console.log("menu10Clicked");
   objectsHidenew();
   divHide();
   allStatesOff();
   reverseAllCenter();
   objectHide();
   rackView = false;
   RackServer = false;
   menu3 = false;
   menu10clicked = true;
   $("#transPatch5").css('display','block');
   $("#onloadCopy").css('display','none');
   $("#cpHeading").text("Lenovo HPC & AI Software Stack");
   $("#onloadCopy").css("display","none");
   $("#dummy-canvas").css("pointer-events","none");
   // $("#rightAnim").css("display","none");
   timeouts.push(setTimeout(function () {
      $("#point10text").fadeIn(400);

      $(".point10text1").css("display","block");
      $(".point10text1").css("opacity","1");
      $(".bottomBtn").css('display','flex');
      $(".point10imgMain").attr("src",imgArr[imgs]);
      $("#previous").css("display","none");
      $("#next").css("display","block");
      scene.instanceSet("Cover","visible",true);
      scene.clearRefine();
   },300));
   timeouts.push(setTimeout(function () {
      animComplete();

      if (autoplayAnim) {
         animCompeteAuto();
      }
   },2000));
   scene.clearRefine();
   menu9clicked = false;
   menu7clicked = false;

}



function slideshow() {


   // console.log("time in set ",Date.now);
   timeouts.push(setTimeout(function () {
      $("#pont10Img1").fadeOut();
      $("#pont10Img2").fadeIn(1000);
   },4000));

   timeouts.push(setTimeout(function () {
      $("#pont10Img2").fadeOut();
      $("#pont10Img1").fadeIn(1000);
   },8000));

   

}
var slideInterval;



function menu11Fadeout() {
   $(".point13click, .point13click img,#point13text8 span").stop();
   $('#point13text8 span,.point13click img').removeAttr('style');
   $(".point13textContent").fadeOut(1);
}
var menu11Clicked = false;
var notrepeat = true;
function menu11Click() {
   // $("#point17text").css("display","none");
   console.log("menu11Clicked");
   objectsHidenew();
   hideAllObjects();
   divHide();
   allStatesOff();
   // reverseAllCenter();
	autoRotateStop();
   menu11Fadeout();
   autoRotateState = false;
   animStoped = false;
   $("#cpHeading").text("Lenovo Infrastructure Services");
   $("#onloadCopy").css("display","none");
   scene.instanceSet("SR850","visible",false);
   $("#dummy-canvas").css("pointer-events","none");
   //    $("#rightAnim").css("display", "none");
   $("#point13text").css('display','block');
   //$("#transPatch5").css('display','block');
   $("#cpHeading,#point13text1,#point13text1SubContent").show();
   objectHide();

   allStatesOff();
   // animStoped = false;
   menu11Fadeout();
   autoRotateState = false;
   notrepeat = true;
  
   $("#onloadCopy").css("display","none");

   $("#dummy-canvas").css("pointer-events","none");
   // $("#rightAnim").css("display","none");

   timeouts.push(setTimeout(function () {
      $("#point13text").css('display','block');
	   autoRotateStop();
   },1000));

   //    slide2
   if (menu11Clicked) {
      point11anim1();
   } else {
      timeouts.push(setTimeout(function () {
         point11anim1();
      },3000));

   }

   timeouts.push(setTimeout(function () {
      animComplete();

      if (autoplayAnim) {
         animCompeteAuto();
      }
   },32000));

   /* timeouts.push(setTimeout(function(){
            if(autoplayAnim){
             animCompeteAuto();
           }else{
               animComplete();         
           }
              
    }, 30000));*/

   top_cover = true;
   scene.clearRefine();
   //currneAnim = 11;
}

function point11anim1() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      //$("#point12text2").fadeIn(500);
      $('#point13text2 img').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','2px solid #3e8ddc');
            $(this).css('background-color','#3e8ddc');
            $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent1").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/us/en/infrastructure-services");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text2 img').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','none');
            $(this).css('border-radius','none');
         }
      },10);
      /* $("#point12text2 img").animate({
         width: '44px'
      },300); */
      $("#point13textContent1").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim2();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

function point11anim2() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      //$("#point12text3").fadeIn(500);
      $('#point13text3 img').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','2px solid #3e8ddc');
            $(this).css('background-color','#3e8ddc');
            $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent2").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/us/en/infrastructure-services");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text3 img').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','none');
            $(this).css('border-radius','none');
         }
      },10);
      $("#point13textContent2").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim3();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

function point11anim3() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      //$("#point12text4").fadeIn(500);
      $('#point13text4 img').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','2px solid #3e8ddc');
            $(this).css('background-color','#3e8ddc');
            $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent3").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/us/en/infrastructure-services");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text4 img').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','none');
            $(this).css('border-radius','none');
         }
      },10);
      $("#point13textContent3").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim4();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

function point11anim4() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      //$("#point12text5").fadeIn(500);
      $('#point13text5 img').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','2px solid #3e8ddc');
            $(this).css('background-color','#3e8ddc');
            $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent4").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/us/en/infrastructure-services");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text5 img').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','none');
            $(this).css('border-radius','none');
         }
      },10);
      $("#point13textContent4").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim5();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

function point11anim5() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      //$("#point12text6").fadeIn(500);
      $('#point13text6 img').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','2px solid #3e8ddc');
            $(this).css('background-color','#3e8ddc');
            $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent5").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/us/en/infrastructure-services");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text6 img').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','none');
            $(this).css('border-radius','none');
         }
      },10);
      $("#point13textContent5").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim6();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

function point11anim6() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      //$("#point12text7").fadeIn(500);
      $('#point13text7 img').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','2px solid #3e8ddc');
            $(this).css('background-color','#3e8ddc');
            $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent6").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/us/en/infrastructure-services");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text7 img').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('border','none');
            $(this).css('border-radius','none');
         }
      },10);
      $("#point13textContent6").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim7();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

function point11anim7() {
   timeouts.push(setTimeout(function () {
      $("#point13text1,#point13text1SubContent").fadeOut(100);
      $('#point13text8 span').animate({
         num: 25
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            // $(this).css('border','2px solid #3e8ddc');
            // $(this).css('background-color','#3e8ddc');
            // $(this).css('border-radius','50%');
         }
      },10);
   },100));
   timeouts.push(setTimeout(function () {
      $("#point13textContent7").fadeIn(500);
      $("a").attr("href","https://techtoday.lenovo.com/ww/en/solutions/media/12951/");
   },200));
   timeouts.push(setTimeout(function () {
      $('#point13text8 span').animate({
         num: 0
      },{
         step: function (now,fx) {
            $(this).css('-webkit-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('-moz-transform','translate(-50%, -50%) scale(1.' + now + ')');
            $(this).css('transform','translate(-50%, -50%) scale(1.' + now + ')');
            // $(this).css('border','none');
            // $(this).css('border-radius','none');
         }
      },10);
      $("#point13textContent7").fadeOut(500);
   },6000));
   timeouts.push(setTimeout(function () {
      if (notrepeat) {
         point11anim1();
      }
      if (!notrepeat) {
         $("#point13text1,#point13text1SubContent").fadeIn(100);
      }
   },6050));
}

var timeouts = [];

// Auto Play function

function autoPlayAllAnimations() {
   console.log("Stopped",animStoped,clickEventActive);
   //if (!animStoped || (!clickEventActive && !autoRotateState)) return;
	if (!clickEventActive && !autoRotateState) return;
   for (var j = 1; j <= 19; j++) { translateOut(j); }
   $(".menuitems").removeClass('active');
   // $("#rightAnim").css("display","block");
   $(".greyOutBox").removeClass('redOutBox');
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(autoPlayInt);
   clearTimeout(startAutorot);
   autoRotateStop();
   $("#dummy-canvas").css("pointer-events","all");
   scene.instanceSet("SR650","visible",true);
   scene.clearRefine();
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   timeouts = [];

   for (var i = 0; i < timeoutsnew.length; i++) {
      clearTimeout(timeoutsnew[i]);
   }
   timeoutsnew = [];


   firstAnim = true;
   autoplayAnim = true;

   $("#autoPlays").removeClass('playAll').off('click.playAll').addClass("pauseAll");
   $("#autoPlays .menuText").html("Stop");
   $("#pauseplayImg").css("display","none");
   $("#pauseplayImg2").css("display","block");
   $("#pauseplayImg2 img").attr("src","./images_gl/Pause.svg").css("height","40px");

   
   if (currneAnim < 16) {
      console.log("currneAnim" + currneAnim);

      if (currneAnim == 2) {
         currneAnim = 3
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 3) {
         currneAnim = 4
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 4) {
         currneAnim = 5
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 5) {
         currneAnim = 7
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 7) {
         currneAnim = 8
         AutoPlayMenus(currneAnim);
      }
      else if (currneAnim == 8) {
         currneAnim = 6
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 6) {
         currneAnim = 9
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 9) {
         currneAnim = 12
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 12) {
         currneAnim = 13
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 13) {
         currneAnim = 14
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 14) {
         currneAnim = 15
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 15) {
         currneAnim = 10
         AutoPlayMenus(currneAnim);
         var autoSlide = setInterval(() => {
            nextClick();
         },2000);
         setTimeout(() => {
            clearInterval(autoSlide);
         },9000);
      } else if (currneAnim == 10) {
         currneAnim = 11
         AutoPlayMenus(currneAnim);
      } else if (currneAnim == 11) {
         if (autoplayCatalog) {
            scene.stop();
            $(window.parent).unbind('resize');
            parent.openSuperblazeAuto();
         }
         currneAnim = 2;
         AutoPlayMenus(currneAnim);
      } else {
         currneAnim++;
         AutoPlayMenus(currneAnim);
      }
      //  AutoPlayMenus(currneAnim);
   } else {
      if (autoplayCatalog) {
         scene.stop();
         $(window.parent).unbind('resize');
         parent.openSuperblazeAuto();
      }
      currneAnim = 2;
      AutoPlayMenus(currneAnim);
   }

   console.log("play",currneAnim);
}


function autoPauseAllAnimations() {
   console.log("pause");
   clearTimeout(autoPlayInt);
   if (autoplayCatalog) {
      parent.stopAutoplay();
   }
   $("#autoPlays").removeClass('pauseAll').off('click.pauseAll').addClass("playAll");
   $("#autoPlays .menuText").html("Play All");
   $("#pauseplayImg2").css("display","none");
   $("#pauseplayImg").css("display","block");
   $("#pauseplayImg img").attr("src","./images_gl/Play.svg").css("height","40px");
   //    $(".menuitems").css("background-color","").css("opacity","");
   autoplayAnim = false;
   if (autoplayAnim) {
      setTimeout(function () {
         autoplayAnim = false;
         var newId = "#menu" + currneAnim;
         $("#menu" + currneAnim).addClass("active").css("background-color","#eb140a").css("opacity","1");

      },50);

   }
   //    for (var i=0; i<timeouts.length; i++) {
   //          clearTimeout(timeouts[i]);
   //     }
   //    timeouts = [];

   clearTimeout(autoPlayInt);

   setTimeout(function () {
      animComplete();
   },2000);
}

var autoPlayInt
function animCompeteAuto() {
   console.log("calleAuto");
   autoPlayInt = setTimeout(function () {
      console.log("stopped");
      autoPlayAllAnimations();
   },9500);
}

function AutoPlayMenus(currneAnim) {
   $(".menuitems").css("background-color","").css("opacity","");
   clearInterval(autoRotateInterval);
   clearInterval(myVar);
   clearTimeout(startAutorot);
   objectHide();
   reversAll();
   $("#point10text").css("display","none")
   $("h3#menu" + currneAnim).css("background-color","#eb140a").css("opacity","1");
   for (var j = 1; j <= 19; j++) { translateOut(j); }
   //     $( ".accordion" ).accordion( "option", "disabled", true );
   switch ("menu" + currneAnim) {
      case "menu2":
         $(".accordion").accordion("option","active",false);
         $("#accordion1").accordion("option","active",0);
         menu2Click();
         break;
      case "menu3":
         menu3Click();
         break;
      case "menu4":
         menu4Click();
         break;
      case "menu5":
         menu5Click();
         break;
      case "menu7":
         $(".accordion").accordion("option","active",false);
         $("#accordion3").accordion("option","active",0);
         menu7Click();
         break;
      case "menu8":
         menu8Click();
         break;
      case "menu6":
         $(".accordion").accordion("option","active",false);
         menu6Click();
         break;
      case "menu9":
         $(".accordion").accordion("option","active",false);
         $("#accordion1").accordion("option","active",1);
         menu9Click();
         break;
      case "menu12":
         menu12Click();
         break;
      case "menu13":
         menu13Click();
         break;
      case "menu14":
         menu14Click();
         break;
      case "menu15":
         $(".accordion").accordion("option","active",false);
         menu15Click();
         break;
      case "menu10":
         $(".accordion").accordion("option","active",false);
         menu10Click();
         break;
      case "menu11":
         $(".accordion").accordion("option","active",false);
         menu11Click();
         break;
   }
}

function animComplete() {
   //    setTimeout(function(){
   //        $( ".accordion" ).accordion( "option", "disabled", false );
   animStoped = true;
   scene._navEnabled = true;
   //    },1500)
}

function reversAll() {
   clearInt();
   $("#Menu2text").css("display","none");
   $('#point14text').css('display','none');
   $("#adhoc_meet_img").css("display","none");
   $("#schedule_meet_div").css("display","none");
   $('#playVideos').css('display','none');
   scene.instanceSet("SR850","visible",true);
   stopVid();
   scene.clearRefine();
}

var imgInterval;


function clearInt() {
   clearInterval(imgInterval);
   // $("#imageContainerimg").attr('src','');
   $("#imageContainerimg").attr('src','images_gl/ring_animation/1.png');
   $("#imageContainerimg").css("display","none");
}

function close_window() {
   close();
}

document.onselectstart = function () {
   return false;
};

var btnDrag = false;

function mouseOverBtnDrag() {
   btnDrag = true;
}

function mouseOutBtnDrag() {
   setTimeout(function () {
      btnDrag = false;
   },100);
}

var updateId = 0;

function onRightClick(event) {
   ////console.log("press right");
   //mdown = true;
   //panNav = true;
   return false; //surpress theright menu 
}
function onWindowFocus() {
   updateEnabled = true;
}

function onWindowBlur() {
   updateEnabled = false;
}

function debounce(func,wait,immediate,ev) {
   var timeout;
   return function () {
      var context = this,args = arguments;
      var later = function () {
         timeout = null;
         if (!immediate) func.apply(context,args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later,wait);
      if (callNow) func.apply(context,args);
   };
};

var rotating = [0,0];
rAccelaration = 0.04;
rDecelaration = -0.3;
rMaxSpeed = 5;
var rSpeed = 0;
var rAcc = rAccelaration;

function frameUpdate() {
   window.requestAnimationFrame(frameUpdate);
   if (scene._refineCount < 64) frameUpdateForScene(scene);
   // if (clickEventActive || autoRotateState) {
   //    $(".menuitems, #autoPlays").css("pointer-events","all");
   // } else if (!clickEventActive) {
   //    $(".menuitems, #autoPlays").css("pointer-events","none");
   // }

   //console.log(scene._nav._navYAng+","+scene._nav._navXAng+","+scene._nav._navPan[0]+","+scene._nav._navPan[1]+","+scene._nav._navDolly);
   //   
   if (yPos < yEnd && mdown != true && yStarted) {
      autoRotateState = true;
      if (yPos > yEnd - 2) yPos = 0;
      //						if(new_R){
      //							autoRotateStop();
      //						}else{
      //                                console.log("sd",numberOfAA);
      if (numberOfAA == 5) {
         //                                console.log("in if ",numberOfAA);
         autoRotateRequest();
         numberOfAA = 1;
      }
      numberOfAA++;
      //						}
   } else yStarted = false;


   if (rotating[0] != 0 || rotating[1] != 0) {
      if (rSpeed < 0) {
         rSpeed = 0;
         rAcc = rAccelaration;
         rotating = [0,0];
      }
      rSpeed = (rSpeed < rMaxSpeed || rAcc < 0) ? rSpeed + rAcc : rSpeed;
      console.log(rSpeed);
      scene._nav.NavRotation([0,0],[rotating[0] * rSpeed,rotating[1] * rSpeed]);
      scene.clearRefine();
   }
}
var numberOfAA = 1;

function frameUpdateForScene(scene) {
   var bgotoPosInTimeUpdate = scene._nav._navgotoPosInTimeActive;
   sceneViewMatrix = scene._nav.NavCreateViewMatrix(scene._initialNavMatrix);
   scene.setViewMatrix(sceneViewMatrix);
   scene.setModelMatrix(scene._nav.NavCreateModelMatrix(scene._initialNavMatrix));
   drawn = scene.draw();
   //     if(autoRotateState){
   ////        console.log("frameUpdate")
   //          var numberOfAA = 4
   //     for(i =0 ; i<numberOfAA; i++){
   //         scene.draw();
   //     }
   //       }
   if (bgotoPosInTimeUpdate)
      scene.clearRefine();
   // if (drawn && AllgeoIntl) hotspotPosAsignment();
}

function getScene(ev) {
   var s = scene;
   if (scene2 != null && ev.currentTarget == canvas2)
      s = scene2;
   return s;
}




/*------------auto rotate functionality------------*/
var yPos = 0;
var yEnd = 300;
var yStarted = false;
var autoRotateState = false;
var yLevel = 0;
var yStep = [1];
var ySpeed = [20];
var myVar;
var autoRotateInterval;

function autoRotate() {
   //    console.log("autorotate")
   if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {

      animStoped = true;

      scene._navEnabled = true;


   } else if (autoplayAnim == true) {
      animStoped = true;
      scene._navEnabled = true;
      autoRotateState = false;
   } else {
      yPos = 0;
      //            console.log('rotate', yStarted);
      if (!yStarted)

         //             autoRotateRequest();
         if (autoRotateState) {
            autoRotateInterval = setInterval(function () {
               //                  console.log('rotate');
               autoRotateRequest();
            },10);
         }



   }

}


var autoRotateInterval;

function autoRotateStop() {
   yPos = yEnd;
   autoRotateState = false;
   yStarted = false;
   clearInterval(autoRotateInterval);
   clearTimeout(autoPlayInt);
   clearTimeout(myVar);
   clearTimeout(startAutorot);

}

var rackView = false;

function autoRotateRequest(ev) {
   var s = getScene(ev);

   yStarted = true;
   yPos += 1;
   var mpos = [0.0,0.0];

   if (rackView == true) {
      var mdelta = [0.85,0.0];
      //   console.log("If85")
   } else {
      var mdelta = [0.08,0.0];
      // console.log("else25")
   }
   if (s._nav.NavRotation(mpos,mdelta)) {
      //                  console.log("calle")
      scene.clearRefine();
   }
}

function autoRotateCall() {
   myVar = setTimeout(function () {
      autoRotateState = true;
      autoRotate();
      divHide();
   },5000);
}

/*end*/




var hotspotPoint = true;
var hotspotOn;
var clockWise = true;
var antiClockWise = false;

function hotspotPosAsignment() {
   InHotspot = true;
   var viewCameraZV = [sceneViewMatrix[8],sceneViewMatrix[9],sceneViewMatrix[10]];

   if ((sceneViewMatrix[12] > -0.4 && sceneViewMatrix[12] < 0.3) && (sceneViewMatrix[14] > -18.5 && sceneViewMatrix[14] < -15.5)) {
      $("#hotspot1,#hotspot10,#hotspot11",window.document).css('visibility','visible');
   } else {
      $("#hotspot1,#hotspot10,#hotspot11,#hotspot2",window.document).css('visibility','hidden');
   }

   var hotspotopacityspeed = 3.0;

   var pos2Dpoint1 = [];
   //    var norm3Dpoint1 = scene.getObjectNormal("hotspot_05");
   var norm3Dpoint1 = scene.getObjectNormal("hotspot_08");
   //    var norm3Dpoint1 = scene.getObjectNormal("Hotspot_Node_0Shape2-0");
   var hotspotopacity1 = infinityrt_dp(norm3Dpoint1,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity1 > 0 && (hotspotOn == true)) hotspotopacity1 = 0;
   if (hotspotopacity1 < 0.0) hotspotopacity1 = 0.0;
   else if (hotspotopacity1 > 1.0) hotspotopacity1 = 1.0;
   if (hotspotopacity1 == 0) $("#hotspot1",window.document).css('visibility','hidden');
   else $("#hotspot1",window.document).css('visibility','visible');
   pos2Dpoint1 = scene.projectPoint(scene.getObjectLocation("hotspot_08",true));
   //    pos2Dpoint1 = scene.projectPoint(scene.getObjectLocation("Hotspot_Node_0Shape2-0", true));


   var pos2Dpoint2 = [];
   var norm3Dpoint2 = scene.getObjectNormal("hotspot_06");
   //    var norm3Dpoint2 = scene.getObjectNormal("Hotspot_Node_0Shape1-0");
   var hotspotopacity2 = infinityrt_dp(norm3Dpoint2,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity2 > 0 && (hotspotOn == true)) hotspotopacity2 = 0;
   if (hotspotopacity2 < 0.0) hotspotopacity2 = 0.0;
   else if (hotspotopacity2 > 1.0) hotspotopacity2 = 1.0;
   if (hotspotopacity2 == 0) $("#hotspot2",window.document).css('visibility','hidden');
   else $("#hotspot2",window.document).css('visibility','visible');
   pos2Dpoint2 = scene.projectPoint(scene.getObjectLocation("hotspot_06",true));
   //    pos2Dpoint2 = scene.projectPoint(scene.getObjectLocation("Hotspot_Node_0Shape1-0", true));

   var pos2Dpoint3 = [];
   var norm3Dpoint3 = scene.getObjectNormal("hotspot_05");
   var hotspotopacity3 = infinityrt_dp(norm3Dpoint3,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity3 > 0 && (hotspotOn == true)) hotspotopacity3 = 0;
   if (hotspotopacity3 < 0.0) hotspotopacity3 = 0.0;
   else if (hotspotopacity3 > 1.0) hotspotopacity3 = 1.0;
   if (hotspotopacity3 == 0) $("#hotspot3",window.document).css('visibility','hidden');
   else $("#hotspot3",window.document).css('visibility','visible');
   pos2Dpoint3 = scene.projectPoint(scene.getObjectLocation("hotspot_05",true));

   var pos2Dpoint4 = [];
   var norm3Dpoint4 = scene.getObjectNormal("hotspot_06");
   var hotspotopacity4 = infinityrt_dp(norm3Dpoint4,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity4 > 0 && (hotspotOn == true)) hotspotopacity4 = 0;
   if (hotspotopacity4 < 0.0) hotspotopacity4 = 0.0;
   else if (hotspotopacity4 > 1.0) hotspotopacity4 = 1.0;
   if (hotspotopacity4 == 0) $("#hotspot4",window.document).css('visibility','hidden');
   else $("#hotspot4",window.document).css('visibility','visible');
   pos2Dpoint4 = scene.projectPoint(scene.getObjectLocation("hotspot_06",true));

   var pos2Dpoint5 = [];
   var norm3Dpoint5 = scene.getObjectNormal("hotspot_07");
   var hotspotopacity5 = infinityrt_dp(norm3Dpoint5,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity5 > 0 && (hotspotOn == true)) hotspotopacity5 = 0;
   if (hotspotopacity5 < 0.0) hotspotopacity5 = 0.0;
   else if (hotspotopacity5 > 1.0) hotspotopacity5 = 1.0;
   if (hotspotopacity5 == 0) $("#hotspot5",window.document).css('visibility','hidden');
   else $("#hotspot5",window.document).css('visibility','visible');
   pos2Dpoint5 = scene.projectPoint(scene.getObjectLocation("hotspot_07",true));

   var pos2Dpoint6 = [];
   var norm3Dpoint6 = scene.getObjectNormal("hotspot_08");
   var hotspotopacity6 = infinityrt_dp(norm3Dpoint6,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity6 > 0 && (hotspotOn == true)) hotspotopacity6 = 0;
   if (hotspotopacity6 < 0.0) hotspotopacity6 = 0.0;
   else if (hotspotopacity6 > 1.0) hotspotopacity6 = 1.0;
   if (hotspotopacity6 == 0) $("#hotspot6",window.document).css('visibility','hidden');
   else $("#hotspot6",window.document).css('visibility','visible');
   pos2Dpoint6 = scene.projectPoint(scene.getObjectLocation("hotspot_08",true));

   var pos2Dpoint7 = [];
   var norm3Dpoint7 = scene.getObjectNormal("hotspot_09");
   var hotspotopacity7 = infinityrt_dp(norm3Dpoint7,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity7 > 0 && (hotspotOn == true)) hotspotopacity7 = 0;
   if (hotspotopacity7 < 0.0) hotspotopacity7 = 0.0;
   else if (hotspotopacity7 > 1.0) hotspotopacity7 = 1.0;
   if (hotspotopacity7 == 0) $("#hotspot7",window.document).css('visibility','hidden');
   else $("#hotspot7",window.document).css('visibility','visible');
   pos2Dpoint7 = scene.projectPoint(scene.getObjectLocation("hotspot_09",true));

   var pos2Dpoint07 = [];
   var norm3Dpoint07 = scene.getObjectNormal("hotspot_09");
   var hotspotopacity07 = infinityrt_dp(norm3Dpoint07,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity07 > 0 && (hotspotOn == true)) hotspotopacity07 = 0;
   if (hotspotopacity07 < 0.0) hotspotopacity07 = 0.0;
   else if (hotspotopacity07 > 1.0) hotspotopacity07 = 1.0;
   if (hotspotopacity07 == 0) $("#hotspot07",window.document).css('visibility','hidden');
   else $("#hotspot07",window.document).css('visibility','visible');
   pos2Dpoint07 = scene.projectPoint(scene.getObjectLocation("hotspot_09",true));

   var pos2Dpoint8 = [];
   var norm3Dpoint8 = scene.getObjectNormal("hotspot_10");
   var hotspotopacity8 = infinityrt_dp(norm3Dpoint8,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity8 > 0 && (hotspotOn == true)) hotspotopacity8 = 0;
   if (hotspotopacity8 < 0.0) hotspotopacity8 = 0.0;
   else if (hotspotopacity8 > 1.0) hotspotopacity8 = 1.0;
   if (hotspotopacity8 == 0) $("#hotspot8",window.document).css('visibility','hidden');
   else $("#hotspot8",window.document).css('visibility','visible');
   pos2Dpoint8 = scene.projectPoint(scene.getObjectLocation("hotspot_10",true));

   var pos2Dpoint9 = [];
   var norm3Dpoint9 = scene.getObjectNormal("hotspot_11");
   var hotspotopacity9 = infinityrt_dp(norm3Dpoint9,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity9 > 0 && (hotspotOn == true)) hotspotopacity9 = 0;
   if (hotspotopacity9 < 0.0) hotspotopacity9 = 0.0;
   else if (hotspotopacity9 > 1.0) hotspotopacity9 = 1.0;
   if (hotspotopacity9 == 0) $("#hotspot9",window.document).css('visibility','hidden');
   else $("#hotspot9",window.document).css('visibility','visible');
   pos2Dpoint9 = scene.projectPoint(scene.getObjectLocation("hotspot_11",true));

   var pos2Dpoint99 = [];
   var norm3Dpoint99 = scene.getObjectNormal("hotspot_11");
   var hotspotopacity99 = infinityrt_dp(norm3Dpoint99,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity99 > 0 && (hotspotOn == true)) hotspotopacity99 = 0;
   if (hotspotopacity99 < 0.0) hotspotopacity99 = 0.0;
   else if (hotspotopacity99 > 1.0) hotspotopacity99 = 1.0;
   if (hotspotopacity99 == 0) $("#hotspot99",window.document).css('visibility','hidden');
   else $("#hotspot99",window.document).css('visibility','visible');
   pos2Dpoint99 = scene.projectPoint(scene.getObjectLocation("hotspot_11",true));


   var pos2Dpoint999 = [];
   var norm3Dpoint999 = scene.getObjectNormal("hotspot_11");
   var hotspotopacity999 = infinityrt_dp(norm3Dpoint999,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity999 > 0 && (hotspotOn == true)) hotspotopacity999 = 0;
   if (hotspotopacity999 < 0.0) hotspotopacity999 = 0.0;
   else if (hotspotopacity999 > 1.0) hotspotopacity999 = 1.0;
   if (hotspotopacity999 == 0) $("#hotspot999",window.document).css('visibility','hidden');
   else $("#hotspot999",window.document).css('visibility','visible');
   pos2Dpoint999 = scene.projectPoint(scene.getObjectLocation("hotspot_11",true));

   var pos2Dpoint10 = [];
   //    var norm3Dpoint10 = scene.getObjectNormal("Hotspot_Node_0Shape3-0");
   var norm3Dpoint10 = scene.getObjectNormal("hotspot_Shape13-0");
   var hotspotopacity10 = infinityrt_dp(norm3Dpoint10,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity10 > 0 && (hotspotOn == true)) hotspotopacity10 = 0;
   if (hotspotopacity10 < 0.0) hotspotopacity10 = 0.0;
   else if (hotspotopacity10 > 1.0) hotspotopacity10 = 1.0;
   if (hotspotopacity10 == 0) $("#hotspot10",window.document).css('visibility','hidden');
   else $("#hotspot10",window.document).css('visibility','visible');
   pos2Dpoint10 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape13-0",true));
   //    pos2Dpoint10 = scene.projectPoint(scene.getObjectLocation("Hotspot_Node_0Shape3-0", true));

   var pos2Dpoint21 = [];
   //    var norm3Dpoint11 = scene.getObjectNormal("Hotspot_Node_0Shape4-0");
   var norm3Dpoint21 = scene.getObjectNormal("hotspot_21");
   var hotspotopacity21 = infinityrt_dp(norm3Dpoint21,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity21 > 0 && (hotspotOn == true)) hotspotopacity11 = 0;
   if (hotspotopacity21 < 0.0) hotspotopacity21 = 0.0;
   else if (hotspotopacity21 > 1.0) hotspotopacity21 = 1.0;
   if (hotspotopacity21 == 0) $("#hotspot21",window.document).css('visibility','hidden');
   else $("#hotspot21",window.document).css('visibility','visible');
   pos2Dpoint21 = scene.projectPoint(scene.getObjectLocation("hotspot_21",true));

   //for new rear view start //
   var pos2Dpoint40 = [];
   var norm3Dpoint40 = scene.getObjectNormal("hotspot_06");
   //    var norm3Dpoint40 = scene.getObjectNormal("Hotspot_Component_0Shape1-0");
   var hotspotopacity40 = infinityrt_dp(norm3Dpoint40,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity40 > 0 && (hotspotOn == true)) hotspotopacity40 = 0;
   if (hotspotopacity40 < 0.0) hotspotopacity40 = 0.0;
   else if (hotspotopacity40 > 1.0) hotspotopacity40 = 1.0;
   if (hotspotopacity40 == 0) $("#hotspot40",window.document).css('visibility','hidden');
   else $("#hotspot40",window.document).css('visibility','visible');
   pos2Dpoint40 = scene.projectPoint(scene.getObjectLocation("hotspot_06",true));
   //    pos2Dpoint40 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape1-0", true));

   var pos2Dpoint41 = [];
   var norm3Dpoint41 = scene.getObjectNormal("hotspot_08");
   //    var norm3Dpoint41 = scene.getObjectNormal("Hotspot_Component_0Shape3-0");
   var hotspotopacity41 = infinityrt_dp(norm3Dpoint41,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity41 > 0 && (hotspotOn == true)) hotspotopacity41 = 0;
   if (hotspotopacity41 < 0.0) hotspotopacity41 = 0.0;
   else if (hotspotopacity41 > 1.0) hotspotopacity41 = 1.0;
   if (hotspotopacity41 == 0) $("#hotspot41",window.document).css('visibility','hidden');
   else $("#hotspot41",window.document).css('visibility','visible');
   pos2Dpoint41 = scene.projectPoint(scene.getObjectLocation("hotspot_08",true));
   //    pos2Dpoint41 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape3-0", true));

   var pos2Dpoint42 = [];
   var norm3Dpoint42 = scene.getObjectNormal("hotspot_Shape15-0");
   //    var norm3Dpoint42 = scene.getObjectNormal("Hotspot_Component_0Shape5-0");
   var hotspotopacity42 = infinityrt_dp(norm3Dpoint42,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity42 > 0 && (hotspotOn == true)) hotspotopacity42 = 0;
   if (hotspotopacity42 < 0.0) hotspotopacity42 = 0.0;
   else if (hotspotopacity42 > 1.0) hotspotopacity42 = 1.0;
   if (hotspotopacity42 == 0) $("#hotspot42",window.document).css('visibility','hidden');
   else $("#hotspot42",window.document).css('visibility','visible');
   pos2Dpoint42 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape15-0",true));
   //    pos2Dpoint42 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape5-0", true));

   var pos2Dpoint43 = [];
   var norm3Dpoint43 = scene.getObjectNormal("hotspot_Shape17-0");
   //    var norm3Dpoint43 = scene.getObjectNormal("Hotspot_Component_0Shape7-0");
   var hotspotopacity43 = infinityrt_dp(norm3Dpoint43,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity43 > 0 && (hotspotOn == true)) hotspotopacity43 = 0;
   if (hotspotopacity43 < 0.0) hotspotopacity43 = 0.0;
   else if (hotspotopacity43 > 1.0) hotspotopacity43 = 1.0;
   if (hotspotopacity43 == 0) $("#hotspot43",window.document).css('visibility','hidden');
   else $("#hotspot43",window.document).css('visibility','visible');
   pos2Dpoint43 = scene.projectPoint(scene.getObjectLocation("hotspot_Shape17-0",true));
   //    pos2Dpoint43 = scene.projectPoint(scene.getObjectLocation("Hotspot_Component_0Shape7-0", true));

   var pos2Dpoint44 = [];
   //    var norm3Dpoint44 = scene.getObjectNormal("Hotspot_Component_0Shape8-0");
   var norm3Dpoint44 = scene.getObjectNormal("hotspot_11");
   var hotspotopacity44 = infinityrt_dp(norm3Dpoint44,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity44 > 0 && (hotspotOn == true)) hotspotopacity44 = 0;
   if (hotspotopacity44 < 0.0) hotspotopacity44 = 0.0;
   else if (hotspotopacity44 > 1.0) hotspotopacity44 = 1.0;
   if (hotspotopacity44 == 0) $("#hotspot44",window.document).css('visibility','hidden');
   else $("#hotspot44",window.document).css('visibility','visible');
   pos2Dpoint44 = scene.projectPoint(scene.getObjectLocation("hotspot_11",true));

   var pos2Dpoint45 = [];
   //    var norm3Dpoint44 = scene.getObjectNormal("Hotspot_Component_0Shape8-0");
   var norm3Dpoint45 = scene.getObjectNormal("hotspot_11");
   var hotspotopacity45 = infinityrt_dp(norm3Dpoint45,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity45 > 0 && (hotspotOn == true)) hotspotopacity45 = 0;
   if (hotspotopacity45 < 0.0) hotspotopacity45 = 0.0;
   else if (hotspotopacity45 > 1.0) hotspotopacity45 = 1.0;
   if (hotspotopacity45 == 0) $("#hotspot45",window.document).css('visibility','hidden');
   else $("#hotspot45",window.document).css('visibility','visible');
   pos2Dpoint45 = scene.projectPoint(scene.getObjectLocation("hotspot_11",true));


   //    Front face Bay hotspots
   var pos2Dpoint51 = [];
   var norm3Dpoint51 = scene.getObjectNormal("Front_Hotspot1");
   var hotspotopacity51 = infinityrt_dp(norm3Dpoint51,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity51 > 0 && (hotspotOn == true)) hotspotopacity51 = 0;
   if (hotspotopacity51 < 0.0) hotspotopacity51 = 0.0;
   else if (hotspotopacity51 > 1.0) hotspotopacity51 = 1.0;
   if (hotspotopacity51 == 0) $("#hotspot51",window.document).css('visibility','hidden');
   else $("#hotspot51",window.document).css('visibility','visible');
   pos2Dpoint51 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot1",true));

   var pos2Dpoint52 = [];
   var norm3Dpoint52 = scene.getObjectNormal("Front_Hotspot2");
   var hotspotopacity52 = infinityrt_dp(norm3Dpoint52,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity52 > 0 && (hotspotOn == true)) hotspotopacity52 = 0;
   if (hotspotopacity52 < 0.0) hotspotopacity52 = 0.0;
   else if (hotspotopacity52 > 1.0) hotspotopacity52 = 1.0;
   if (hotspotopacity52 == 0) $("#hotspot52",window.document).css('visibility','hidden');
   else $("#hotspot52",window.document).css('visibility','visible');
   pos2Dpoint52 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot2",true));

   var pos2Dpoint53 = [];
   var norm3Dpoint53 = scene.getObjectNormal("Front_Hotspot3");
   var hotspotopacity53 = infinityrt_dp(norm3Dpoint53,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity53 > 0 && (hotspotOn == true)) hotspotopacity53 = 0;
   if (hotspotopacity53 < 0.0) hotspotopacity53 = 0.0;
   else if (hotspotopacity53 > 1.0) hotspotopacity53 = 1.0;
   if (hotspotopacity53 == 0) $("#hotspot53",window.document).css('visibility','hidden');
   else $("#hotspot53",window.document).css('visibility','visible');
   pos2Dpoint53 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot3",true));

   var pos2Dpoint54 = [];
   var norm3Dpoint54 = scene.getObjectNormal("Front_Hotspot4");
   var hotspotopacity54 = infinityrt_dp(norm3Dpoint54,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity54 > 0 && (hotspotOn == true)) hotspotopacity54 = 0;
   if (hotspotopacity54 < 0.0) hotspotopacity54 = 0.0;
   else if (hotspotopacity54 > 1.0) hotspotopacity54 = 1.0;
   if (hotspotopacity54 == 0) $("#hotspot54",window.document).css('visibility','hidden');
   else $("#hotspot54",window.document).css('visibility','visible');
   pos2Dpoint54 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot4",true));

   var pos2Dpoint55 = [];
   var norm3Dpoint55 = scene.getObjectNormal("Front_Hotspot5");
   var hotspotopacity55 = infinityrt_dp(norm3Dpoint55,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity55 > 0 && (hotspotOn == true)) hotspotopacity55 = 0;
   if (hotspotopacity55 < 0.0) hotspotopacity55 = 0.0;
   else if (hotspotopacity52 > 1.0) hotspotopacity55 = 1.0;
   if (hotspotopacity55 == 0) $("#hotspot55",window.document).css('visibility','hidden');
   else $("#hotspot55",window.document).css('visibility','visible');
   pos2Dpoint55 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot2",true));

   var pos2Dpoint56 = [];
   var norm3Dpoint56 = scene.getObjectNormal("Front_Hotspot6");
   var hotspotopacity56 = infinityrt_dp(norm3Dpoint56,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity56 > 0 && (hotspotOn == true)) hotspotopacity56 = 0;
   if (hotspotopacity56 < 0.0) hotspotopacity56 = 0.0;
   else if (hotspotopacity56 > 1.0) hotspotopacity56 = 1.0;
   if (hotspotopacity56 == 0) $("#hotspot56",window.document).css('visibility','hidden');
   else $("#hotspot56",window.document).css('visibility','visible');
   pos2Dpoint56 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot6",true));

   var pos2Dpoint57 = [];
   var norm3Dpoint57 = scene.getObjectNormal("Front_Hotspot7");
   var hotspotopacity57 = infinityrt_dp(norm3Dpoint57,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity57 > 0 && (hotspotOn == true)) hotspotopacity57 = 0;
   if (hotspotopacity57 < 0.0) hotspotopacity57 = 0.0;
   else if (hotspotopacity57 > 1.0) hotspotopacity57 = 1.0;
   if (hotspotopacity57 == 0) $("#hotspot57",window.document).css('visibility','hidden');
   else $("#hotspot57",window.document).css('visibility','visible');
   pos2Dpoint57 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot7",true));

   var pos2Dpoint58 = [];
   var norm3Dpoint58 = scene.getObjectNormal("Front_Hotspot8");
   var hotspotopacity58 = infinityrt_dp(norm3Dpoint58,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity58 > 0 && (hotspotOn == true)) hotspotopacity58 = 0;
   if (hotspotopacity58 < 0.0) hotspotopacity58 = 0.0;
   else if (hotspotopacity58 > 1.0) hotspotopacity58 = 1.0;
   if (hotspotopacity58 == 0) $("#hotspot58",window.document).css('visibility','hidden');
   else $("#hotspot58",window.document).css('visibility','visible');
   pos2Dpoint58 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot8",true));

   var pos2Dpoint59 = [];
   var norm3Dpoint59 = scene.getObjectNormal("Front_Hotspot9");
   var hotspotopacity59 = infinityrt_dp(norm3Dpoint59,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity59 > 0 && (hotspotOn == true)) hotspotopacity59 = 0;
   if (hotspotopacity59 < 0.0) hotspotopacity59 = 0.0;
   else if (hotspotopacity59 > 1.0) hotspotopacity59 = 1.0;
   if (hotspotopacity59 == 0) $("#hotspot59",window.document).css('visibility','hidden');
   else $("#hotspot59",window.document).css('visibility','visible');
   pos2Dpoint59 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot9",true));

   var pos2Dpoint60 = [];
   var norm3Dpoint60 = scene.getObjectNormal("Front_Hotspot10");
   var hotspotopacity60 = infinityrt_dp(norm3Dpoint60,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity60 > 0 && (hotspotOn == true)) hotspotopacity60 = 0;
   if (hotspotopacity60 < 0.0) hotspotopacity60 = 0.0;
   else if (hotspotopacity60 > 1.0) hotspotopacity60 = 1.0;
   if (hotspotopacity60 == 0) $("#hotspot60",window.document).css('visibility','hidden');
   else $("#hotspot60",window.document).css('visibility','visible');
   pos2Dpoint60 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot10",true));

   var pos2Dpoint61 = [];
   var norm3Dpoint61 = scene.getObjectNormal("Front_Hotspot11");
   var hotspotopacity61 = infinityrt_dp(norm3Dpoint61,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity61 > 0 && (hotspotOn == true)) hotspotopacity61 = 0;
   if (hotspotopacity61 < 0.0) hotspotopacity61 = 0.0;
   else if (hotspotopacity61 > 1.0) hotspotopacity61 = 1.0;
   if (hotspotopacity61 == 0) $("#hotspot61",window.document).css('visibility','hidden');
   else $("#hotspot61",window.document).css('visibility','visible');
   pos2Dpoint61 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot11",true));

   var pos2Dpoint62 = [];
   var norm3Dpoint62 = scene.getObjectNormal("Front_Hotspot12");
   var hotspotopacity62 = infinityrt_dp(norm3Dpoint62,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity62 > 0 && (hotspotOn == true)) hotspotopacity62 = 0;
   if (hotspotopacity62 < 0.0) hotspotopacity62 = 0.0;
   else if (hotspotopacity62 > 1.0) hotspotopacity62 = 1.0;
   if (hotspotopacity62 == 0) $("#hotspot62",window.document).css('visibility','hidden');
   else $("#hotspot62",window.document).css('visibility','visible');
   pos2Dpoint62 = scene.projectPoint(scene.getObjectLocation("Front_Hotspot12",true));

   var pos2Dpoint63 = [];
   var norm3Dpoint63 = scene.getObjectNormal("Hotspot_12");
   var hotspotopacity63 = infinityrt_dp(norm3Dpoint63,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity63 > 0 && (hotspotOn == true)) hotspotopacity63 = 0;
   if (hotspotopacity63 < 0.0) hotspotopacity63 = 0.0;
   else if (hotspotopacity63 > 1.0) hotspotopacity63 = 1.0;
   if (hotspotopacity63 == 0) $("#hotspot63",window.document).css('visibility','hidden');
   else $("#hotspot63",window.document).css('visibility','visible');
   pos2Dpoint63 = scene.projectPoint(scene.getObjectLocation("Hotspot_12",true));


   var pos2Dpoint64 = [];
   var norm3Dpoint64 = scene.getObjectNormal("Hotspot_13");
   var hotspotopacity64 = infinityrt_dp(norm3Dpoint64,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity64 > 0 && (hotspotOn == true)) hotspotopacity64 = 0;
   if (hotspotopacity64 < 0.0) hotspotopacity64 = 0.0;
   else if (hotspotopacity64 > 1.0) hotspotopacity64 = 1.0;
   if (hotspotopacity64 == 0) $("#hotspot64",window.document).css('visibility','hidden');
   else $("#hotspot64",window.document).css('visibility','visible');
   pos2Dpoint64 = scene.projectPoint(scene.getObjectLocation("Hotspot_13",true));

   var pos2Dpoint65 = [];
   var norm3Dpoint65 = scene.getObjectNormal("Hotspot_14");
   var hotspotopacity65 = infinityrt_dp(norm3Dpoint65,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity65 > 0 && (hotspotOn == true)) hotspotopacity65 = 0;
   if (hotspotopacity65 < 0.0) hotspotopacity65 = 0.0;
   else if (hotspotopacity65 > 1.0) hotspotopacity65 = 1.0;
   if (hotspotopacity65 == 0) $("#hotspot65",window.document).css('visibility','hidden');
   else $("#hotspot65",window.document).css('visibility','visible');
   pos2Dpoint65 = scene.projectPoint(scene.getObjectLocation("Hotspot_14",true));

   var pos2Dpoint66 = [];
   var norm3Dpoint66 = scene.getObjectNormal("Hotspot_15");
   var hotspotopacity66 = infinityrt_dp(norm3Dpoint66,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity66 > 0 && (hotspotOn == true)) hotspotopacity66 = 0;
   if (hotspotopacity66 < 0.0) hotspotopacity66 = 0.0;
   else if (hotspotopacity66 > 1.0) hotspotopacity66 = 1.0;
   if (hotspotopacity66 == 0) $("#hotspot66",window.document).css('visibility','hidden');
   else $("#hotspot66",window.document).css('visibility','visible');
   pos2Dpoint66 = scene.projectPoint(scene.getObjectLocation("Hotspot_15",true));

   var pos2Dpoint67 = [];
   var norm3Dpoint67 = scene.getObjectNormal("Hotspot_16");
   var hotspotopacity67 = infinityrt_dp(norm3Dpoint67,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity67 > 0 && (hotspotOn == true)) hotspotopacity67 = 0;
   if (hotspotopacity67 < 0.0) hotspotopacity67 = 0.0;
   else if (hotspotopacity67 > 1.0) hotspotopacity67 = 1.0;
   if (hotspotopacity67 == 0) $("#hotspot67",window.document).css('visibility','hidden');
   else $("#hotspot67",window.document).css('visibility','visible');
   pos2Dpoint67 = scene.projectPoint(scene.getObjectLocation("Hotspot_16",true));

   var pos2Dpoint68 = [];
   var norm3Dpoint68 = scene.getObjectNormal("Hotspot_17");
   var hotspotopacity68 = infinityrt_dp(norm3Dpoint68,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity68 > 0 && (hotspotOn == true)) hotspotopacity68 = 0;
   if (hotspotopacity68 < 0.0) hotspotopacity68 = 0.0;
   else if (hotspotopacity68 > 1.0) hotspotopacity68 = 1.0;
   if (hotspotopacity68 == 0) $("#hotspot68",window.document).css('visibility','hidden');
   else $("#hotspot68",window.document).css('visibility','visible');
   pos2Dpoint68 = scene.projectPoint(scene.getObjectLocation("Hotspot_17",true));

   var pos2Dpoint69 = [];
   var norm3Dpoint69 = scene.getObjectNormal("Hotspot_18");
   var hotspotopacity69 = infinityrt_dp(norm3Dpoint69,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity69 > 0 && (hotspotOn == true)) hotspotopacity69 = 0;
   if (hotspotopacity69 < 0.0) hotspotopacity69 = 0.0;
   else if (hotspotopacity69 > 1.0) hotspotopacity69 = 1.0;
   if (hotspotopacity69 == 0) $("#hotspot69",window.document).css('visibility','hidden');
   else $("#hotspot69",window.document).css('visibility','visible');
   pos2Dpoint69 = scene.projectPoint(scene.getObjectLocation("Hotspot_18",true));

   var pos2Dpoint70 = [];
   var norm3Dpoint70 = scene.getObjectNormal("Hotspot_18");
   var hotspotopacity70 = infinityrt_dp(norm3Dpoint63,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity70 > 0 && (hotspotOn == true)) hotspotopacity70 = 0;
   if (hotspotopacity70 < 0.0) hotspotopacity70 = 0.0;
   else if (hotspotopacity63 > 1.0) hotspotopacity70 = 1.0;
   if (hotspotopacity70 == 0) $("#hotspot70",window.document).css('visibility','hidden');
   else $("#hotspot70",window.document).css('visibility','visible');
   pos2Dpoint70 = scene.projectPoint(scene.getObjectLocation("Hotspot_18",true));

   var pos2Dpoint71 = [];
   var norm3Dpoint71 = scene.getObjectNormal("Hotspot_18");
   var hotspotopacity71 = infinityrt_dp(norm3Dpoint63,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity71 > 0 && (hotspotOn == true)) hotspotopacity71 = 0;
   if (hotspotopacity71 < 0.0) hotspotopacity71 = 0.0;
   else if (hotspotopacity63 > 1.0) hotspotopacity71 = 1.0;
   if (hotspotopacity71 == 0) $("#hotspot71",window.document).css('visibility','hidden');
   else $("#hotspot71",window.document).css('visibility','visible');
   pos2Dpoint70 = scene.projectPoint(scene.getObjectLocation("Hotspot_18",true));

   //    //for new rear view end //


   var pos2Dpoint46 = [];
   var norm3Dpoint46 = scene.getObjectNormal("hotspot_08");
   var hotspotopacity46 = infinityrt_dp(norm3Dpoint46,viewCameraZV) * hotspotopacityspeed - 2.98;
   if (hotspotopacity46 > 0 && (hotspotOn == true)) hotspotopacity46 = 0;
   if (hotspotopacity46 < 0.0) hotspotopacity46 = 0.0;
   else if (hotspotopacity46 > 1.0) hotspotopacity46 = 1.0;
   if (hotspotopacity46 == 0) $("#hotspot46",window.document).css('visibility','hidden');
   else $("#hotspot46",window.document).css('visibility','visible');
   pos2Dpoint46 = scene.projectPoint(scene.getObjectLocation("hotspot_08",true));

   var leftPosPoint1 = (pos2Dpoint1[0] * 50) + 50;
   var leftPosPoint2 = (pos2Dpoint2[0] * 50) + 50;
   var leftPosPoint3 = (pos2Dpoint3[0] * 50) + 50;
   var leftPosPoint4 = (pos2Dpoint4[0] * 50) + 50;
   var leftPosPoint5 = (pos2Dpoint5[0] * 50) + 50;
   var leftPosPoint6 = (pos2Dpoint6[0] * 50) + 50;
   var leftPosPoint7 = (pos2Dpoint7[0] * 50) + 50;
   var leftPosPoint8 = (pos2Dpoint8[0] * 50) + 50;
   var leftPosPoint9 = (pos2Dpoint9[0] * 50) + 50;
   var leftPosPoint99 = (pos2Dpoint99[0] * 50) + 50;
   var leftPosPoint999 = (pos2Dpoint999[0] * 50) + 50;
   var leftPosPoint10 = (pos2Dpoint10[0] * 50) + 50;

   //   new callouts start 
   var leftPosPoint40 = (pos2Dpoint40[0] * 50) + 50;
   var leftPosPoint41 = (pos2Dpoint41[0] * 50) + 50;
   var leftPosPoint42 = (pos2Dpoint42[0] * 50) + 50;
   var leftPosPoint43 = (pos2Dpoint43[0] * 50) + 50;
   var leftPosPoint44 = (pos2Dpoint44[0] * 50) + 50;
   var leftPosPoint45 = (pos2Dpoint45[0] * 50) + 50;


   var leftPosPoint51 = (pos2Dpoint51[0] * 50) + 50;
   var leftPosPoint52 = (pos2Dpoint52[0] * 50) + 50;
   var leftPosPoint53 = (pos2Dpoint53[0] * 50) + 50;
   var leftPosPoint54 = (pos2Dpoint54[0] * 50) + 50;
   var leftPosPoint55 = (pos2Dpoint55[0] * 50) + 50;
   var leftPosPoint56 = (pos2Dpoint56[0] * 50) + 50;
   var leftPosPoint57 = (pos2Dpoint57[0] * 50) + 50;
   var leftPosPoint58 = (pos2Dpoint58[0] * 50) + 50;
   var leftPosPoint59 = (pos2Dpoint59[0] * 50) + 50;
   var leftPosPoint60 = (pos2Dpoint60[0] * 50) + 50;
   var leftPosPoint61 = (pos2Dpoint61[0] * 50) + 50;
   var leftPosPoint62 = (pos2Dpoint62[0] * 50) + 50;
   var leftPosPoint63 = (pos2Dpoint63[0] * 50) + 50;
   var leftPosPoint64 = (pos2Dpoint64[0] * 50) + 50;
   var leftPosPoint65 = (pos2Dpoint65[0] * 50) + 50;
   var leftPosPoint66 = (pos2Dpoint66[0] * 50) + 50;
   var leftPosPoint67 = (pos2Dpoint67[0] * 50) + 50;
   var leftPosPoint68 = (pos2Dpoint68[0] * 50) + 50;
   var leftPosPoint69 = (pos2Dpoint69[0] * 50) + 50;

   //   new callouts end 

   var leftPosPoint46 = (pos2Dpoint46[0] * 50) + 50;
   var leftPosPoint71 = (pos2Dpoint71[0] * 50) + 50;

   var toptPosPoint1 = -((pos2Dpoint1[1] * 50) - 50);
   var toptPosPoint2 = -((pos2Dpoint2[1] * 50) - 50);
   var toptPosPoint3 = -((pos2Dpoint3[1] * 50) - 50);
   var toptPosPoint4 = -((pos2Dpoint4[1] * 50) - 50);
   var toptPosPoint5 = -((pos2Dpoint5[1] * 50) - 50);
   var toptPosPoint6 = -((pos2Dpoint6[1] * 50) - 50);
   var toptPosPoint7 = -((pos2Dpoint7[1] * 50) - 50);
   var toptPosPoint8 = -((pos2Dpoint8[1] * 50) - 50);
   var toptPosPoint9 = -((pos2Dpoint9[1] * 50) - 50);
   var toptPosPoint99 = -((pos2Dpoint99[1] * 50) - 50);
   var toptPosPoint999 = -((pos2Dpoint999[1] * 50) - 50);
   var toptPosPoint10 = -((pos2Dpoint10[1] * 50) - 50);

   //    Callouts Start
   var toptPosPoint40 = -((pos2Dpoint40[1] * 50) - 50);
   var toptPosPoint41 = -((pos2Dpoint41[1] * 50) - 50);
   var toptPosPoint42 = -((pos2Dpoint42[1] * 50) - 50);
   var toptPosPoint43 = -((pos2Dpoint43[1] * 50) - 50);


   var toptPosPoint51 = -((pos2Dpoint51[1] * 50) - 50);
   var toptPosPoint52 = -((pos2Dpoint52[1] * 50) - 50);
   var toptPosPoint53 = -((pos2Dpoint53[1] * 50) - 50);
   var toptPosPoint54 = -((pos2Dpoint54[1] * 50) - 50);
   var toptPosPoint55 = -((pos2Dpoint55[1] * 50) - 50);
   var toptPosPoint56 = -((pos2Dpoint56[1] * 50) - 50);
   var toptPosPoint57 = -((pos2Dpoint57[1] * 50) - 50);
   var toptPosPoint58 = -((pos2Dpoint58[1] * 50) - 50);
   var toptPosPoint59 = -((pos2Dpoint59[1] * 50) - 50);
   var toptPosPoint60 = -((pos2Dpoint60[1] * 50) - 50);
   var toptPosPoint61 = -((pos2Dpoint61[1] * 50) - 50);
   var toptPosPoint62 = -((pos2Dpoint62[1] * 50) - 50);
   var toptPosPoint63 = -((pos2Dpoint63[1] * 50) - 50);
   var toptPosPoint64 = -((pos2Dpoint64[1] * 50) - 50);
   var toptPosPoint65 = -((pos2Dpoint65[1] * 50) - 50);
   var toptPosPoint66 = -((pos2Dpoint66[1] * 50) - 50);
   var toptPosPoint67 = -((pos2Dpoint67[1] * 50) - 50);
   var toptPosPoint68 = -((pos2Dpoint68[1] * 50) - 50);
   var toptPosPoint69 = -((pos2Dpoint69[1] * 50) - 50);

   //    Callouts end

   var toptPosPoint46 = -((pos2Dpoint46[1] * 50) - 50);
   var toptPosPoint71 = -((pos2Dpoint71[1] * 50) - 50);

   $("#hotspot1").css('left',leftPosPoint1 + '%').css('top',toptPosPoint1 + '%');
   $("#hotspot2").css('left',leftPosPoint2 + '%').css('top',toptPosPoint2 + '%');
   $("#hotspot3").css('left',leftPosPoint3 + '%').css('top',toptPosPoint3 + '%');
   $("#hotspot4").css('left',leftPosPoint4 + '%').css('top',toptPosPoint4 + '%');
   $("#hotspot5").css('left',leftPosPoint5 + '%').css('top',toptPosPoint5 + '%');
   $("#hotspot6").css('left',leftPosPoint6 + '%').css('top',toptPosPoint6 + '%');
   $("#hotspot7").css('left',leftPosPoint7 + '%').css('top',toptPosPoint7 + '%');
   $("#hotspot07").css('left',leftPosPoint07 + '%').css('top',toptPosPoint07 + '%');
   $("#hotspot8").css('left',leftPosPoint8 + '%').css('top',toptPosPoint8 + '%');
   $("#hotspot9").css('left',leftPosPoint9 + '%').css('top',toptPosPoint9 + '%');
   $("#hotspot99").css('left',leftPosPoint99 + '%').css('top',toptPosPoint99 + '%');
   $("#hotspot999").css('left',leftPosPoint999 + '%').css('top',toptPosPoint999 + '%');
   $("#hotspot10").css('left',leftPosPoint10 + '%').css('top',toptPosPoint10 + '%');


   //    Callouts Start
   $("#hotspot40").css('left',leftPosPoint40 + '%').css('top',toptPosPoint40 + '%');
   $("#hotspot41").css('left',leftPosPoint41 + '%').css('top',toptPosPoint41 + '%');
   $("#hotspot42").css('left',leftPosPoint42 + '%').css('top',toptPosPoint42 + '%');
   $("#hotspot43").css('left',leftPosPoint43 + '%').css('top',toptPosPoint43 + '%');


   $("#hotspot51").css('left',leftPosPoint51 + '%').css('top',toptPosPoint51 + '%');
   $("#hotspot52").css('left',leftPosPoint52 + '%').css('top',toptPosPoint52 + '%');
   $("#hotspot53").css('left',leftPosPoint53 + '%').css('top',toptPosPoint53 + '%');
   $("#hotspot54").css('left',leftPosPoint54 + '%').css('top',toptPosPoint54 + '%');
   $("#hotspot55").css('left',leftPosPoint55 + '%').css('top',toptPosPoint55 + '%');
   $("#hotspot56").css('left',leftPosPoint56 + '%').css('top',toptPosPoint56 + '%');
   $("#hotspot57").css('left',leftPosPoint57 + '%').css('top',toptPosPoint57 + '%');
   $("#hotspot58").css('left',leftPosPoint58 + '%').css('top',toptPosPoint58 + '%');
   $("#hotspot59").css('left',leftPosPoint59 + '%').css('top',toptPosPoint59 + '%');
   $("#hotspot60").css('left',leftPosPoint60 + '%').css('top',toptPosPoint60 + '%');
   $("#hotspot61").css('left',leftPosPoint61 + '%').css('top',toptPosPoint61 + '%');
   $("#hotspot62").css('left',leftPosPoint62 + '%').css('top',toptPosPoint62 + '%');
   $("#hotspot63").css('left',leftPosPoint63 + '%').css('top',toptPosPoint63 + '%');
   $("#hotspot64").css('left',leftPosPoint64 + '%').css('top',toptPosPoint64 + '%');
   $("#hotspot65").css('left',leftPosPoint65 + '%').css('top',toptPosPoint65 + '%');
   $("#hotspot66").css('left',leftPosPoint66 + '%').css('top',toptPosPoint66 + '%');
   $("#hotspot67").css('left',leftPosPoint67 + '%').css('top',toptPosPoint67 + '%');
   $("#hotspot68").css('left',leftPosPoint68 + '%').css('top',toptPosPoint68 + '%');
   $("#hotspot69").css('left',leftPosPoint69 + '%').css('top',toptPosPoint69 + '%');
   $("#hotspot70").css('left',leftPosPoint69 + '%').css('top',toptPosPoint70 + '%');

   //    Callouts End 


   $("#hotspot46").css('left',leftPosPoint46 + '%').css('top',toptPosPoint46 + '%');
   $("#hotspot71").css('left',leftPosPoint71 + '%').css('top',toptPosPoint71 + '%');

   if (Math.floor(sceneViewMatrix[5]) == 0) {
      clockWise = false;
   } else if (Math.floor(sceneViewMatrix[5]) == -1) {
      clockWise = true;
   }
}

var mpos = [0,0];
var mdown = false;
var panNav = false;
var prevAnimation = null;
function mouseDown(ev) {
   if (!animStoped) return;
   console.log("mouse fun call");
   $("#onloadCopy").css("opacity","0");
   // $("#rightAnim").animate({
   //    right: '-235px'
   // },"slow");
   // rightAnimToggle = true;
   mouseDownHide();
   hideCallouts();
   autoRotateStop();
   setTimeout(Autoplayfive,5000);
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   clearTimeout(autoPlayInt)
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
   for (var i = 0; i < timeoutsnew.length; i++) {
      clearTimeout(timeoutsnew[i]);
   }
   timeouts = [];
   timeoutsnew = [];
   //for (var j = 1; j <= 19; j++) { if (j == 3 || j == 6 || j == 7 || j == 8 || j == 10) { } else { translateOut(j); } }

   if (autoplayAnim) autoPauseAllAnimations();
   var s = getScene(ev);
   if (ev.which == 3) {
      panNav = true;
   }
   var mouseDownPos = [ev.clientX - canvas.offsetLeft,ev.clientY - canvas.offsetTop];
   if (!s.onClick(mouseDownPos,ev.button)) {
      mdown = true;
      mpos = mouseDownPos;
   }
   if (waterManifold) {
      
      waterManifold = false;
   }
   if (rackRotation == true) {
      scene._nav._navRotationSpeed = 0.0025;
   }
}

function mouseUp(ev) {
   mdown = false;
   if (ev.which == 3 || panNav) panNav = false;
   handOpen();
}

function mouseOut(ev) {
   mdown = false;
   if (ev.which == 3 || panNav) panNav = false;
   handOpen();
}

function mouseMove(ev) {
   if (!mdown || !animStoped) return;
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   timeouts = [];
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   var s = getScene(ev);
   var mousePos = [ev.clientX - canvas.offsetLeft,ev.clientY - canvas.offsetTop];
   var mdelta = [(mpos[0] - mousePos[0]),(mpos[1] - mousePos[1])];
   mpos = [mousePos[0],mousePos[1]];
   //pan nav is initialized and set in ui\_ui.js for now.
   if (!panNav) {
      if (s._nav.NavRotation(mpos,mdelta)) s.clearRefine();
   } else {
      var mdelta2 = [mdelta[0] * 3,mdelta[1] * 3];
      if (s._nav.NavPan(mdelta2)) s.clearRefine();
   }
}

function mouseWheel(ev) {
   if (!animStoped) return;
   // $("#rightAnim").animate({
   //    right: '-235px'
   // },"slow");
   // rightAnimToggle = true;
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   setTimeout(Autoplayfive,5000);
   timeouts = [];
   clearTimeout(autoPlayInt);
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   autoRotateStop();
   hideCallouts();
   clearTimeout(startAutorot);

   // for (var j = 1; j <= 19; j++) {
   //    if (j == 8 || j == 13 || j == 10 || j == 5) { }
   //    else { translateOut(j); }
   // }
   divHide();
   if (autoplayAnim) autoPauseAllAnimations();
   //     reversAll();
   var s = getScene(ev);
   var delta = ev.wheelDelta ? ev.wheelDelta : (-ev.detail * 10.0);
   //var deltaScene = (delta*0.05)*(scene.sceneRadius*0.01);
   var deltaScene = delta * 0.06;
   if (s._nav.NavChangeDolly(deltaScene))
      s.clearRefine();
}


function updateZoomBarBg(newval) {
   var scale = -(navMinDolly - navMaxDolly);
   var val = -newval + navMaxDolly;
   $("#zoom_slider_bg").css("height",(val / scale) * 100 + "%");
}


function updateZoomBar(newval) {
   var scale = -(navMinDolly - navMaxDolly);
   var val = -newval;
   $(".ui-slider-handle").css("bottom",(val / scale) * 100 + "%");
}

var animStoped = true;
var dragCursor;
var curBrowser = BrowserDetect.browser;
// IE doesn't support co-ordinates
var cursCoords = (curBrowser == "Explorer") ? "" : " 4 4";

function initDragCursor() {
   handOpen();
   $('#sliderBG').mousedown(function () {
      handClosed();
   });
   $('.ui-slider-handle').mousedown(function () {
      handClosed();
   });
   $('body').mouseup(function () {
      handOpen();
   });
   $('body').mouseup(function () {
      handOpen();
   });
}

function handClosed() {
   dragCursor = (curBrowser == "Firefox") ? "-moz-grabbing" : "url(images_gl/closedhand.cur)" + cursCoords + ", move";
   // Opera doesn't support url cursors and doesn't fall back well...
   if (curBrowser == "Opera") dragCursor = "move";
   $('.ui-slider-handle').css("cursor",dragCursor);
   $('#sliderBG').css("cursor",dragCursor);
   $('#dummy-canvas').css("cursor",dragCursor);
}

function handOpen() {
   dragCursor = (curBrowser == "Firefox") ? "-moz-grab" : "url(images_gl/openhand.cur)" + cursCoords + ", move";
   $('.ui-slider-handle').css("cursor",dragCursor);
   $('#sliderBG').css("cursor",dragCursor);
   $('#dummy-canvas').css("cursor",dragCursor);
}

var mouseIsDown = false;
var loopCtr = 0;
var touch = new Vector3();
var touches = [new Vector3(),new Vector3(),new Vector3()];
var prevTouches = [new Vector3(),new Vector3(),new Vector3()];
var prevDistance = null;
var startAutorot;
function touchStart(event) {
   if (!animStoped) return;
   mdown = true;
   console.log("touch fun call");
   autoPauseAllAnimations();
   setTimeout(Autoplayfive,5000);
   autoRotateStop();
   for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
   }
   timeouts = [];
   for (var i = 0; i < timeoutsnew.length; i++) {
      clearTimeout(timeoutsnew[i]);
   }

   timeoutsnew = [];
   mouseDownHide();
   clearTimeout(autoPlayInt)
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
  // for (var j = 1; j <= 19; j++) { if (j == 3 || j == 6 || j == 7 || j == 8) { } else { translateOut(j); } }
   switch (event.touches.length) {
      case 1:
         touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
         touches[1].set(event.touches[0].pageX,event.touches[0].pageY,0);
         break;
      case 2:
     //    for (var j = 1; j <= 19; j++) { translateOut(j); }
         touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
         touches[1].set(event.touches[1].pageX,event.touches[1].pageY,0);
         prevDistance = touches[0].distanceTo(touches[1]);
         break;
   }
   prevTouches[0].copy(touches[0]);
   prevTouches[1].copy(touches[1]);
}

var doubleTouch = false;

function touchMove(event) {
   if (!animStoped || !mdown) return;
   autoPauseAllAnimations();
   clearInterval(autoRotateInterval);
   clearTimeout(myVar);
   clearTimeout(startAutorot);
   var s = getScene(event);
   event.preventDefault();
   event.stopPropagation();
   var getClosest = function (touch,touches) {
      var closest = touches[0];
      for (var i in touches) {
         if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) closest = touches[i];
      }
      return closest;
   }
   switch (event.touches.length) {
      case 1:
         if (doubleTouch == false) {
            clearInterval(autoRotateInterval);
            clearTimeout(myVar);
            touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
            touches[1].set(event.touches[0].pageX,event.touches[0].pageY,0);
            if (s._nav.NavRotation([touches[0].x,touches[0].y],[(prevTouches[0].x - touches[0].x) * 1.5,(prevTouches[0].y - touches[0].y) * 1.5])) s.clearRefine();
            
         }
         break;
      case 2:
        
         doubleTouch = true;
         //alert("double");
         clearInterval(autoRotateInterval);
         clearTimeout(myVar);
         touches[0].set(event.touches[0].pageX,event.touches[0].pageY,0);
         touches[1].set(event.touches[1].pageX,event.touches[1].pageY,0);
         distance = touches[0].distanceTo(touches[1]);
         var deltaScene = -(prevDistance - distance) * 3;
         if (s._nav.NavChangeDolly(deltaScene)) {
            s.clearRefine();
         }
         //scope.zoom( new Vector3( 0, 0, prevDistance - distance ) );
         prevDistance = distance;
         var offset0 = touches[0].clone().sub(getClosest(touches[0],prevTouches));
         var offset1 = touches[1].clone().sub(getClosest(touches[1],prevTouches));
         offset0.x = -offset0.x;
         offset1.x = -offset1.x;
         var mdelta2 = [offset1.x * 10,-offset1.y * 10];

         if (s._nav.NavPan(mdelta2)) s.clearRefine();
         //scope.pan( offset0.add( offset1 ).multiplyScalar( 0.5 ) );
         break;
   }
   prevTouches[0].copy(touches[0]);
   prevTouches[1].copy(touches[1]);

}

function touchEndCan(event) {
   mdown = false;
   setTimeout(function () {
      doubleTouch = false;
   },100);
}



function parseXml() {
   //console.log("fn call in ");
   $.ajax({
      url: 'text.xml', // name of file you want to parse
      dataType: "xml", // type of file you are trying to read
      success: function parse(document) {
         $(document).find("loader").each(function () {
            var subheading = $(this).find('subheading').text();
            $('.subheading').append(subheading);
            var greyLeftTop = $(this).find('greyLeftTop').text();
            $('.grey-left-top').append(greyLeftTop);
            var greyLeftBottom = $(this).find('greyLeftBottom').text();
            $('.grey-left-bottom').prepend(greyLeftBottom);
            var greyRightTop = $(this).find('greyRightTop').text();
            $('.grey-right-top').append(greyRightTop);
            var greyRightBottom = $(this).find('greyRightBottom').text();
            $('.grey-right-bottom').append(greyRightBottom);
            var loaderOpen = $(this).find('loaderOpen').text();
            $('.loader-open').append(loaderOpen);
            var loaderZoom = $(this).find('loaderZoom').text();
            $('.loader-zoom').append(loaderZoom);
            var loaderRotate = $(this).find('loaderRotate').text();
            $('.loader-rotate').append(loaderRotate);
            var loaderMove = $(this).find('loaderMove').text();
            $('.loader-move').append(loaderMove);
            var leftMouse = $(this).find('leftMouse').text();
            $('.left-mouse').prepend(leftMouse);
            var rotateMouse = $(this).find('rotateMouse').text();
            $('.rotate-mouse').append(rotateMouse);
            var scrollMouse = $(this).find('scrollMouse').text();
            $('.scroll-mouse').prepend(scrollMouse);
            var zoomMouse = $(this).find('zoomMouse').text();
            $('.zoom').append(zoomMouse);
            var bothMouse = $(this).find('bothMouse').text();
            $('.both-mouse').prepend(bothMouse);
            var pan = $(this).find('pan').text();
            $('.pan-mouse').append(pan);
         });


         $(document).find("onloadCopy").each(function () {
            var point1_1 = $(this).find('point1text1').text();
            $('#onloadCopy p:nth-child(1)').append(point1_1);
            var point1_2 = $(this).find('point1text2').text();
            $('#onloadCopy p:nth-child(3)').append(point1_2);
         });

         $(document).find("buttons").each(function () {
            var backText = $(this).find('backText').text();
            $('#backText').append(backText);
            var zoomText = $(this).find('zoomText').text();
            $('#zoomText').append(zoomText);
            var roatateText = $(this).find('roatateText').text();
            $('#roatateText').append(roatateText);
            var moveText = $(this).find('moveText').text();
            $('#moveText').append(moveText);
            btnOpen = $(this).find('divOpen').text();
            $('#openCloseDiv').html(btnOpen);
            btnClose = $(this).find('divClose').text();
            //$('#openCloseDiv').append(btnClose);
         });
         $(document).find("pointtext1").each(function () {
            var point1_1 = $(this).find('point1text1').text();
            $('#pointtext1 #Cp_text_01').append(point1_1);
            var point1_2 = $(this).find('point1text2').text();
            $('#pointtext1 #Cp_text_02').append(point1_2);
            var point1_3 = $(this).find('point1text3').text();
            $('#pointtext1 #Cp_text_03').append(point1_3);
            var point1_4 = $(this).find('point1text4').text();
            $('#pointtext1 #Cp_text_04').append(point1_4);
            var point1_5 = $(this).find('point1text5').text();
            $('#pointtext1 #Cp_text_05').append(point1_5);
            var point1_6 = $(this).find('point1text6').text();
            $('#pointtext1 #Cp_text_06').append(point1_6);
            var point1_7 = $(this).find('point1text7').text();
            $('#pointtext1 #Cp_text_07').append(point1_7);
            var point1_8 = $(this).find('point1text8').text();
            $('#pointtext1 #Cp_text_08').append(point1_8);
            var point1_9 = $(this).find('point1text9').text();
            $('#pointtext1 #Cp_text_09').append(point1_9);
            var point1_10 = $(this).find('point1text10').text();
            $('#pointtext1 #Cp_text_10').append(point1_10);
            var point1_11 = $(this).find('point1text11').text();
            $('#pointtext1 #Cp_text_11').append(point1_11);
            var point1_12 = $(this).find('point1text12').text();
            $('#pointtext1 #Cp_text_12').append(point1_12);

            var point1_13 = $(this).find('point1text13').text();
            $('#pointtext1 .Cp_textul li:nth-child(1)').html(point1_13);

            var point1_14 = $(this).find('point1text14').text();
            $('#pointtext1 .Cp_textul li:nth-child(2)').html(point1_14);

            var point1_15 = $(this).find('point1text15').text();
            $('#pointtext1 .Cp_textul li:nth-child(3)').html(point1_15);

            var point1_16 = $(this).find('point1text16').text();
            $('#pointtext1 .Cp_textul li:nth-child(4)').html(point1_16);


         });

         $(document).find("point3headingText").each(function () {
            var point3_1 = $(this).find('headingText').text();
            $('#point3text .point3headingText').append(point3_1);
         });

         $(document).find("point4text").each(function () {
            var point4_0 = $(this).find('point4heading').text();
            $('.point4headingText').append(point4_0);

            var point4_1 = $(this).find('point4text1').text();
            $('#point4text #hot3').append(point4_1);

            var point4_2 = $(this).find('point4text2').text();
            $('#point4text #hot4').append(point4_2);

            var point4_3 = $(this).find('point4text3').text();
            $('#point4text #hot5').append(point4_3);

            var point4_4 = $(this).find('point4text4').text();
            $('#point4text #hot6').append(point4_4);

            var point4_5 = $(this).find('point4text5').text();
            $('#point4text #hot7').append(point4_5);

            var point4_6 = $(this).find('point4text7').text();
            $('#point4text #hot8').append(point4_6);

            var point4_7 = $(this).find('point4text6').text();
            $('#point4text #hot9').append(point4_7);
            var point4_70 = $(this).find('point4text10').text();
            $('#point4text #hot99').append(point4_70);
            var point4_700 = $(this).find('point4text11').text();
            $('#point4text #hot999').append(point4_700);

            var point4_9 = $(this).find('point4text9').text();
            $('#point4text #hot07').append(point4_9);


            var point4_5 = $(this).find('point4text5').text();
            $('#point4text .point4text1').append(point4_5);


         });

         $(document).find("point5text").each(function () {
            var point5_11 = $(this).find('point5heading').text();
            $('.point5headingText').append(point5_11);

            var point5_1 = $(this).find('point5text1').text();
            $('#hot40').html(point5_1);

            var point5_2 = $(this).find('point5text2').text();
            $('#hot41').html(point5_2);

            var point5_3 = $(this).find('point5text3').text();
            $('#hot42').html(point5_3);

            var point5_4 = $(this).find('point5text4').text();
            $('#hot43').html(point5_4);

            var point5_5 = $(this).find('point5text5').text();
            $('#hot44').html(point5_5);

            var point5_6 = $(this).find('point5text6').text();
            $('#hot45').html(point5_6);

            var point5_7 = $(this).find('point5text7').text();
            $('#hot46').html(point5_7);
         });


         $(document).find("pointtext61").each(function () {
            var point6_13 = $(this).find('headingText').text();
            $('.point6headingText').append(point6_13);
         });

         $(document).find("point6text").each(function () {
            var point6_11 = $(this).find('point6heading').text();
            $('.point6headingText').append(point6_11);

            var point6_2 = $(this).find('point6text2').text();
            $('#hot12').html(point6_2);

            var point6_3 = $(this).find('point6text3').text();
            $('#hot13').html(point6_3);

            var point6_4 = $(this).find('point6text4').text();
            $('#hot14').html(point6_4);

            var point6_5 = $(this).find('point6text5').text();
            $('#hot15').html(point6_5);

            var point6_6 = $(this).find('point6text6').text();
            $('#hot16').html(point6_6);

            var point6_7 = $(this).find('point6text7').text();
            $('#hot17').html(point6_7);

            var point6_8 = $(this).find('point6text8').text();
            $('#hot18').html(point6_8);

            var point6_9 = $(this).find('point6text9').text();
            $('#hot19').html(point6_9);

            var point6_10 = $(this).find('point6text10').text();
            $('#hot20').html(point6_10);

            var point6_11 = $(this).find('point6text11').text();
            $('#hot21').html(point6_11);


         });


         $(document).find("point7text").each(function () {
            var point7_1 = $(this).find('point7headingText').text();
            $('.point7headingText').append(point7_1);
            var point7_2 = $(this).find('point7text1').text();
            $('#point7text .point7text1').append(point7_2);
            var point7_3 = $(this).find('point7text2').text();
            $('#hot23').append(point7_3);
            var point7_4 = $(this).find('point7text3').text();
            $('#hot24').append(point7_4);
            var point7_5 = $(this).find('point7text4').text();
            $('#hot25').append(point7_5);
            var point7_6 = $(this).find('point7text5').text();
            $('#hot26').append(point7_6);
            var point7_7 = $(this).find('point7text6').text();
            $('#hot27').append(point7_7);
            var point7_8 = $(this).find('point7text7').text();
            $('#hot28').append(point7_8);
            var point7_9 = $(this).find('point7text8').text();
            $('#hot29').append(point7_9);
            //                var point7_10 = $(this).find('point7text9').text();
            //                $('#hot9').append(point7_10);

            var point7_12 = $(this).find('point7text11').text();
            $('#hot22').append(point7_12);

            var point7_13 = $(this).find('point7text13').text();
            $('#hot50').append(point7_13);
            var point7_14 = $(this).find('point7text14').text();
            $('#hot50_1').append(point7_14);
         });

         $(document).find("point8text").each(function () {
            var point8_1 = $(this).find('point8headingText').text();
            $('.point8headingText').append(point8_1);
            var point8_2 = $(this).find('point8text1').text();
            $('#point8text .point8text1').append(point8_2);
            var point8_3 = $(this).find('point8text2').text();
            $('#point8text .point8text2').append(point8_3);
            var point8_4 = $(this).find('point8text3').text();
            $('#point8text .point8text3').append(point8_4);
            var point8_5 = $(this).find('point8text4').text();
            $('#point8text .point8text4').append(point8_5);
            var point8_6 = $(this).find('point8text5').text();
            $('#hot33').append(point8_6);
            var point8_7 = $(this).find('point8text6').text();
            $('#hot34').append(point8_7);
            var point8_8 = $(this).find('point8text7').text();
            $('#hot35').append(point8_8);
         });


         $(document).find("point9text").each(function () {
            var point9_1 = $(this).find('point9headingText').text();
            $('.point9headingText').append(point9_1);
            var point9_2 = $(this).find('point9text1').text();
            $('#point9text1').append(point9_2);
            var point9_3 = $(this).find('point9text2').text();
            $('#hot51').append(point9_3);
            var point9_4 = $(this).find('point9text3').text();
            $('#hot52').append(point9_4);
            var point9_5 = $(this).find('point9text4').text();
            $('#hot53').append(point9_5);
            var point9_6 = $(this).find('point9text5').text();
            $('#hot54').append(point9_6);
            var point9_7 = $(this).find('point9text6').text();
            $('#hot55').append(point9_7);
            var point9_8 = $(this).find('point9text7').text();
            $('#hot56').append(point9_8);
            var point9_9 = $(this).find('point9text8').text();
            $('#hot57').append(point9_9);
            var point9_10 = $(this).find('point9text9').text();
            $('#hot58').append(point9_10);
            var point9_11 = $(this).find('point9text10').text();
            $('#hot59').append(point9_11);
            var point9_12 = $(this).find('point9text11').text();
            $('#hot60').append(point9_12);
            var point9_13 = $(this).find('point9text12').text();
            $('#hot61').append(point9_13);
            var point9_14 = $(this).find('point9text13').text();
            $('#hot62').append(point9_14);
         });


         // $(document).find("point10text").each(function () {
         //    var point10_1 = $(this).find('headingText').text();
         //    $('#point10text p:nth-child(1)').append(point10_1);
         //    var point10_2 = $(this).find('point10text1').text();
         //    $('#point10text p:nth-child(2)').append(point10_2);
         //    var point10_3 = $(this).find('point10text2').text();
         //    $('#point10text p:nth-child(3)').append(point10_3);
         //    var point10_4 = $(this).find('point10text3').text();
         //    $('#point10text p:nth-child(4)').append(point10_4);
         //    var point10_5 = $(this).find('point10text4').text();
         //    $('#point10text p:nth-child(5)').append(point10_5);
         //    var point10_6 = $(this).find('point10text5').text();
         //    $('#point10text p:nth-child(6)').append(point10_6);

         //    var point10_7 = $(this).find('point10text6').text();
         //    $('#point10text ul li:nth-child(1)').append(point10_7);
         //    var point10_8 = $(this).find('point10text7').text();
         //    $('#point10text ul li:nth-child(2)').append(point10_8);
         //    var point10_9 = $(this).find('point10text8').text();
         //    $('#point10text ul li:nth-child(3)').append(point10_9);
         //    var point10_10 = $(this).find('point10text9').text();
         //    $('#point10text ul li:nth-child(4)').append(point10_10);
         //    var point10_11 = $(this).find('point10text10').text();
         //    $('#point10text ul li:nth-child(5)').append(point10_11);
         // });

         $(document).find("point10text").each(function () {

            var point10_1 = $(this).find('point10text1').text();
            $('#point10text .point10text1').append(point10_1);

            var point10_2 = $(this).find('point10text7').text();
            $('#point10text .point10text7').append(point10_2);


         });


         $(document).find("point11text").each(function () {

            var point11_1 = $(this).find('point11text1').text();
            $('#point11text1').append(point11_1);
            var point11_2 = $(this).find('point11text2').text();
            $('#point11text2').append(point11_2);
            var point11_3 = $(this).find('point11text3').text();
            $('#point11text3').append(point11_3);
            var point11_4 = $(this).find('point11text4').text();
            $('#point11text4').append(point11_4);
            var point11_5 = $(this).find('point11text2').text();
            $('#point11text5').append(point11_5);
            var point11_6 = $(this).find('point11text6').text();
            $('#point11text6').append(point11_6);
            var point11_7 = $(this).find('point11text7').text();
            $('#point11text7').append(point11_7);
            //              var point11_8 = $(this).find('point11text4').text();
            //              $('#point11text8').append(point11_8);
            //              var point11_9 = $(this).find('point11text2').text();
            //              $('#point11text9').append(point11_9);
            var point11_10 = $(this).find('point11text3').text();
            $('#point11text10').append(point11_10);
            var point11_11 = $(this).find('point11text11').text();
            $('#point11text11').append(point11_11);
            var point11_12 = $(this).find('point11text7').text();
            $('#point11text12').append(point11_12);
            //              var point11_13 = $(this).find('point11text2').text();
            //              $('#point11text13').append(point11_13);
            //              var point11_14 = $(this).find('point11text3').text();
            //              $('#point11text14').append(point11_14);
            var point11_15 = $(this).find('point11text4').text();
            $('#point11text15').append(point11_15);

            var point11_li1_1 = $(this).find('point11_li1_1').text();
            $('#point11text6 ul li:nth-child(1)').append(point11_li1_1);
            var point11_li1_2 = $(this).find('point11_li1_2').text();
            $('#point11text6 ul li:nth-child(2)').append(point11_li1_2);
            var point11_li1_3 = $(this).find('point11_li1_3').text();
            $('#point11text6 ul li:nth-child(3)').append(point11_li1_3);
            var point11_li1_4 = $(this).find('point11_li1_4').text();
            $('#point11text6 ul li:nth-child(4)').append(point11_li1_4);

            var point11_li2_1 = $(this).find('point11_li2_1').text();
            $('#point11text11 ul li:nth-child(1)').append(point11_li2_1);
            var point11_li2_2 = $(this).find('point11_li2_2').text();
            $('#point11text11 ul li:nth-child(2)').append(point11_li2_2);
            var point11_li2_3 = $(this).find('point11_li2_3').text();
            $('#point11text11 ul li:nth-child(3)').append(point11_li2_3);
            var point11_li2_4 = $(this).find('point11_li2_4').text();
            $('#point11text11 ul li:nth-child(4)').append(point11_li2_4);

            var point11_li3_1 = $(this).find('point11_li3_1').text();
            $('#point11text15 ul li:nth-child(1)').append(point11_li3_1);
            var point11_li3_2 = $(this).find('point11_li3_2').text();
            $('#point11text15 ul li:nth-child(2)').append(point11_li3_2);
            var point11_li3_3 = $(this).find('point11_li3_3').text();
            $('#point11text15 ul li:nth-child(3)').append(point11_li3_3);
            var point11_li3_4 = $(this).find('point11_li3_4').text();
            $('#point11text15 ul li:nth-child(4)').append(point11_li3_4);
            var point11_li3_5 = $(this).find('point11_li3_5').text();
            $('#point11text15 ul li:nth-child(5)').append(point11_li3_5);

            var point11_li4_1 = $(this).find('point11_li4_1').text();
            $('#point11text12 ul li:nth-child(1)').append(point11_li4_1);
            var point11_li4_2 = $(this).find('point11_li4_2').text();
            $('#point11text12 ul li:nth-child(2)').append(point11_li4_2);

         });

         $(document).find("point12text").each(function () {
            var point12_1 = $(this).find('point12headingText').text();
            $('.point12headingText').append(point12_1);
            //                var point12_1 = $(this).find('point12headingText').text();
            //                $('.point12headingText').append(point12_1);
            //                var point12_2 = $(this).find('point12text2').text();
            //                $('#point12text .point12text2').append(point12_2);
         });
         $(document).find("point13text").each(function () {

            var point13_1 = $(this).find('point13text1').text();
            $('#point13text1').append(point13_1);
            var point13_2 = $(this).find('point13text2').text();
            /*$('#point13text2').append(point13_2);
            var point13_3 = $(this).find('point13text3').text();
            $('#point13text3').append(point13_3);
            var point13_4 = $(this).find('point13text4').text();
            $('#point13text4').append(point13_4);
            var point13_5 = $(this).find('point13text2').text();
            $('#point13text5').append(point13_5);
            var point13_6 = $(this).find('point13text6').text();
            $('#point13text6').append(point13_6);
            var point13_7 = $(this).find('point13text7').text();
            $('#point13text7').append(point13_7);
            //              var point13_8 = $(this).find('point13text4').text();
            //              $('#point13text8').append(point13_8);
            //              var point13_9 = $(this).find('point13text2').text();
            //              $('#point13text9').append(point13_9);
            var point13_10 = $(this).find('point13text3').text();
            $('#point13text10').append(point13_10);
            var point13_11 = $(this).find('point13text11').text();
            $('#point13text11').append(point13_11);
            var point13_12 = $(this).find('point13text7').text();
            $('#point13text12').append(point13_12);
            //              var point13_13 = $(this).find('point13text2').text();
            //              $('#point13text13').append(point13_13);
            //              var point13_14 = $(this).find('point13text3').text();
            //              $('#point13text14').append(point13_14);
            var point13_15 = $(this).find('point13text4').text();
            $('#point13text15').append(point13_15);

            var point13_li1_1 = $(this).find('point13_li1_1').text();
            $('#point13text6 ul li:nth-child(1)').append(point13_li1_1);
            var point13_li1_2 = $(this).find('point13_li1_2').text();
            $('#point13text6 ul li:nth-child(2)').append(point13_li1_2);
            var point13_li1_3 = $(this).find('point13_li1_3').text();
            $('#point13text6 ul li:nth-child(3)').append(point13_li1_3);
            var point13_li1_4 = $(this).find('point13_li1_4').text();
            $('#point13text6 ul li:nth-child(4)').append(point13_li1_4);

            var point13_li2_1 = $(this).find('point13_li2_1').text();
            $('#point13text11 ul li:nth-child(1)').append(point13_li2_1);
            var point13_li2_2 = $(this).find('point13_li2_2').text();
            $('#point13text11 ul li:nth-child(2)').append(point13_li2_2);
            var point13_li2_3 = $(this).find('point13_li2_3').text();
            $('#point13text11 ul li:nth-child(3)').append(point13_li2_3);
            var point13_li2_4 = $(this).find('point13_li2_4').text();
            $('#point13text11 ul li:nth-child(4)').append(point13_li2_4);

            var point13_li3_1 = $(this).find('point13_li3_1').text();
            $('#point13text15 ul li:nth-child(1)').append(point13_li3_1);
            var point13_li3_2 = $(this).find('point13_li3_2').text();
            $('#point13text15 ul li:nth-child(2)').append(point13_li3_2);
            var point13_li3_3 = $(this).find('point13_li3_3').text();
            $('#point13text15 ul li:nth-child(3)').append(point13_li3_3);
            var point13_li3_4 = $(this).find('point13_li3_4').text();
            $('#point13text15 ul li:nth-child(4)').append(point13_li3_4);
            var point13_li3_5 = $(this).find('point13_li3_5').text();
            $('#point13text15 ul li:nth-child(5)').append(point13_li3_5);

            var point13_li4_1 = $(this).find('point13_li4_1').text();
            $('#point13text12 ul li:nth-child(1)').append(point13_li4_1);
            var point13_li4_2 = $(this).find('point13_li4_2').text();
            $('#point13text12 ul li:nth-child(2)').append(point13_li4_2); */

         });

         $(document).find("point14text").each(function () {
            var point14_1 = $(this).find('headingText').text();
            $('#point14text .point14headingText').append(point14_1);

            var point14_2 = $(this).find('point14text1').text();
            $('#hot1').append(point14_2);

            var point14_3 = $(this).find('point14text2').text();
            $('#hot2').append(point14_3);

            var point14_4 = $(this).find('point14text3').text();
            $('#hot10').append(point14_4);

            var point14_5 = $(this).find('point14text4').text();
            $('#hot11').append(point14_5);


         });


         $(document).find("point15text").each(function () {
            var point15_1 = $(this).find('point15headingText').text();
            $('.point15headingText').append(point15_1);

            var point15_2 = $(this).find('point15text1').text();
            $('#hot63').append(point15_2);

            var point15_3 = $(this).find('point15text2').text();
            $('#hot64').append(point15_3);

            var point15_4 = $(this).find('point15text3').text();
            $('#hot65').append(point15_4);

            var point15_5 = $(this).find('point15text4').text();
            $('#hot66').append(point15_5);

            var point15_6 = $(this).find('point15text5').text();
            $('#hot67').append(point15_6);

            var point15_7 = $(this).find('point15text6').text();
            $('#hot68').append(point15_7);

            var point15_8 = $(this).find('point15text7').text();
            $('#hot69').append(point15_8);

            var point15_9 = $(this).find('point15text8').text();
            $('#hot70').append(point15_9);


         });

         $(document).find("point16text").each(function () {
            var point16_1 = $(this).find('point16headingText').text();
            $('.point16headingText').append(point16_1);
            var point16_2 = $(this).find('point16text1').text();
            $('#point16text .point16text1').append(point16_2);
            var point16_3 = $(this).find('point16text2').text();
            $('#point16text .point16text2').append(point16_3);
            var point16_4 = $(this).find('point16text3').text();
            $('#point16text .point16text3').append(point16_4);
         });


         $(document).find("point2text").each(function () {
            var point2_1 = $(this).find('point2text1').text();
            $('#point2text .point2text1').append(point2_1);


         });

         $(document).find("point17text").each(function () {
            var point17_1 = $(this).find('point17text1').text();
            $('#point17text .point17text1').append(point17_1);
            var point17_2 = $(this).find('point17text2').text();
            $('#point17text .point17text2').append(point17_2);
            var point17_3 = $(this).find('point17text3').text();
            $('#point17text .point17text3').append(point17_3);
            var point17_4 = $(this).find('point17text4').text();
            $('#point17text .point17text4').append(point17_4);

         });

      }, // name of the function to call upon success
      error: function () { alert("Error: Something went wrong"); }
   });
}


function translateIn(no) {
   //console.log($("#point" + no + "text"));
   $("#onloadCopy").css("opacity","1");

   $("#point" + no + "text").css({
      'display': 'block',
      'opacity': 1
   })

   $("#point" + no + "text > p:eq(0)").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });

   $("#point" + no + "text > p:gt(0)").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });

   $("#point" + no + "text p> ").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });

   $("#point" + no + "text ul").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#point0image4").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "1"
   });
   $("#text1, #text2, #text3").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)",
      "opacity": "0"
   });

   $(".headingText1").css('opacity','0');
   $(".headingText1").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)"
   });
   $(".bodyText1").css('opacity','0');
   $(".bodyText1").css({
      "webkitTransform": "translate(0,-5px)",
      "MozTransform": "translate(0,-5px)",
      "msTransform": "translate(0,-5px)",
      "OTransform": "translate(0,-5px)",
      "transform": "translate(0,-5px)"
   });
}

function translateOut(no) {

   //            $(".point1text1").fadeOut(500);

   $("#point" + no + "text").fadeOut(500);
   $("#image" + no).css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#point" + no + "text > p:eq(0)").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#point" + no + "text > p:gt(0)").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#point" + no + "text > ul").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $(".menu").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $(".headingText1").css('opacity','0');
   $(".headingText1").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)"
   });
   $(".bodyText1").css('opacity','0');
   $(".bodyText1").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)"
   });
   $("#text1, #text2, #text3").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   
   $("#topheading").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });
   $("#onloadCopy").css({
      "webkitTransform": "translate(0,0px)",
      "MozTransform": "translate(0,0px)",
      "msTransform": "translate(0,0px)",
      "OTransform": "translate(0,0px)",
      "transform": "translate(0,0px)",
      "opacity": 0
   });


}

var AutoplayInterval;
var autofive = [];
var AutoplayRackInnerNew;

var isCallAutoplayfive = false;

function Autoplayfive() {
   clearAutoPlayFive()
   clearTimeout(AutoplayRackInnerNew);
   var autoServerTimer = 300000;
   var autoBackTimer = 1800000;
   if (parent.autoplayCatalog && !isCallAutoplayfive) {
      autoServerTimer = 8000;
   }
   if (isCallAutoplayfive || parent.activeRackLength == 1) {
      autoplayCatalog = false;
      window.parent.autoplayCatalog = false;
   }
   isCallAutoplayfive = true;

   autofive.push(setTimeout(function () {
      console.log("autoFive");
      $(".playAll").trigger("click");

      AutoplayRackInnerNew = setTimeout(function () {
         parent.AutoplayRackInner();
      },autoBackTimer);
   },autoServerTimer));
}

function clearAutoPlayFive() {
   for (var i = 0; i < autofive.length; i++) {
      clearTimeout(autofive[i]);
   }
   autofive = [];
}

setInterval(function () {
   var $container = $('.js-slideshow'),
      $currentImage = $container.find('.is-shown'),
      currentImageIndex = $currentImage.index() + 1,
      imagesLength = $container.find('img').length;

   $currentImage.removeClass('is-shown');
   $currentImage.next('img').addClass('is-shown');

   if (currentImageIndex == imagesLength) {
      $container.find('img').first().addClass('is-shown');
   }
},5000)


function Reflection(params) {
   if (params == 'ref1') {
      scene.groupApplyState('Rear_1');
      scene.clearRefine();
   } else if (params == 'ref2') {
      scene.groupApplyState('Rear_2');
      scene.clearRefine();
   }
}