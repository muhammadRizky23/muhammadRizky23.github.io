const base_url = "https://api.football-data.org/v2/";
const api_token = 'c5698641e2eb4f4abd0f9acc43c00601';
const kode_liga = 2021 ;
const endpoint_klasemen = `${base_url}competitions/${kode_liga}/standings?standingType=TOTAL`;
const endpoint_team = `${base_url}teams/`;
const endpoint_match = `${base_url}competitions/${kode_liga}/matches?status=SCHEDULED` ; 
const endpoint_detail_match = `${base_url}matches/` ; 

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_token
    }
  });
}


// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {

  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getLeagueKlasemen() {
  if ("caches" in window) {
    caches.match(endpoint_klasemen).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          showDataKlasemen(data);
          console.dir("getKlasemenLiga " + data);
        });
      }
    });
  }

  fetchApi(endpoint_klasemen)
    .then(status)
    .then(json)
    .then(function(data) { 
      console.log(data);
      showDataKlasemen(data) ; 
    });
}


function getDetailTeamById() {
  return new Promise(function (resolve, reject) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(endpoint_team + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            showDataDetailTeamByID(data) ; 
            resolve(data);
          });
        }
      });
    }

    fetchApi(endpoint_team + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        console.dir( data);
        showDataDetailTeamByID(data) ; 
        resolve(data);
      })
      .catch(error);
  });
}

function showDataDetailTeamByID(data){

  crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
  console.log("Tes data crestUrl :  " + crestUrl) ; 
  var teamHTML = `
                    <div class="row">
                      <div class="card col m4 s12 l4 small center-align">     
                          <img  src="${crestUrl}" class="responsive-img" width="200px">
                      </div>
                      <div class="col m1 s12 l1"></div>
                      <div class="card col m6 s12 l6 small ">
                          <h5 >${data.name}</h5>
                            <table class="responsive-table striped">
                                <tr>
                                  <td>Address</td>
                                  <td>:</td>
                                  <td id="address">${data.address}</td>
                                </tr>
                                <tr>
                                  <td>Phone</td>
                                  <td>:</td>
                                  <td id="phone">${data.phone}</td>
                                </tr>
                                <tr>
                                  <td>Website</td>
                                  <td>:</td>
                                  <td id="website">${data.website}</td>
                                </tr>
                                <tr>
                                  <td>Email :</td>
                                  <td>:</td>
                                  <td id="email">${data.email}</td>
                                </tr>
                                <tr>
                                  <td>Venue :</td>
                                  <td>:</td>
                                  <td id="venue">${data.venue}</td>
                                </tr>
                            </table>  
                      </div>

                    </div>
              `;

            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;
}

function showDataKlasemen(data) {

    var dataTabelKlasemen = ""; 
    data.standings.forEach(function (klasemen) {
    //console.log("cek panjang klasemen table: " + klasemen.table.length)

    klasemen.table.forEach(function (club) {
      crestUrl = club.team.crestUrl.replace(/^http:\/\//i, 'https://');
      console.log("Tes data crestUrl :  " + crestUrl) ; 
      dataTabelKlasemen += `<tr>
        <td class="center-align">${club.position}</td>
        <td>
        <a href="./detailteam.html?id=${club.team.id}">
        <p class="hide-on-small-only">
        <img class = "show-on-medium-and-up show-on-medium-and-down" src=${crestUrl}  alt="logo club" style="float:left;width:22px;height:22px;margin-right:20px">
        ${club.team.name}
        </p>
        <p class="hide-on-med-and-up">
        <img src=${club.team.crestUrl}  alt="logo club" style="float:left;width:22px;height:22px;margin-right:20px">
        </p>

        </a>
        </td>
        <td class="center-align">${club.playedGames}</td>
        <td class="center-align">${club.won}</td>
        <td class="center-align">${club.draw}</td>
        <td class="center-align">${club.lost}</td>
        <td class="center-align">${club.goalsFor}</td>
        <td class="center-align">${club.goalsAgainst}</td>
        <td class="center-align">${club.goalDifference}</td>
        <td class="center-align">${club.points}</td>
      </tr>` ; 

    });

  });

    document.getElementById("preloader-football").innerHTML = "";
    document.getElementById("tabelKlasemen").innerHTML = dataTabelKlasemen;



}

function getFavoriteTeamDB() {
  getAllFavoritTeam().then(function(teams) {

    console.log("data get all :") ;
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";
    teams.forEach(function(team) {
      teamsHTML += `
                  <div class="card ">
                    <div class="card-content">
                    <span>
                      <a href="./detailteam.html?id=${team.id}">${team.name}</a>
                     
                     </span> 
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("favorite_team").innerHTML = teamsHTML;
  });
}

function getFavoriteTeamById(){
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = Number(urlParams.get("id"));
    console.log("id team fav detail : " + idParam)
    getFavTeamDetailById(idParam).then(function(team) {
      console.log("tes data crestUrl fav : " + team.crestUrl) ; 
      var teamHTML = `
      <div class="row">
                      <div class="card col m4 s12 l4 small center-align">     
                          <img  src="${team.crestUrl}" class="responsive-img" width="200px">
                      </div>
                      <div class="col m1 s12 l1"></div>
                      <div class="card col m6 s12 l6 small ">
                          <h5 >${team.name}</h5>
                            <table class="responsive-table striped">
                                <tr>
                                  <td>Address</td>
                                  <td>:</td>
                                  <td id="address">${team.address}</td>
                                </tr>
                                <tr>
                                  <td>Phone</td>
                                  <td>:</td>
                                  <td id="phone">${team.phone}</td>
                                </tr>
                                <tr>
                                  <td>Website</td>
                                  <td>:</td>
                                  <td id="website">${team.website}</td>
                                </tr>
                                <tr>
                                  <td>Email :</td>
                                  <td>:</td>
                                  <td id="email">${team.email}</td>
                                </tr>
                                <tr>
                                  <td>Venue :</td>
                                  <td>:</td>
                                  <td id="venue">${team.venue}</td>
                                </tr>
                            </table>  
                      </div>
                    </div>
              `;
      // Sisipkan komponen card ke dalam elemen dengan id #content

      document.getElementById("body-content").innerHTML = teamHTML;
    });
}

function getMatch(){
  return new Promise(function (resolve, reject) {
    if ('caches' in window) {
      caches.match(endpoint_match).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            showDataMatch(data);
            // resolve(data);
          });
        }
      });
    }

    fetchApi(endpoint_match)
      .then(status)
      .then(json)
      .then(function (data) {
        showDataMatch(data);
        // resolve(data);
      })
      .catch(error);
  });
}

function showDataMatch(data) {

  // data = JSON.parse(JSON.stringify(data).replace(/^http:\/\//i, 'https://'));
  console.log("dari match :" ); 
  console.log(data) ; 
  var dataMatches = ""; 
  var match = data.matches;
  for(var i = 0 ; i <= 10 ; i++){
    var newDate = createFormatDate(new Date(match[i].utcDate)) ; 


    
      dataMatches += `

      <div class="card center-align " style="padding:10px;">
        <h6>${newDate}</h6>
        <div class="row center-align" >
            <div class="col s5 truncate ">
              <h5>${match[i].homeTeam.name}</h5>
            </div>
            <div class="col s2 "><h6>VS</h6></div>
            <div class="col s5 truncate ">
               <h5>${match[i].awayTeam.name}</h5>
            </div>
        </div>
    </div>` ; 
  }

    document.getElementById("preloader-football").innerHTML = "";
    document.getElementById("matches").innerHTML = dataMatches;


}

function createFormatDate(date){
    const month = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] ; 

    return `${day[date.getDay()]}, ${date.getDate()}-${month[date.getMonth()]}-${date.getFullYear()}` ; 

}