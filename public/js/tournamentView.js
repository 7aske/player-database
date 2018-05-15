let dataContainer = document.getElementById('tournament');
let header = document.getElementById('breadCrumbs');
let requestUrl =
	new URL(window.location).origin + '/api' + window.location.pathname;
let date = new Date().toISOString().substr(0, 10);
let addPlayerBtn = document.getElementById('addPlayerBtn');
let form = document.querySelector('form');

//save the data that is retrieved by the requestData function for modal processing
let players;

//inputs from the add/edit modal to be populated depending on the required action
let pFirstName = document.querySelector('[name=pFirstName]'),
	pLastName = document.querySelector('[name=pLastName]'),
	pBirthDate = document.querySelector('[name=pBirthDate]'),
	pImage = document.querySelector('[name=pImage]'),
	pPoints = document.querySelector('[name=pPoints]'),
	pImageContainer = document.getElementById('pImageContainer');

//button variables to add event listeners
let submitBtn = document.querySelector('#submit');
let removeBtn = document.querySelector('#remove');
//variable to store the current request to be executed
let request = '';

//simple form verification since default HTML form verification wont work with my implementation
function verifyForm() {
	let fn = document.querySelector('[name=pFirstName]').value;
	let ln = document.querySelector('[name=pLastName]').value;
	let response = '';

	let validated = true;
	if (fn == '') {
		response += 'First name must not be blank \n';
		validated = false;
	}
	if (ln == '') {
		response += 'Last name must not be blank \n';
		validated = false;
	}
	return {
		validated: validated,
		response: response
	};
}
//almost the same as the root page function, difference being that this not only renders the data
//which now contains both players and cooresponding tournament data
//it also returns a sorted array(by ponts) of players
function requestData(url) {
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			players = JSON.parse(this.responseText).players;
			players.sort((a, b) => {
				return a.pPoints < b.pPoints;
			});
			renderData(JSON.parse(this.responseText));
		}
	};
	xhr.open('GET', url, true);
	xhr.send(null);
}
//render data retrieved by the requestData function
function renderData(data) {
	//container to hold basic  tournament info and individual palyers
	let tCont = document.createElement('div');
	tCont.classList.add('tCont', 'text-center');

	let tHead = document.createElement('h2');
	tHead.classList.add('tHead');
	tHead.innerHTML = '<i class="fa fa-trophy"></i> ' + data.tournament.tName;
	tHead.id = data.tournament._id;

	let tPrize = document.createElement('label');
	tPrize.classList.add('tPrize');
	tPrize.innerHTML =
		'Prize: <i class="fa fa-btc"></i> ' + data.tournament.tPrize;
	tHead.appendChild(tPrize);

	//remove tournament button
	let tRemove = document.createElement('button');
	tRemove.classList.add('tRemove');
	tRemove.innerHTML = '<i class="fa fa-trash"></i>';
	//delete the current tournament
	tRemove.addEventListener('click', event => {
		if (confirm('Are you sure?')) {
			//getting to this point i figure out that a lot of these functions can be separated
			//to different modules. Will happen in future implementations
			let id = event.target.parentElement.id;
			let url = new URL(window.location).origin + '/api/tournaments/' + id;
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//using replace method to prevent the user from returning to the deleted tournament page
					window.location.replace(window.location.origin);
				}
			};
			xhr.open('DELETE', url, true);
			xhr.send(null);
		}
	});

	tHead.appendChild(tRemove);
	tCont.appendChild(tHead);

	//rendering players from exteran players variable since that one is sorted
	players.forEach((player, index) => {
		let pCont = document.createElement('div');
		//adding playerid to containers for dynamic modal populating
		//at the time no other method of achieveing that crossed my mind
		pCont.setAttribute('data-pid', player._id);
		pCont.classList.add('pCont');
		pCont.setAttribute('data-toggle', 'modal');
		pCont.setAttribute('data-target', '#addPlayer');
		pCont.addEventListener('click', event => {
			//depending on from where the modal was called it will have different values
			//if called from player container it will have the details of the clicked player
			//and purpose of updating the player
			//if called from the Add Player button will have blank inputs
			//and purpose of adding a new player to the database
			setModalPatch(event); //passed the event to update player id
		});

		let pName = document.createElement('p');
		if (index == 0) {
			pName.innerHTML =
				'<i class="fa fa-star"></i> ' +
				player.pFirstName +
				' ' +
				player.pLastName;
		} else {
			pName.innerHTML =
				'<i class="fa fa-user"></i> ' +
				player.pFirstName +
				' ' +
				player.pLastName;
		}

		pName.setAttribute('data-pid', player._id);

		let pId = document.createElement('label');
		pId.classList.add('tId');
		pId.innerText = 'Points: ' + player.pPoints;
		pId.setAttribute('data-pid', player._id);

		pCont.appendChild(pName);
		pCont.appendChild(pId);
		tCont.appendChild(pCont);
	});
	//dynamically adding breadcrumbs
	//this was supposed to be relativelly necessary as i was planing to implement a third page for idividual players
	//that was replaced by using a simple modal
	let breadCrumb = document.createElement('a');
	let breadCrumbButton = document.createElement('button');
	breadCrumbButton.innerHTML =
		'<i class="fa fa-trophy"></i> ' + data.tournament.tName;
	breadCrumb.appendChild(breadCrumbButton);
	breadCrumb.setAttribute('href', `/tournaments/${data.tournament._id}`);
	header.innerHTML = '';
	header.appendChild(breadCrumb);

	dataContainer.appendChild(tCont);
}

//update the modal with required values for adding
function setModalPost() {
	//remove the Remove Player button if the modals function is to add a new player
	removeBtn.classList.add('d-none');
	request = 'POST';
	form.method = 'POST';
	form.setAttribute('action', `/api${window.location.pathname}/players`);
	pFirstName.value = 'John';
	pLastName.value = 'Doe';
	pBirthDate.value = date;
	pImage.value =
		'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png';
	pPoints.value = '1000';
}
//update the modal with required values for updating
function setModalPatch(event) {
	removeBtn.classList.remove('d-none');
	request = 'put'; //not sure if uppercase/lowercase have any influence on the result
	let player = players.find(player => {
		//find the player based on the id stored in the container
		return player._id == event.target.attributes['data-pid'].nodeValue;
	});
	//learned that forms have only primitve methods like GET and POST
	//add the link to form's action attribute for future reference
	form.setAttribute(
		'action',
		`/api${window.location.pathname}/players/${
			event.target.attributes['data-pid'].nodeValue
		}`
	);
	//populating the modal with player's details
	let date = new Date(player.pBirthDate).toISOString().substr(0, 10); //format the date to work with HTML date input
	pFirstName.value = player.pFirstName;
	pLastName.value = player.pLastName;
	pBirthDate.value = date;
	pImage.value = player.pImage;
	pPoints.value = player.pPoints;
	pImageContainer.src = player.pImage;
}
//request and render the data on page load
requestData(requestUrl);
addPlayerBtn.addEventListener('click', () => {
	//add player button has the function of setting up the modal for adding a new player
	setModalPost();
});
submitBtn.addEventListener('click', event => {
	event.preventDefault();
	//verify the two basic values needed to create new player
	//rest have their default vaules set up in the mongoose model if no value is given
	if (verifyForm().validated) {
		let url = form.action; //set the url from form action attribute
		let xhr = new XMLHttpRequest();
		xhr.open(request, url, true);
		//put requests seemed not to work without setting up the headers
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 201) {
				//refresh the players list with new updated data
				dataContainer.innerHTML = '';
				requestData(requestUrl);
				//close modal after updating
				$('#addPlayer').modal();
			}
		};
		//send the JSON object with player data to the server for updating
		xhr.send(
			JSON.stringify({
				pFirstName: pFirstName.value,
				pLastName: pLastName.value,
				pBirthDate: pBirthDate.value,
				pImage: pImage.value,
				pPoints: pPoints.value
			})
		);
	} else {
		//if the verify criteria is not met alert the user
		alert(verifyForm().response);
	}
});
//button to remove the tournament
removeBtn.addEventListener('click', () => {
	if (confirm('Are you sure?')) {
		let url = form.action;
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//refresh the players list with new data
				dataContainer.innerHTML = '';
				requestData(requestUrl);
			}
		};
		xhr.open('DELETE', url, true);
		xhr.send(null);
	}
});
