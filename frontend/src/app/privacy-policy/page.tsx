"use client";
import React from "react";
import styles from "./privacy-policy.module.css";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Common/Navbar/Navbar";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-2">
          <div>
            Adatvédelmi irányelvek
            <p>
              <strong>Érvénybe lépés dátuma:</strong> 2024-07-01
            </p>
            <p>
              Az <strong>EventPass</strong> ("mi," "miénk," vagy "mi")
              üzemelteti az <strong>EventPass</strong> weboldalt, amely elérhető
              az <a href="http://eventpass.hu">eventpass.hu</a> címen (a
              "Webhely"). Ez az adatvédelmi irányelv elmagyarázza, hogyan
              gyűjtjük, használjuk, osztjuk meg és védjük az Ön adatait, amikor
              meglátogatja weboldalunkat.
            </p>
            <h2>1. Milyen adatokat gyűjtünk</h2>
            <p>Az alábbi típusú személyes adatokat gyűjthetjük Öntől:</p>
            <ul>
              <li>
                <strong>Személyazonosító adatok:</strong> Nevek, e-mail címek,
                telefonszámok.
              </li>
              <li>
                <strong>Sütik és nyomkövetési technológiák:</strong> Sütik,
                webjelzők és egyéb nyomkövetési technológiák révén gyűjtött
                információk.
              </li>
            </ul>
            <h2>2. Hogyan gyűjtjük az adatokat</h2>
            <p>Az adatokat az alábbi módokon gyűjtjük:</p>
            <ul>
              <li>
                <strong>Közvetlenül Öntől:</strong> Amikor regisztrál
                webhelyünkön, kitölt egy űrlapot, vagy más módon ad meg
                információkat a webhelyünkön.
              </li>
              <li>
                <strong>Automatikusan:</strong> Amikor navigál webhelyünkön
                sütik és hasonló nyomkövetési technológiák révén.
              </li>
            </ul>
            <h2>3. Az adatok felhasználása</h2>
            <p>A gyűjtött adatokat különböző célokra használjuk, beleértve:</p>
            <ul>
              <li>A webhelyünk biztosítása és fenntartása érdekében.</li>
              <li>
                A webhelyünk és az Ön felhasználói élményének javítása
                érdekében.
              </li>
              <li>
                Annak megértésére, hogyan használják felhasználóink
                webhelyünket.
              </li>
            </ul>
            <h2>4. Adatmegosztás</h2>
            <p>
              Az adatokat harmadik felekkel csak az alábbi körülmények között
              osztjuk meg:
            </p>
            <ul>
              <li>
                <strong>Jogi okokból:</strong> Ha a törvény előírja, vagy
                közszolgáltatások jogos kéréseire válaszul.
              </li>
            </ul>
            <h2>5. Felhasználói jogok</h2>
            <p>Az alábbi jogokkal rendelkezik adatai tekintetében:</p>
            <ul>
              <li>
                <strong>Hozzáférés:</strong> Kérhet hozzáférést a birtokunkban
                lévő személyes adataihoz.
              </li>
              <li>
                <strong>Javítás:</strong> Kérheti a személyes adatai
                pontatlanságainak kijavítását.
              </li>
              <li>
                <strong>Törlés:</strong> Kérheti személyes adatainak törlését.
              </li>
            </ul>
            <p>
              Ezen jogok gyakorlásához kérjük, lépjen kapcsolatba velünk az
              alábbi elérhetőségek egyikén.
            </p>
            <h2>6. Az adatok biztonsága</h2>
            <p>
              Adminisztratív, technikai és fizikai biztonsági intézkedéseket
              alkalmazunk az Ön személyes adatainak védelme érdekében. Azonban
              az internetes adatátvitel és az elektronikus tárolás módszere nem
              100%-ban biztonságos.
            </p>
            <h2>7. Sütik és nyomkövetési technológiák</h2>
            <p>
              Sütiket és hasonló nyomkövetési technológiákat használunk a
              webhelyünk aktivitásának nyomon követésére és bizonyos információk
              tárolására. Beállíthatja böngészőjét úgy, hogy minden sütit
              elutasítson, vagy jelezze, amikor egy sütit küldenek. Ha nem
              fogadja el a sütiket, előfordulhat, hogy nem tudja használni
              webhelyünk bizonyos részeit.
            </p>
            <h2>8. Gyermekek adatvédelme</h2>
            <p>
              Webhelyünk nem céloz meg 13 év alatti gyermekeket. Tudatosan nem
              gyűjtünk személyazonosító adatokat 13 év alatti gyermekektől. Ha
              Ön szülő vagy gondviselő, és tudatában van annak, hogy gyermeke
              személyes adatokat adott meg nekünk, kérjük, lépjen kapcsolatba
              velünk.
            </p>
            <h2>9. Az adatvédelmi irányelvek változásai</h2>
            <p>
              Időről időre frissíthetjük adatvédelmi irányelveinket. Az új
              adatvédelmi irányelveket ezen az oldalon tesszük közzé, és az
              érvénybe lépés dátumát frissítjük.
            </p>
            <h2>10. Kapcsolatfelvétel</h2>
            <p>
              Ha bármilyen kérdése van ezen adatvédelmi irányelvekkel
              kapcsolatban, kérjük, lépjen kapcsolatba velünk az alábbi
              elérhetőségek egyikén:
            </p>
            <p>
              <strong>E-mail:</strong> info@eventpass.hu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
