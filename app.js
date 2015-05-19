var app = {};

// COLLECTING INFORMATION ----------------------
	app.userInput = function(){
		$('#submit').on('click', function(){
			//Collect info
			//Get in or out
			var makeBuy = $('#inOut').val();
			if (makeBuy === 'make'){
				app.yummly = true;
			} else {
				app.foursquare = true;
			}
			//Get meal type
			var mealType = $('#mealType').val();
			var foodType = $('#mealType').find(':selected').data('type');
			//Based on selections call api.
			//if the user is staying in call yummly
			console.log(foodType);
			if(app.yummly === true) {
				app.getRecipe(mealType);
			}
			else {
				//else call foursquare
				app.getRestaurant(foodType);
			}
		})
	};

// API CALLS  		----------------------
	// make | Yummly API call
	app.getRecipe = function(userType){
		$.ajax({
			url: 'http://api.yummly.com/v1/api/recipes?',
			dataType: 'jsonp',
			type: 'GET',
			data: {
				_app_id: 'b087ae65',
				_app_key: '356242368b7c17435e2dc7fc0cdaefc7',
				allowedCourse: [userType]			
			},
			success: function(data){
				console.log(data);
				app.recipeList(data.matches);
			}
		});
	};

	// out | Foursquare API call
	app.getRestaurant = function(userRestaurant){
		// console.log(userRestaurant);
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/search',
			type: 'GET',
			dataType: 'jsonp',	
			data: {
				client_id: 'VHWISJXR1XCJ3TD0SVVYDCMXXJNADUKBJINJUVOPFW3HJQXJ',
				client_secret: 'JTKMKS5EIEOIGXKWIMPDBSGPTFFHUZ15JEJZWT3AZE4SBLIQ',
				v: '20150513',
				near: 'toronto',
				query: userRestaurant
				// venuePhotos:1		
			},
			success: function(data){
				console.log(data);
				app.restaurantList(data.response.venues);
			}
		});
	};

// DISPLAY  		----------------------	
	// Yummly | after we get the info, display the recipes
	app.recipeList = function(recipeData){
		$('#meal').empty();

		$.each(recipeData, function(i, recipe){  // to select array items
			var $title = $('<h2>').text(recipe.recipeName);
			var $image = $('<img>').attr('src',recipe.smallImageUrls);
			var $list = $('<ul>');
			// collect info into elements, append to new element
			var $listRecipe = $('<div>').addClass('recipe').append($image, $title, $list);
			$('#meal').append($listRecipe);

			$.each(recipe.ingredients, function(x, ingredient) {
				console.log(ingredient);
				var $ingredients = $('<li>').text(ingredient);
				$('ul').append($ingredients);
			})			
		})
	};

	// Foursquare | after we get the info, display the restaurants
	app.restaurantList = function(restaurantData){
		$('#meal').empty();

		$.each(restaurantData, function(i, restaurants){
			var $title = $('<h2>').text(restaurants.name);
			var $location = $('<p>').text(restaurants.location.address);
			var $url = $('<a>').attr('href', restaurants.url);
			var $listRestaurants = $('<div>').addClass('restaurants').append($title, $location, $url);
			$('#meal').append($listRestaurants);
		})
	};

// INIT  			----------------------

	app.init = function(){
		app.userInput();
	};

// DOCUMENT READY  	----------------------

	$(function(){
		app.init();
	});