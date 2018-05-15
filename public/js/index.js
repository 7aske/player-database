let dataContainer = document.getElementById('home');

//send a request to the API to fetch that data for all tournaments that are to be displayed on the root page
function requestData(url) {
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			renderData(JSON.parse(this.responseText));
		}
	};
	xhr.open('GET', url, true);
	xhr.send(null);
}

//rendering the data fetched from the API
function renderData(data) {
	//request returns the array of tournaments objects
	data.forEach(t => {
		//for each tournament its coorsponding container is created along
		//with basic info
		let tCont = document.createElement('div');
		tCont.classList.add('tCont', 'text-center');

		let tHead = document.createElement('h2');
		tHead.classList.add('tHead');
		tHead.innerHTML = '<i class="fa fa-trophy"></i> ' + t.tName;

		let tId = document.createElement('p');
		tId.classList.add('tId');
		tId.innerHTML = `Prize: <i class="fa fa-btc"></i>${
			t.tPrize
		}<br>No. of players: ${t.tPlayers.length}`;

		tCont.appendChild(tHead);
		tCont.appendChild(tId);

		tCont.setAttribute('id', t._id);
		tCont.addEventListener('click', () => {
			window.location += 'tournaments/' + t._id;
		});
		//adding the created tournament container to the page
		dataContainer.appendChild(tCont);
	});
}
//request the data on page load
requestData(new URL(window.location).href + 'api/tournaments');
