%to be able to use the random function
:- use_module(library(random)).

%basic movement
easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo):-
  easy_cpu_select_ship(NumShipsPerPlayer, NewShipNo),
  get_piece_position(Ships, CurrentPlayer, NewShipNo, ShipPosition),
  list_valid_moves(Board, Ships, TradeStations, Colonies, Wormholes, ShipPosition, ValidMoves), get_char(_),
  list_length(ValidMoves, ValidMovesLength),
  ValidMovesLength > 0,
  easy_cpu_select_ship_direction(ValidMoves, ValidMovesLength, Direction),
  easy_cpu_do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShipNo, ShipPosition, Direction, NewShips),
  PrintShip is NewShipNo + 1,
  ShipNo is NewShipNo,
  PlayerActualNo is CurrentPlayer + 1,
  nl, write('CPU'), write(PlayerActualNo), write(' moved Ship '), write(PrintShip), write(' '), write(Direction), write(' and').

 easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo):-
  easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo).

easy_cpu_do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips):-
  is_move_to_wormhole(ShipPosition, Direction, Wormholes, InWormhole),
  easy_cpu_move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole).

easy_cpu_do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, _NumPlayers, _NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips):-
  easy_cpu_select_ship_num_tiles(NumTiles),
  move_ship_if_valid(Board, Ships, TradeStations, Colonies, Wormholes, CurrentPlayer, ShipNo, ShipPosition, Direction, NumTiles, NewShips).

%Wormhole movement
easy_cpu_move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, _NumPlayers, _NumShipsPerPlayer, CurrentPlayer, ShipNo, _ShipPosition, _Direction, NewShips, InWormhole):-
  list_length(Wormholes,NumWormholes),
  easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole),
  move_ship(Ships, OutWormhole, CurrentPlayer, ShipNo, west, 0, TmpShips),
  easy_cpu_select_ship_direction(SelectedDirection),
  number_to_direction(SelectedDirection,TmpDirection),
  move_ship_if_valid(Board, TmpShips, TradeStations, Colonies, Wormholes, CurrentPlayer, ShipNo, OutWormhole, TmpDirection, 1, NewShips).

easy_cpu_move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole):-
  easy_cpu_move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole).

easy_cpu_select_ship_action(Ships, PlayerNo, ShipNo,TradeStations, Colonies,  NewTradeStations, NewColonies) :-
  easy_cpu_select_action(ReadAction),
  convert_number_to_action(ReadAction,Action),
  valid_action(Action, PlayerNo, TradeStations, Colonies),!,
  perform_action(Ships, PlayerNo, ShipNo, Action, TradeStations, Colonies, NewTradeStations, NewColonies),
  write(' placed a '), print_changes(TradeStations, NewTradeStations, Colonies, NewColonies), write('.'), nl,
  write('Press any key to continue..'),get_char(_).

easy_cpu_select_ship_action(Ships, PlayerNo, ShipNo, TradeStations, Colonies,  NewTradeStations, NewColonies) :-
  easy_cpu_select_ship_action(Ships, PlayerNo, ShipNo, TradeStations, Colonies,  NewTradeStations, NewColonies).

%selectors
easy_cpu_select_ship(NumShipsPerPlayer, ShipNo) :-
  random(0, NumShipsPerPlayer, ShipNo).

easy_cpu_select_ship_direction(ValidMoves, ValidMovesLength, Direction):- !,
  random(0, ValidMovesLength, DirectionIndex),
  list_get_nth(ValidMoves, DirectionIndex, Direction), !.

easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole) :-
  N1 is NumWormholes,
  random(0,N1,RandomOutWormhole),
  RandomOutWormhole \= InWormhole,
  SelectedOutWormhole is RandomOutWormhole,
  list_get_nth(Wormholes, SelectedOutWormhole, OutWormhole).

easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole) :-
  easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole).

easy_cpu_select_action(Action):-
  random(1,3,Action).

easy_cpu_select_ship_num_tiles(NumTiles) :-
  random(1,2, NumTiles).
