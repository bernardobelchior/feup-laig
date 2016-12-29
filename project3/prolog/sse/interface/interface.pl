start_game(HumanPlayers, CPUDifficulty):-
  initialize(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer),
  next_play(HumanPlayers, -1, Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CPUDifficulty).

human_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, CPUDifficulty):-
  display_board(Board, Ships, TradeStations, Colonies),
  select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo),
  display_board(Board, NewShips, TradeStations, Colonies),
  select_ship_action(NewShips, CurrentPlayer, ShipNo, TradeStations, Colonies, NewTradeStations, NewColonies),
  check_game_state(Board, NewShips, NewTradeStations, NewColonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, CPUDifficulty).

cpu_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, easy):-
  easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo),
  easy_cpu_select_ship_action(NewShips, CurrentPlayer, ShipNo, TradeStations, Colonies, NewTradeStations, NewColonies), 
  display_board(Board, NewShips, NewTradeStations, NewColonies),
  check_game_state(Board, NewShips, NewTradeStations, NewColonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, easy).

cpu_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, hard):-
  easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo),
  easy_cpu_select_ship_action(NewShips, CurrentPlayer, ShipNo, TradeStations, Colonies, NewTradeStations, NewColonies),
  display_board(Board, NewShips, NewTradeStations, NewColonies),
  check_game_state(Board, NewShips, NewTradeStations, NewColonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, hard).

check_game_state(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, HumanPlayers, CPUDifficulty):-
  is_game_over(Board, Ships, TradeStations, Colonies, Wormholes),
  game_over(Board, TradeStations, Colonies, HomeSystems, NumPlayers);
  next_play(HumanPlayers, CurrentPlayer, Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CPUDifficulty).

next_play(0, CurrentPlayer, Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CPUDifficulty):-
  NextPlayer is mod(CurrentPlayer+1, NumPlayers),
  cpu_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, NextPlayer, 0, CPUDifficulty).
next_play(NumPlayers, CurrentPlayer, Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CPUDifficulty):-
  NextPlayer is mod(CurrentPlayer+1, NumPlayers),
  human_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, NextPlayer, NumPlayers, CPUDifficulty).
next_play(HumanPlayers, CurrentPlayer, Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CPUDifficulty):-
  NextPlayer is mod(CurrentPlayer+1, NumPlayers),
  NextPlayer < NumPlayers - 1,
  human_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, NextPlayer, HumanPlayers, CPUDifficulty);
  cpu_play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, NextPlayer, HumanPlayers, CPUDifficulty).


select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo):-
  display_player_info(CurrentPlayer, NumShipsPerPlayer),
  display_ship_selection_menu(NumShipsPerPlayer),
  select_ship(NumShipsPerPlayer, ShipNo),
  list_valid_moves(Board, Ships, TradeStations, Colonies, Wormholes, CurrentPlayer, ShipNo, ValidDirections),
  display_ship_direction_info(ShipNo, ValidDirections),
  select_ship_direction(Direction, ValidDirections),
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

display_ship_direction_info(ShipNo, ValidDirections):-
  NewShipNo is ShipNo + 1,
  write('Ship '), write(NewShipNo),
  write(' can move in the following directions:'), nl,
  print_possible_directions(ValidDirections),
  write('Please choose one: ').

print_possible_directions([]).
print_possible_directions([Direction | Others]):-
  print_possible_directions(Others),
  number_to_direction(Number, Direction),
  direction_to_string(Direction, String),
  write(Number) , write(' - '), write(String), nl.

select_ship_direction(Direction, ValidDirections):-
  read(ReadDirection),
  integer(ReadDirection),
  ReadDirection =< 6,
  ReadDirection > 0,
  number_to_direction(ReadDirection, Direction),
  list_find(ValidDirections, Direction, 0, _Found).

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
  write('Choose action: '), nl, write('1 - Place a trade station.'), nl, write('2 - Place a colony'), nl.

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
