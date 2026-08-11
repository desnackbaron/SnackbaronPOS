# Snackbaron POS v4.5 – Druktemeter

Nieuw:
- Druktemeting per 15 minuten.
- Per tijdsblok: klanten, food stuks, drank stuks en omzet.
- De gegevens komen uit de reeds lokaal opgeslagen bestellingen, dus er is geen extra handeling tijdens de service.
- De bestaande knop Druktemeter toont nu kwartieren in plaats van uren.
- Bij 'Verstuur naar Snackbaron PRO' wordt een veld `Druktemeter` met alle kwartierblokken meegestuurd.

Belangrijk:
De huidige Apps Script-koppeling verwerkt alleen de gewone Dagstaat-velden. De POS stuurt de druktedata nu al mee, maar Apps Script moet nog één keer worden uitgebreid om deze regels in een apart tabblad `Druktemeter` te schrijven.
