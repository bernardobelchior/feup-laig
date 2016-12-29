%checks if a position has a colony or a trade Station or a home system
position_has_piece_of_any_type(Position, TradeStations, Colonies, HomeSystems):-
    position_has_piece_of_type(TradeStations, Position);
    position_has_piece_of_type(Colonies, Position);
    position_has_piece_of_type(HomeSystems, Position).

position_has_piece_of_type([], _Position):- fail.
position_has_piece_of_type([PlayerPieces | OtherPieces], Position):-
  position_has_piece(PlayerPieces, Position);
  position_has_piece_of_type(OtherPieces, Position).

get_piece_position(PieceList, PlayerNo, PieceNo, PiecePosition):- !,
  list_get_xy(PieceList, PieceNo, PlayerNo, PiecePosition), !.

%used on the end of a turn to get the next player
next_player(NumPlayers, CurrentPlayer, NextPlayer):-
  NextPlayerTmp is CurrentPlayer + 1,
  NextPlayerTmp < NumPlayers,
  NextPlayer = NextPlayerTmp;
  NextPlayer = 0.

%Gets the player and piece in the specified position
get_player_piece_in_position([PlayerPieces | OtherPlayersPieces], Position, PlayerNo, PieceNo):-
  get_piece_number_in_position(PlayerPieces, Position, PieceNo),
  PlayerNo = 0;
  get_player_piece_in_position(OtherPlayersPieces, Position, NextPlayerNo, PieceNo),
  PlayerNo is NextPlayerNo + 1.

%Gets the piece in the specified position
get_piece_number_in_position([FirstPiecePosition | OtherPieces], Position, PieceNo):-
  equal_position(Position, FirstPiecePosition),
  PieceNo = 0;
  get_piece_number_in_position(OtherPieces, Position, NextPieceNo),
  PieceNo is NextPieceNo + 1.

get_tile_in_position(Board, [X , Y], Tile):-
  list_get_xy(Board, X, Y, Tile).

%fails if the element on a hexagon cannot be traversed by a ship
is_tile_passable(system0, _, _, _, _, _, _).
is_tile_passable(system1, _, _, _, _, _, _).
is_tile_passable(system2, _, _, _, _, _, _).
is_tile_passable(system3, _, _, _, _, _, _).
is_tile_passable(greenNebula, _, _, _, _, _, _).
is_tile_passable(redNebula, _, _, _, _, _, _).
is_tile_passable(blueNebula, _, _, _, _, _, _).
is_tile_passable(wormhole, Board, Ships, TradeStations, Colonies, Wormholes, WormholePosition):-
  list_find(Wormholes, WormholePosition, 0, WormholeNo),
  can_move_through_wormhole(Board, Ships, TradeStations, Colonies, Wormholes, WormholeNo).

is_tile_unoccupied([], _Position).
is_tile_unoccupied([PlayerPieces | OtherPlayersPieces], Position):-
  position_has_piece(PlayerPieces, Position), !, fail;
  is_tile_unoccupied(OtherPlayersPieces, Position).

position_has_piece([], _Position):- fail.
position_has_piece([Piece | OtherPieces], Position):-
  equal_position(Piece, Position);
  position_has_piece(OtherPieces, Position).

/*Direction
* Northwest - x   y--
* Northeast - x++ y--
* East -      x++ y
* Southeast - x   y++
* Southwest - x-- y++
* West -      x-- y
*/
update_position([X,Y], northwest, NumTiles, NewPosition):-
  NewY is Y - NumTiles,
  NewPosition = [X, NewY].
update_position([X,Y], northeast, NumTiles, NewPosition):-
  NewX is X + NumTiles,
  NewY is Y - NumTiles,
  NewPosition = [NewX, NewY].
update_position([X,Y], east, NumTiles, NewPosition):-
  NewX is X + NumTiles,
  NewPosition = [NewX, Y].
update_position([X,Y], southeast, NumTiles, NewPosition):-
  NewY is Y + NumTiles,
  NewPosition = [X, NewY].
update_position([X,Y], southwest, NumTiles, NewPosition):-
  NewX is X - NumTiles,
  NewY is Y + NumTiles,
  NewPosition = [NewX, NewY].
update_position([X,Y], west, NumTiles, NewPosition):-
  NewX is X - NumTiles,
  NewPosition = [NewX, Y].

%checks if the player has used the maximum number of trade stations
player_has_trade_stations(PlayerTradeStations) :-
  list_length(PlayerTradeStations, NumTradeStations),
  NumTradeStations < 4.

%checks if the player has used the maximum number of colonies
player_has_colonies(PlayerColonies) :-
  list_length(PlayerColonies, NumColonies),
  NumColonies < 16.

append_if_direction_is_valid(_Board, _Ships, _TradeStations, _Colonies, _Wormholes, _Position, [], []).
append_if_direction_is_valid(Board, Ships, TradeStations, Colonies, Wormholes, Position, [Direction | Others], ValidMoves):-
  append_if_direction_is_valid(Board, Ships, TradeStations, Colonies, Wormholes, Position, Others, NewValidMoves),
  list_append_if_true(NewValidMoves, is_direction_valid(Board, Ships, TradeStations, Colonies, Wormholes, Position, Direction), [Direction], ValidMoves).
