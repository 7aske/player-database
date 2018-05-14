let dataContainer = document.getElementById('tournament');
let header = document.getElementById('breadCrumbs');
let requestUrl =
	new URL(window.location).origin + '/api' + window.location.pathname;
let date = new Date().toISOString().substr(0, 10);
let addPlayerBtn = document.getElementById('addPlayerBtn');
let form = document.querySelector('form');

let players;

let pFirstName = document.querySelector('[name=pFirstName]'),
	pLastName = document.querySelector('[name=pLastName]'),
	pBirthDate = document.querySelector('[name=pBirthDate]'),
	pImage = document.querySelector('[name=pImage]'),
	pPoints = document.querySelector('[name=pPoints]'),
	pImageContainer = document.getElementById('pImageContainer');

let submitBtn = document.querySelector('#submit');
let removeBtn = document.getElementById('remove');
let request = '';

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

function renderData(data) {
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

	let tRemove = document.createElement('button');
	tRemove.classList.add('tRemove');
	tRemove.innerHTML = '<i class="fa fa-trash"></i>';
	tRemove.addEventListener('click', event => {
		let id = event.target.parentElement.id;
		console.log(id);
		let url = new URL(window.location).origin + '/api/tournaments/' + id;
		console.log(url);
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				window.location.replace(window.location.origin);
			}
		};
		xhr.open('DELETE', url, true);
		xhr.send(null);
	});
	tHead.appendChild(tRemove);
	tCont.appendChild(tHead);

	players.forEach((player, index) => {
		let pCont = document.createElement('div');
		pCont.setAttribute('data-pid', player._id);
		pCont.classList.add('pCont');
		pCont.setAttribute('data-toggle', 'modal');
		pCont.setAttribute('data-target', '#addPlayer');
		pCont.addEventListener('click', event => {
			setModalPatch(event);
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
		//pId.innerText = player._id;
		pId.innerText = 'Points: ' + player.pPoints;
		pId.setAttribute('data-pid', player._id);

		pCont.appendChild(pName);
		pCont.appendChild(pId);
		tCont.appendChild(pCont);
	});
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

function setModalPost() {
	removeBtn.classList.add('d-none');
	request = 'POST';
	form.method = 'POST';
	form.setAttribute('action', `/api${window.location.pathname}/players`);
	pFirstName.value = '';
	pLastName.value = '';
	pBirthDate.value = date;
	pImage.value =
		'https://www.weact.org/wp-content/uploads/2016/10/Blank-profile.png';
	pPoints.value = '';
}
function setModalPatch(event) {
	removeBtn.classList.remove('d-none');
	request = 'put';
	let player = players.find(player => {
		return player._id == event.target.attributes['data-pid'].nodeValue;
	});
	console.log(player);
	form.method = 'put';
	form.setAttribute(
		'action',
		`/api${window.location.pathname}/players/${
			event.target.attributes['data-pid'].nodeValue
		}`
	);
	let date = new Date(player.pBirthDate).toISOString().substr(0, 10);
	pFirstName.value = player.pFirstName;
	pLastName.value = player.pLastName;
	pBirthDate.value = date;
	pImage.value = player.pImage;
	pPoints.value = player.pPoints;
	pImageContainer.src = player.pImage;
}
requestData(requestUrl);
addPlayerBtn.addEventListener('click', () => {
	setModalPost();
});
submitBtn.addEventListener('click', event => {
	event.preventDefault();
	if (verifyForm().validated) {
		let url = form.action;
		let xhr = new XMLHttpRequest();
		xhr.open(request, url, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 201) {
				dataContainer.innerHTML = '';
				requestData(requestUrl);
				$('#addPlayer').modal();
			}
		};

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
		console.log(verifyForm());
		alert(verifyForm().response);
	}
});
removeBtn.addEventListener('click', () => {
	let url = form.action;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			dataContainer.innerHTML = '';
			requestData(requestUrl);
		}
	};
	xhr.open('DELETE', url, true);
	xhr.send(null);
});
