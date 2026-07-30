-- ============================================================
-- Données de test pour le portail patient
-- À exécuter APRÈS avoir créé au moins un participant et un
-- suivi nutritionnel avec la V2 (colonne nom)
-- ============================================================
-- Remplace les UUID ci-dessous par ceux de ta base

-- 1. Ajouter un programme nutritionnel de test à un suivi existant
--    (remplace 'ID_DU_SUIVI' par l'ID de ton suivi)
UPDATE suivis_nutritionnels
SET programme_nutritionnel = '<h2>Votre programme personnalisé</h2>
<p>Voici votre programme nutritionnel adapté à vos objectifs.</p>
<ul>
  <li><strong>Petit-déjeuner :</strong> Porridge aux flocons d''avoine, fruits frais et oléagineux</li>
  <li><strong>Déjeuner :</strong> Protéines maigres + légumes verts + féculents complets</li>
  <li><strong>Dîner :</strong> Soupe de légumes + protéines végétales</li>
</ul>
<h3>Recommandations</h3>
<p>Hydratation : 1.5L d''eau minimum par jour.<br/>
Activité physique : 30 minutes de marche quotidienne.</p>',
    evaluation_nutritionnelle = '{
      "poids": "72",
      "taille": "165",
      "imc": "26.4",
      "objectif_principal": "Perte de poids",
      "sommeil": "Moyenne",
      "stress": "Modéré",
      "energie": "Bon",
      "notes": "Patiente motivée, bon suivi des recommandations."
    }'
WHERE id = 'ID_DU_SUIVI';

-- 2. Pour tester les différents niveaux, tu peux changer le niveau
--    d''un suivi existant et observer le portail :
UPDATE suivis_nutritionnels SET niveau_suivi = 'ESSENTIELLE' WHERE id = 'ID_DU_SUIVI';
-- → Affiche : jauge + programme uniquement

UPDATE suivis_nutritionnels SET niveau_suivi = 'RENFORCEE' WHERE id = 'ID_DU_SUIVI';
-- → Affiche : jauge + programme + résumé évaluation

UPDATE suivis_nutritionnels SET niveau_suivi = 'INTENSE' WHERE id = 'ID_DU_SUIVI';
-- → Affiche : jauge + programme + résumé évaluation + stats tracking

UPDATE suivis_nutritionnels SET niveau_suivi = 'CLINIQUE' WHERE id = 'ID_DU_SUIVI';
-- → Affiche : jauge + programme + résumé évaluation + stats + notes cliniques