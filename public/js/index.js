let dataContainer = document.getElementById('dataContainer');
function requestData() {
	let url = new URL(window.location).href + 'api/tournaments';
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			renderData(JSON.parse(this.responseText));
		}
	};
	xhr.open('GET', url);
	xhr.send();
}
function renderData(data) {
	console.log(data);
	data.forEach(t => {
		let tCont = document.createElement('div');
		tCont.classList.add('tCont', 'text-center');

		let tHead = document.createElement('h2');
		tHead.classList.add('tHead');
		tHead.innerText = t.tName;

		let tId = document.createElement('p');
		tId.classList.add('tId');
		tId.innerHTML = `ID: ${t._id}<br>No. of participants: ${t.tPlayers.length}`;

		tCont.appendChild(tHead);
		tCont.appendChild(tId);
		tCont.setAttribute('id', t._id);
		tCont.addEventListener('click', () => {
			window.location += 'api/tournaments/' + t._id;
		});
		dataContainer.appendChild(tCont);
	});
}
requestData();
