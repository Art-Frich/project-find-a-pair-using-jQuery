// весь скрипт - одна большая функция
(function () {
  // карточки
  var cards = [
    {
      // название
      name: "php",
      // адрес картинки
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/297px-PHP-logo.svg.png",
      // порядковый номер пары
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
  var Memory = {
    // создаём карточки
    // init - инициация создания объекта
    init: function (cards) {
      // начинается работа с jQuery: $ позволяет создать глобальную переменную
      this.$game = $(".game__window");
      this.$congratulations = $(".game__congratulations");
      this.$restart = $(".game__restart");
      // merge - метод jQuery, позволяет совершить слияние массивов, в нашем случае создает каждой карточке дубликат
      this.cardsArray = $.merge(cards, cards);
      // самописная функция перемешивания карточек
      this.shuffleCards(this.cardsArray);
      // "раскладываем" карты
      this.setup();
    },

    // прописываем функцию перемешивания карточек
    shuffleCards: function (cardsArray) {
      this.$cards = $(this.shuffle(this.cardsArray));
    }, //не забывай о запятой, бро

    //прописываем функцию раскладки карт
    setup: function () {
      // вроде как инициируем код с карточками для вставки на страничку...
      this.html = this.buildHTML();
      // добавляем инициированный код методом .html в элемент .game странички
      this.$game.html(this.html);
      // вроде бы прописываем обращение к пока не написанному селектору блока карточек
      this.$memoryCards = $(".game__card");
      // "на старте мы не ждем переворота второй карточки"
      this.paused = false;
      // "на старте у нас нет перевёрнутой первой карточки"
      this.guess = null;
      // "добавляем элементам на странице реакции на нажатия"
      this.binding();
    },

    //самописная функция реагирования на нажатия указанная выше
    binding: function () {
      //т.к. у нас только два интерактива на страничке: карточки и кнопка сброса игры, то прописать реакцию нужно только для них

      // нажатие на карточку: вызов метода cardCliked
      this.$memoryCards.on("click", this.cardClicked);
      //нажатие на кнопку перезапуска игры: применить .proxy, который к функции вызова this применит this.reset
      this.$restart.on("click", $.proxy(this.reset, this));
    },

    cardClicked: function () {
      // получаем объект - ссылку на Memory, по которому можно отслеживать состояние родителя. Не понимаю, почему бы для этого не использовать самого родителя... чтобы не писать Memory, а использовать сокращение?
      var _ = Memory;
      //получаем доступ к карточке, на которую нажал пользователь, это же html элемент получается?
      var $card = $(this);
      //начинается логика =)

      // "если карточка ещё не перевернута и мы не нажимаем на ту же самую карточку второй раз подряд" + мы не на паузе
      if (
        !_.paused &&
        !$card.hasClass("matched") &&
        !$card.hasClass("picked")
      ) {
        // переворачиваем выбранную карточку
        $card.addClass("picked");
        //если мы перевернули только первую карточку
        if (!_.guess) {
          // для начала запомним ее
          _.guess = $card.attr("data-id");
          // "если мы перевернули вторую и она совпадает с первой" и мы не тыкаем по той же самой карточке, верно?
        } else if (
          _.guess == $card.attr("data-id")
        ) {
          // оставляем обе на поле и показываем анимацию совпадения
          // matched - класс угаданных пар
          $(".picked").addClass("matched");
          // не забываем обнулить служебную переменную
          _.guess = null;
          //если же вторая не совпадает с первой
        } else {
          //обнуляем служебную переменную
          _.guess = null;
          // включаем паузу - пока не выключим, ни одна карточка больше не нажмется и не будет переворачиваться
          _.paused = true;
          // ждем указанное время в мс и прячем карточки обратно
          setTimeout(function () {
            $(".picked").removeClass("picked");
            Memory.paused = false;
          }, 600); //не забывай закрыть оператор, бро
        }
        //проверка на корректность завершения игры
        if ($(".matched").length == $(".game__card").length) {
          //показываем победное сообщение
          _.win();
        }
      }
    },

    win: function () {
      //ставим на паузу и запрещаем переворачивать карточки
      this.paused = true;
      //плавно показываем окошко с поздравлением и предложением сыграть еще, скрывая (fadeOut = затухание) окно с игрой
      setTimeout(function () {
        Memory.showModal();
        Memory.$game.fadeOut();
      }, 1000);
    },

    //делаем окно с поздравлением видимым
    showModal: function () {
      //добавим плавности
      this.$congratulations.show("slow");
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
      var counter = array.length,
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

    //код добавления карточек на html страничку
    buildHTML: function() {
      //сюда складывать HTML-код
      var frag = '';
      //перебираем все карточки подряд
      this.$cards.each(function(k,v) {
        // <div class="game__card">
      //       <img src="" alt="" />
      //       <img src="" alt="" />
        // </div>
        frag += '<div class="game__card" data-id="' + v.id + '"><img class="game__card-front" src="' + v.img + '" alt="' + v.name + '" /><img class="game__card-back" src="../images/overlay-cards.jpg" alt="Codepen" /></div>';
      })

      return frag ;
    }
  };

  Memory.init(cards);
})();//зачем эти две скобки в конце?
