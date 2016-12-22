:-include('logic/logic.pl').
:-include('logic/logic_utils.pl').
:-include('logic/point_calculation.pl').
:-include('logic/easy_cpu.pl').
:-include('interface/display_board.pl').
:-include('interface/interface.pl').
:-include('general_utils.pl').
:-include('list_utils.pl').

sse:-
  initialize(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer),
  play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer).

play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer):-
  play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, 0).

play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer):-
  CurrentPlayer = 0,
  display_board(Board, Ships, TradeStations, Colonies),
  select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo),
  display_board(Board, NewShips, TradeStations, Colonies),
  select_ship_action(NewShips, CurrentPlayer, ShipNo, TradeStations, Colonies, NewTradeStations, NewColonies),
  check_game_state(Board, NewShips, NewTradeStations, NewColonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer).

play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer):-
  display_board(Board, Ships, TradeStations, Colonies),
  easy_cpu_select_ship_movement(Board, Ships, TradeStations, Colonies, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer, NewShips, ShipNo),
  easy_cpu_select_ship_action(NewShips, CurrentPlayer, ShipNo, TradeStations, Colonies, NewTradeStations, NewColonies),
  display_board(Board, NewShips, NewTradeStations, NewColonies),
  check_game_state(Board, NewShips, NewTradeStations, NewColonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer).

check_game_state(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, CurrentPlayer):-
  is_game_over(Board, Ships, TradeStations, Colonies, Wormholes),
  game_over(Board, TradeStations, Colonies, HomeSystems);
  next_player(NumPlayers, CurrentPlayer, NextPlayer),
  play(Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes, NumPlayers, NumShipsPerPlayer, NextPlayer).
