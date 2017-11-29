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

--
-- Table structure for table `Courses`
--

CREATE TABLE IF NOT EXISTS `Courses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Courses`
--


-- --------------------------------------------------------

--
-- Table structure for table `Lectures`
--

CREATE TABLE IF NOT EXISTS `Lectures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `youtubeURL` varchar(255) NOT NULL,
  `courseID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courseID` (`courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `Lectures`
--


-- --------------------------------------------------------

--
-- Table structure for table `Projects`
--

CREATE TABLE IF NOT EXISTS `Projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `courseID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courseID` (`courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `Projects`
--


-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--


-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` binary(60) NOT NULL,
  `activeCourse` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `User`
--


-- --------------------------------------------------------

--
-- Table structure for table `Users_Course`
--

CREATE TABLE IF NOT EXISTS `Users_Course` (
  `courseID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `isEnrolled` tinyint(1) NOT NULL,
  KEY `courseID` (`courseID`,`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users_Course`
--


-- --------------------------------------------------------

--
-- Table structure for table `Users_Lectures`
--

CREATE TABLE IF NOT EXISTS `Users_Lectures` (
  `userID` int(11) DEFAULT NULL,
  `lectureID` int(11) DEFAULT NULL,
  `isWatched` tinyint(1) NOT NULL,
  KEY `UserID` (`userID`),
  KEY `LectureID` (`lectureID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users_Lectures`
--


-- --------------------------------------------------------

--
-- Table structure for table `Users_Project`
--

CREATE TABLE IF NOT EXISTS `Users_Project` (
  `userID` int(3) unsigned NOT NULL,
  `projectID` int(11) unsigned NOT NULL,
  `isSubmitted` tinyint(1) NOT NULL,
  `grade` float NOT NULL,
  KEY `userID` (`userID`),
  KEY `projectID` (`projectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users_Project`
--

