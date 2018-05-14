let dataContainer = document.getElementById('home');
function requestData(url) {
	//let url = new URL(window.location).href + 'api/tournaments';
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			renderData(JSON.parse(this.responseText));
		}
	};
	xhr.open('GET', url, true);
	xhr.send(null);
}
function renderData(data) {
	console.log(data);
	data.forEach(t => {
		let tCont = document.createElement('div');
		tCont.classList.add('tCont', 'text-center');

		let tHead = document.createElement('h2');
		tHead.classList.add('tHead');
		tHead.innerHTML = '<i class="fa fa-trophy"></i> ' + t.tName;

		let tId = document.createElement('p');
		tId.classList.add('tId');
		//tId.innerHTML = `ID: ${t._id}<br>No. of participants: ${t.tPlayers.length}`;
		tId.innerHTML = `Prize: ${t.tPrize}<br>No. of players: ${
			t.tPlayers.length
		}`;

		tCont.appendChild(tHead);
		tCont.appendChild(tId);

		tCont.setAttribute('id', t._id);
		tCont.addEventListener('click', () => {
			window.location += 'tournaments/' + t._id;
		});
		dataContainer.appendChild(tCont);
	});
}
requestData(new URL(window.location).href + 'api/tournaments');
