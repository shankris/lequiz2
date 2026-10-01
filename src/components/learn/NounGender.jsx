/* src/components/learn/NounGender.jsx */

"use client";

import { useTranslations } from "next-intl";

export default function NounGender() {
  const t = useTranslations("learning.nounGender");

  return (
    <article className='learningNote'>
      <h2>{t("title")}</h2>
      <p>{t("intro1")}</p>
      <p>{t("intro2")}</p>
      <p>{t("articleExamplesIntro")}</p>
      <ul>
        <li>
          <strong>
            <em>l&apos;eau</em> ({t("words.water")})
          </strong>{" "}
          → {t("articleExamples.water")}
        </li>

        <li>
          <strong>
            <em>l&apos;hôtel</em> ({t("words.hotel")})
          </strong>{" "}
          → {t("articleExamples.hotel")}
        </li>

        <li>
          <strong>
            <em>des voitures</em> ({t("words.cars")}) / <em>des livres</em> ({t("words.books")})
          </strong>{" "}
          → {t("articleExamples.plural")}
        </li>
      </ul>
      <p>{t("articleConclusion")}</p>
      <blockquote>
        <strong>{t("quote")}</strong>
      </blockquote>
      <p>{t("importance")}</p>
      <h3>{t("feminine.title")}</h3>
      <p>{t("feminine.tionIntro")}</p>
      <ul>
        <li>
          <em>la nation</em> ({t("words.nation")})
        </li>
        <li>
          <em>la situation</em> ({t("words.situation")})
        </li>
        <li>
          <em>la conversation</em> ({t("words.conversation")})
        </li>
      </ul>
      <p>{t("feminine.sionIntro")}</p>
      <ul>
        <li>
          <em>la décision</em> ({t("words.decision")})
        </li>
        <li>
          <em>la télévision</em> ({t("words.television")})
        </li>
        <li>
          <em>la discussion</em> ({t("words.discussion")})
        </li>
      </ul>
      <p>{t("feminine.teIntro")}</p>
      <ul>
        <li>
          <em>la liberté</em> ({t("words.freedom")})
        </li>
        <li>
          <em>la qualité</em> ({t("words.quality")})
        </li>
        <li>
          <em>la possibilité</em> ({t("words.possibility")})
        </li>
      </ul>
      <p>{t("feminine.exceptionsIntro")}</p>
      <ul>
        <li>
          <em>le comité</em> ({t("words.committee")})
        </li>
        <li>
          <em>le côté</em> ({t("words.side")})
        </li>
      </ul>
      <h3>{t("masculine.title")}</h3>
      <p>{t("masculine.ageIntro")}</p>
      <ul>
        <li>
          <em>le village</em> ({t("words.village")})
        </li>
        <li>
          <em>le voyage</em> ({t("words.trip")})
        </li>
        <li>
          <em>le fromage</em> ({t("words.cheese")})
        </li>
      </ul>
      <p>{t("masculine.ageExceptionsIntro")}</p>
      <ul>
        <li>
          <em>la page</em> ({t("words.page")})
        </li>
        <li>
          <em>la cage</em> ({t("words.cage")})
        </li>
        <li>
          <em>la plage</em> ({t("words.beach")})
        </li>
        <li>
          <em>l&apos;image</em> ({t("words.image")})
        </li>
        <li>
          <em>la nage</em> ({t("words.swimming")})
        </li>
        <li>
          <em>la rage</em> ({t("words.rage")})
        </li>
      </ul>
      <p>{t("masculine.mentIntro")}</p>
      <ul>
        <li>
          <em>le gouvernement</em> ({t("words.government")})
        </li>
        <li>
          <em>le mouvement</em> ({t("words.movement")})
        </li>
        <li>
          <em>le bâtiment</em> ({t("words.building")})
        </li>
      </ul>
      <p>{t("masculine.mentConclusion")}</p>
      <p>{t("masculine.eauIntro")}</p>
      <ul>
        <li>
          <em>le bureau</em> ({t("words.office")})
        </li>
        <li>
          <em>le château</em> ({t("words.castle")})
        </li>
        <li>
          <em>le cadeau</em> ({t("words.gift")})
        </li>
      </ul>
      <p>{t("masculine.eauExceptionsIntro")}</p>
      <ul>
        <li>
          <em>la peau</em> ({t("words.skin")})
        </li>
        <li>
          <em>l&apos;eau</em> ({t("words.water")})
        </li>
      </ul>

      <h3>{t("habit.title")}</h3>
      <p>{t("habit.intro")}</p>
      <p>
        {t("habit.exampleTable")}{" "}
        <strong>
          <em>la table</em> ({t("words.table")})
        </strong>{" "}
        {t("habit.exampleTableEnd")} <em>table</em>.
      </p>
      <p>
        {t("habit.exampleBook")}{" "}
        <strong>
          <em>le livre</em> ({t("words.book")})
        </strong>{" "}
        {t("habit.exampleBookEnd")} <em>livre</em>.
      </p>
      <p>{t("habit.conclusion")}</p>
    </article>
  );
}
