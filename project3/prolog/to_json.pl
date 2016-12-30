/*json([K-V | Rest], Output):-
    key_value_to_json_obj([K-V | Rest], ObjectContent),
    surround(ObjectContent, '{', '}', Output).*/
    %atom_concat('{', ObjectContent, ObjectLeft),
    %atom_concat('}', ObjectLeft, Output).*/

json(List, Output):-
    is_list(List),
    list_to_json(List, Output).

json(Number, Number):-
    number(Number).

json(Element, JSONElem):-
  surround(Element, '"', '"', JSONElem).
  %atom_concat('"', Element, JSONTemp),
  %atom_concat(JSONTemp, '"', JSONElem).


surround(Element, Left, Right, Surrounded):-
  atom_concat(Left, Element, Temp),
  atom_concat(Temp, Right, Surrounded).




matrix_to_json([], []).
matrix_to_json([List | R], [JsonList | Json]):-
  list_to_json(List, JsonList),
  matrix_to_json(R, Json).

list_to_json([], []).
list_to_json([Element | Rest], [JSONElem | JsonRest]):-
  json(Element, JSONElem),
  list_to_json(Rest, JsonRest).

/*key_value_to_json_obj([], []).
key_value_to_json_obj([K-V | Ls], [PropName:PropVal | Os]):-
    surround(K, '"', '"', PropName),
    json(V, PropVal),
    key_value_to_json_obj(Ls, Os).*/
