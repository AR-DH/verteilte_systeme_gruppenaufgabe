Adressbuch: Backend
===================

Inhaltsverzeichnis
------------------

1. [Kurzbeschreibung](#kurzbeschreibung)
1. [Start mit Docker Compose](#start-mit-docker-compose)
1. [Bekannte Probleme unter Windows](#bekannte-probleme-unter-windows)
1. [Manueller Start der MongoDB](#manueller-start-der-mongodb)
1. [Node.js-Kommandozeilenbefehle](#nodejs-kommandozeilenbefehle)
1. [Node.js in Docker ausführen](#nodejs-in-docker-ausführen)
1. [Produktives Container Image bauen](#produktives-container-image-bauen)

Kurzbeschreibung
----------------

Dies ist der backendseitige REST-Webservice der Adressbuch-App. Es handelt sich
um ein einfaches nodeJS-Projekt mit dem Webframework [Restify](http://restify.com/).
Die Schnittstelle des Webservices ist in der Datei `src/api/openapi.yaml`
beschrieben.

Start mit Docker Compose
------------------------

Am einfachsten lässt sich die App mit Docker Compose aus dem Wurzelverzeichnis
heraus starten. Das dort abgelegte README beschriebt die dafür notwendigen
Befehle im Detail:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

Die nachfolgenden Abschnitte in dieser Datei beschreiben hingegen, was dabei im
Hintergrund passiert bzw. wie das Backend mit und ohne Docker isoliert gestartet
werden kann.

Bekannte Probleme unter Windows
-------------------------------

Da Docker eine Linux-Technologie ist, verwendet Docker unter Windows inzwischen
das „Windows Subsystem for Linux”, das die Ausführung von Linux-Software unter
Windows ermöglicht. Mit diesem gibt es (Stand Mai 2022) jedoch ein bekanntes
Problem, das den Automatischen Neustart des Backend-Services verhindert
(siehe [Stackoverflow](https://stackoverflow.com/questions/39239686/nodemon-doesnt-restart-in-windows-docker-environment)),
wenn sich die Quellcode-Dateien verändern. Als Folge daraus muss der Docker-Container
nach jeder Codeänderung manuell neugestartet werden, um die Änderung zu testen.

Als Lösung ändern Sie folgende Zeile in der Datei `package.json`:

```json
"start": "nodemon --inspect=0.0.0.0:9229 src/index.js",
```

Die neue Version muss wie folgt lauten:

```json
"start": "nodemon --legacy-watch --inspect=0.0.0.0:9229 src/index.js",
```

Dadurch werden die Änderungen an den Quellcode-Dateien auf eine andere Weise
erkannt, so dass der automatische Neustart wieder funktioniert.

Manueller Start der MongoDB
---------------------------

Wird der Service nicht mit Docker Compose gestartet, muss erst eine lokale MongoDB
gestartet werden, bevor der Service ausgeführt werden kann. Diese muss auf der
Adresse mongodb://localhost:27017 erreichbar sein, sofern diese nicht durch die
Umgebungsvariable `MONGODB` übersteuert wird.

Am einfachsten kann dies durch Starten eines temporären Docker Container
erreicht werden:

```sh
docker network create adressbuch
docker run -d --name mongodb --net adressbuch -p 27017:27017 mongo
```

Der erste Befehl muss dabei nur ausgeführt werden, wenn das virtuelle Netzwerk
`adressbuch` nicht bereits zuvor angelegt wurde. Der zweite Befehl startet
eine temporäre MongoDB-Instanz und verbindet sie mit dem virtuellen Netzwerk.
Zusätzlich wird der Port 27017 das eigenen Rechners an den Port 27017 des
Containers weitergeleitet, um die Datenbank auch dann nutzen können, wenn der
Backend-Service nicht mit Docker gestartet wird.

Mit folgendem Befehl kann darüber hinaus ein grafisches Admin-Tool zur
Verwaltung der Datenbank gestartet werden:

```sh
docker run -d --name mongo-gui --net adressbuch -p 8081:8081 -e ME_CONFIG_MONGODB_URL=mongodb://mongodb:27017/ mongo-express
```

Mit folgenden Befehlen können die beiden Container wieder gestoppt und nicht
mehr benötigte Ressourcen freigegeben werden:

```sh
docker container stop mongo
docker container stop mongo-gui
docker system prune
```

Unnötig zu erwähnen, dass diese Schritte durch Docker Compose vollständig
automatisiert werden.

Node.js-Kommandozeilenbefehle
-----------------------------

Dieser Service nutzt Node.js bzw. den Node Package Manager zur Verwaltung von
Abhängigkeiten (im Quellcode verwendete, externe Bibliothekten und Frameworks)
und seiner Ausführung. Hierfür stehen folgende Kommandozeilenbefehle zur
Verfügung:

 * `npm install` zur Installation aller benötigten Module
 * `npm update` zur Aktualisierung aller Abhängigkeiten
 * `npm start` zum Starten eines Entwicklungsservers auf Port 3000

Dank `nodemon` werden Änderungen am Quellcode werden sofort aktiv, indem der
Service automatisch neugestartet wird. Zusätzlich kann der Standardport 9229
zur Anbindung eines JavaScript-Debuggers verwendet werden.

`npm install` wird auch im `Dockerfile` während dem Bauen des Container Images
ausgeführt. In der `../docker-compose.dev.yml` werden hingegen die Befehle
`npm install` und `npm start` ausgeführt.

Node.js in Docker ausführen
---------------------------

Siehe [gleichnamigen Abschnitt im Frontend-README](../Frontend#nodejs-in-docker-ausführen).
Das Vorgehen ist exakt dasselbe, da beide Teile der Anwendung Node.js verwenden.
Denken Sie lediglich daran, für das Frontend und das Backend jeweils eine eigene
Node.js-Umgebung in Docker zu starten.

Produktives Container-Image bauen
---------------------------------

Für den Produktivbetrieb konfiguriert das beigefügte `Dockerfile` eine produktive
Node.js-Laufzeitumgebung mit dem Quellcode des Backend-Services und allen seinen
Abhängigkeiten. Der Container kann somit direkt in eine produktive Systemlandschaft
überführt werden. Folgende Befehle werden hierfür benötigt:

 * `docker build -t adressbuch-backend .` zum Bauen des Containers
 * `docker run -d -p 3000:3000 --net adressbuch --name backend adressbuch-backend` zum Ausführen des Containers
 * `docker container stop backend` zum Stoppen des Containers
 * `docker system prune` zum Aufräumen nicht mehr benötigter Daten

Das `Dockerfile` wird auch verwendet, wenn im Wurzelverzeichnis mit Docker
Compose die Datei `docker-compose.prod.yml` ausgeführt wird. Der Container wird
im Grunde genommen damit auch auf die gleiche Art gestartet.
