/**
 * Sends a request to prolog server
 * @param requestString Request string
 * @param context Context to pass to callback.
 * @param onSuccess On success callback.
 * @param onError On error callback.
 * @param port Port to connect.
 */
function getPrologRequest(requestString, context, onSuccess, onError, port) {
    let requestPort = port || 8081;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = function (data) {
        onSuccess(context, data);
    };

    request.onerror = onError;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

/**
 * Moves the ship related to the this.selected variable.
 * @param context Context to pass to callback
 * @param ships Ships matrix
 * @param playerNo Player number
 * @param shipNo Ship number
 * @param newPosition Ship position
 * @param callback Callback.
 */
function moveShip(context, ships, playerNo, shipNo, newPosition, callback) {
    let requestString = 'move('
        + JSON.stringify(ships) + ','
        + playerNo + ','
        + shipNo + ','
        + JSON.stringify(newPosition) + ')';

    getPrologRequest(requestString, context, callback);
}

/**
 * Places the trade station in the last selected ship position.
 */
function placeTradeStation(context, tradeStations, playerNo, shipNo, callback) {
    let shipPosition = this.ships[this.selected.playerNo][this.selected.shipNo];

    let requestString = 'place_trade_station('
        + playerNo + ','
        + JSON.stringify(shipPosition) + ','
        + JSON.stringify(tradeStations) + ')';

    getPrologRequest(requestString, context, callback);
}

/**
 * Places the colony in the last selected ship position.
 */
function placeColony(context, colonies, playerNo, shipNo, callback) {
    let shipPosition = this.ships[this.selected.playerNo][this.selected.shipNo];

    let requestString = 'place_colony('
        + playerNo + ','
        + JSON.stringify(shipPosition) + ','
        + JSON.stringify(colonies) + ')';

    getPrologRequest(requestString, context, callback);
}
