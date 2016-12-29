main_menu:-
  draw_main_menu,
  select_main_menu_action;
  main_menu.

select_main_menu_action:-
  read(Action),
  Action > 0,
  Action < 5,
  main_menu_go_to_menu(Action).

main_menu_go_to_menu(1):-
  start_game(2, _).
main_menu_go_to_menu(2):-
  start_game(1, easy).
main_menu_go_to_menu(3):-
  start_game(0, easy).
main_menu_go_to_menu(4).
