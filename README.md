# Leistungsnachweis API
Fachhochschule Graubünden, Multimedia Production<br>
FS24, Interaktive Medien II, 2. Juni 2024<br>
Carina Bihlmayer und Simone Etter, mmp23c<br>
<br>

## Projekt-Kurzbeschrieb
Für unsere Website "Parkhäuser in Basel" greiffen wir auf folgende API zu: https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20. 
<br><br>
Weil man wohl unsere Website meistens besuchen wird, wenn man mit dem Auto grad unterwegs ist, haben wir uns dazu entschieden, die Website nach Mobile-First aufzubauen. 
<br><br>
Die Standard-Sortierung ist von der API vorgegeben. Es ist aber mittels verschiedenen Funktionen möglich, das gewünschte Parkhaus im Hand umdrehen schnell finden zu können. Einerseits kann man das entsprechende Parkhaus direkt in der Suchleiste suchen und finden. Andererseits haben wir folgende vier Sortierungsfunktionen eingerichtet:
- **Alphabet**: Zeigt die Parkhäuser nach dem Alphabet
- **Auslastung**: Zeigt diejenigen Parkhäuser, die am wenigsten ausgelastet ist, zuoberst an. 
- **Entfernung**: Zeigt diejenigen Parkhäuser, die am nächsten von einem entfernt sind, zuoberst an. Dafür wird der Standort des Geräts abgefragt.
- **Favoriten**: Es ist möglich, Parkhäuser als Favoriten zu markieren, beispielsweise wenn man sie häufig verwendet. Beim Sortieren nach Favoriten werden diese zuoberst angezeigt.
<br><br>

Von jedem Parkhaus werden dann folgende Informationen angezeigt:
- Parkhaus-Icon in der entsprechenden Farbe gemäss der Auslastung des Parkhauses (Legende siehe Footer)
- Freie Plätze im Parkhaus
- Öffnungszeiten des Parkhauses
- Link zur Parkhaus-Website
- Link zu Google Maps

## Learnings
Mit einem klaren Plan geht's am einfachsten! Wir haben uns die Website zuerst mit Stift und Papier verbildlicht und uns genau notiert, was wir wie haben wollen. Dann haben wir uns die Grundstruktur des JavaScript-Codes gemeinsam erarbeitet. Die Zeit vor Ort in der Schule haben wir intensiv genutzt, damit wir bei Unsicherheiten zudem jederzeit Nina oder Alen fragen konnten. Weiter haben wir auch einen API-Duden kreiert, wo wir alle Bezeichnungen niedergeschrieben haben, damit wir auch später noch wissen, was diese bedeuten.

Dieses strukturierte Vorgehen haben wir bei anderen Modulen nicht immer so gewissenhaft angewendet. Es hat sich aber sehr gelohnt, daher möchten wir dies auch für künftige Projekte so ähnlich adaptieren.
<br>

## Schwierigkeiten
Bei der Favoriten-Funktion war es schwierig einzurichten, dass die im Local Storage gespeicherten Favoriten auch auf der Website angezeigt bleiben. Dafür mussten an vielen Stellen im Code Anpassungen gemacht werden.  

Auch die Sortierfunktion nach Entfernung war ein Knorz. Es hat zwar die Standortdaten vom Gerät abgefragt, aber lange hat sich nichts an den Ergebnissen auf der Website geändert. Nicht zuletzt lagen die Fehler im Code an blöden Tippfehlern...
<br>

## Verwendete Ressourcen
Pokémon-Codealong, GitHub Copilot, ChatGPT, W3Schools, Perplexity sowie natürlich Nina und Alen.