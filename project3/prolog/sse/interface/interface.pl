select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo):-
  display_player_info(CurrentPlayer, NumShipsPerPlayer),
  display_ship_selection_menu(NumShipsPerPlayer),
  select_ship(NumShipsPerPlayer, ShipNo),
  display_ship_direction_info(ShipNo),
  select_ship_direction(Direction),
  get_piece_position(Ships, CurrentPlayer, ShipNo, ShipPosition),
  do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips).

 select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, _ShipNo) :-
  display_board(Board, Ships, TradeStations, Colonies),
  write('Invalid movement. Try again.'), nl,
  select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, _SelectedShipNo).

do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips):-
    is_move_to_wormhole(ShipPosition, Direction, Wormholes, InWormhole),
    move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole).

do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, _NumPlayers, _NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips):-
  display_ship_num_tiles_info,
  select_ship_num_tiles(NumTiles),
  move_ship_if_valid(Board, Ships, TradeStations, Colonies, Wormholes, CurrentPlayer, ShipNo, ShipPosition, Direction, NumTiles, NewShips).


display_ship_num_tiles_info:-
  write('How many tiles would you like to move in the chosen direction?'), nl.

select_ship_num_tiles(NumTiles):-
  read(ReadNumTiles),
  integer(ReadNumTiles),
  ReadNumTiles > 0,
  NumTiles = ReadNumTiles. %check if valid

display_ship_direction_info(ShipNo):-
  NewShipNo is ShipNo + 1,
  write('Ship '), write(NewShipNo),
  write(' can move in the following directions:'), nl,
  write('1 - Northwest'), nl,
  write('2 - Northeast'), nl,
  write('3 - East'), nl,
  write('4 - Southeast'), nl,
  write('5 - Southwest'), nl,
  write('6 - West'), nl,
  write('Please choose one: ').

select_ship_direction(Direction):-
  read(ReadDirection),
  integer(ReadDirection),
  ReadDirection =< 6,
  ReadDirection > 0,
  number_to_direction(ReadDirection, Direction).

display_player_info(PlayerNo, NumShipsPerPlayer):-
  write('It is Player '),
  NewPlayerNo is PlayerNo + 1,
  write(NewPlayerNo),
  write('\'s turn.'), nl,
  write('Select a ship to move, between 1 and '),
  write(NumShipsPerPlayer), write(':'), nl.

select_ship(NumShipsPerPlayer, ShipNo):-
  read(ChosenShip),
  integer(ChosenShip),
  ChosenShip =< NumShipsPerPlayer,
  ChosenShip > 0,
  ShipNo is ChosenShip - 1.

display_ship_selection_menu(NumShipsPerPlayer):-
  display_ship_selection_menu(NumShipsPerPlayer, 0).
display_ship_selection_menu(NumShipsPerPlayer, NumShipsPerPlayer).
display_ship_selection_menu(NumShipsPerPlayer, CurrentShip):-
  CurrentShip < NumShipsPerPlayer,
  NextShip is CurrentShip + 1,
  write(NextShip), write(' - Ship '), write(NextShip), nl,
  display_ship_selection_menu(NumShipsPerPlayer, NextShip).

select_ship_action(Ships, PlayerNo, ShipNo,TradeStations, Colonies,  NewTradeStations, NewColonies) :-
  display_action_info,
  select_action(Action),
  valid_action(Action, PlayerNo, TradeStations, Colonies),!,
  perform_action(Ships, PlayerNo, ShipNo, Action, TradeStations, Colonies, NewTradeStations, NewColonies).

select_ship_action(Ships, PlayerNo, ShipNo, TradeStations, Colonies,  NewTradeStations, NewColonies) :-
  select_ship_action(Ships, PlayerNo, ShipNo, TradeStations, Colonies,  NewTradeStations, NewColonies).

select_action(Action):-
  read(SelectedAction),
  integer(SelectedAction),
  SelectedAction =< 2,
  SelectedAction > 0,
  convert_number_to_action(SelectedAction, Action);
  write('Invalid action. Try again.'), nl,
  fail.

convert_number_to_action(1, tradeStation).
convert_number_to_action(2, colony).

display_action_info:-
  write('Choose action: '),nl,write('1 - Place a trade station.'), nl,write('2 - Place a colony'),nl.


display_wormhole_exits(Wormholes, NumWormholes, _InWormhole) :-
    write('Choose an exit Wormhole: '),nl,
    list_length(Wormholes, NumWormholes),
    N is NumWormholes - 1,
    display_nth_wormhole_exit(N, N).

display_nth_wormhole_exit(-1, _NumWormholes):-!.

display_nth_wormhole_exit(N, NumWormholes) :-
    N1 is NumWormholes - N + 1,
    write(N1), write(' - Wormhole '), write(N1), nl,
    N2 is N-1,
    display_nth_wormhole_exit(N2, NumWormholes).

select_wormhole_exit(NumWormholes, InWormhole, SelectedOutWormhole):-
    read(ReadSelectedOutWormhole), integer(ReadSelectedOutWormhole),
    I1 is InWormhole + 1,
    ReadSelectedOutWormhole > 0,
    ReadSelectedOutWormhole =< NumWormholes,
    SelectedOutWormhole is ReadSelectedOutWormhole,
    SelectedOutWormhole \= I1.

select_wormhole_exit(_NumWormholes, _InWormhole, _SelectedOutWormhole):-
    write('Invalid movement. Try again.'),
    nl, fail.


number_to_direction(1, northwest).
number_to_direction(2, northeast).
number_to_direction(3, east).
number_to_direction(4, southeast).
number_to_direction(5, southwest).
number_to_direction(6, west).
