// Forms
let callbackForm = () => {
  $('[data-popup="callback"]').fadeOut(0);
  $('[data-popup="callback-thanks"]').fadeIn();
};

let reviewForm = () => {
  $('[data-popup="review"]').fadeOut(0);
  $('[data-popup="review-thanks"]').fadeIn();
};

let footerForm = () => {
  $(".bottom-form form").fadeOut(0);
  $(".bottom-form .thanks").fadeIn();
};

//

$(".registration-form-wrapper button.registration").on("click", function () {
  event.preventDefault();
  becomePartnerPp();
});

$('[data-popup="forget-password"] button').on("click", function () {
  event.preventDefault();
  app.passwordSended();
});

$(".quickorder-form__item-input--product").keyup(function () {
  var itemLemgth = this.value.length;
  if (itemLemgth >= 3) {
    $(this).siblings(".quickorder-form__item-search").css("display", "block");
  } else {
    $(this).siblings(".quickorder-form__item-search").css("display", "none");
  }
});

$(document).mouseup(function (e) {
  var org = $(".quickorder-form__item-search");
  if (!org.is(e.target) && org.has(e.target).length === 0) {
    $(".quickorder-form__item-search").css("display", "none");
  }
});

$(".reserve-btn__cart").on("click", function () {
  event.preventDefault();
  app.reserveAddCard();
});

$(".modal__address-form-button").on("click", function () {
  event.preventDefault();
  app.addNewAddress();
});

//вызов попапа с задержкой

var test = $('.testpopup.switch').text();
var time = $('.testpopup.time').text();

$(document).ready(function() {
	if(test == 1){
		if (getCookie('visited') !== 'yes') {
		let openDelayedPopup = () => {$('#delay-invoke').fadeIn(),$(".overlay").fadeIn()};
		setCookie('visited', 'yes', 30);
		var t = time * 1000;
		setTimeout(openDelayedPopup, t);
	  }	
	}
});

//куки
let name = "visited";
let value = "yes";
let days = 30;
function setCookie(name,value,days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
    }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null; 
}



//формы отправки
$(document).ready(function(){
    $("#form").submit(function(event) { //устанавливаем событие отправки для формы с id=form
      event.preventDefault(); //Отключаем обновление страницы

      var name = $("input[name='bottom-name']").val(); 
	  var phone = $("input[name='bottom-phone']").val();
	  var mail = $("input[name='bottom-mail']").val(); 	  
	  var mess = $("textarea[name='comment']").val(); 
	  var form = $('.bottom-form__container').find('.h2').text();
	  var recap = $("input[name='recaptcha_response']").val();

      BX.ajax({
        url: '/include/form.php',
        data: {
            "name": name,
			"phone": phone,
			"mail": mail,
			"message": mess,
			"form": form,
			"recaptcha_response": recap,
        },
        method: 'POST',
        dataType: 'html',
        timeout: 30,
        async: true,
        processData: true,
        scriptsRunFirst: true,
        emulateOnload: true,
        start: true,
        cache: false,
        onsuccess: function(data) {
            $('#form').text('Спасибо за заявку! Наш менеджер свяжется с вами в ближайшее время');
        },
        onfailure: function() {
            console.log('error');
        }
    });
  });
  
  $("#formpopup").submit(function(event) { //устанавливаем событие отправки для формы с id=form
      event.preventDefault(); //Отключаем обновление страницы

      var name = $('#formpopup').find("input[name='bottom-name']").val(); 
	  var phone = $('#formpopup').find("input[name='bottom-phone']").val();  
	  var mess = $('#formpopup').find("textarea[name='comment']").val(); 
	  var form = $('.modal__body').children('.modal__title.cb').text();
	  var recap = $('#formpopup').find("input[name='recaptcha_response']").val();

      BX.ajax({
        url: '/include/form.php',
        data: {
            "name": name,
			"phone": phone,
			"message": mess,
			"form": form,
			"recaptcha_response": recap,
        },
        method: 'POST',
        dataType: 'html',
        timeout: 30,
        async: true,
        processData: true,
        scriptsRunFirst: true,
        emulateOnload: true,
        start: true,
        cache: false,
        onsuccess: function(data) {
            $('.modal').hide();
			$('#spasibo').show();
        },
        onfailure: function() {
            console.log('error');
        }
    });
  });
  
  $("#formpopup2").submit(function(event) { //устанавливаем событие отправки для формы с id=form
      event.preventDefault(); //Отключаем обновление страницы

      var name = $('#formpopup2').find("input[name='bottom-name']").val(); 
	  var phone = $('#formpopup2').find("input[name='bottom-phone']").val(); 
	  var mess = $('#formpopup2').find("textarea[name='comment']").val();	  
	  var form = $('.modal__body').children('.modal__title.30').text();
	  var recap = $('#formpopup2').find("input[name='recaptcha_response']").val();

      BX.ajax({
        url: '/include/form.php',
        data: {
            "name": name,
			"phone": phone,
			"message": mess,
			"form": form,
			"recaptcha_response": recap,
        },
        method: 'POST',
        dataType: 'html',
        timeout: 30,
        async: true,
        processData: true,
        scriptsRunFirst: true,
        emulateOnload: true,
        start: true,
        cache: false,
        onsuccess: function(data) {
            $('.modal').hide();
			$('#spasibo').show();
        },
        onfailure: function() {
            console.log('error');
        }
    });
  });
  
  $("#formpopup3").submit(function(event) { //устанавливаем событие отправки для формы с id=form
      event.preventDefault(); //Отключаем обновление страницы

      var name = $('#formpopup3').find("input[name='bottom-name']").val(); 
	  var mail = $('#formpopup3').find("input[name='bottom-mail']").val();   
	  var form = $('.modal__body').children('.modal__title.sub').text();
	  var recap = $('#formpopup3').find("input[name='recaptcha_response']").val();

      BX.ajax({
        url: '/include/form.php',
        data: {
            "name": name,
			"mail": mail,
			"form": form,
			"recaptcha_response": recap,
        },
        method: 'POST',
        dataType: 'html',
        timeout: 30,
        async: true,
        processData: true,
        scriptsRunFirst: true,
        emulateOnload: true,
        start: true,
        cache: false,
        onsuccess: function(data) {
            $('.modal').hide();
			$('#spasibo').show();
        },
        onfailure: function() {
            console.log('error');
        }
    });
  });
  
});

