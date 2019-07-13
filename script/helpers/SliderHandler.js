var SliderHandler = function (settings) {
  this.animation;
  this.inputCallback = settings.callback;
  this.model = settings.model;
  this.slider=document.getElementById("slider");
  this.labelR = document.getElementById('labelRight');
  this.labelL = document.getElementById('labelLeft');
  this.valueR = document.getElementById('valueRight');
  this.valueL = document.getElementById('valueLeft');
  this.stackedLegenItems = Array.apply(null, document.getElementsByClassName('legend-item'));
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
  let index = Math.min(6, Math.floor(value/10));
  let layerIndex = Math.min(7, Math.floor(value/10));//map floor perque no agafi el valor del max slider, el 7
  this.currentYear = 2009+layerIndex;
  this.inputCallback(2009+layerIndex);
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
  this.labelR.innerText = this.getMonth(layerIndex);
  this.labelL.innerText = this.getMonth(layerIndex);
  this.valueR.innerText = "GCI: "+parseInt(this.model.getLineLabel(this.currentYear), 10);
  var stackedLabel = this.model.getStackedLabel(this.currentYear, this.category);
  this.valueL.innerHTML = `<span>${parseInt(stackedLabel.absolute)} m2</span> (${stackedLabel.relative}%)`;
};

SliderHandler.prototype.getMonth = function (sliderValue) {
  var text;
  switch (sliderValue) {
    case 0:
      text="August 2009";
      break;
    case 1:
      text="October 2010";
      break;
    case 2:
      text="June 2011";
      break;
    case 3:
      text="May 2012";
      break;
    case 4:
      text="June 2013";
      break;
    case 5:
      text="June 2014";
      break;
    case 6:
      text="August 2015";
      break;
    case 7:
      text="November 2016";
      break;
  }
  return text;
  }

SliderHandler.prototype.setCategory = function (category) {
  this.category = category.gridcode != null ? category.gridcode - 2 : null;
  var stackedLabel = this.model.getStackedLabel(this.currentYear, this.category);
  this.valueL.innerHTML = `<span>${parseInt(stackedLabel.absolute)} m2</span> (${stackedLabel.relative}%)`;
  this.stackedLegenItems.map((el) => {
    if (el.getAttribute('gridcode') == this.category) {
      el.classList.add('highlighted');
    } else {
      el.classList.remove('highlighted');
    }
  });
}