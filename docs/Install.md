----------
###avor  
----------

###Installation de l'application avor et paramétrage de serveur apache.

Créer le répertoire  avoir <b>mkdir /var/www/avor</b>.

Copier le fichier avoir_[version].tar.gz dans ce répertoire /opt.

Decompresser le fichier avor_[version].tar.gz  <b>tar xzf avoir_[version].tar.gz</b>

Créer le lien symbolic <b>ln -s /opt/avoir_[version] /var/www/avor/current</b>

###Paramétrage de serveur apache

Modifier le fichier /etc/apache2/ports.conf pour ajouter le port (dans notre cas le port 81) Listen 81

Activer le module d'apache rewrite: <b>a2enmod rewrite</b>. Ce module est utilsié pour la gestion de routage de html5.

Redémarrer le serveur apache <b>service apache2 restart</b>

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



Activer le site en executant commande <b>a2ensite avor</b>. 

Note:
En cas de desinstallation la desactivaziton de site peut se faire via commande <b>a2dissite avor</b>.

Redémarrer le serveur web apache pour la prise en compte de cette modification : service apache2 restart<b>

Editer le fichier <b>config.json</b> et changer l'adresse de serveur et le port de serveur pour l'adresse publique de serveur.

