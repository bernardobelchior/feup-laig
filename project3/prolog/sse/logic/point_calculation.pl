calculate_points(Board, TradeStations, Colonies, HomeSystems, PlayerNo, NewPlayerPoints):-
  list_get_nth(TradeStations, PlayerNo, PlayerTradeStations),
  list_get_nth(Colonies, PlayerNo, PlayerColonies),
  calculate_control_points(Board, PlayerTradeStations, TradeStationsControlPoints, TSGreenNebulasControlled, TSBlueNebulasControlled, TSRedNebulasControlled),
  calculate_control_points(Board, PlayerColonies, ColoniesControlPoints, CGreenNebulasControlled, CBlueNebulasControlled, CRedNebulasControlled),
  list_delete_nth(TradeStations, PlayerNo, OtherTradeStations),
  list_delete_nth(Colonies, PlayerNo, OtherColonies),
  list_delete_nth(HomeSystems, PlayerNo, OtherHomeSystems),
  calculate_adjacency_points(PlayerTradeStations, OtherTradeStations, OtherColonies, OtherHomeSystems, AdjacencyPoints),
  GreenNebulasControlled is TSGreenNebulasControlled + CGreenNebulasControlled,
  BlueNebulasControlled is TSBlueNebulasControlled + CBlueNebulasControlled,
  RedNebulasControlled is TSRedNebulasControlled + CRedNebulasControlled,
  get_points_from_nebulas(Board, GreenNebulasControlled, GreenNebulaPoints),
  get_points_from_nebulas(Board, BlueNebulasControlled, BlueNebulaPoints),
  get_points_from_nebulas(Board, RedNebulasControlled, RedNebulaPoints),
  NewPlayerPoints is TradeStationsControlPoints + ColoniesControlPoints + AdjacencyPoints + GreenNebulaPoints + BlueNebulaPoints + RedNebulaPoints.

calculate_adjacency_points([], _OtherTradeStations, _OtherColonies, _OtherHomeSystems, 0).

calculate_adjacency_points([TradeStation | Rest], OtherTradeStations, OtherColonies, OtherHomeSystems, AdjacencyPoints):-
  calculate_adjacency_points_for_station(TradeStation, west, OtherTradeStations, OtherColonies, OtherHomeSystems, WPoints),
  calculate_adjacency_points_for_station(TradeStation, northwest, OtherTradeStations, OtherColonies, OtherHomeSystems, NWPoints),
  calculate_adjacency_points_for_station(TradeStation, northeast, OtherTradeStations, OtherColonies, OtherHomeSystems, NEPoints),
  calculate_adjacency_points_for_station(TradeStation, east, OtherTradeStations, OtherColonies, OtherHomeSystems, EPoints),
  calculate_adjacency_points_for_station(TradeStation, southeast, OtherTradeStations, OtherColonies, OtherHomeSystems, SEPoints),
  calculate_adjacency_points_for_station(TradeStation, southwest, OtherTradeStations, OtherColonies, OtherHomeSystems, SWPoints),
  calculate_adjacency_points(Rest, OtherTradeStations, OtherColonies, OtherHomeSystems, NextTSAdjacencyPoints),
  AdjacencyPoints is NextTSAdjacencyPoints + WPoints + NWPoints + NEPoints + EPoints + SEPoints + SWPoints.

calculate_adjacency_points_for_station(TradeStation, Direction, OtherTradeStations, OtherColonies, OtherHomeSystems, DirectionPoints):-
  update_position(TradeStation, Direction, 1, Position),
  position_has_piece_of_any_type(Position, OtherTradeStations, OtherColonies, OtherHomeSystems),
  DirectionPoints = 1.
calculate_adjacency_points_for_station(_TradeStation, _Direction, _OtherTradeStations, _OtherColonies, _OtherHomeSystems, 0).

calculate_control_points(_Board, [], 0, 0, 0, 0).
calculate_control_points(Board, [[X, Y] | OtherPieces], ControlPoints, GreenNebulasControlled, BlueNebulasControlled, RedNebulasControlled):-
  list_get_xy(Board, X, Y, Tile),
  get_points_from_tile(Tile, Points, NewGreenNebulasControlled, NewBlueNebulasControlled, NewRedNebulasControlled),
  calculate_control_points(Board, OtherPieces, NewControlPoints, TmpGreenNebulasControlled, TmpBlueNebulasControlled, TmpRedNebulasControlled),
  GreenNebulasControlled is NewGreenNebulasControlled + TmpGreenNebulasControlled,
  BlueNebulasControlled is NewBlueNebulasControlled + TmpBlueNebulasControlled,
  RedNebulasControlled is NewRedNebulasControlled + TmpRedNebulasControlled,
  ControlPoints is NewControlPoints + Points.

get_points_from_tile(null, 0, 0, 0, 0).
get_points_from_tile(space, 0, 0, 0, 0).
get_points_from_tile(wormhole, 0, 0, 0, 0).
get_points_from_tile(blackHole, 0, 0, 0, 0).
get_points_from_tile(system0, 0, 0, 0, 0).
get_points_from_tile(system1, 1, 0, 0, 0).
get_points_from_tile(system2, 2, 0, 0, 0).
get_points_from_tile(system3, 3, 0, 0, 0).
get_points_from_tile(greenNebula, 0, 1, 0, 0).
get_points_from_tile(blueNebula, 0, 0, 1, 0).
get_points_from_tile(redNebula, 0, 0, 0, 1).

get_points_from_nebulas(_Board, 0, 0).
get_points_from_nebulas(_Board, 1, 2).
get_points_from_nebulas(_Board, 2, 5).
get_points_from_nebulas(_Board, _C, 8). %FIXME: Check for all nebulas
