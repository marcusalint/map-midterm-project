
module.exports = (pool) => {
  const helper = {};

const getAllMaps = function() {
  return pool.query(`SELECT maps.title as map_title, maps.center_lat, maps.center_long, maps.zoom, maps.created_at map_creation, maps.description as map_description, markers.title as marker_title, markers.lat, markers.long, markers.created_at as marker_creation, marker_icons.description as icon_description, markers.image
  FROM maps
  JOIN markers ON maps.id = map_id
  JOIN marker_icons ON icon_id = marker_icons.id
  LIMIT 30;`)

  .then((res) =>{
    return res.rows;
  })
}
helper.getAllMaps = getAllMaps;

const getFavouritesMaps = function(user_id) {
  const query = `SELECT maps.title as map_title, maps.center_lat, maps.center_long, maps.zoom, maps.created_at map_creation, maps.description as map_description, markers.title as marker_title, markers.lat, markers.long, markers.created_at as marker_creation, marker_icons.description as icon_description, markers.image
  FROM fav_user_maps
  JOIN maps on maps.id = fav_user_maps.map_id
  join users on users.id = fav_user_maps.user_id
  join markers on maps.id = markers.map_id
  JOIN marker_icons ON icon_id = marker_icons.id
  WHERE users.id = $1
  LIMIT 30;`

  return pool.query(query, [user_id])
  .then((res) =>{
    return res.rows;
  })

}
helper.getFavouritesMaps = getFavouritesMaps;


const checkUserByEmail = function(email) {
  const query = `SELECT * FROM users
                 WHERE email = $1
                `
  return pool.query(query, [email])
  .then((res) =>{
    return res.rows[0];
  })
}
helper.checkUserByEmail = checkUserByEmail;



const createNewMap = function(data) {
  const user_id = data.user_id;
  const title = data.title;
  const center_lat = data.center_lat;
  const center_long = data.center_long;
  const description = data.description;

  query = `INSERT INTO maps (user_id, title, center_lat, center_long, description) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

  return pool.query(query, [user_id, title, center_lat, center_long, description])
  .then((res) => {
    return res.rows[0];
  })
}
helper.createNewMap = createNewMap;


const deleteMap = function(map_id) {
  query = `DELETE FROM maps WHERE map_id = $1`;

  return pool.query(query, [map_id])
}
helper.deleteMap = deleteMap;


const getMapByID = function(map_id) {
  query = `SELECT * FROM maps
           WHERE map_id = $1 `

  return pool.query(query, [map_id])
  .then((res) => {
    return res.rows[0];
  })
}
helper.getMapByID = getMapByID;


const addMarker = function(data) {
  const map_id = data.map_id;
  const user_id = data.user_id;
  const title = data.title;
  const lat = data.lat;
  const long = data.long;
  const description = data.description;

  query = `INSERT INTO markers (map_id, user_id,title, lat, long, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;

  return pool.query(query, [map_id, user_id, title, lat, long, description])
  .then((res) => {
    return res.rows[0];
  })
}
helper.addMarker = addMarker;



const deleteMarker = function(marker_id) {
  query = `DELETE FROM markers WHERE map_id = $1`;

  return pool.query(query, [marker_id])
}
helper.deleteMarker = deleteMarker;


const markFavourite = function(map_id, user_id) {
  query = `INSERT INTO fav_user_maps (map_id, user_id) VALUES ($1, $2);`;

  return pool.query(query, [map_id, user_id])
  .then((res) => {
    return res.rows[0];
  })
}
helper.markFavourite = markFavourite;

const unmarkFavourite = function(map_id, user_id) {
  query = `DELETE FROM fav_user_maps (map_id, user_id) VALUES ($1, $2);`;

  return pool.query(query, [map_id, user_id])
  .then((res) => {
    return res.rows[0];
  })
}
helper.unmarkFavourite = unmarkFavourite;

return helper;
}