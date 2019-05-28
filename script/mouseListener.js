function MouseCatcher (id) {
  this.isActive = false;
  this.id = id;
  this.size = {
    width: window.innerWidth,
    heigiht: window.innerHeight
  };
  this.sections = {
    left: document.getElementsByClassName('left-section')[0],
    right: document.getElementsByClassName('right-section')[0],
  }
};

MouseCatcher.prototype.catch = function () {
  // var screen = document.getElementById('mouse-catcher');
  document.addEventListener('mousemove', (function (self) {
    return function (ev) {
      if (ev.screenX/self.size.width > 0.95) {
        debugger;
        if (!self.sections.right.classList.contains('visible')) {
          self.sections.left.classList.remove('visible');
          self.sections.right.classList.add('visible');
        }
      } else if (ev.screenX/self.size.width < 0.05) {
        if (!self.sections.left.classList.contains('visible')) {
          self.sections.right.classList.remove('visible');
          self.sections.left.classList.add('visible');
        }
      }
    }
  })(this));
}