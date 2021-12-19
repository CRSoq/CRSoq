-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-12-2021 a las 23:24:08
-- Versión del servidor: 10.4.19-MariaDB
-- Versión de PHP: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `crs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id_actividad` int(11) NOT NULL,
  `id_clase` int(11) DEFAULT NULL,
  `id_curso` int(11) NOT NULL,
  `titulo_act` varchar(1024) DEFAULT NULL,
  `estado_actividad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `actividad`
--

INSERT INTO `actividad` (`id_actividad`, `id_clase`, `id_curso`, `titulo_act`, `estado_actividad`) VALUES
(1, 1, 1, 'actividad1', 'iniciada'),
(2, 3, 1, 'actividad2', 'iniciada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id_user` int(11) NOT NULL,
  `usuario` varchar(250) NOT NULL,
  `clave` varchar(250) NOT NULL,
  `token` varchar(129) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`id_user`, `usuario`, `clave`, `token`) VALUES
(1, 'admin', 'adminCRSoq', '61403f9e2b69f594ca67516c67257cd0b514c31c993b3cf651df7f5506686b6978657323cf1996cb22c911efadc8fc8502337be9e5338d345db571079afa0d61');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `id_asignatura` int(11) NOT NULL,
  `nombre_asignatura` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignatura`
--

INSERT INTO `asignatura` (`id_asignatura`, `nombre_asignatura`) VALUES
(1, 'Base de Datos'),
(2, 'Proyecto III');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `biblioteca_preguntas`
--

CREATE TABLE `biblioteca_preguntas` (
  `id_b_pregunta` int(11) NOT NULL,
  `id_asignatura` int(11) NOT NULL,
  `b_pregunta` varchar(1024) DEFAULT NULL,
  `id_tema` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `biblioteca_preguntas`
--

INSERT INTO `biblioteca_preguntas` (`id_b_pregunta`, `id_asignatura`, `b_pregunta`, `id_tema`) VALUES
(1, 1, 'pregunta_biblio1', NULL),
(2, 1, 'pregunta_biblio2', NULL),
(3, 1, 'pregunta_biblio3', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendario`
--

CREATE TABLE `calendario` (
  `id_calendario` int(11) NOT NULL,
  `ano` int(11) NOT NULL,
  `semestre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `calendario`
--

INSERT INTO `calendario` (`id_calendario`, `ano`, `semestre`) VALUES
(1, 2021, 2),
(2, 2021, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase`
--

CREATE TABLE `clase` (
  `id_clase` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `descripcion` varchar(1024) DEFAULT NULL,
  `estado_sesion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `clase`
--

INSERT INTO `clase` (`id_clase`, `id_modulo`, `fecha`, `descripcion`, `estado_sesion`) VALUES
(1, 1, '2021-10-22', 'clase1', 'cerrada'),
(2, 3, '2021-10-26', 'clase random', 'cerrada'),
(3, 2, '2021-10-26', 'clase2', 'cerrada'),
(4, 1, '2021-10-26', 'clase3', 'cerrada'),
(5, 1, '2021-10-28', 'clase4', 'cerrada'),
(6, 2, '2021-11-11', 'clase5', 'cerrada'),
(7, 1, '2021-11-13', 'clase6', 'cerrada'),
(10, 2, '2021-11-13', 'clase7', 'cerrada'),
(13, 2, '2021-11-14', 'clase9', 'cerrada'),
(14, 2, '2021-11-14', 'clase8', 'cerrada'),
(15, 2, '2021-11-14', 'clase19', 'cerrada'),
(17, 7, '2021-11-14', 'clase 1_b', 'iniciada'),
(18, 2, '2021-11-23', 'clase_prueba1', 'cerrada'),
(20, 2, '2021-12-02', 'clase_prueba2', 'cerrada'),
(21, 2, '2021-12-07', 'clase_prueba3', 'cerrada'),
(22, 2, '2021-12-19', 'clase_prueba4', 'iniciada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `id_asignatura` int(11) NOT NULL,
  `id_calendario` int(11) NOT NULL,
  `ano` int(11) NOT NULL,
  `semestre` int(11) NOT NULL,
  `grupo_curso` varchar(10) NOT NULL COMMENT 'grupo curso',
  `id_user` int(11) NOT NULL,
  `estado_curso` varchar(250) DEFAULT NULL,
  `nombre_curso` varchar(250) DEFAULT NULL,
  `meta` int(11) DEFAULT NULL,
  `meta_alumno` int(11) DEFAULT 12
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`id_curso`, `id_asignatura`, `id_calendario`, `ano`, `semestre`, `grupo_curso`, `id_user`, `estado_curso`, `nombre_curso`, `meta`, `meta_alumno`) VALUES
(1, 1, 2, 2021, 1, 'A', 1, NULL, 'Base de Datos', 120, 12),
(2, 2, 2, 2021, 1, 'A', 1, NULL, 'Proyecto III', NULL, 12),
(3, 1, 2, 2021, 1, 'B', 1, NULL, 'Base de Datos', 50, 12),
(4, 1, 2, 2021, 1, 'C', 1, NULL, 'Base de Datos', 21, 12),
(5, 1, 2, 2021, 1, 'D', 1, NULL, 'Base de Datos', 26, 12),
(6, 2, 2, 2021, 1, 'E', 1, NULL, 'Proyecto III', NULL, 12),
(7, 2, 2, 2021, 1, 'C', 1, NULL, 'Proyecto III', NULL, 12),
(8, 1, 2, 2021, 1, 'F', 1, NULL, 'Base de Datos', NULL, 12),
(9, 1, 2, 2021, 1, 'J', 1, NULL, 'Base de Datos', NULL, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `id_equipo` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `nombre_equipo` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`id_equipo`, `id_curso`, `nombre_equipo`) VALUES
(1, 1, 'equipo 1'),
(2, 1, 'equipo 2'),
(3, 1, 'equipo 3'),
(4, 1, 'equipo 4'),
(5, 1, 'equipo 5'),
(6, 3, 'Equipo 1'),
(7, 2, 'Equipo 11'),
(8, 2, 'Equipo 22'),
(9, 1, 'equipo 6'),
(10, 3, 'Equipo 2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo_alumnos`
--

CREATE TABLE `equipo_alumnos` (
  `id_equipo` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `estado_part` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `equipo_alumnos`
--

INSERT INTO `equipo_alumnos` (`id_equipo`, `id_user`, `estado_part`) VALUES
(1, 1, 'Nominado'),
(1, 2, 'noDisponible'),
(2, 3, 'Disponible'),
(2, 4, 'Disponible'),
(2, 8, 'Disponible'),
(3, 5, 'Disponible'),
(3, 6, 'Disponible'),
(4, 7, 'Disponible'),
(5, 11, 'Disponible'),
(6, 1, 'Disponible'),
(6, 5, 'Disponible'),
(6, 11, 'Disponible'),
(7, 101, 'Disponible'),
(8, 1, 'Disponible'),
(9, 10, 'Disponible'),
(10, 2, 'Disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id_user` int(11) NOT NULL,
  `rut` varchar(13) DEFAULT NULL,
  `nombre` varchar(250) DEFAULT NULL,
  `apellido` varchar(250) DEFAULT NULL,
  `usuario` varchar(250) NOT NULL,
  `clave` varchar(250) NOT NULL,
  `token` varchar(129) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id_user`, `rut`, `nombre`, `apellido`, `usuario`, `clave`, `token`) VALUES
(1, '18.888.333-3', 'Kevin', 'Rodriguez', 'testAlumno', 'test', '9b4e5274c49e9c5419db0d15e162105b4a162e7dc4c7b7e531c735279e0039bf280be122aa1eab0372c351d0a4553605b85da1d9f5a47251f23aadc4e3475653'),
(2, '18.827.647-4', 'juan', 'perez', 'testAlumno1', 'test1', '432c993cbc15a5524fbbbf312f30bc242d93fe681c1aeaeb350a637f18aeef40d7e4c9d480fe1d124857b368166e865927c7d4af1f1daff1577e00c8db07db6d'),
(3, '18.123.456-1', 'carlos', 'menem', 'testAlumno2', 'test', 'd77da77db8f1eb763dbe8446b28eecd852929c5fe3fa5556d8ffa369449b0ba2b4c80e9533dfafe57c438bb3a3c6c7be998a0e8a17512b6312cb6687e13a7310'),
(4, '18.123.116-2', 'elba', 'calao', 'testAlumno3', 'test', '7b8899823cbd5066ce5b3961b00bc5c1eb91d8973606b3c5c9a7082d430ee9f3fe42dbd9da189300a505cea944b9a47918b7c082b66b091a08a68d20f74145ac'),
(5, '16.894.294-K', 'Diana', 'Albert', 'testAlumno5', 'test', NULL),
(6, '26.677.307-2', 'Debora', 'Agudo', 'testAlumno6', 'test', NULL),
(7, '20.003.037-0', 'Cesar', 'Acevedo', 'testAlumno7', 'test', NULL),
(8, '20.411.024-7', 'Fabio', 'Gonzales', 'testAlumno8', 'test', NULL),
(9, '12.284.345-k', 'mirta', 'moreno', 'testAlumno9', 'test', NULL),
(10, '2.959.644-1', 'Dayne', 'Mohr', 'facilis', 'tempore', NULL),
(11, '4.988.052-9', 'Peter', 'Hand', 'laborum', 'distinctio', NULL),
(12, '7.143.216-5', 'Jevon', 'Will', 'asperiores', 'quia', NULL),
(13, 'quisquam', 'Enrique', 'Nader', 'nulla', 'voluptatem', NULL),
(14, 'dolores', 'Nayeli', 'Stanton', 'ab', 'non', NULL),
(15, 'possimus', 'Jordane', 'Hettinger', 'voluptas', 'inventore', NULL),
(16, 'asperiores', 'Justus', 'Klein', 'doloribus', 'quis', NULL),
(17, 'similique', 'Toby', 'Armstrong', 'recusandae', 'quam', NULL),
(18, 'occaecati', 'Myrtie', 'Konopelski', 'quasi', 'quis', NULL),
(19, 'distinctio', 'Jamir', 'Greenfelder', 'rerum', 'mollitia', NULL),
(20, 'quasi', 'Delta', 'Schaden', 'alias', 'placeat', NULL),
(21, 'corporis', 'Wilmer', 'Keeling', 'quia', 'ut', NULL),
(22, 'ipsum', 'Kole', 'Mante', 'ad', 'minus', NULL),
(23, 'assumenda', 'Jewel', 'Lebsack', 'est', 'vero', NULL),
(24, 'exercitatione', 'Izabella', 'Homenick', 'eos', 'consequuntur', NULL),
(25, 'voluptatem', 'Eddie', 'Hane', 'corrupti', 'rerum', NULL),
(26, 'omnis', 'Elijah', 'Moore', 'culpa', 'et', NULL),
(27, 'accusantium', 'Jan', 'Nolan', 'necessitatibus', 'et', NULL),
(28, 'nihil', 'Tomasa', 'Jacobs', 'laudantium', 'nesciunt', NULL),
(29, 'quam', 'Corbin', 'Funk', 'nostrum', 'accusantium', NULL),
(30, 'et', 'Judah', 'Dach', 'tempore', 'commodi', NULL),
(31, 'molestiae', 'Angelina', 'Corwin', 'sit', 'eaque', NULL),
(32, 'molestias', 'Abbigail', 'Christiansen', 'maiores', 'qui', NULL),
(33, 'sequi', 'Royal', 'Wuckert', 'ex', 'tempore', NULL),
(34, 'deserunt', 'Darrell', 'Tremblay', 'ut', 'ipsam', NULL),
(35, 'quibusdam', 'Hubert', 'Heller', 'eum', 'perferendis', NULL),
(36, 'aliquam', 'Leonie', 'Leuschke', 'exercitationem', 'a', NULL),
(37, 'excepturi', 'Bryon', 'Carter', 'inventore', 'iure', NULL),
(38, 'ad', 'Alanna', 'Moore', 'a', 'at', NULL),
(39, 'similique', 'Arnold', 'Huel', 'explicabo', 'quo', NULL),
(40, 'illum', 'Joe', 'Quigley', 'natus', 'excepturi', NULL),
(41, 'quis', 'Cora', 'Bode', 'corporis', 'autem', NULL),
(42, 'quia', 'Abbigail', 'Halvorson', 'quidem', 'temporibus', NULL),
(43, 'facere', 'Raheem', 'Sipes', 'sint', 'quidem', NULL),
(44, 'architecto', 'Jillian', 'Tromp', 'voluptatum', 'sapiente', NULL),
(45, 'ut', 'Mohamed', 'Rutherford', 'accusantium', 'aliquam', NULL),
(46, 'et', 'Alia', 'Kihn', 'blanditiis', 'praesentium', NULL),
(47, 'voluptate', 'Raul', 'Balistreri', 'praesentium', 'iusto', NULL),
(48, 'asperiores', 'Norris', 'Hyatt', 'molestias', 'aut', NULL),
(49, 'dolor', 'Destiney', 'Kertzmann', 'voluptates', 'sed', NULL),
(50, 'et', 'Ken', 'Weber', 'minima', 'illo', NULL),
(51, 'nesciunt', 'Reid', 'Sanford', 'quaerat', 'voluptate', NULL),
(52, 'aspernatur', 'Solon', 'Swaniawski', 'sed', 'velit', NULL),
(53, 'cumque', 'Rasheed', 'Upton', 'non', 'rerum', NULL),
(54, 'quo', 'Skylar', 'Runte', 'veritatis', 'molestiae', NULL),
(55, 'ipsa', 'Tamia', 'Champlin', 'cum', 'quaerat', NULL),
(56, 'et', 'Isom', 'O Reilly', 'autem', 'ut', NULL),
(57, 'est', 'Tracy', 'Marks', 'qui', 'ipsum', NULL),
(58, 'qui', 'Kara', 'Breitenberg', 'perspiciatis', 'nostrum', NULL),
(59, 'voluptate', 'Connie', 'Hickle', 'doloremque', 'rerum', NULL),
(60, 'aut', 'Ona', 'Hartmann', 'nemo', 'voluptas', NULL),
(61, 'libero', 'America', 'Rutherford', 'magni', 'voluptas', NULL),
(62, 'beatae', 'Omer', 'Oberbrunner', 'eligendi', 'dolore', NULL),
(63, 'odio', 'Doug', 'Fahey', 'laboriosam', 'omnis', NULL),
(64, 'omnis', 'Myles', 'Stracke', 'distinctio', 'reiciendis', NULL),
(65, 'ut', 'Beau', 'Kozey', 'ea', 'aut', NULL),
(66, 'et', 'Earl', 'Runolfsson', 'nihil', 'consequuntur', NULL),
(67, 'enim', 'Bertha', 'Sipes', 'aut', 'nam', NULL),
(68, 'et', 'Brandy', 'Wilkinson', 'id', 'vitae', NULL),
(69, 'unde', 'Maddison', 'OKeefe', 'quibusdam', 'id', NULL),
(70, 'libero', 'Abigayle', 'Orn', 'ipsum', 'nihil', NULL),
(71, 'ipsa', 'Sienna', 'West', 'veniam', 'molestiae', NULL),
(72, 'aut', 'Brionna', 'Kuhlman', 'repellat', 'est', NULL),
(73, 'ex', 'Royce', 'Lindgren', 'dolorem', 'molestiae', NULL),
(74, 'placeat', 'Adrian', 'Von', 'similique', 'ut', NULL),
(75, 'a', 'Georgiana', 'Mertz', 'sunt', 'voluptatibus', NULL),
(76, 'voluptas', 'Violet', 'Haley', 'quod', 'odio', NULL),
(77, 'autem', 'Dayne', 'Smith', 'consequatur', 'sit', NULL),
(78, 'sed', 'Giovanna', 'Huels', 'repellendus', 'mollitia', NULL),
(79, 'totam', 'Sallie', 'Grady', 'illum', 'numquam', NULL),
(80, 'aut', 'Nikita', 'Stiedemann', 'sequi', 'eaque', NULL),
(81, 'non', 'Reilly', 'Monahan', 'enim', 'nihil', NULL),
(82, 'neque', 'King', 'Dooley', 'consectetur', 'facilis', NULL),
(83, 'non', 'Vida', 'Stracke', 'fugit', 'esse', NULL),
(84, 'reiciendis', 'Laverna', 'Luettgen', 'odit', 'sit', NULL),
(85, 'tempora', 'Angeline', 'Parker', 'voluptatem', 'qui', NULL),
(86, 'occaecati', 'Christine', 'Hessel', 'hic', 'laboriosam', NULL),
(87, 'quo', 'Payton', 'Jacobi', 'excepturi', 'modi', NULL),
(88, 'molestias', 'Shemar', 'Zboncak', 'repudiandae', 'quia', NULL),
(89, 'qui', 'Jovani', 'Rowe', 'optio', 'laboriosam', NULL),
(90, 'voluptatem', 'Anya', 'Erdman', 'rem', 'fugiat', NULL),
(91, 'ipsum', 'Rosetta', 'Aufderhar', 'sapiente', 'tempora', NULL),
(92, 'quidem', 'Ettie', 'Bernier', 'fugiat', 'autem', NULL),
(93, 'tenetur', 'Sadye', 'Langosh', 'odio', 'beatae', NULL),
(94, 'inventore', 'Tre', 'Robel', 'placeat', 'iure', NULL),
(95, 'esse', 'Abigail', 'Marvin', 'nisi', 'enim', NULL),
(96, 'sint', 'Yvonne', 'Prosacco', 'iure', 'nisi', NULL),
(97, 'eos', 'Sallie', 'Bartell', 'debitis', 'quia', NULL),
(98, 'sit', 'Jody', 'Douglas', 'eveniet', 'nostrum', NULL),
(99, 'id', 'Reyes', 'Koch', 'ipsa', 'architecto', NULL),
(100, 'consequatur', 'Courtney', 'Feil', 'architecto', 'rem', NULL),
(101, '11.111.111-1', 'random', 'Random', 'rRandom', '111111111', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `id_modulo` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `nombre_modulo` varchar(250) DEFAULT NULL,
  `posicion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id_modulo`, `id_curso`, `nombre_modulo`, `posicion`) VALUES
(1, 1, 'modulo1', 1),
(2, 1, 'modulo2', 2),
(3, 5, 'modulo1-d', 1),
(4, 5, 'modulo2-d', 2),
(5, 4, 'modulo1-c', 1),
(6, 4, 'modulo2-c', 2),
(7, 3, 'modulo 1', 1),
(8, 3, 'modulo 2', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participa`
--

CREATE TABLE `participa` (
  `id_user` int(11) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `estado_part_act` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `participa`
--

INSERT INTO `participa` (`id_user`, `id_actividad`, `estado_part_act`) VALUES
(1, 1, 'ganador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participan_por_responder`
--

CREATE TABLE `participan_por_responder` (
  `id_user` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `estado_part_preg` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `participan_por_responder`
--

INSERT INTO `participan_por_responder` (`id_user`, `id_pregunta`, `estado_part_preg`) VALUES
(1, 7, 'ganador'),
(1, 9, 'perdedor'),
(1, 10, 'ganador'),
(1, 12, 'perdedor'),
(1, 14, 'ganador'),
(1, 15, 'ganador'),
(1, 16, 'ganador'),
(1, 17, 'ganador'),
(1, 20, 'ganador'),
(1, 21, 'ganador'),
(1, 22, 'ganador'),
(1, 24, 'ganador'),
(1, 25, 'ganador'),
(1, 26, 'ganador'),
(1, 27, 'ganador'),
(1, 30, 'ganador'),
(1, 31, 'perdedor'),
(1, 32, 'ganador'),
(1, 33, 'ganador'),
(1, 34, 'ganador'),
(1, 35, 'ganador'),
(1, 36, 'ganador'),
(1, 37, 'ganador'),
(1, 38, 'ganador'),
(1, 39, 'ganador'),
(1, 40, 'ganador'),
(1, 41, 'ganador'),
(1, 43, 'ganador'),
(1, 44, 'ganador'),
(1, 45, 'ganador'),
(1, 46, 'perdedor'),
(1, 47, 'ganador'),
(1, 48, 'ganador'),
(1, 49, 'ganador'),
(1, 50, 'ganador'),
(1, 51, 'ganador'),
(1, 52, 'ganador'),
(1, 53, 'ganador'),
(1, 54, 'ganador'),
(1, 55, 'ganador'),
(1, 56, 'ganador'),
(1, 57, 'ganador'),
(1, 58, 'ganador'),
(1, 59, 'ganador'),
(1, 60, 'ganador'),
(1, 61, 'ganador'),
(1, 62, 'ganador'),
(2, 8, 'ganador'),
(2, 9, 'ganador'),
(2, 10, 'noSeleccionado'),
(2, 12, 'perdedor'),
(2, 14, 'perdedor'),
(2, 15, 'perdedor'),
(2, 16, 'perdedor'),
(2, 17, 'perdedor'),
(2, 18, 'perdedor'),
(2, 19, 'noSeleccionado'),
(2, 20, 'perdedor'),
(2, 21, 'perdedor'),
(2, 22, 'perdedor'),
(2, 23, 'perdedor'),
(2, 24, 'perdedor'),
(2, 25, 'perdedor'),
(2, 26, 'perdedor'),
(2, 27, 'perdedor'),
(2, 30, 'perdedor'),
(2, 31, 'perdedor'),
(2, 32, 'perdedor'),
(2, 33, 'ganador'),
(2, 34, 'ganador'),
(2, 35, 'perdedor'),
(2, 36, 'ganador'),
(2, 37, 'perdedor'),
(2, 38, 'ganador'),
(2, 39, 'ganador'),
(2, 40, 'ganador'),
(2, 41, 'ganador'),
(2, 43, 'ganador'),
(2, 44, 'ganador'),
(2, 45, 'ganador'),
(2, 46, 'perdedor'),
(2, 47, 'ganador'),
(2, 48, 'ganador'),
(2, 49, 'ganador'),
(2, 50, 'ganador'),
(2, 51, 'ganador'),
(2, 52, 'ganador'),
(2, 59, 'ganador'),
(2, 60, 'ganador'),
(2, 61, 'ganador'),
(2, 62, 'ganador'),
(2, 64, 'perdedor'),
(3, 1, 'ganador'),
(4, 59, 'ganador'),
(4, 60, 'ganador'),
(4, 61, 'ganador'),
(4, 62, 'ganador'),
(4, 65, 'ganador'),
(4, 66, 'perdedor'),
(5, 9, 'ganador'),
(5, 32, 'ganador'),
(8, 25, 'ganador'),
(8, 26, 'ganador'),
(8, 27, 'ganador'),
(11, 32, 'ganador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pertenece`
--

CREATE TABLE `pertenece` (
  `id_user` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `puntos` int(11) NOT NULL,
  `errores` int(11) NOT NULL,
  `id_ult_equipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pertenece`
--

INSERT INTO `pertenece` (`id_user`, `id_curso`, `puntos`, `errores`, `id_ult_equipo`) VALUES
(1, 1, 0, 0, NULL),
(1, 2, 0, 0, NULL),
(1, 3, 0, 0, NULL),
(1, 5, 0, 0, NULL),
(2, 1, 0, 0, NULL),
(2, 3, 0, 0, NULL),
(2, 4, 0, 0, NULL),
(3, 1, 0, 0, NULL),
(3, 5, 0, 0, NULL),
(4, 1, 2, 0, NULL),
(4, 4, 0, 0, NULL),
(5, 1, 0, 0, NULL),
(5, 2, 0, 0, NULL),
(5, 3, 0, 0, NULL),
(6, 1, 0, 0, NULL),
(7, 1, 0, 0, NULL),
(8, 1, 0, 0, NULL),
(9, 1, 0, 0, NULL),
(10, 1, 0, 0, NULL),
(11, 1, 0, 0, NULL),
(11, 2, 0, 0, NULL),
(11, 3, 0, 0, NULL),
(101, 2, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id_pregunta` int(11) NOT NULL,
  `id_clase` int(11) DEFAULT NULL,
  `id_b_pregunta` int(11) DEFAULT NULL,
  `id_curso` int(11) NOT NULL,
  `estado_pregunta` varchar(50) DEFAULT NULL,
  `pregunta` varchar(1024) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id_pregunta`, `id_clase`, `id_b_pregunta`, `id_curso`, `estado_pregunta`, `pregunta`) VALUES
(1, 1, NULL, 1, 'realizada', 'pregunta1?'),
(2, 1, NULL, 1, 'sin_realizar', 'pregunta2?'),
(3, 1, NULL, 1, 'sin_realizar', 'pregunta3?'),
(4, 1, NULL, 1, 'sin_realizar', 'pregunta4?'),
(5, 1, 1, 1, 'realizada', 'pregunta_biblio1'),
(6, 3, 2, 1, 'realizada', 'pregunta_biblio2'),
(7, 4, NULL, 1, 'realizada', 'pregunta_biblio11'),
(8, 5, NULL, 1, 'realizada', 'pregunta_prueba'),
(9, 6, 3, 1, 'realizada', 'pregunta_biblio3'),
(10, 7, NULL, 1, 'realizada', 'pregunta_creada_clase6'),
(12, NULL, NULL, 1, 'realizada', 'pregunta_clase7'),
(13, NULL, NULL, 1, 'realizada', 'pregunta_clase7'),
(14, 10, NULL, 1, 'realizada', 'pregunta_clase7'),
(15, 10, NULL, 1, 'realizada', 'pregunta_clase8'),
(16, 10, NULL, 1, 'realizada', 'pregunta_clase7_2'),
(17, 10, NULL, 1, 'realizada', 'pregunta_clase7_3'),
(18, 10, NULL, 1, 'realizada', 'pregunta_clase7_4'),
(19, 10, NULL, 1, 'realizada', 'pregunta_clase7_5'),
(20, 10, NULL, 1, 'realizada', 'pregunta_clase7_6'),
(21, 10, NULL, 1, 'realizada', 'pregunta_clase7_7'),
(22, 10, NULL, 1, 'realizada', 'pregunta_clase7_8'),
(23, NULL, NULL, 1, 'realizada', 'pregunta_clase7_9'),
(24, 10, NULL, 1, 'realizada', 'pregunta_clase7_91'),
(25, 10, NULL, 1, 'realizada', 'pregunta_clase7_92'),
(26, 10, NULL, 1, 'realizada', 'pregunta_clase7_93'),
(27, 10, NULL, 1, 'realizada', 'pregunta_clase7_94'),
(28, NULL, NULL, 1, 'sin_realizar', 'pc_8'),
(29, NULL, NULL, 1, 'sin_realizar', 'asd1'),
(30, 14, NULL, 1, 'realizada', 'pregasdasd'),
(31, 15, NULL, 1, 'realizada', 'pregkasldjas'),
(32, 17, 1, 3, 'realizada', 'pregunta_biblio1'),
(33, 18, NULL, 1, 'realizada', 'pregunta_clase_prueba_1'),
(34, NULL, NULL, 1, 'realizada', 'p1'),
(35, NULL, NULL, 1, 'realizada', 'p2'),
(36, NULL, NULL, 1, 'realizada', 'p3'),
(37, NULL, NULL, 1, 'realizada', 'p4'),
(38, NULL, NULL, 1, 'realizada', 'p5'),
(39, NULL, NULL, 1, 'realizada', 'p6'),
(40, NULL, NULL, 1, 'realizada', 'p7'),
(41, NULL, NULL, 1, 'realizada', 'p8'),
(42, NULL, NULL, 1, 'realizada', 'p9'),
(43, NULL, NULL, 1, 'realizada', 'p9'),
(44, NULL, NULL, 1, 'realizada', 'p10'),
(45, NULL, NULL, 1, 'realizada', 'p11'),
(46, NULL, NULL, 1, 'realizada', 'p12'),
(47, 20, NULL, 1, 'realizada', 'p1'),
(48, 20, NULL, 1, 'realizada', 'p2'),
(49, 20, NULL, 1, 'realizada', 'p3'),
(50, 20, NULL, 1, 'realizada', 'p4'),
(51, 20, NULL, 1, 'realizada', 'p5'),
(52, 20, NULL, 1, 'realizada', 'p6'),
(53, 20, NULL, 1, 'realizada', 'p7'),
(54, 20, NULL, 1, 'realizada', 'p8'),
(55, 20, NULL, 1, 'realizada', 'p9'),
(56, 20, NULL, 1, 'realizada', 'p10'),
(57, 20, NULL, 1, 'realizada', 'p11'),
(58, 20, NULL, 1, 'realizada', 'p12'),
(59, 21, NULL, 1, 'realizada', 'p1'),
(60, 21, NULL, 1, 'realizada', 'p2'),
(61, 21, NULL, 1, 'realizada', 'p3'),
(62, 21, NULL, 1, 'realizada', 'p4'),
(63, 21, NULL, 1, 'realizada', 'p5'),
(64, 21, NULL, 1, 'realizada', 'p6'),
(65, 22, NULL, 1, 'realizada', 'p11'),
(66, 22, NULL, 1, 'realizada', 'p12'),
(67, 22, NULL, 1, 'realizada', 'p13'),
(68, 22, NULL, 1, 'sin_realizar', 'p14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor`
--

CREATE TABLE `profesor` (
  `id_user` int(11) NOT NULL,
  `nombre` varchar(250) DEFAULT NULL,
  `apellido` varchar(250) DEFAULT NULL,
  `usuario` varchar(250) NOT NULL,
  `clave` varchar(250) NOT NULL,
  `token` varchar(129) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesor`
--

INSERT INTO `profesor` (`id_user`, `nombre`, `apellido`, `usuario`, `clave`, `token`) VALUES
(1, 'profe1', 'pApellido1', 'testProfe', 'test', '6ef4a64e0fbb3e37c57a5e5275d04c2e9ca67f38000f6b503979ddda74ee02e3605554d321a73dad40952d090b807810485e943ea3eae46423557b2e3a54ccf0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tema`
--

CREATE TABLE `tema` (
  `id_tema` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `id_topico` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tema`
--

INSERT INTO `tema` (`id_tema`, `nombre`, `id_topico`) VALUES
(1, 'tema1', 1),
(3, 'tema11', 2),
(5, 'tema111', 3),
(2, 'tema2', 1),
(4, 'tema22', 2),
(6, 'tema222', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `topico`
--

CREATE TABLE `topico` (
  `id_topico` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `id_asignatura` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `topico`
--

INSERT INTO `topico` (`id_topico`, `nombre`, `id_asignatura`) VALUES
(1, 'topico1', 1),
(2, 'topico2', 1),
(3, 'topico3', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `fk_se_realizan` (`id_clase`),
  ADD KEY `fk_tiene` (`id_curso`);

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_user`);

--
-- Indices de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD PRIMARY KEY (`id_asignatura`);

--
-- Indices de la tabla `biblioteca_preguntas`
--
ALTER TABLE `biblioteca_preguntas`
  ADD PRIMARY KEY (`id_b_pregunta`),
  ADD KEY `fk_disponible` (`id_asignatura`),
  ADD KEY `fk_pertenece_a` (`id_tema`);

--
-- Indices de la tabla `calendario`
--
ALTER TABLE `calendario`
  ADD PRIMARY KEY (`id_calendario`,`ano`,`semestre`);

--
-- Indices de la tabla `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `fk_contiene` (`id_modulo`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`),
  ADD KEY `fk_dicta` (`id_calendario`,`ano`,`semestre`),
  ADD KEY `fk_instancia` (`id_asignatura`),
  ADD KEY `fk_realiza` (`id_user`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`id_equipo`),
  ADD KEY `fkEquipoCurso` (`id_curso`);

--
-- Indices de la tabla `equipo_alumnos`
--
ALTER TABLE `equipo_alumnos`
  ADD PRIMARY KEY (`id_equipo`,`id_user`),
  ADD KEY `fk_EquipoAlumnosIDeq` (`id_equipo`) USING BTREE,
  ADD KEY `fk_EquipoAlumnosIDuser` (`id_user`) USING BTREE;

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `unique_usuario` (`usuario`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id_modulo`),
  ADD KEY `fk_se_compone` (`id_curso`);

--
-- Indices de la tabla `participa`
--
ALTER TABLE `participa`
  ADD PRIMARY KEY (`id_user`,`id_actividad`),
  ADD KEY `fk_participa2` (`id_actividad`);

--
-- Indices de la tabla `participan_por_responder`
--
ALTER TABLE `participan_por_responder`
  ADD PRIMARY KEY (`id_user`,`id_pregunta`),
  ADD KEY `fk_participan_por_responder2` (`id_pregunta`);

--
-- Indices de la tabla `pertenece`
--
ALTER TABLE `pertenece`
  ADD PRIMARY KEY (`id_user`,`id_curso`),
  ADD KEY `fk_pertenece2` (`id_curso`),
  ADD KEY `fk_ult_equipo` (`id_ult_equipo`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `fk_instancia_pregunta` (`id_b_pregunta`),
  ADD KEY `fk_se_asocia` (`id_curso`),
  ADD KEY `fk_se_hacen` (`id_clase`);

--
-- Indices de la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `unique_usuario` (`usuario`);

--
-- Indices de la tabla `tema`
--
ALTER TABLE `tema`
  ADD PRIMARY KEY (`id_tema`),
  ADD UNIQUE KEY `unique_nombre` (`nombre`,`id_topico`),
  ADD KEY `fk_pertenece_a2` (`id_topico`);

--
-- Indices de la tabla `topico`
--
ALTER TABLE `topico`
  ADD PRIMARY KEY (`id_topico`),
  ADD UNIQUE KEY `unique_nombre` (`nombre`,`id_asignatura`),
  ADD KEY `fk_pertenece_a3` (`id_asignatura`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  MODIFY `id_asignatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `biblioteca_preguntas`
--
ALTER TABLE `biblioteca_preguntas`
  MODIFY `id_b_pregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `calendario`
--
ALTER TABLE `calendario`
  MODIFY `id_calendario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `clase`
--
ALTER TABLE `clase`
  MODIFY `id_clase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id_pregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `profesor`
--
ALTER TABLE `profesor`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tema`
--
ALTER TABLE `tema`
  MODIFY `id_tema` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `topico`
--
ALTER TABLE `topico`
  MODIFY `id_topico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD CONSTRAINT `fk_se_realizan` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`),
  ADD CONSTRAINT `fk_tiene` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`);

--
-- Filtros para la tabla `biblioteca_preguntas`
--
ALTER TABLE `biblioteca_preguntas`
  ADD CONSTRAINT `fk_disponible` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`),
  ADD CONSTRAINT `fk_pertenece_a` FOREIGN KEY (`id_tema`) REFERENCES `tema` (`id_tema`);

--
-- Filtros para la tabla `clase`
--
ALTER TABLE `clase`
  ADD CONSTRAINT `fk_contiene` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`);

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `fk_dicta` FOREIGN KEY (`id_calendario`,`ano`,`semestre`) REFERENCES `calendario` (`id_calendario`, `ano`, `semestre`),
  ADD CONSTRAINT `fk_instancia` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`),
  ADD CONSTRAINT `fk_realiza` FOREIGN KEY (`id_user`) REFERENCES `profesor` (`id_user`);

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `fkEquipoCurso` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`);

--
-- Filtros para la tabla `equipo_alumnos`
--
ALTER TABLE `equipo_alumnos`
  ADD CONSTRAINT `fkEquipoIntegrantesIDeq` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`),
  ADD CONSTRAINT `fkEquipoIntegrantesIDuser` FOREIGN KEY (`id_user`) REFERENCES `estudiante` (`id_user`);

--
-- Filtros para la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD CONSTRAINT `fk_se_compone` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`);

--
-- Filtros para la tabla `participa`
--
ALTER TABLE `participa`
  ADD CONSTRAINT `fk_participa` FOREIGN KEY (`id_user`) REFERENCES `estudiante` (`id_user`),
  ADD CONSTRAINT `fk_participa2` FOREIGN KEY (`id_actividad`) REFERENCES `actividad` (`id_actividad`);

--
-- Filtros para la tabla `participan_por_responder`
--
ALTER TABLE `participan_por_responder`
  ADD CONSTRAINT `fk_participan_por_responder` FOREIGN KEY (`id_user`) REFERENCES `estudiante` (`id_user`),
  ADD CONSTRAINT `fk_participan_por_responder2` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id_pregunta`);

--
-- Filtros para la tabla `pertenece`
--
ALTER TABLE `pertenece`
  ADD CONSTRAINT `fk_pertenece` FOREIGN KEY (`id_user`) REFERENCES `estudiante` (`id_user`),
  ADD CONSTRAINT `fk_pertenece2` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`),
  ADD CONSTRAINT `fk_ult_equipo` FOREIGN KEY (`id_ult_equipo`) REFERENCES `equipo` (`id_equipo`);

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `fk_instancia_pregunta` FOREIGN KEY (`id_b_pregunta`) REFERENCES `biblioteca_preguntas` (`id_b_pregunta`),
  ADD CONSTRAINT `fk_se_asocia` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`),
  ADD CONSTRAINT `fk_se_hacen` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`);

--
-- Filtros para la tabla `tema`
--
ALTER TABLE `tema`
  ADD CONSTRAINT `fk_pertenece_a2` FOREIGN KEY (`id_topico`) REFERENCES `topico` (`id_topico`) ON DELETE CASCADE;

--
-- Filtros para la tabla `topico`
--
ALTER TABLE `topico`
  ADD CONSTRAINT `fk_pertenece_a3` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
