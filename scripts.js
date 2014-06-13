lsDataKey = 'gtdData';

//template for card
cardTemplate = _.template('<div class="card <%= type %>"><span># <span class="id"><%= id %></span> </span><a href="#" data-type="text" data-title="Enter content" class="editable editable-click"><%= name %></a><button type="button" class="close closeButton" aria-hidden="true">&times;</button></div>');

$(document).ready(function(){
	initLS();
	//X-editable plugin settings
	$.fn.editable.defaults.mode = 'inline';

	initData();

	//init X-editable and drag and drop
	$('.editable').editable({
		success: onEdit
	});
	$('div.card').draggable({
		helper : 'clone',
		opacity : 0.5
	});
	$('div.column').droppable({
        tolerance : 'pointer',
        accept : 'div.card',
        drop : onCardDrop
    });

	//remove card on 'x' button, add task and bug buttons
	$('.closeButton').click(removeCard);
	$('#addTask').click(function(){
		addCard('task');
	});
	$('#addBug').click(function(){
		addCard('bug');
	});
});

function getCardByUIElement(uiElement){
	var cardId = parseInt(uiElement.find('.id').text());
	return _.find(backendData, function(item){ return item.id == cardId});
}

function onEdit(response, newValue){
	var card = getCardByUIElement($(this).parent());
	if (card.name != newValue){
		card.name = newValue;
		saveToLS();
	}
}

function onCardDrop(event, ui){
	var card = getCardByUIElement(ui.draggable);
	var newStatus = $(this).attr('id');
	if (newStatus != card.status){
		card.status = newStatus;
		$(this).append(ui.draggable);
		saveToLS();
	}
}

function addCard(cardType){
	var newId = 1;
	if (backendData.length)
		newId = _.max(backendData, function(item) { return item.id }).id + 1;
	var newCard = {
		id: newId,
		name: "New",
		type: cardType,
		status: "todo"
	};
	backendData.push(newCard);
	
	//add ui
	var newElement = $(cardTemplate(newCard));
	newElement.draggable({
		helper : 'clone',
		opacity : 0.5
	});
	newElement.find('.editable').editable({
		success: onEdit
	});
	newElement.find('.closeButton').click(removeCard);

	$('#todo').append(newElement);
	saveToLS();
}

function removeCard(event){
	event.preventDefault();
	var idToRemove = parseInt($(this).parent().find('.id').text());
	$(this).parent().remove();
	backendData = _.reject(backendData, function(item) { return item.id == idToRemove });
	saveToLS();
}

function initLS(){
	//on first run copy data to local storage
	if(!localStorage.gtdData) {
		saveToLS();
	} else {
		backendData = JSON.parse(localStorage.gtdData);
	}
}

function saveToLS(){
	localStorage.setItem(lsDataKey, JSON.stringify(backendData));
}

function initData(){
	//add each card to proper column
	_.each(backendData, function(item){
		$('#' + item.status).append($(cardTemplate(item)));
	});
}