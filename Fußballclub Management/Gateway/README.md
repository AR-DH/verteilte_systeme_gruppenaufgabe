Adressbuch: Gateway
===================

Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 1. [Konfiguration des Gateway-Servers](#konfiguration-das-gateway-servers)
 1. [Start mit Docker Compose](#start-mit-docker-compose)
 1. [Produktives Container Image bauen](#produktives-container-image-bauen)

Kurzbeschreibung
----------------

Dies ist der Gateway-Server des Adressbuch-Beispiels, der alle Einzelservices
der Anwendung hinter einem zentralen HTTP-Endpunkt verbirgt. Für die Entwicklung
ist es tatsächlich besser, jeden Service über eine localhost-Adresse des eigenen
Rechners direkt ansprechen zu können. Setzt sich eine Anwendung allerdings aus
mehreren Backend-Services zusammen, ist es meist vorteilhaft, diese Struktur
nach Außen hin zu verbergen und die Services über eine einheitliche Adresse
aufrufbar zu machen. Somit müssen die Verwender der Services (inkl. dem
Web-Frontend oder etwaigen Mobile Apps) die Backend-Struktur nicht kennen und
die Struktur kann in gewissem Rahmen frei verändert werden.

Technisch wird dies durch einen HTTP Reverse Proxy realisiert, der unter einer
einheitlichen Webadresse wie https://myapp.beispiel.de/ angesprochen werden
kann und alle HTTP-Anfragen an die Backend-Services weiterleitet. Hierfür
besitzt der Proxy verschiedene Routingregeln, die meist einfach den Pfad der
angesprochenen URL auswerten und anhand dessen den richtigen Backend-Service
adressieren. Hier im Beispiel sind dies folgende Routingregeln:

 * Pfad beginnt mit `/app/`: Weiterleitung an den `frontend`-Service
 * Pfad beginnt mit `/api/`: Weiterleitung an den `backend`-Service

Wichtig ist, dass der Gateway-Server und die Backendservices in einem gemeinsamen
internen Netzwerk laufen (hier durch Docker als virtuelles Netzwerk abgebildet)
so dass die Backendservices aus dem freien Internet nicht direkt aufrufbar sind.
Lediglich der Gateway-Server besitzt eine öffentliche Adresse, so dass wirklich
alle Anfragen über ihn laufen müssen. Dadurch bietet sich dann auch die Möglichkeit,
Sicherheitsprüfungen und andere Policies zu zentralisieren.

Ob die Webanwendung (hier durch den `frontend`-Service bereitgestellt) über
das Gateway oder eine eigene Domain aufgerufen wird, ist Geschmackssache und
hängt auch ein wenig von der Gesamtarchitektur der Anwendung ab. Dann häufig
verwenden Frontend und Backend auch getrennte URLs wir https://www.beispiel.de
für das Frontend und https://api.beispiel.de für das Backend, wobei beide
Teile auch auf unterschiedlicher Infrastruktur laufen. Meist besitzen die
Anwendungen dann aber auch deutlich mehr als nur einen REST-Backendservice,
so dass die Verwendung eines zentralen Gateway-Servers weiterhin gerechtfertig
ist. Hier gehen wir allerdings davon aus, dass Frontend und Backend in der
gleichen Serverlandschaft betrieben werden und somit beide über den Gateway-Server
aufrufbar sein sollten.

Als Proxy bzw. Gateway-Server wird hier [nginx](https://www.nginx.org) verwendet.
Dieser hat sich aufgrund seiner kompakten Größe und hohen Flexibilität als eine
Art Standard im Cloud-Umfeld bewährt. Viele kommerzielle oder freie Gatewy-Server
sowie Ingress-Router basieren im Kern auf nginx mit einer schönen Benutzeroberfläche
drumherum.

Konfiguration des Gateway-Servers
---------------------------------

Kommerzielle Produkte bieten oft eine grafische Benutzeroberfläche, mit der
die Routing-Regeln und Policies eines Gateway-Servers konfiguriert werden
können. Jedoch ist es im Sinne von "Infrastructure as Code" auch vorteilhaft,
die Konfiguration in einer Konfigurationsdatei zu beschreiben und diese wie
den restlichen Quellcode der Anwendung zu versionieren und zu verwalten.
Somit reicht die Open-Source-Version von nginx für unsere Zwecke vollkommen
aus.

Die Konfiguration befindet sich in der Datei `default.conf`. Die Datei sollte
hinreichend kommentiert sein, um eigene Anpassungen zu ermöglichen. Zumal sie
auch nicht sehr kompliziert aufgebaut ist. Im Zweifelsfall hilft natürlich
immer ein Blick in die [Dokumentation von nginx](https://nginx.org/en/docs/)
wobei hier insbesondere der alphabetische Index aller "Directiven" nützlich ist.

Start mit Docker Compose
------------------------

Am einfachsten lässt sich die App mit Docker Compose aus dem Wurzelverzeichnis
heraus starten. Das dort abgelegte README beschriebt die dafür notwendigen
Befehle im Detail:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

Der nachfolgende Abschnitt in dieser Datei beschreiben hingegen, was dabei im
Hintergrund passiert bzw. wie das Gateway isoliert gestartet werden kann.

Produktives Container-Image bauen
---------------------------------

Für den Produktivbetrieb konfiguriert das beigefügte `Dockerfile` einen `nginx`
Webserver als Reverse Proxy bzw. Gateway-Server (beide Begriffe sind hier weitgehend
synonym zu verstehen). Folgende Befehle werden hierfür benötigt:

 * `docker build -t adressbuch-gateway .` zum Bauen des Containers
 * `docker run -d -p 8080:81 --net adressbuch --name gateway adressbuch-gateway` zum Ausführen des Containers
 * `docker container stop gateway` zum Stoppen des Containers
 * `docker system prune` zum Aufräumen nicht mehr benötigter Daten

Das `Dockerfile` wird auch verwendet, wenn im Wurzelverzeichnis mit Docker
Compose die Datei `docker-compose.prod.yml` ausgeführt wird. Der Container wird
im Grunde genommen damit auch auf die gleiche Art gestartet.
