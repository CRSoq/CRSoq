/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     27/11/2015 14:35:41                          */
/*==============================================================*/


drop table if exists actividad;

drop table if exists administrador;

drop table if exists clase;

drop table if exists curso;

drop table if exists estudiante;

drop table if exists modulo;

drop table if exists participa;

drop table if exists participan_por_responder;

drop table if exists pertenece;

drop table if exists pregunta;

drop table if exists profesor;

drop table if exists puede_ganar;

/*==============================================================*/
/* Table: actividad                                             */
/*==============================================================*/
create table actividad
(
   id_actividad         int not null auto_increment,
   id_clase             int,
   titulo_act           varchar(1024),
   primary key (id_actividad)
);

/*==============================================================*/
/* Table: administrador                                         */
/*==============================================================*/
create table administrador
(
   id_user              int not null auto_increment,
   usuario              varchar(250) not null,
   clave                varchar(250) not null,
   token                varchar(65),
   primary key (id_user),
   unique key ak_key_2 (usuario)
);

/*==============================================================*/
/* Table: clase                                                 */
/*==============================================================*/
create table clase
(
   id_clase             int not null auto_increment,
   id_modulo            int not null,
   fecha                date,
   descripcion          varchar(1024),
   estado_sesion        varchar(200),
   primary key (id_clase)
);

/*==============================================================*/
/* Table: curso                                                 */
/*==============================================================*/
create table curso
(
   id_curso             int not null auto_increment,
   id_user              int not null,
   nombre_curso         varchar(250),
   semestre             varchar(250),
   ano                  varchar(250),
   estado               varchar(250),
   primary key (id_curso)
);

/*==============================================================*/
/* Table: estudiante                                            */
/*==============================================================*/
create table estudiante
(
   id_user              int not null auto_increment,
   rut                  varchar(13),
   nombre               varchar(250),
   apellido             varchar(250),
   usuario              varchar(250) not null,
   clave                varchar(250) not null,
   token                varchar(65),
   primary key (id_user),
   unique key ak_key_2 (usuario)
);

/*==============================================================*/
/* Table: modulo                                                */
/*==============================================================*/
create table modulo
(
   id_modulo            int not null auto_increment,
   id_curso             int not null,
   nombre_modulo        varchar(250),
   posicion             varchar(200),
   primary key (id_modulo)
);

/*==============================================================*/
/* Table: participa                                             */
/*==============================================================*/
create table participa
(
   id_user              int not null,
   id_actividad         int not null,
   primary key (id_user, id_actividad)
);

/*==============================================================*/
/* Table: participan_por_responder                              */
/*==============================================================*/
create table participan_por_responder
(
   id_user              int not null,
   id_pregunta          int not null,
   primary key (id_user, id_pregunta)
);

/*==============================================================*/
/* Table: pertenece                                             */
/*==============================================================*/
create table pertenece
(
   id_user              int not null,
   id_curso             int not null,
   primary key (id_user, id_curso)
);

/*==============================================================*/
/* Table: pregunta                                              */
/*==============================================================*/
create table pregunta
(
   id_pregunta          int not null auto_increment,
   id_curso             int not null,
   id_clase             int,
   id_user              int not null,
   pregunta             varchar(1024),
   primary key (id_pregunta)
);

/*==============================================================*/
/* Table: profesor                                              */
/*==============================================================*/
create table profesor
(
   id_user              int not null auto_increment,
   nombre               varchar(250),
   apellido             varchar(250),
   usuario              varchar(250) not null,
   clave                varchar(250) not null,
   token                varchar(65),
   primary key (id_user),
   unique key ak_key_2 (usuario)
);

/*==============================================================*/
/* Table: puede_ganar                                           */
/*==============================================================*/
create table puede_ganar
(
   id_user              int not null,
   id_actividad         int not null,
   primary key (id_user, id_actividad)
);

alter table actividad add constraint fk_se_realizan foreign key (id_clase)
      references clase (id_clase) on delete restrict on update restrict;

alter table clase add constraint fk_contiene foreign key (id_modulo)
      references modulo (id_modulo) on delete restrict on update restrict;

alter table curso add constraint fk_realiza foreign key (id_user)
      references profesor (id_user) on delete restrict on update restrict;

alter table modulo add constraint fk_se_compone foreign key (id_curso)
      references curso (id_curso) on delete restrict on update restrict;

alter table participa add constraint fk_participa foreign key (id_user)
      references estudiante (id_user) on delete restrict on update restrict;

alter table participa add constraint fk_participa2 foreign key (id_actividad)
      references actividad (id_actividad) on delete restrict on update restrict;

alter table participan_por_responder add constraint fk_participan_por_responder foreign key (id_user)
      references estudiante (id_user) on delete restrict on update restrict;

alter table participan_por_responder add constraint fk_participan_por_responder2 foreign key (id_pregunta)
      references pregunta (id_pregunta) on delete restrict on update restrict;

alter table pertenece add constraint fk_pertenece foreign key (id_user)
      references estudiante (id_user) on delete restrict on update restrict;

alter table pertenece add constraint fk_pertenece2 foreign key (id_curso)
      references curso (id_curso) on delete restrict on update restrict;

alter table pregunta add constraint fk_gana foreign key (id_user)
      references estudiante (id_user) on delete restrict on update restrict;

alter table pregunta add constraint fk_posee foreign key (id_curso)
      references curso (id_curso) on delete restrict on update restrict;

alter table pregunta add constraint fk_se_hacen foreign key (id_clase)
      references clase (id_clase) on delete restrict on update restrict;

alter table puede_ganar add constraint fk_puede_ganar foreign key (id_user)
      references estudiante (id_user) on delete restrict on update restrict;

alter table puede_ganar add constraint fk_puede_ganar2 foreign key (id_actividad)
      references actividad (id_actividad) on delete restrict on update restrict;

