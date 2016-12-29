who_has_max(Player1No, Player1Points, _Player2No, Player2Points, BestPlayerNo, BestPlayerPoints):-
  Player1Points > Player2Points,
  BestPlayerNo = Player1No,
  BestPlayerPoints = Player1Points.
who_has_max(_Player1No, _Player1Points, Player2No, Player2Points, Player2No, Player2Points).

% Boolean not
negate(0, 1).
negate(_B, 0).

%Checks if a position is equal.
equal_position([X1,Y1], [X2, Y2]):-
  X1 == X2, Y1 == Y2.

not(Execute):-Execute, !, fail.
not(_Execute).

number_to_direction(1, northwest).
number_to_direction(2, northeast).
number_to_direction(3, east).
number_to_direction(4, southeast).
number_to_direction(5, southwest).
number_to_direction(6, west).

direction_to_string(northwest, 'Northwest').
direction_to_string(northeast, 'Northeast').
direction_to_string(east, 'East').
direction_to_string(southeast, 'Southeast').
direction_to_string(southwest, 'Southwest').
direction_to_string(west, 'West').
