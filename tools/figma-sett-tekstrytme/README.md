# Sett tekstrytme (prototype)

Figma-plugin som setter avstandsbryterne på beta-tekstkomponentene etter de samme reglene som `TextContainer` i koden (`packages/typography/src/beta/components/text-container.scss`).

## Regler

For hver vertikal auto layout i utvalget, i lagrekkefølge:

| Komponent                  | Bryter            | På når                                                       |
| -------------------------- | ----------------- | ------------------------------------------------------------ |
| Heading Beta 2             | Spacing above     | elementet før finnes og ikke er en overskrift eller overline |
| Heading Beta 2             | Spacing below     | elementet ikke er det siste                                  |
| Text Beta 2                | Paragraph spacing | elementet ikke er det siste                                  |
| Label Beta (også Overline) | Spacing           | elementet ikke er det siste                                  |

Skjulte og absolutt plasserte lag hoppes over. Pluginen ser ikke inn i instanser. Bryteren `Spacing` regnes bare med på Label-komponenter, siden andre komponenter kan ha en bryter med samme navn.

## Panel

**Åpne panel** viser et lite panel med en **Tekstrytme**-bryter og status for det som er markert. Statusen oppdateres når du markerer noe annet eller endrer en bryter for hånd.

| Status              | Bryter      | Betyr                              |
| ------------------- | ----------- | ---------------------------------- |
| Følger reglene      | på          | bryterne står som reglene sier     |
| Avstand av          | av          | alle avstandsbryterne er av        |
| N elementer avviker | midt mellom | noen er på, men ikke etter reglene |

- Slår du bryteren **på**, settes tekstrytmen for hele rammen, også når du bare har markert ett element, fordi reglene ser på naboene.
- Slår du den **av**, slås avstanden av bare på det som er markert.
- **Marker avvik** markerer elementene som avviker.
- Står teksten utenfor en vertikal auto layout, kan tekstrytmen ikke settes. Panelet viser da bare om avstanden er på eller av, og bryteren kan bare slå den av.

Mens panelet er åpent, kan ingen andre plugins kjøre i filen, heller ikke Desktop Bridge.

### Kontekst

Øverst i panelet velger du kontekst for den markerte rammen. Pluginen setter da modus for samlingene Typography, Component size og Component spacing på rammen, og alt inni arver dem. Det tilsvarer `data-type-scale` og `data-density` i forslaget til koden.

| Kontekst | Typography | Component size | Component spacing |
| -------- | ---------- | -------------- | ----------------- |
| B2B      | Compact    | Compact        | Compact           |
| App      | Compact    | Standard       | Standard          |
| entur.no | Compact    | Standard       | Standard          |
| Artikkel | Standard   | Standard       | Standard          |
| Kiosk    | Display    | Display        | Display           |

- Panelet viser hvilken kontekst rammen har, også når den er arvet fra en ramme utenfor. App og entur.no har like moduser. Pluginen husker hvilken av dem du valgte.
- Står Component size og Component spacing i ulike moduser, får du en advarsel.
- I B2B og Kiosk får du en advarsel om komponenter som ikke er bundet til Component size. De beholder standard størrelse.
- Kontekst settes på skjermrammen, altså rammer og seksjoner utenfor komponenter.
- **Markerer du en komponent** på skjermen, for eksempel en knapp, heter valget **Komponent**: Følger skjermen, Standard, Compact eller Display. Hele komponenten får den størrelsen, både Component size og Typography. «Følger skjermen» fjerner valget igjen. Er komponenten ikke bundet til Component size, sier panelet at bare teksten endres.
- Markerer du noe inni en komponent, for eksempel teksten i en knapp, viser panelet bare konteksten den arver. Marker komponenten eller skjermrammen for å endre.
- Hele skjermen får konteksten. Lag inni med egen modus følger skjermen når du velger kontekst, enten modusen er satt for hånd eller følger med komponenten. En Compact-knapp i en App-skjerm blir altså en Standard-knapp, med både størrelse og tekst. Det du har valgt i pluginen beholdes: en ramme med egen kontekst, som en artikkel, og en komponent med egen størrelse.
- Har lag inni egen modus som ikke følger skjermen, får du en advarsel. Velg konteksten på nytt for å rette dem.
- Samlingene finnes der filen allerede bruker dem. Mangler noen, hentes de fra biblioteket. Det kan ta litt tid, og krever tillatelsen `teamlibrary`.

## Kommandoer

- **Sett tekstrytme**: endrer bryterne og sier hvor mange elementer som ble endret.
- **Sjekk tekstrytme**: endrer ingenting, men markerer elementene som avviker.
- **Slå av avstand**: slår av alle avstandsbryterne. Marker en ramme for å slå av alt i den, også i rammer inni, eller marker enkeltelementer for å slå av bare dem. Brukes for tekst i kort, lister og andre steder der gap i auto layout gir avstanden.

De to første advarer om rammer med gap (det kommer i tillegg til blokkene) og om andre elementer, som bilder, som ikke har luft etter seg. Koden gir dem 24.

## Installere

1. Åpne Figma desktop.
2. Plugins → Development → Import plugin from manifest…
3. Velg `manifest.json` i denne mappen.
4. Marker rammen med teksten og kjør Plugins → Development → Sett tekstrytme.

## Ikke dekket

- Avstander inne i ett tekstlag, for eksempel avsnitt → liste (8) og liste → avsnitt (28).
- Bilde → bildetekst (8).
- `id` i `manifest.json` er en plassholder. Figma gir pluginen en ekte id når den publiseres privat i organisasjonen.
