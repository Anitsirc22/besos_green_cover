function MouseCatcher (id) {
  this.isActive = false;
  this.id = id;
  this.getSize();
  window.addEventListener('resize', this.getSize.bind(this));
  this.sections = {
    left: document.getElementsByClassName('left-section')[0],
    right: document.getElementsByClassName('right-section')[0],
  }
};

MouseCatcher.prototype.catch = function () {
  // var screen = document.getElementById('mouse-catcher');
  document.addEventListener('mousemove', (function (self) {
    return function (ev) {
      if (ev.screenX/self.size.width > 0.995) {
        if (!self.sections.right.classList.contains('visible')) {
          self.sections.left.classList.remove('visible');
          self.sections.right.classList.add('visible');
        }
      } else if (ev.screenX/self.size.width < 0.005) {
        if (!self.sections.left.classList.contains('visible')) {
          self.sections.right.classList.remove('visible');
          self.sections.left.classList.add('visible');
        }
      }
    }
  })(this));
}

MouseCatcher.prototype.getSize = function () {
    this.size = {
      width: window.innerWidth,
      heigiht: window.innerHeight
    };
}