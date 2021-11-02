/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     05-05-2016 8:07:28                           */
/*==============================================================*/

drop table if exists tema;

drop table if exists topico;

drop table if exists actividad;

drop table if exists administrador;

drop table if exists asignatura;

drop table if exists biblioteca_preguntas;

drop table if exists calendario;

drop table if exists clase;

drop table if exists curso;

drop table if exists estudiante;

drop table if exists modulo;

drop table if exists participa;

drop table if exists participan_por_responder;

drop table if exists pertenece;

drop table if exists pregunta;

drop table if exists profesor;

/*==============================================================*/
/* Table: tema                                                  */
/*==============================================================*/
create table tema (
  id_tema 				int not null auto_increment,
  nombre 				varchar(250) not null,
  id_topico 			int not null,
  primary key (id_tema),
  UNIQUE KEY unique_nombre (nombre, id_topico)
);

/*==============================================================*/
/* Table: topico                                                */
/*==============================================================*/
create table topico (
  id_topico 			int not null auto_increment,
  nombre 				varchar(250) not null,
  id_asignatura 		int not null,
  primary key (id_topico),
  UNIQUE KEY unique_nombre (nombre, id_asignatura)
);

/*==============================================================*/
/* Table: actividad                                             */
/*==============================================================*/
create table actividad
(
   id_actividad         int not null auto_increment,
   id_clase             int default null,
   id_curso             int not null,
   titulo_act           varchar(1024),
   estado_actividad     varchar(50),
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
   token                varchar(129),
   primary key (id_user)
);

/*==============================================================*/
/* Table: asignatura                                            */
/*==============================================================*/
create table asignatura
(
   id_asignatura        int not null auto_increment,
   nombre_asignatura    varchar(250) not null,
   primary key (id_asignatura)
);

/*==============================================================*/
/* Table: biblioteca_preguntas                                  */
/*==============================================================*/
create table biblioteca_preguntas
(
   id_b_pregunta        int not null auto_increment,
   id_asignatura        int not null,
   b_pregunta           varchar(1024),
   id_tema 				int,
   primary key (id_b_pregunta)
);

/*==============================================================*/
/* Table: calendario                                            */
/*==============================================================*/
create table calendario
(
   id_calendario        int not null auto_increment,
   ano                  int not null,
   semestre             int not null,
   primary key (id_calendario, ano, semestre)
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
   id_asignatura        int not null,
   id_calendario        int not null,
   ano                  int not null,
   semestre             int not null,
   grupo_curso          varchar(10) not null,
   id_user              int not null,
   estado_curso         varchar(250),
   nombre_curso         varchar(250),
   meta                 int,
   meta_alumno			int default 12,
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
   token                varchar(129),
   primary key (id_user),
   UNIQUE KEY unique_usuario (usuario)
);

/*==============================================================*/
/* Table: modulo                                                */
/*==============================================================*/
create table modulo
(
   id_modulo            int not null auto_increment,
   id_curso             int not null,
   nombre_modulo        varchar(250),
   posicion             int,
   primary key (id_modulo)
);

/*==============================================================*/
/* Table: participa                                             */
/*==============================================================*/
create table participa
(
   id_user              int not null,
   id_actividad         int not null,
   estado_part_act      varchar(15) not null,
   primary key (id_user, id_actividad)
);

/*==============================================================*/
/* Table: participan_por_responder                              */
/*==============================================================*/
create table participan_por_responder
(
   id_user              int not null,
   id_pregunta          int not null,
   estado_part_preg     varchar(15) not null,
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
   id_clase             int,
   id_b_pregunta        int,
   id_curso             int not null,
   estado_pregunta      varchar(50),
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
   token                varchar(129),
   primary key (id_user),
   UNIQUE KEY unique_usuario (usuario)
);

alter table tema add constraint fk_pertenece_a2 foreign key (id_topico) 
references topico (id_topico) on delete cascade on update restrict;

alter table topico add constraint fk_pertenece_a3 foreign key (id_asignatura) 
references asignatura (id_asignatura) on delete cascade on update restrict;

alter table actividad add constraint fk_se_realizan foreign key (id_clase)
references clase (id_clase) on delete restrict on update restrict;

alter table actividad add constraint fk_tiene foreign key (id_curso)
references curso (id_curso) on delete restrict on update restrict;

alter table biblioteca_preguntas add constraint fk_disponible foreign key (id_asignatura)
references asignatura (id_asignatura) on delete restrict on update restrict;

alter table biblioteca_preguntas add constraint fk_pertenece_a foreign key (id_tema)
references tema (id_tema) on delete restrict on update restrict;

alter table clase add constraint fk_contiene foreign key (id_modulo)
references modulo (id_modulo) on delete restrict on update restrict;

alter table curso add constraint fk_dicta foreign key (id_calendario, ano, semestre)
references calendario (id_calendario, ano, semestre) on delete restrict on update restrict;

alter table curso add constraint fk_instancia foreign key (id_asignatura)
references asignatura (id_asignatura) on delete restrict on update restrict;

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

alter table pregunta add constraint fk_instancia_pregunta foreign key (id_b_pregunta)
references biblioteca_preguntas (id_b_pregunta) on delete restrict on update restrict;

alter table pregunta add constraint fk_se_asocia foreign key (id_curso)
references curso (id_curso) on delete restrict on update restrict;

alter table pregunta add constraint fk_se_hacen foreign key (id_clase)
references clase (id_clase) on delete restrict on update restrict;

insert into administrador values(1,"admin","adminCRSoq",null);


