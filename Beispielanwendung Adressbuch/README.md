Beispielanwendung „Adressbuch”
==============================

Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 1. [Nutzung der Gitpod Online-IDE](#nutzung-der-gitpod-online-ide)
 1. [Docker Compose auf dem eigenen Rechner](#docker-compose-auf-dem-eigenen-rechner)
 1. [Technische Hintergründe zum Startskript](#technische-hintergründe-zum-startskript)
 1. [Start einzelner Services mit und ohne Docker](#start-einzelner-services-mit-und-ohne-docker)
 1. [Hinwes zu Podman unter Linux](#hinweis-zu-podman-unter-linux)

Kurzbeschreibung
----------------

Bei dieser Anwendung handelt es sich um eine Weiterentwicklung der gleichnamigen
Aufgabe aus der Vorlesung „Webprogrammierung” im 3. Semester. Auch hier wird
eine einfache Single Page App zur Verwaltung simpler Adressdatensätze implementiert.

Diese Version beinhaltet jedoch neben der Benutzeroberfläche auch ein vollständiges
REST-Backend zur Ablage der Adressen in einer zentralen Datenbank und auch die
Struktur des Quellcodes folgt eher modernen Best Practices wie der Nutzung von
npm zur Verwaltung von Abhängigkeiten und der Nutzung eines Bundlers, um diese
dem Browser zugänglich zu machen.

Mit Docker und Docker Compose können die Bestandteile der App einzeln oder
als Gesamtprojekt ausgeführt werden.

![Screenshot 1](Screenshots/screenshot1.png)
![Screenshot 2](Screenshots/screenshot2.png)

Nutzung der Gitpod Online-IDE
----------------------------

Am einfachsten lässt sich die Anwendung in der Gitpod Online IDE starten.
Denn hier haben Sie nicht nur eine mit Visual Studio Code vergleichbare IDE
zur Verfügung, sondern auch ein vollständiges Linux-System, auf dem bereits
alle notwendigen Werkzeuge installiert sind.

Zum Testen können Sie das Git-Repository aus der Vorlesung verwenden. Sie
müssen lediglich `https://gitpod.io/#` vor die GitHub-URL schreiben, um die
IDE zu starten.

Zum Entwickeln müssen Sie allerdings ein eigenes Git-Repository anlegen:

 1. Importieren Sie den Quellcode in ein neues Git-Repository.
 1. Laden Sie das Git-Repository auf GitHub hoch und machen es public.
 1. Rufen Sie die Startseite des Git-Repositories in GitHub auf.
 1. Schreiben Sie `https://gitpod.io/#` vor die GitHub-URL, um die IDE zu starten.

Zusätzlich sollten Sie einmal die URL `https://gitpod.io/integrations` aufrufen
und dort für GitHub die Berechtigungen `public_repo` und ggf. `repo` auswählen,
um Änderungen am Quellcode aus der IDE heraus nach GitHub pushen zu können.
Andernfalls können Sie zwar Versionseinträge mit Git erzeugen, dieser aber nicht
an GitHub übertragen.

Zum Starten der Anwendung öffnen Sie ein Terminal und führen dort folgenden Befehl
aus:

```sh
./start-docker-dev.sh
```

![Terminal öffnen](Screenshots/gitpod-open-terminal.png)

![Anwendung starten](Screenshots/gitpod-start-app.png)

Bestätigen Sie die Hinweise des Skripts mit Enter und warten Sie, bis die
Konsolenausgaben des Backendservices erscheinen. GitPod sollte am rechten
Bildschirmrand darauf aufmerksam machen, dass neue TCP-Ports geöffnet wurden.

Wechseln Sie nun auf den Reiter „Ports” und erlauben Sie öffentliche Zugriffe
auf Port 3000. Diese benötigen Sie, damit die Frontend Single Page App die
in der Cloudumgebung laufenden Backendservices aufrufen kann.

![Port 3000 freigeben](Screenshots/gitpod-port-public.png)

Anschließend kopieren Sie die URL der Frontend-App und rufen diese in einem
neuen Browser-Tab auf:

![Frontend-URL kopieren](Screenshots/gitpod-copy-url.png)

![Frontend im neuen Browserfenster starten](Screenshots/gitpod-open-app.png)

Die Services starten automatisch neu, wenn eine Codeänderung erkannt wird.
Sie können daher einfach im Browser die Seite neuladen, um eine Änderung
auszuprobieren. Bei Fehlern beachten Sie bitte unbedingt die Logausgaben
im Terminal. Sie sind kryptisch, aber hilfreich!

Zum Stoppen der Anwendung wechseln Sie zurück zum Terminal und drücken
dort Strg+C.

Docker Compose auf dem eigenen Rechner
-------------------------------------

Um die Entwicklung möglichst zu vereinfachen und nicht viel Zeit mit dem Installieren
von Werkzeugen und Hilfsprogrammen zu verlieren, verwendet dieses Projekt Docker und
Docker Compose zur Verwaltung aller benötigten Dienste. Auf Ihrem Rechner benötigen
Sie daher lediglich:

 1. Eine beliebige IDE, empfohlen [Visual Studio Code](https://code.visualstudio.com/)
 2. [Docker](https://www.docker.com/products/docker-desktop/)

Beachten Sie aber die Lizenzeinschränkungen für Docker Desktop! Für den persönlichen
Gebrauch ist es kostenlos, die kommerzielle Nutzung muss aber kostenpflichtlg lizenziert
werden. Unter Linux gibt es diese Einschränkung nicht, da die Engine von Docker freie
Software ist. 😊 Alternativ können Sie unter Linux auch [Podman](https://podman.io/)
statt Docker verwenden.

Zum Starten der Anwendung rufen Sie lediglich in einer Konsole das Skript
`start-docker-dev.sh` (Linux und Mac) bzw. `start-docker-dev.bat` auf und
bestätigen die Hinweise des Skripts mit Enter. Mit Strg+C können Sie die
Anwendung wieder stoppen.

Folgende URLs können Sie zum Testen der Anwendung verwenden:

 * Backend-Service direkt: http://localhost:3000
 * Backend-Service über API-Gateway: http://localhost:8080/api
 * Frontend direkt: http://localhost:4000
 * Frontend über API-Gateway: http://localhost:8080/app
 * Datenbank-Admin: http://localhost:8081

Die Services starten automatisch neu, wenn eine Codeänderung erkannt wird.
Sie können daher einfach im Browser die Seite neuladen, um eine Änderung
auszuprobieren. Bei Fehlern beachten Sie bitte unbedingt die Logausgaben
im Terminal. Sie sind kryptisch, aber hilfreich!

Zum Stoppen der Anwendung wechseln Sie zurück zum Terminal und drücken
dort Strg+C.

Technische Hintergründe zum Startskript
--------------------------------------

Das Wurzelverzeichnis beinhaltet zwei Docker Compose Files, mit denen die
Anwendung im Entwicklungs- oder Produktivmodus gestartet werden kann:

 * `docker-compose.dev.yml`: Entwicklungsmodus mit folgenden Diensten:

     1. MongoDB (von Außen nicht erreichbar)
     2. MongoDB Admin GUI (erreichbar auf http://localhost:8081)
     3. Backend (erreichbar auf http://localhost:3000)
     4. Frontend (erreichbar auf http://localhost:4000)
     5. Gateway (erreichbar auf http://localhost:8080)

 Frontend und Backend führend den lokalen Quellcode in einer einfachen
 Node.js-Laufzeitumgebung aus. Änderungen werden dadurch sofort aktiv, wobei
 sich das Backend bei einer Änderung automatisch neustartet und bei einer
 Änderung am Frontend einfach nur die Seite im Browser neugeladen werden
 muss.

 * `docker-compose.prod.yml`: Produktivmodus mit folgenden Diensten:

     1. MongoDB (von Außen nicht erreichbar)
     2. Backend (von Außen nicht erreichbar)
     3. Frontend (von Außen nicht erreichbar)
     4. Gateway (erreichbar auf http://localhost:8080)

Im Unterschied zum Entwicklungsmodus werden hier anhand der in den jeweiligen
Verzeichnissen abgelegten Datei `Dockerfile` eigenständige Container Images
für Frontend und Backend gebaut und ausgeführt. Der Quellcode wird hierfür
einmalig in die Images hinein kopiert, so dass Änderungen daran erst wirksam
werden, wenn die Images neu erstellt werden. Dies kann entweder in den
jeweiligen Verzeichnissen manuell oder durch Neustarten von Docker Compose
erreicht werden.

Ebenso sind die meisten Services in dieser Version von Außen nicht mehr
erreichbar, sondern hinter einem Gateway-Server versteckt. Die Architektur
sieht somit in etwa so aus:

```mermaid
graph LR
    E(Externe Aufrufer) --> G[Gateway];
    G[Gateway] --> F[Frontend];
    G[Gateway] --> B[Backend];
    B[Backend] --> M[MongoDB];
```

Das Vorgehen zum Starten und Stoppen der Anwendung ohne das Hilfsskript ist
für beide Modus gleich. Lediglich der Dateiname muss in den folgenden Befehlen
angepasst werden:

 * `docker-compose -f docker-compose.dev.yml up` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

Im Falle der Produktivversion werden die Container für Frontend und Backend von
Docker Compose nur einmalig gebaut, dann aber nicht mehr erneut gebaut, wenn
sich der zugrunde liegende Quellcode verändert. Vor der nächsten Ausführung
müssen sie daher bei einer Änderung mit folgendem Befehl erneut gebaut werden:

```sh
docker-compose -f docker-compose.prod.yml build
```

In der Produktivversion kann durch Setzen der Umgebungsvariable API_URL die
Adresse des Backendservices definiert werden, mit der sich das Frontend zu
verbinden versucht:

```sh
export API_URL=http://api.beispiel.de
docker-compose -f docker-compose.prod.yml up -d
```

Dies wird auch verwendet, um die Adresse des Backendservices in der GitPod
Online-IDE zu setzen, da dort alle Services in einer Cloudumgebung ausgeführt
werden.

Dies Funktioniert, indem die Umgebungsvariable in der `docker-compose.prod.yml`
an die gleichnamige Umgebungsvariable des Frontend-Containers übergeben und
bei dessen Start durch ein Startskript ausgewertet wird. Das Skript schreibt
den Inhalt in eine statische Datei, die das Frontend unter der Addresse
`api.url` abrufen kann. Der Mechanismus ist im Grunde genommen derselbe, wie
Docker ihn für "Secrets" und "Configs" bereitstellt. Auch diese werden einfach
über eine Datei im Container sichtar gemacht. Leider bietet Docker diese
Funktion aber nur in Zusammenhang mit Docker Swarm an. Zwar lässt sich die
App unverändert auch mit Docker Swarm ausführen, dies wird hier allerdings
absichtlicht nicht beschrieben, da es auf Docker Compose aufbaut und Docker
Compose davon abgesehen für uns zunächst ausreicht.

Start einzelner Services mit und ohne Docker
--------------------------------------------

Die README-Dateien in den jeweiligen Unterverzeichnissen beschrieben, wie die
einzelnen Services mit und ohne Docker jeweils einzeln ausgeführt werden können,
um diese in Isolation zu testen. In der Regel ist jedoch einfacher, mit Docker
Compose eine komplette Entwicklungsumgebung zu starten und darauf los zu
programmieren.

Hinweis zu Podman unter Linux
-----------------------------

Unter Linux hat sich inzwischen Podman als verbreitete Alternative zu Docker
durchgesetzt, u.a. weil es ohne Root-Rechte und einen im Hintergrund laufenden
Daemon-Prozess auskommt. Alle in diesem Projekt gezeigte Befehle funktionieren
nahezu unverändert auch mit Podman. Es muss lediglich `docker` durch `podman`
bzw. `docker-compose` durch `podman-compose` ersetzt werden.

Falls Sie die vordefinierten Hilfsskripte zum Starten und Stoppen der Anwendung
verwenden wollen, passen Sie diese ganz am Ende ebenfalls entsprechend an.