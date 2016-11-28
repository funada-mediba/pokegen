/*jshint esversion: 6 */
function pgoapi_get(){
	var db = null;

	try {
		if (!window.openDatabase) {
			alert("このブラウザではローカルデータベースがサポートされていません。");
		} else {
			var shortName = 'pokegen_DB';
			//var version = '3.7.6.3';
			var version = '';  //指定しなければ、どのバージョンでも使える
			var displayName = 'pokegen_Database';
			var maxSize = 10000;

			db = openDatabase(shortName, version, displayName, maxSize);
            db.transaction(function(data) {
				data.executeSql('DROP TABLE pokemon_data',[], function (data, error) {console.log(error);}, function (data, error) {console.log(error);});
				data.executeSql('DROP TABLE user_pokemon_data',[], function (data, error) {console.log(error);}, function (data, error) {console.log(error);});
				data.executeSql('DROP TABLE user_data',[], function (data, error) {console.log(error);}, function (data, error) {console.log(error);});
                data.executeSql('CREATE TABLE if not exists pokemon_data(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32) NOT NULL)',[], function (data, error) {console.log(error);}, function (data, error) {console.log(error);});
                data.executeSql('CREATE TABLE if not exists user_pokemon_data(no INTEGER PRIMARY KEY AUTOINCREMENT,captured_cell_id int(11) NOT NULL,cp int(11) NOT NULL,cp_multiplier int(11) NOT NULL,creation_time_ms int(11) NOT NULL,height_m int(11) NOT NULL,id int(11) NOT NULL,individual_attack int(11) NOT NULL,individual_defense int(11) NOT NULL,individual_stamina int(11) NOT NULL,move_1 int(11) NOT NULL,move_2 int(11) NOT NULL,pokemon_id int(11) NOT NULL,stamina int(11) NOT NULL,stamina_max int(11) NOT NULL,weight_kg int(11) NOT NULL)',[], function (data, error) {console.log(error);}, function (data, error) {console.log(error);});
                data.executeSql('CREATE TABLE if not exists user_data(no INTEGER PRIMARY KEY AUTOINCREMENT,name text NOT NULL,experience int(11) NOT NULL,km_walked int(11) NOT NULL,level int(11) NOT NULL,next_level_xp int(11) NOT NULL,poke_stop_visits int(11) NOT NULL,pokeballs_thrown int(11) NOT NULL,pokemon_caught_by_type int(11) NOT NULL,pokemons_captured int(11) NOT NULL,pokemons_encountered int(11) NOT NULL,unique_pokedex_entries int(11) NOT NULL)',[], function (data, error) {console.log(error);}, function (data, error) {console.log(error);});
            });
		}
	} catch(e) {
	    console.log("例外：" + e);
		return;
	}

    const pokemon_list = new Array(
        "フシギダネ","フシギソウ","フシギバナ","ヒトカゲ","リザード","リザードン",
        "ゼニガメ","カメール","カメックス","キャタピー","トランセル","バタフリー",
        "ビードル","コクーン","スピアー","ポッポ","ピジョン","ピジョット",
        "コラッタ","ラッタ","オニスズメ","オニドリル","アーボ","アーボック",
        "ピカチュウ","ライチュウ","サンド","サンドパン","ニドラン ♀","ニドリーナ",
        "ニドクイン","ニドラン ♂","ニドリーノ","ニドキング","ピッピ","ピクシー",
        "ロコン","キュウコン","プリン","プクリン","ズバット","ゴルバット",
        "ナゾノクサ","クサイハナ","ラフレシア","パラス","パラセクト","コンパン",
        "モルフォン","ディグダ","ダグトリオ","ニャース","ペルシアン","コダック",
        "ゴルダック","マンキー","オコリザル","ガーディ","ウインディ","ニョロモ",
        "ニョロゾ","ニョロボン","ケーシィ","ユンゲラー","フーディン","ワンリキー",
        "ゴーリキー","カイリキー","マダツボミ","ウツドン","ウツボット","メノクラゲ",
        "ドククラゲ","イシツブテ","ゴローン","ゴローニャ","ポニータ","ギャロップ",
        "ヤドン","ヤドラン","コイル","レアコイル","カモネギ","ドードー",
        "ドードリオ","パウワウ","ジュゴン","ベトベター","ベトベトン","シェルダー",
        "パルシェン","ゴース","ゴースト","ゲンガー","イワーク","スリープ",
        "スリーパー","クラブ","キングラー","ビリリダマ","マルマイン","タマタマ",
        "ナッシー","カラカラ","ガラガラ","サワムラー","エビワラー","ベロリンガ",
        "ドガース","マタドガス","サイホーン","サイドン","ラッキー","モンジャラ",
        "ガルーラ","タッツー","シードラ","トサキント","アズマオウ","ヒトデマン",
        "スターミー","バリヤード","ストライク","ルージュラ","エレブー","ブーバー",
        "カイロス","ケンタロス","コイキング","ギャラドス","ラプラス","メタモン",
        "イーブイ","シャワーズ","サンダース","ブースター","ポリゴン","オムナイト",
        "オムスター","カブト","カブトプス","プテラ","カビゴン","フリーザー",
        "サンダー","ファイヤー","ミニリュウ","ハクリュー","カイリュー","ミュウツー",
        "ミュウ"
    );

    db.transaction(function(data) {
        for (var i = 0; i < pokemon_list.length; i++) {
            data.executeSql('INSERT INTO pokemon_data VALUES(null,?)',[pokemon_list[i]]);
        }
    });

	var pokemon_data_cnt = 0;
	var user_data_cnt = 0;
    $.ajax({
        url:"api/",
		type:"post",
		data: {
		"mail": $("#mail").val(),
		"pass": $("#pass").val()
		},
        success: function (json) {
            $(json[0].responses.GET_INVENTORY.inventory_delta.inventory_items).each(function(index,obj){
                var pokemon_data = obj.inventory_item_data;
	            db.transaction(function(data) {
	                for (var key in pokemon_data) {
	                    if (key == "pokemon_data") {
							if (!pokemon_data.pokemon_data.is_egg) {
								var captured_cell_id = pokemon_data.pokemon_data.captured_cell_id;
		                        var cp = pokemon_data.pokemon_data.cp;
		                        var cp_multiplier = pokemon_data.pokemon_data.cp_multiplier;
		                        var creation_time_ms = pokemon_data.pokemon_data.creation_time_ms;
		                        var height_m = pokemon_data.pokemon_data.height_m;
		                        var id = pokemon_data.pokemon_data.id;
		                        var individual_attack = pokemon_data.pokemon_data.individual_attack;//攻撃力
		                        var individual_defense = pokemon_data.pokemon_data.individual_defense; //防御
		                        var individual_stamina = pokemon_data.pokemon_data.individual_stamina; //体力
		                        var move_1 = pokemon_data.pokemon_data.move_1;
		                        var move_2 = pokemon_data.pokemon_data.move_2;
		                        var pokemon_id = pokemon_data.pokemon_data.pokemon_id;
		                        var stamina = pokemon_data.pokemon_data.stamina;
		                        var stamina_max = pokemon_data.pokemon_data.stamina_max;
		                        var weight_kg = pokemon_data.pokemon_data.weight_kg;
								pokemon_data_cnt++;
		                        data.executeSql('INSERT INTO user_pokemon_data VALUES('+ pokemon_data_cnt +',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[captured_cell_id,cp,cp_multiplier,creation_time_ms,height_m,id,individual_attack,individual_defense,individual_stamina,move_1,move_2,pokemon_id,stamina,stamina_max,weight_kg]);
							}
	                    }else if(key == "player_stats"){
							var name =  json[1].responses.GET_PLAYER.player_data.username;
	                        var experience = pokemon_data.player_stats.experience;
	                        var km_walked = pokemon_data.player_stats.km_walked;
	                        var level = pokemon_data.player_stats.level;
	                        var next_level_xp = pokemon_data.player_stats.next_level_xp;
	                        var poke_stop_visits = pokemon_data.player_stats.poke_stop_visits;
	                        var pokeballs_thrown = pokemon_data.player_stats.pokeballs_thrown;
	                        var pokemon_caught_by_type = pokemon_data.player_stats.pokemon_caught_by_type;
	                        var pokemons_captured = pokemon_data.player_stats.pokemons_captured;
	                        var pokemons_encountered = pokemon_data.player_stats.pokemons_encountered;
	                        var unique_pokedex_entries = pokemon_data.player_stats.unique_pokedex_entries;
							user_data_cnt++;
							data.executeSql('INSERT INTO user_data VALUES('+ user_data_cnt +',?,?,?,?,?,?,?,?,?,?,?)',[name,experience,km_walked,level,next_level_xp,poke_stop_visits,pokeballs_thrown,pokemon_caught_by_type,pokemons_captured,pokemons_encountered,unique_pokedex_entries]);
	                    }
	                }
				});
            });
			var user_pokemon_id;
			db.transaction(function(data) {
				data.executeSql("SELECT * FROM user_data",[], function(rt, rs) {
	                    for (var i = 0; i < rs.rows.length; i++) {
	                        var row = rs.rows.item(i);
							$(".level-put").html("level " + row.level);
							$(".name-put").html(row.name);
	                    }
	                }, function (data, error) {console.log(data);console.log(error);});
				data.executeSql("SELECT * FROM user_pokemon_data",[], function(rt, rs) {
						for (var i = 0; i < rs.rows.length; i++) {
							var row = rs.rows.item(i);
							var user_pokemon_id = row.pokemon_id;
							var cp = row.cp;
							var individual_attack = row.individual_attack;
							var individual_defense = row.individual_defense;
							var individual_stamina = row.individual_stamina;
							var avg = (((individual_attack+individual_defense+individual_stamina)/3)/15)*100;
							$(".row-padding").append(
								'<div class="third container margin-bottom image-put">'+
								'<img src="http://pokemon.symphonic-net.com/'+ ( '000' + user_pokemon_id ).slice( -3 ) +'.gif" alt="Norway" style="width:100%">'+
								'<div class="container white">'+
								'<p><b id="pokemon-put'+ i +'" class="pokemon-each">'+ user_pokemon_id +'</b></p>'+
								'<p>cp '+ cp +'</p>'+
								'<p>avg '+ Math.floor((avg * 100))/100 +'</p>'+
								'</div>'+
								'</div>'
							);
						}
					});
			});
			db.transaction(function(data) {
				$(".pokemon-each").each(function(index) {
					var pokemonId = $(this).text();
					data.executeSql("SELECT name FROM pokemon_data WHERE id="+pokemonId,[], function(rt, rs) {
						var row = rs.rows.item(0);
						$("#pokemon-put"+index).text(row.name);
					});
				});
			});
		},error: function (XMLHttpRequest, textStatus, errorThrown) {console.log(textStatus, errorThrown);}
    });
}
function arrangement_id() {
	$(".row-padding").html("");
	try {
		if (!window.openDatabase) {
			alert("このブラウザではローカルデータベースがサポートされていません。");
		} else {
			var shortName = 'pokegen_DB';
			//var version = '3.7.6.3';
			var version = '';  //指定しなければ、どのバージョンでも使える
			var displayName = 'pokegen_Database';
			var maxSize = 10000;

			db = openDatabase(shortName, version, displayName, maxSize);
			db.transaction(function(data) {
				data.executeSql("SELECT * FROM user_pokemon_data ORDER BY pokemon_id",[], function(rt, rs) {
					for (var i = 0; i < rs.rows.length; i++) {
						var row = rs.rows.item(i);
						var user_pokemon_id = row.pokemon_id;
						var cp = row.cp;
						var individual_attack = row.individual_attack;
						var individual_defense = row.individual_defense;
						var individual_stamina = row.individual_stamina;
						var avg = (((individual_attack+individual_defense+individual_stamina)/3)/15)*100;
						$(".row-padding").append(
							'<div class="third container margin-bottom image-put">'+
							'<img src="http://pokemon.symphonic-net.com/'+ ( '000' + user_pokemon_id ).slice( -3 ) +'.gif" alt="Norway" style="width:100%">'+
							'<div class="container white">'+
							'<p><b id="pokemon-put'+ i +'" class="pokemon-each">'+ user_pokemon_id +'</b></p>'+
							'<p>cp '+ cp +'</p>'+
							'<p>avg '+ Math.floor((avg * 100))/100 +'</p>'+
							'</div>'+
							'</div>'
						);
					}
				});
				db.transaction(function(data) {
					$(".pokemon-each").each(function(index) {
						var pokemonId = $(this).text();
						data.executeSql("SELECT name FROM pokemon_data WHERE id="+pokemonId,[], function(rt, rs) {
							var row = rs.rows.item(0);
							$("#pokemon-put"+index).text(row.name);
						});
					});
				});
			});
		}
	} catch(e) {
		console.log("例外：" + e);
		return;
	}
}
function arrangement_cp() {
	$(".row-padding").html("");
	try {
		if (!window.openDatabase) {
			alert("このブラウザではローカルデータベースがサポートされていません。");
		} else {
			var shortName = 'pokegen_DB';
			//var version = '3.7.6.3';
			var version = '';  //指定しなければ、どのバージョンでも使える
			var displayName = 'pokegen_Database';
			var maxSize = 10000;

			db = openDatabase(shortName, version, displayName, maxSize);
			db.transaction(function(data) {
				data.executeSql("SELECT * FROM user_pokemon_data ORDER BY cp DESC",[], function(rt, rs) {
					for (var i = 0; i < rs.rows.length; i++) {
						var row = rs.rows.item(i);
						var user_pokemon_id = row.pokemon_id;
						var cp = row.cp;
						var individual_attack = row.individual_attack;
						var individual_defense = row.individual_defense;
						var individual_stamina = row.individual_stamina;
						var avg = (((individual_attack+individual_defense+individual_stamina)/3)/15)*100;
						$(".row-padding").append(
							'<div class="third container margin-bottom image-put">'+
							'<img src="http://pokemon.symphonic-net.com/'+ ( '000' + user_pokemon_id ).slice( -3 ) +'.gif" alt="Norway" style="width:100%">'+
							'<div class="container white">'+
							'<p><b id="pokemon-put'+ i +'" class="pokemon-each">'+ user_pokemon_id +'</b></p>'+
							'<p>cp '+ cp +'</p>'+
							'<p>avg '+ Math.floor((avg * 100))/100 +'</p>'+
							'</div>'+
							'</div>'
						);
					}
				});
				db.transaction(function(data) {
					$(".pokemon-each").each(function(index) {
						var pokemonId = $(this).text();
						data.executeSql("SELECT name FROM pokemon_data WHERE id="+pokemonId,[], function(rt, rs) {
							var row = rs.rows.item(0);
							$("#pokemon-put"+index).text(row.name);
						});
					});
				});
			});
		}
	} catch(e) {
		console.log("例外：" + e);
		return;
	}
}
