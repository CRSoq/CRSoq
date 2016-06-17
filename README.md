# Sistema CRSoq (1.0.1)

Este para el servidor ocupa [NodeJS](https://nodejs.org/en/) junto al framework [ExpressJS](http://expressjs.com/es/) y para la comunicación entre  nodos se ocupa [Socket.IO](http://socket.io/), en la parte del cliente se ocupa [AngularJS](http://angularjs.org/) junto a [Angular Material](https://material.angularjs.org/latest/).


## Instalación

1.- Instalar
- [NodeJS](https://nodejs.org/en/) al menos en su versión 4.4.5.
- [Bower](https://bower.io/)

2.- Obtener el código, ya sea [descargandolo](https://yordan_vera_castillo@bitbucket.org/yordan_vera_castillo/crs.git) o utilizando [Git](https://git-scm.com/) y clonando el código

```
git clone https://yordan_vera_castillo@bitbucket.org/yordan_vera_castillo/crs.git
cd crs
```

3.- Instalar dependencia

```
npm install
```

Al momento de ejecutar este último comando, también se ejecutara `bower install`, que instalará las dependencias del frontend.
Al finalizar esta etapa en la carpeta del proyecto se crearán dos carpetas.

* `node_modules`
* `app/bower_components`

### Configurar sistema

Una vez instalado el sistema y sus dependencias es necesario configurar nuestro usuario, ip del servidor, etc.

1.- rellenar los datos del servidor (backend), la ip (server_ip) y puerto (server_port) que se ingrese aquí debe ser la misma que se ingrese en el frontend.

```
/server/config.js
```

2.- rellnar los datos del frontend, la ip (server_ip) y puerto del servidor (server_port) deben ser las mismas que se ingreso en el backend, por que ahí es donde se conectarán los usuarios.

```
/app/js/config.js
```


### Iniciar sistema

Una vez configurado el servidor y cliente queda listo para iniciar el servidor.

```
node /server/server.js
```

Ahora puede abrir un navegador y empezar a ocupar el sistema CRSoq en: `http://(server_ip):(server_port)/`.

## Contacto

Yordan Vera Castillo: yordanveracastillo@gmail.com