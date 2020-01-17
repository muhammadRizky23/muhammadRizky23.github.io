var dbPromised = idb.open("football_db", 1, function(upgradeDb) {
  var teamObjectStore = upgradeDb.createObjectStore("team_favorite", {
    keyPath: "id"
  });
  teamObjectStore.createIndex("team_name", "team_name", { unique: false });
});

function saveFavoriteTeam(data) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("team_favorite", "readwrite");
      var store = tx.objectStore("team_favorite");
      console.log("Data fav = ");
      console.log(data);
      dataToCreate = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl.replace(/^http:\/\//i, 'https://'),
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            founded: data.founded,
            clubColors: data.clubColors,
            venue: data.venue,
        }
      store.put(dataToCreate);
      return tx.complete;
    })
    .then(function() {
    	M.toast({
            html: 'Data successfully saved to favorite team'
        });
      console.log("Data successfully saved to favorite team");
     	document.getElementById("iconFav").innerHTML = "star";
    }).catch(function () {
        M.toast({
            html: 'Data failed to save to favorite team'
        });
    });
}

function getAllFavoritTeam() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team_favorite", "readonly");
        var store = tx.objectStore("team_favorite");
        return store.getAll();
      })
      .then(function(data) {
        resolve(data);
      });
  });
}

function getFavTeamDetailById(id) {
	console.log("id dari db.js : " +id) ; 
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team_favorite", "readonly");
        var store = tx.objectStore("team_favorite");
        console.log("tes data : ");
        console.log(store.get(id)) ;
        return store.get(id);
      })
      .then(function(team) {
        resolve(team);
        console.log("dari db.js : ") ; 
        console.log(team) ; 
      });
  });
}

function checkDataFav(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("team_favorite", "readonly");
                var store = tx.objectStore("team_favorite");
                return store.get(id);
            })
            .then(function (data) {
                if (data == undefined) {
                    reject("Not Favorite Team") ;
                } else {
                    resolve("Favorite Team") ;
                }
            });
    });
}

function deleteFavTeam(data) {
    dbPromised.then(function (db) {
        var tx = db.transaction("team_favorite", 'readwrite');
        var store = tx.objectStore("team_favorite");
        store.delete(data);
        return tx.complete;
    }).then(function () {
        console.log('Item deleted');
        document.getElementById("iconFav").innerHTML = "favorite_border";
        M.toast({
            html: 'Data successfully deleted to favorite team!'
        });
     	document.getElementById("iconFav").innerHTML = "star_border";
    }).catch(function () {
        M.toast({
            html: 'Data failed to save to favorite team'
        });
    });
}
