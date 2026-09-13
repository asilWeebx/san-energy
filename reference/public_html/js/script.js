$(document).ready(function(){

	$('.products_show_hide').on('click', function(){
		$('.hidden_product').toggleClass('active');
		$(this).toggleClass('active');
		return false;
	})
});