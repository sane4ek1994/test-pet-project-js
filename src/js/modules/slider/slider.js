export default class Slider {
    constructor({container=null,
         btns=null,
         next=null,
         prev=null,
         activeClass = '',
         animate,
         autoPlay} = {}) {
        this.container = document.querySelector(container);
        try {this.slides = this.container.children;} catch (e) {}
        this.btns = document.querySelectorAll(btns);
        this.prev = document.querySelectorAll(prev);
        this.next = document.querySelectorAll(next);
        this.activeClass = activeClass;
        this.animate = animate;
        this.autoPlay = autoPlay;
        this.slideIndex = 1;
    }
}