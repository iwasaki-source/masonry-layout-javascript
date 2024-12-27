class Masonry {
  constructor() {
    this.el = document.querySelector('.masonry');
    if(!this.el) return
    this.init();
  }
  init() {
    this.setupGrid();
    this.loadImage();

    window.addEventListener('resize', this.onResize.bind(this));
  }
  setupGrid() {
    this.masonryItems = this.el.querySelectorAll('.masonry-item');
    this.columns = parseInt(this.el.dataset.masonryColumns, 10) || 3;
    this.columnGap = parseInt(this.el.dataset.masonryColumnGap, 10) || 20;
    this.rowGap = parseInt(this.el.dataset.masonryRowGap, 10) || 20;
    this.elWidth = this.el.getBoundingClientRect().width;
    this.updateColumns();
  }
  updateColumns() {
    if (this.elWidth >= 1000) {
      this.columns = 4;
    } else if (this.elWidth >= 700) {
      this.columns = 3;
    } else if (this.elWidth >= 568) {
      this.columns = 2;
    } else {
      this.columns = 1;
    }
    this.columnWidth = this.elWidth / this.columns;
    this.columnHeights = Array(this.columns).fill(0);
  }
  onResize() {
    this.elWidth = this.el.getBoundingClientRect().width;
    this.updateColumns();
    this.calculateLayout();
  }
  loadImage() {
    const imagePromises = [];
    this.masonryItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        const imageLoadPromise = new Promise(resolve => {
          img.onload = resolve;
        });
        imagePromises.push(imageLoadPromise);
      }
    });

    Promise.all(imagePromises).then(() => {
      this.el.style.opacity = '1';
      this.calculateLayout();
    })
  }
  calculateLayout() {
    this.masonryItems.forEach((item, index) => {
      const columnIndex = index % this.columns;
      const x = columnIndex * this.columnWidth;
      const y = this.columnHeights[columnIndex];

      item.style.width = `${this.columnWidth - this.columnGap}px`;
      item.style.translate = `${x}px ${y}px`;

      this.columnHeights[columnIndex] += item.getBoundingClientRect().height + this.rowGap;
    });

    this.el.style.height = `${Math.max(...this.columnHeights)}px`
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const masonry = new Masonry();

  const reloadButton = document.querySelector('.reload-button');

  if (reloadButton) {
    reloadButton.addEventListener('click', () => {
      masonry.masonryItems.forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
          const randomHeight = Math.floor(Math.random() * (600 - 200 + 1)) + 200;
          img.src = `https://picsum.photos/400/${randomHeight}?random=${Math.random()}`;
        }
      });
      masonry.el.style.opacity = '0';
      masonry.init();
    });
  }
})