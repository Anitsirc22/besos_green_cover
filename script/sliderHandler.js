var SliderHandler = function (settings) {
  this.animation;
  this.inputCallback = settings.callback;
  this.slider=document.getElementById("slider");
  this.label = document.getElementById('label');
	this.images=Array.apply(null, document.getElementsByClassName("image"));//retorna una llista dels div
	this.baseImage = this.images.shift();//to delete the first item of the list
  
  this.slider.addEventListener('mousemove', function (ev) {}, true);
  this.slider.addEventListener("input", this.sliderChangeCallback.bind(this)); //when the slider notify an input the value);
  // slider.addEventListener("change", sliderChangeCallback); //when the slider value changes the value);

	this.animation = setInterval((function (self) {
		var index = 0;
		return function () {
			index++;
      self.slider.value = index;
			self.sliderChangeCallback({srcElement: self.slider});
			if (index == self.slider.getAttribute('max')) {
				clearInterval(self.animation);
			}
		}
	})(this), 200);
};

SliderHandler.prototype.sliderChangeCallback = function (e) {
  let value = e.srcElement.value;
  let index = Math.min(6, Math.floor(value/10));//map floor perque no agafi el valor del max slider, el 7
  this.inputCallback(2014+index);
  if (index >= 1) {
    this.images[index-1].style.opacity = 1;//l'any anterior amb opacity 1
  }
  let currentImage = this.images[index];
  for (let i=index+1,n=this.images.length; i<n; i++) {
    if (i != index && i != index-1) {
      this.images[i].style.opacity = 0;
    }
  }
  let opacity = (value-(index*10))/10;
  currentImage.style.opacity = opacity;
  this.label.innerText = this.getMonth(index);
};

SliderHandler.prototype.getMonth = function (sliderValue) {
  var text;
  switch (sliderValue) {
    case 0:
      text="Agost 2009";
      break;
    case 1:
      text="Octubre 2010";
      break;
    case 2:
      text="Juny 2011";
      break;
    case 3:
      text="Maig 2012";
      break;
    case 4:
      text="Juny 2013";
      break;
    case 5:
      text="Juny 2014";
      break;
    case 6:
      text="Agost 2015";
      break;
    case 6.99:
      text="Novembre 2016";
      break;
  }
  return text;
  }