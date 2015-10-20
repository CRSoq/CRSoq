/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     20/10/2015 17:15:40                          */
/*==============================================================*/


drop table if exists actividad;

drop table if exists administrador;

drop table if exists clase;

drop table if exists curso;

drop table if exists estudiante;

drop table if exists ganador;

drop table if exists modulo;

drop table if exists participa;

drop table if exists participan_por_responder;

drop table if exists pertenece;

drop table if exists pregunta;

drop table if exists profesor;

drop table if exists tiene;

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
   usuario              varchar(1024) not null,
   clave                varchar(1024) not null,
   token                varchar(1024),
   primary key (id_user)
);

/*==============================================================*/
/* Table: clase                                                 */
/*==============================================================*/
create table clase
(
   id_clase             int not null auto_increment,
   id_modulo            int not null,
   descripcion          varchar(1024),
   primary key (id_clase)
);

/*==============================================================*/
/* Table: curso                                                 */
/*==============================================================*/
create table curso
(
   id_curso             int not null auto_increment,
   id_user              int not null,
   nombre_curso         varchar(1024),
   semestre             varchar(1024),
   ano                  varchar(1024),
   primary key (id_curso)
);

/*==============================================================*/
/* Table: estudiante                                            */
/*==============================================================*/
create table estudiante
(
   id_user              int not null auto_increment,
   nombre_estudiante    varchar(1024),
   usuario              varchar(1024) not null,
   clave                varchar(1024) not null,
   token                varchar(1024),
   primary key (id_user)
);

/*==============================================================*/
/* Table: ganador                                               */
/*==============================================================*/
create table ganador
(
   id_ganador           int not null auto_increment,
   nombre_ganador       varchar(1024),
   primary key (id_ganador)
);

/*==============================================================*/
/* Table: modulo                                                */
/*==============================================================*/
create table modulo
(
   id_modulo            int not null auto_increment,
   id_curso             int not null,
   nombre_modulo        varchar(1024),
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
   id_clase             int not null,
   pregunta             varchar(1024),
   ganador_id           int,
   primary key (id_pregunta)
);

/*==============================================================*/
/* Table: profesor                                              */
/*==============================================================*/
create table profesor
(
   id_user              int not null auto_increment,
   nombre_profesor      varchar(1024),
   usuario              varchar(1024) not null,
   clave                varchar(1024) not null,
   token                varchar(1024),
   primary key (id_user)
);

/*==============================================================*/
/* Table: tiene                                                 */
/*==============================================================*/
create table tiene
(
   id_actividad         int not null,
   id_ganador           int not null,
   primary key (id_actividad, id_ganador)
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

alter table pregunta add constraint fk_se_hacen foreign key (id_clase)
      references clase (id_clase) on delete restrict on update restrict;

alter table tiene add constraint fk_tiene foreign key (id_actividad)
      references actividad (id_actividad) on delete restrict on update restrict;

alter table tiene add constraint fk_tiene2 foreign key (id_ganador)
      references ganador (id_ganador) on delete restrict on update restrict;

