-- phpMyAdmin SQL Dump
-- version 2.11.9.4
-- http://www.phpmyadmin.net
--
-- Host: oniddb
-- Generation Time: Nov 28, 2017 at 07:37 PM
-- Server version: 5.5.55
-- PHP Version: 5.2.6-1+lenny16

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `heinemam-db`
--

-- --------------------------------------------------------

-- Drop all tables
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `lectures`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `users-courses`;
DROP TABLE IF EXISTS `users-lectures`;
DROP TABLE IF EXISTS `users-projects`;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `courses`
--

-- --------------------------------------------------------

--
-- Table structure for table `lectures`
--

CREATE TABLE IF NOT EXISTS `lectures` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `youtubeURL` varchar(255) NOT NULL,
  `courseID` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courseID` (`courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lectures`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `courseID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_ibfk_1_idx` (`courseID`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(10) UNSIGNED unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` binary(60) NOT NULL,
  `activeCourse` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `users_ibfk_1` (`activeCourse`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`activeCourse`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `users_courses`
--

CREATE TABLE `users_courses` (
  `courseID` int(10) unsigned NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `isEnrolled` tinyint(1) NOT NULL,
  UNIQUE KEY `user_course` (`courseID`,`userID`),
  KEY `users_courses_ibfk_1_idx` (`courseID`),
  KEY `users_courses_ibfk_2_idx` (`userID`),
  CONSTRAINT `users_courses_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_courses_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_courses`
--

-- --------------------------------------------------------

--
-- Table structure for table `users_lectures`
--

CREATE TABLE `users_lectures` (
  `userID` int(10) unsigned NOT NULL,
  `lectureID` int(10) unsigned NOT NULL,
  `isWatched` tinyint(1) NOT NULL,
  UNIQUE KEY `user_lecture` (`userID`,`lectureID`),
  KEY `users_lectures_ibfk_1_idx` (`userID`),
  KEY `users_lectures_ibfk_2_idx` (`lectureID`),
  CONSTRAINT `users_lectures_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `users_lectures_ibfk_2` FOREIGN KEY (`lectureID`) REFERENCES `lectures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_lectures`
--

-- --------------------------------------------------------

--
-- Table structure for table `users_projects`
--

CREATE TABLE `users_projects` (
  `userID` int(10) unsigned NOT NULL,
  `projectID` int(10) unsigned NOT NULL,
  `isSubmitted` tinyint(1) NOT NULL,
  `grade` float NOT NULL,
  UNIQUE KEY `user_project` (`userID`,`projectID`),
  KEY `users_projects_ibfk_1_idx` (`userID`),
  KEY `users_projects_ibfk_2_idx` (`projectID`),
  CONSTRAINT `users_projects_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `users_projects_ibfk_2` FOREIGN KEY (`projectID`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_projects`
--