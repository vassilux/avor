----------
###avor  
----------

###Installation de l'application avor et paramétrage de serveur apache.

Créer le répertoire /var/www/avor/.

Copier le fichier avoir_[version].tar.gz dans ce répertoire /var/www/avor/.

Placer dans le répertoire cd /var/www/avor

Decompresser le fichier avoir_[version].tar.gz

Créer le lien symbolic ln -s /var/www/avoir/avoir_[version] /var/www/avor/current

###Paramétrage de serveur apache
Créer le fichier dans /etc/apache2/sites-available/avor avec le contenu , l'example de port est 81


> **Example:**
>
``` xml
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
```

Modifier le fichier /etc/apache2/ports.conf pour ajouter le port (dans notre cas le port 81) Listen 81

Activer le site a2ensite avor. 

Activer le module d'apache rewrite: a2enmod rewrite. Ce module est utilsié pour la gestion de routage de html5.

Site associé à l'applicaiton avor peut être desactiver a2dissite avor.

Redémarrer le serveur web apache pour la prise en compte de cette modification : /etc/init.d/apache2 restart
