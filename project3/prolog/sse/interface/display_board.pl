display_board(Board, Ships, TradeStations, Colonies):-
    display_board(Board, Ships, TradeStations, Colonies, 0, 0, 0).
display_board([Line], Ships, TradeStations, Colonies, Offset, Y, WormholeNo):-
  display_line(Line, [0, Y], Ships, TradeStations, Colonies, Offset, WormholeNo, _NewWormholeNo),
  display_last_line(Line, [0, Y], Offset).
display_board([Line | Rest], Ships, TradeStations, Colonies, Offset, Y, WormholeNo):-
  display_line(Line, [0, Y], Ships, TradeStations, Colonies, Offset, WormholeNo, NewWormholeNo),
  negate(Offset, NextOffset),
  NextY is Y + 1,
  display_board(Rest, Ships, TradeStations, Colonies, NextOffset, NextY, NewWormholeNo).

display_line([Element | Rest], [X, Y], Ships, TradeStations, Colonies, Offset, WormholeNo, NewWormholeNo):-
  print_offset(Offset),
  print_first_row([Element | Rest]), nl,
  print_offset(Offset),
  print_second_row([Element | Rest]), nl,
  print_offset(Offset),
  print_third_row([Element | Rest]), nl,
  print_offset(Offset),
  print_fourth_row([Element | Rest], [X,Y], Ships, TradeStations, Colonies, WormholeNo, NewWormholeNo), nl.

display_last_line([Element | Rest], _Position, Offset):-
  print_offset(Offset), print_last_line_first_row([Element | Rest]), nl,
  print_offset(Offset), print_last_line_second_row([Element | Rest]), nl.

print_last_line_first_row([]).
print_last_line_first_row([null | Rest]):-
  print_last_line_first_row(Rest).
print_last_line_first_row([space | Rest]):-
  write('        '),
  print_last_line_first_row(Rest).
print_last_line_first_row([_Element | Rest]):-
  write(' '), print_triangle_right_top, print_triangle_left_top,
  print_last_line_first_row(Rest).

print_last_line_second_row([]).
print_last_line_second_row([null | Rest]):-
  print_last_line_second_row(Rest).
print_last_line_second_row([space | Rest]):-
  write('        '),
  print_last_line_second_row(Rest).
print_last_line_second_row([_Element | Rest]):-
  write(' '), print_triangle_right_bottom, print_triangle_left_bottom,
  print_last_line_second_row(Rest).

print_first_row([]).
print_first_row([null | Rest]):-
  print_first_row(Rest).
print_first_row([space | Rest]):-
  write('        '),
  print_first_row(Rest).
print_first_row([_Element | Rest]):-
  print_triangle_top,
  print_first_row(Rest).

% Prints the bottom part of the element in a hexagon
print_second_row([]).
print_second_row([null | Rest]):-
  print_second_row(Rest).
print_second_row([space | Rest]):-
  write('        '),
  print_second_row(Rest).
print_second_row([_Element | Rest]):-
  print_triangle_bottom,
  print_second_row(Rest).

% Prints the top part of the element in a hexagon
print_third_row([Element]):-
  print_element_first_line(Element),
  print_final_hexagon(Element, null).
print_third_row([Element, NextElement | Rest]):-
  print_element_first_line(Element),
  print_final_hexagon(Element, NextElement),
  print_third_row([NextElement | Rest]).

% Prints the bottom part of the element in a hexagon
print_fourth_row([Element], _Position, _Ships, _TradeStations, _Colonies, WormholeNo, WormholeNo):-
  print_final_hexagon(Element, null).
print_fourth_row([Element, NextElement | Rest], [X, Y], Ships, TradeStations, Colonies, WormholeNo, FinalWormholeNo):-
  print_element_second_line(Element, [X,Y], Ships, TradeStations, Colonies, WormholeNo, NewWormholeNo),
  print_final_hexagon(Element, NextElement),
  NextX is X + 1,
  print_fourth_row([NextElement | Rest], [NextX, Y], Ships, TradeStations, Colonies, NewWormholeNo, FinalWormholeNo).

% Prints the offset in order to align hexagons
print_offset(0).
print_offset(1):-
  write('    ').

% Prints the horizontal bar of the last hexagon in a specific line
print_final_hexagon(null, _NextElement).
print_final_hexagon(space, _NextElement).
print_final_hexagon(_Element, null):-
  write('|').
print_final_hexagon(_Element, space):-
  write('|').
print_final_hexagon(_Element, _NextElement).

% Prints the top of the triangle in the hexagon
print_triangle_top:-
  print_triangle_left_top, write(' '),
  print_triangle_right_top.

% Prints the bottom of the triangle in the hexagon
print_triangle_bottom:-
  print_triangle_left_bottom, write(' '),
  print_triangle_right_bottom.

% Prints the left part of the top of the triangle in the hexagon
print_triangle_left_top:-
  write('   /').

% Prints the right part of the top of the triangle in the hexagon
print_triangle_right_top:-
  write('\\  ').

% Prints the left part of the bottom of the triangle in the hexagon
print_triangle_left_bottom:-
  write(' /  ').

% Prints the right part of the bottom of the triangle in the hexagon
print_triangle_right_bottom:-
  write('  \\').

% Prints the first line of an element, which represents the first info line of
% the hexagon
print_element_first_line(null).

print_element_first_line(space):-
  write('        ').

print_element_first_line(wormhole):-
  write('|  Worm ').

print_element_first_line(blackHole):-
  write('| Black ').

print_element_first_line(system0):-
  write('|       ').

print_element_first_line(system1):-
  write('|   *   ').

print_element_first_line(system2):-
  write('|  *  * ').

print_element_first_line(system3):-
  write('| * * * ').

print_element_first_line(blueNebula):-
  write('|~Blue~~').

print_element_first_line(greenNebula):-
  write('|~Green~').

print_element_first_line(redNebula):-
  write('|~~Red~~').


print_element_second_line(null, _Position, _Ships, _TradeStations, _Colonies, WormholeNo, WormholeNo).
print_element_second_line(space, _Position, _Ships, _TradeStations, _Colonies, WormholeNo, WormholeNo):-
  write('        ').

print_element_second_line(wormhole, _Position, _Ships, _TradeStations, _Colonies, WormholeNo, NewWormholeNo):-
  NewWormholeNo is WormholeNo + 1,
  write('| Hole '), write(NewWormholeNo).

print_element_second_line(blackHole, _Position, _Ships, _TradeStations, _Colonies, WormholeNo, WormholeNo):-
  write('| Hole  ').

print_element_second_line(_Element, Position, Ships, TradeStations, Colonies, WormholeNo, WormholeNo):-
  get_player_piece_in_position(Ships, Position, PlayerNo, ShipNo),
  NewPlayerNo is PlayerNo + 1,
  NewShipNo is ShipNo + 1,
  write('| P'),
  write(NewPlayerNo),
  write(' S'),
  write(NewShipNo),
  write(' ');
  get_player_piece_in_position(TradeStations, Position, PlayerNo, TradeStationNo),
  NewPlayerNo is PlayerNo + 1,
  NewTradeStationNo is TradeStationNo + 1,
  write('| P'),
  write(NewPlayerNo),
  write(' T'),
  write(NewTradeStationNo),
  write(' ');
  get_player_piece_in_position(Colonies, Position, PlayerNo, ColonyNo),
  NewPlayerNo is PlayerNo + 1,
  NewColonyNo is ColonyNo + 1,
  write('| P'),
  write(NewPlayerNo),
  write(' C'),
  write(NewColonyNo),
  write(' ');
  write('|       ').

print_changes(TradeStations, NewTradeStations, Colonies, NewColonies) :-
    TradeStations = NewTradeStations,
    Colonies \= NewColonies,
    write('Colony').

print_changes(TradeStations, NewTradeStations, Colonies, NewColonies) :-
    write('Trade Station').
