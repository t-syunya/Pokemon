import responder
import json, time
from db_create import (Pokemon, session, Item)

api = responder.API()

katakana_list = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン"
hiragana_list = "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろわをん"
hira2kata = str.maketrans(hiragana_list, katakana_list)
kata2hira = str.maketrans(katakana_list, hiragana_list)


@api.route('/')
def index(req, resp):
    resp.content = api.template('index.html')


@api.route('/start')
async def start(req, resp):
    data = await req.media()
    category = data.get('category')
    if category == 'single':
        resp.content = api.template('single.html')
    elif category == 'double':
        resp.content = api.template('double.html')
    else:
        resp.content = api.template('index.html')


@api.route('/single')
async def single(req, resp):
    data = await req.media()
    print("data:")
    print(data)
    resp.content = api.template('index.html')


@api.route('/double')
async def double(req, resp):
    data = await req.media()


@api.route("/pokemon/name/search")
async def pokemon_name_search(req, resp):
    pokemons = session().query(Pokemon).filter(
        Pokemon.name.like("{}%".format(req.params["value"].translate(hira2kata)))).all()
    pokemon_names = [pokemon.name for pokemon in pokemons]
    pokemon_names.sort()
    resp.media = {"names": pokemon_names}


@api.route("/item/name/search")
async def item_name_search(req, resp):
    items = session().query(Item).filter(
        Item.hiragana.like("{}%".format(req.params["value"].translate(kata2hira)))).all()
    item_names = [item.name for item in items]
    item_names.sort()
    resp.media = {"items": item_names}


@api.route("/pokemon/stats/search")
async def pokemon_stats_search(req, resp):
    pokemon = session().query(Pokemon).filter(
        Pokemon.name == req.params["value"]).first()
    # "id", "No", "name", "types", "abilities", "moves", "hp", "attack", "defence", "sp_attack", "sp_defence", "speed"
    resp.media = json.dumps(pokemon.json, ensure_ascii=False)
    print(pokemon.json)
