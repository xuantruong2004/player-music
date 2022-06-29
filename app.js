const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isReapeat: false,
  songs: [
    {
      name: 'Từng Yêu',
      singer: 'Phan Duy Anh',
      path: './assets/music/song1.mp3',
      image: './assets/img/song1.jpg',
    },
    {
      name: 'Tinh Thuong Phu thue',
      singer: 'Chi Huong',
      path: './assets/music/song2.mp3',
      image: './assets/img/song2.jpg',
    },
    {
      name: 'Te That Anh Nho Em',
      singer: 'Thanh Hưng',
      path: './assets/music/song3.mp3',
      image: './assets/img/song3.jpg',
    },
    {
      name: 'See Tình',
      singer: 'Hoang Thuy Linh',
      path: './assets/music/song4.mp3',
      image: './assets/img/song4.jpg',
    },
    {
      name: 'Sao Tiêc Một Người Không Tốt',
      singer: 'Hoài Lâm',
      path: './assets/music/song5.mp3',
      image: './assets/img/song1.jpg',
    },
    {
      name: 'Đám Cưới Nha ',
      singer: 'Hồng Thanh',
      path: './assets/music/song6.mp3',
      image: './assets/img/song2.jpg',
    },
    {
      name: ' 3 1 0 7 -2',
      singer: 'Dương Nâu',
      path: './assets/music/song7.mp3',
      image: './assets/img/song3.jpg',
    },
    {
      name: 'See Tình',
      singer: 'Hoàng Thùy Linh',
      path: './assets/music/song3.mp4',
      image: './assets/img/song4.jpg',
    },
  ],
  render: function () {
    // console.warn('ok baby');
    const htmls = this.songs.map((song, index) => {
      return `
		<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
          <div
            class="thumb"
            style="background-image: url('${song.image}')"
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
		`;
    });
    const html = htmls.join('');
    $('.playlist').innerHTML = html;
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdwidth = cd.offsetWidth;
    const _this = this;

    // xu ly CD quay va dung
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000, //second 10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xu ly phong to thu nho
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdwidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
      cd.style.opacity = newWidth / cdwidth;
    };
    //   xu li click play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // khi song play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };
    // khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };
    //khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;
      }
    };
    // xu ly tua
    progress.onchange = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };

    // khi next son
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.render();
      _this.scrollToActiveSong();
      audio.play();
    };
    // khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.render();
      _this.scrollToActiveSong();
      audio.play();
    };
    // click repeat
    repeatBtn.onclick = function () {
      _this.isReapeat = !_this.isReapeat;
      repeatBtn.classList.toggle('active', _this.isReapeat);
    };
    // khi random bat tat
    randomBtn.onclick = function () {
      // if (_this.isRandom) {
      //   randomBtn.classList.remove('active');
      //   _this.isRandom = false;
      // } else {
      //   randomBtn.classList.add('active');
      //   _this.isRandom = true;
      // }
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    // xu ly next khi audio ket thuc
    audio.onended = function () {
      if (_this.isReapeat) {
        // _this.repeatSong();
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // lang nghe click vao playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.option')) {
        // xu li click vao song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.background = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  repeatSong: function () {
    newIndex = this.currentIndex;
    this.loadCurrentSong();
    audio.play();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: `${this.currentIndex == 0 ? 'center' : 'nearest'}`,
      });
    }, 200);
  },
  start: function () {
    // dinh nghia cac thuoc tinhs object
    this.defineProperties();

    //lang nghe su kien (dom)
    this.handleEvents();

    // tai thong tin bai hat dau tien
    this.loadCurrentSong();

    // Ren der playlist
    this.render();
  },
};
app.start();
