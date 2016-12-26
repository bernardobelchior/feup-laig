create_board(Board):-
  Board = [
  [null, null, null, null, null, null, null, null, null, null, null], %0
  [null, null, null, null, system0, system3, greenNebula, system2, null, null, null], %1
  [null, null, null, blueNebula, system2, system1, blackHole, system1, system1, system1, null], %2
  [null, null, null, system2, system3, system0, system2, system2, wormhole, system3, null], %3
  [null, null, system3, wormhole, system1, redNebula, system1, blueNebula, system1, null, null], %4
  [null, null, system0, system2, system3, system0, system0, system1, system2, null, null], %5
  [null, space, redNebula, system3, greenNebula, system0, system1, blackHole, system1, null, null], %6
  [null, system3, blackHole, greenNebula, system3, system2, system1, system1, null, null, null], %7
  [space, system1, system3, redNebula, wormhole, system0, system1, system1, null, null, null], %8
  [space, space, space, system1, blueNebula, system0, system2, null, null, null, null]]. %9

create_players(Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer):-
  Ships = [
  [[3,2], [4,2], [5,1]],
  [[6,8], [7,8], [5,9]]
  ],
  TradeStations = [
  [],
  []
  ],
  Colonies = [
  [],
  []
  ],
  HomeSystems = [
  [[4, 1], [5, 1], [3, 2], [4, 2]],
  [[6, 8], [7, 8], [5, 9], [6, 9]]
  ],
  Wormholes = [
  [8,3],[3,4],[4,8]
  ],
  NumPlayers = 2,
  NumShipsPerPlayer = 3.

initialize(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer):-
  create_board(Board),
  create_players(Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer).


game_over(Board, TradeStations, Colonies, HomeSystems, NumPlayers):-
  game_over(Board, TradeStations, Colonies, HomeSystems, NumPlayers, 0, 0, 0).

game_over(_Board, _TradeStations, _Colonies, _HomeSystems, NumPlayers, BestPlayerNo, BestPlayerPoints, NumPlayers):-
  ActualPlayerNo is BestPlayerNo + 1,
  write('Player '), write(ActualPlayerNo), write(' won with '), write(BestPlayerPoints), write(' points!'), nl.

game_over(Board, TradeStations, Colonies, HomeSystems, NumPlayers, PlayerNo, PlayerPoints, CurrentPlayer):-
  calculate_points(Board, TradeStations, Colonies, HomeSystems, CurrentPlayer, NewPlayerPoints),
  NewPlayerNo is CurrentPlayer + 1,
  who_has_max(PlayerNo, PlayerPoints, CurrentPlayer, NewPlayerPoints, BestPlayerNo, BestPlayerPoints),
  game_over(Board, TradeStations, Colonies, HomeSystems, NumPlayers, BestPlayerNo, BestPlayerPoints, NewPlayerNo).

%%is_move_to_wormhole(+ShipPosition, +Direction, +NumTiles, +Wormholes, -InWormhole)
is_move_to_wormhole(ShipPosition, Direction, Wormholes, InWormhole) :-
    update_position(ShipPosition, Direction, 1, NewPosition),
    list_find(Wormholes, NewPosition, 0, InWormhole).

move_ship_if_valid(Board, Ships, TradeStations, Colonies, Wormholes, PlayerNo, ShipNo, ShipPosition, Direction, NumTiles, NewShips):-
  is_move_valid(Board, Ships, TradeStations, Colonies, Wormholes, ShipPosition, Direction, NumTiles, NumTiles),
  move_ship(Ships, ShipPosition, PlayerNo, ShipNo, Direction, NumTiles, NewShips).

move(Ships, PlayerNo, ShipNo, NewShipPosition, NewShips):-
  list_get_nth(Ships, PlayerNo, PlayerShips),
  list_replace_nth(PlayerShips, ShipNo, NewShipPosition, NewPlayerShips),
  list_replace_nth(Ships, PlayerNo, NewPlayerShips, NewShips).

move_ship(Ships, ShipPosition, PlayerNo, ShipNo, Direction, NumTiles, NewShips):-
  update_position(ShipPosition, Direction, NumTiles, NewShipPosition),
  list_get_nth(Ships, PlayerNo, PlayerShips),
  list_replace_nth(PlayerShips, ShipNo, NewShipPosition, NewPlayerShips),
  list_replace_nth(Ships, PlayerNo, NewPlayerShips, NewShips).

% TotalNumTiles must be bigger than one in order to allow checking for wormholes
is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Position, Direction):-
  is_move_valid(Board, Ships, TradeStations, Colonies, Wormholes, Position, Direction, 1, 2).

%is_move_valid(Board, Position, Direction, NumTiles):-
  %is_move_valid(Board, Position, Direction, NumTiles, NumTiles).
is_move_valid(_Board, _Ships, _TradeStations, _Colonies, _Wormholes, _Position, _Direction, 0, _TotalNumTiles).
is_move_valid(Board, Ships, TradeStations, Colonies, Wormholes, Position, Direction, NumTiles, TotalNumTiles):-
  update_position(Position, Direction, 1, NewPosition),
  get_tile_in_position(Board, NewPosition, Tile), !, % Cut needed in order to prevent backtracking
  is_tile_passable(Tile),
  is_tile_unoccupied(Ships, NewPosition),
  is_tile_unoccupied(TradeStations, NewPosition),
  is_tile_unoccupied(Colonies, NewPosition),
  NewNumTiles is NumTiles - 1,
  is_move_valid(Board, Ships, TradeStations, Colonies, Wormholes, NewPosition, Direction, NewNumTiles, TotalNumTiles).

is_ship_movable(Board, Ships, TradeStations, Colonies, Wormholes, Ship):-
  is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Ship, northwest), !,
  is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Ship, northeast), !,
  is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Ship, east), !,
  is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Ship, southeast), !,
  is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Ship, southwest), !,
  is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Ship, west), !.

are_player_ships_movable(_Board, _Ships, _TradeStations, _Colonies, _Wormholes, []).
are_player_ships_movable(Board, Ships, TradeStations, Colonies, Wormholes, [Ship | OtherShips]):-
  is_ship_movable(Board, Ships, TradeStations, Colonies, Wormholes, Ship);
  are_player_ships_movable(Board, Ships, TradeStations, Colonies, Wormholes, OtherShips).

is_game_over(_Board, [], _TradeStations, _Colonies, _Wormholes).
is_game_over(Board, [PlayerShips | OtherShips], [PlayerTradeStations | OtherTradeStations], [PlayerColonies | OtherColonies], Wormholes):-
  are_player_ships_movable(Board, [PlayerShips | OtherShips], [PlayerTradeStations | OtherTradeStations], [PlayerColonies | OtherColonies], Wormholes, PlayerShips),
  not(player_has_trade_stations(PlayerTradeStations)),
  not(player_has_colonies(PlayerColonies)),
  is_game_over(Board, OtherShips, OtherTradeStations, OtherColonies, Wormholes).

valid_action(colony, Player, _TradeStations, Colonies) :-
    list_get_nth(Colonies, Player, PlayerColonies), !,
    player_has_colonies(PlayerColonies), !.

valid_action(tradeStation, Player, TradeStations, _Colonies) :-
    list_get_nth(TradeStations, Player, PlayerTradeStations), !,
    player_has_trade_stations(PlayerTradeStations), !.

valid_action(_Action, _Player, _TradeStations, _Colonies) :-
    write('Player has no buildings of requested type'), fail.

perform_action(Ships, PlayerNo, ShipNo, tradeStation, TradeStations, Colonies, NewTradeStations, NewColonies):-
    get_piece_position(Ships, PlayerNo, ShipNo, ShipPosition),
    place_trade_station(PlayerNo, ShipPosition, TradeStations, NewTradeStations),
    NewColonies = Colonies.

perform_action(Ships, PlayerNo, ShipNo, colony, TradeStations, Colonies, NewTradeStations, NewColonies):-
    get_piece_position(Ships, PlayerNo, ShipNo, ShipPosition),
    place_colony(PlayerNo, ShipPosition, Colonies, NewColonies),
    NewTradeStations = TradeStations.

place_trade_station(PlayerNo, ShipPosition, TradeStations, NewTradeStations):-
    list_get_nth(TradeStations, PlayerNo, PlayerTradeStations),
    NewShipPosition = [ShipPosition],
    list_append(PlayerTradeStations, NewShipPosition, NewPlayerTradeStations),
    list_replace_nth(TradeStations,PlayerNo, NewPlayerTradeStations, NewTradeStations).

place_colony(PlayerNo,ShipPosition, Colonies, NewColonies) :-
    list_get_nth(Colonies, PlayerNo, PlayerColonies),
    NewShipPosition = [ShipPosition],
    list_append(PlayerColonies, NewShipPosition, NewPlayerColonies),
    list_replace_nth(Colonies,PlayerNo, NewPlayerColonies, NewColonies).

move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, _NumPlayers, _NumShipsPerPlayer, CurrentPlayer, ShipNo, _ShipPosition, _Direction, NewShips, InWormhole):-
    display_wormhole_exits(Wormholes, NumWormholes, InWormhole),
    select_wormhole_exit(NumWormholes, InWormhole, SelectedOutWormhole),
    number_to_wormhole(Wormholes,SelectedOutWormhole, OutWormhole),
    %trace,
    move_ship(Ships, OutWormhole, CurrentPlayer, ShipNo, west, 0, TmpShips),
    %notrace,
    display_ship_direction_info(ShipNo),
    select_ship_direction(TmpDirection),
    move_ship_if_valid(Board, TmpShips, TradeStations, Colonies, Wormholes, CurrentPlayer, ShipNo, OutWormhole, TmpDirection, 1, NewShips).

move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole):-
    move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole).

number_to_wormhole(Wormholes, SelectedOutWormhole, OutWormhole):-
    N is SelectedOutWormhole - 1,
    list_get_nth(Wormholes, N, OutWormhole).
