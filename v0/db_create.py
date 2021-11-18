from sqlalchemy import Integer, Column, String, ForeignKey, Table
from sqlalchemy.orm import relation, scoped_session
from sqlalchemy.orm.session import sessionmaker
import sqlalchemy.ext.declarative
import os

Base = sqlalchemy.ext.declarative.declarative_base()
filename = "pokemon_data.db"
url = "sqlite:///" + filename

type_relation = Table("type_relation", Base.metadata,
                      Column("poke_id", Integer, ForeignKey("pokemon.id")),
                      Column("type_id", Integer, ForeignKey("type.id")),
                      )
move_relation = Table("move_relation", Base.metadata,
                      Column("poke_id", Integer, ForeignKey("pokemon.id")),
                      Column("move_id", Integer, ForeignKey("move.id")),
                      )
ability_relation = Table("ability_relation", Base.metadata,
                         Column("poke_id", Integer, ForeignKey("pokemon.id")),
                         Column("ability_id", Integer, ForeignKey("ability.id")),
                         )


class PokeType(Base):
    __tablename__ = "type"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)

    def __repr__(self):
        return f"<PokeType: {self.name}, pokemon_count: {len(list(self.pokemons))}>"


class PokeMove(Base):
    __tablename__ = "move"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    type = Column(String)
    classification = Column(String)
    power = Column(Integer)
    accuracy = Column(Integer)
    pp = Column(Integer)
    hiragana = Column(String, index=True)

    def __repr__(self):
        return f"<PokeMove: {self.name}, acc: {self.accuracy}, power: {self.power}, pokemon_count: {len(list(self.pokemons))}>"


class PokeAbility(Base):
    __tablename__ = "ability"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    desc = Column(String)

    def __repr__(self):
        return f"<PokeAbility: {self.name}, desc: {self.desc[:20]} pokemon_count: {len(list(self.pokemons))}>"


# 全国No.,名前,タイプ1,タイプ2,特性1,特性2,夢特性,HP,攻撃,防御,特攻,特防,素早さ,合計種族値,,
class Pokemon(Base):
    __tablename__ = "pokemon"
    id = Column(Integer, primary_key=True)
    No = Column(Integer)
    name = Column(String, index=True)
    type = relation(PokeType, secondary=type_relation,
                    secondaryjoin=(type_relation.c.type_id == PokeType.id), primaryjoin=(type_relation.c.poke_id == id),
                    backref="pokemons", uselist=True, lazy="dynamic")
    ability = relation(PokeAbility, secondary=ability_relation,
                       secondaryjoin=(ability_relation.c.ability_id == PokeAbility.id),
                       primaryjoin=(ability_relation.c.poke_id == id), backref="pokemons", uselist=True, lazy="dynamic")
    move = relation(PokeMove, secondary=move_relation,
                    secondaryjoin=(move_relation.c.move_id == PokeMove.id), primaryjoin=(move_relation.c.poke_id == id),
                    backref="pokemons", uselist=True, lazy="dynamic")

    hp = Column(Integer, index=True)
    attack = Column(Integer, index=True)
    defence = Column(Integer, index=True)
    sp_attack = Column(Integer, index=True)
    sp_defence = Column(Integer, index=True)
    speed = Column(Integer, index=True)
    total = Column(Integer, index=True)
    types = ""
    abilities = ""
    moves = ""

    def __repr__(self):
        return f"<Pokemon: {self.name}, No: {self.No}, type: {'/'.join(map(lambda x: x.name, self.type))}, ability: {'/'.join(map(lambda x: x.name, self.ability))}," \
               f" HP: {self.hp}, ATK: {self.attack}, DF: {self.defence}, SpATK: {self.sp_attack}, SpDF: {self.sp_defence}, SP: {self.speed}, TO: {self.total}," \
               f" move_count: {len(list(self.move))}>"

    @property
    def json(self):
        attr = ["id", "No", "name", "types", "abilities", "moves", "hp", "attack", "defence", "sp_attack", "sp_defence",
                "speed"]
        self.types = ','.join(map(lambda x: x.name, self.type))
        self.abilities = ','.join(map(lambda x: x.name, self.ability))
        self.moves = ','.join(map(lambda x: x.name, self.move))
        return {key: self.__getattribute__(key) for key in attr}


class Item(Base):
    __tablename__ = "item"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    desc = Column(String)
    hiragana = Column(String, index=True)

    def __repr__(self):
        return f"<Item: {self.name}, desc: {self.desc[:20]} hiragana: {self.hiragana}>"


# pokemon_data.dbを新しく作り直す
if __name__ == '__main__':
    if os.path.exists(filename):
        os.remove(filename)

engine = sqlalchemy.create_engine(url, echo=False, connect_args={"check_same_thread": False})
Base.metadata.create_all(engine)
SessionMaker = sessionmaker(bind=engine)
session = scoped_session(SessionMaker)


def main():
    katakana_list = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン"
    hiragana_list = "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろわをん"
    kata2hira = str.maketrans(katakana_list, hiragana_list)
    # 技一覧を取得
    move_list = []
    with open("move.csv", "r") as f:
        for lines in f.read().splitlines():
            line = lines.split(",")
            for i in range(0, len(line) // 6):
                move_list.append(line[6 * i:6 * i + 6])
    # 特性一覧を取得
    ability_list = []
    with open("ability.csv", "r") as f:
        lines = f.read()
        line = lines.split(",")
        for i in range(0, len(line) // 2):
            ability_list.append(line[2 * i:2 * i + 2])

    with open("pokedex.csv", "r") as f:
        for i, line in enumerate(f.read().splitlines()[1:], 1):
            try:
                print(i)
                id_, name, type1, type2, ability1, ability2, ability3, hp, pow, def_, sp, sd, spe, sum_, *mov = line.split(
                    ",")
                mov = list(filter(bool, mov))
                poke = Pokemon()
                poke.name = name
                poke.No, poke.hp, poke.attack, poke.defence, poke.sp_attack, poke.sp_defence, poke.speed, poke.total = map(
                    int, (
                        id_, hp, pow, def_, sp, sd, spe, sum_))
                #
                # id = Column(Integer)
                # name = Column(String, primary_key=True)
                # type_ = relation(PokeType, backref="pokemons", uselist=True, lazy="dynamic")
                # ability = relation(PokeAbility, backref="pokemons", uselist=True, lazy="dynamic")
                # move = relation(PokeMove, backref="pokemons", uselist=True, lazy="dynamic")
                for type_ in (type1, type2):
                    if not session.query(PokeType).filter(PokeType.name == type_).first():
                        new_type = PokeType()
                        new_type.name = type_
                        session.add(new_type)
                        poke.type.append(new_type)
                    else:
                        poke.type.append(session.query(PokeType).filter(PokeType.name == type_).first())
                for move in mov:
                    if not session.query(PokeMove).filter(PokeMove.name == move).first():
                        new_move = PokeMove()
                        new_move.name = move
                        for m in move_list:
                            if move in m[0]:
                                new_move.type = m[1]
                                new_move.classification = m[2]
                                new_move.power = m[3]
                                new_move.accuracy = m[4]
                                new_move.pp = m[5]
                                new_move.hiragana = move.translate(kata2hira)
                                break
                        session.add(new_move)
                        poke.move.append(new_move)
                    else:
                        poke.move.append(session.query(PokeMove).filter(PokeMove.name == move).first())
                for ab in (ability1, ability2, ability3):
                    if not session.query(PokeAbility).filter(PokeAbility.name == ab).first():
                        new_ab = PokeAbility()
                        new_ab.name = ab
                        for a in ability_list:
                            if a[0] in ab:
                                new_ab.desc = a[1]
                                break
                        session.add(new_ab)
                        poke.ability.append(new_ab)
                    else:
                        poke.ability.append(session.query(PokeAbility).filter(PokeAbility.name == ab).first())
                session.commit()
            except:
                session.rollback()

    with open("item.csv", "r") as f:
        lines = f.read()
        line = lines.split(",")
        try:
            for i in range(0, len(line) // 2):
                name = line[2 * i]
                if not session.query(Item).filter(Item.name == name).first():
                    new_item = Item()
                    new_item.name = name
                    new_item.desc = line[2 * i + 1]
                    new_item.hiragana = name.translate(kata2hira)
                    session.add(new_item)
                session.commit()
        except:
            session.rollback()

    session.close()


if __name__ == '__main__':
    main()
