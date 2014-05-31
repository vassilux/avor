Installation de l'application avor avec le serveur web apache

1.Créer le répertoire /var/www/avor/[version de l'application ] par example pour la version 1.0.0 le chemin complet de répertoire sera 
/var/www/avor/1.0.0
2.Créer le fichier dans /etc/apache2/sites-available/avor avec le contenu , l'example de port est 81

<VirtualHost *:81>
    ServerAdmin webmaster@localhost

    DocumentRoot /var/www/avor/current

        <Directory /var/www/avor/current>
                Options SymLinksIfOwnerMatch
                AllowOverride All
                Order deny,allow
                allow from all
        </Directory>
</VirtualHost>
3.Créer le linet ln -s /var/www/$1/releasesavoir/1.0.0. /var/www/current
4.Activé le site a2ensite avoir. Site associé à l'applicaiton avor peut être desactiver a2dissite avor
5.Redémarrer le serveur web apache pour la prise en compte de cette modification : /etc/init.d/apache2 restart