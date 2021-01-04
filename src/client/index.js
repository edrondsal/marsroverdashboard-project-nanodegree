import './styles/resets.scss'
import './styles/typography.scss'
import './styles/layout.scss'
import './styles/rover-card.scss'
import './styles/rover-detail.scss'
import './styles/header.scss'
import './styles/footer.scss'

const { Map, List } = require('immutable');


/**
 * The Photo Object
 * @typedef {Object} Photo
 * @property {String} img_src - the URL of the photo
 * @property {String} sol - The mars day of the photo
 * @property {String} earth_day - The earth day of the photo
 * @property {String} camera - The id of the camera took the photo
 */

/**
 * The Camera Object
 * @typedef {Object} Camera
 * @property {Number} id - the id in the NASA database
 * @property {String} name - The abbreaviate name of the camera
 * @property {String} full_name - The full name of the camera
 * @property {Number} rover_id - the id of the rover in the NASA database, from where the camera belongs
 */

/**
 * The Rover Object
 * @typedef {Object} Rover
 * @property {Number} id - the id in the NASA database
 * @property {String} name - The name of the rover
 * @property {String} landing_date - The earth date when landed in Mars
 * @property {String} launch_date - The earth date when launched
 * @property {String} status - the status of the mission
 * @property {Number} max_sol - the latest mars day containing photos from this rover
 * @property {String} max_date - the latst earth day containing photos from this rover
 * @property {Number} total_photos - the total photos from this rover since landed
 * @property {Camera[]} cameras - the description array of the cameras present in the rover
 * @property {Photo[]} photos - the photos array for the max_date
 */


 /**
 * The Immutable Store Object
 * @typedef {Object} Store
 * @property {Boolean} roversCharged - boolean to know if the rovers are loaded or not
 * @property {Boolean} loadingError - boolean to know if fetch to server have give errors
 * @property {Rover[]} rovers - The array of Rovers loaded from the server
 */

  /**
 * The object use to update the immutable
 * @typedef {Object} Update
 * @property {Boolean} roversCharged - boolean to know if the rovers are loaded or not
 * @property {Rover[]} rovers - The array of Rovers loaded from the server
 */


/** @type {Store} */
let store = Map({    
    roversCharged: false,
    loadingError: false,
    rovers: List()
});

/**
* @description Function that acts as entry point of the app.
*/
const startApp = () => {
    /** @type {HTMLElement} */
    const root = document.getElementById('root');
    const executeRender = tryRenderRovers(root,store);
    executeRender();
};
/**
* @description Event listener to start the application
*/
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('menu-rovers').addEventListener('click', () =>{
        startApp();
    });
    startApp();
});
/**
* @description Function to update the immutable store with the rovers array
* @param {Store} state - the immutable object with previous value
* @param {Update} update - the object containing the rovers array
* @return {Store} the new updated store
*/
const updateRovers = (state,update) => {
    store = state.merge(update);
    return store;
}
/**
* @description Function to update the immutable store with the photos of a rover
* @param {Store} state - the immutable object with previous value
* @param {Rover} rover - the rover data from the store
* @param {Object} json - the object from the server API with the photos array of the rover
* @return {Store} the new updated store
*/
const updateRoverPhotos = (state,rover,json) => {
    store = state.setIn(['rovers', retrieveIndexRover(store,rover), 'photos'], json.photos);
    return store;
};


/**
* @description Function that return the index of a specifc rover in the rovers array
* @param {Store} store - the immutable object
* @param {Rover} rover - the rover data from the store
* @return {Number} the index in the rovers array for the selected rover
*/
const retrieveIndexRover = (store,rover) => {
    return store.get('rovers').findIndex(item => item.name===rover.name);
}
/**
* @description Function that updates the UI of the Rovers page
* @param {HTMLElement} root - the root element where add the UI
* @param {Store} store - the immutable object
*/
const renderRovers = (root,store) => {
    root.innerHTML = createUiRovers(store);
    const clickListeners = store.get('rovers').map(rover => roverClick(rover.name,root,store));
    const cards = store.get('rovers').map(rover => document.getElementById(`${rover.id}`));
    cards.forEach( (item,index) => {
        item.addEventListener('click',clickListeners[index]);
    });
};
/**
* @description Function that returns the string representation of the Rovers Array UI
* @param {Store} store - the immutable object
* @return {String} the UI in string representation
*/
const createUiRovers = (store) => {
    const sectionStart = `<div class="rovers-section-layout">`;
    const cardsArticles = createRoversCards(store).reduce( (accumulate,current) => accumulate+='\n'+current );
    const sectionEnd = '</div>';
    return sectionStart+cardsArticles+sectionEnd;
};
/**
* @description Function that returns array for the rovers cards
* @param {Store} store - the immutable object
* @return {String[]} the array containing the string representation for each card
*/
const createRoversCards = (store) => {
    return store.get('rovers').map(rover => createRoverCard(rover));
};
/**
* @description Function that return the string representation of a card
* @param {Rover} rover - the rover data from the store
* @return {String} the string card for a rover
*/
const createRoverCard = (rover) => {
    return `<div class="card-container" id="${rover.id}"> 
                <img src="${createRoverImage(rover)}" class="card-image">
                <div class="card-body-container">
                    <h3>${rover.name}</h3>
                    <p>${createRoverStatus(rover)}</p>
                </div>
            </div>`;
}
/**
* @description Function that return the URL of the image
* @param {Rover} rover - the rover data from the store
* @return {String} the string representation of the URL 
*/
const createRoverImage = (rover) => {
    return `images/${rover.name}.jpg`;
};
/**
* @description Function that return the status of the rover
* @param {Rover} rover - the rover data from the store
* @return {String} the string representation of the status
*/
const createRoverStatus = (rover) =>{
    return `The mission is ${rover.status}`;
};

/**
* @description Function that fetch the rovers data from the server and try to render the ui when loaded
* @param {HTMLElement} root - the root element where add the UI
* @param {Store} store - the immutable object
*/
const fetchRovers = (root,store) =>{
    return fetch('/rovers')
    .then(res => res.json())
    .then(json => updateRovers(store,{roversCharged: json.success,rovers: json.rovers}))
    .then(newStore => tryRenderRovers(root,newStore))
    .then(renderer => renderer())
};
/**
* @description Function that try to render the UI or fetch the data
* @param {HTMLElement} root - the root element where add the UI
* @param {Store} store - the immutable object
*/
const tryRenderRovers = (root, store) => {
    return store.get('roversCharged') ? () => renderRovers(root,store) : () => fetchRovers(root,store);
};
/**
* @description Function that returns the click listener for a card
* @param {String} roverName - the name of the rover
* @param {HTMLElement} root - the root element where add the UI
* @param {Store} store - the immutable object
*/
const roverClick = (roverName, root, store) => {
    return () => tryRenderRover(root, store , roverName)();
};
/**
* @description Function that try to render the UI for a Rover or fetch the Rover photos data
* @param {HTMLElement} root - the root element where add the UI
* @param {Store} store - the immutable object
* @param {String} roverName - the name of the rover
*/
const tryRenderRover = (root,store,roverName) => {
    const rover = store.get('rovers').find(rover => rover.name === roverName);
    return rover.photos.length > 0 ? () => renderRover(root,rover) : () => fetchRoverPhotos(root,store,roverName);
};
/**
* @description Function that fetch the rover photos data from the server and try to render the ui when loaded
* @param {HTMLElement} root - the root element where add the UI
* @param {Store} store - the immutable object
* @param {String} roverName - the name of the rover
*/
const fetchRoverPhotos = (root,store,roverName) => {
    const rover = store.get('rovers').find(rover => rover.name === roverName);
    const url = `/rovers/${roverName}/latestphotos?earth_date=${rover.max_date}`;
    return fetch(url)
    .then(res => res.json())
    .then(json => updateRoverPhotos(store,rover,json))
    .then(newStore => tryRenderRover(root,newStore,roverName))
    .then(renderer => renderer())
};
/**
* @description Function that updates the UI of the Rover details page
* @param {HTMLElement} root - the root element where add the UI
* @param {Rover} rover - the rover data from the store
*/
const renderRover = (root,rover) => {
    root.innerHTML = createUiRover(rover);
}
/**
* @description Function that returns the string representation of the Rover UI
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation
*/
const createUiRover = (rover) => {
    return `<div class="rover-container">
                <div class="rover-line-container">
                    ${getRoverName(rover)}
                    ${getRoverStatus(rover)}
                </div>
                <div class="rover-line-container">
                    ${getRoverLaunching(rover)}
                    ${getRoverLanding(rover)}
                </div>
                <div class="rover-line-container">
                    ${getRoverTotalPhotos(rover)}
                </div>
                <div class="rover-line-container">
                    ${getRoverPhoto(rover)}
                </div>
            </div>`;
};
/**
* @description Function that returns the string representation of the photos gallery
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation of the gallery
*/
const getRoverPhoto = (rover) => {
    return rover.photos.map(photo => `<img src="${photo.img_src}" class="rover-photo">`).reduce( (acc,curr) => acc += curr);
};
/**
* @description Function that returns the string representation of the name ui element
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation
*/
const getRoverName = (rover) => {
  return `<p><b class="rover-line-title">Name: </b>${rover.name}</p>`
};
/**
* @description Function that returns the string representation of the status ui element
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation
*/
const getRoverStatus = (rover) => {
    return `<p><b class="rover-line-title">Status: </b>${rover.status}</p>`
};
/**
* @description Function that returns the string representation of the launching date ui element
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation
*/
const getRoverLaunching = (rover) => {
    return `<p><b class="rover-line-title">Launching: </b>${rover.launch_date}</p>`
};
/**
* @description Function that returns the string representation of the landing date ui element
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation
*/
const getRoverLanding = (rover) => {
    return `<p><b class="rover-line-title">Landing: </b>${rover.landing_date}</p>`
};
/**
* @description Function that returns the string representation of the total photos ui element
* @param {Rover} rover - the rover data from the store
* @return {String} the UI in string representation
*/
const getRoverTotalPhotos = (rover) => {
    return `<p><b class="rover-line-title">Total Photos: </b>${rover.total_photos}</p>`
};






