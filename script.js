/* ============================================================
   ワードPK — script.js
   自分の言葉を保存して、PKに勝ったらその言葉が出るメモ帳アプリ

   この課題で学びたいこと：配列・繰り返し（for）・その組み合わせ・ローカルストレージ

   1. 思想家の言葉を配列に入れ、for で一覧に並べる。自分の言葉の入力欄も10行作る
   2. ［保存する］を押したら、for で10回まわして、言葉とチェックをローカルストレージに保存する
   3. ページを開いたら、保存した言葉とチェックを読み込んで戻す
   4. ［試合へ］を押したら、チェックした言葉を配列 deru に集める（1個もなければ注意を出す）
   5. deru から乱数で1つ決めておき（kotoba）、試合の画面に切り替える
   6. PKを5本蹴る。方向ごとの数は配列から取り、処理は隠しボタン kick の1か所にまとめる
   7. 3本決めたら「★ 決勝トーナメント進出！ ★」と、かけた言葉を出す
   8. 決められなければ「決勝トーナメント出場ならず！」と出す（言葉は出ない）
   9. 約3秒で最初の画面に戻る
============================================================ */
// 思想家の言葉（10個）
const junbi = [
   "相手と自分を知れば、負けない",
   "勝つ者は、勝ってから戦う",
   "戦わずして勝つが最善",
   "自らに勝つ者は強し",
   "地の利は人の和に如かず",
   "過ちては改むるに憚ること勿れ",
   "半歩を積まねば、千里に届かない",
   "己に勝つことが、最初で最良の勝利",
   "人を悩ませるのは、物事への思い",
   "妨げこそが、道になる",
];
// 言った人。junbi と同じ番号どうしが組になる
const junbiHito = ["孫子", "孫子", "孫子", "老子", "孟子", "孔子", "荀子", "プラトン", "エピクテトス", "マルクス・アウレリウス"];
// 一覧の行を作る。i を 0 から 9 まで変えながら、{ } の中を10回くり返す
for (let i = 0; i < 10; i++) {
   // 自分の言葉の行：チェックの四角＋書く欄
   $(".my-list").append(
      '<li><input type="checkbox" class="check-m' + i + '"><input type="text" class="myword' + i + '" placeholder="自分の言葉 ' + (i + 1) + '"></li>'
   );
   // 思想家の言葉の行：チェックの四角＋言葉＋人物名
   $(".junbi-list").append(
      '<li><input type="checkbox" class="check-j' + i + '">' + junbi[i] + '<span class="hito">' + junbiHito[i] + '</span></li>'
   );
}
// ［保存する］が押されたら、{ } の中を実行する
$(".save-button").on("click", function () {
   // チェックの数を数える入れ物。0 から始める
   let kazu = 0;
   for (let i = 0; i < 10; i++) {
      // 自分の言葉：書いた文字を、myword0〜9 という名前で保存する
      localStorage.setItem("myword" + i, $(".myword" + i).val());
      // 自分の言葉のチェック：付いていれば "1"、なければ空を保存する
      if ($(".check-m" + i).prop("checked")) {
         localStorage.setItem("check-m" + i, "1");
         kazu = kazu + 1;
      } else {
         localStorage.setItem("check-m" + i, "");
      }
      // 思想家の言葉のチェックも同じ
      if ($(".check-j" + i).prop("checked")) {
         localStorage.setItem("check-j" + i, "1");
         kazu = kazu + 1;
      } else {
         localStorage.setItem("check-j" + i, "");
      }
   }
   // 何個チェックしたかを出す
   $(".kazu-text").html("保存しました（チェック " + kazu + "個）");
});
// ページを開いたときに、保存した言葉とチェックを読み込んで戻す
for (let i = 0; i < 10; i++) {
   // 言葉：保存した中身を読み、欄に書き込む
   $(".myword" + i).val(localStorage.getItem("myword" + i));
   // チェック：保存した中身が "1" なら、チェックを付ける
   if (localStorage.getItem("check-m" + i) === "1") {
      $(".check-m" + i).prop("checked", true);
   }
   if (localStorage.getItem("check-j" + i) === "1") {
      $(".check-j" + i).prop("checked", true);
   }
}
// 勝ったときに出す言葉と、言った人。ほかのボタンからも使うので { } の外に置く
let kotoba = "";
let kotobaHito = "";
// ［試合へ］が押されたら、{ } の中を実行する
$(".start-button").on("click", function () {
   // 出る言葉と、言った人を集める配列。最初は空
   let deru = [];
   let deruHito = [];
   for (let i = 0; i < 10; i++) {
      // 自分の言葉：チェックがあり、欄が空でなければ集める
      if ($(".check-m" + i).prop("checked") && $(".myword" + i).val() !== "") {
         deru.push($(".myword" + i).val());
         deruHito.push("自分の言葉");
      }
      // 思想家の言葉：チェックがあれば集める
      if ($(".check-j" + i).prop("checked")) {
         deru.push(junbi[i]);
         deruHito.push(junbiHito[i]);
      }
   }
   // 集めた言葉をコンソールに出す（確かめ用）
   console.log(deru);
   // 1個もなければ、注意を出して、ここで止める
    if (deru.length === 0) {
      $(".kazu-text").html("チェックを1個以上付けてください");
       return;
   }
   // deru から1つを乱数で決める（勝ったときに出す）
   const n = Math.ceil(Math.random() * deru.length) - 1;
   kotoba = deru[n];
   kotobaHito = deruHito[n];
   console.log(kotoba);
   // 言葉の準備を隠し、試合の区画を出す
   $(".junbi-area").hide();
   $(".game-area").fadeIn();
});
let kicks = 0;
let goals = 0;
// 方向ごとの数。番号は 0 左上・1 右上・2 左下・3 右下・4 真ん中 の順
const mukiList = ["左上", "右上", "左下", "右下", "真ん中"];
const gyakuList = ["右下", "左下", "右上", "左上", "左下"];
const hazureList = [3, 3, 1, 1, 0];
const yomiList = [5, 5, 7, 7, 8];
const todokuList = [5, 5, 9, 9, 10];
const gxList = ["84px", "292px", "84px", "292px", "188px"];
const gyList = ["84px", "84px", "164px", "164px", "124px"];
const oxList = ["52px", "324px", "24px", "352px", "188px"];
const oyList = ["36px", "36px", "168px", "168px", "34px"];
// 押された方向の番号。方向のボタンが入れて、kick の処理が使う
let bango = 0;
// ［左上］が押されたら、方向の番号を 0 にして、kick を押したことにする
$(".hidariue-button").on("click", function () {
   bango = 0;
   $(".kick").click();
});
// ［右上］［左下］［右下］［真ん中］も、番号を入れて kick を押したことにする
$(".migiue-button").on("click", function () {
   bango = 1;
   $(".kick").click();
});
$(".hidarishita-button").on("click", function () {
   bango = 2;
   $(".kick").click();
});
$(".migishita-button").on("click", function () {
   bango = 3;
   $(".kick").click();
});
$(".mannaka-button").on("click", function () {
   bango = 4;
   $(".kick").click();
});
// 隠しボタン kick が押されたら（5つの方向のボタンから呼ばれる）、{ } の中を実行する
$(".kick").on("click", function () {
   if (goals === 3 || 5 - kicks + goals < 3) {
      return;
   }
   const muki = mukiList[bango];
   const gyaku = gyakuList[bango];
   const gx = gxList[bango];
   const gy = gyList[bango];
   const ox = oxList[bango];
   const oy = oyList[bango];
   console.log(muki);
   kicks = kicks + 1;
   $(".kick-text").html("【" + kicks + "本目】" + muki + "を狙った！");
   $(".ball").css({ left: "184px", top: "236px", width: "32px" });
   $(".crowd").attr("src", "images/crowd.svg");
   $(".sfx-shot").fadeIn(100);
   $(".sfx-shot").fadeOut(600);
   const waku = Math.ceil(Math.random() * 10);
   const gk = Math.ceil(Math.random() * 20);
   const te = Math.ceil(Math.random() * 10);
   console.log("waku:" + waku + " gk:" + gk + " te:" + te);
   console.log("押された");
   $(".result-text").html("蹴りました");
   const hazure = hazureList[bango];
   const yomi = yomiList[bango];
   const todoku = todokuList[bango];
   if (waku <= hazure) {
      $(".keeper").attr("src", "images/keeper_" + gyaku + ".svg");
      $(".ball").animate({ left: ox, top: oy, width: "24px" }, 500);
      $(".sfx").html("ヒュルルル…");
      $(".sfx").css({ color: "#bfd7e0" });
      $(".kansei").html("あぁ～…");
      $(".result-text").html("枠を外れました");
      $(".mark" + kicks).attr("src", "images/mark_out.svg");
   } else if (gk <= yomi) {
      if (te <= todoku) {
         $(".keeper").attr("src", "images/keeper_" + muki + ".svg");
         $(".ball").animate({ left: gx, top: gy, width: "24px" }, 400);
         $(".ball").animate({ left: "184px", top: "208px", width: "32px" }, 300);
         $(".sfx").html("バシィッ！！");
         $(".sfx").css({ color: "#ff5a5a" });
         $(".kansei").html("おおっ…！");
         $(".result-text").html("キーパーに読まれた！止められました。");
         $(".mark" + kicks).attr("src", "images/mark_save.svg");
      } else {
         $(".keeper").attr("src", "images/keeper_" + muki + "_todokanai.svg");
         $(".ball").animate({ left: gx, top: gy, width: "24px" }, 400);
         $(".sfx").html("ズバァッ！！");
         $(".sfx").css({ color: "#ffd23f" });
         $(".crowd").attr("src", "images/crowd_kanki.svg");
         $(".kansei").html("ワァァァッ…！");
         $(".result-text").html("読まれたけど手が届かない！ゴール！");
         $(".mark" + kicks).attr("src", "images/mark_goal.svg");
         goals = goals + 1;
      }
   } else {
      $(".keeper").attr("src", "images/keeper_" + gyaku + ".svg");
      $(".ball").animate({ left: gx, top: gy, width: "24px" }, 400);
      $(".sfx").html("ズドォォン！！");
      $(".sfx").css({ color: "#ffd23f" });
      $(".crowd").attr("src", "images/crowd_kanki.svg");
      $(".kansei").html("ワァァァッ…！");
      $(".result-text").html("キーパーの逆をついた！ゴール！");
      goals = goals + 1;
      $(".mark" + kicks).attr("src", "images/mark_goal.svg");
   }
   $(".result-text").hide();
   $(".result-text").fadeIn();
   $(".keeper").hide();
   $(".keeper").fadeIn(250);
   $(".sfx").hide();
   $(".sfx").fadeIn(700);
   $(".kansei").hide();
   $(".kansei").fadeIn(900);
   $(".score-text").html("決めた本数" + goals + " あと" + (3 - goals) + "本で勝利");
   if (goals === 3 || 5 - kicks + goals < 3) {
      if (goals >= 3) {
         $(".score-text").html("★ 決勝トーナメント進出！ ★");
         // 勝ったときだけ、決めておいた言葉と言った人を出す
         $(".kotoba").html(kotoba + '<span class="hito">' + kotobaHito + '</span>');
         $(".kotoba").fadeIn();
         $(".score-text").css({ "background-color": "#ffd23f", color: "#1f2a30", "border-color": "#1f2a30" });
         $(".wrapper").css({ "background-color": "#fff1b8" });
      } else {
         $(".score-text").html("決勝トーナメント出場ならず！");
         $(".score-text").css({ "background-color": "#5b6b75", color: "#ffffff", "border-color": "#1f2a30" });
         $(".wrapper").css({ "background-color": "#dde3e7" });
      }
      // 結果の文を3秒かけて出し、出きったら［もう一回］を押したことにする
      $(".score-text").hide();
      $(".score-text").fadeIn(3000, function () {
         $(".reset-button").click();
      });
   } else {
      $(".mark" + (kicks + 1)).attr("src", "images/mark_next.svg");
   }


});

//［もう一回］が押されたら、本数を０に戻して結果を消す
$(".reset-button").on("click", function () {
   kicks = 0;
   goals = 0;
   $(".result-text").html("蹴る方向を選んでください");
   $(".score-text").html("5本中3本決めたら勝利");
   $(".kick-text").html("ワードPK　スタート！");
   $(".sfx").fadeOut();
   $(".kansei").fadeOut();
   $(".score-text").css({ "background-color": "transparent", color: "#1f2a30", "border-color": "transparent" });
   $(".wrapper").css({ "background-color": "#f4efe1" });
   $(".ball").css({ left: "184px", top: "236px", width: "32px" });
   $(".keeper").attr("src", "images/keeper.svg");
   $(".crowd").attr("src", "images/crowd.svg");
   // 5本のマークを最初に戻す（いったん全部「まだ」にして、1本目だけ「次」にする）
   for (let i = 1; i <= 5; i++) {
      $(".mark" + i).attr("src", "images/mark_mada.svg");
   }
   $(".mark1").attr("src", "images/mark_next.svg");
   // 次の試合の言葉を、同じ候補から決め直す（［試合へ］を押したことにする）
   $(".start-button").click();
   $(".kotoba").hide();
});
// ［言葉を入れ替える］が押されたら、試合を最初に戻してから、言葉の準備の画面へ戻る
$(".kaeru-button").on("click", function () {
   $(".reset-button").click();
   $(".game-area").hide();
   $(".junbi-area").fadeIn();
   $(".kazu-text").html("出したい言葉にチェックを付けてください");
});