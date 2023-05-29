(function () {
  const cards = [
    {
      name: "php",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/297px-PHP-logo.svg.png",
      id: 1,
    },
    {
      name: "css3",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/160px-CSS3_logo.svg.png",
      id: 2,
    },
    {
      name: "html5",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/160px-HTML5_logo_and_wordmark.svg.png",
      id: 3,
    },
    {
      name: "jquery",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/JQuery-Logo.svg/440px-JQuery-Logo.svg.png",
      id: 4,
    },
    {
      name: "javascript",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/160px-Unofficial_JavaScript_logo_2.svg.png",
      id: 5,
    },
    {
      name: "node",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/262px-Node.js_logo.svg.png",
      id: 6,
    },
    {
      name: "photoshop",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/164px-Adobe_Photoshop_CC_icon.svg.png",
      id: 7,
    },
    {
      name: "C#",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/C_Sharp_wordmark.svg/480px-C_Sharp_wordmark.svg.png",
      id: 8,
    },
    {
      name: "rails",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ruby_On_Rails_Logo.svg/425px-Ruby_On_Rails_Logo.svg.png",
      id: 9,
    },
    {
      name: "sass",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/213px-Sass_Logo_Color.svg.png",
      id: 10,
    },
    {
      name: "sublime",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Breezeicons-apps-48-sublime-text.svg/160px-Breezeicons-apps-48-sublime-text.svg.png",
      id: 11,
    },
    {
      name: "wordpress",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/WordPress_logo.svg/440px-WordPress_logo.svg.png",
      id: 12,
      
    },
  ];

  
  // объект с основной механикой игры
  const Memory = {
    init: function (cards) {
      // $(..) - ищем на страничке html элемент с этим классом
      this.$game = $(".game__window"); 
      this.$congratulations = $(".game__congratulations");
      this.$restart = $(".game__restart");
      this.cardsArray = $.merge(cards, cards); // merge - метод jQuery для слияния массивов => дублируем массив
      this.shuffleCards(this.cardsArray); // самописная функция перемешивания карточек 
      this.setup(); // самописная функция раскладки карт
    },

    // функция перемешивания карточек
    shuffleCards: function (cardsArray) {
      this.$cards = $(this.shuffle(this.cardsArray));
    },

    //функция раскладки карт
    setup: function () {
      this.html = this.buildHTML(); // самописаня функция генерации карточек
      this.$game.html(this.html); 
      this.$memoryCards = $(".game__card");
      this.paused = false; // не ждём переворота второй карточки
      this.guess = null; // пока что нет перевернутой первой карточки
      this.binding(); // самописная функция навешивания обработчиков
    },
    
    // навесить обработчики
    binding: function () {
      this.$memoryCards.on("click", this.cardClicked);
      this.$restart.on("click", $.proxy(this.reset, this)); // аналог bind
    },

    cardClicked: function () {
      const $card = $(this); // выбрать карточку по которой произошёл клик

      if ( // "если карточка ещё не перевернута и мы не нажимаем на ту же самую карточку второй раз подряд" + мы не на паузе
        !Memory.paused &&
        !$card.hasClass("matched") &&
        !$card.hasClass("picked")
      ) {
        $card.addClass("picked"); // переворачиваем выбранную карточку
        if (!Memory.guess) { //если мы перевернули только первую карточку          
          Memory.guess = $card.attr("data-id"); // для начала запомним ее
        } else if ( // "если мы перевернули вторую и она совпадает с первой" и мы не тыкаем по той же самой карточке
          Memory.guess == $card.attr("data-id")
        ) {
          $(".picked").addClass("matched"); // оставляем обе на поле и показываем анимацию совпадения          
          Memory.guess = null; // обнулить служебную переменную
        } else { //если же вторая не совпадает с первой
          Memory.guess = null;
          Memory.paused = true; // включаем паузу
          setTimeout(function () { // ждем указанное время в мс и прячем карточки обратно
            $(".picked").removeClass("picked");
            Memory.paused = false;
          }, 600);
        }
        if ($(".matched").length == $(".game__card").length) { // если все пары найдены
          Memory.win(); //показываем победное сообщение
        }
      }
    },

    win: function () {
      this.paused = true;
      //плавно показываем окошко с поздравлением и предложением сыграть еще, 
      setTimeout(function () {
        Memory.showModal();
        Memory.$game.fadeOut(); // скрываем (fadeOut = затухание) окно с игрой
      }, 1000);
    },

    //делаем окно с поздравлением видимым
    showModal: function () {
      this.$congratulations.show("slow"); //добавим плавности
    },

    //прячем окно с поздравлением
    hideModal: function () {
      this.$congratulations.hide("fast");
    },

    //перезапуск игры
    reset: function () {
      this.shuffleCards(this.cardsArray);
      this.setup();
      this.$congratulations.hide("fast");
      this.$game.show("slow");
    },

    // Тасование Фишера-Йетса https://bost.ocks.org/mike/shuffle/
    shuffle: function (array) {
      let counter = array.length,
        temp,
        index;
      while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    },

    buildHTML: function() {
      let frag = '';
      this.$cards.each(function(k,v) {
        frag += '<div class="game__card" data-id="' + v.id + '"><img class="game__card-front" src="' + v.img + '" alt="' + v.name + '" /><img class="game__card-back" src="./images/overlay-cards.jpg" alt="Codepen" /></div>';
      // <div class="game__card">
      //       <img src="" alt="" />
      //       <img src="" alt="" />
      // </div> - разметка выше
      })

      return frag ;
    }
  };

  Memory.init(cards);
})();
