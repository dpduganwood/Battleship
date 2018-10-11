-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema Battletracks_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Battletracks_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Battletracks_db` DEFAULT CHARACTER SET utf8 ;
USE `Battletracks_db` ;

-- -----------------------------------------------------
-- Table `Battletracks_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Battletracks_db`.`users` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` TEXT NOT NULL,
  `displayName` TEXT NOT NULL,
  `firstName` TEXT NOT NULL,
  `lastName` TEXT NOT NULL,
  `sp_wins` INT(11) NOT NULL,
  `mp_wins` INT(11) NOT NULL,
  `sp_losses` INT(11) NOT NULL,
  `mp_losses` INT(11) NOT NULL,
  `hits` INT(11) NOT NULL,
  `misses` INT(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
