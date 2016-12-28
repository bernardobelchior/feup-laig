%to be able to use the random function
:- use_module(library(random)).

%basic movement
easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo):-
  easy_cpu_select_ship(NumShipsPerPlayer, ShipNo),
  easy_cpu_select_ship_direction(ReadDirection),
  number_to_direction(ReadDirection,Direction),
  get_piece_position(Ships, CurrentPlayer, ShipNo, ShipPosition),
  easy_cpu_do_appropriate_move(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips).

 easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, _ShipNo) :-
  easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, _SelectedShipNo).

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

move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole):-
    move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, ShipNo, ShipPosition, Direction, NewShips, InWormhole).

easy_cpu_select_ship_action(Ships, PlayerNo, ShipNo,TradeStations, Colonies,  NewTradeStations, NewColonies) :-
  easy_cpu_select_action(ReadAction),
  convert_number_to_action(ReadAction,Action),
  valid_action(Action, PlayerNo, TradeStations, Colonies),!,
  perform_action(Ships, PlayerNo, ShipNo, Action, TradeStations, Colonies, NewTradeStations, NewColonies).

easy_cpu_select_ship_action(Ships, PlayerNo, ShipNo, TradeStations, Colonies,  NewTradeStations, NewColonies) :-
  easy_cpu_select_ship_action(Ships, PlayerNo, ShipNo, TradeStations, Colonies,  NewTradeStations, NewColonies).

%selectors
easy_cpu_select_ship(NumShipsPerPlayer, ShipNo) :-
    N1 is NumShipsPerPlayer + 1,
    random(1, N1,ShipNo).

easy_cpu_select_ship_direction(Direction) :-
    random(1,7,Direction).

easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole) :-
    N1 is NumWormholes,
    random(0,N1,RandomOutWormhole),
    RandomOutWormhole \= InWormhole,
    SelectedOutWormhole is RandomOutWormhole,
    list_get_nth(Wormholes, SelectedOutWormhole, OutWormhole).

easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole) :-
    easy_cpu_select_wormhole_exit(Wormholes,NumWormholes, InWormhole, OutWormhole).

easy_cpu_select_action(Action) :-
    random(1,3,Action).

easy_cpu_select_ship_num_tiles(NumTiles) :-
    random(1,7, NumTiles).
